import { Server } from 'socket.io';
import axios from 'axios';
import Client from '../models/v1/client.js';
import path from 'path';
import fs from 'fs';

class SocketServer {
    constructor({ server, arduino, webcam, modelApi }) {
        this.server = server;
        this.arduino = arduino;
        this.webcam = webcam;
        this.modelApi = modelApi;
        this.srcBaseUrl = `http://${process.env.SRC_HOST}:${process.env.SRC_PORT}/${process.env.SRC_ROUTE_VERSION}/`
        this.axiosClient = axios.create({
            baseURL: this.srcBaseUrl
        });
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

            socket.on('disconnect', async () => {
                console.log('[SOCKET] disconnected:', socket.id);

                if (this.activeClient === socket) {
                    this.activeClient = null;
                    this.arduino.sendCommand("DONE DROP")
                    await this.axiosClient.patch(
                        `client/`,
                        { status: "pending"},
                        {
                            headers: {
                                'Content-Type': "application/json",
                                'apikey': process.env.SRC_KEY,
                                'token': localStorage.getItem('token')
                            }
                        }
                    )
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