import runSpawnSync from './runSpawnSync.js';

export default class ClientManagement {
    static allowClient(ip) {
        // --- STOP PORTAL REDIRECT ---
        // HTTP
        runSpawnSync("iptables", ["-t", "nat", "-I", "PREROUTING", "-s", ip, "-p", "tcp", "--dport", "80", "-j", "RETURN"]);
        // HTTPS
        runSpawnSync("iptables", ["-t", "nat", "-I", "PREROUTING", "-s", ip, "-p", "tcp", "--dport", "443", "-j", "RETURN"]);
        // DNS UDP
        runSpawnSync("iptables", ["-t", "nat", "-I", "PREROUTING", "-s", ip, "-p", "udp", "--dport", "53", "-j", "RETURN"]);

        // --- FORWARD CLIENT TRAFFIC ---
        // HTTP/HTTPS/other
        runSpawnSync("iptables", ["-I", "FORWARD", "-s", ip, "-o", "enxec9a0c164fda", "-j", "ACCEPT"]);
        runSpawnSync("iptables", ["-I", "FORWARD", "-d", ip, "-i", "enxec9a0c164fda", "-m", "state", "--state", "ESTABLISHED,RELATED", "-j", "ACCEPT"]);

        // DNS forwarding
        runSpawnSync("iptables", ["-I", "FORWARD", "-s", ip, "-p", "udp", "--dport", "53", "-o", "enxec9a0c164fda", "-j", "ACCEPT"]);
        runSpawnSync("iptables", ["-I", "FORWARD", "-d", ip, "-p", "udp", "--sport", "53", "-i", "enxec9a0c164fda", "-m", "state", "--state", "ESTABLISHED,RELATED", "-j", "ACCEPT"]);

        // --- NAT FOR CLIENT ---
        runSpawnSync("iptables", ["-t", "nat", "-I", "POSTROUTING", "-s", ip, "-o", "enxec9a0c164fda", "-j", "MASQUERADE"]);

        console.log(`[ALLOW] ${ip} internet allowed`);
    }

    static revokeClient(ip) {
        // --- RESTORE PORTAL REDIRECT ---
        runSpawnSync("iptables", ["-t", "nat", "-D", "PREROUTING", "-s", ip, "-p", "tcp", "--dport", "80", "-j", "RETURN"]);
        runSpawnSync("iptables", ["-t", "nat", "-D", "PREROUTING", "-s", ip, "-p", "tcp", "--dport", "443", "-j", "RETURN"]);
        runSpawnSync("iptables", ["-t", "nat", "-D", "PREROUTING", "-s", ip, "-p", "udp", "--dport", "53", "-j", "RETURN"]);

        // --- REMOVE FORWARDING ---
        runSpawnSync("iptables", ["-D", "FORWARD", "-s", ip, "-o", "enxec9a0c164fda", "-j", "ACCEPT"]);
        runSpawnSync("iptables", ["-D", "FORWARD", "-d", ip, "-i", "enxec9a0c164fda", "-m", "state", "--state", "ESTABLISHED,RELATED", "-j", "ACCEPT"]);

        runSpawnSync("iptables", ["-D", "FORWARD", "-s", ip, "-p", "udp", "--dport", "53", "-o", "enxec9a0c164fda", "-j", "ACCEPT"]);
        runSpawnSync("iptables", ["-D", "FORWARD", "-d", ip, "-p", "udp", "--sport", "53", "-i", "enxec9a0c164fda", "-m", "state", "--state", "ESTABLISHED,RELATED", "-j", "ACCEPT"]);

        // --- REMOVE NAT ---
        runSpawnSync("iptables", ["-t", "nat", "-D", "POSTROUTING", "-s", ip, "-o", "enxec9a0c164fda", "-j", "MASQUERADE"]);

        // --- KILL ACTIVE CONNECTIONS ---
        runSpawnSync("conntrack", ["-D", "-s", ip]);
        runSpawnSync("conntrack", ["-D", "-d", ip]);

        console.log(`[REVOKE] ${ip} internet revoked`);
    }
}
