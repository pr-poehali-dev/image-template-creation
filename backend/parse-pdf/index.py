import json
import base64
import re
from pypdf import PdfReader
from io import BytesIO

def extract_field(text, pattern, default=""):
    match = re.search(pattern, text, re.MULTILINE | re.DOTALL)
    return match.group(1).strip() if match else default

def parse_contract_data(full_text):
    data = {}
    
    data['number'] = extract_field(full_text, r'Договор[–-]заявка\s*№\s*([^\s]+)')
    data['date'] = extract_field(full_text, r'от\s+(\d{2}\.\d{2}\.\d{4})')
    
    data['customerName'] = extract_field(full_text, r'Заказчик:\s*([^\n]+?)(?:\s+Перевозчик:|\n)')
    data['customerInn'] = extract_field(full_text, r'ИНН\s+(\d{10,12})')
    data['customerOgrn'] = extract_field(full_text, r'ОГРН[:\s]+(\d{13,15})')
    data['customerOkpo'] = extract_field(full_text, r'ОКПО[:\s]+(\d+)')
    data['customerOkvd'] = extract_field(full_text, r'ОКВД[:\s]+([\d.]+)')
    data['customerAccount'] = extract_field(full_text, r'Расчетный счет[:\s]+([\d]+)')
    data['customerBank'] = extract_field(full_text, r'Наименование банка[:\s]+([^\n]+)')
    data['customerBik'] = extract_field(full_text, r'БИК[:\s]+(\d+)')
    data['customerCorAccount'] = extract_field(full_text, r'Корр\.?\s*счет[:\s]+([\d]+)')
    data['customerDirector'] = extract_field(full_text, r'Генеральный директор\s+([^\n]+)')
    data['customerAddress'] = extract_field(full_text, r'адрес[:\s]+([^\n]+?)(?:\s+ОКВД:|\n)')
    
    data['carrierName'] = extract_field(full_text, r'Перевозчик:\s*([^\n]+)')
    data['carrierInn'] = extract_field(full_text, r'Перевозчик:.*?ИНН\s+(\d{10,12})', '')
    data['carrierOgrn'] = extract_field(full_text, r'ОГРНИП[:\s№]+([^\n]+)')
    data['carrierAccount'] = extract_field(full_text, r'р/с\s+([\d.]+)')
    data['carrierBank'] = extract_field(full_text, r'(?:БИК|Банк)[:\s]+([^\n]+?)(?:\s+к/с|\n)')
    data['carrierAddress'] = extract_field(full_text, r'(?:юр\.|почт\.)\s*адрес[:\s]+([^\n]+)')
    data['carrierEmail'] = extract_field(full_text, r'([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})')
    
    data['bodyType'] = extract_field(full_text, r'Требуемый тип ТС:\s*([^\n]+?)(?:\s+рефрижератор|\n)')
    data['cargoType'] = extract_field(full_text, r'(?:тип кузова\s+)?([рР]ефрижератор)')
    data['weight'] = extract_field(full_text, r'(\d+)\s*т\.?(?:\s|$)')
    data['volume'] = extract_field(full_text, r'(\d+)\s*м3')
    data['specialConditions'] = extract_field(full_text, r'Особые условия:\s*([^\n]+)')
    data['extraConditions'] = extract_field(full_text, r'\+\s*(\d+\s*град)')
    
    data['cargoName'] = extract_field(full_text, r'Груз:\s*([^\n]+)')
    
    data['loadingAddress'] = extract_field(full_text, r'Погрузка:\s*([^\n]+?)(?:\s+дата|\n)')
    data['loadingDate'] = extract_field(full_text, r'Погрузка:.*?(\d{2}\.\d{2}\.\d{4})', '')
    data['loadingContact'] = extract_field(full_text, r'контактное лицо[:\s]+([^\n]+?)(?:\s+Разгрузка:|\n)')
    
    data['unloadingAddress'] = extract_field(full_text, r'Разгрузка:\s*([^\n]+?)(?:\s+дата|\n)')
    data['unloadingDate'] = extract_field(full_text, r'Разгрузка:.*?(\d{2}\.\d{2}\.\d{4})', '')
    data['unloadingContact'] = extract_field(full_text, r'Разгрузка:.*?контактное лицо[:\s]+([^\n]+)', '')
    
    data['amount'] = extract_field(full_text, r'Оплата:\s*([\d\s]+)\s*руб')
    data['paymentTerms'] = extract_field(full_text, r'(без НДС)')
    data['paymentConditions'] = extract_field(full_text, r'(\d+-\d+\s*б/д)')
    
    data['driverName'] = extract_field(full_text, r'Данные водителя:\s*([А-ЯЁа-яё\s]+?)(?:\s+паспорт|\n)')
    data['driverPassport'] = extract_field(full_text, r'паспорт[:\s]+([^\n]+)')
    data['driverLicense'] = extract_field(full_text, r'ВУ\s+([^\n]+)')
    
    data['vehicleModel'] = extract_field(full_text, r'Данные ТС:\s*([^\n]+?)(?:\s+прицеп|\n)')
    data['vehicleNumber'] = extract_field(full_text, r'([А-Я]\d{3}[А-Я]{2}/\d{2})')
    data['trailerNumber'] = extract_field(full_text, r'прицеп\s+([^\n]+)')
    
    data['transportConditions'] = extract_field(full_text, r'Условия перевозки:\s*([^\n]+(?:\n(?!Штрафные)[^\n]+)*)')
    
    return data

def handler(event, context):
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Метод не поддерживается'}, ensure_ascii=False)
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        pdf_base64 = body.get('file')
        
        if not pdf_base64:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Файл не передан'}, ensure_ascii=False)
            }
        
        pdf_bytes = base64.b64decode(pdf_base64)
        pdf_reader = PdfReader(BytesIO(pdf_bytes))
        
        full_text = ""
        for page in pdf_reader.pages:
            full_text += page.extract_text() + "\n\n"
        
        parsed_data = parse_contract_data(full_text)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': True,
                'data': parsed_data,
                'full_text': full_text
            }, ensure_ascii=False, indent=2)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': False,
                'error': str(e),
                'type': type(e).__name__
            }, ensure_ascii=False)
        }
