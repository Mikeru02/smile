import runSpawnSync from './runSpawnSync.js';

export default class ClientManagement {
    static isValidIP(ip) {
        return /^(\d{1,3}\.){3}\d{1,3}$/.test(ip);
    }
    
    static allowClient(ip) {
        if (!this.isValidIP(ip)) {
            throw new Error(`[ERROR] <ClientManagement.allowClient> Invalid IP address: ${ip}`);
        }

        const secIface = process.env.SECONDARY_INTERFACE;  // Where clients connect
        const priIface = process.env.PRIMARY_INTERFACE;    // Internet interface

        // Allow forwarding to/from client
        runSpawnSync('iptables', ['-I', 'FORWARD', '-i', secIface, '-s', ip, '-j', 'ACCEPT']);
        runSpawnSync('iptables', ['-I', 'FORWARD', '-o', secIface, '-d', ip, '-j', 'ACCEPT']);

        // Masquerade outgoing traffic to internet
        runSpawnSync('iptables', ['-t', 'nat', '-I', 'POSTROUTING', '-s', ip, '-o', priIface, '-j', 'MASQUERADE']);

        console.log(`[ALLOW] Client ${ip} can now access the internet`);
    }


    static revokeClient(ip) {
        const secIface = process.env.SECONDARY_INTERFACE;
        const priIface = process.env.PRIMARY_INTERFACE;

        // Remove FORWARD rules
        runSpawnSync('iptables', ['-D', 'FORWARD', '-i', secIface, '-s', ip, '-j', 'ACCEPT']);
        runSpawnSync('iptables', ['-D', 'FORWARD', '-o', secIface, '-d', ip, '-j', 'ACCEPT']);

        // Remove NAT
        runSpawnSync('iptables', ['-t', 'nat', '-D', 'POSTROUTING', '-s', ip, '-o', priIface, '-j', 'MASQUERADE']);

        // Clear conntrack
        runSpawnSync('conntrack', ['-D', '-s', ip]);
        runSpawnSync('conntrack', ['-D', '-d', ip]);

        console.log(`[REVOKE] Client ${ip} has been disconnected`);
    }
}
