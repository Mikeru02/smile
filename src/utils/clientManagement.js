import runSpawnSync from './runSpawnSync.js';

const secondaryInterface = process.env.SECONDARY_INTERFACE;
const primaryInterface = process.env.PRIMARY_INTERFACE; // your internet-facing interface

export default class ClientManagement {
    static allowClient(ip) {
        // Bypass DNS hijack
        runSpawnSync("iptables", [
            "-t", "nat", "-I", "PREROUTING", "1",
            "-i", "enxec9a0c1bee94",
            "-s", ip,
            "-p", "udp", "--dport", "53",
            "-j", "RETURN"
        ]);

        // Bypass HTTP hijack
        runSpawnSync("iptables", [
            "-t", "nat", "-I", "PREROUTING", "1",
            "-i", "enxec9a0c1bee94",
            "-s", ip,
            "-p", "tcp", "--dport", "80",
            "-j", "RETURN"
        ]);

        // Allow internet forwarding
        runSpawnSync("iptables", [
            "-I", "ALLOWED_CLIENT", "1",
            "-s", ip,
            "-o", "enxec9a0c164fda",
            "-m", "state",
            "--state", "NEW,ESTABLISHED,RELATED",
            "-j", "ACCEPT"
        ]);
    }




    static revokeClient(ip) {
        
        console.log(`[REVOKE] ${ip} internet revoked`);
    }
}
