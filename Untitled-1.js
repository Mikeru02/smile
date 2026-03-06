import { connection } from '../../core/database.js';
import { encryptPassword } from '../../utils/hash.js';

class Account {
    constructor() {
        this.db = connection;
    }

    async create(username, name, role, password) {
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

    async verify(username, password) {
        try {
            const [rows] = await this.db.execute(
                'SELECT * FROM accounts WHERE username=?',
                [username]
            );

            if (rows.length === 0) return null;

            const user = rows[0];

            // Compare password in Node
            if (encryptPassword(password) !== user.password) return null;

            // Update last_login by ID
            const [updateResult] = await this.db.execute(
                'UPDATE accounts SET last_login=NOW() WHERE id=?',
                [user.id]
            );

            console.log("Updated rows:", updateResult.affectedRows);

            return user;
        } catch(err) {
            console.error("[ERROR] account.verify", err);
            throw err;
        }
    }

    async getAllAccounts() {
        try {
            const [rows] = await this.db.execute(
                'SELECT * FROM accounts ORDER BY created_at DESC'
            );
            return rows;
        } catch(err) {
            console.error("[ERROR] account.getAllAccounts", err);
            throw err;
        }
    }

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

export default Account