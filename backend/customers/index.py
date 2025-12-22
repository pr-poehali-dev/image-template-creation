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
                c.id, c.company_name, c.prefix, 
                c.is_seller, c.is_buyer, c.is_carrier,
                c.inn, c.kpp, c.ogrn,
                c.legal_address, c.postal_address, c.actual_address,
                c.director_name, c.created_at, c.updated_at
            FROM customers c
            ORDER BY c.company_name
        ''')
        customers = cursor.fetchall()
        
        result = []
        for customer in customers:
            customer_dict = dict_to_json(dict(customer))
            
            cursor.execute('''
                SELECT id, bank_name, account_number, bik, corr_account
                FROM customer_bank_accounts
                WHERE customer_id = %s
            ''', (customer['id'],))
            customer_dict['bank_accounts'] = [dict(ba) for ba in cursor.fetchall()]
            
            cursor.execute('''
                SELECT id, name, address, is_main
                FROM customer_delivery_addresses
                WHERE customer_id = %s
            ''', (customer['id'],))
            delivery_addresses = cursor.fetchall()
            
            for addr in delivery_addresses:
                cursor.execute('''
                    SELECT id, contact_name, phone
                    FROM delivery_address_contacts
                    WHERE delivery_address_id = %s
                ''', (addr['id'],))
                addr['contacts'] = [dict(c) for c in cursor.fetchall()]
            
            customer_dict['delivery_addresses'] = [dict(da) for da in delivery_addresses]
            result.append(customer_dict)
        
        cursor.close()
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
            (company_name, prefix, is_seller, is_buyer, is_carrier, 
             inn, kpp, ogrn, legal_address, postal_address, actual_address, director_name)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, company_name, prefix, is_seller, is_buyer, is_carrier,
                      inn, kpp, ogrn, legal_address, postal_address, actual_address,
                      director_name, created_at, updated_at
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
            body.get('director_name')
        ))
        
        customer = cursor.fetchone()
        customer_id = customer['id']
        
        bank_accounts = body.get('bank_accounts', [])
        for ba in bank_accounts:
            cursor.execute('''
                INSERT INTO customer_bank_accounts 
                (customer_id, bank_name, account_number, bik, corr_account)
                VALUES (%s, %s, %s, %s, %s)
            ''', (customer_id, ba.get('bank_name'), ba.get('account_number'), 
                  ba.get('bik'), ba.get('corr_account')))
        
        delivery_addresses = body.get('delivery_addresses', [])
        for da in delivery_addresses:
            cursor.execute('''
                INSERT INTO customer_delivery_addresses 
                (customer_id, name, address, is_main)
                VALUES (%s, %s, %s, %s)
                RETURNING id
            ''', (customer_id, da.get('name'), da.get('address'), da.get('is_main', False)))
            
            address_id = cursor.fetchone()['id']
            
            contacts = da.get('contacts', [])
            for contact in contacts:
                cursor.execute('''
                    INSERT INTO delivery_address_contacts 
                    (delivery_address_id, contact_name, phone)
                    VALUES (%s, %s, %s)
                ''', (address_id, contact.get('contact_name'), contact.get('phone')))
        
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
        
        cursor.execute('''
            UPDATE customers 
            SET company_name = %s, prefix = %s, 
                is_seller = %s, is_buyer = %s, is_carrier = %s,
                inn = %s, kpp = %s, ogrn = %s,
                legal_address = %s, postal_address = %s, actual_address = %s,
                director_name = %s, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING id, company_name, prefix, is_seller, is_buyer, is_carrier,
                      inn, kpp, ogrn, legal_address, postal_address, actual_address,
                      director_name, created_at, updated_at
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
        
        cursor.execute('DELETE FROM customer_bank_accounts WHERE customer_id = %s', (customer_id,))
        cursor.execute('DELETE FROM delivery_address_contacts WHERE delivery_address_id IN (SELECT id FROM customer_delivery_addresses WHERE customer_id = %s)', (customer_id,))
        cursor.execute('DELETE FROM customer_delivery_addresses WHERE customer_id = %s', (customer_id,))
        
        bank_accounts = body.get('bank_accounts', [])
        for ba in bank_accounts:
            cursor.execute('''
                INSERT INTO customer_bank_accounts 
                (customer_id, bank_name, account_number, bik, corr_account)
                VALUES (%s, %s, %s, %s, %s)
            ''', (customer_id, ba.get('bank_name'), ba.get('account_number'), 
                  ba.get('bik'), ba.get('corr_account')))
        
        delivery_addresses = body.get('delivery_addresses', [])
        for da in delivery_addresses:
            cursor.execute('''
                INSERT INTO customer_delivery_addresses 
                (customer_id, name, address, is_main)
                VALUES (%s, %s, %s, %s)
                RETURNING id
            ''', (customer_id, da.get('name'), da.get('address'), da.get('is_main', False)))
            
            address_id = cursor.fetchone()['id']
            
            contacts = da.get('contacts', [])
            for contact in contacts:
                cursor.execute('''
                    INSERT INTO delivery_address_contacts 
                    (delivery_address_id, contact_name, phone)
                    VALUES (%s, %s, %s)
                ''', (address_id, contact.get('contact_name'), contact.get('phone')))
        
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
        
        cursor.execute('DELETE FROM delivery_address_contacts WHERE delivery_address_id IN (SELECT id FROM customer_delivery_addresses WHERE customer_id = %s)', (customer_id,))
        cursor.execute('DELETE FROM customer_delivery_addresses WHERE customer_id = %s', (customer_id,))
        cursor.execute('DELETE FROM customer_bank_accounts WHERE customer_id = %s', (customer_id,))
        cursor.execute('DELETE FROM customers WHERE id = %s RETURNING id', (customer_id,))
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
