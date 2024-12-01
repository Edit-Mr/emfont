/** @format */

// db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

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
          DROP TABLE IF EXISTS sessions, usage_records, font_generated, fonts, domains, projects, users, domain_verification, api_keys
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

        await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255) NOT NULL,
        display_name VARCHAR(255),
        email VARCHAR(255),
        github_id VARCHAR(255) UNIQUE,
        profile_image VARCHAR(255)
      )
    `);

        await connection.query(`
      CREATE TABLE IF NOT EXISTS projects (
        project_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        project_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        profile_image VARCHAR(255),
        cloudflare BOOLEAN,
        all_in_one BOOLEAN,
        keep_font BOOLEAN,
        pagination JSON,
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fonts_count INT DEFAULT 0,
        domains_count INT DEFAULT 0,
        files_count INT DEFAULT 0
      )
    `);

        await connection.query(`
      CREATE TABLE IF NOT EXISTS domains (
        domain_id INT PRIMARY KEY AUTO_INCREMENT,
        owner_id INT,
        project_id INT,
        domain_name VARCHAR(255),
        verified INT,
        favicon VARCHAR(255),
        FOREIGN KEY (owner_id) REFERENCES users(user_id),
        FOREIGN KEY (project_id) REFERENCES projects(project_id)
      )
    `);

        await connection.query(`
      CREATE TABLE IF NOT EXISTS domain_verification (
        owner_id INT,
        domain_name VARCHAR(255),
        challenge_token CHAR(10)
      )
    `);

        await connection.query(`
      CREATE TABLE IF NOT EXISTS fonts (
        font_id INT PRIMARY KEY AUTO_INCREMENT,
        font_class VARCHAR(255),
        font_name VARCHAR(255),
        font_name_zh VARCHAR(255),
        font_name_en VARCHAR(255),
        font_license VARCHAR(255),
        updated_at TIMESTAMP,
        font_weight VARCHAR(255),
        repo_url VARCHAR(255),
        author VARCHAR(255)
      )
    `);

        await connection.query(`
      CREATE TABLE IF NOT EXISTS font_generated (
        file_id INT PRIMARY KEY AUTO_INCREMENT,
        url VARCHAR(255),
        font_id INT,
        font_weight VARCHAR(255),
        text TEXT,
        cloudflare BOOLEAN,
        usage_count INT DEFAULT 0,
        last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT NULL,
        FOREIGN KEY (font_id) REFERENCES fonts(font_id)
      )
    `);

        await connection.query(`
      CREATE TABLE IF NOT EXISTS usage_records (
        visit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        file_id INT,
        ip_address VARCHAR(255),
        user_agent TEXT,
        FOREIGN KEY (file_id) REFERENCES font_generated(file_id)
      )
    `);

        await connection.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      session_id CHAR(32) PRIMARY KEY,
      hashed_token CHAR(64),
      user_id INT,
      session_expires TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    )
  `);

        await connection.query(`
      CREATE TABLE IF NOT EXISTS api_keys (
        api_key VARCHAR(10),
        user_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        usage_count INT DEFAULT 0
      )
    `);

        console.log("All tables are checked/created successfully.");
    } catch (error) {
        console.error("Error creating tables:", error);
    } finally {
        connection.release();
    }
};

export { pool, createTables };
