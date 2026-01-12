import { spawnSync } from 'child_process';

export default class Service {
    static check(service) {
        try {
            const result = spawnSync('systemctl', ['is-active', service], { encoding: 'utf-8' });
            
            return result.stdout.trim() === 'active';
        } catch(err) {
            console.error(`[ERROR] <Service.check> ${service}: `, err.message);
            return false;
        }
    }

    static restart(service) {
        try {
            const result = spawnSync('systemctl', ['restart', service], { encoding: 'utf-8' });
            return result.status === 0;
        } catch(err) {
            console.error(`[ERROR] <Service.restart> ${service}: `, err.message);
            return false;
        }
    }
}