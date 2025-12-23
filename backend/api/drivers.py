import json
from typing import Dict, Any
from db import dict_to_json

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