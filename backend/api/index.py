import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

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
        path_params = event.get('pathParams', {})
        driver_id = path_params.get('id')
        
        if not driver_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Driver ID is required'}),
                'isBase64Encoded': False
            }
        
        body = json.loads(event.get('body', '{}'))
        
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

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Единая API для всех справочников: водители, автомобили, контрагенты, заказы
    Маршруты:
    - /drivers - управление водителями
    - /vehicles - управление автомобилями
    - /counterparties - управление контрагентами
    - /orders - управление заказами
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
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if resource == 'drivers':
            return handle_drivers(method, event, conn, cursor)
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