from ultralytics import YOLO

# model = YOLO("model/yolo_smile/weights/best.pt")
model = YOLO("model/models/yolo_smile_v1-1-2.pt")

results = model.predict(
    source="model/datasets/images/val",
    imgsz=512,
    conf=0.75,
    save=True,
    save_txt=True
)
