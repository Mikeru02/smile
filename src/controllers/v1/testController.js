import { spawn } from "child_process";

class TestController {
    constructor(arduino) {
        this.arduino = arduino;
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
}

export default TestController;