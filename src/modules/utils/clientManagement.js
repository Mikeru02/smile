    import { spawnSync } from 'child_process';

    export default class ClientManagement {
        static isValidIP(ip) {
            return /^(\d{1,3}\.){3}\d{1,3}$/.test(ip);
        }

        static run(cmd, args) {
            const result = spawnSync(cmd, args, { stdio: 'inherit'});

            if (result.error) {
                throw result.error;
            }

            if (result.status !== 0) {
                throw new Error(`[ERROR] ${cmd} failed: ${args.join(' ')}`);
            }
        }
        
        static allowClient(ip) {
            if (!this.isValidIP(ip)) {
                throw new Error(`[ERROR] Invalid IP address: ${ip}`);
            }

            this.run('iptables', ['-t', 'nat', '-I', 'PREROUTING', '-s', ip, '-p', 'tcp', '--dport', '80', '-j', 'RETURN']);
            this.run('iptables', ['-t', 'nat', '-I', 'PREROUTING', '-s', ip, '-p', 'udp', '--dport', '53', '-j', 'RETURN']);
            this.run('iptables', ['-I', 'FORWARD', '-s', ip, '-j', 'ACCEPT']);
            this.run('iptables', ['-I', 'FORWARD', '-d', ip, '-j', 'ACCEPT']);
            this.run('iptables', ['-t', 'nat', '-I', 'POSTROUTING', '-s', ip, '-j', 'MASQUERADE']);

            console.log(`[ALLOW] Client ${ip} is now online`);
        }

        static revokeClient(ip) {
            if (!this.isValidIP(ip)) {
                throw new Error(`[ERROR] Invalid IP address: ${ip}`);
            }

            this.run('iptables', ['-t', 'nat', '-D', 'PREROUTING', '-s', ip, '-p', 'tcp', '--dport', '80', '-j', 'RETURN']);
            this.run('iptables', ['-t', 'nat', '-D', 'PREROUTING', '-s', ip, '-p', 'udp', '--dport', '53', '-j', 'RETURN']);
            this.run('iptables', ['-D', 'FORWARD', '-s', ip, '-j', 'ACCEPT']);
            this.run('iptables', ['-D', 'FORWARD', '-d', ip, '-j', 'ACCEPT']);
            this.run('iptables', ['-t', 'nat', '-D', 'POSTROUTING', '-s', ip, '-j', 'MASQUERADE']);
            this.run('conntrack', ['-D', '-s', ip]);
            this.run('conntrack', ['-D', '-d', ip]);

            console.log(`[REVOKE] Client ${ip} has been disconnected`);
        }
    }
