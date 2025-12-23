import json
import os
import urllib.request
from typing import Dict, Any
from db import dict_to_json

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