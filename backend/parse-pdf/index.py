import json
import requests
from pypdf import PdfReader
from io import BytesIO

def handler(event, context):
    """Download and parse PDF file to extract contract template text"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    url = "https://cdn.poehali.dev/projects/19fc2d54-8db4-4df4-b970-568be02f70ef/bucket/123.pdf"
    
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        pdf_reader = PdfReader(BytesIO(response.content))
        
        full_text = ""
        pages_data = []
        
        for page_num, page in enumerate(pdf_reader.pages):
            text = page.extract_text()
            full_text += text + "\n\n"
            pages_data.append({
                "page_number": page_num + 1,
                "text": text
            })
        
        result = {
            "total_pages": len(pdf_reader.pages),
            "full_text": full_text,
            "pages": pages_data
        }
        
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json; charset=utf-8",
                "Access-Control-Allow-Origin": "*"
            },
            "isBase64Encoded": False,
            "body": json.dumps(result, ensure_ascii=False, indent=2)
        }
        
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json; charset=utf-8",
                "Access-Control-Allow-Origin": "*"
            },
            "isBase64Encoded": False,
            "body": json.dumps({
                "error": str(e),
                "type": type(e).__name__
            }, ensure_ascii=False)
        }