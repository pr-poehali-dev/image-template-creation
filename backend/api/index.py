from typing import Dict, Any
from psycopg2.extras import RealDictCursor
from db import get_db_connection
from drivers import handle_drivers
from customers import handle_customers, handle_dadata
from vehicles import handle_vehicles
from templates import handle_templates

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    path: str = event.get('url', '/')
    
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
        'Access-Control-Max-Age': '86400'
    }
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': '',
            'isBase64Encoded': False
        }
    
    if path.startswith('/dadata'):
        return handle_dadata(method, event)
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if path.startswith('/drivers'):
            return handle_drivers(method, event, conn, cursor)
        elif path.startswith('/customers'):
            return handle_customers(method, event, conn, cursor)
        elif path.startswith('/vehicles'):
            return handle_vehicles(method, event, conn, cursor)
        elif path.startswith('/templates'):
            return handle_templates(method, event, conn, cursor)
        else:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': '{"error": "Not found"}',
                'isBase64Encoded': False
            }
    finally:
        cursor.close()