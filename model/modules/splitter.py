import os
import shutil
import random
from pathlib import Path

class DatasetSplitter:
    def __init__(self, image_folder: str, label_folder: str, train_ratio: float = 0.8) -> None:
        self.__image_folder = image_folder
        self.__label_folder = label_folder
        self.__train_ratio = train_ratio
        self.__img_extensions =  (".jpg", ".jpeg", ".png", ".bmp")
        self.__txt_extensions = (".txt")
        self.__out_img_train = "model/datasets/images/train"
        self.__out_img_val = "model/datasets/images/val"
        self.__out_label_train = "model/datasets/labels/train"
        self.__out_label_val = "model/datasets/labels/val"

    def check_directories(self):
        for folder in [self.__out_img_train, self.__out_img_val, self.__out_label_train, self.__out_label_val]:
            os.makedirs(folder, exist_ok=True)
    
    def copy_files(self, missing_label: list, img_list: list, img_dir: str, label_dir: str):
        for image_name in img_list:
            src_img = os.path.join(self.__image_folder, image_name)
            dir_img = os.path.join(img_dir, image_name)
            # shutil.copy2(src_img, dir_img)

            label_name = Path(image_name).stem + ".txt"
            src_label = os.path.join(self.__label_folder, label_name)
            dir_label = os.path.join(label_dir, label_name)

            if os.path.exists(dir_img) and os.path.exists(dir_label):
                print(f"[SKIPPED] {image_name} already exists!")
                continue
                
            shutil.copy2(src_img, dir_img)

            if os.path.exists(src_label):
                shutil.copy2(src_label, dir_label)
            else:
                missing_label.append(label_name)

    def split(self):
        self.check_directories()

        all_files = os.listdir(self.__image_folder)

        images = []
        for file in all_files:
            file_path = os.path.join(self.__image_folder, file)
            if os.path.isfile(file_path) and file.lower().endswith(self.__img_extensions):
                images.append(file)

        images.sort()
        random.shuffle(images)

        total_files = len(images)
        train_count = int(total_files * self.__train_ratio)
        train_images = images[:train_count]
        val_images = images[train_count:]

        missing_labels = []

        self.copy_files(missing_labels, train_images, self.__out_img_train, self.__out_label_train)
        self.copy_files(missing_labels, val_images, self.__out_img_val, self.__out_label_val)

        print(f"Total images: {total_files}")
        print(f"Train: {len(train_images)}, Val: {len(val_images)}")
        if missing_labels:
            print(f"[WARNING] Missing labels for {len(missing_labels)} images: ")
            for labels in missing_labels:
                print(f"\t{labels}")
        print("[SUCCESS] Dataset split complete")

if __name__ == "__main__":
    image_folder = "model/datasets/raw_images"
    label_folder = "model/datasets/raw_labels"

    splitter = DatasetSplitter(image_folder, label_folder)
    splitter.split()


