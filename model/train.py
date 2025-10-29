from ultralytics import YOLO

model = YOLO("yolov8n.yaml")

model.train(
    data="model/smile_ai.yaml",
    epochs=50,
    imgsz=512,
    batch=4,
    workers=2,
    name="yolo_smile",
    project="model",
    exist_ok=True
)

