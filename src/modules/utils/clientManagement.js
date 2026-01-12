import runSpawnSync from './runSpawnSync';

export default class ClientManagement {
    static isValidIP(ip) {
        return /^(\d{1,3}\.){3}\d{1,3}$/.test(ip);
    }
    
    static allowClient(ip) {
        if (!this.isValidIP(ip)) {
            throw new Error(`[ERROR] <ClientManagement.allowClient> Invalid IP address: ${ip}`);
        }

        runSpawnSync('iptables', ['-t', 'nat', '-I', 'PREROUTING', '-s', ip, '-p', 'tcp', '--dport', '80', '-j', 'RETURN']);
        runSpawnSync('iptables', ['-t', 'nat', '-I', 'PREROUTING', '-s', ip, '-p', 'udp', '--dport', '53', '-j', 'RETURN']);
        runSpawnSync('iptables', ['-I', 'FORWARD', '-s', ip, '-j', 'ACCEPT']);
        runSpawnSync('iptables', ['-I', 'FORWARD', '-d', ip, '-j', 'ACCEPT']);
        runSpawnSync('iptables', ['-t', 'nat', '-I', 'POSTROUTING', '-s', ip, '-j', 'MASQUERADE']);

        console.log(`[ALLOW] Client ${ip} is now online`);
    }

    static revokeClient(ip) {
        if (!this.isValidIP(ip)) {
            throw new Error(`[ERROR] <ClientManagement.revokeClient> Invalid IP address: ${ip}`);
        }

        runSpawnSync('iptables', ['-t', 'nat', '-D', 'PREROUTING', '-s', ip, '-p', 'tcp', '--dport', '80', '-j', 'RETURN']);
        runSpawnSync('iptables', ['-t', 'nat', '-D', 'PREROUTING', '-s', ip, '-p', 'udp', '--dport', '53', '-j', 'RETURN']);
        runSpawnSync('iptables', ['-D', 'FORWARD', '-s', ip, '-j', 'ACCEPT']);
        runSpawnSync('iptables', ['-D', 'FORWARD', '-d', ip, '-j', 'ACCEPT']);
        runSpawnSync('iptables', ['-t', 'nat', '-D', 'POSTROUTING', '-s', ip, '-j', 'MASQUERADE']);
        runSpawnSync('conntrack', ['-D', '-s', ip]);
        runSpawnSync('conntrack', ['-D', '-d', ip]);

        console.log(`[REVOKE] Client ${ip} has been disconnected`);
    }
}
