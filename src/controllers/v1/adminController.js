import jwt from 'jsonwebtoken';
import Admin from '../../models/v1/admin.js';
import Log from  '../../models/v1/log.js';
import ContentFiltering from '../../utils/contentFiltering.js';

class AdminController {
    constructor() {
        this.admin = new Admin();
        this.log = new Log();
    }

    async createAccount(req, res) {
        try {
            const { username, name, role, password } = req.body || {};
            console.log(req.body);
            if (!username || !name || !role || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'All fields are required'
                })
            }
            const response = await this.admin.createAccount(username, name, role, password);
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
            const response = await this.admin.verifyAccount(username, password);
            if (!response) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid username or password'
                });
            }

            await this.log.create("Admin Login", `${response.username} logged in to dashboard`, "INFO")

            return res.status(200).json({
                success: true,
                data: {
                    token: jwt.sign({ username: response.username, role: response.role}, process.env.API_SECRET_KEY, {
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

    async getAllAccounts(req, res) {
        try {
            const response = await this.admin.getAllAccounts();
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

    async getSpecificAccount(req, res) {
        try {
            const response = await this.admin.getSpecificAccount(req.params.id);
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

    async getDashboardInfo(req, res) {
        try {
            const result = await this.admin.getDashboardInfo();
            return res.status(200).json({
                success: true,
                data: result
            });
        } catch(err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async getMachineInfo(req, res) {
        try {
            const result = await this.admin.getMachineInfo();
            return res.status(200).json({
                success: true,
                data: result
            });
        } catch(err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async createProhibitedLinks(req, res) {
        try {
            const { link } = req.body || {};
            const result = await this.admin.createProhibitedLinks(link);
            ContentFiltering.addDomain(link);
            return res.status(200).json({
                success: true,
                data: result
            });
        } catch(err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async getProhibitedLinks(req, res) {
        try {
            const result = await this.admin.getProhibitedLinks();
            return res.status(200).json({
                success: true,
                data: result
            });
        } catch(err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async deleteProhibitedLink(req, res) {
        try {
            const id = req.params.id;
            const link = await this.admin.getSpecificDomain(id);
            const result = await this.admin.deleteProhibitedLink(id);
            ContentFiltering.removeDomain(link.link)
            return res.status(200).json({
                success: true,
                data: result
            });
        } catch(err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }
}

export default AdminController;