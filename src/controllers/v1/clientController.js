import jwt from "jsonwebtoken";
import getLeaseInfo from "../../utils/getLeaseInfo.js";
import Client from "../../models/v1/client.js";
import Waste from "../../models/v1/waste.js";
import Log from "../../models/v1/log.js";
import ClientManagement from "../../utils/clientManagement.js";

class ClientController {
    constructor() {
        this.client = new Client();
        this.waste = new Waste();
        this.log = new Log();
    }

    // Create Functions         *****************************************
    async create(req, res) {
        try {
            const ip = req.ip || req.socket.remoteAddress;
            const { student_id, name, course, year_level } = req.body || {};
            const leaseInfo = getLeaseInfo(ip);

            if (!leaseInfo) {
                return res.status(404).json({
                    success: false,
                    message: "Client lease not found"
                })
            }

            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Name field is required'
                })
            }

            const { mac, hostname } = leaseInfo;
            const studentIdVal = student_id ?? null;
            const courseVal = course ?? null;
            const yearLevelVal = year_level ?? null;            
            let response;

            const existingClient = await this.client.getClientWithSpecificField("mac", mac);

            if (existingClient && existingClient.length > 0) {
                response = await this.client.update("mac", mac, { ip: ip });
            } else {
                response = await this.client.create(ip, mac, hostname, studentIdVal, name, courseVal, yearLevelVal);
            }

            console.log('RESPONSE: ', response);

            if (!response) {
                return res.status(400).json({
                    success: false,
                    message: `Insert failed: ${response}`
                })
            }
            
            return res.status(200).json({
                success: true,
                data: {
                    response: response,
                    token: jwt.sign({ mac: mac, name: name, role: 'user' }, process.env.API_SECRET_KEY, { expiresIn: '1d' })
                },
            })
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    // Get Functions        *****************************************
    async getClientWithSpecificField(req, res) {
        try {
            const field = req.query.field
            const fieldValue = req.query.value;

            if (!field || !fieldValue) {
                return res.status(400).json({
                    success: false,
                    message: "Query fields are required"
                })
            }

            const response = await this.client.getClientWithSpecificField(field, fieldValue);

            if (!response) {
                return res.status(404).json({
                    success: false,
                    message: "Client not found"
                })
            }

            return res.status(200).json({
                success: true,
                data: response
            })
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async getAll(req, res) {
        try {
            const response = await this.client.getAll();

            if (!response) {
                return res.status(404).json({
                    success: false,
                    message: "No clients found"
                })
            }

            return res.status(200).json({
                success: true,
                data: response
            })

        } 
        catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    // Update Functions         *****************************************
    async authenticate(req, res) {
        try {
            let client;
            let field;
            let fieldValue;

            if (res.locals.role === "admin") {
                const { clientId } = req.body || {};
                client = await this.client.getClientWithSpecificField('id', clientId);
            }
            else {
                field = req.query.field;
                fieldValue = req.query.value;

                if (!field || !fieldValue) {
                    return res.status(400).json({
                        success: false,
                        message: "Query fields are required"
                    })
                }
                client = await this.client.getClientWithSpecificField(field, fieldValue);
            }

            if (!client && client.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Client not found"
                });
            }

            const clientData = client[0];

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

            await this.client.update(field, fieldValue, { status: 'active', expire_at: fomattedExpireAt, connection_start_at: new Date(), updated_at: new Date() });
            try {
                ClientManagement.allowClient(clientData.ip);
            } catch (err) {
                console.error("Failed to allow client:", err);
                return res.status(500).json({ // TODO: Change this status code to 500 after development
                    success: false,
                    message: "Failed to allow client: " + err.message
                });
            }
            await this.log.create("Client Connected", `Client ${clientData.name} is connected and will expire on ${fomattedExpireAt}`, "INFO");

            return res.status(200).json({
                sucess: true,
                message: 'Client authenticated'
            });

        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async deauthenticate(req, res) {
        try {
            let client;
            let field;
            let fieldValue;

            if (res.locals.role === "admin") {
                const { clientId } = req.body || {};
                client = await this.client.getClientWithSpecificField('id', clientId);
            }
            else {
                field = req.query.field;
                fieldValue = req.query.value;

                if (!field || !fieldValue) {
                    return res.status(400).json({
                        success: false,
                        message: "Query fields are required"
                    })
                }
                client = await this.client.getClientWithSpecificField(field, fieldValue);
            }

            if (!client && client.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Client not found"
                });
            }

            const clientData = client[0];

            const now = new Date();
            const consumedTime = Math.floor(
                (now - new Date(clientData.connection_start_at)) / 1000
            );

            let updatedTimeRemaining = clientData.time_remaining - consumedTime;

            await this.client.update(field, fieldValue, { status: 'pending', expire_at: null, time_remaining: updatedTimeRemaining, connection_start_at: null, updated_at: new Date()})
            try {
                ClientManagement.revokeClient(clientData.ip);
            } catch (err) {
                console.error("Failed to allow client:", err);
                return res.status(500).json({ // TODO: Change this status code to 500 after development
                    success: false,
                    message: "Failed to allow client: " + err.message
                });
            }
            return res.status(200).json({
                sucess: true,
                message: 'Client deauthenticated'
            });

        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async updateClientData(req, res) {
        try {
            const field = req.query.field;
            const fieldValue = req.query.value;

            if (!field || !fieldValue) {
                return res.status(400).json({
                    success: false,
                    message: "Query fields are required"
                })
            }

            const response = await this.client.update(field, fieldValue, req.body);

            if (!response) {
                return res.status(400).json({
                    success: false,
                    message: `Update failed: ${response}`
                })
            }

            return res.status(200).json({
                success: true,
                data: response
            })
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async earned(req, res) {
        try {
            const field = req.query.field;
            const fieldValue = req.query.value;

            if (!field || !fieldValue) {
                return res.status(400).json({
                    success: false,
                    message: "Query fields are required"
                })
            }

            const { time_earned, waste_code } = req.body || {};
            const client = await this.client.getClientWithSpecificField(field, fieldValue);

            if (!client && client.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Client not found"
                });
            }
            
            const clientData = client[0];
            
            const convertedTime = Number(time_earned);
            if (isNaN(convertedTime) || convertedTime <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid time value"
                })
            }

            const currentTimeEarned = Number(clientData.time_earned) || 0;
            const totalTime = currentTimeEarned + convertedTime;

            await this.client.update("mac", res.locals.mac, { time_earned: totalTime, updated_at: new Date()})
            await this.waste.createTrashTransaction(clientData.id, waste_code, 1, convertedTime);
            await this.log.create("Earned Time", `Client ${clientData.name} earned ${convertedTime}`, "INFO");

            return res.status(200).json({
                success: true,
                message: "Time earned added"
            })
            
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async addTime(req, res) {
        try {
            const field = req.query.field;
            const fieldValue = req.query.value;

            if (!field || !fieldValue) {
                return res.status(400).json({
                    success: false,
                    message: "Query fields are required"
                })
            }

            const client = await this.client.getClientWithSpecificField(field, fieldValue);

            if (!client && client.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Client not found"
                });
            }

            const clientData = client[0];

            const timeRemaining = clientData.time_remaining + clientData.time_earned;
            await this.client.update(field, fieldValue, { time_remaining: timeRemaining, time_earned: 0, updated_at: new Date() });
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    // Delete Functions         *****************************************
    async deleteClientData(req, res) {
        try {
            const field = req.query.field;
            const fieldValue = req.query.value;

            if (!field || !fieldValue) {
                return res.status(400).json({
                    success: false,
                    message: "Query fields are required"
                })
            }

            const response = await this.client.deleteData(field, fieldValue);

            if (!response) {
                return res.status(400).json({
                    success: false,
                    message: `Delete failed: ${response}`
                })
            }
            
            return res.status(200).json({
                success: true,
                data: response
            })
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }
}

export default ClientController;