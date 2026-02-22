import { connection } from '../../core/database.js';
import Client from './client.js';
import runSpawnSync  from '../../utils/runSpawnSync.js';
import { CPUInfo, memoryInfo, storageInfo, networkInfo, OSName } from '../../utils/machineInformation.js';
import { checkInternet, checkModel } from '../../utils/dashboardInformation.js';
import { encryptPassword } from '../../utils/hash.js';

class Admin {
    constructor() {
        this.db = connection;
        this.client = new Client();
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
            return result?.[0];
        } catch(err) {
            console.error("[ERROR] admin.verifyAccount", err);
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

    async getAllWasteTransaction() {
        try {
            const [result] = await this.db.execute(
                'SELECT COUNT(*) FROM waste_transactions WHERE DATE(transaction_date) = CURDATE()'
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