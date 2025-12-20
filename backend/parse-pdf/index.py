import json
import requests
from pypdf import PdfReader
from io import BytesIO

def handler(event, context):
    """Download and parse PDF file to extract contract template text"""
    
    url = "https://cdn.poehali.dev/projects/19fc2d54-8db4-4df4-b970-568be02f70ef/bucket/123.pdf"
    
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        pdf_reader = PdfReader(BytesIO(response.content))
        
        result = {
            "total_pages": len(pdf_reader.pages),
            "pages": []
        }
        
        for page_num, page in enumerate(pdf_reader.pages):
            text = page.extract_text()
            result["pages"].append({
                "page_number": page_num + 1,
                "text": text
            })
        
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
