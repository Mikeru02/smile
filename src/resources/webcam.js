import { spawn } from "child_process";
import fs from "fs";
import path from "path";

class Webcam {
    constructor(device = "/dev/video1", width = 1920, height = 1080) {
        this.device = device;
        this.width = width;
        this.height = height;
        this.outputFolder = path.join(process.cwd(), 'captures');
        this.frameBuffer = Buffer.alloc(0);

        if (!fs.existsSync(this.outputFolder)) {
            fs.mkdirSync(this.outputFolder, { recursive: true });
        }

        // Spawn v4l2-ctl in persistent streaming mode
        this.proc = spawn("v4l2-ctl", [
            "--device", this.device,
            "--stream-mmap",
            "--stream-count=0",           // stream indefinitely
            "--stream-to=-",               // output to stdout
            `--set-fmt-video=width=${this.width},height=${this.height},pixelformat=MJPG`
        ]);

        this.proc.stdout.on("data", (chunk) => {
            // accumulate incoming MJPEG data
            this.frameBuffer = Buffer.concat([this.frameBuffer, chunk]);
        });

        this.proc.stderr.on("data", () => {});

        this.proc.on("close", (code) => {
            console.log("v4l2-ctl exited with code", code);
        });
    }

    getFilePath(filename = "last_capture.jpg") {
        return path.join(this.outputFolder, filename);
    }

    /**
     * Capture a single full MJPEG frame
     */
    async capture(filename = "last_capture.jpg") {
        const filePath = this.getFilePath(filename);

        return new Promise((resolve, reject) => {
            const tryFrame = () => {
                const start = this.frameBuffer.indexOf(Buffer.from([0xFF, 0xD8])); // SOI
                const end = this.frameBuffer.indexOf(Buffer.from([0xFF, 0xD9]));   // EOI

                if (start !== -1 && end !== -1 && end > start) {
                    const frame = this.frameBuffer.slice(start, end + 2);
                    this.frameBuffer = this.frameBuffer.slice(end + 2);

                    fs.writeFile(filePath, frame, (err) => {
                        if (err) return reject(err);
                        console.log("Captured frame at:", filePath);
                        resolve(filePath);
                    });
                } else {
                    // no full frame yet, try again shortly
                    setTimeout(tryFrame, 10);
                }
            };

            tryFrame();
        });
    }

    stop() {
        if (this.proc) this.proc.kill();
        console.log("Camera stopped");
    }
}

export default Webcam;