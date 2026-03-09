import { Server } from 'socket.io';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { checkInternet, checkModel } from '../utils/dashboardInformation.js';
import fs from 'fs/promises';

class SocketServer {
    constructor({ server, arduino, webcam, modelApi, messageBot }) {
        this.server = server;
        this.arduino = arduino;
        this.webcam = webcam;
        this.modelApi = modelApi;
        this.messageBot = messageBot;
        this.srcBaseUrl = `http://${process.env.SRC_HOST}:${process.env.SRC_PORT}/api/${process.env.SRC_ROUTE_VERSION}/`
        this.axiosClient = axios.create({
            baseURL: this.srcBaseUrl,
            headers: {
                'Content-Type': "application/json",
                'apikey': process.env.SRC_KEY,
            }
        });

        this.internetStatus = null;
        this.io = null;
        this.activeClient = null;
        this.timeDeductionInterval = null;
        this.utilityMode = false;
        this.currentBinStatus = "unknown";
        this.utilityMode = false;
        this.onArduinoData = this.onArduinoData.bind(this);
    }

    async init() {
        if (this.io) return this.io;

        this.io = new Server(this.server, {
            cors: {
                origin: "*",
                methods: ['GET', 'POST']
            },
        });

        this.internetStatus = checkInternet();
        this.registerSocketEvents();
        this.registerArduinoEvents();

        return this.io;
    }

