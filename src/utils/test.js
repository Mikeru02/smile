import NodeWebcamPkg from "node-webcam";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const NodeWebcam = NodeWebcamPkg

const opts = {
    width: 1280,
    height: 720,
    quality: 100,
    frames: 1,
    delay: 0,
    saveShot: true,
    output: "jpg",
    device: "/dev/video0",
    callbackReturn: "location",
    verbose: false
}

const WebCam = NodeWebcam.create(opts);

const filePath = join(__dirname, "test.jpg")

WebCam.capture(filePath, function( err, data ) {
    if (err) {
        console.error("Capture error:", err);
        return;
    }
    console.log("Image saved at:", data);
})