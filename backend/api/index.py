import json
import os
import base64
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
import boto3
import urllib.request
import urllib.parse

_db_connection = None

def get_db_connection():
    global _db_connection
    if _db_connection is None or _db_connection.closed:
        _db_connection = psycopg2.connect(os.environ['DATABASE_URL'])
    return _db_connection

def get_s3_client():
    return boto3.client('s3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
    )

def serialize_dates(obj):
    if obj is None:
        return None
    if hasattr(obj, 'isoformat'):
        return obj.isoformat()
    return obj

def dict_to_json(data):
    if isinstance(data, dict):
        return {k: serialize_dates(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [dict_to_json(item) for item in data]
    return serialize_dates(data)

def dadata_request(url: str, query: str) -> Dict[str, Any]:
    api_key = os.environ.get('DADATA_API_KEY', '')
    secret_key = os.environ.get('DADATA_SECRET_KEY', '')
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Token {api_key}',
        'X-Secret': secret_key
    }
    
    data = json.dumps({'query': query}).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers=headers)
    
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode('utf-8'))

def handle_dadata(method: str, event: Dict[str, Any]) -> Dict[str, Any]:
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body = json.loads(event.get('body', '{}'))
    search_type = body.get('type')
    query = body.get('query', '')
    
    if not query:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Query is required'}),
            'isBase64Encoded': False
        }
    
    if search_type == 'inn':
        result = dadata_request('https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party', query)
        
        if result.get('suggestions'):
            org = result['suggestions'][0]['data']
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'company_name': org.get('name', {}).get('short_with_opf', ''),
                    'inn': org.get('inn', ''),
                    'kpp': org.get('kpp', ''),
                    'ogrn': org.get('ogrn', ''),
                    'legal_address': org.get('address', {}).get('value', ''),
                    'director_name': org.get('management', {}).get('name', '')
                }),
                'isBase64Encoded': False
            }
    
    elif search_type == 'bik':
        result = dadata_request('https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/bank', query)
        
        if result.get('suggestions'):
            bank = result['suggestions'][0]['data']
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'bank_name': bank.get('name', {}).get('payment', ''),
                    'bik': bank.get('bik', ''),
                    'corr_account': bank.get('correspondent_account', '')
                }),
                'isBase64Encoded': False
            }
    
    return {
        'statusCode': 404,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Not found'}),
        'isBase64Encoded': False
    }

def handle_drivers(method: str, event: Dict[str, Any], conn, cursor) -> Dict[str, Any]:
    if method == 'GET':
        cursor.execute('''
            SELECT id, full_name, phone, 
                   passport_series, passport_number, passport_issued_by, passport_issued_date,
                   license_series, license_number, license_category,
                   created_at, updated_at
            FROM drivers 
            ORDER BY full_name
        ''')
        drivers = cursor.fetchall()
        result = [dict_to_json(dict(d)) for d in drivers]
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'drivers': result}),
            'isBase64Encoded': False
        }
    
    elif method == 'POST':
        body = json.loads(event.get('body', '{}'))
        
        cursor.execute('''
            INSERT INTO drivers 
            (full_name, phone, passport_series, passport_number, passport_issued_by, 
             passport_issued_date, license_series, license_number, license_category)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, full_name, phone, passport_series, passport_number, 
                      passport_issued_by, passport_issued_date, license_series, 
                      license_number, license_category, created_at, updated_at
        ''', (
            body.get('full_name'),
            body.get('phone'),
            body.get('passport_series'),
            body.get('passport_number'),
            body.get('passport_issued_by'),
            body.get('passport_issued_date'),
            body.get('license_series'),
            body.get('license_number'),
            body.get('license_category')
        ))
        
        driver = cursor.fetchone()
        conn.commit()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'driver': dict_to_json(dict(driver))}),
            'isBase64Encoded': False
        }
    
    elif method == 'PUT':
        body = json.loads(event.get('body', '{}'))
        driver_id = body.get('id')
        
        if not driver_id:
            path_params = event.get('pathParams', {})
            driver_id = path_params.get('id')
        
        if not driver_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Driver ID is required'}),
                'isBase64Encoded': False
            }
        
        cursor.execute('''
            UPDATE drivers 
            SET full_name = %s, phone = %s, 
                passport_series = %s, passport_number = %s, 
                passport_issued_by = %s, passport_issued_date = %s,
                license_series = %s, license_number = %s, license_category = %s,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING id, full_name, phone, passport_series, passport_number,
                      passport_issued_by, passport_issued_date, license_series,
                      license_number, license_category, created_at, updated_at
        ''', (
            body.get('full_name'),
            body.get('phone'),
            body.get('passport_series'),
            body.get('passport_number'),
            body.get('passport_issued_by'),
            body.get('passport_issued_date'),
            body.get('license_series'),
            body.get('license_number'),
            body.get('license_category'),
            driver_id
        ))
        
        driver = cursor.fetchone()
        conn.commit()
        
        if not driver:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Driver not found'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'driver': dict_to_json(dict(driver))}),
            'isBase64Encoded': False
        }
    
    elif method == 'DELETE':
        body = json.loads(event.get('body', '{}'))
        driver_id = body.get('id')
        
        if not driver_id:
            path_params = event.get('pathParams', {})
            driver_id = path_params.get('id')
        
        if not driver_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Driver ID is required'}),
                'isBase64Encoded': False
            }
        
        cursor.execute('DELETE FROM drivers WHERE id = %s RETURNING id', (driver_id,))
        deleted = cursor.fetchone()
        conn.commit()
        
        if not deleted:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Driver not found'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'message': 'Driver deleted successfully'}),
            'isBase64Encoded': False
        }

