#!/usr/bin/env python3
import os
from PIL import Image

def pixelate_rgba(img, target_size=(48, 48), palette_colors=16):
    # Ensure it is RGBA
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # 1. Resize down to low resolution using Nearest Neighbor
    small = img.resize(target_size, Image.NEAREST)
    
    # 2. Split alpha channel to handle transparency
    r, g, b, a = small.split()
    rgb = Image.merge('RGB', (r, g, b))
    
    # 3. Quantize the RGB channels to adaptive colors
    quantized_rgb = rgb.convert('P', palette=Image.ADAPTIVE, colors=palette_colors)
    quantized_rgb = quantized_rgb.convert('RGB')
    
    # 4. Threshold the alpha channel for crisp pixel edges (no half-transparency blur)
    a_binary = a.point(lambda p: 255 if p > 127 else 0)
    
    # 5. Merge back into RGBA
    r_q, g_q, b_q = quantized_rgb.split()
    small_pixelated = Image.merge('RGBA', (r_q, g_q, b_q, a_binary))
    
    # 6. Resize back to the original size with Nearest Neighbor
    final = small_pixelated.resize(img.size, Image.NEAREST)
    return final

def main():
    folder = "assets/img/robot-emotes"
    files = ["robot_electrocution.png", "robot_fail.png", "robot_happy.png", "robot_idle.png"]
    
    print("Starting robot emotes pixelation...")
    for filename in files:
        filepath = os.path.join(folder, filename)
        if not os.path.exists(filepath):
            print(f"File {filepath} not found. Skipping.")
            continue
            
        print(f"Pixelating: {filename}")
        img = Image.open(filepath)
        
        # Pixelate to 48x48 matrix with 16 colors
        pixelated_img = pixelate_rgba(img, target_size=(48, 48), palette_colors=16)
        
        # Overwrite original
        pixelated_img.save(filepath)
        print(f"Saved pixelated version of {filename} back to folder.")
        
    print("Mascot emotes pixelation completed successfully!")

if __name__ == "__main__":
    main()
