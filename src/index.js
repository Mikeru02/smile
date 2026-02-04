import express from 'express';
import http from 'http';
import { initSocket } from './utils/io.js';
import path from 'path';
import compression from 'compression';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import 'dotenv/config.js';
import Arduino from './utils/arduino.js';
import Service from './utils/serviceChecker.js';
import IPTSetup from './utils/iptablesSetup.js';
import apiRouter from './routes/api/index.js';
import startTimeDeductor from './workers/timeDeductor.js';
import getLocalIP from './utils/getIp.js';

const ip = getLocalIP();

// Block for checking arduino
const arduino = new Arduino(
    process.env.SERIAL_PORT,
    Number(process.env.SERIAL_SPEED) || 9600,
    Number(process.env.SERIAL_TIMEOUT) || 1000,
    () => {
        arduino.sendCommand(`IP:${ip}`);
    }
);

const file = fileURLToPath(import.meta.url);
const directory = path.dirname(file);

const app = express();
const port = Number(process.env.SRC_PORT) || 80;
const host = process.env.SRC_HOST || '0.0.0.0';

const distDirectory = path.join(directory, "../dist");

app.use(compression());
app.use('/fonts', express.static('public/fonts'));
app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(distDirectory)));

// const server = http.createServer(app);

// const io = await initSocket(server, arduino);

app.use('/api', cors({ origin: "*" }), apiRouter({ arduino, io }));

app.get(['/generate_204', '/hotspot-detect.html'], (req, res) => {
    res.redirect('/');
});

app.get('*', (req, res) => {
    res.sendFile(path.join(distDirectory, 'index.html'))
});

app.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}`);
});

// Intialize workers
//startTimeDeductor();
