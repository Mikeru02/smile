import { Server } from 'socket.io';
import Client from '../models/v1/client.js';
import path from 'path';
import fs from 'fs';

class SocketServer {
    constructor({ server, arduino, webcam, modelApi }) {
        this.server = server;
        this.arduino = arduino;
        this.webcam = webcam;
        this.modelApi = modelApi;

        this.io = null;
        this.activeClient = null;
        this.client = new Client();
        this.timeDeductionInterval = null;

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

    // startTimeDeduction() {
    //     console.log('[SOCKET] Time deduction started (1s interval)');
        
    //     this.timeDeductionInterval = setInterval(async () => {
    //         try {
    //             const [clients] = await this.client.db.execute(
    //                 "SELECT ip, time_remaining, connection_start_at FROM clients WHERE status='active' AND time_remaining > 0",
    //                 []
    //             );

    //             for (const client of clients) {
    //                 const newTimeRemaining = await this.client.updateClientTime(client.ip);
                    
    //                 // Emit time update to all connected sockets for this client
    //                 this.io.emit('TIME_UPDATE', {
    //                     ip: client.ip,
    //                     time_remaining: newTimeRemaining,
    //                     old_time: client.time_remaining
    //                 });

    //                 // Update database with new time
    //                 if (newTimeRemaining <= 0) {
    //                     await this.client.updateClientStatus(client.ip, 'outOfTime');
    //                     await this.client.db.execute(
    //                         "UPDATE clients SET connection_start_at=?, time_remaining=?, updated_at=NOW() WHERE ip=?",
    //                         [null, 0, client.ip]
    //                     );
    //                     this.io.emit('TIME_EXPIRED', { ip: client.ip });
    //                 } else {
    //                     await this.client.db.execute(
    //                         'UPDATE clients SET time_remaining=?, updated_at=NOW() WHERE ip=?',
    //                         [newTimeRemaining, client.ip]
    //                     );
    //                 }
    //             }
    //         } catch (error) {
    //             console.error('[SOCKET] Time deduction error:', error);
    //         }
    //     }, 1000);
    // }

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
                    this.arduino.sendCommand("DONE DROP")
                }
            });
        })
    }

    registerArduinoEvents() {
        if (!this.arduino) return;

        this.arduino.parser.on('data', this.onArduinoData);
    }

    async onArduinoData(data) {
        const message = data.trim();
        if (message === "SONAR DETECTED") {
            console.log('SONAR Detected from Arduino');

            if (this.activeClient) {
                this.activeClient.emit("ARDUINO:SONAR", {
                    detected: true,
                    time: Date.now(),
                });
                try {
                    const timeStamp = Date.now();
                    const filename = `capture_${timeStamp}.jpg`;
                    await this.webcam.capture(filename);
                    await this.webcam.capture("test_capture.jpg"); 
                    const response = await this.modelApi.earnedTime();
                    console.log(response);
                    this.activeClient.emit("EARN", { earnedTime: response.earnedTime, wasteCode: response.wasteCode });
                    console.log("Done capturing, sending command to arduino")
                    this.arduino.sendCommand("DONE CAPTURE");
                    this.arduino.sendCommand(`DETECT:${response.category}`);
                } catch(err) {
                    console.error("Capture Error: ", err)
                }
            } else {
                this.arduino.sendCommand('IGNORE')
            }
        }
    }
}

export default SocketServer;