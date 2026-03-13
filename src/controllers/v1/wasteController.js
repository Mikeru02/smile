import Waste from "../../models/v1/waste.js";

class WasteController {
    constructor() {
        this.waste = new Waste();
    }

    // Create Functions         *****************************************
    async create(req, res) {
        try {
            const { waste_code, quantity, earned_time } = req.body || {};
            const response = this.waste.createTrashTransaction(res.locals.id, waste_code, quantity, earned_time);
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

    // Get Functions             *****************************************
    async getWasteTransaction(req, res) {
        try {

        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async getAllWasteTransactionCount(req, res) {
        try {
            const response = this.waste.getAllWasteTransaction();
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

    async getAllSpecificWasteTransaction(req, res) {
        try {
            const type = req.query.params;

            const response = this.waste.getAllWasteTransaction(type);
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

    async getAllWasteTransactionByClient(req, res) {
        try {

        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async getWastesTime(req, res) {
        try {
            const response = await this.waste.getWastesTime();
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

    async updateWasteTime(req, res) {
        try {
            const response = await this.waste.updateWasteTime(req.query.wasteCode, req.query.updatedTime)
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

export default WasteController;