from PIL import Image
from pathlib import Path

'''
    Pang resize ko ng images para di ko gagawin manually isa-isa.

    find . -type f -name "*:Zone.Identifier" -delete
    source venv/bin/activate
    label-studio start
'''

def resize_image(input_path, output_path, size):
    with Image.open(input_path) as img:
        img = img.resize(size, Image.Resampling.LANCZOS)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        img.save(output_path)
        print(f"DONE ({output_path})")

imgs_folder = Path("to_process/to_resize/kalat/")
save_folder = Path("to_process/resized/nov15/")
new_size = (384, 512)

def get_imgs(input_dir, output_dir):
    for file_path in input_dir.glob("*.jpg"):
        nm = file_path.name
        # print(f"Processing {nm}...")

        out_path = output_dir / nm
        resize_image(file_path, out_path, new_size)

    print("All done!")

get_imgs(imgs_folder, save_folder)
