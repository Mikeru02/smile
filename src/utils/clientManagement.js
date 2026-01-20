import runSpawnSync from './runSpawnSync.js';

const secondaryInterface = process.env.SECONDARY_INTERFACE;
const primaryInterface = process.env.PRIMARY_INTERFACE; // your internet-facing interface

export default class ClientManagement {
    static allowClient(ip) {
        runSpawnSync("iptables", ["-t", "nat", "-I", "PREROUTING", "-s", ip, "-p", "tcp", "--dport", "80", "-j", "RETURN"]);
        runSpawnSync("iptables", ["-t", "nat", "-I", "PREROUTING", "-s", ip, "-p", "udp", "--dport", "53", "-j", "RETURN"]);
        runSpawnSync("iptables", ["-I", "FORWARD", "-s", ip, "-o", "enxec9a0c164fda", "-j", "ACCEPT"]);
        runSpawnSync("iptables", ["-I", "FORWARD", "-d", ip, "-i", "enxec9a0c164fda", "-j", "ACCEPT"]);
        runSpawnSync("iptables", ["-t", "nat", "-I", "POSTROUTING", "-s", ip, "-o", "enxec9a0c164fda", "-j", "MASQUERADE"]);
        
            console.log(`[ALLOW] ${ip} internet allowed`);
    }




    static revokeClient(ip) {
        runSpawnSync("iptables", ["-t", "nat", "-D", "PREROUTING", "-s", ip, "-p", "tcp", "--dport", "80", "-j", "RETURN"]);
        runSpawnSync("iptables", ["-t", "nat", "-D", "PREROUTING", "-s", ip, "-p", "udp", "--dport", "53", "-j", "RETURN"]);
        runSpawnSync("iptables", ["-D", "FORWARD", "-s", ip, "-j", "ACCEPT"]);
        runSpawnSync("iptables", ["-D", "FORWARD", "-d", ip, "-j", "ACCEPT"]);
        runSpawnSync("iptables", ["-t", "nat", "-D", "POSTROUTING", "-s", ip, "-j", "MASQUERADE"]);
        runSpawnSync("conntrack", ["-D", "-s", ip]);
        runSpawnSync("conntrack", ["-D", "-d", ip]);

        console.log(`[REVOKE] ${ip} internet revoked`);
    }
}
