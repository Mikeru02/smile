import os

def remove(folder):
    for filename in os.listdir(folder):
        path = os.path.join(folder, filename)
        if os.path.isfile(path):
            os.remove(path)

if __name__ == '__main__':
    image_train = "model/datasets/images/train"
    image_val = "model/datasets/images/val"

    label_train = "model/datasets/labels/train"
    label_val = "model/datasets/labels/val"

    remove(image_train)
    remove(image_val)
    remove(label_val)
    remove(label_train)