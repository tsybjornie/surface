import re
from bs4 import BeautifulSoup

def process_html(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # Replacements of text
    # 1. Lime Paint -> Grade-98 Shikkui
    html = re.sub(r'Lime Paint', 'Grade-98 Shikkui', html, flags=re.IGNORECASE)
    # Restore some structure if it got messed up? Wait, doing a global text replace might break class names if there are any like 'lime-paint'. Let's do it carefully.
    
    # Actually, replacing all text might break links like <a href="lime-paint.html">. Let's do soup and text nodes.
    
process_html('index.html')
