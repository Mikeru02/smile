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

    async getLogs(limit = null) {
        try {
            let query = `SELECT * FROM logs ORDER BY timestamp DESC`;
            let params = [];

            if (limit !== null) {
                query += ` LIMIT ?`;
                params.push(limit);
            }

            const [rows] = await this.db.execute(query, params);
            return rows;
        } catch (err) {
            console.error("[ERROR] log.getLogs", err);
            throw err;
        }
    }
}

export default Log;