#!/usr/bin/env python3
import os
import re
import urllib.request
import urllib.parse
import json
import time

# User-Agent to comply with Wikimedia API policy and avoid HTTP 429
USER_AGENT = 'TheAiKitchenDemo/1.5 (contact: infraago@ieee.org) urllib/3.0'

# Mapping of Level 1 ingredients to specific Wikipedia page titles
WIKI_MAP = {
    'l1_c1': ('Valle del Colca', 'clean'),
    'l1_c2': ('Monasterio de Santa Catalina (Arequipa)', 'clean'),
    'l1_c3': ('Reserva nacional de Salinas y Aguada Blanca', 'clean'),
    'l1_c4': ('Rocoto relleno', 'clean'),
    'l1_c5': ('Mirador de Yanahuara', 'clean'),
    'l1_c6': ('Adobo arequipeño', 'clean'),
    'l1_c7': ('Cañón de Cotahuasi', 'clean'),
    'l1_c8': ('Catedral de Arequipa', 'clean'),
    'l1_c9': ('Pichu Pichu', 'clean'),
    'l1_c10': ('Picantería', 'clean'),
    'l1_n1': ('Policía Nacional del Perú', 'noise'),
    'l1_n2': ('Semáforo', 'noise'),
    'l1_n3': ('Gato', 'noise'),
    'l1_n4': ('Twitter', 'noise'),
    'l1_n5': ('Huelga', 'noise'),
    'l1_n6': ('Lluvia', 'noise'),
    'l1_n7': ('Queso helado', 'noise'),
    'l1_n8': ('Ministerio de Comercio Exterior y Turismo', 'noise'),
    'l1_n9': ('PromPerú', 'noise'),
    'l1_a1': ('Sacsayhuamán', 'ambiguous'),
    'l1_a2': ('Plaza de Armas de Arequipa', 'ambiguous'),
    'l1_a3': ('Mollendo', 'ambiguous')
}

def fetch_wiki_image_url(title):
    # Try Spanish Wikipedia
    try:
        url = f"https://es.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&titles={urllib.parse.quote(title)}&pithumbsize=500"
        req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
        with urllib.request.urlopen(req, timeout=8) as res:
            data = json.loads(res.read().decode('utf-8'))
            pages = data.get("query", {}).get("pages", {})
            for pid, pdata in pages.items():
                if "thumbnail" in pdata:
                    return pdata["thumbnail"]["source"]
    except Exception as e:
        print(f"Error fetching Spanish Wiki for '{title}': {e}")
    
    # Try English Wikipedia if Spanish fails
    try:
        url = f"https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&titles={urllib.parse.quote(title)}&pithumbsize=500"
        req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
        with urllib.request.urlopen(req, timeout=8) as res:
            data = json.loads(res.read().decode('utf-8'))
            pages = data.get("query", {}).get("pages", {})
            for pid, pdata in pages.items():
                if "thumbnail" in pdata:
                    return pdata["thumbnail"]["source"]
    except Exception as e:
        print(f"Error fetching English Wiki for '{title}': {e}")
        
    return None

def search_wiki_image_url(query_str):
    try:
        url = f"https://es.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&generator=search&piprop=thumbnail&pithumbsize=500&pilimit=3&gsrsearch={urllib.parse.quote(query_str)}"
        req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
        with urllib.request.urlopen(req, timeout=8) as res:
            data = json.loads(res.read().decode('utf-8'))
            pages = data.get("query", {}).get("pages", {})
            sorted_pages = sorted(pages.values(), key=lambda x: x.get("index", 100))
            for pdata in sorted_pages:
                if "thumbnail" in pdata:
                    return pdata["thumbnail"]["source"]
    except Exception as e:
        print(f"Error searching Wiki for '{query_str}': {e}")
    return None

