import { MongoClient } from 'mongodb';

const url = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT || 27017}`;

const client = new MongoClient(url);

let db;

export async function connectDB() {
    if (db) return db;

    try {
        await client.connect();
        console.log('[OK] Connected to MongoDB');
        db = client.db(process.env.DB_NAME);
        return db;
    } catch(err) {
        console.error('[ERROR] MongoDB connection failed: ', err.message);
        throw err;
    }
}