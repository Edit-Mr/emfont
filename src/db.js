/** @format */

// db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
const fs = require("fs");
dotenv.config();
const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});

async function dropTables() {
    const connection = await pool.getConnection();
    try {
        await connection.query(`
          DROP TABLE IF EXISTS users,project,domain,font,usage_records
      `);
        console.log("Tables dropped successfully.");
    } catch (error) {
        console.error("Error dropping tables:", error);
    } finally {
        connection.release();
    }
}

const createTables = async () => {
    const connection = await pool.getConnection();
    try {
        // Drop existing tables
        await dropTables();
        const sql_struct = fs.readFileSync("../database/struct.sql", "utf8");
        const sqlCommands = sql_struct.split(";").map(cmd => cmd.trim()).filter(cmd => cmd);
        for (const sqlCmd of sqlCommands) {
          await conn.query(sqlCmd);
        }
        console.log("All tables are checked/created successfully.");
    } catch (error) {
        console.error("Error creating tables:", error);
    } finally {
        connection.release();
    }
};

export { pool, createTables };
