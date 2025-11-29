from ultralytics import YOLO

model = YOLO("model/yolo_smile_v1-1-2/weights/best.pt")

model.save("model/models/yolo_smile_v1-1-2.pt")