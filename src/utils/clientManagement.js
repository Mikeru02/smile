import runSpawnSync from './runSpawnSync.js';

const secondaryInterface = process.env.SECONDARY_INTERFACE;

export default class ClientManagement {
    static allowClient(ip) {
        // Allow HTTP/DNS to bypass DNAT
        runSpawnSync("iptables", ["-t", "nat", "-I", "PREROUTING", "-i", secondaryInterface, "-s", ip, "-p", "tcp", "--dport", "80", "-j", "RETURN"]);
        runSpawnSync("iptables", ["-t", "nat", "-I", "PREROUTING", "-i", secondaryInterface, "-s", ip, "-p", "udp", "--dport", "53", "-j", "RETURN"]);

        // Allow forwarding to internet
        runSpawnSync("iptables", ["-I", "FORWARD", "-i", secondaryInterface, "-o", "enxec9a0c164fda", "-s", ip, "-j", "ACCEPT"]);
        runSpawnSync("iptables", ["-I", "FORWARD", "-i", "enxec9a0c164fda", "-o", secondaryInterface, "-d", ip, "-m", "state", "--state", "ESTABLISHED,RELATED", "-j", "ACCEPT"]);

        // MASQUERADE for internet NAT
        runSpawnSync("iptables", ["-t", "nat", "-I", "POSTROUTING", "-s", ip, "-j", "MASQUERADE"]);

        // Remove any previous drop rules (in case client was revoked before)
        try { runSpawnSync("iptables", ["-D", "FORWARD", "-s", ip, "-j", "DROP"]); } catch {}
        try { runSpawnSync("iptables", ["-D", "FORWARD", "-d", ip, "-j", "DROP"]); } catch {}

        console.log(`[ALLOW] ${ip} internet enabled`);
    }

    static revokeClient(ip) {
        // Remove bypass for DNAT
        runSpawnSync("iptables", ["-t", "nat", "-D", "PREROUTING", "-i", secondaryInterface, "-s", ip, "-p", "tcp", "--dport", "80", "-j", "RETURN"]);
        runSpawnSync("iptables", ["-t", "nat", "-D", "PREROUTING", "-i", secondaryInterface, "-s", ip, "-p", "udp", "--dport", "53", "-j", "RETURN"]);

        // Remove per-client forward rules
        runSpawnSync("iptables", ["-D", "FORWARD", "-i", secondaryInterface, "-o", "enxec9a0c164fda", "-s", ip, "-j", "ACCEPT"]);
        runSpawnSync("iptables", ["-D", "FORWARD", "-i", "enxec9a0c164fda", "-o", secondaryInterface, "-d", ip, "-m", "state", "--state", "ESTABLISHED,RELATED", "-j", "ACCEPT"]);

        // Remove NAT for this client
        runSpawnSync("iptables", ["-t", "nat", "-D", "POSTROUTING", "-s", ip, "-j", "MASQUERADE"]);

        // Terminate existing connections
        runSpawnSync("conntrack", ["-D", "-s", ip]);
        runSpawnSync("conntrack", ["-D", "-d", ip]);

        // Drop all other traffic (internet/ICMP/TCP/UDP)
        runSpawnSync("iptables", ["-I", "FORWARD", "-s", ip, "-j", "DROP"]);
        runSpawnSync("iptables", ["-I", "FORWARD", "-d", ip, "-j", "DROP"]);

        console.log(`[REVOKE] ${ip} internet revoked`);
    }
}
