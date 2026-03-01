import { spawnSync } from 'child_process';

export default function runSpawnSync(cmd, args, raw = false) {
    const result = spawnSync(cmd, args, { encoding: 'utf-8'});

    if (result.error) {
        throw result.error;
    }

    if (result.status !== 0) {
        if (cmd === 'conntrack' || cmd === 'ping') {
            return raw ? result : result.stdout.trim();
        }

        throw new Error(`[ERROR] ${cmd} failed: ${args.join(' ')}`);
    }

    return raw ? result : result.stdout.trim();
}