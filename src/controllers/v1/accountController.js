import jwt from "jsonwebtoken";
import Account from "../../models/v1/account.js";
import Logs from "../../models/v1/log.js";

class AccountController {
    constructor() {
        this.account = new Account();
        this.log = new Logs();
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

            await this.log.create("Account Creation", `${res.locals.username} created an account with username ${username}`, "INFO");
            
            return res.status(200).json({
                success: true,
                data: response
            })
        }
        catch (err) {
            await this.log.create(
                "Account Creation Error",
                `${res.locals.username} failed to create account ${req.body?.username}: ${err.toString()}`,
                "ERROR"
            );
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
                return res.status(400).json({
                    success: false,
                    message: "Query fields are required"
                })
            }

            const response = await this.account.getAccountWithSpecificField(field, fieldValue);

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
            const response = await this.account.getAll();

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
            
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async login(req, res) {
        try {
            const { username, password }= req.body || {};

            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Query fields are required"
                })
            }

            const response = await this.account.verify(username, password);

            console.log("DEBUG login", response);

            if (!response) {
                await this.log.create("Login Failed", `Login attempt made on account ${username}`, 'WARN')
                return res.status(400).json({
                    success: false,
                    message: "Invalid username or password"
                })
            }

            await this.log.create("Login Successful", `Login success on account ${username} on ${new Date()}`, 'INFO')
            return res.status(200).json({
                success: true,
                data: {
                    token: jwt.sign({ username: response.username, role: response.role }, process.env.API_SECRET_KEY, { 
                        expiresIn: "1d"
                    })
                }
            })
        }
        catch (err) {
            const userForLog = req.body?.username || "unknown user";

            await this.log.create(
                "Login Failed",
                `Login attempt failed for account ${userForLog}: ${err.toString()}`,
                "ERROR"
            );

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
                return res.status(400).json({
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

            await this.log.create("Update Successful", `${res.locals.username} updated account data for account ${fieldValue}`, "INFO");
            return res.status(200).json({
                success: true,
                data: response
            })
        }
        catch (err) {
            await this.log.create(
                "Update Failed",
                `${res.locals.username} failed to update account ${fieldValue}: ${err.toString()}`,
                "ERROR"
            );
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
                return res.status(400).json({
                    success: false,
                    message: "Query fields are required"
                })
            }

            const response = await this.account.deleteData(field, fieldValue);

            if (!response) {
                return res.status(400).json({
                    success: false,
                    message: `Delete failed: ${response}`
                })
            }
            
            await this.log.create("Delete Successful", `${res.locals.username} delete account ${fieldValue}`, "INFO");
            return res.status(200).json({
                success: true,
                data: response
            })
        }
        catch (err) {
            await this.log.create(
                "Delete Failed", 
                `${res.locals.username} failed to delete account ${fieldValue}`, 
                "ERROR"
            );
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }
}

export default AccountController;