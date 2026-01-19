import runSpawnSync from './runSpawnSync.js';

export default class ClientManagement {
    static isValidIP(ip) {
        return /^(\d{1,3}\.){3}\d{1,3}$/.test(ip);
    }
    
    static allowClient(ip) {
        runSpawnSync('iptables', [
            '-t', 'nat', '-I', 'PREROUTING', '1',
            '-i', 'enxec9a0c1bee94',
            '-s', ip,
            '-j', 'ALLOW_INTERNET'
        ]);

        console.log(`[ALLOW] ${ip}`);
    }


    static revokeClient(ip) {
        runSpawnSync('iptables', [
            '-t', 'nat', '-D', 'PREROUTING',
            '-i', 'enxec9a0c1bee94',
            '-s', ip,
            '-j', 'ALLOW_INTERNET'
        ]);

        runSpawnSync('conntrack', ['-D', '-s', ip]);
        runSpawnSync('conntrack', ['-D', '-d', ip]);

        console.log(`[REVOKE] ${ip}`);
    }
}
