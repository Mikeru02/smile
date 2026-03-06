import runSpawnSync  from '../../utils/runSpawnSync.js';
import { CPUInfo, memoryInfo, storageInfo, networkInfo, OSName } from '../../utils/machineInformation.js';
import { checkInternet, checkModel } from '../../utils/dashboardInformation.js';
import Client from './client.js';
import Waste from './waste.js';
import Log from './log.js';
import Bin from './bin.js';
import Link from './link.js';

class Admin {
    constructor() {
        this.client = new Client();
        this.waste = new Waste();
        this.log = new Log();
        this.bin = new Bin();
        this.link = new Link();
    }

    async getDashboardInfo() {
        try {
            console.log("DEBUG HIt getDshboardInfo")
            return {
                server_start_time: new Date(Date.now() - process.uptime() * 1000).toISOString(),
                internet: checkInternet(),  
                model: await checkModel(),
                total_clients: (await this.client.getAll()).length,
                active_clients: (await this.client.getClientWithSpecificField("status", "active").length),
                waste_transactions: await this.waste.getAllWasteTransaction(),
                plastic_bottle: await this.waste.getAllSpecificWaste("PBTL"),
                paper: await this.waste.getAllSpecificWaste("PPRS"),
                general_waste: await this.waste.getAllSpecificWaste("GWST"),
                bin_count: (await this.bin.getAllBinTransaction()).length,
                top_sites: await this.link.getTopVisitedSites()
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
}

export default Admin;