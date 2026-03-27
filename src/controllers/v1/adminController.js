import jwt from 'jsonwebtoken';
import Admin from '../../models/v1/admin.js';
import Log from  '../../models/v1/log.js';
import ContentFiltering from '../../utils/contentFiltering.js';

class AdminController {
    constructor() {
        this.admin = new Admin();
        this.log = new Log();
    }

    async getDashboardInfo(req, res) {
        try {
            const result = await this.admin.getDashboardInfo();
            return res.status(200).json({
                success: true,
                data: result
            });
        } catch(err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async getMachineInfo(req, res) {
        try {
            const result = await this.admin.getMachineInfo();
            return res.status(200).json({
                success: true,
                data: result
            });
        } catch(err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async createAccessedLinks(req, res) {
        try {
            const {clientIP, domain} = req.body || {};
            const response = await this.admin.createAccessedLinks(clientIP, domain);
            return res.status(200).json({
                success: true,
                data: response
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }
}

export default AdminController;