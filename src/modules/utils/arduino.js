import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

export default class Arduino {
    constructor(serialPort, serialSpeed, serialTimeout) {
        this.serialPort = serialPort;
        this.serialSpeed = serialSpeed;
        this.serialTimeout = serialTimeout;

        this.port = new SerialPort({
            path: this.serialPort,
            baudRate: this.serialSpeed,
            autoOpen: true
        });

        this.parser = this.port.pipe(
            new ReadlineParser({ delimiter: '\n' })
        );

        this.ready = new Promise(resolve => setTimeout(resolve, 3000));
    }

    async sendMessage(message) {
        await this.ready;

        if (typeof message === 'string') {
            message = Buffer.from(message, 'utf-8');
        }

        return new Promise((resolve, reject) => {
            this.port.write(message, err => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    async readMessage() {
        await this.ready;

        return new Promise((resolve, reject) => {
            this.parser.once('data', data => {
                resolve(data.toString().trim());
            });
        });
    }
}