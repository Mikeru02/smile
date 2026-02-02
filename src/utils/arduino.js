import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

export default class Arduino {
    constructor(serialPort, serialSpeed, serialTimeout) {
        this.serialPort = serialPort;
        this.serialSpeed = serialSpeed;
        this.serialTimeout = serialTimeout;
        this.ready = false;

        this.port = new SerialPort({
            path: this.serialPort,
            baudRate: this.serialSpeed,
            autoOpen: true
        });

        this.port.on('open', () => console.log("Port opened. Waiting for Arduino...") );

        this.parser = this.port.pipe( new ReadlineParser({ delimiter: '\n' }) );

        this.parser.on('data', (data) => {
            data = data.trim();
            console.log('Arduino -> Node: ', data);

            if (!this.ready && data === "READY") {
                this.ready = true;
                console.log('Arduino initialized. Waiting for commands');
            }
        })
    }

    sendCommand(command) {
        if (this.ready) {
            console.log('Node -> Arduino: ', command);
            this.port.write(command + '\n');
        } else {
            console.error('Arduino not ready. Cannot send command: ', command);
        }
    }
}