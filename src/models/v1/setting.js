import { connection } from "../../core/database.js";

class Setting {
    constructor() {
        this.db = connection;
        this.allowedUpdateField = ["utility_mode", "auto_backup", "backup_freq", "compression", "location", "retention", "time_deduct", "updated_at"]
    }

    async get() {
        try {
            const [row] = await this.db.execute(
                `SELECT * FROM settings WHERE id = 1`
            );
            return row || null;
        }
        catch (err) {
            console.error("[ERROR] setting.get", err);
            throw err;
        }
    }

    async update(setFields) {
        try {
            const keys = Object.keys(setFields).filter(key => this.allowedUpdateField.includes(key));

            if (keys.length === 0) {
                console.error('[ERROR] setting.update: No fields to update!');
                return null;
            }

            const setClause = keys.map(key => `${key}=?`).join(", ");
            const clauseValues = keys.map(key => setFields[key]);

            const [row] = await this.db.execute(
                `UPDATE settings SET ${setClause}`,
                clauseValues
            )
            return row || null;
        }
        catch (err) {
            console.error("[ERROR] setting.update", err);
            throw err;
        }
    }

    async restore() {
        try {
            const [row] = await this.db.execute(
                `UPDATE settings SET auto_backup = ?, backup_freq = ?, compression = ?, location = ?, retention = ?`,
                [true, 'hourly', 'zip', '/root/backup/smile', 30]
            )

            return row || null;
        }
        catch (err) {
            console.error("[ERROR] setting.restore", err);
            throw err;
        }
    }
}

export default Setting;