import { spawn } from "child_process";

class ArduinoController {
    constructor(arduino) {
        this.arduino = arduino;
    }

    capture(req, res) {
        const py = spawn("python3", ["src/utils/predictTrash.py"]);
        let output = "";

        py.stdout.on("data", (data) => {
            output += data.toString(); // collect all stdout
        });

        py.stderr.on("data", (err) => {
            console.error("Python stderr:", err.toString());
        });

        py.on("close", (code) => {
            console.log("Python exited with code:", code);

            try {
                // parse JSON from Python
                const result = JSON.parse(output.trim());

                if (result.success) {
                    this.arduino.sendMessage(result.label + "\n");
                }

                // respond **once** to frontend
                res.json(result);
            } catch (e) {
                console.error("Failed to parse Python output:", output);
                res.status(500).json({ success: false, error: "Invalid Python output" });
            }
        });
    }
}

export default ArduinoController;