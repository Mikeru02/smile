import runSpawnSync from './runSpawnSync.js';

export default class ClientManagement {
    static allowClient(ip) {
        // Flush old connections
        runSpawnSync('conntrack', ['-D', '-s', ip]);
        runSpawnSync('conntrack', ['-D', '-d', ip]);

        // Add the client to the CLIENTS_AUTH chain
        runSpawnSync('iptables', [
            '-t', 'nat', '-I', 'CLIENTS_AUTH', '-s', ip, '-j', 'RETURN'
        ]);

        console.log(`[ALLOW] ${ip} internet enabled`);
    }

    static revokeClient(ip) {
        // Remove the client from CLIENTS_AUTH
        runSpawnSync('iptables', [
            '-t', 'nat', '-D', 'CLIENTS_AUTH', '-s', ip, '-j', 'RETURN'
        ]);

        // Flush connections
        runSpawnSync('conntrack', ['-D', '-s', ip]);
        runSpawnSync('conntrack', ['-D', '-d', ip]);

        console.log(`[REVOKE] ${ip} internet revoked`);
    }
}
