import { connection } from '../../core/database.js';
import memoryInfo from '../../utils/getMemoryInfo.js';

class Admin {
    constructor() {
        this.db = connection;
    }

    async createAccount(username, name, role, password) {
        try {
            const [result] = await this.db.execute(
                'INSERT INTO accounts (username, name, role, password, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
                [username, name, role, encryptPassword(password)]
            );
            return result;
        } catch(err) {
            console.error("[ERROR] account.create", err);
            throw err;
        }
    }

    async verifyAccount(username, password) {
        try {
            const [result] = await this.db.execute(
                'SELECT * FROM accounts WHERE username=? AND password=?',
                [username, encryptPassword(password)]
            );
            return result;
        } catch(err) {
            console.error("[ERROR] account.verify", err);
            throw err;
        }
    }

    async getMemoryInfo() {
        const memoryInfo = memoryInfo();
    }
}

export default Admin;