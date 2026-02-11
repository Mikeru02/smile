import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Webcam {
    constructor() {
        this.device = process.env.DEVICE || "/dev/video1";
        this.width = process.env.WIDTH || 512;
        this.height = process.env.HEIGHT || 384;
        this.format = process.env.FORMAT || "mjpeg";
        this.frames = process.env.FRAMES || 1;
        this.outputFolder = join(__dirname, '../captures');
    }

    getFilePath(filename = "last_capture.jpg") {
        return join(this.outputFolder, filename);
    }

    capture(filename = "last_capture.jpg") {
        const filePath = this.getFilePath(filename);

        return new Promise((resolve, reject) => {
            const ffmpeg = spawn("ffmpeg", [
                "-y", // overwrite
                "-f", "v4l2",
                "-input_format", this.format,
                "-video_size", `${this.width}x${this.height}`,
                "-i", this.device,
                "-frames:v", `${this.frames}`,
                filePath,
            ]);

            ffmpeg.stderr.on("data", (data) => console.log("STDERR", data.toString()));
            ffmpeg.stdout.on("data", (data) => console.log("STDOUT", data.toString()));

            ffmpeg.on("close", (code) => {
                if (code === 0) {
                    console.log("Image captured at:", filePath);
                    resolve(filePath);
                } else {
                    reject(new Error(`FFmpeg exited with code ${code}`));
                }
            });

            ffmpeg.on("error", (err) => reject(err));
        });
    }
}

export default Webcam;
