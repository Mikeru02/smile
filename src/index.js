import express from 'express';
import http from 'http';
import path from 'path';
import compression from 'compression';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import 'dotenv/config';
import limiter from './middlewares/rateLimiter.js';
import SocketServer from './sockets/socketServer.js';
import Arduino from './resources/arduino.js';
import Webcam from './resources/webcam.js';
import apiRouter from './routes/api/index.js';
import startTimeDeductor from './workers/timeDeductor.js';
import getLocalIP from './utils/getIp.js';
import Model from './utils/model.js';
import MessageBot from './utils/tgBot.js';
import checkInternetWorker from './workers/internetWorker.js';
import watchDnsmasq from './workers/watchDNS.js';

const ip = getLocalIP();

// Block for checking arduino
const arduino = new Arduino(
    process.env.SERIAL_PORT,
    Number(process.env.SERIAL_SPEED) || 9600,
    Number(process.env.SERIAL_TIMEOUT) || 1000,
    () => {
        arduino.sendCommand(`IP:${ip}`);
        server.listen(port, host, () => {
            console.log(`Server is running at http://${host}:${port}`);
        });

        // Intialize workers
        startTimeDeductor();
        checkInternetWorker();
        watchDnsmasq(process.env.DNSMASQ_LOG, (clientIp, domain) => {
            console.log(`[INFO] Client ${clientIp} accessed ${domain}`)
        });
    }
);
// const arduino = "";

// Block for Camera
const webcam = new Webcam();

// Block for Model API
const modelApi = new Model(process.env);

const messageBot = new MessageBot(process.env.BOT_TOKEN, process.env.BOT_USERS);

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

app.use(limiter);

const server = http.createServer(app);

const socketServer = new SocketServer({ server, arduino, webcam, modelApi, messageBot });

const io = socketServer.init();

app.use('/api', cors(), apiRouter({ arduino, io }));

app.get(['/generate_204', '/hotspot-detect.html'], (req, res) => {
    res.redirect('/');
});

app.get('*', (req, res) => {
    res.sendFile(path.join(distDirectory, 'index.html'))
});
