import runSpawnSync from './runSpawnSync.js';

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

        // Allow all traffic to/from client
        runSpawnSync('iptables', ['-I', 'FORWARD', '-s', ip, '-j', 'ACCEPT']);
        runSpawnSync('iptables', ['-I', 'FORWARD', '-d', ip, '-j', 'ACCEPT']);

        // NAT outgoing traffic
        runSpawnSync('iptables', ['-t', 'nat', '-I', 'POSTROUTING', '-s', ip, '-j', 'MASQUERADE']);
        
        console.log(`[ALLOW] Client ${ip} is now online`);
    }

    static revokeClient(ip) {
        if (!this.isValidIP(ip)) {
            throw new Error(`[ERROR] <ClientManagement.revokeClient> Invalid IP address: ${ip}`);
        }

        // Remove PREROUTING bypass rules
        runSpawnSync('iptables', ['-t', 'nat', '-D', 'PREROUTING', '-s', ip, '-p', 'tcp', '--dport', '80', '-j', 'RETURN']);
        runSpawnSync('iptables', ['-t', 'nat', '-D', 'PREROUTING', '-s', ip, '-p', 'tcp', '--dport', '443', '-j', 'RETURN']);
        runSpawnSync('iptables', ['-t', 'nat', '-D', 'PREROUTING', '-s', ip, '-p', 'udp', '--dport', '53', '-j', 'RETURN']);
        runSpawnSync('iptables', ['-t', 'nat', '-D', 'PREROUTING', '-s', ip, '-p', 'tcp', '--dport', '53', '-j', 'RETURN']);

        // Remove FORWARD rules
        runSpawnSync('iptables', ['-D', 'FORWARD', '-s', ip, '-j', 'ACCEPT']);
        runSpawnSync('iptables', ['-D', 'FORWARD', '-d', ip, '-j', 'ACCEPT']);

        // Remove POSTROUTING NAT
        runSpawnSync('iptables', ['-t', 'nat', '-D', 'POSTROUTING', '-s', ip, '-j', 'MASQUERADE']);

        // Clear any existing connections for this IP
        runSpawnSync('conntrack', ['-D', '-s', ip]);
        runSpawnSync('conntrack', ['-D', '-d', ip]);

        console.log(`[REVOKE] Client ${ip} has been disconnected`);
    }
}
