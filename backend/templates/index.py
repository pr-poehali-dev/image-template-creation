"""
Backend функция для работы с PDF шаблонами
Операции: GET (список), POST (создание), PUT (обновление), DELETE (удаление)
"""
import json
import os
import psycopg2
from typing import Dict, Any
from datetime import datetime


def get_db_connection():
    """Подключение к базе данных"""
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        raise Exception('DATABASE_URL не найден')
    return psycopg2.connect(dsn)


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Обработчик запросов для работы с PDF шаблонами
    Args: event - dict с httpMethod, body, queryStringParameters
          context - объект с request_id, function_name и др.
    Returns: HTTP response dict
    """
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
    
    try:
        if method == 'GET':
            return get_templates()
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            return create_template(body_data)
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            return update_template(body_data)
        elif method == 'DELETE':
            params = event.get('queryStringParameters', {})
            template_id = params.get('id')
            return delete_template(template_id)
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }


def get_templates() -> Dict[str, Any]:
    """Получение списка всех шаблонов"""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, name, description, template_type, pdf_base64, 
                       fields, pdf_mappings, created_at, updated_at
                FROM t_p35957076_image_template_creat.pdf_templates
                ORDER BY created_at DESC
            """)
            rows = cur.fetchall()
            
            templates = []
            for row in rows:
                templates.append({
                    'id': str(row[0]),
                    'name': row[1],
                    'description': row[2] or '',
                    'templateType': row[3] or 'pdf',
                    'pdfBase64': row[4],
                    'fields': row[5] or [],
                    'pdfMappings': row[6] or [],
                    'createdAt': row[7].isoformat() if row[7] else '',
                    'updatedAt': row[8].isoformat() if row[8] else ''
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'templates': templates}),
                'isBase64Encoded': False
            }
    finally:
        conn.close()


def create_template(data: Dict[str, Any]) -> Dict[str, Any]:
    """Создание нового шаблона"""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO t_p35957076_image_template_creat.pdf_templates 
                (name, description, template_type, pdf_base64, fields, pdf_mappings, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                data.get('name', 'Новый шаблон'),
                data.get('description', ''),
                data.get('templateType', 'pdf'),
                data.get('pdfBase64'),
                json.dumps(data.get('fields', [])),
                json.dumps(data.get('pdfMappings', [])),
                datetime.now(),
                datetime.now()
            ))
            template_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'id': template_id}),
                'isBase64Encoded': False
            }
    finally:
        conn.close()


def update_template(data: Dict[str, Any]) -> Dict[str, Any]:
    """Обновление существующего шаблона"""
    conn = get_db_connection()
    try:
        template_id = data.get('id')
        if not template_id:
            raise ValueError('ID шаблона не указан')
        
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE t_p35957076_image_template_creat.pdf_templates
                SET name = %s, description = %s, fields = %s, 
                    pdf_mappings = %s, updated_at = %s
                WHERE id = %s
            """, (
                data.get('name'),
                data.get('description'),
                json.dumps(data.get('fields', [])),
                json.dumps(data.get('pdfMappings', [])),
                datetime.now(),
                template_id
            ))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
    finally:
        conn.close()


def delete_template(template_id: str) -> Dict[str, Any]:
    """Удаление шаблона"""
    if not template_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'ID не указан'}),
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                DELETE FROM t_p35957076_image_template_creat.pdf_templates
                WHERE id = %s
            """, (template_id,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
    finally:
        conn.close()
