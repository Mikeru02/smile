from ultralytics import YOLO
import cv2
import json
import sys

def list_cameras(max_index=5):
    available = []
    for i in range(max_index):
        cap = cv2.VideoCapture(i)
        if cap.isOpened():
            available.append(i)
            cap.release()
    return available

cams = list_cameras()
print(cams)

if not cams:
    print(json.dumps({ "success": False, "error": "No camera found" }))
    sys.exit(0)

model = YOLO("model/yolo_smile_v1-3/weights/best.pt")

cap = cv2.VideoCapture(cams[0])

for _ in range(10):
    cap.read()

ret, frame = cap.read()
cap.release()

if not ret:
    print(json.dumps({ "success": False, "error": "Failed to capture image" }))
    sys.exit(0)

results = model(frame, conf=0.7)
cv2.imwrite("capture.jpg", frame)

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

print(json.dumps({
    "success": True,
    "cameras": cams,
    "detections": detections
}))