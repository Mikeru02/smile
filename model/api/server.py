# server.py
from fastapi import FastAPI
from ultralytics import YOLO
import cv2
from fastapi.responses import JSONResponse

app = FastAPI()
model = YOLO("model/yolo_smile_v1-3/weights/best.pt")

@app.get("/predict")
def predict():
    cap = cv2.VideoCapture(0)
    for _ in range(10):
        cap.read()
    ret, frame = cap.read()
    cap.release()
    if not ret:
        return JSONResponse(content={"success": False, "error": "Failed to capture image"})
    
    results = model(frame, conf=0.7)
    detections = []
    for r in results:
        for cls_id, conf, box in zip(
            r.boxes.cls.cpu().numpy(),
            r.boxes.conf.cpu().numpy(),
            r.boxes.xyxy.cpu().numpy()
        ):
            class_name = r.names[int(cls_id)]
            detections.append({
                "class": class_name,
                "confidence": float(conf),
                "box": box.tolist()
            })
    return {"success": True, "detections": detections}
