import { connection } from '../../core/database-sql.js';
import { encryptPassword } from '../../utils/hash.js';

class Account {
    constructor() {
        this.db = connection;
    }

    // Create Account
    async create(username, name, role, password) {
        try {
            const [result, ] = await this.db.execute(
                'INSERT INTO accounts (username, name, role, password, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
                [username, name, role, encryptPassword(password)]
            );
            return result;
        } catch(err) {
            console.error("[ERROR] account.create", err);
            throw err;
        }
    }

    // Verify Account
    async verify(username, password) {
        try {
            const [result, ] = await this.db.execute(
                'SELECT * FROM accounts WHERE username=? AND password=?',
                [username, password]
            );
            return result?.[0];
        } catch(err) {
            console.error("[ERROR] account.verify", err);
            throw err;
        }
    }

    // Get Account
    async get(username) {
        try {
            const [result, ] = await this.db.execute(
                'SELECT * FROM accounts WHERE username=?',
                [username]
            );
            return result;
        } catch(err) {
            console.error("[ERROR] account.get", err);
            throw err;
        }
    }

    // Update Account
    async update(username, name, role, password) {
        try {
            const [result, ] = await this.db.execute(
                'UPDATE accounts SET name=?, role=?, password=? WHERE username=?',
                [name, role, encryptPassword(password), username]
            );
            return result;
        } catch(err) {
            console.error("[ERROR] account.update", err);
            throw err;
        }
    }

    // Delete Account
    async delete(username) {
        try {
            const [result, ]= await this.db.execute(
                'DELETE FROM accounts WHERE username=?',
                [username]
            );
            return result;
        } catch(err) {
            console.error("[ERROR] account.delete", err);
            throw err;
        }
    }
}

export default Account;