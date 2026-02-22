import { connection } from '../../core/database.js';

class Log {
    constructor() {
        this.db = connection;
    }

    async create(name, description, level) {
        try {
            console.log('Creating Logs');
            const result = this.db.execute(
                "INSERT INTO logs (name, description, level, timestamp) VALUES (?, ?, ?, NOW())",
                [name, description, level]
            );
            return result;
        } catch (err) {
            console.error("[ERROR] log.create", err);
            throw err;
        }
    }

    async getLogs(limit = 10) {
        try {
            const [rows] = await this.db.execute(
                `SELECT * FROM logs ORDER BY id DESC LIMIT ${limit}`,
            );
            return rows;
        } catch (err) {
            console.error("[ERROR] log.getLogs", err);
            throw err;
        }
    }
}

export default Log;