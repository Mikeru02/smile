import { connection } from "../../core/database.js";
import { encryptPassword } from "../../utils/hash.js";

class Account {
    constructor() {
        this.db = connection;
        this.allowedGetFields = ["id", "username", "name", "role", "password", "last_login", "created_at", "updated_at"];
        this.allowedUpdateFields = ["username", "name", "role", "password", "updated_at"];
        this.allowedUpdateWhere = ["id"];
    }

    // Create Functions     *****************************************
    /**
     * Creates a new account record in the database.
     * 
     * @param {String} username - The account's username.
     * @param {String} name - The account's name
     * @param {String} role - The account's role for the system.
     * @param {String} password - The account's password needed to hash.
     * 
     * @returns {Promise<Object|null>} Returns the inserted client record if successful, or return null if failed
     * 
     * @throws Will throw an error if the database insert fails
     * 
     * @example
     * await account.create("username", "name", "role", "password")
     */
    async create(username, name, role, password) {
        try {
            const [row] = await this.db.execute(
                `INSERT INTO accounts (username, name, role, password, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())`,
                [username, name, role, encryptPassword(password)]
            )
            return row || null;
        }
        catch(err) {
            console.error("[ERROR] account.create", err);
            throw err;
        }
    }

    // Get Functions        *****************************************
    /**
     * Retrieves a account record from the database based on a specific field.
     * 
     * @param {*} field - The column to search by. Must be in (allowedGetFields).
     * @param {*} value - The value to match int the specified field.
     * 
     * @returns {Promise<Object|null>} The first account record that matches the search criteria, or null if not found.
     * 
     * @throws Will throw an error if the database get fails.
     * 
     * @example
     * await account.getAccountWithSpecificField("username", "JohnDoe123")
     * 
     * @example
     * await account.getAccountWithSpecificField("role", "admin")
     */
    async getAccountWithSpecificField(field, value) {
        try {
            if (!this.allowedGetFields.includes(field)) {
                console.error("[ERROR] account.getAccountWithSpecificField: Invalid field!");
                return null;
            }
            
            const [row] = await this.db.execute(
                `SELECT * FROM accounts WHERE ${field}=?`,
                [value]
            );

            return row?.[0] || null;
        }
        catch (err) {
            console.error("[ERROR] account.getSpecificField", err);
            throw err;
        }
    }

    /**
     * Retrieves all account records from the database.
     * 
     * @returns {Promise<Array<Object>>} An array of account objects. Returns an empty arra if not clients exist.
     * 
     * @throws Will throw an error if the database query fails.
     * 
     * @example
     * await account.getAll()
     */
    async getAll() {
        try {
            const [row] = await this.db.execute(
                `SELECT * FROM accounts`
            );

            return row || [];
        }
        catch (err) {
            console.error("[ERROR] account.getAll", err);
            throw err;
        }
    }

    /**
     * Verifies a user's credentials by username and password.
     * 
     * @param {String} username - The username of the account to verify.
     * @param {String} password - The password to verify against the stored hashed password.
     * 
     * @returns {Promise<Object|null>} Returns the account object if credentials are correct, or null the username does not exist or the password is incorrect.
     * 
     * @throws Will throw an error if the database query fails.
     * 
     * @example
     * await account.verify("johndoe123", "doejohn")
     */
    async verify(username, password) {
        try {
            const user = await this.getAccountWithSpecificField("username", username)

            if (!user) return null;

            if (user.password !== encryptPassword(password)) return null;

            await this.update("id", user.id, { last_login: new Date() });

            return user;
        }
        catch(err) {
            console.error("[ERROR] account.verify", err);
            throw err;
        }
    }

    // Update Functions     *****************************************
    /**
     * Update specific fields of an account record in the database
     * 
     * @param {String} field - The column use in the WHERE clause. Must be in (allowedUpdateWhere).
     * @param {String} value -The value used to identify the record in the WHERE clause.
     * @param {Object} setFields - An object containing the fields to update.
     * 
     * @returns {Promise<Object|null>} The database response object, or null if validation fails.
     * 
     * @throws Will throw an error if the database query fails.
     * 
     * @example
     * await account.update("id", 1, { username: "john", role: "staff" }) 
     */
    async update(field, value, setFields) {
        try {
            if (!this.allowedUpdateWhere.includes(field)) {
                console.error("[ERROR] account.update: Invalid where field!");
                return null;
            }

            const keys = Object.keys(setFields).filter(key => this.allowedUpdateFields.includes(key));

            if (keys.length === 0) {
                console.error("[ERROR] account.update: No fields to update!");
                return null;
            }

            if (keys.includes("password")) {
                setFields.password = encryptPassword(setFields.password);
            }

            const setClause = keys.map(key => `${key}=?`).join(", ");
            const clauseValues = keys.map(key => setFields[key]);
            
            clauseValues.push(value);

            const [row] = await this.db.execute(
                `UPDATE accounts SET ${setClause} WHERE ${field}=?`,
                clauseValues
            );

            return row || null;
        }
        catch (err) {
            console.error("[ERROR] account.update", err);
            throw err;
        }
    }

    // Delete Functions     *****************************************
    /**
     * Deletes a client record from the database based on a specific field and value.
     * 
     * @param {String} field - The database column to match (must be in allowedUpdateWhere).
     * @param {String} value - The value to match for deletion.
     * 
     * @returns {Promise<Object|null>} Returns the result of the delete operation if successful, or null if the field is invalid or no rows affected.
     * 
     * @throws Will throw an error if the database query fails.
     * 
     * @example
     * await account.deleteData("id", 1)
     */
    async deleteData(field, value) {
        try {
            if (!this.allowedUpdateWhere.includes(field)) {
                console.error("[ERROR] account.deleteData: Invalid where field!");
                return null;
            }

            const [row] = await this.db.execute(
                `DELEte FROM accounts WHERE ${field}=?`,
                [value]
            );

            return row || null;
        }
        catch (err) {
            console.error("[ERROR] account.deleteData", err);
            throw err;
        }
    }
}

export default Account;