    registerSocketEvents() {
        this.io.on('connection', async (socket) => {
            socket.token = socket.handshake.auth.token;
            socket.decoded = jwtDecode(socket.token);
            socket.syncInterval = null;
            console.log('[SOCKET] CLient connected', socket.id);

            try {
                if (socket.decoded.role === 'user') {
                    this.arduino.sendCommand('CHECK_BIN');
                    const response = await this.axiosClient.get(
                        `client/?field=mac&value=${socket.decoded.mac}`,
                        {
                            headers: {
                                'token': socket.token
                            }
                        }
                    );
                    socket.clientData = response.data.data[0];
                    console.log("CLIENT DATA",socket.clientData);
                    socket.emit('TIME_REMAINING', { timeRemaining: socket.clientData.time_remaining });
                    socket.emit('CLIENT_STATUS', { status: socket.clientData.status });
                    socket.emit('INTERNET_STATUS', { online: this.internetStatus });
                    socket.emit('BIN_STATUS', { status: this.currentBinStatus });
                }
                else {
                    socket.emit('SET_UTILITY_MODE', { mode: this.utilityMode})
                }
            } catch (err) {
                console.error('[ERROR] Failed to fetch client data:', err.message);
                return;
            }

            socket.on('GET_BIN_STATUS', () => {
                // this.arduino.sendCommand('CHECK_BIN');
                console.log('[DEBUG] Bin Status: ', this.currentBinStatus);
                socket.emit('BIN_STATUS', {
                    status: this.currentBinStatus
                })
            })

            socket.on('DROP_TIMEOUT', async () => {
                const response = await this.axiosClient.patch(
                    `client/?field=mac&value=${socket.decoded.mac}`,
                    { status: "pending" },
                    {
                        headers: {
                            "token": socket.token
                        }
                    }
                );
                socket.emit('TIME_REMAINING', { timeRemaining: socket.clientData.time_remaining });
            })

            socket.on('DROPPING', async () => {
                if (this.currentBinStatus !== 'all_ok') {
                    socket.emit('DROP:blocked', {
                        message: this.currentBinStatus
                    });
                    return;
                }

                if (this.activeClient) {
                    socket.emit('DROP:busy', {
                        message: 'Another user is dropping',
                    });
                    return;
                }

                socket.emit('DROP:allowed');
                socket.emit('TIME_EARNED', { timeEarned: socket.clientData.time_earned });
                console.log('[DROP] started by: ', socket.id);
                this.activeClient = socket;
                this.arduino.sendCommand('DROPPING');
                await this.axiosClient.patch(
                    `client/?field=mac&value=${socket.decoded.mac}`,
                    { status: "dropping"},
                    {
                        headers: {
                            'token': socket.token
                        }
                    }
                )
            });

            socket.on('GET_ACCOUNTS', async () => {
                const response = await this.axiosClient.get(
                    `account/all`,
                    {
                        headers: {
                            token: socket.token
                        }
                    }
                );

                

                socket.emit('ALL_ACCOUNTS', { accounts: response.data.data })
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
                await this.axiosClient.patch(
                    `client/auth?field=mac&value=${socket.decoded.mac}`,
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
                await this.axiosClient.patch(
                    `client/deauth?field=mac&value=${socket.decoded.mac}`,
                    {},
                    {
                        headers: {
                            'token': socket.token
                        }
                    }
                );

                const response = await this.axiosClient.get(
                    `client/?field=mac&value=${socket.decoded.mac}`,
                    {
                        headers: {
                            'token': socket.token
                        }
                    }
                )
                socket.clientData = response.data.data[0];
                socket.emit('TIME_REMAINING', { timeRemaining: socket.clientData.time_remaining });
            });

            socket.on('DROP_COMPLETE', async () => {
                if (this.activeClient === socket) {
                    this.activeClient = null;
                    this.arduino.sendCommand("DONE DROP")
                    await this.axiosClient.patch(
                        `client/?field=mac&value=${socket.decoded.mac}`,
                        { status: "pending"},
                        {
                            headers: {
                                'token': socket.token
                            }
                        }
                    )
                    const response = await this.axiosClient.get(
                        `client/?field=mac&value=${socket.decoded.mac}`,
                        {
                            headers: {
                                'token': socket.token
                            }
                        }
                    )
                    socket.clientData = response.data.data[0];
                    console.log("DEBUG: ", socket.clientData);
                    socket.emit('TIME_REMAINING', { timeRemaining: socket.clientData.time_remaining });
                    socket.emit('DROP_FINISHED');
                }
            })

            socket.on('ADD_TIME', async() => {
                try {
                await this.axiosClient.patch(
                    `client/add-time?field=mac&value=${socket.decoded.mac}`,
                    {},
                    {
                        headers: {
                            'token': socket.token
                        }
                    }
                )

                const response = await this.axiosClient.get(
                    `client/?field=mac&value=${socket.decoded.mac}`,
                    {
                        headers: {
                            'token': socket.token
                        }
                    }
                )
                socket.clientData = response.data.data[0];
                console.log("DEBUG: ", socket.clientData);
                socket.emit('TIME_REMAINING', { timeRemaining: socket.clientData.time_remaining });
                }
                catch (err) {
                    console.error('ADD_TIME error:', err.message);
                }
            });

            socket.on('DEDUCT_TIME', (data) => {
                socket.clientData.time_remaining = data.timeRemaining;
            })

            socket.on('UTILITY_MODE', (data) => {
                const mode = data.mode;
                this.utilityMode = mode;
                this.arduino.sendCommand(`SET_UTILITY_MODE:${mode}`);
                socket.emit('SET_UTILITY_MODE', { mode: this.utilityMode})
            })

            socket.on('disconnect', async () => {
                console.log('[SOCKET] disconnected:', socket.id);

                if (this.activeClient === socket) {
                    this.activeClient = null;
                    this.arduino.sendCommand("DONE DROP")
                    await this.axiosClient.patch(
                        `client/?field=mac&value=${socket.decoded.mac}`,
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

        if (message === 'READY') {
            console.log("CHECKING BINS");
            this.arduino.sendCommand('CHECK_BIN');
            console.log("CHECKING MODE");
            this.arduino.sendCommand('CHECK_MODE');
        }

        if (message.startsWith("UTILITY_MODE:")) {
            const utilityMode = message.split(":")[1];
            if (utilityMode === "on") {
                this.utilityMode = true;
            }
            else if (utilityMode === "off") {
                this.utilityMode = false;
            } 
            else {
                console.error("Invalid mode");
            }
            this.io.emit('SET_UTILITY_MODE', { mode: this.utilityMode });
        }

        if (message.startsWith("BINS:")) {
            const status = message.split(":")[1];
            console.log('[INFO] Bin Status: ', status);
            this.currentBinStatus = status;
            this.io.emit('BIN_STATUS', { status: status });
            if (status !== "all_ok") {
                await this.messageBot.sendMessageToMaintainers(`${status} bin is full. Kindly take it out.`)
            }
            return;
        }

        if (message === "SONAR DETECTED:utility") {
            try {
                const timeStamp = Date.now();
                const uniqueFilename = `capture_${timeStamp}.jpg`;
                const savedPath = await this.webcam.capture(uniqueFilename);
                console.log("Unique image saved:", savedPath);

                const testPath = await this.webcam.getFilePath("test_capture.jpg");
                fs.copyFile(savedPath, testPath);
                console.log("test_capture overwritten:", testPath);

                await new Promise(resolve => setTimeout(resolve, 1000));

                const response = await this.modelApi.earnedTime();
                
                console.log("Done capturing, sending command to arduino")
                this.arduino.sendCommand("DONE CAPTURE");
                this.arduino.sendCommand(`DETECT:${response.category}`);
            } catch(err) {
                console.error("Capture Error: ", err)
            }
        }

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

                    const testPath = await this.webcam.getFilePath("test_capture.jpg");
                    fs.copyFile(savedPath, testPath);
                    console.log("test_capture overwritten:", testPath);

                    await new Promise(resolve => setTimeout(resolve, 1000));

                    const response = await this.modelApi.earnedTime();
                    
                    client.clientData.time_earned += response.earnedTime;
                    await this.axiosClient.post(
                        `client/earn?field=mac&value=${client.decoded.mac}`,
                        { time_earned: response.earnedTime, waste_code: response.wasteCode },
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