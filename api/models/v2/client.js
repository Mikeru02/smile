import { connection } from '../../core/database-sql.js';

class Client {
    constructor() {
        this.db = connection;
    }

    // Create Account
    async create(ip, name, course, yearlevel) {
        try {
            const [result, ] = await this.db.execute(
                'INSERT INTO clients (ip, name, course, yearlevel, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
                [ip, name, course, yearlevel, 'pending']
            );
            return result;
        } catch (err) {
            console.error("[ERROR] client.create", err);
            throw err;
        }
    }

    async authenticate(ip) {
        try {
            const clientData = await this.getClientByIP(ip);
            const timeRemaining = clientData.time_remaining + clientData.time_earned;
            const [result, ] = await this.db.execute(
                'UPDATE clients SET time_remaining=?, time_earned=?, status=?, connection_start_at=NOW(), updated_at=NOW() WHERE ip=?',
                [timeRemaining, 0, 'active', ip]
            );
            return result;
        } catch (err) {
            console.error("[ERROR] client.authenticate", err);
            throw err;
        }
    }

    async getClientTime(ip, type) {
        try {
            if (type === 'time_earned') {
                const [result, ] = await this.db.execute(
                    'SELECT time_earned FROM clients WHERE ip=?',
                    [ip]
                );
                return result?.[0];
            } else if (type === 'time_remaining') {
                const [result, ] = await this.db.execute(
                    'SELECT time_remaining FROM clients WHERE ip=?',
                    [ip]
                );
                return result?.[0];
            }
        } catch (err) {
            console.error("[ERROR] client.getClientEarnedTime", err);
            throw err;
        }
    }

    async getClientByIP(ip) {
        try {
            const [result, ] = await this.db.execute(
                'SELECT * FROM clients WHERE ip=?',
                [ip]
            );
            return result?.[0];
        } catch (err) {
            console.error("[ERROR] client.getClientByIP", err);
            throw err;
        }
    }

    async getClientByStatus(status) {
        try {
            const [result, ] = await this.db.execute(
                'SELECT * FROM clients WHERE status=?',
                [status]
            );
            console.log(result)
            return result;
        } catch (err) {
            console.error("[ERROR] client.getClientByStatus", err);
            throw err;
        }
    }

    async updateClientStatus(ip, status) {
        try {
            const [result, ] = await this.db.execute(
                'UPDATE clients SET status=?, updated_at=NOW() WHERE ip=?',
                [status, ip]
            )
            return result;
        } catch (err) {
            console.error("[ERROR] client.updateClientStatus", err);
            throw err;
        }
    }

    async earned(ip, timeEarned) {
        try {
            const clientData = await this.getClientByIP(ip);
            const totalTime = clientData.time_earned + timeEarned;
            const [result, ] = await this.db.execute(
                'UPDATE clients SET time_earned=?, updated_at=NOW() WHERE ip=?',
                [totalTime, ip]
            );
            return result;
        } catch (err) {
            console.error("[ERROR] client.earned", err);
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

export default Client;