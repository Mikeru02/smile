from ultralytics import YOLO

model = YOLO("model/yolo_smile_v1-3/weights/best.pt")

model.save("model/yolo_smile_v1-3.pt")