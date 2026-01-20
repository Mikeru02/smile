import runSpawnSync from './runSpawnSync.js';

export default class ClientManagement {
    static allowClient(ip) {
        // Stop portal redirect for this client
        runSpawnSync("iptables", ["-t", "nat", "-I", "PREROUTING", "-s", ip, "-p", "tcp", "--dport", "80", "-j", "RETURN"]);
        runSpawnSync("iptables", ["-t", "nat", "-I", "PREROUTING", "-s", ip, "-p", "tcp", "--dport", "443", "-j", "RETURN"]);
        runSpawnSync("iptables", ["-t", "nat", "-I", "PREROUTING", "-s", ip, "-p", "udp", "--dport", "53", "-j", "RETURN"]);

        // Forward traffic
        runSpawnSync("iptables", ["-I", "FORWARD", "-s", ip, "-o", "enxec9a0c164fda", "-j", "ACCEPT"]);
        runSpawnSync("iptables", ["-I", "FORWARD", "-d", ip, "-i", "enxec9a0c164fda", "-m", "state", "--state", "ESTABLISHED,RELATED", "-j", "ACCEPT"]);

        // NAT outgoing for client
        runSpawnSync("iptables", ["-t", "nat", "-I", "POSTROUTING", "-s", ip, "-o", "enxec9a0c164fda", "-j", "MASQUERADE"]);

        // Flush old connections
        runSpawnSync("conntrack", ["-D", "-s", ip]);
        runSpawnSync("conntrack", ["-D", "-d", ip]);


        console.log(`[ALLOW] ${ip} internet allowed`);
    }

    static revokeClient(ip) {
        // Restore portal redirect
        runSpawnSync("iptables", ["-t", "nat", "-D", "PREROUTING", "-s", ip, "-p", "tcp", "--dport", "80", "-j", "RETURN"]);
        runSpawnSync("iptables", ["-t", "nat", "-D", "PREROUTING", "-s", ip, "-p", "udp", "--dport", "53", "-j", "RETURN"]);

        // Remove forwarding for this client
        runSpawnSync("iptables", ["-D", "FORWARD", "-s", ip, "-o", "enxec9a0c164fda", "-j", "ACCEPT"]);
        runSpawnSync("iptables", ["-D", "FORWARD", "-d", ip, "-i", "enxec9a0c164fda", "-m", "state", "--state", "ESTABLISHED,RELATED", "-j", "ACCEPT"]);

        // Remove NAT for this client
        runSpawnSync("iptables", ["-t", "nat", "-D", "POSTROUTING", "-s", ip, "-o", "enxec9a0c164fda", "-j", "MASQUERADE"]);

        // Flush active connections
        runSpawnSync("conntrack", ["-D", "-s", ip]);
        runSpawnSync("conntrack", ["-D", "-d", ip]);

        console.log(`[REVOKE] ${ip} internet revoked`);
    }
}
