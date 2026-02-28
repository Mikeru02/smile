import jwt from 'jsonwebtoken';
import Client from '../../models/v1/client.js';
import Log from '../../models/v1/log.js';
import ClientManagement from '../../utils/clientManagement.js';

class ClientController {
    constructor() {
        this.client = new Client();
        this.log = new Log();
    }

    async create(req, res) {
        try {
            const ipAddress = req.ip || req.socket.remoteAddress;
            const { name, course, yearlevel } = req.body || {};
            if (!name || !course || !yearlevel) {
                return res.status(400).json({
                    success: false,
                    message: 'All fields are required'
                })
            }

            // Check client if it is existing in db
            const existingClientData = await this.client.verfyClient(ipAddress, name, course, yearlevel);
            if (existingClientData) {
                await this.log.create("Client Connect", `Client ${name} has logged in with IP of ${ipAddress}`, "INFO")
                return res.status(200).json({
                    success: true,
                    data: {
                        token: jwt.sign({ ip: ipAddress, name: existingClientData.name, role: 'user' }, process.env.API_SECRET_KEY, {
                            expiresIn: '1d'
                        })
                    }
                });
            }
            
            const response = await this.client.create(ipAddress, name, course, yearlevel);
            await this.log.create("Client Registered", `Client ${name} has resgitered with IP of ${ipAddress}`, "INFO")
            return res.status(200).json({
                success: true,
                data: {
                    token: jwt.sign({ ip: ipAddress, name: name, role: 'user' }, process.env.API_SECRET_KEY, {
                        expiresIn: '1d'
                    })
                }
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async firstAuthenticate(req, res) {
        try {
            const clientData = await this.client.getClientByIP(res.locals.ip);
            const earnedTime = clientData.time_earned;
            if (earnedTime === 0 || clientData.status != 'dropping') {
                return res.status(400).json({
                    success: false,
                    messgae: "You must drop a trash to earn time!"
                });
            }
            await this.client.firstAuthenticate(res.locals.ip);
            ClientManagement.allowClient(res.locals.ip);
            return res.status(200).json({
                success: true,
                message: 'Client Authenticated!'
            })

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async addTime(req, res) {
        try {
            const clientData = await this.client.getClientByIP(res.locals.ip);
            const earnedTime = clientData.time_earned;
            if (earnedTime === 0) {
                return res.status(400).json({
                    success: false,
                    messgae: "You must drop a trash to earn time!"
                });
            }
            await this.client.addTime(res.locals.ip);
            await this.log.create("Add Time", `Client ${clientData.name} added ${earnedTime} time to his/her time`, "INFO")

            return res.status(200).json({
                success: true,
                message: 'Add time success!'
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async authenticate(req, res) {
        try {
            let clientData = null;

            if (res.locals.role === "admin") {
                const { clientId } = req.body;
                clientData = await this.client.getClientByID(clientId);
            } else {
                clientData = await this.client.getClientByIP(res.locals.ip);
            }

            const timeRemaining = clientData.time_remaining;

            if (timeRemaining <= 0 && clientData.status != 'paused') {
                return res.status(400).json({
                    success: true,
                    message: 'No time or status is incorrect'
                });
            }

            const now = new Date();
            const expireAt = new Date(now.getTime() + (timeRemaining * 1000));
            const fomattedExpireAt = expireAt.toLocaleString('sv-SE').replace('T', ' ');

            await this.client.authenticate(clientData.ip, clientData.name, fomattedExpireAt);
            try {
                ClientManagement.allowClient(clientData.ip);
            } catch (err) {
                console.error("Failed to allow client:", err);
                return res.status(200).json({ // TODO: Change this status code to 500 after development
                    success: false,
                    message: "Failed to allow client: " + err.message
                });
            }
            await this.log.create("Client Connected", `Client ${clientData.name} is connected and will expire on ${fomattedExpireAt}`, "INFO")

            return res.status(200).json({
                sucess: true,
                message: 'Client authenticated'
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async deauthenticate(req, res) {
        try {
            let clientData = null;

            if (res.locals.role === "admin") {
                const { clientId } = req.body;
                clientData = await this.client.getClientByID(clientId);
            } else {
                clientData = await this.client.getClientByIP(res.locals.ip);
            }

            await this.client.deauthenticate(clientData.ip, clientData.name);
            try {
                ClientManagement.revokeClient(clientData.ip);
            } catch (err) {
                console.error("Failed to allow client:", err);
                return res.status(200).json({ // TODO: Change this status code to 500 after development
                    success: false,
                    message: "Failed to allow client: " + err.message
                });
            }
            await this.log.create("Client Disconnected", `Client ${clientData.name} is disconnected`, "INFO")
            return res.status(200).json({
                sucess: true,
                message: 'Client deauthenticated'
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async revoke(req, res) {
        try {
            await this.client.revoke(res.locals.ip);
            return res.status(200).json({
                sucess: true,
                message: 'Client revoke access to internet'
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async getAllOutOfTimeClients(req, res) {
        try {
            const response = await this.client.getAllOutofTimeClients();
            return res.status(200).json({
                success: true,
                data: response
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async startDrop(req, res) {
        try {
            const existingDropper = await this.client.getClientByStatus('dropping');
            if (existingDropper.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Other user is dropping'
                })
            }
            await this.client.updateClientStatus(res.locals.ip, 'dropping');
            await this.log.create("Drop Initialize", `Client ${clientData.name} is currently dropping`, "INFO")

            return res.status(200).json({
                success: true,
                message: "You can now start dropping trash"
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async earned(req, res) {
        try {
            const { earned_time, waste_code } = req.body || {};
            if (!earned_time) {
                return res.status(400).json({
                    success: false,
                    message: 'No time earned'
                })
            }
            const convertedTime = Number(earned_time);
            if (isNaN(convertedTime) || convertedTime <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid time value"
                })
            }

            await this.client.earned(res.locals.ip, waste_code, convertedTime);
            await this.log.create("Earned Time", `Client ${res.locals.ip} earned ${convertedTime} time`, "INFO")
            return res.status(200).json({
                success: true,
                message: "Time earned is added"
            })
            
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async getClientByID(req, res) {
        try {
            const response = await this.client.getClientByID(req.params.id);
            return res.status(200).json({
                success: true,
                data: response
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async getClientByIP(req, res) {
        try {
            const response = await this.client.getClientByIP(res.locals.ip);
            return res.status(200).json({
                success: true,
                data: response
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async getClientTime(req, res) {
        try {
            const response = await this.client.getClientTime(res.locals.ip, req.params.type);
            
            return res.status(200).json({
                success: true,
                data: response
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async updateClientStatus(req, res) {
        try {
            const { status } = req.body || {};
            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: 'Field is required'
                });
            }

            await this.client.updateClientStatus(res.locals.ip, res.locals.name, status);
            await this.log.create("Update Status", `Client ${res.locals.name} change status to ${status}`, "INFO")

            return res.status(200).json({
                success: true,
                message: 'Updated successfully'
            });

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async updateClientData(req, res) {
        try {
            const id = req.params.id;
            const { name, course, year_level, status, time_remaining, time_earned, expire_at } = req.body || {};
            const response = await this.client.updateClientData(id, name, course, year_level, status, time_remaining, time_earned, expire_at);
            res.status(200).json({
                success: true,
                data: response
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async updateAllClientsTime(req, res) {
        try {
            const response = await this.client.updateAllClientsTime();
            return res.status(200).json({
                success: true,
                response: response
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async getAllClients(req, res) {
        try {
            const response = await this.client.getAllClients();
            return res.status(200).json({
                success: true,
                data: response
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async getAllClientByStatus(req, res) {
        try {
            const clients = await this.client.getClientByStatus(req.params.status);
            return res.status(200).json({
                success: true,
                data: clients
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async checkInternetConnection(req, res) {
        try {
            const response = await this.client.checkInternetConnection();
            return res.status(200).json({
                success: true,
                data: response
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async getCalculatedTimeRemaining(req, res) {
        try {
            const calculatedTime = await this.client.updateClientTime(res.locals.ip);
            return res.status(200).json({
                success: true,
                data: {
                    time_remaining: calculatedTime
                }
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async updateTimeRemaining(req, res) {
        try {
            const { timeRemaining } = req.body || {};
            console.log("TIME REMAINING: ", timeRemaining);
            console.log('RES IP', res.locals.ip, 'RES NAME', res.locals.name);
            const response = await this.client.updateClientTime(res.locals.ip);
            return res.status(200).json({
                success: true,
                data: {
                    response
                }
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }
}

export default ClientController;