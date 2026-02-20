import Log from '../../models/v1/log.js';

class LogController {
    constructor() {
        this.log = new Log();
    }

    async create(req, res) {
        try {
            const { name, description, level } = req.body;
            const result = await this.log.create(name, description, level);
            return result;
        } catch (err) {
            console.error("[ERROR] logController.create", err);
            throw err;
        }
    }
}

export default LogController;