import { connection } from '../../core/database.js';
import runSpawnSync  from '../../utils/runSpawnSync.js';
import { CPUInfo, memoryInfo, storageInfo, networkInfo, OSName } from '../../utils/machineInformation.js';
import { checkInternet, checkModel } from '../../utils/dashboardInformation.js';

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

    async getDashboardInfo() {
        try {
            return {
                server_start_time: new Date(Date.now() - process.uptime() * 1000),
                internet: checkInternet(),
                model: await checkModel(),
                total_clients: await this.getTotalClients(),
                active_clients: await this.getActiveClients(),
                waste_transactions: await this.getAllWasteTransaction(),
                plastic_bottle: await this.getAllSpecificWaste("PBTL"),
                paper: await this.getAllSpecificWaste("PPRS"),
                general_waste: await this.getAllSpecificWaste("GWST"),
                bn_count: await this.getAllBinTransaction()
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

    async getTotalClients() {
        try {
            const [result] = await this.db.execute(
                'SELECT COUNT(*) FROM clients'
            );
            return result[0]['COUNT(*)'];
        } catch(err) {
            console.error("[ERROR] admin.getTotalClients", err);
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
            console.error("[ERROR] admin.getAtiveClients", err);
            throw err;
        }
    }

    async getAllWasteTransaction() {
        try {
            const [result] = await this.db.execute(
                'SELECT COUNT(*) FROM waste_transactions WHERE DATE(created_at) = CURDATE()'
            );
            return result[0]['COUNT(*)'];
        } catch(err) {
            console.error("[ERROR] admin.getAllWasteTransaction", err);
            throw err;
        }
    }

    async getAllSpecificWaste(type) {
        try {
            const [result] = await this.db.execute(
                'SELECT COUNT(*) FROM waste_transactions WHERE waste_code=?',
                [type]
            );
            return result[0]['COUNT(*)'];
        } catch(err) {
            console.error("[ERROR] admin.getAllSpecificWaste", err);
            throw err;
        }
    }

    async getAllBinTransaction() {
        try {
            const [result] = await this.db.execute(
                'SELECT COUNT(*) FROM bin_logs'
            );
            return result[0]['COUNT(*)'];
        } catch(err) {
            console.error("[ERROR] admin.getAllBinTransaction", err);
            throw err;
        }
    }
}

export default Admin;