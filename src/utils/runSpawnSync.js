import { spawnSync } from 'child_process';

export default function runSpawnSync(cmd, args) {
    const result = spawnSync(cmd, args, { encoding: 'utf-8'});

    if (result.error) {
        throw result.error;
    }

    if (result.status !== 0) {
        if (cmd === 'conntrack') {
            return result;
        }

        throw new Error(`[ERROR] ${cmd} failed: ${args.join(' ')}`);
    }

    return result.stdout.trim();
}