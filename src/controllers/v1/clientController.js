import jwt from "jsonwebtoken";
import getLeaseInfo from "../../utils/getLeaseInfo.js";
import Client from "../../models/v1/client.js";

class ClientController {
    constructor() {
        this.client = new Client();
    }

    // Create Functions     *****************************************
    async create(req, res) {
        try {
            const ip = req.ip || req.socket.remoteAddress;
            const leaseInfo = getLeaseInfo(ip);

            if (!leaseInfo) {
                return res.status(404).json({
                    success: false,
                    message: "Client lease not found"
                })
            }

            const { name, course, year_level } = req.body || {};
            const { mac, hostname } = leaseInfo;
            let response;

            const existingClient = await this.client.getSpecificField("mac", mac);

            if (existingClient) {
                response = await this.client.update("mac", mac, { ip: ip});
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
}

export default ClientController;