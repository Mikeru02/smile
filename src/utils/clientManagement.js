import runSpawnSync from './runSpawnSync.js';

export default class ClientManagement {
    static allowClient(ip) {
        // Stop portal redirect
        runSpawnSync("iptables", ["-t", "nat", "-I", "PREROUTING", "-s", ip, "-j", "RETURN"]);

        // Forward all traffic from this client
        runSpawnSync("iptables", ["-I", "FORWARD", "-s", ip, "-o", "enxec9a0c164fda", "-j", "ACCEPT"]);
        runSpawnSync("iptables", ["-I", "FORWARD", "-d", ip, "-i", "enxec9a0c164fda", "-m", "state", "--state", "ESTABLISHED,RELATED", "-j", "ACCEPT"]);

        // NAT for client
        runSpawnSync("iptables", ["-t", "nat", "-I", "POSTROUTING", "-s", ip, "-o", "enxec9a0c164fda", "-j", "MASQUERADE"]);

        console.log(`[ALLOW] ${ip} internet allowed`);
    }

    static revokeClient(ip) {
        // Restore portal redirect
        runSpawnSync("iptables", ["-t", "nat", "-D", "PREROUTING", "-s", ip, "-j", "RETURN"]);

        // Remove forwarding
        runSpawnSync("iptables", ["-D", "FORWARD", "-s", ip, "-o", "enxec9a0c164fda", "-j", "ACCEPT"]);
        runSpawnSync("iptables", ["-D", "FORWARD", "-d", ip, "-i", "enxec9a0c164fda", "-j", "ACCEPT"]);

        // Remove NAT
        runSpawnSync("iptables", ["-t", "nat", "-D", "POSTROUTING", "-s", ip, "-o", "enxec9a0c164fda", "-j", "MASQUERADE"]);

        // Kill active connections
        runSpawnSync("conntrack", ["-D", "-s", ip]);
        runSpawnSync("conntrack", ["-D", "-d", ip]);

        console.log(`[REVOKE] ${ip} internet revoked`);
    }
}
