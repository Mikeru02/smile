import Link from "../../models/v1/link.js";

class LinkController {
    constructor() {
        this.link = new Link();
    }

    async createProhibitedLink(req, res) {
        try {
            const { domain } = req.body || {};
            const response = await this.link.createProhibitedLink(domain);
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
            console.log("DEBUG HIT*****************************************88")
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

export default LinkController;