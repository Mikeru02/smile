import os

image_folder = "model/datasets/raw_images"
label_folder = "model/datasets/raw_labels"

# Get existing numeric filenames
existing_numbers = []

for file in os.listdir(image_folder):
    name, ext = os.path.splitext(file)
    if ext.lower() in (".jpg", ".png") and name.isdigit():
        existing_numbers.append(int(name))

# Determine starting counter
counter = max(existing_numbers) + 1 if existing_numbers else 1

# Get files that are NOT yet numbered
new_images = []
for file in os.listdir(image_folder):
    name, ext = os.path.splitext(file)
    if ext.lower() in (".jpg", ".png", ".jpeg") and not name.isdigit():
        new_images.append(file)

# Sort for consistency
new_images.sort()

for old_img_name in new_images:
    old_img_path = os.path.join(image_folder, old_img_name)

    # New image name
    new_img_name = f"{counter}.jpg"
    new_img_path = os.path.join(image_folder, new_img_name)

    os.rename(old_img_path, new_img_path)

    # Corresponding label
    old_label_name = os.path.splitext(old_img_name)[0] + ".txt"
    old_label_path = os.path.join(label_folder, old_label_name)

    new_label_name = f"{counter}.txt"
    new_label_path = os.path.join(label_folder, new_label_name)

    if os.path.exists(old_label_path):
        os.rename(old_label_path, new_label_path)
        print(f"{counter} >> {old_img_name} -> {new_img_name} | {old_label_name} -> {new_label_name}")
    else:
        print(f"{counter} >> {old_img_name} -> {new_img_name} | No label found")

    counter += 1
