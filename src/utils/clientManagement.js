import runSpawnSync from './runSpawnSync.js';

export default class ClientManagement {
    static allowClient(ip) {
        runSpawnSync(["iptables", ["-t", "nat", "-I", "PREROUTING", "-s", ip, "-p", "tcp", "--dport", 80, "-j", "RETURN"]]),
        runSpawnSync(["iptables", ["-t", "nat", "-I", "PREROUTING", "-s", ip, "-p", "udp", "--dport", 53, "-j", "RETURN"]]),
        runSpawnSync(["iptables", ["-I", "FORWARD", "-s", ip, "-j", "ACCEPT"]]),
        runSpawnSync(["iptables", ["-I", "FORWARD", "-d", ip, "-j", "ACCEPT"]]),
        runSpawnSync(["iptables", ["-t", "nat", "-I", "POSTROUTING", "-s", ip, "-j", "MASQUERADE"]])
        console.log(`[ALLOW] ${ip} internet enabled`);
    }

    static revokeClient(ip) {
        runSpawnSync(["iptables", ["-t", "nat", "-D", "PREROUTING", "-s", ip, "-p", "tcp", "--dport", 80, "-j", "RETURN"]]),
        runSpawnSync(["iptables", ["-t", "nat", "-D", "PREROUTING", "-s", ip, "-p", "udp", "--dport", 53, "-j", "RETURN"]]),
        runSpawnSync(["iptables", ["-D", "FORWARD", "-s", ip, "-j", "ACCEPT"]]),
        runSpawnSync(["iptables", ["-D", "FORWARD", "-d", ip, "-j", "ACCEPT"]]),
        runSpawnSync(["iptables", ["-t", "nat", "-D", "POSTROUTING", "-s", ip, "-j", "MASQUERADE"]]),
        runSpawnSync(["conntrack", ["-D", "-s", ip]]),
        runSpawnSync(["conntrack", ["-D", "-d", ip]])

        console.log(`[REVOKE] ${ip} internet revoked`);
    }
}
