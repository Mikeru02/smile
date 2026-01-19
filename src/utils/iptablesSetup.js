import runSpawnSync from './runSpawnSync.js';

const routerAddress = process.env.ROUTER_ADDRESS || '192.168.10.1';
const routerPrimaryInterface = process.env.PRIMARY_INTERFACE;
const routerSecondaryInterface = process.env.SECONDARY_INTERFACE;
const tcpPort = Number(process.env.TCP_PORT) || 80;
const udpPort = Number(process.env.UDP_PORT) || 53;
const srcPort = Number(process.env.SRC_PORT) || 80;

export default class IPTSetup {
    static flush() {
        const commands = [
            ['iptables', ['-F']],
            ['iptables', ['-t', 'nat', '-F']],
            ['iptables', ['-X']],
            ['conntrack', ['-F']]
        ]

        for (const [cmd, args] of commands)  {
            try {
                runSpawnSync(cmd, args);
            } catch(err) {
                console.error(`[ERROR] <IPTSetup.flush> ${cmd} ${args.join(' ')} failed: `, err.message);
            }
        }

        console.log('[SUCCESS] Flush completed');
    }

    static set() {
        // const commands = [
        //     ["sysctl", ["-w", "net.ipv4.ip_forward=1"]],
        //     ["iptables", ["-t", "nat", "-A", "PREROUTING", "-i", routerSecondaryInterface, "-p", "tcp", "--dport", tcpPort, "-j", "DNAT", "--to-destination", `${routerAddress}:${srcPort}`]],
        //     ["iptables", ["-t", "nat", "-A", "PREROUTING", "-i", routerSecondaryInterface, "-p", "udp", "--dport", udpPort, "-j", "DNAT", "--to-destination", routerAddress]],
        //     ["iptables", ["-A", "FORWARD", "-i", routerSecondaryInterface, "-o", routerPrimaryInterface, "-j", "ACCEPT"]],
        //     ["iptables", ["-A", "FORWARD", "-i", routerPrimaryInterface, "-o", routerSecondaryInterface, "-m", "state", "--state", "ESTABLISHED,RELATED", "-j", "ACCEPT"]]

        // ];

        const commands = [
            ['sysctl', ['-w', 'net.ipv4.ip_forward=1']],

            ['iptables', [
                '-t', 'nat',
                '-A', 'PREROUTING',
                '-i', routerSecondaryInterface,
                '-p', 'tcp',
                '--dport', '80',
                '-j', 'REDIRECT',
                '--to-ports', '3000'
            ]],

            ['iptables', [
                '-A', 'FORWARD',
                '-i', routerSecondaryInterface,
                '-o', routerPrimaryInterface,
                '-j', 'ACCEPT'
            ]],

            ['iptables', [
                '-A', 'FORWARD',
                '-i', routerPrimaryInterface,
                '-o', routerSecondaryInterface,
                '-m', 'state',
                '--state', 'ESTABLISHED,RELATED',
                '-j', 'ACCEPT'
            ]],

            ['iptables', [
                '-t', 'nat',
                '-A', 'POSTROUTING',
                '-o', routerPrimaryInterface,
                '-j', 'MASQUERADE'
            ]]
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