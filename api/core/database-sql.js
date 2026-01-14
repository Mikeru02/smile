import mysql from "mysql2/promise";

console.log('HOST', process.env.DB_HOST);
console.log('USER', process.env.DB_USER);
console.log('PASS', process.env.DB_PASS);
const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

export { connection };