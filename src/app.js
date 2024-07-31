/** @format */

// app.js
import express from "express";
import session from "express-session";
import axios from "axios";
import dotenv from "dotenv";
import { pool, createTables } from "./db.js";

import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

// 檢查並創建資料表
createTables();

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/static", express.static(path.join(__dirname, "static")));
app.use(express.static(path.join(__dirname, "public")));

// Define a route
app.get("/", (req, res) => {
    res.render("pages/index", { user: req.session.user });
});

// login
app.get("/login", (req, res) => {
    // if already logged in, redirect to home
    if (req.session.user) {
        return res.redirect("/");
    }
    res.render("pages/login");
});

// new domain
app.get("/newDomain", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    res.render("pages/newDomain", { user: req.session.user });
});

// GitHub 登入處理
app.get("/auth/github", (req, res) => {
    const redirectUri = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.BASE_URL}/auth/github/callback`;
    res.redirect(redirectUri);
});

app.get("/auth/github/callback", async (req, res) => {
    const { code } = req.query;
    try {
        const response = await axios.post(
            "https://github.com/login/oauth/access_token",
            null,
            {
                params: {
                    client_id: process.env.GITHUB_CLIENT_ID,
                    client_secret: process.env.GITHUB_CLIENT_SECRET,
                    code,
                },
                headers: {
                    accept: "application/json",
                },
            }
        );

        const { access_token } = response.data;

        // 獲取 GitHub 使用者資訊
        const userResponse = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `token ${access_token}`,
            },
        });

        const user = userResponse.data;

        // 儲存用戶資訊到資料庫或會話
        req.session.user = {
            github_id: user.id,
            username: user.login,
            display_name: user.name || user.login,
            email: user.email,
            profile_image: user.avatar_url,
        };

        // 檢查用戶是否已存在
        const [users] = await pool.query(
            `SELECT user_id FROM users WHERE github_id = ?`,
            [user.id]
        );

        if (users.length === 0) {
            // 新用戶，將用戶資訊寫入資料庫
            await pool.query(
                `INSERT INTO users (username, display_name, email, github_id, profile_image)
           VALUES (?, ?, ?, ?, ?)`,
                [
                    user.login,
                    user.name || user.login,
                    user.email,
                    user.id,
                    user.avatar_url,
                ]
            );
        } else {
            // 更新用戶資訊
            await pool.query(
                `UPDATE users SET username = ?, display_name = ?, email = ?, profile_image = ?
           WHERE github_id = ?`,
                [
                    user.login,
                    user.name || user.login,
                    user.email,
                    user.avatar_url,
                    user.id,
                ]
            );
        }
        // generate a new session id
        const sessionId = crypto.randomBytes(16).toString("hex");
        const hashedToken = crypto
            .createHash("sha256")
            .update(sessionId)
            .digest("hex");
        const sessionExpires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 1 week
        await pool.query(
            `INSERT INTO sessions (session_id, hashed_token, user_id, session_expires)
         VALUES (?, ?, ?, ?)`,
            [sessionId, hashedToken, users[0].user_id, sessionExpires]
        );

        // return to user and redirect
        if (users.length === 0) res.redirect("/newDomain");
        else res.redirect("/dashboard");
    } catch (error) {
        console.error("GitHub OAuth Error:", error);
        res.status(500).send("Authentication failed");
    }
});

// 寫入專案資料
app.post("/api/projects", async (req, res) => {
    const {
        user_id,
        project_name,
        profile_image,
        cloudflare,
        all_in_one,
        keep_font,
        pagination,
    } = req.body;
    try {
        const [result] = await pool.query(
            `INSERT INTO projects (user_id, project_name, profile_image, cloudflare, all_in_one, keep_font, pagination)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                user_id,
                project_name,
                profile_image,
                cloudflare,
                all_in_one,
                keep_font,
                JSON.stringify(pagination),
            ]
        );
        res.status(201).json({ project_id: result.insertId });
    } catch (error) {
        console.error("Error inserting project:", error);
        res.status(500).send("Internal Server Error");
    }
});

// 寫入網域資料
app.post("/api/domains", async (req, res) => {
    const { owner_id, project_id, domain_name, verified, favicon } = req.body;
    try {
        const [result] = await pool.query(
            `INSERT INTO domains (owner_id, project_id, domain_name, verified, favicon)
       VALUES (?, ?, ?, ?, ?)`,
            [owner_id, project_id, domain_name, verified, favicon]
        );
        res.status(201).json({ domain_id: result.insertId });
    } catch (error) {
        console.error("Error inserting domain:", error);
        res.status(500).send("Internal Server Error");
    }
});

// 寫入字體資料
app.post("/api/fonts", async (req, res) => {
    const {
        font_class,
        font_name,
        font_name_zh,
        font_name_en,
        font_license,
        font_weight,
        repo_url,
        author,
    } = req.body;
    try {
        const [result] = await pool.query(
            `INSERT INTO fonts (font_class, font_name, font_name_zh, font_name_en, font_license, font_weight, repo_url, author)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                font_class,
                font_name,
                font_name_zh,
                font_name_en,
                font_license,
                font_weight,
                repo_url,
                author,
            ]
        );
        res.status(201).json({ font_id: result.insertId });
    } catch (error) {
        console.error("Error inserting font:", error);
        res.status(500).send("Internal Server Error");
    }
});

// 寫入生成字體資料
app.post("/api/font-generated", async (req, res) => {
    const { url, font_id, font_weight, text, cloudflare } = req.body;
    try {
        const [result] = await pool.query(
            `INSERT INTO font_generated (url, font_id, font_weight, text, cloudflare)
       VALUES (?, ?, ?, ?, ?)`,
            [url, font_id, font_weight, text, cloudflare]
        );
        res.status(201).json({ file_id: result.insertId });
    } catch (error) {
        console.error("Error inserting font-generated:", error);
        res.status(500).send("Internal Server Error");
    }
});

// 寫入使用紀錄資料
app.post("/api/usage", async (req, res) => {
    const { file_id, ip_address, user_agent } = req.body;
    try {
        await pool.query(
            `INSERT INTO usage (file_id, ip_address, user_agent)
       VALUES (?, ?, ?)`,
            [file_id, ip_address, user_agent]
        );
        res.status(201).send("Usage record inserted");
    } catch (error) {
        console.error("Error inserting usage record:", error);
        res.status(500).send("Internal Server Error");
    }
});

// 寫入登入紀錄資料
app.post("/api/sessions", async (req, res) => {
    const { hashed_token, user_id, session_expires } = req.body;
    try {
        const [result] = await pool.query(
            `INSERT INTO sessions (hashed_token, user_id, session_expires)
       VALUES (?, ?, ?)`,
            [hashed_token, user_id, session_expires]
        );
        res.status(201).json({ session_id: result.insertId });
    } catch (error) {
        console.error("Error inserting session record:", error);
        res.status(500).send("Internal Server Error");
    }
});

// 寫入 API 金鑰資料
app.post("/api/api-keys", async (req, res) => {
    const { hashed_key, salt, user_id, created_at } = req.body;
    try {
        await pool.query(
            `INSERT INTO api_keys (hashed_key, salt, user_id, created_at)
       VALUES (?, ?, ?, ?)`,
            [hashed_key, salt, user_id, created_at]
        );
        res.status(201).send("API Key inserted");
    } catch (error) {
        console.error("Error inserting API key:", error);
        res.status(500).send("Internal Server Error");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
