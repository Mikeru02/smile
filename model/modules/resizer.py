# import cv2

# image = cv2.imread("THESIS_PICTURES/IMG_20251119_092718.jpg")

# # Resize to 300x300
# resized = cv2.resize(image, (512, 384))

# cv2.imwrite("output2.jpg", resized)


import cv2
import os

input_folder = "THESIS_PICTURES"
output_folder = "resized"

counter = 1

for filename in os.listdir(input_folder):
    input_path = os.path.join(input_folder, filename)

    image = cv2.imread(input_path)

    resized = cv2.resize(image, (512, 384), interpolation=cv2.INTER_AREA)

    new_name = f"image_{counter}.jpg"
    output_path = os.path.join(output_folder, new_name)

    cv2.imwrite(output_path, resized)

    print("DONE")
    counter += 1
