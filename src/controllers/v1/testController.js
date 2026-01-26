class TestController {
    constructor(arduino) {
        this.arduino = arduino;
    }

    async sendMessage(req, res) {
        try {
            await this.arduino.sendMessage(req.params.message)
            return res.status(200).json({
                success: true,
                message: req.params.message
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
}

export default TestController;