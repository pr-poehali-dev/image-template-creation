import json
import os
import base64
import psycopg2
from psycopg2.extras import RealDictCursor
import boto3
from typing import Dict, Any

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def get_s3_client():
    return boto3.client('s3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
    )

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
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
            cursor.execute("""
                SELECT id, name, description, template_type, pdf_url, 
                       fields, pdf_mappings, created_at, updated_at
                FROM t_p35957076_image_template_creat.pdf_templates
                ORDER BY created_at DESC
            """)
            templates = cursor.fetchall()
            
            result = []
            for t in templates:
                result.append({
                    'id': str(t['id']),
                    'name': t['name'],
                    'description': t['description'],
                    'templateType': t['template_type'],
                    'pdfPreviewUrl': t['pdf_url'],
                    'fields': t['fields'],
                    'pdfMappings': t['pdf_mappings'],
                    'createdAt': t['created_at'].strftime('%Y-%m-%d')
                })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'templates': result}),
                'isBase64Encoded': False
            }
        
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            pdf_url = None
            if body.get('pdfBase64'):
                s3 = get_s3_client()
                file_key = f"templates/{body['name']}_{int(os.times().elapsed * 1000)}.pdf"
                pdf_data = base64.b64decode(body['pdfBase64'].split(',')[1] if ',' in body['pdfBase64'] else body['pdfBase64'])
                
                s3.put_object(
                    Bucket='files',
                    Key=file_key,
                    Body=pdf_data,
                    ContentType='application/pdf'
                )
                
                pdf_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{file_key}"
            
            cursor.execute("""
                INSERT INTO t_p35957076_image_template_creat.pdf_templates 
                (name, description, template_type, pdf_url, fields, pdf_mappings)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id, created_at
            """, (
                body['name'],
                body.get('description', ''),
                body.get('templateType', 'pdf'),
                pdf_url,
                json.dumps(body.get('fields', [])),
                json.dumps(body.get('pdfMappings', []))
            ))
            
            result_row = cursor.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'id': str(result_row['id']),
                    'createdAt': result_row['created_at'].strftime('%Y-%m-%d')
                }),
                'isBase64Encoded': False
            }
        
        if method == 'DELETE':
            params = event.get('queryStringParameters', {})
            template_id = params.get('id')
            
            if not template_id:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing id parameter'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute("""
                DELETE FROM t_p35957076_image_template_creat.pdf_templates
                WHERE id = %s
            """, (int(template_id),))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        cursor.close()
        conn.close()
