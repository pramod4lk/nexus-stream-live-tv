from PIL import Image

def clean_logo():
    input_path = "logo_source.png"
    output_logo = "public/logo.png"
    output_icon = "app/icon.png"
    
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()
        
        new_data = []
        
        # Target: Pure Black background (0,0,0) as per original prompt
        # We'll use a threshold to catch "near black" compression artifacts
        threshold = 50 
        
        for item in datas:
            r, g, b, a = item
            
            # Calculate distance from BLACK (0,0,0)
            # dist = r+g+b covers it for black.
            if r < threshold and g < threshold and b < threshold:
                # Be aggressive: Make it transparent.
                new_data.append((0, 0, 0, 0))
            else:
                # Keep color, but maybe boost opacity to full if it's not fully opaque?
                # PNG source from generation is usually full opacity.
                new_data.append(item)
                
        img.putdata(new_data)
        
        # Trim empty space if needed? 
        # For now, just save. the generation was centered.
        
        img.save(output_logo, "PNG")
        print(f"Saved {output_logo}")
        
        # Resize for favicon to reduce scaling artifacts in browser?
        # Next.js recommends high res, but let's save the same file.
        img.save(output_icon, "PNG")
        print(f"Saved {output_icon}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    clean_logo()
