import { connection } from "../../core/database.js";

class Waste {
    constructor() {
        this.db = connection;
    }

    async createTrashTransaction(client_id, waste_code, quantity, earned_time) {
        try {
            console.log("WASTE DEBUG: ", client_id, waste_code, quantity, earned_time);
            const [result] = await this.db.execute(
                'INSERT INTO waste_transactions (client_id, waste_code, quantity, earned_time, transaction_date) VALUES (?, ?, ?, ?, NOW())',
                [client_id, waste_code, quantity, earned_time]
            );
            return result;
        } catch(err) {
            console.error("[ERROR] waste.createTrashTransaction", err);
            throw err;
        }
    }

    async getTrashTransactions(type) {
        try {
            const [result] = await this.db.execute(
                'SELECT * FROM waste_transactions WHERE waste_code=?',
                [type]
            );
            return result;
        } catch(err) {
            console.error("[ERROR] waste.getTrashTransactions", err);
            throw err;
        }
    }

    async getTrashTransactionsByClient(client_id) {
        try {
            const [result] = await this.db.execute(
                'SELECT COUNT(*) as count FROM waste_transactions WHERE client_id=?',
                [client_id]
            );
            return result;
        } catch(err) {
            console.error("[ERROR] waste.getTrashTransactionsByClient", err);
            throw err;
        }
    }

    async getAllWasteTransaction() {
        try {
            const [result] = await this.db.execute(
                'SELECT COUNT(*) FROM waste_transactions WHERE DATE(transaction_date) = CURDATE()'
            );
            return result[0]['COUNT(*)'];
        } catch(err) {
            console.error("[ERROR] admin.getAllWasteTransaction", err);
            throw err;
        }
    }

    async getAllSpecificWaste(type) {
        try {
            const [result] = await this.db.execute(
                'SELECT COUNT(*) FROM waste_transactions WHERE waste_code=?',
                [type]
            );
            return result[0]['COUNT(*)'];
        } catch(err) {
            console.error("[ERROR] admin.getAllSpecificWaste", err);
            throw err;
        }
    }


}

export default Waste;