import { connection } from "../../core/database.js";

class Bin {
    constructor() {
        this.db = connection;
    }

    // Create Functions     *****************************************
    async createBin(code, name) {
        try {
            const [row] = await this.db.execute(
                `INSERT INTO bins (bin_code, name, created_at, updated_at) VALUES (?, ?, NOW(), NOW())`,
                [code, name]
            );
            return row;
        }
        catch (err) {
            console.error("[ERROR] bin.createBin", err);
            throw err;
        }
    }

    async createBinTransaction(code) {
        try {
            const [row] = await this.db.execute(
                `INSERT INTO bin_logs (bin_code, created_at) VALUES (?, NOW())`,
                [code]
            );
            return row;
        }
        catch (err) {
            console.error("[ERROR] bin.createBinTransaction", err);
            throw err;
        }
    }

    // Get Functions        *****************************************
    async getAllBinTransaction() {
        try {
            const [row] = await this.db.execute(
                `SELECT * FROM bin_logs WHERE DATE(created_at) = CURDATE()`
            );
            return row;
        }
        catch (err) {
            console.error("[ERROR] bin.getAllBinTransactionCount", err);
            throw err;
        }
    }

    async getAllSpecificBinTransaction(code) {
        try {
            const [row] = await this.db.execute(
                `SELECT COUNT(*) FROM bin_logs WHERE bin_code = ? AND DATE(created_at) = CURDATE()`,
                [code]
            );
            return row[0]['COUNT(*)']
        }
        catch (err) {
            console.error("[ERROR] bin.getAllBinTransactionCount", err);
            throw err;
        }
    }

    async getTopVisitedSites() {
        try {
            const [rows] = await this.db.execute(`
                SELECT 
                    REPLACE(SUBSTRING_INDEX(link, '/', 1), 'www.', '') AS domain,
                    COUNT(*) AS visits
                FROM accessed_links
                GROUP BY domain
                ORDER BY visits DESC
                LIMIT 3
            `);

            return rows; // rows will be [{domain: 'google.com', visits: 6}, ...]
        } catch(err) {
            console.error("[ERROR] admin.getTopVisitedSites", err);
            throw err;
        }
    }

    // Update Functions     *****************************************
    // Delete Functions     *****************************************
}

export default Bin;