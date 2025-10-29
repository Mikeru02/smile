from ultralytics import YOLO

model = YOLO("model/yolo_smile/weights/best.pt")

model.save("model/models/yolo_smile_v1-0-pbp.pt")