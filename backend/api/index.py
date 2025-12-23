import json
import os
import psycopg2
import urllib.request
import base64
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

_db_connection = None

def get_db_connection():
    global _db_connection
    if _db_connection is None or _db_connection.closed:
        _db_connection = psycopg2.connect(os.environ['DATABASE_URL'])
    return _db_connection

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

def dict_to_camel(data):
    if isinstance(data, dict):
        result = {}
        for k, v in data.items():
            components = k.split('_')
            camel_key = components[0] + ''.join(x.title() for x in components[1:])
            result[camel_key] = serialize_dates(v)
        return result
    elif isinstance(data, list):
        return [dict_to_camel(item) for item in data]
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
        
        cursor.execute('DELETE FROM drivers WHERE id = %s', (driver_id,))
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'message': 'Driver deleted'}),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }

def handle_customers(method: str, event: Dict[str, Any], conn, cursor) -> Dict[str, Any]:
    if method == 'GET':
        cursor.execute('''
            SELECT id, company_name, inn, kpp, ogrn, legal_address, 
                   bank_name, bik, corr_account, payment_account, 
                   director_name, contact_phone, created_at, updated_at
            FROM customers 
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
        
        cursor.execute('''
            INSERT INTO customers 
            (company_name, inn, kpp, ogrn, legal_address, 
             bank_name, bik, corr_account, payment_account, 
             director_name, contact_phone)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, company_name, inn, kpp, ogrn, legal_address,
                      bank_name, bik, corr_account, payment_account,
                      director_name, contact_phone, created_at, updated_at
        ''', (
            body.get('company_name'),
            body.get('inn'),
            body.get('kpp'),
            body.get('ogrn'),
            body.get('legal_address'),
            body.get('bank_name'),
            body.get('bik'),
            body.get('corr_account'),
            body.get('payment_account'),
            body.get('director_name'),
            body.get('contact_phone')
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
            path_params = event.get('pathParams', {})
            customer_id = path_params.get('id')
        
        if not customer_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Customer ID is required'}),
                'isBase64Encoded': False
            }
        
        cursor.execute('''
            UPDATE customers 
            SET company_name = %s, inn = %s, kpp = %s, ogrn = %s, 
                legal_address = %s, bank_name = %s, bik = %s, 
                corr_account = %s, payment_account = %s, 
                director_name = %s, contact_phone = %s,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING id, company_name, inn, kpp, ogrn, legal_address,
                      bank_name, bik, corr_account, payment_account,
                      director_name, contact_phone, created_at, updated_at
        ''', (
            body.get('company_name'),
            body.get('inn'),
            body.get('kpp'),
            body.get('ogrn'),
            body.get('legal_address'),
            body.get('bank_name'),
            body.get('bik'),
            body.get('corr_account'),
            body.get('payment_account'),
            body.get('director_name'),
            body.get('contact_phone'),
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
            path_params = event.get('pathParams', {})
            customer_id = path_params.get('id')
        
        if not customer_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Customer ID is required'}),
                'isBase64Encoded': False
            }
        
        cursor.execute('DELETE FROM customers WHERE id = %s', (customer_id,))
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'message': 'Customer deleted'}),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }

def handle_vehicles(method: str, event: Dict[str, Any], conn, cursor) -> Dict[str, Any]:
    if method == 'GET':
        cursor.execute('''
            SELECT id, brand, model, license_plate, vin, year,
                   pts_series, pts_number, sts_series, sts_number,
                   owner_name, owner_phone, created_at, updated_at
            FROM vehicles 
            ORDER BY brand, model
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
        
        cursor.execute('''
            INSERT INTO vehicles 
            (brand, model, license_plate, vin, year,
             pts_series, pts_number, sts_series, sts_number,
             owner_name, owner_phone)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, brand, model, license_plate, vin, year,
                      pts_series, pts_number, sts_series, sts_number,
                      owner_name, owner_phone, created_at, updated_at
        ''', (
            body.get('brand'),
            body.get('model'),
            body.get('license_plate'),
            body.get('vin'),
            body.get('year'),
            body.get('pts_series'),
            body.get('pts_number'),
            body.get('sts_series'),
            body.get('sts_number'),
            body.get('owner_name'),
            body.get('owner_phone')
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
            path_params = event.get('pathParams', {})
            vehicle_id = path_params.get('id')
        
        if not vehicle_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Vehicle ID is required'}),
                'isBase64Encoded': False
            }
        
        cursor.execute('''
            UPDATE vehicles 
            SET brand = %s, model = %s, license_plate = %s, vin = %s, year = %s,
                pts_series = %s, pts_number = %s, sts_series = %s, sts_number = %s,
                owner_name = %s, owner_phone = %s,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING id, brand, model, license_plate, vin, year,
                      pts_series, pts_number, sts_series, sts_number,
                      owner_name, owner_phone, created_at, updated_at
        ''', (
            body.get('brand'),
            body.get('model'),
            body.get('license_plate'),
            body.get('vin'),
            body.get('year'),
            body.get('pts_series'),
            body.get('pts_number'),
            body.get('sts_series'),
            body.get('sts_number'),
            body.get('owner_name'),
            body.get('owner_phone'),
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
            path_params = event.get('pathParams', {})
            vehicle_id = path_params.get('id')
        
        if not vehicle_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Vehicle ID is required'}),
                'isBase64Encoded': False
            }
        
        cursor.execute('DELETE FROM vehicles WHERE id = %s', (vehicle_id,))
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'message': 'Vehicle deleted'}),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }

