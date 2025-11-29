import os

image_folder = "model/datasets/raw_images"
label_folder = "model/datasets/raw_labels"

images = []
for file in os.listdir(image_folder):
    if file.lower().endswith((".jpg", ".png")):
        images.append(file)

# Sort to ensure consistent renaming order
images.sort()

counter = 1

for old_img_name in images:
    old_img_path = os.path.join(image_folder, old_img_name)

    # new image name
    new_img_name = f"{counter}.jpg"
    new_img_path = os.path.join(image_folder, new_img_name)

    # rename image
    os.rename(old_img_path, new_img_path)

    # corresponding label
    old_label_name = os.path.splitext(old_img_name)[0] + ".txt"
    old_label_path = os.path.join(label_folder, old_label_name)

    # new label name
    new_label_name = f"{counter}.txt"
    new_label_path = os.path.join(label_folder, new_label_name)

    # rename label only if it exists
    if os.path.exists(old_label_path):
        os.rename(old_label_path, new_label_path)
        print(f"{counter} >> {old_img_name} -> {new_img_name} | {old_label_name} -> {new_label_name}")
    else:
        print(f"{counter} >> {old_img_name} -> {new_img_name} | No label found")

    counter += 1
