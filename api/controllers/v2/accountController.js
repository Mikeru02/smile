import jwt from 'jsonwebtoken';
import Account from '../../models/v2/account';

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
            })
        }
    }
}

export default AccountController;