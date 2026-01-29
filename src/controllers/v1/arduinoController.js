class ArduinoController {
    constructor(arduino) {
        this.arduino = arduino;
    }

    async sendMess(req, res) {
        try {
            
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            })
        }
    }

    async receiveMess(req, res) {
        try {
            const response = await this.arduino.readMessage();
            if (response === "[EVENT][IP]") {
                console.log("HOY")
            }
            console.log(response)
            return res.status(200).json({
                success: true,
                timeEarned: ""
            })
        } catch (err) {
            return res.status(500).json({
            success: false,
            message: err.toString()
        })
        }
    }
    

}

export default ArduinoController;