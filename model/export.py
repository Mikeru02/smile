from ultralytics import YOLO
model = YOLO("model/yolo_smile_v1-3.pt")
model.export(format="onnx")
