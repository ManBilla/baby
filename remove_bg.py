import sys
import subprocess

try:
    import rembg
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "rembg", "onnxruntime"])
    
from rembg import remove
from PIL import Image

input_path = '/Users/manojbilla/Documents/AntiGravity/baby-shower-website/images/elephant.png'
output_path = '/Users/manojbilla/Documents/AntiGravity/baby-shower-website/images/elephant.png'

input_img = Image.open(input_path)
output_img = remove(input_img)
output_img.save(output_path)
print("Background removed successfully")
