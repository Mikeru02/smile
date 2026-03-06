import jwt from "jsonwebtoken";
import Account from "../../models/v1/account.js";

class AccountController {
    constructor() {
        this.account = new Account();
    }

    // Create Functions         *****************************************
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

            if (!response) {
                return res.status(400).json({
                    success: false,
                    message: `Insert failed: ${response}`
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

    // Get Functions            *****************************************
    async getAccounttWithSpecificField(req, res) {
        try {
            const field = req.query.field
            const fieldValue = req.query.value;

            if (!field || !fieldValue) {
                return res.json(400).json({
                    success: false,
                    message: "Query fields are required"
                })
            }

            const response = await this.account.getAccountWithSpecificField(field, fieldValue);

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

    async getAll(req, res) {
        try {
            const response = await this.account.getAll();

            if (!response) {
                return res.json(404).json({
                    success: false,
                    message: "No clients found"
                })
            }

            return res.json(200).json({
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

    // Update Functions         *****************************************
    async updateAccountData(req, res) {
        try {
            const field = req.query.field;
            const fieldValue = req.query.value;

            if (!field || !fieldValue) {
                return res.json(400).json({
                    success: false,
                    message: "Query fields are required"
                })
            }

            const response = await this.account.update(field, fieldValue, req.body);

            if (!response) {
                return res.status(400).json({
                    success: false,
                    message: "Update failed: Invalid field or no updatable data"
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

    // Delete Functions         *****************************************
    async deleteAccountData(req, res) {
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

export default AccountController;