import os from 'os';

export default function getLocalIP() {
    const nets = os.networkInterfaces();
    const ignoredIPs = ['192.168.10.1'];

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal && !ignoredIPs.includes(net.address)) {
                return net.address;
            }
        }
    }
    return '0.0.0.0';
}

