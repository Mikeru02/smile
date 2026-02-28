import { Server } from 'socket.io';
import axios from 'axios';
import { checkInternet } from '../utils/dashboardInformation.js';
import Client from '../models/v1/client.js';
import path from 'path';
import fs from "fs/promises";

class SocketServer {
    constructor({ server, arduino, webcam, modelApi }) {
        this.server = server;
        this.arduino = arduino;
        this.webcam = webcam;
        this.modelApi = modelApi;
        this.srcBaseUrl = `http://${process.env.SRC_HOST}:${process.env.SRC_PORT}/api/${process.env.SRC_ROUTE_VERSION}/`
        this.axiosClient = axios.create({
            baseURL: this.srcBaseUrl,
            headers: {
                'Content-Type': "application/json",
                'apikey': process.env.SRC_KEY,
            }
        });
        this.io = null;
        this.activeClient = null;
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
        this.io.on('connection', async (socket) => {
            const token = socket.handshake.auth.token;
            console.log('[SOCKET] CLient connected', socket.id);

            try {
                const response = await this.axiosClient.get(
                    `client/`,
                    {
                        headers: {
                            'token': token
                        }
                    }
                )
                socket.clientData = response.data.data;
                console.log('Client Data Loaded:', socket.clientData);
            } catch (err) {
                console.error('[ERROR] Failed to fetch client data:', err.message);
                return;
            }

            socket.on('DROPPING', () => {
                if (this.activeClient) {
                    socket.emit('DROP:busy', {
                        message: 'Another user is dropping',
                    });
                    return;
                }

                socket.emit('DROP:allowed');
                console.log('[DROP] started by: ', socket.id);
                // await this.axiosClient.patch(
                //     `client/`,
                //     { status: 'dropping' },
                //     {
                //         headers: {
                //             'token': token
                //         }
                //     }
                // )
                this.activeClient = socket;
                this.arduino.sendCommand('DROPPING');
            });

            socket.on('DROPPING_CLIENT', async () => {
                const droppingClient = await this.axiosClient.get(
                    `client/status/dropping`,
                    {
                        headers: {
                            'token': token
                        }
                    }
                );
                socket.emit('DROPPING_CLIENT_DATA', droppingClient.data.data);
            })

            socket.on('AUTH_CLIENT', async () => {
                await this.axiosClient.post(
                    `client/auth`,
                    {},
                    {
                        headers: {
                            'token': token
                        }
                    }
                )
            })

            socket.on('DEAUTH_CLIENT', async () => {
                await this.axiosClient.post(
                    `client/deauth`,
                    {},
                    {
                        headers: {
                            'token': token
                        }
                    }
                )
            })

            socket.on('CHECK_INTERNET', () => {
                const hasInternet = checkInternet();

                socket.emit('INTERNET_STATUS', {
                    online: hasInternet,
                    timestamp: Date.now()
                });
            })

            socket.on('DROP_COMPLETE', async () => {
                if (this.activeClient === socket) {
                    this.activeClient = null;
                    this.arduino.sendCommand("DONE DROP")
                    await this.axiosClient.patch(
                        `client/`,
                        { status: "pending"},
                        {
                            headers: {
                                'token': token
                            }
                        }
                    )
                    socket.emit('DROP_FINISHED');
                }
            })

            socket.on('ADD_TIME', async() => {
                await this.axiosClient.post(
                    `client/add-time`,
                    {},
                    {
                        headers: {
                            'token': token
                        }
                    }
                )
            })

            socket.on('GET_TIME_EARNED', async() => {
                const response = await this.axiosClient.get(
                    `client/time/time_earned`,
                    {
                        headers: {
                            'token': token
                        }
                    }
                )

                socket.emit('TIME_EARNED', {
                    timeEarned: response.data.data.time_earned,
                    timestamp: Date.now()
                })
            });

            socket.on('GET_TIME_REMAINING', async () => {
                const response = await this.axiosClient.get(
                    `client/time/time_remaining`,
                    {
                        headers: {
                            'token': token
                        }
                    }
                );
                socket.emit('TIME_REMAINING', {
                    timeRemaining: response.data.data.time_remaining,
                    timestamp: Date.now()
                })
            });

            socket.on('EARNED', async ({ time, wasteCode }) => {
                await this.axiosClient.post(
                    `client/earn`,
                    { earned_time: time, waste_code: wasteCode },
                    {
                        headers: {
                            'token': token
                        }
                    }
                )
            })

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
                                'token': token
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
            const client = this.activeClient;

            if (client) {
                this.activeClient.emit("ARDUINO:SONAR", {
                    detected: true,
                    time: Date.now(),
                });
                try {
                    const timeStamp = Date.now();
                    const uniqueFilename = `capture_${timeStamp}.jpg`;
                    const savedPath = await this.webcam.capture(uniqueFilename);
                    console.log("Unique image saved:", savedPath);

                    const testPath = await this.webcam.capture("test_capture.jpg");

                    console.log("test_capture overwritten:", testPath);

                    const response = await this.modelApi.earnedTime();
                    
                    client.clientData.time_earned += response.earnedTime;
                    await this.axiosClient.post(
                        `client/earn`,
                        { earned_time: response.earnedTime, waste_code: response.wasteCode },
                        {
                            headers: {
                                'token': token
                            }
                        }
                    );
                    client.emit('TIME_EARNED', { timeEarned: response.earnedTime })
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