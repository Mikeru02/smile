import { spawn } from "child_process";
import fs from "fs";
import path from "path";

class Webcam {
  constructor(device = "/dev/video1", width = 1920, height = 1080) {
    this.device = device;
    this.width = width;
    this.height = height;
    this.outputFolder = path.join(process.cwd(), "captures");

    if (!fs.existsSync(this.outputFolder)) {
      fs.mkdirSync(this.outputFolder, { recursive: true });
    }
  }

  getFilePath(filename = "last_capture.jpg") {
    return path.join(this.outputFolder, filename);
  }

  capture(filename = "last_capture.jpg") {
    const filePath = this.getFilePath(filename);

    return new Promise((resolve, reject) => {
      const proc = spawn("v4l2-ctl", [
        "--device", this.device,
        "--stream-mmap",
        "--stream-count=1",
        "--stream-to", filePath,
        `--set-fmt-video=width=${this.width},height=${this.height},pixelformat=MJPG`
      ], {
        stdio: ["ignore", "ignore", "ignore"] // ignore logs
      });

      proc.on("close", (code) => {
        if (code === 0) {
          resolve(filePath);
        } else {
          reject(new Error(`v4l2-ctl exited with code ${code}`));
        }
      });

      proc.on("error", (err) => reject(err));
    });
  }
}

export default Webcam;