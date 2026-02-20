import { connection } from "../../core/database.js";

class Waste {
    constructor() {
        this.db = connection;
    }

    async createTrashTransaction(client_id, waste_code, quantity, earned_time, transaction_date) {
        try {
            console.log("WASTE DEBUG: ", client_id, waste_code, quantity, earned_time);
            const [result] = await this.db.execute(
                'INSERT INTO waste_transactions (client_id, waste_code, quantity, earned_time, transaction_date) VALUES (?, ?, ?, ?, NOW())',
                [client_id, waste_code, quantity, earned_time, transaction_date]
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
}

export default Waste;