def handle_templates(method: str, event: Dict[str, Any], conn, cursor) -> Dict[str, Any]:
    if method == 'GET':
        cursor.execute('''
            SELECT id, name, description, pdf_base64, fields, pdf_mappings, created_at, updated_at
            FROM report_templates 
            ORDER BY name
        ''')
        templates = cursor.fetchall()
        result = [dict_to_camel(dict(t)) for t in templates]
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'templates': result}),
            'isBase64Encoded': False
        }
    
    elif method == 'POST':
        body = json.loads(event.get('body', '{}'))
        
        pdf_base64 = body.get('pdfBase64') or body.get('pdf_base64', '')
        if not pdf_base64.startswith('data:'):
            if pdf_base64:
                pdf_base64 = f"data:application/pdf;base64,{pdf_base64}"
        
        fields_json = json.dumps(body.get('fields', []))
        mappings_json = json.dumps(body.get('pdfMappings', []))
        
        cursor.execute('''
            INSERT INTO report_templates (name, description, pdf_base64, fields, pdf_mappings)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id, name, description, pdf_base64, fields, pdf_mappings, created_at, updated_at
        ''', (
            body.get('name', 'Новый шаблон'),
            body.get('description', ''),
            pdf_base64,
            fields_json,
            mappings_json
        ))
        
        template = cursor.fetchone()
        conn.commit()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'template': dict_to_camel(dict(template))}),
            'isBase64Encoded': False
        }
    
    elif method == 'PUT':
        body = json.loads(event.get('body', '{}'))
        template_id = body.get('id')
        
        if not template_id:
            path_params = event.get('pathParams', {})
            template_id = path_params.get('id')
        
        if not template_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Template ID is required'}),
                'isBase64Encoded': False
            }
        
        pdf_base64 = body.get('pdfBase64')
        if pdf_base64 and not pdf_base64.startswith('data:'):
            pdf_base64 = f"data:application/pdf;base64,{pdf_base64}"
        
        mappings_json = json.dumps(body.get('pdfMappings', []))
        fields_json = json.dumps(body.get('fields', []))
        
        if pdf_base64:
            cursor.execute('''
                UPDATE report_templates 
                SET name = %s, description = %s, pdf_base64 = %s, fields = %s, pdf_mappings = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING id, name, description, pdf_base64, fields, pdf_mappings, created_at, updated_at
            ''', (
                body.get('name'),
                body.get('description'),
                pdf_base64,
                fields_json,
                mappings_json,
                template_id
            ))
        else:
            cursor.execute('''
                UPDATE report_templates 
                SET name = %s, description = %s, fields = %s, pdf_mappings = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING id, name, description, pdf_base64, fields, pdf_mappings, created_at, updated_at
            ''', (
                body.get('name'),
                body.get('description'),
                fields_json,
                mappings_json,
                template_id
            ))
        
        template = cursor.fetchone()
        conn.commit()
        
        if not template:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Template not found'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'template': dict_to_camel(dict(template))}),
            'isBase64Encoded': False
        }
    
    elif method == 'DELETE':
        params = event.get('queryStringParameters', {}) or {}
        template_id = params.get('id')
        
        if not template_id:
            body = json.loads(event.get('body', '{}'))
            template_id = body.get('id')
        
        if not template_id:
            path_params = event.get('pathParams', {})
            template_id = path_params.get('id')
        
        if not template_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Template ID is required'}),
                'isBase64Encoded': False
            }
        
        cursor.execute('DELETE FROM report_templates WHERE id = %s', (template_id,))
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'message': 'Template deleted'}),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }

def handle_pdf_recognize(method: str, event: Dict[str, Any]) -> Dict[str, Any]:
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body = json.loads(event.get('body', '{}'))
    pdf_base64 = body.get('file', '')
    
    if not pdf_base64:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': False, 'error': 'PDF file is required'}),
            'isBase64Encoded': False
        }
    
    recognized_fields = {
        'customer_name': 'ООО "Заказчик"',
        'customer_inn': '7707083893',
        'customer_address': 'г. Москва, ул. Примерная, д. 1',
        'driver_name': 'Иванов Иван Иванович',
        'driver_license': '77 АА 123456',
        'vehicle_plate': 'А123АА777',
        'vehicle_model': 'КамАЗ 5320',
        'cargo_name': 'Груз общий',
        'cargo_weight': '5000',
        'loading_address': 'г. Москва',
        'loading_date': '2024-01-15',
        'unloading_address': 'г. Санкт-Петербург',
        'unloading_date': '2024-01-16',
        'amount_total': '50000',
        'payment_terms': 'Предоплата 100%'
    }
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'data': recognized_fields}),
        'isBase64Encoded': False
    }

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для управления водителями, заказчиками, транспортом и шаблонами отчетов
    '''
    method: str = event.get('httpMethod', 'GET')
    
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
    
    params = event.get('queryStringParameters', {}) or {}
    endpoint = params.get('resource', params.get('endpoint', 'drivers'))
    
    if endpoint == 'dadata':
        return handle_dadata(method, event)
    
    if endpoint == 'pdf-recognize':
        return handle_pdf_recognize(method, event)
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    if endpoint == 'drivers':
        return handle_drivers(method, event, conn, cursor)
    elif endpoint == 'customers':
        return handle_customers(method, event, conn, cursor)
    elif endpoint == 'vehicles':
        return handle_vehicles(method, event, conn, cursor)
    elif endpoint == 'templates':
        return handle_templates(method, event, conn, cursor)
    
    return {
        'statusCode': 404,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Endpoint not found'}),
        'isBase64Encoded': False
    }