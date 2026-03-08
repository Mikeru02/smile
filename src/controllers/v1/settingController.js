import Setting from "../../models/v1/setting.js";

class SettingController {
    constructor() {
        this.setting = new Setting();
    }

    async get(req, res) {
        try {
            const response = await this.setting.get();
            return res.status(200).json({
                success: true,
                data: response
            })
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async update(req, res) {
        try {
            const response = await this.setting.update(req.body);
            return res.status(200).json({
                success: true,
                data: response
            })
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }
}

export default SettingController;