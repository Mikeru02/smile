import { connection } from "../../core/database.js";
import Waste from "./waste.js";

class Client {
    constructor() {
        this.db = connection;
        this.waste = new Waste();
        this.allowedGetFields = ["id", "ip", "mac", "name", "course", "year_level", "status", "time_remaining", "time_earned", "expire_at", "connection_start_at", "updated_at"];
        this.allowedFields = ["ip", "name", "course", "year_level", "status", "time_remaining", "time_earned", "expire_at", "connection_start_at", "updated_at"];
        this.allowedWhere = ["id", "mac"];
    }

    // Create Functions     *****************************************
    /**
     * Creates a new client record in the database.
     * 
     * @param {String} ip - The IP address assigned to the client.
     * @param {String} mac - The MAC address of the client's device.
     * @param {String} host - The hostname of the client's device.
     * @param {String} name - The client's name.
     * @param {String} course - The client's course.
     * @param {String} yearLevel - The client's year level
     * 
     * @returns {Promise<Object||null>} Returns the inserted client record if successful, or return null if failed.
     * 
     * @throws Will throw an error if the database insert fails.
     * 
     * @example
     * await client.create("ip", "mac", "host", "name", "course", "year_level")
     */
    async create(ip, mac, host, name, course, year_level) {
        try {
            const [row] = await this.db.execute(
                `INSERT INTO clients (ip, mac, hostname, name, course, year_level, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
                [ip, mac, host, name, course, year_level, "pending"]
            );
            return row || null;
        } 
        catch (err) {
            console.error("[ERROR] client.create", err);
            throw err;
        }
    }

    // Get Functions        *****************************************
    /**
     * Retrieves a client record from the database based on a specific field.
     * 
     * @param {String} field - The column to search by. Must be one of: "mac", "ip", "name", "course", "year_level".
     * @param {String} value - The value to match in the specified field.
     * 
     * @returns {Promise<Object|null>} The first client record that matches the search criteria, or null if not found.
     * 
     * @throws Will throw an error if the database get fails.
     * 
     * @example
     * await client.getSpecificField("mac", "AA:BB:CC:DD:EE:FF");
     */
    async getClientWithSpecificField(field, value) {
        try {
            if (!this.allowedGetFields.includes(field)) {
                console.error("[ERROR] client.getClientWithSpecificField: Invalid field!");
                return null;
            }

            let query;
            let params = [];

            if (value === "not_null") {
                query = `SELECT * FROM clients WHERE ${field} IS NOT NULL`
            }
            else {
                query = `SELECT * FROM clients WHERE ${field} = ?`;
                params = [value];
            }

            const [row] = await this.db.execute(query, params);

            return row || null;
        }
        catch (err) {
            console.error("[ERROR] client.getClientWithSpecificField", err);
            throw err;
        }
    }

    /**
     * Retrieves all client records from the database.
     * 
     * @returns {Promise<Array<Object>>} An array of client objects. Returns an empty array if no clients exist.
     * 
     * @throws Will throw an error if the database query fails.
     * 
     * @example
     * await client.getAll();
     */
    async getAll() {
        try {
            const [row] = await this.db.execute(
                `SELECT * FROM clients`
            );

            return row || [];
        }
        catch (err) {
            console.error("[ERROR] client.getAll", err);
            throw err;
        }
    }

    // Update Functions     *****************************************
    /**
     * Updates specific fields of a client record in the database.
     * 
     * @param {string} field - The column used in the WHERE clause (allowed: "id", "mac").
     * @param {string|number} value - The value used to identify the record in the WHERE clause.
     * @param {Object} setFields - An object containing the fields to update.
     * 
     * @returns {Promise<Object|null>} The database response object, or null if validation fails.
     * 
     * @throws Will throw an error if the database query fails.
     * 
     * @example
     * await client.update("mac", "AA:BB:CC:DD:EE:FF", { ip: "192.168.10.5" });
     * 
     * @example
     * await client.update("id", 1, { name: "Michael", course: "BSIT", year_level: 3 });
     */
    async update(field, value, setFields) {
        try {
            if (!this.allowedWhere.includes(field)) {
                console.error("[ERROR] client.update: Invalid where field!");
                return null
            }

            const keys = Object.keys(setFields).filter(key => this.allowedFields.includes(key));

            if (keys.length === 0) {
                console.error("[ERROR] client.update: No fields to update!");
                return null;
            }

            const setClause = keys.map(key => `${key}=?`).join(", ");
            const clauseValues = keys.map(key => setFields[key]);

            clauseValues.push(value);

            const [row] = await this.db.execute(
                `UPDATE clients SET ${setClause} WHERE ${field}=?`,
                clauseValues
            );

            return row || null;
        } 
        catch (err) {
            console.error("[ERROR] client.update", err);
            throw err;
        }
    }

    // Delete Functions     *****************************************
    /**
     * Deletes a client record from the database based on a specific field and value.
     * 
     * @param {String} field - The database column to match (must be in allowedWhere).
     * @param {String|Number} value - The value to match for deletion.
     * 
     * @returns {Promise<Object|null>} Returns the result of the delete operation if successful, or null if the field is invalid or no rows were affected.
     * 
     * @throws Will throw an error if the database query fails.
     * 
     * @example
     * await client.deleteData("mac", "AA:BB:CC:DD:EE:FF");
     */
    async deleteData(field, value) {
        try {
            if (!this.allowedWhere.includes(field)) {
                console.error("[ERROR] client.deleteData: Invalid where field!");
                return null
            }

            const [row] = await this.db.execute(
                `DELETE FROM clients WHERE ${field}=?`,
                [value]
            );

            return row || null;
        }
        catch (err) {
            console.error("[ERROR] client.deleteData", err);
            throw err;
        }
    }
}

export default Client;