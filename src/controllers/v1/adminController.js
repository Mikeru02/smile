import jwt from 'jsonwebtoken';
import Admin from '../../models/v1/admin';

class AdminController {
    constructor() {
        this.admin = new Admin();
    }

    async createAccount(req, res) {
        try {
            const { username, name, role, password } = req.body || {};
            if (!username || !name || !role || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'All fields are required'
                })
            }
            const response = await this.account.create(username, name, role, password);
            return res.status(200).json({
                success: true,
                data: {
                    token: jwt.sign({ 'username': username, 'role': role}, process.env.API_SECRET_KEY, {
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

    async loginAccount(req, res) {
        try {
            const { username, password } = req.body || {};
            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'All fields are required'
                })
            } 
            const response = await this.account.verify(username, password);
            return res.status(200).json({
                success: true,
                data: {
                    token: jwt.sign({ 'username': response.username, 'role': response.role}, process.env.API_SECRET_KEY, {
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

    async getMachineInfo(req, res) {
        try {

        } catch(err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }
}

export default AdminController;