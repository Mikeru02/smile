import { Server } from 'socket.io';
import { runModel } from '../utils/runModel.js';

class SocketServer {
    constructor({ server, arduino }) {
        this.server = server;
        this.arduino = arduino;

        this.io = null;
        this.activeClient = null;

        this.onArduinoData = this.onArduinoData.bind(this);
    }

    init() {
        if (this.io) return this.io;

        this.io = new Server(this.server, {
            cors: {
                origin: "*",
                methods: ['GET', 'POST']
            },
        });

        this.registerSocketEvents();
        this.registerArduinoEvents();

        return this.io;
    }

    registerSocketEvents() {
        this.io.on('connection', (socket) => {
            console.log('[SOCKET] CLient connected', socket.id);

            socket.on('DROPPING', () => {
                if (this.activeClient) {
                    socket.emit('DROP:busy', {
                        message: 'Another user is dropping',
                    });
                    return;
                }

                console.log('[DROP] started by: ', socket.id);
                this.activeClient = socket;
                this.arduino.sendCommand('DROPPING');
            });

            socket.on('disconnect', () => {
                console.log('[SOCKET] disconnected:', socket.id);

                if (this.activeClient === socket) {
                    this.activeClient = null;
                }
            });
        })
    }

    registerArduinoEvents() {
        if (!this.arduino) return;

        this.arduino.parser.on('data', this.onArduinoData);
    }

    onArduinoData(data) {
        const message = data.trim();
        if (message === "SONAR DETECTED") {
            console.log('SONAR Detected from Arduino');

            if (this.activeClient) {
                this.activeClient.emit("ARDUINO:SONAR", {
                    detected: true,
                    time: Date.now(),
                });
            }
        }
    }
}

export default SocketServer;