import onnx

model = onnx.load("model/yolo_smile_v1-3.onnx")
for input_tensor in model.graph.input:
    dims = [d.dim_value for d in input_tensor.type.tensor_type.shape.dim]
    print(input_tensor.name, dims)
