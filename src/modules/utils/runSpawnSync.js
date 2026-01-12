import { spawnSync } from 'child_process';

export default function runSpawnSync(cmd, args) {
    const result = spawnSync(cmd, args, { stdio: 'inherit'});

    if (result.error) {
        throw result.error;
    }

    if (result.status !== 0) {
        throw new Error(`[ERROR] ${cmd} failed: ${args.join(' ')}`);
    }

    return;
}