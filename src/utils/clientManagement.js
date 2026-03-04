import runSpawnSync from './runSpawnSync.js';

const routerPrimaryInterface = process.env.PRIMARY_INTERFACE;

export default class ClientManagement {
    static allowClient(ip) {
        // Stop portal redirect
        runSpawnSync("iptables", ["-t", "nat", "-I", "PREROUTING", "-s", ip, "-p", "tcp", "--dport", "80", "-j", "RETURN"]);
        runSpawnSync("iptables", ["-t", "nat", "-I", "PREROUTING", "-s", ip, "-p", "tcp", "--dport", "443", "-j", "RETURN"]);
        // TODO: Removed tentatively
        runSpawnSync("iptables", ["-t", "nat", "-I", "PREROUTING", "-s", ip, "-p", "udp", "--dport", "53", "-j", "RETURN"]);

        // Forward all traffic
        runSpawnSync("iptables", ["-I", "FORWARD", "-s", ip, "-o", routerPrimaryInterface, "-j", "ACCEPT"]);
        runSpawnSync("iptables", ["-I", "FORWARD", "-d", ip, "-i", routerPrimaryInterface, "-m", "state", "--state", "ESTABLISHED,RELATED", "-j", "ACCEPT"]);

        // NAT
        runSpawnSync("iptables", ["-t", "nat", "-I", "POSTROUTING", "-s", ip, "-o", routerPrimaryInterface, "-j", "MASQUERADE"]);

        console.log(`[ALLOW] ${ip} internet allowed`);
    }

    static revokeClient(ip) {
        // Restore portal redirect
        try {
            runSpawnSync("iptables", ["-t", "nat", "-C", "PREROUTING", "-s", ip, "-p", "tcp", "--dport", "80", "-j", "RETURN"]);
            runSpawnSync("iptables", ["-t", "nat", "-C", "PREROUTING", "-s", ip, "-p", "tcp", "--dport", "443", "-j", "RETURN"]);
            
            runSpawnSync("iptables", ["-C", "FORWARD", "-s", ip, "-o", routerPrimaryInterface, "-j", "ACCEPT"]);
            runSpawnSync("iptables", ["-C", "FORWARD", "-d", ip, "-i", routerPrimaryInterface, "-m", "state", "--state", "ESTABLISHED,RELATED", "-j", "ACCEPT"]);

            runSpawnSync("iptables", ["-t", "nat", "-C", "POSTROUTING", "-s", ip, "-o", routerPrimaryInterface, "-j", "MASQUERADE"]);

            runSpawnSync("iptables", ["-t", "nat", "-D", "PREROUTING", "-s", ip, "-p", "tcp", "--dport", "80", "-j", "RETURN"]);
            runSpawnSync("iptables", ["-t", "nat", "-D", "PREROUTING", "-s", ip, "-p", "tcp", "--dport", "443", "-j", "RETURN"]);
            // TODO: Remove tentatively
            runSpawnSync("iptables", ["-t", "nat", "-D", "PREROUTING", "-s", ip, "-p", "udp", "--dport", "53", "-j", "RETURN"]);

            // Remove forwarding
            runSpawnSync("iptables", ["-D", "FORWARD", "-s", ip, "-o", routerPrimaryInterface, "-j", "ACCEPT"]);
            runSpawnSync("iptables", ["-D", "FORWARD", "-d", ip, "-i", routerPrimaryInterface, "-m", "state", "--state", "ESTABLISHED,RELATED", "-j", "ACCEPT"]);

            // Remove NAT
            runSpawnSync("iptables", ["-t", "nat", "-D", "POSTROUTING", "-s", ip, "-o", routerPrimaryInterface, "-j", "MASQUERADE"]);

            // Kill active connections
            runSpawnSync("conntrack", ["-D", "-s", ip]);
            runSpawnSync("conntrack", ["-D", "-d", ip]);

            console.log(`[REVOKE] ${ip} internet revoked`);
        } catch (err) {
            console.error("[ERROR] ClientManagement.revokeClient: ", err);
        }
    }
}
