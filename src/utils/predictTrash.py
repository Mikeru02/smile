from ultralytics import YOLO
import cv2
import json
import sys

# Load YOLO model
model = YOLO("model/yolo_smile_v1-3/weights/best.pt")

# Open camera
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print(json.dumps({"success": False, "error": "No camera found"}))
    sys.exit(1)

# Capture frame
ret, frame = cap.read()
cap.release()

if not ret:
    print(json.dumps({"success": False, "error": "Failed to capture frame"}))
    sys.exit(1)

# Predict
results = model.predict(frame)
if len(results[0].boxes) == 0:
    print(json.dumps({"success": False, "error": "No objects detected"}))
    sys.exit(1)

# Get first detected class
label = int(results[0].boxes.cls[0].item())

# Output JSON for Node.js
print(json.dumps({"success": True, "label": label}))