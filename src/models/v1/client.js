import { connection } from "../../core/database.js";
import Waste from "./waste.js";

class Client {
    constructor() {
        this.db = connection;
        this.waste = new Waste();
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
     * @returns {Promis<Object||null>} Returns the inserted client record if successful, or return null if failed.
     * 
     * @throws Will throw an error if the database insert fails.
     */
    async create(ip, mac, host, name, course, yearLevel) {
        try {
            const [row] = await this.db.execute(
                `INSERT INTO clients (ip, mac, host, name, course, year_level) VALUES (?, ?, ?, ?, ?, ?)`,
                [ip, mac, host, name, course, yearLevel]
            );
            return row?.[0] || null;
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
     * @throws Will throw an error if the database insert fails.
     * 
     * @example
     * await client.getSpecificField("mac", "AA:BB:CC:DD:EE:FF");
     */
    async getSpecificField(field, value) {
        const allowedFields = ["mac", "ip", "name", "course", "year_level"];

        try {
            if (!allowedFields.includes(field)) {
                console.error("[ERROR] client.getSpecificField: Invalid field!");
                return null;
            }

            const [row] = await this.db.execute(
                `SELECT * FROM clients WHERE ${field}=?`,
                [value]
            );

            return row?.[0] || null;
        }
        catch (err) {
            console.error("[ERROR] client.getSpecificField", err);
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

            return row?.[0] || [];
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
     * @param {string} field The column used in the WHERE clause (allowed: "id", "mac").
     * @param {string|number} value The value used to identify the record in the WHERE clause.
     * @param {Object} setFields An object containing the fields to update.
     * @param {string} [setFields.ip] The new IP address of the client.
     * @param {string} [setFields.name] The updated name of the client.
     * @param {string} [setFields.course] The updated course of the client.
     * @param {string|number} [setFields.year_level] The updated year level of the client.
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
        const allowedFields = ["ip", "name", "course", "year_level"];
        const allowedWhere = ["id", "mac"];

        try {
            if (!allowedWhere.includes(field)) {
                console.error("[ERROR] client.update: Invalid where field!");
                return null
            }

            const keys = Object.keys(setFields).filter(key => allowedFields.includes(key));

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

            return row?.[0] || null;
        } catch (err) {
            console.error("[ERROR] client.update", err);
            throw err;
        }
    }

    // Delete Functions     *****************************************
}

export default Client;