def download_image(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
        with urllib.request.urlopen(req, timeout=10) as res:
            return res.read()
    except Exception as e:
        print(f"Error downloading image {url}: {e}")
        return None

def generate_fallback_image(ingredient_id, item_type):
    from PIL import Image, ImageDraw
    # Create 128x128 retro matrix block canvas
    img = Image.new('RGB', (128, 128), color=(10, 14, 26))
    draw = ImageDraw.Draw(img)
    
    # Neon palettes
    if item_type == 'clean':
        base_color = (0, 242, 254)       # Cyan
        accent_color = (57, 255, 20)     # Green
    elif item_type == 'noise':
        base_color = (255, 45, 120)      # Pink
        accent_color = (191, 95, 255)    # Purple
    else:
        base_color = (255, 230, 0)       # Yellow
        accent_color = (255, 107, 53)    # Orange
        
    # Grid lines
    for i in range(0, 128, 16):
        draw.line([(i, 0), (i, 128)], fill=(30, 40, 60), width=1)
        draw.line([(0, i), (128, i)], fill=(30, 40, 60), width=1)
        
    # Floating frames
    draw.rectangle([24, 24, 104, 104], outline=base_color, width=4)
    draw.rectangle([36, 36, 92, 92], outline=accent_color, width=2)
    
    # Geometric core shape
    h = hash(ingredient_id)
    shape_type = h % 3
    if shape_type == 0:
        draw.line([(64, 44), (64, 84)], fill=base_color, width=6)
        draw.line([(44, 64), (84, 64)], fill=base_color, width=6)
    elif shape_type == 1:
        draw.polygon([(64, 40), (88, 64), (64, 88), (40, 64)], fill=accent_color)
    else:
        draw.rectangle([48, 48, 80, 80], fill=base_color)
        
    return img

def pixelate_image(img_bytes, ingredient_id, item_type):
    from PIL import Image
    import io
    
    img = None
    if img_bytes:
        try:
            img = Image.open(io.BytesIO(img_bytes))
        except Exception as e:
            print(f"Failed to load image bytes for {ingredient_id}: {e}")
            
    if img is None:
        img = generate_fallback_image(ingredient_id, item_type)
        
    if img.mode != 'RGB':
        img = img.convert('RGB')
        
    # Pixel art pipeline:
    # 1. Downscale to 32x32 using Nearest Neighbor
    small_img = img.resize((32, 32), Image.NEAREST)
    # 2. Adaptive color quantization (16 colors)
    quantized_img = small_img.convert('P', palette=Image.ADAPTIVE, colors=16)
    # 3. Scale up back to 128x128 with Nearest Neighbor to render crisp pixels
    final_img = quantized_img.resize((128, 128), Image.NEAREST)
    
    return final_img

def update_ingredients_file():
    filepath = "js/data/ingredients.js"
    if not os.path.exists(filepath):
        print(f"Could not find {filepath}")
        return
        
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
        
    for iid in WIKI_MAP.keys():
        # Check if already has image field for this id
        pattern_check = rf"id:\s*'{iid}',\s*image:"
        if re.search(pattern_check, content):
            print(f"Ingredient {iid} already has image field. Skipping file update.")
            continue
            
        # Target pattern: id: 'l1_c1',
        # Replacement: id: 'l1_c1', image: 'assets/img/blocks/l1_c1.png',
        target_pattern = rf"id:\s*'{iid}',"
        replacement = f"id: '{iid}', image: 'assets/img/blocks/{iid}.png',"
        
        content = re.sub(target_pattern, replacement, content, count=1)
        
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Successfully updated {filepath}!")

def main():
    print("Starting pixel-art image ingestion script...")
    
    # Ensure asset output folder exists
    os.makedirs("assets/img/blocks", exist_ok=True)
    
    for iid, (title, item_type) in WIKI_MAP.items():
        print("-" * 50)
        
        # User requested to leave c1, c2, c3, c4, c5 as they are
        if iid in ['l1_c1', 'l1_c2', 'l1_c3', 'l1_c4', 'l1_c5']:
            print(f"Skipping ID: {iid} (keep as is).")
            continue
            
        print(f"Processing ID: {iid} | Wikipedia Title: {title}")
        img_bytes = None
        
        # 1. Query Wikipedia API
        url = fetch_wiki_image_url(title)
        if not url:
            print(f"Wikipedia PageImage not found for '{title}', searching...")
            url = search_wiki_image_url(title)
            
        # 2. Download Image
        if url:
            print(f"Downloading from {url}...")
            img_bytes = download_image(url)
        else:
            print(f"No Wikipedia image found. Using generated fallback.")
            
        # 3. Pixelate Image
        final_img = pixelate_image(img_bytes, iid, item_type)
        
        # 4. Save to Disk (will overwrite previous file for this id)
        dest_path = f"assets/img/blocks/{iid}.png"
        final_img.save(dest_path)
        print(f"Saved pixelated block image to: {dest_path}")
        
        # Polite delay to respect API limits
        time.sleep(1.0)
        
    print("-" * 50)
    # 5. Inject image properties into ingredients.js if not already present
    update_ingredients_file()
    print("Ingestion script completed successfully!")

if __name__ == "__main__":
    main()
