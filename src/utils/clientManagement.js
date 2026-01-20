import runSpawnSync from './runSpawnSync.js';

export default class ClientManagement {
    static allowClient(ip) {
        // BYPASS HTTP PORTAL
        runSpawnSync("iptables", [
            "-t", "nat", "-I", "PREROUTING",
            "-s", ip, "-p", "tcp", "--dport", "80",
            "-j", "RETURN"
        ]);

        // BYPASS DNS HIJACK (THIS WAS MISSING)
        runSpawnSync("iptables", [
            "-t", "nat", "-I", "PREROUTING",
            "-s", ip, "-p", "udp", "--dport", "53",
            "-j", "RETURN"
        ]);

        // ALLOW FORWARDING
        runSpawnSync("iptables", [
            "-I", "FORWARD",
            "-s", ip, "-o", "enxec9a0c164fda",
            "-j", "ACCEPT"
        ]);

        runSpawnSync("iptables", [
            "-I", "FORWARD",
            "-d", ip, "-i", "enxec9a0c164fda",
            "-m", "state",
            "--state", "ESTABLISHED,RELATED",
            "-j", "ACCEPT"
        ]);

        // NAT
        runSpawnSync("iptables", [
            "-t", "nat",
            "-I", "POSTROUTING",
            "-s", ip,
            "-o", "enxec9a0c164fda",
            "-j", "MASQUERADE"
        ]);

        console.log(`[ALLOW] ${ip} internet allowed`);
    }


    static revokeClient(ip) {
        runSpawnSync("iptables", ["-t","nat","-D","PREROUTING","-s",ip,"-p","tcp","--dport","80","-j","RETURN"]);
        runSpawnSync("iptables", ["-t","nat","-D","PREROUTING","-s",ip,"-p","udp","--dport","53","-j","RETURN"]);

        runSpawnSync("iptables", ["-D","FORWARD","-s",ip,"-o","enxec9a0c164fda","-j","ACCEPT"]);
        runSpawnSync("iptables", ["-D","FORWARD","-d",ip,"-i","enxec9a0c164fda","-m","state","--state","ESTABLISHED,RELATED","-j","ACCEPT"]);

        runSpawnSync("iptables", ["-t","nat","-D","POSTROUTING","-s",ip,"-o","enxec9a0c164fda","-j","MASQUERADE"]);

        runSpawnSync("conntrack", ["-D","-s",ip]);
        runSpawnSync("conntrack", ["-D","-d",ip]);

        console.log(`[REVOKE] ${ip} internet revoked`);
    }

}
