import cv2
import numpy as np

# Load the ONNX model
net = cv2.dnn.readNet("yolov8n.onnx")

# Load image
img = cv2.imread("test.jpg")
blob = cv2.dnn.blobFromImage(img, 1/255.0, (320, 320), swapRB=True, crop=False)
net.setInput(blob)

# Run forward pass
outputs = net.forward()
print(outputs.shape)
