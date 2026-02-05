import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function runModel() {
    return new Promise((resolve, reject) => {
        const modelPath = path.join(__dirname, 'runModel.py');
        const py = spawn("python3", [modelPath]);

        let output = "";

        py.stdout.on("data", (chunk) => {
            output += chunk.toString();
        });

        py.stderr.on("data", (err) => {
            console.error("Python error:", err.toString());
        });

        py.on("close", () => {
            try {
                const result = JSON.parse(output);
                resolve(result);
            } catch (e) {
                console.error("Failed to parse YOLO output:", e);
                reject(e);
            }
        });

        py.on("error", (err) => reject(err));
    });
}
