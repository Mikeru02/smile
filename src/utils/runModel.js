import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pythonPath = join(__dirname, '../venv/bin/python');
const scriptPath = join(__dirname, 'runModel.py');

export function runModel() {
    return new Promise((resolve, reject) => {
        const py = spawn(pythonPath, [scriptPath]);

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
