import { connection } from '../../core/database.js';
import { checkInternet } from '../../utils/dashboardInformation.js';
import Waste from './waste.js';

class Client {
    constructor() {
        this.db = connection;
        this.waste = new Waste();
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

    async verfyClient(ip, name, course, yearlevel) {
        try {
            const [result, ] = await this.db.execute(
                'SELECT * FROM clients WHERE ip=? AND name=? AND course=? AND yearlevel=?',
                [ip, name, course, yearlevel]
            );
            return result;
        } catch (err) {
            console.error("[ERROR] client.verfyClient", err);
            throw err;
        }
    }

    async firstAuthenticate(ip) {
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

    async addTime(ip) {
        try {
            const clientData = await this.getClientByIP(ip);
            const timeRemaining = clientData.time_remaining + clientData.time_earned;
            const [result, ]= await this.db.execute(
                'UPDATE clients SET time_remaining=?, time_earned=?, status=?, updated_at=NOW() WHERE ip=?',
                [timeRemaining, 0, 'pending', ip]
            );
            return result;
        } catch (err) {
            console.error("[ERROR] client.addTime", err);
            throw err;
        }
    }

    async authenticate(ip) {
        try {
            const [result, ] = await this.db.execute(
                'UPDATE clients SET status=?, connection_start_at=NOW(), updated_at=NOW() WHERE ip=?',
                ['active', ip]
            );
            return result;
        } catch (err) {
            console.error("[ERROR] client.authenticate", err);
            throw err;
        }
    }

    async deauthenticate(ip) {
        try {
            const newTimeRemaining = await this.updateClientTime(ip);
            const [result, ] = await this.db.execute(
                'UPDATE clients SET status=?, connection_start_at=?, time_remaining=?, updated_at=NOW() WHERE ip=?',
                ['paused', null, newTimeRemaining, ip]
            );
            return result;
        } catch (err) {
            console.error("[ERROR] client.deauthenticate", err);
            throw err;
        }
    }

    async revoke(ip) {
        try {
            const [result, ] = await this.db.execute(
                'UPDATE clients SET status=?, time_remaining=?, connection_start_at=?, updated_at=NOW() WHERE ip=?',
                ["pending", 0, null, ip]
            )
        } catch (err) {
            console.error("[ERROR] client.revoke", err);
            throw err;
        }
    }

    async getClientTime(ip, type) {
        try {
            console.log("DEBUG API: ", type)
            const [result, ] = await this.db.execute(
                `SELECT ${type} FROM clients WHERE ip=?`,
                [ip]
            );
            return result?.[0];
        } catch (err) {
            console.error("[ERROR] client.getClientEarnedTime", err);
            throw err;
        }
    }

    async getClientByID(id) {
        try {
            const [result, ] = await this.db.execute(
                'SELECT * FROM clients WHERE id=?',
                [id]
            );

            const wasteCount = await this.waste.getTrashTransactionsByClient(id);
            result[0].waste_collected = wasteCount[0].count;
            return result?.[0];
        } catch (err) {
            console.error("[ERROR] client.getClientByID", err);
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
            console.log(result);
            return result;
        } catch (err) {
            console.error("[ERROR] client.getClientByStatus", err);
            throw err;
        }
    }

    async getAllOutofTimeClients() {
        try {
            const [result,] = await this.db.execute(
                "SELECT ip FROM clients WHERE status='outOfTime'",
                []
            );
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

    async earned(ip, wasteCode, timeEarned) {
        try {
            const clientData = await this.getClientByIP(ip);
            const totalTime = clientData.time_earned + timeEarned;
            const [result, ] = await this.db.execute(
                'UPDATE clients SET time_earned=?, updated_at=NOW() WHERE ip=?',
                [totalTime, ip]
            );
            await this.waste.createTrashTransaction(clientData.id, wasteCode, 1, timeEarned);
            return result;
        } catch (err) {
            console.error("[ERROR] client.earned", err);
            throw err;
        }
    }

    async updateAllClientsTime() {
        try {
            
            const [clients] = await this.db.execute(
                "SELECT ip, time_remaining, connection_start_at FROM clients WHERE status='active' AND time_remaining > 0",
                []
            );

            for (const client of clients) {
                const newTimeRemaining = await this.updateClientTime(client.ip);
                if (newTimeRemaining <= 0) {
                    await this.updateClientStatus(client.ip, 'outOfTime');
                    await this.db.execute(
                        "UPDATE clients SET connection_start_at=?, time_remaining=?, updated_at=NOW() WHERE ip=?",
                        [null, 0, client.ip]
                    )
                }
                const [result, ] = await this.db.execute(
                    'UPDATE clients SET connection_start_at=NOW(), time_remaining=?, updated_at=NOW() WHERE ip=?',
                    [newTimeRemaining, client.ip]
                );
            }
            
            // return result;
        } catch(err) {
            console.error("[ERROR] client.updateAllClients", err);
            throw err;
        }
    }

    async getTimeRemainingAndConnectionStart(ip) {
        try {
            const [row] = await this.db.execute(
                'SELECT time_remaining, connection_start_at FROM clients WHERE ip=?',
                [ip]
            );
            if (!row.length) {
                return null;
            }
            return row?.[0];
        } catch(err) {
            console.error("[ERROR] client.getTimeRemainingAndConnectionStart", err);
            throw err;
        }
    }

    async updateClientTime(ip) {
        try {
            const client = await this.getTimeRemainingAndConnectionStart(ip);
            let newTimeRemaining = client.time_remaining;

            if (client.connection_start_at) {
                const now = new Date();
                const connectionStart = new Date(client.connection_start_at);

                const consumedSeconds = Math.floor((now - connectionStart) / 1000);

                newTimeRemaining = Math.max(client.time_remaining - consumedSeconds, 0);
            }
            return newTimeRemaining;
        } catch(err) {
            console.error("[ERROR] client.updateClientTime", err);
            throw err;
        }
    }

    async getAllClients(n = 10) {
        try {
            const [rows ] = await this.db.execute(
                `SELECT * FROM clients ORDER BY id DESC LIMIT ${n}`,
            );
            return rows;
        } catch(err) {
            console.error("[ERROR] client.getAllClients", err);
            throw err;
        }
    }

    async getTotalClients() {
        try {
            const [result] = await this.db.execute(
                'SELECT COUNT(*) FROM clients'
            );
            return result[0]['COUNT(*)'];
        } catch(err) {
            console.error("[ERROR] client.getTotalClients", err);
            throw err;
        }
    }

    async getActiveClients() {
        try {
            const [result] = await this.db.execute(
                'SELECT COUNT(*) FROM clients WHERE status="active"'
            );
            return result[0]['COUNT(*)'];
        } catch(err) {
            console.error("[ERROR] client.getAtiveClients", err);
            throw err;
        }
    }

    async checkInternetConnection() {
        try {
            return {
                internet: checkInternet()
            }
        } catch(err) {
            console.error("[ERROR] client.checkInternet", err);
            throw err;
        }
    }
}

export default Client;