class ArduinoController {
    constructor(arduino) {
        this.arduino = arduino;
    }

    async sendMessage(req, res) {
        try {
            
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            })
        }
    }

}

export default ArduinoController;