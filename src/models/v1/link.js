import { connection } from "../../core/database.js";

class Link {
    constructor() {
        this.db = connection;
    }

    async createProhibitedLink(domain) {
        try {
            const [row] = await this.db.execute(
                `INSERT INTO prohibited_links (link, created_at) VALUES (?, NOW())`,
                [domain]
            );
            return row;
        }
        catch (err) {
            console.error("[ERROR] link.createProhibitedLink", err);
            throw err;
        }
    }

    async createAccessedLinkTransaction(clientId, domain) {
        try {
            const [row] = await this.db.execute(
                `INSERT INTO accessed_links (client_id, link, accessed_at) VALUES (?, ?, NOW())`,
                [clientId, domain]
            )
            return row;
        }
        catch (err) {
            console.error("[ERROR] link.createAccessedLinkTransaction", err);
            throw err;
        }
    }

    async getSpecificDomain(domain) {
        try {
            const [row] = await this.db.execute(
                `SELECT * FROM prohibited_links WHERE link=?`,
                [domain]
            )
            return row;
        }
        catch (err) {
            console.error("[ERROR] link.getSpecificDomain", err);
            throw err;
        }
    }

    async getAllProhibitedLinks() {
        try {
            const [row] = await this.db.execute(
                `SELECT * FROM prohibited_links ORDER BY created_at DESC`,
            )
            return row;
        }
        catch (err) {
            console.error("[ERROR] link.getAllProhibitedLinks", err);
            throw err;
        }
    }

    async getDomain(id) {
        try {
            const [row] = await this.db.execute(
                `SELECT * FROM prohibited_links WHERE id = ?`,
                [id]
            )
            return row;
        }
        catch (err) {
            console.error("[ERROR] link.getAllProhibitedLinks", err);
            throw err;
        }
    }

    async deleteProhibitedLink(id) {
        try {
            const [row] = await this.db.execute(
                `DELETE FROM prohibited_links WHERE id=?`,
                [id]
            );
            return row;
        }
        catch (err) {
            console.error("[ERROR] link.deleteProhibitedLink", err);
            throw err;
        }
    }

    async recordAccessedLink(ip, domain) {
        try {
            const [row] = await this.db.execute(
                `INSERT INTO accessed_links (ip, link, accessed_at) VALUES (?, ?, NOW())`,
                [ip, domain]
            )
        }
        catch (err) {
            console.error("[ERROR] link.recordAccessedLink", err);
            throw err;
        }
    }

    async getAccessedLink() {
        try {
            const [row] = await this.db.execute(
                `SELECT * FROM accessed_links`
            );
            return row;
        }
        catch (err) {
            console.error("[ERROR] link.getAccessedLink", err);
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

}

export default Link;