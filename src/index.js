import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import 'dotenv/config.js';
import Arduino from './utils/arduino.js';
import Service from './utils/serviceChecker.js';
import IPTSetup from './utils/iptablesSetup.js';
import StaticIP from './utils/setStaticIP.js';
import v1 from './routes/v1/index.js';

// Block for checking the services needed
console.log('Checking services...');
const services = ['dnsmasq', 'NetworkManager'];
const serviceFailure = [];
for (const service of services) {
    console.log(`Checking service ${service}`);
    if (!Service.check(service)) {
        console.warn(`[WARN] Service ${service} is not active!`);
        const restart = Service.restart(service);
        if (!restart) {
            serviceFailure.push(service);
        }
    } else {
        console.log(`[OK] Service ${service} is running!`);
    }
}
if (serviceFailure.length > 0) {
    console.error('[ERROR] Some services failed:', serviceFailure.join(', '));
} else {
    console.log('[OK] All services are running');
}

// Block for setting up static ip
console.log('Setting up Static Ip...');
//StaticIP.set();

// Block for setup of iptables
console.log('Setting up iptables...');
IPTSetup.flush();
IPTSetup.set();

// Block for checking arduino
const arduino = new Arduino(
    process.env.SERIAL_PORT,
    Number(process.env.SERIAL_SPEED) || 9600,
    Number(process.env.SERIAL_TIMEOUT) || 1000
);

const file = fileURLToPath(import.meta.url);
const directory = path.dirname(file);

const app = express();
const port = Number(process.env.SRC_PORT) || 80;
const host = process.env.SRC_HOST || '0.0.0.0';

const distDirectory = path.join(directory, "../dist");

app.use('/fonts', express.static('public/fonts'));
app.use(express.static(distDirectory));
app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/v1', cors(), v1);

app.get(['/generate_204', '/hotspot-detect.html'], (req, res) => {
    res.redirect(302, '/');
});

app.get('*', (req, res) => {
    res.sendFile(path.join(distDirectory, 'index.html'))
});

app.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}`);
});
