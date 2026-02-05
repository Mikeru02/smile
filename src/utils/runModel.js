import { spawn } from "child_process";

export function runModel() {
    return new Promise((resolve, reject) => {
        const py = spawn("python3", ["runModel.py"]);

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
