import { connection } from '../../core/database.js';
import Client from './client.js';
import runSpawnSync  from '../../utils/runSpawnSync.js';
import { CPUInfo, memoryInfo, storageInfo, networkInfo, OSName } from '../../utils/machineInformation.js';
import { checkInternet, checkModel } from '../../utils/dashboardInformation.js';
import { encryptPassword } from '../../utils/hash.js';
import Log from './log.js';
import Waste from './waste.js';

class Admin {
    constructor() {
        this.db = connection;
        this.client = new Client();
        this.waste = new Waste();
        this.log = new Log();
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

    async createAccessedLinks(clientIP, domain) {
        try {
            const clientData = await this.client.getClientByIP(clientIP);

            const [row] = await this.db.execute(
                `INSERT INTO accessed_links (client_id, link, accessed_at) VALUES (?, ?, NOW())`,
                [clientData.id, domain]
            )
            return row;
        } catch(err) {
            console.error("[ERROR] admin.createAccessedLinks", err);
            throw err;
        }
    }

    async verifyAccount(username, password) {
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

    async getSpecificAccount(id) {
        try {
            const [rows] = await this.db.execute(
                'SELECT * FROM accounts WHERE id=?',
                [id]
            );
            return rows;
        } catch(err) {
            console.error("[ERROR] account.getAllAccounts", err);
            throw err;
        }
    }

    async getDashboardInfo() {
        try {
            console.log("DEBUG HIt getDshboardInfo")
            return {
                server_start_time: new Date(Date.now() - process.uptime() * 1000).toISOString(),
                internet: checkInternet(),  
                model: await checkModel(),
                total_clients: await this.client.getTotalClients(),
                active_clients: await this.client.getActiveClients(),
                waste_transactions: await this.waste.getAllWasteTransaction(),
                plastic_bottle: await this.waste.getAllSpecificWaste("PBTL"),
                paper: await this.waste.getAllSpecificWaste("PPRS"),
                general_waste: await this.waste.getAllSpecificWaste("GWST"),
                bin_count: await this.getAllBinTransaction(),
                most_visited: await this.getTopVisitedSites();
            }
        } catch(err) {
            console.error("[ERROR] admin.dashboardInfo", err);
            throw err;
        }
    }

    async getMachineInfo() {
        try {
            return {
                cpu: CPUInfo(),
                memory: memoryInfo(),
                storage: storageInfo(),
                network: networkInfo(),
                system_info: {
                    os_name: OSName(),
                    uptime: runSpawnSync('uptime', ['-p']),
                    kernel: runSpawnSync('uname', ['-r']),
                    architecture: runSpawnSync('uname', ['-m'])
                }
            };
        } catch(err) {
            console.error("[ERROR] admin.machineInfo", err);
            throw err;
        }
        
    }
    

    async getAllBinTransaction() {
        try {
            const [result] = await this.db.execute(
                'SELECT COUNT(*) FROM bin_logs WHERE DATE(created_at) = CURDATE()'
            );
            return result[0]['COUNT(*)'];
        } catch(err) {
            console.error("[ERROR] admin.getAllBinTransaction", err);
            throw err;
        }
    }

    async createProhibitedLinks(link) {
        try {
            const [rows] = await this.db.execute(
                `INSERT INTO prohibited_links (link, created_at) VALUES (?, NOW())`,
                [link]
            );
            return rows;
        } catch(err) {
            console.error("[ERROR] admin.getProhibitedLinks", err);
            throw err;
        }
    }

    async getProhibitedLinks() {
        try {
            const [rows] = await this.db.execute(
                `SELECT id, link FROM prohibited_links ORDER BY created_at DESC`
            );
            return rows;
        } catch(err) {
            console.error("[ERROR] admin.getProhibitedLinks", err);
            throw err;
        }
    }

    async getSpecificDomain(id) {
        try {
            const [row] = await this.db.execute(
                `SELECT * FROM prohibited_links WHERE id=?`,
                [id]
            );
            return row?.[0];
        } catch(err) {
            console.error("[ERROR] admin.getProhibitedLinks", err);
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
        } catch(err) {
            console.error("[ERROR] admin.getProhibitedLinks", err);
            throw err;
        }
    }
}

export default Admin;