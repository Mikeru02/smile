import fs from "fs";
import path from "path";
import V4L2Camera from "v4l2camera";

class Webcam {
    constructor() {
        this.device = process.env.DEVICE || "/dev/video1";
        this.width = parseInt(process.env.WIDTH) || 1920;
        this.height = parseInt(process.env.HEIGHT) || 1080;
        this.outputFolder = path.join(process.cwd(), 'captures');

        if (!fs.existsSync(this.outputFolder)) {
            fs.mkdirSync(this.outputFolder, { recursive: true });
        }

        // Open camera persistently
        this.cam = new V4L2Camera(this.device);

        if (!this.cam.configGet().formatName.includes("MJPG")) {
            throw new Error("Camera does not support MJPEG format!");
        }

        this.cam.configSet({
            width: this.width,
            height: this.height,
            pixelFormat: "MJPG"
        });

        this.cam.start(); // Start streaming persistently
    }

    getFilePath(filename = "last_capture.jpg") {
        return path.join(this.outputFolder, filename);
    }

    /**
     * Capture a single frame as MJPEG and save to file
     * Very fast because the camera is already streaming
     */
    capture(filename = "last_capture.jpg") {
        return new Promise((resolve, reject) => {
            const filePath = this.getFilePath(filename);

            this.cam.capture((success) => {
                if (!success) return reject(new Error("Failed to capture frame"));

                const frame = this.cam.toBuffer(); // MJPEG buffer
                fs.writeFile(filePath, frame, (err) => {
                    if (err) return reject(err);
                    console.log("Captured frame at:", filePath);
                    resolve(filePath);
                });
            });
        });
    }

    /**
     * Stop the camera when shutting down
     */
    stop() {
        this.cam.stop();
        console.log("Camera stopped");
    }
}

export default Webcam;