def handle_customers(method: str, event: Dict[str, Any], conn, cursor) -> Dict[str, Any]:
    if method == 'GET':
        cursor.execute('''
            SELECT 
                id, company_name, prefix, 
                is_seller, is_buyer, is_carrier,
                inn, kpp, ogrn,
                legal_address, postal_address, actual_address,
                director_name, bank_accounts, delivery_addresses,
                created_at, updated_at
            FROM customers_v2
            ORDER BY company_name
        ''')
        customers = cursor.fetchall()
        result = [dict_to_json(dict(c)) for c in customers]
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'customers': result}),
            'isBase64Encoded': False
        }
    
    elif method == 'POST':
        body = json.loads(event.get('body', '{}'))
        
        bank_accounts_json = json.dumps(body.get('bank_accounts', []))
        delivery_addresses_json = json.dumps(body.get('delivery_addresses', []))
        
        cursor.execute('''
            INSERT INTO customers_v2 
            (company_name, prefix, is_seller, is_buyer, is_carrier, 
             inn, kpp, ogrn, legal_address, postal_address, actual_address, director_name,
             bank_accounts, delivery_addresses)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, company_name, prefix, is_seller, is_buyer, is_carrier,
                      inn, kpp, ogrn, legal_address, postal_address, actual_address,
                      director_name, bank_accounts, delivery_addresses, created_at, updated_at
        ''', (
            body.get('company_name'),
            body.get('prefix'),
            body.get('is_seller', False),
            body.get('is_buyer', False),
            body.get('is_carrier', False),
            body.get('inn'),
            body.get('kpp'),
            body.get('ogrn'),
            body.get('legal_address'),
            body.get('postal_address'),
            body.get('actual_address'),
            body.get('director_name'),
            bank_accounts_json,
            delivery_addresses_json
        ))
        
        customer = cursor.fetchone()
        conn.commit()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'customer': dict_to_json(dict(customer))}),
            'isBase64Encoded': False
        }
    
    elif method == 'PUT':
        body = json.loads(event.get('body', '{}'))
        customer_id = body.get('id')
        
        if not customer_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Customer ID is required'}),
                'isBase64Encoded': False
            }
        
        bank_accounts_json = json.dumps(body.get('bank_accounts', []))
        delivery_addresses_json = json.dumps(body.get('delivery_addresses', []))
        
        cursor.execute('''
            UPDATE customers_v2 
            SET company_name = %s, prefix = %s, 
                is_seller = %s, is_buyer = %s, is_carrier = %s,
                inn = %s, kpp = %s, ogrn = %s,
                legal_address = %s, postal_address = %s, actual_address = %s,
                director_name = %s, bank_accounts = %s, delivery_addresses = %s,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING id, company_name, prefix, is_seller, is_buyer, is_carrier,
                      inn, kpp, ogrn, legal_address, postal_address, actual_address,
                      director_name, bank_accounts, delivery_addresses, created_at, updated_at
        ''', (
            body.get('company_name'),
            body.get('prefix'),
            body.get('is_seller', False),
            body.get('is_buyer', False),
            body.get('is_carrier', False),
            body.get('inn'),
            body.get('kpp'),
            body.get('ogrn'),
            body.get('legal_address'),
            body.get('postal_address'),
            body.get('actual_address'),
            body.get('director_name'),
            bank_accounts_json,
            delivery_addresses_json,
            customer_id
        ))
        
        customer = cursor.fetchone()
        conn.commit()
        
        if not customer:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Customer not found'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'customer': dict_to_json(dict(customer))}),
            'isBase64Encoded': False
        }
    
    elif method == 'DELETE':
        body = json.loads(event.get('body', '{}'))
        customer_id = body.get('id')
        
        if not customer_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Customer ID is required'}),
                'isBase64Encoded': False
            }
        
        cursor.execute('DELETE FROM customers_v2 WHERE id = %s RETURNING id', (customer_id,))
        deleted = cursor.fetchone()
        conn.commit()
        
        if not deleted:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Customer not found'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'message': 'Customer deleted successfully'}),
            'isBase64Encoded': False
        }

