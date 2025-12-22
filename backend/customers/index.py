import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

_db_connection = None

def get_db_connection():
    '''Получить подключение к базе данных'''
    global _db_connection
    if _db_connection is None or _db_connection.closed:
        _db_connection = psycopg2.connect(os.environ['DATABASE_URL'])
    return _db_connection

def serialize_dates(obj):
    '''Сериализация дат в ISO формат'''
    if obj is None:
        return None
    if hasattr(obj, 'isoformat'):
        return obj.isoformat()
    return obj

def dict_to_json(data):
    '''Конвертация dict в JSON с сериализацией дат'''
    if isinstance(data, dict):
        return {k: serialize_dates(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [dict_to_json(item) for item in data]
    return serialize_dates(data)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для управления контрагентами (CRUD операции)
    Поддерживает GET (список), POST (создание), PUT (обновление), DELETE (удаление)
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
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
        
        cursor.close()
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
        cursor.close()
        
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
            cursor.close()
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
        
        if not customer:
            conn.commit()
            cursor.close()
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Customer not found'}),
                'isBase64Encoded': False
            }
        
        conn.commit()
        cursor.close()
        
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
            cursor.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Customer ID is required'}),
                'isBase64Encoded': False
            }
        
        cursor.execute('DELETE FROM customers_v2 WHERE id = %s RETURNING id', (customer_id,))
        deleted = cursor.fetchone()
        
        conn.commit()
        cursor.close()
        
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
    
    cursor.close()
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
