import os

class Normalizer:
    def __init__(self, source_folder: str, type: str) -> None:
        self.__source_folder = source_folder
        self.__type = type
        self.__img_extensions =  (".jpg", ".jpeg", ".png", ".bmp")
        self.__txt_extensions = (".txt")
    
    def normalize(self):
        all_files = os.listdir(self.__source_folder)

        files = []
        for file in all_files:
            file_path = os.path.join(self.__source_folder, file)
            if os.path.isfile(file_path):
                file_lower = file.lower()
                if self.__type == "image":
                    for extension in self.__img_extensions:
                        if file_lower.endswith(extension):
                            files.append(file)
                            break
                elif self.__type == "text":
                    for extension in self.__txt_extensions:
                        if file_lower.endswith(extension):
                            files.append(file)
                            break
                else:
                    raise ValueError("Invalid type of extraction")
        
        for old_name in files:
            parts = old_name.split("-", 1)
            if len(parts) == 2:
                new_name = parts[1]
            else:
                new_name = old_name
            
            old_path = os.path.join(self.__source_folder, old_name)
            new_path = os.path.join(self.__source_folder, new_name)

            if not os.path.exists(new_path):
                os.rename(old_path, new_path)
                print(f"[SUCCESS] Old: {old_path} -> New: {new_path}")
            else:
                print(f"[SKIPPED] {old_path}, {new_path} already exists!")

if __name__ == "__main__":
    img_normalizer = Normalizer("model/datasets/raw_images", "image")
    img_normalizer.normalize()

    label_normalizer = Normalizer("model/datasets/raw_labels", "text")
    label_normalizer.normalize()