def handle_templates(method: str, event: Dict[str, Any], conn, cursor) -> Dict[str, Any]:
    if method == 'GET':
        cursor.execute('''
            SELECT id, name, description, template_type, pdf_url, 
                   fields, pdf_mappings, created_at, updated_at
            FROM pdf_templates
            ORDER BY created_at DESC
        ''')
        templates = cursor.fetchall()
        
        result = []
        for t in templates:
            result.append({
                'id': str(t['id']),
                'name': t['name'],
                'description': t['description'],
                'templateType': t['template_type'],
                'pdfPreviewUrl': t['pdf_url'],
                'fields': t['fields'],
                'pdfMappings': t['pdf_mappings'],
                'createdAt': t['created_at'].strftime('%Y-%m-%d')
            })
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'templates': result}),
            'isBase64Encoded': False
        }
    
    elif method == 'POST':
        body = json.loads(event.get('body', '{}'))
        
        pdf_url = None
        if body.get('pdfBase64'):
            s3 = get_s3_client()
            timestamp = int(os.times().elapsed * 1000)
            file_key = f"templates/template_{timestamp}.pdf"
            pdf_data = base64.b64decode(body['pdfBase64'].split(',')[1] if ',' in body['pdfBase64'] else body['pdfBase64'])
            
            s3.put_object(
                Bucket='files',
                Key=file_key,
                Body=pdf_data,
                ContentType='application/pdf',
                ACL='public-read'
            )
            
            pdf_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{file_key}"
        
        cursor.execute('''
            INSERT INTO pdf_templates 
            (name, description, template_type, pdf_url, fields, pdf_mappings)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id, created_at
        ''', (
            body['name'],
            body.get('description', ''),
            body.get('templateType', 'pdf'),
            pdf_url,
            json.dumps(body.get('fields', [])),
            json.dumps(body.get('pdfMappings', []))
        ))
        
        result_row = cursor.fetchone()
        conn.commit()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'id': str(result_row['id']),
                'createdAt': result_row['created_at'].strftime('%Y-%m-%d')
            }),
            'isBase64Encoded': False
        }
    
    elif method == 'DELETE':
        params = event.get('queryStringParameters', {})
        template_id = params.get('id')
        
        if not template_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Missing id parameter'}),
                'isBase64Encoded': False
            }
        
        cursor.execute('DELETE FROM pdf_templates WHERE id = %s', (int(template_id),))
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }

