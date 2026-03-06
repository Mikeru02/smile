import Link from "../../models/v1/link.js";

class LinkController {
    constructor() {
        this.link = new Link();
    }

    async getAllProhibitedLinks() {
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
}

export default LinkController;