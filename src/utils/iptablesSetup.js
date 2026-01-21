import runSpawnSync from './runSpawnSync.js';

const routerAddress = process.env.ROUTER_ADDRESS || '192.168.10.1';
const routerSecondaryInterface = process.env.SECONDARY_INTERFACE;
const tcpPort = Number(process.env.TCP_PORT) || 80;
const udpPort = Number(process.env.UDP_PORT) || 53;
const srcPort = Number(process.env.SRC_PORT) || 80;

export default class IPTSetup {
    static flush() {
        const commands = [
            ['iptables', ['-F', 'FORWARD']],
            ['iptables', ['-t', 'nat', '-F', 'PREROUTING']],
            ['iptables', ['-t', 'nat', '-F', 'POSTROUTING']],
            ['conntrack', ['-D', '-s', '192.168.10.0/24']],
            ['conntrack', ['-D', '-d', '192.168.10.0/24']]

        ]

        for (const [cmd, args] of commands) {
            try {
                runSpawnSync(cmd, args);
            } catch(err) {
                console.error(`[ERROR] <IPTSetup.flush> ${cmd} ${args.join(' ')} failed: `, err.message);
            }
        }

        console.log('[SUCCESS] Flush completed');
    }

    static set() {
        const commands = [
            ['sysctl', ['-w', 'net.ipv4.ip_forward=1']],
            ['iptables', ['-P', 'FORWARD', 'DROP']],
            ['iptables', ['-t', 'nat', '-A', 'PREROUTING', '-i', routerSecondaryInterface, '-p', 'tcp', '--dport', tcpPort, '-j', 'DNAT', '--to-destination', `${routerAddress}:${srcPort}`]],
            ['iptables', ['-t', 'nat', '-A', 'PREROUTING', '-i', routerSecondaryInterface, '-p', 'udp', '--dport', udpPort, '-j', 'DNAT', '--to-destination', routerAddress]],
            ['iptables', ['-A', 'FORWARD', '-d', routerAddress, '-j', 'ACCEPT']],
            ['iptables', ['-A', 'FORWARD', '-s', routerAddress, '-m', 'state', '--state', 'ESTABLISHED,RELATED', '-j', 'ACCEPT']],
        ];

        for (const [cmd, args] of commands) {
            try {
                runSpawnSync(cmd, args);
            } catch(err) {
                console.error(`[ERROR] <IPTSetup.set> ${cmd} ${args.join(' ')} failed: `, err.message);
            }
        }
    }
}