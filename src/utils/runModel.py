from ultralytics import YOLO
import cv2

def list_cameras(max_index=5):
    available = []
    for i in range(max_index):
        cap = cv2.VideoCapture(i)
        if cap.isOpened():
            available.append(i)
            cap.release()
    return available

cams = list_cameras()
print("Available cameras:", cams)

# Load your trained YOLO model
model = YOLO("model/yolo_smile_v1-3/weights/best.pt")

# Capture one frame from the webcam
cap = cv2.VideoCapture(0)

cap = cv2.VideoCapture(0)

# Warm up the camera
for _ in range(10):
    ret, frame = cap.read()

ret, frame = cap.read()
cap.release()

if not ret:
    print("Failed to capture image")
    exit()

# Run YOLO prediction on the captured frame
results = model(frame, conf=0.7)

print(results)

# Optionally, save the raw frame (without labels)
cv2.imwrite("capture.jpg", frame)

# Print the YOLO results
for r in results:
    boxes = r.boxes  # ultralytics.engine.results.Boxes object
    class_ids = boxes.cls.cpu().numpy()  # class indices as numpy array
    confs = boxes.conf.cpu().numpy()     # confidence scores
    coords = boxes.xyxy.cpu().numpy()    # bounding boxes [x1, y1, x2, y2]

    # Loop through detections
    for cls_id, conf, box in zip(class_ids, confs, coords):
        class_name = r.names[int(cls_id)]
        if class_name == "General Waste":
            print("Detected General Waste!")
            print("Box:", box)
            print("Confidence:", conf)