import jwt from 'jsonwebtoken';
import Client from '../../models/v2/client.js';

class ClientController {
    constructor() {
        this.client = new Client();
    }

    async create(req, res) {
        try {
            const ip = req.ip || req.socket.remoteAddress;
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

    async authenticate(req, res) {
        try {
            const clientData = await this.client.getClientByIP(res.locals.ip);
            console.log(clientData);
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

    async update(req, res) {
        try{ 
            const { name, role, password} = req.body || {};
            if (!username || !name || !role || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'All fields are required'
                }) 
            }
            const currentData = await this.account.get(res.locals.username);
            const upName = name ?? currentData.name;
            const upRole = role ?? currentData.role;
            const upPass = password ?? currentData.password;

            const response = await this.account.update(res.locals.username, upName, upRole, upPass);
            if (response?.affectedRows > 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Account details are updated'
                })
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Account details are not updated'
                })
            }
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }
}

export default ClientController;