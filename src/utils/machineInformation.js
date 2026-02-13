import runSpawnSync from './runSpawnSync.js';

export function memoryInfo() {
    const meminfo = runSpawnSync('cat', ['/proc/meminfo']);

    const total = meminfo.match(/^MemTotal:\s+(\d+)/m)[1];
    const available = meminfo.match(/^MemAvailable:\s+(\d+)/m)[1];

    const totalMB = Math.round(total / 1024);
    const availableMB = Math.round(available / 1024);
    const usedMB = totalMB - availableMB;

    return {
        total_mb: totalMB,
        available_mb: availableMB,
        used_mb: usedMB,
        type: "LPDDR4"
    };
}

export function CPUInfo() {
    const cpuInfo = runSpawnSync('lscpu', []);
    const cores = runSpawnSync('nproc', []);

    const modelMatch = cpuInfo.match(/Model name\s+:\s+(.*)/);
    const speedMatch = cpuInfo.match(/CPU max MHz:\s+(.*)/);

    return {
        model: modelMatch ? modelMatch[1] : 'Unknown',
        cores: Number(cores),
        speed: speedMatch ? Number(speedMatch[1]) : 'Unknown'
    };
}

export function storageInfo() {
    const df = runSpawnSync('df', ['-B1', '/']);
    const lines = df.split('\n');
    const parts = lines[1].split(/\s+/);

    const total = Math.round(parts[1] / 1024 / 1024);
    const used = Math.round(parts[2] / 1024 / 1024);
    const available = Math.round(parts[3] / 1024 / 1024);

    return {
        total_mb: total,
        used_mb: used,
        available_mb: available
    };
}

export function networkInfo() {
    try {
        // Get IP addresses
        const ipAddr = runSpawnSync('ip', ['addr', 'show']);
        const interfaces = [];
        
        // Parse network interfaces
        const interfaceBlocks = ipAddr.split(/^\d+: /m).filter(block => block.trim());
        
        for (const block of interfaceBlocks) {
            const interfaceMatch = block.match(/^(\w+):/m);
            const interfaceName = interfaceMatch ? interfaceMatch[1] : null;
            
            if (interfaceName && interfaceName !== 'lo') {
                const inetMatch = block.match(/inet (\d+\.\d+\.\d+\.\d+)/);
                const inet6Match = block.match(/inet6 ([a-f0-9:]+\/\d+)/); // Fix bug in IPv6 regex capture group
                const macMatch = block.match(/link\/ether ([a-f0-9:]+)/);
                
                interfaces.push({
                    name: interfaceName,
                    ipv4: inetMatch ? inetMatch[1] : null,
                    ipv6: inet6Match ? inet6Match[1] : null,
                    mac: macMatch ? macMatch[1] : null
                });
            }
        }
        
        // Get default gateway
        const route = runSpawnSync('ip', ['route', 'show', 'default']);
        const gatewayMatch = route.match(/default via (\d+\.\d+\.\d+\.\d+)/);
        const gateway = gatewayMatch ? gatewayMatch[1] : null;
        
        // Get DNS servers from /etc/resolv.conf
        const resolvConf = runSpawnSync('cat', ['/etc/resolv.conf']);
        const dnsServers = [];
        const dnsMatches = resolvConf.match(/nameserver (\d+\.\d+\.\d+\.\d+)/g);
        if (dnsMatches) {
            for (const match of dnsMatches) {
                const dnsMatch = match.match(/nameserver (\d+\.\d+\.\d+\.\d+)/);
                if (dnsMatch) dnsServers.push(dnsMatch[1]);
            }
        }
        
        return {
            interfaces: interfaces,
            gateway: gateway,
            dns_servers: dnsServers
        };
    } catch (err) {
        console.error("[ERROR] networkInfo", err);
        return {
            interfaces: [],
            gateway: null,
            dns_servers: []
        };
    }
}

export function OSName() {
    const osRelease = runSpawnSync('cat', ['/etc/os-release']);
    const match = osRelease.match(/^PRETTY_NAME="?(.*)"?$/m);
    return match ? match[1] : 'Unknown';
}
