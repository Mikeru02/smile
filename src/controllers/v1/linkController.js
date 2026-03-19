import Link from "../../models/v1/link.js";
import Log from "../../models/v1/log.js";
import Client from "../../models/v1/client.js";
import ContentFiltering from "../../utils/contentFiltering.js";

class LinkController {
    constructor() {
        this.link = new Link();
        this.client = new Client();
        this.log = new Log();
    }

    async createProhibitedLink(req, res) {
        try {
            const { domain } = req.body || {};

            if (!domain) {
                return res.status(400).json({
                    success: false,
                    message: "Domain is required"
                })
            }

            ContentFiltering.addDomain(link);
            const response = await this.link.createProhibitedLink(domain);

            await this.log.create(
                "Created Prohibited",
                `${res.locals.username} added ${domain} as prohibited`,
                "INFO"
            )
            return res.status(200).json({
                success: true,
                data: response
            })
        }
        catch (err) {
            await this.log.create(
                "Create Prohibited Error",
                `Error creating prohibited domain "${req.body?.domain || 'unknown'}" by ${res.locals.username || 'system'}: ${err.toString()}`,
                "ERROR"
            );
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }

    async createAccessedLink(req, res) {
        try {
            const { clientIP, domain } = req.body || {};
            const clientResponse = await this.client.getClientWithSpecificField("ip", clientIP);
            const clientData = clientResponse[0];

            const response = await this.link.createAccessedLinkTransaction(clientData.id, domain);
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

    async getSpecificDomain(req, res) {
        try {
            const response = await this.link.getSpecificDomain(req.query.domain);
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

    async getAllProhibitedLinks(req, res) {
        try {
            const response = await this.link.getAllProhibitedLinks();
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

    async deleteProhibitedLink(req, res) {
        try {
            const response = await this.link.deleteProhibitedLink(req.params.id);
            await this.log.create(
                "Delete Prohibited",
                `${res.locals.username} deleted domain ${req.params.id}`,
                "INFO"
            )
            return res.status(200).json({
                success: true,
                data: response
            })
        }
        catch (err) {
            await this.log.create(
                "Delete Prohibited Error",
                `Error deleting prohibited domain with ID "${req.params?.id || 'unknown'}" by ${res.locals.username || 'system'}: ${err.toString()}`,
                "ERROR"
            );
            return res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }
}

export default LinkController;