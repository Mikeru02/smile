import runSpawnSync from './runSpawnSync.js';

export default function memoryInfo() {
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
