import Log from '../../models/v1/log.js';

class LogController {
    constructor() {
        this.log = new Log();
    }

    async create(req, res) {
        try {
            const { name, description, level } = req.body;
            const result = await this.log.create(name, description, level);
            
            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async get(req, res) {
        try {
            const limit = req.query.limit ? Number(req.query.limit) : null;
            const result = await this.log.getLogs(limit);
            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }
}

export default LogController;