import runSpawnSync from './runSpawnSync';

routerAddress = process.env.ROUTER_ADDRESS;
routerPrimaryInterface = process.env.PRIMARY_INTERFACE;
routerSecondaryInterface = process.env.SECONDARY_INTERFACE;
tcpPort = Number(process.env.TCP_PORT);
udpPort = Number(process.env.UDP_PORT);
srcPort = Number(process.env.SRC_PORT);

export default class IPTSetup {
    static flush() {
        const commands = [
            ['iptables', ['-F']],
            ['iptables', ['-t', 'nat', '-F']],
            ['iptables', ['-X']],
            ['conntrack', ['-F']]
        ]

        for (const [cmd, args] of commands) {
            try {
                runSpawnSync(cmd, args);
            } catch(err) {
                console.error(`[ERROR] ${cmd} ${args.join(' ')} failed: `, err.message);
            }
        }

        console.log('[SUCCESS] Flush completed');
    }

    static set() {
        const commands = [
            ['iptables', ['-t', 'nat', '-A', 'PREROUTING', '-i', routerSecondaryInterface, '-p', 'tcp', '--dport', tcpPort, '-j', 'DNAT', '--to-destination', `${routerAddress}:${srcPort}`]],
            ['iptables', ['-t', 'nat', '-A', 'PREROUTING', '-i', routerSecondaryInterface, '-p', 'udp', '--dport', udpPort, '-j', 'DNAT', '--to-destination', routerAddress]],
            ['iptables', ['-t', 'nat', '-A', 'POSTROUTING', '-o', routerPrimaryInterface, '-j', 'MASQUERADE']],
            ['iptables', ['-A', 'FORWARD', '-i', routerSecondaryInterface, '-j', 'DROP']],
            ['iptables', ['-A', 'FORWARD', '-i', routerSecondaryInterface, '-d', routerAddress, '-j', 'ACCEPT']],
            ['iptables', ['-A', 'FORWARD', '-i', routerSecondaryInterface, '-p', 'udp', '--dport', udpPort, '-d', routerAddress, '-j', 'ACCEPT']]
        ];

        for (const [cmd, args] of commands) {
            try {
                runSpawnSync(cmd, args);
            } catch(err) {
                console.error(`[ERROR] ${cmd} ${args.join(' ')} failed: `, err.message);
            }
        }
    }
}