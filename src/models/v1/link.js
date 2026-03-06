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

    async getAllProhibitedLinks() {
        try {
            const [row] = await this.db.execute(
                `SELECT * FROM prohibited_links`,
            )
            return row;
        }
        catch (err) {
            console.error("[ERROR] link.getAllProhibitedLinks", err);
            throw err;
        }
    }

    async deleteProhibitedLink(domain) {
        try {
            const [row] = await this.db.execute(
                `DELETE FROM prohibited_links WHERE link=?`,
                [domain]
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

}

export default Link;