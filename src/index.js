import express from 'express';
import path from 'path';
import Arduino from './modules/utils/arduino.js';
import { fileURLToPath } from 'url';
import 'dotenv/config.js';

const file = fileURLToPath(import.meta.url);
const directory = path.dirname(file);

const app = express();
const arduino = new Arduino(
    process.env.SERIAL_PORT,
    Number(process.env.SERIAL_SPEED) || 9600,
    Number(process.env.SERIAL_TIMEOUT) || 1000);
const port = Number(process.env.SRC_PORT) || 80;
const host = process.env.SRC_HOST || '0.0.0.0';

const distDirectory = path.join(directory, "dist");

app.use(express.static(distDirectory));

app.get(['/generate_204', '/hotspot-detect.html'], (req, res) => {
    res.redirect(302, '/');
});

app.get('*', (req, res) => {
    res.sendFile(path.join(distDirectory, 'index.html'))
});

app.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}`);
});