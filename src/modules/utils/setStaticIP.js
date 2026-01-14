import runSpawnSync from './runSpawnSync.js';

const gateway = process.env.GATEWAY;
const address = process.env.ADDRESS;
const interfaceName = process.env.SECONDARY_INTERFACE;

export default class StaticIP {
    static set() {
        if (!gateway || !address || !interfaceName) {
            console.error('[ERROR] Gateway, Address and Interface Name is required!');
        }

        runSpawnSync('ip', ['link', 'set', interfaceName, 'up']);
        runSpawnSync('ip', ['addr', 'flush', 'dev', interfaceName]);
        runSpawnSync('ip', ['addr', 'add', address, 'dev', interfaceName]);

        try {
            runSpawnSync('ip', ['route', 'del', 'default']);
        } catch(_) {
            runSpawnSync('ip', ['route', 'add', 'default', 'via', gateway]);
        }

    }
}