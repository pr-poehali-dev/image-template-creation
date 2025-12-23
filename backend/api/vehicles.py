import json
from typing import Dict, Any
from db import dict_to_json

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