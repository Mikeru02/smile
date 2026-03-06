import jwt from "jsonwebtoken";
import getLeaseInfo from "../../utils/getLeaseInfo.js";
import Client from "../../models/v1/client.js";

class ClientController {
    constructor() {
        this.client = new Client();
    }

    // Create Functions         *****************************************
    async create(req, res) {
        try {
            const ip = req.ip || req.socket.remoteAddress;
            const { name, course, year_level } = req.body || {};
            const leaseInfo = getLeaseInfo(ip);

            if (!leaseInfo) {
                return res.status(404).json({
                    success: false,
                    message: "Client lease not found"
                })
            }

            if (!name || !course || !year_level) {
                return res.status(400).json({
                    success: false,
                    message: 'All fields are required'
                })
            }

            const { mac, hostname } = leaseInfo;
            let response;

            const existingClient = await this.client.getSpecificField("mac", mac);

            if (existingClient) {
                response = await this.client.update("mac", mac, { ip: ip });
            } else {
                response = await this.client.create(ip, mac, hostname, name, course, year_level);
            }
            
            return res.status(200).json({
                success: true,
                data: {
                    response: response,
                    token: jwt.sign({ ip: ipAddress, name: name, role: 'user' }, process.env.API_SECRET_KEY, { expiresIn: '1d' })
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
                return res.json(400).json({
                    success: false,
                    message: "Query fields are required"
                })
            }

            const response = await this.client.getClientWithSpecificField(field, fieldValue);

            if (!response) {
                return res.json(404).json({
                    success: false,
                    message: "Client not found"
                })
            }

            return res.json(200).json({
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
    async upateClientData(req, res) {
        try {
            const field = req.query.field;
            const fieldValue = req.query.value;

            if (!field || !fieldValue) {
                return res.json(400).json({
                    success: false,
                    message: "Query fields are required"
                })
            }

            const response = await this.client.update(field, fieldValue, req.body);

            if (!response) {
                return res.status(400).json({
                    success: false,
                    message: "Update failed: Invalid field or no updatable data"
                })
            }
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
                return res.json(400).json({
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