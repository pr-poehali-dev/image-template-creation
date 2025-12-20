import json
import requests
from openpyxl import load_workbook
from io import BytesIO

def handler(event, context):
    """Download and parse Excel file to extract contract template structure"""
    
    url = "https://cdn.poehali.dev/projects/19fc2d54-8db4-4df4-b970-568be02f70ef/bucket/СИГ%20%2B%20ФМ%20Д-З%20Мск-Ижевск%20(Шабердино)%20лук%20на%2020.12.2025%20вод.%20Шильков.xlsx"
    
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        wb = load_workbook(BytesIO(response.content))
        sheet = wb.active
        sheet_name = sheet.title
        
        result = {
            "sheet_name": sheet_name,
            "max_row": sheet.max_row,
            "max_column": sheet.max_column,
            "merged_cells": [],
            "rows": []
        }
        
        for merged_range in sheet.merged_cells.ranges:
            result["merged_cells"].append(str(merged_range))
        
        for row_idx in range(1, sheet.max_row + 1):
            row_data = []
            for col_idx in range(1, sheet.max_column + 1):
                cell = sheet.cell(row=row_idx, column=col_idx)
                
                cell_data = {
                    "value": str(cell.value) if cell.value else "",
                    "is_red": False,
                    "is_bold": False,
                    "font_size": None
                }
                
                if cell.font:
                    cell_data["is_bold"] = bool(cell.font.bold)
                    cell_data["font_size"] = cell.font.size
                    
                    if cell.font.color and hasattr(cell.font.color, 'rgb'):
                        color_rgb = cell.font.color.rgb
                        if color_rgb and isinstance(color_rgb, str) and len(color_rgb) >= 6:
                            red = int(color_rgb[-6:-4], 16)
                            green = int(color_rgb[-4:-2], 16)
                            blue = int(color_rgb[-2:], 16)
                            if red > 200 and green < 100 and blue < 100:
                                cell_data["is_red"] = True
                
                row_data.append(cell_data)
            
            result["rows"].append(row_data)
        
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps(result, ensure_ascii=False, indent=2)
        }
        
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "error": str(e),
                "type": type(e).__name__
            }, ensure_ascii=False)
        }