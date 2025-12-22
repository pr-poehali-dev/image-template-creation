import json
import os
from datetime import datetime
from typing import Dict, Any, Optional, List
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Управление справочником водителей: создание, чтение, обновление, удаление
    GET / - получить список всех водителей
    POST / - создать нового водителя
    PUT /{id} - обновить данные водителя
    DELETE /{id} - удалить водителя
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
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
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
            
            result = []
            for driver in drivers:
                driver_dict = dict(driver)
                if driver_dict.get('passport_issued_date'):
                    driver_dict['passport_issued_date'] = driver_dict['passport_issued_date'].isoformat()
                if driver_dict.get('created_at'):
                    driver_dict['created_at'] = driver_dict['created_at'].isoformat()
                if driver_dict.get('updated_at'):
                    driver_dict['updated_at'] = driver_dict['updated_at'].isoformat()
                result.append(driver_dict)
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
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
            
            driver_dict = dict(driver)
            if driver_dict.get('passport_issued_date'):
                driver_dict['passport_issued_date'] = driver_dict['passport_issued_date'].isoformat()
            if driver_dict.get('created_at'):
                driver_dict['created_at'] = driver_dict['created_at'].isoformat()
            if driver_dict.get('updated_at'):
                driver_dict['updated_at'] = driver_dict['updated_at'].isoformat()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'driver': driver_dict}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            path_params = event.get('pathParams', {})
            driver_id = path_params.get('id')
            
            if not driver_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
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
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Driver not found'}),
                    'isBase64Encoded': False
                }
            
            driver_dict = dict(driver)
            if driver_dict.get('passport_issued_date'):
                driver_dict['passport_issued_date'] = driver_dict['passport_issued_date'].isoformat()
            if driver_dict.get('created_at'):
                driver_dict['created_at'] = driver_dict['created_at'].isoformat()
            if driver_dict.get('updated_at'):
                driver_dict['updated_at'] = driver_dict['updated_at'].isoformat()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'driver': driver_dict}),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            path_params = event.get('pathParams', {})
            driver_id = path_params.get('id')
            
            if not driver_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Driver ID is required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute('DELETE FROM drivers WHERE id = %s RETURNING id', (driver_id,))
            deleted = cursor.fetchone()
            conn.commit()
            
            if not deleted:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Driver not found'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': 'Driver deleted successfully'}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    finally:
        cursor.close()
        conn.close()
