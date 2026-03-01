import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Webcam {
    constructor() {
        this.device = process.env.DEVICE || "/dev/video0";
        this.width = process.env.WIDTH || 1920;
        this.height = process.env.HEIGHT || 1080;
        this.outputFolder = join(__dirname, '../captures');
        fs.mkdir(this.outputFolder, { recursive: true }).catch(err => {
            console.error("Failed to create capture folder:", err);
        });
    }

    getFilePath(filename = "last_capture.jpg") {
        return join(this.outputFolder, filename);
    }

    capture(filename = "last_capture.jpg") {
        const filePath = this.getFilePath(filename);

        return new Promise((resolve, reject) => {
            const fswebcam = spawn("fswebcam", [
                "-d", this.device,
                "-r", `${this.width}x${this.height}`,
                "--no-banner",
                "-D", "1000", // zero delay
                filePath
            ]);

            fswebcam.stdout.on("data", (data) => {});
            fswebcam.stderr.on("data", (data) => {
                console.log(data.toString());
            });

            fswebcam.on("close", (code) => {
                if (code === 0) {
                    console.log("Image captured at:", filePath);
                    resolve(filePath);
                } else {
                    reject(new Error(`fswebcam exited with code ${code}`));
                }
            });

            fswebcam.on("error", (err) => reject(err));
        });
    }
}

export default Webcam;