def handle_vehicles(method: str, event: Dict[str, Any], conn, cursor) -> Dict[str, Any]:
    if method == 'GET':
        cursor.execute('''
            SELECT id, vehicle_name, brand, license_plate, trailer, 
                   body_type, transport_company, driver_id,
                   created_at, updated_at
            FROM vehicles 
            ORDER BY brand
        ''')
        vehicles = cursor.fetchall()
        result = [dict_to_json(dict(v)) for v in vehicles]
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'vehicles': result}),
            'isBase64Encoded': False
        }
    
    elif method == 'POST':
        body = json.loads(event.get('body', '{}'))
        
        vehicle_name = f"{body.get('brand')} {body.get('license_plate')}"
        
        cursor.execute('''
            INSERT INTO vehicles 
            (vehicle_name, brand, license_plate, trailer, body_type, 
             transport_company, driver_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id, vehicle_name, brand, license_plate, trailer, 
                      body_type, transport_company, driver_id,
                      created_at, updated_at
        ''', (
            vehicle_name,
            body.get('brand'),
            body.get('license_plate'),
            body.get('trailer'),
            body.get('body_type'),
            body.get('transport_company'),
            body.get('driver_id')
        ))
        
        vehicle = cursor.fetchone()
        conn.commit()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'vehicle': dict_to_json(dict(vehicle))}),
            'isBase64Encoded': False
        }
    
    elif method == 'PUT':
        body = json.loads(event.get('body', '{}'))
        vehicle_id = body.get('id')
        
        if not vehicle_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Vehicle ID is required'}),
                'isBase64Encoded': False
            }
        
        vehicle_name = f"{body.get('brand')} {body.get('license_plate')}"
        
        cursor.execute('''
            UPDATE vehicles 
            SET vehicle_name = %s, brand = %s, license_plate = %s, 
                trailer = %s, body_type = %s, transport_company = %s, 
                driver_id = %s, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING id, vehicle_name, brand, license_plate, trailer,
                      body_type, transport_company, driver_id,
                      created_at, updated_at
        ''', (
            vehicle_name,
            body.get('brand'),
            body.get('license_plate'),
            body.get('trailer'),
            body.get('body_type'),
            body.get('transport_company'),
            body.get('driver_id'),
            vehicle_id
        ))
        
        vehicle = cursor.fetchone()
        conn.commit()
        
        if not vehicle:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Vehicle not found'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'vehicle': dict_to_json(dict(vehicle))}),
            'isBase64Encoded': False
        }
    
    elif method == 'DELETE':
        body = json.loads(event.get('body', '{}'))
        vehicle_id = body.get('id')
        
        if not vehicle_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Vehicle ID is required'}),
                'isBase64Encoded': False
            }
        
        cursor.execute('DELETE FROM vehicles WHERE id = %s RETURNING id', (vehicle_id,))
        deleted = cursor.fetchone()
        conn.commit()
        
        if not deleted:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Vehicle not found'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'message': 'Vehicle deleted successfully'}),
            'isBase64Encoded': False
        }

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Единая API для всех справочников: водители, автомобили, контрагенты, заказы, шаблоны
    Маршруты:
    - /drivers - управление водителями
    - /vehicles - управление автомобилями
    - /customers - управление контрагентами
    - /templates - управление шаблонами PDF
    '''
    method: str = event.get('httpMethod', 'GET')
    query_params = event.get('queryStringParameters') or {}
    resource = query_params.get('resource', 'drivers')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if resource == 'dadata':
        return handle_dadata(method, event)
    
    if resource == 'pdf-recognize':
        if method != 'POST':
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
        
        default_fields = {
            'order_number': 'Номер заказа',
            'order_date': 'Дата заказа',
            'customer_name': 'Заказчик',
            'customer_inn': 'ИНН заказчика',
            'carrier_name': 'Перевозчик',
            'carrier_inn': 'ИНН перевозчика',
            'cargo_name': 'Наименование груза',
            'cargo_weight': 'Вес груза (кг)',
            'cargo_volume': 'Объем груза (м³)',
            'loading_address': 'Адрес погрузки',
            'loading_date': 'Дата погрузки',
            'unloading_address': 'Адрес разгрузки',
            'unloading_date': 'Дата разгрузки',
            'driver_name': 'ФИО водителя',
            'vehicle_number': 'Гос. номер ТС',
            'trailer_number': 'Гос. номер прицепа',
            'amount': 'Стоимость перевозки',
            'payment_terms': 'Условия оплаты'
        }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True, 'data': default_fields}),
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if resource == 'drivers':
            return handle_drivers(method, event, conn, cursor)
        elif resource == 'vehicles':
            return handle_vehicles(method, event, conn, cursor)
        elif resource == 'customers':
            return handle_customers(method, event, conn, cursor)
        elif resource == 'templates':
            return handle_templates(method, event, conn, cursor)
        else:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Resource not found'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    
    finally:
        cursor.close()
        conn.close()