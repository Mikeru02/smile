import { spawn } from "child_process";
import Client from "../../models/v1/client.js";

class TestController {
    constructor(arduino) {
        this.arduino = arduino;
        this.client = new Client()
    }

    async sendMessage(req, res) {
        try {
            const { message } = req.body;
            await this.arduino.sendMessage(message)
            return res.status(200).json({
                success: true,
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            })
        }
    }

    async test(req, res) {
        try {
            return res.status(200).json({
                success: true,
                message: "Hello from test controller"
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            })
        }
    }

    async capture(req, res) {
        const py = spawn("python3", ["src/utils/runModel.py", 0]);
        let output = "";
        let errorOutput = "";

        py.stdout.on("data", (data) => {
        output += data.toString();
        });

        py.stderr.on("data", (data) => {
        errorOutput += data.toString();
        });

        py.on("close", (code) => {
        if (errorOutput) {
            console.error("Python error:", errorOutput);
        }

        try {
            const json = JSON.parse(output);
            res.json(json);
        } catch (err) {
            res.status(500).json({
            success: false,
            error: "Failed to parse Python output",
            raw: output,
            });
        }
        });
    }

    async testAdd(req, res) {
        try {
            this.arduino.sendCommand('DROPPING:true');
            // Wait for IR_DETECTED once
            const result = await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => reject(new Error("IR not detected in time")), 15000);

                const handler = async (data) => {
                    console.log("DEBUG", data);
                    data = data.trim();
                    if (data === "IR DETECTED") {
                        clearTimeout(timeout); // cancel timeout
                        this.arduino.parser.off("data", handler); // remove listener
                        try {
                            const earnedResult = await this.client.earned(req.ip, 10); // add 10 seconds
                            resolve(earnedResult);
                        } catch (err) {
                            reject(err);
                        }
                    }
                };

                this.arduino.parser.on("data", handler); // listen for IR_DETECTED
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            })
        }
    }
}

export default TestController;