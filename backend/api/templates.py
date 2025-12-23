import json
import base64
from typing import Dict, Any
from db import dict_to_json

def handle_templates(method: str, event: Dict[str, Any], conn, cursor) -> Dict[str, Any]:
    if method == 'GET':
        cursor.execute('''
            SELECT id, name, description, pdf_base64, created_at, updated_at
            FROM report_templates 
            ORDER BY name
        ''')
        templates = cursor.fetchall()
        result = [dict_to_json(dict(t)) for t in templates]
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'templates': result}),
            'isBase64Encoded': False
        }
    
    elif method == 'POST':
        body = json.loads(event.get('body', '{}'))
        
        pdf_base64 = body.get('pdf_base64', '')
        if not pdf_base64.startswith('data:'):
            if pdf_base64:
                pdf_base64 = f"data:application/pdf;base64,{pdf_base64}"
        
        cursor.execute('''
            INSERT INTO report_templates (name, description, pdf_base64)
            VALUES (%s, %s, %s)
            RETURNING id, name, description, pdf_base64, created_at, updated_at
        ''', (
            body.get('name', 'Новый шаблон'),
            body.get('description', ''),
            pdf_base64
        ))
        
        template = cursor.fetchone()
        conn.commit()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'template': dict_to_json(dict(template))}),
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
        
        pdf_base64 = body.get('pdf_base64')
        if pdf_base64 and not pdf_base64.startswith('data:'):
            pdf_base64 = f"data:application/pdf;base64,{pdf_base64}"
        
        if pdf_base64:
            cursor.execute('''
                UPDATE report_templates 
                SET name = %s, description = %s, pdf_base64 = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING id, name, description, pdf_base64, created_at, updated_at
            ''', (
                body.get('name'),
                body.get('description'),
                pdf_base64,
                template_id
            ))
        else:
            cursor.execute('''
                UPDATE report_templates 
                SET name = %s, description = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING id, name, description, pdf_base64, created_at, updated_at
            ''', (
                body.get('name'),
                body.get('description'),
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
            'body': json.dumps({'template': dict_to_json(dict(template))}),
            'isBase64Encoded': False
        }
    
    elif method == 'DELETE':
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