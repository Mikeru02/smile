import os

image_folder = input("Input image folder directory: ")
file_name_type = input("[plastic_bottles], [paper], [general_waste]: ")

images = []
for file in os.listdir(image_folder):
    if file.lower().endswith((".jpg", ".png")):
        images.append(file)
images.sort()

counter = 1

for old_img_name in images:
    old_img_path = os.path.join(image_folder, old_img_name)

    new_img_name = f"{file_name_type}{counter}.jpg"
    new_img_path = os.path.join(image_folder, new_img_name)

    os.rename(old_img_path, new_img_path)
    print(f"{counter} >> {old_img_name} -> {new_img_name}")

    counter += 1