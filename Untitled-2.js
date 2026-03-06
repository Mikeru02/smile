import jwt from 'jsonwebtoken';
import Account from '../../models/v1/account.js';

class AccountController {
    constructor() {
        this.account = new Account();
    }

    async create(req, res) {
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
            })
        }
    }

    async login(req, res) {
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
            })
        }
    }

    async getAllAccounts(req, res) {
        try {
            const response = await this.account.getAllAccounts();
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
}

export default AccountController;