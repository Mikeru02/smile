import { Server } from 'socket.io';
import axios from 'axios';
import { checkInternet } from '../utils/dashboardInformation.js';

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
            socket.token = socket.handshake.auth.token;
            socket.syncInterval = null;
            console.log('[SOCKET] CLient connected', socket.id);

            try {
                const response = await this.axiosClient.get(
                    `client/`,
                    {
                        headers: {
                            'token': socket.token
                        }
                    }
                )
                socket.clientData = response.data.data;
                console.log('Client Data Loaded:', socket.clientData);
                socket.emit('TIME_REMAINING', { timeRemaining: socket.clientData.time_remaining });
                socket.emit('CLIENT_STATUS', { status: socket.clientData.status });
                socket.emit('INTERNET_STATUS', { online: checkInternet() });
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
                socket.emit('TIME_EARNED', { timeEarned: socket.clientData.time_earned })
                console.log('[DROP] started by: ', socket.id);
                this.activeClient = socket;
                this.arduino.sendCommand('DROPPING');
            });

            socket.on('DROPPING_CLIENT', async () => {
                const droppingClient = await this.axiosClient.get(
                    `client/status/dropping`,
                    {
                        headers: {
                            'token': socket.token
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
                            'token': socket.token
                        }
                    }
                )
                //this.startClientSync(socket);
            })

            socket.on('DEAUTH_CLIENT', async () => {
                await this.axiosClient.post(
                    `client/deauth`,
                    {},
                    {
                        headers: {
                            'token': socket.token
                        }
                    }
                )
                const response = await this.axiosClient.get(
                    `client/`,
                    {
                        headers: {
                            'token': socket.token
                        }
                    }
                )
                socket.clientData = response.data.data;
                socket.emit('TIME_REMAINING', { timeRemaining: socket.clientData.time_remaining });
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
                                'token': socket.token
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
                            'token': socket.token
                        }
                    }
                )
            });

            socket.on('DEDUCT_TIME', (data) => {
                socket.clientData.time_remaining = data.timeRemaining;
            })

            socket.on('disconnect', async () => {
                console.log('[SOCKET] disconnected:', socket.id);

                await this.axiosClient.patch(
                    `client/time-remaining`,
                    {},
                    {
                        headers: {
                            'token': socket.token
                        }
                    }
                )

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
                                'token': socket.token
                            }
                        }
                    )
                }
            });
        })
    }

    startClientSync(socket) {
        if (socket.syncInterval) return;

        console.log("✅ Starting sync for:", socket.id);    

        socket.syncInterval = setInterval(async () => {
            console.log("🔄 Sync running for:", socket.id);
            try {
                const response = await this.axiosClient.get(
                    `client/`,
                    { headers: { token: socket.token } }
                );

                socket.clientData = response.data.data;

                socket.emit('TIME_REMAINING', {
                    timeRemaining: socket.clientData.time_remaining
                });

                if (socket.clientData.status === 'pending') {
                    socket.emit('SESSION_EXPIRED');
                    this.stopClientSync(socket);
                }

            } catch (err) {
                console.error('Client Sync Error:', err.message);
            }
        }, 5000); // check every 5 seconds
    }

    stopClientSync(socket) {
        if (socket.syncInterval) {
            clearInterval(socket.syncInterval);
            socket.syncInterval = null;
        }
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
                                'token': client.token
                            }
                        }
                    );
                    client.emit('TIME_EARNED', { timeEarned: client.clientData.time_earned })
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