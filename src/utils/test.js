import NodeWebcamPkg from "node-webcam";
const NodeWebcam = NodeWebcamPkg

const opts = {
    width: 1280,
    height: 720,
    quality: 100,
    frames: 1,
    delay: 0,
    saveShot: true,
    output: "jpeg",
    device: "/dev/video0",
    callbackReturn: "location",
    verbose: false
}

const WebCam = NodeWebcam.create(opts);

WebCam.capture("test", function( err, data ) {
    if (err) {
        console.error("Capture error:", err);
        return;
    }
    console.log("Image saved at:", data);
})