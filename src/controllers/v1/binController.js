import Bin from "../../models/v1/bin.js";

class BinController {
    constructor() {
        this.bin = new Bin();
    }

    async createBin(req, res) {
        try {
            const { code, name } = req.body || {};
            const response = await this.bin.createBin(code, name);
            return res.json(200).json({
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

    async createBinTransaction(req, res) {
        try {
            const { code } = req.body || {};
            const response = await this.bin.createBinTransaction(code);
            return res.json(200).json({
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

    async getAllBinTransaction(req, res) {
        try {
            const response = await this.bin.getAllBinTransaction();
            return res.json(200).json({
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

    async getSpecificBinTransaction(req, res) {
        try {
            const response = await this.bin.getAllSpecificBinTransaction(req.params.bin);
            return res.json(200).json({
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

export default BinController;