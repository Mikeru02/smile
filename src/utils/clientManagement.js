import runSpawnSync from './runSpawnSync.js';

const secondaryInterface = process.env.SECONDARY_INTERFACE;
const primaryInterface = process.env.PRIMARY_INTERFACE; // your internet-facing interface

export default class ClientManagement {
    static allowClient(ip) {
        const uplinkInterface = "enxec9a0c164fda";

        // Bypass portal for HTTP/HTTPS/DNS
        runSpawnSync("iptables", ["-t", "nat", "-I", "PREROUTING", "-i", secondaryInterface, "-s", ip, "-p", "tcp", "--dport", "80", "-j", "RETURN"]);
        runSpawnSync("iptables", ["-t", "nat", "-I", "PREROUTING", "-i", secondaryInterface, "-s", ip, "-p", "tcp", "--dport", "443", "-j", "RETURN"]);
        runSpawnSync("iptables", ["-t", "nat", "-I", "PREROUTING", "-i", secondaryInterface, "-s", ip, "-p", "udp", "--dport", "53", "-j", "RETURN"]);
        runSpawnSync("iptables", ["-t", "nat", "-I", "PREROUTING", "-i", secondaryInterface, "-s", ip, "-p", "tcp", "--dport", "53", "-j", "RETURN"]);

        // Allow forwarding
        runSpawnSync("iptables", ["-I", "FORWARD", "-i", secondaryInterface, "-o", uplinkInterface, "-s", ip, "-j", "ACCEPT"]);
        runSpawnSync("iptables", ["-I", "FORWARD", "-i", uplinkInterface, "-o", secondaryInterface, "-d", ip, "-m", "state", "--state", "ESTABLISHED,RELATED", "-j", "ACCEPT"]);

        // NAT
        runSpawnSync("iptables", ["-t", "nat", "-I", "POSTROUTING", "-s", ip, "-o", uplinkInterface, "-j", "MASQUERADE"]);

        console.log(`[ALLOW] ${ip} internet enabled`);
    }



    static revokeClient(ip) {
        // Remove bypass for DNAT (portal)
        runSpawnSync("iptables", ["-t", "nat", "-D", "PREROUTING", "-i", secondaryInterface, "-s", ip, "-p", "tcp", "--dport", "80", "-j", "RETURN"]);
        runSpawnSync("iptables", ["-t", "nat", "-D", "PREROUTING", "-i", secondaryInterface, "-s", ip, "-p", "udp", "--dport", "53", "-j", "RETURN"]);

        // Remove per-client FORWARD rules
        runSpawnSync("iptables", ["-D", "FORWARD", "-i", secondaryInterface, "-o", primaryInterface, "-s", ip, "-j", "ACCEPT"]);
        runSpawnSync("iptables", ["-D", "FORWARD", "-i", primaryInterface, "-o", secondaryInterface, "-d", ip, "-m", "state", "--state", "ESTABLISHED,RELATED", "-j", "ACCEPT"]);

        // Remove MASQUERADE for this client
        runSpawnSync("iptables", ["-t", "nat", "-D", "POSTROUTING", "-s", ip, "-o", primaryInterface, "-j", "MASQUERADE"]);

        // Terminate any existing connections
        runSpawnSync("conntrack", ["-D", "-s", ip]);
        runSpawnSync("conntrack", ["-D", "-d", ip]);

        // Drop all other traffic to prevent internet access
        runSpawnSync("iptables", ["-I", "FORWARD", "-s", ip, "-j", "DROP"]);
        runSpawnSync("iptables", ["-I", "FORWARD", "-d", ip, "-j", "DROP"]);

        console.log(`[REVOKE] ${ip} internet revoked`);
    }
}
