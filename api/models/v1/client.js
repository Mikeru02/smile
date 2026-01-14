export default class Client {
    constructor(db) {
        this.db = db;
        this.clients = db.collection('clients');
    }

    async create(data) {
        try {
            const result = this.clients.insertOne({
                ...data,
                created_at: new Date(),
                updated_at: new Date()
            });

            return result;
        } catch(err) {
            console.error('[ERROR] <Client.create>: ', err.message);
            throw err;
        }
    }

    async getClientByIP(ip) {
        try {
            const result = await this.clients.findOne({ ip: ip});
            return result;
        } catch(err) {
            console.error('[ERROR] <Client.getClientByIP>: ', err.message);
            throw err;
        }   
    }

    async updateClientByIP(ip, updatedData, options = { returnDocument: "after"}) {
        try {
            const result = await this.clients.findOneAndUpdate(
                { ip: ip },
                updatedData,
                options
            )
            return result.value;

        } catch(err) {
            console.error('[ERROR] <Client.updateClientByIP>: ', err.message);
            throw err;
        }
    }

    async getClientByStatus(status) {
        try {
            const client = await this.clients.findOne({ status: status});
            return client;
        } catch(err) {
            console.error('[ERROR] <Client.getClientByStatus>: ', err.message);
            throw err;
        }
    }
}
