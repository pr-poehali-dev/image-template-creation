import requests
import json
from io import BytesIO
try:
    import PyPDF2
    import pdfplumber
except ImportError:
    print("Installing required packages...")
    import subprocess
    subprocess.check_call(['pip', 'install', 'PyPDF2', 'pdfplumber'])
    import PyPDF2
    import pdfplumber

# Download PDF
url = "https://cdn.poehali.dev/projects/19fc2d54-8db4-4df4-b970-568be02f70ef/bucket/123.pdf"
response = requests.get(url)
pdf_content = BytesIO(response.content)

# Save to temp file
with open('/tmp/downloaded.pdf', 'wb') as f:
    f.write(response.content)

print("PDF downloaded successfully to /tmp/downloaded.pdf\n")
print("="*80)
print("DETAILED PDF ANALYSIS")
print("="*80)

# Analyze with pdfplumber
with pdfplumber.open(pdf_content) as pdf:
    print(f"\nTotal Pages: {len(pdf.pages)}")
    
    for page_num, page in enumerate(pdf.pages, 1):
        print(f"\n{'='*80}")
        print(f"PAGE {page_num}")
        print(f"{'='*80}")
        
        # Page dimensions
        print(f"\nPage Dimensions: {page.width} x {page.height} points")
        
        # Extract text
        print(f"\n--- TEXT CONTENT ---")
        text = page.extract_text()
        print(text)
        
        # Extract tables
        tables = page.extract_tables()
        if tables:
            print(f"\n--- TABLES (Found {len(tables)}) ---")
            for i, table in enumerate(tables, 1):
                print(f"\nTable {i}:")
                print(f"Rows: {len(table)}, Columns: {len(table[0]) if table else 0}")
                for row_idx, row in enumerate(table):
                    print(f"Row {row_idx}: {row}")
        
        # Extract words with positions and fonts
        print(f"\n--- DETAILED TEXT WITH FORMATTING ---")
        words = page.extract_words(extra_attrs=['fontname', 'size'])
        for word in words:
            print(f"Text: '{word['text']}' | Font: {word.get('fontname', 'N/A')} | Size: {word.get('size', 'N/A')} | Position: ({word['x0']:.2f}, {word['top']:.2f})")
        
        # Extract characters (for color detection)
        print(f"\n--- CHARACTER-LEVEL ANALYSIS ---")
        chars = page.chars
        unique_fonts = set()
        unique_colors = set()
        for char in chars:
            unique_fonts.add(char.get('fontname', 'Unknown'))
            # Color information (non_stroking_color)
            color = char.get('non_stroking_color')
            if color:
                unique_colors.add(str(color))
        
        print(f"\nUnique Fonts: {unique_fonts}")
        print(f"Unique Colors: {unique_colors}")
        
        # Red text detection
        red_text = []
        for char in chars:
            color = char.get('non_stroking_color')
            # Red color detection (RGB where R is high, G and B are low)
            if color and isinstance(color, tuple) and len(color) >= 3:
                r, g, b = color[0], color[1], color[2]
                if r > 0.5 and g < 0.3 and b < 0.3:
                    red_text.append(char['text'])
        
        if red_text:
            print(f"\nRed Text Found: {''.join(red_text)}")

print(f"\n{'='*80}")
print("ANALYSIS COMPLETE")
print(f"{'='*80}")
