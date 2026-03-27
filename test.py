from ultralytics import YOLO
import cv2

# Load the nano model
model = YOLO("yolov8n.pt")  # ultralightweight

# Load an image
img = cv2.imread("src/captures/test_capture.jpg")

# Run inference
results = model(img)

# Show/save results
results.show()  # opens an image window (if GUI) or saves to file
results.save()  # saves to ./runs/detect/exp
