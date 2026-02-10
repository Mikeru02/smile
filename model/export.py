from ultralytics import YOLO
model = YOLO("model/yolo_smile_v1-3.pt")
model.export(
    format="tflite",
    imgsz=512,
    opset=12,
    dynamic=False,
    simplify=True
)

# import onnxruntime as ort

# session = ort.InferenceSession("model/yolo_smile_v1-3.onnx")
# print(session.get_inputs()[0].shape)
