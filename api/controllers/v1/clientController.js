import jwt from 'jsonwebtoken';

export default class ClientController {
    constructor(clientModel) {
        this.clientModel = clientModel;
    }

    async create(req, res) {
        try {
            // Get IP
            const ip = req.ip || req.connection.remoteAddress;

            // Get Name Course Year Level
            const { name, course, yearlevel } = req.body || {};
            
            if (!name || !course || !yearlevel) {
                return res.status(400).json({ 
                    sucess: false,
                    message: 'Name, Course & Year Level is required!',
                });
            }

            const clientData = {
                "name": name,
                "course": course,
                "yearlevel": yearlevel,
                "ip": ip,
                "status": "pending",
                "time_remaining": 0,
                "time_earned": 0,
                "connection_start_at": null,
                "created_at": new Date(),
                "updated_at": new Date()
            }

            const response = await this.clientModel.create(clientData);
            
            return res.status(201).json({
                sucess: true,
                data: {
                    message: 'Client created successfully',
                    id: response.insertedId,
                    token: jwt.sign({ "ip": ip, "name": name}, process.env.API_SECRET_KEY, {
                        expiresIn: "1d"
                    })
                }    
            })
        } catch(err) {
            console.error('[ERROR] <ClientController.create>: ', err.message);
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }

    async authenticate(req, res) {
        try {
            // Get ip
            const ip = req.ip || req.connection.remoteAddress;
            const clientData = await this.clientModel.getClientByIP(ip);
            const earned_time = clientData.time_earned;

            if (earned_time === 0 || clientData.status != 'dropping') {
                return res.status(406).json({
                    success: false,
                    message: "You must drop a trash to earn time!"
                });
            }

            // Change status of the client
            await this.clientModel.updateClientByIP(ip, {
                $set: {
                    status: "active",
                    updated_at: new Date(),
                    connection_start_at: new Date(),
                    time_earned: 0
                },
                $inc: {
                    time_remaining: earned_time
                }
            });

            return res.status(200).json({
                success: true,
                message: "You are now authenticated"
            })

        } catch(err) {
            console.error('[ERROR] <ClientController.authenticate>: ', err.message);
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }

    async startDrop(req, res) {
        try {
            const ip = req.ip || req.connection.remoteAddress;
            const existingDropper = await this.clientModel.getClientByStatus('dropping');

            if (existingDropper) {
                return res.status(406).json({
                    success: false,
                    message: "Can't start drop, other user has dropping"
                })
            }

            // Change status of the client
            await this.clientModel.updateClientByIP(ip, {
                $set: {
                    status: "dropping",
                    updated_at: new Date(),
                }
            });

            return res.status(200).json({
                sucess: true,
                message: "You can now start dropping of trash"
            })

        } catch(err) {
            console.error('[ERROR] <ClientController.startDrop>: ', err.message);
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }

    async earned(req, res) {
        try {
            // Get IP
            const ip = req.ip || req.connection.remoteAddress;
            const { earned_time } = req.body || {};

            if (!earned_time) {
                return res.status(400).json({ 
                    success: false,
                    message: 'No time earned',
                });
            }

            const converted = Number(earned_time)
            if (isNaN(converted) || converted <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid time value'
                });
            }

            // Change status of the client
            await this.clientModel.updateClientByIP(ip, {
                $inc: {
                    time_earned: converted
                }
            });

            return res.status(200).json({
                success: true,
                message: `Added ${converted} seconds to ${ip}`
            });
        } catch(err){
            console.error('[ERROR] <ClientController.earned>: ', err.message);
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }
}