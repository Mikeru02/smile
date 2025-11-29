from ultralytics import YOLO

model = YOLO("model/models/yolo_smile_v1-1.pt")

model.train(
    data="model/smile_ai.yaml",
    epochs=50,
    imgsz=512,
    batch=4,
    workers=2,
    name="yolo_smile_v1-1-2",
    project="model",
    exist_ok=True
)

