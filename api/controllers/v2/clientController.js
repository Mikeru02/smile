import jwt from 'jsonwebtoken';
import Client from '../../models/v2/client.js';

class ClientController {
    constructor() {
        this.client = new Client();
    }

    async create(req, res) {
        try {
            const ip = req.ip || req.socket.remoteAddress;

            // Check client if it is existing in db
            const existingClientData = await this.getClientByIP(ip);

            if (existingClientData) {
                return res.status(200).json({
                    success: true,
                    data: {
                        token: jwt.sign({ 'ip': ip }, process.env.API_SECRET_KEY, {
                            expiresIn: '1d'
                        })
                    }
                });
            }
            
            const { name, course, yearlevel } = req.body || {};
            if (!name || !course || !yearlevel) {
                return res.status(400).json({
                    success: false,
                    message: 'All fields are required'
                })
            }
            const response = await this.client.create(ip, name, course, yearlevel);
            return res.status(200).json({
                success: true,
                data: {
                    token: jwt.sign({ 'ip': ip }, process.env.API_SECRET_KEY, {
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

    async authenticate(req, res) {
        try {
            const clientData = await this.client.getClientByIP(res.locals.ip);
            const timeRemaining = clientData.time_remaining;

            if (timeRemaining <= 0 && clientData.status != 'paused') {
                return res.status(400).json({
                sucess: true,
                message: 'No time or status is incorrect'
            });
            }

            await this.client.authenticate(res.locals.ip);
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
            await this.client.deauthenticate(res.locals.ip);
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
            const { earned_time } = req.body || {};
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

            await this.client.earned(res.locals.ip, convertedTime);
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

            await this.client.updateClientStatus(res.locals.ip, status);
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
}

export default ClientController;