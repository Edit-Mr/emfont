/** @format */

// app.js
import express from "express";
import session from "express-session";
import axios from "axios";
import dotenv from "dotenv";
import { pool, createTables } from "./db.js";
import crypto from "crypto";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path from "path";
import resolveTxt from "dns/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

// 檢查並創建資料表
createTables();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/static", express.static(path.join(__dirname, "static")));
app.use(express.static(path.join(__dirname, "public")));

// second argument is shoud return json or redirect to login page
const checkAuth = async (req, returnJson = true) => {
    if (req.cookies.session_id) {
        // hash the session id and check if it exists in the database and in valid time
        const hashedToken = crypto
            .createHash("sha256")
            .update(req.cookies.session_id)
            .digest("hex");
        const [sessions] = await pool.query(
            `SELECT * FROM sessions WHERE hashed_token = ? AND session_expires > NOW()`,
            [hashedToken]
        );
        if (sessions.length === 0) {
            return returnJson ? false : res.redirect("/login");
        }
        // get user id
        return sessions[0].user_id;
    }
    // check if header has the bearer token
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const [apiKeys] = await pool.query(
            `SELECT * FROM api_keys WHERE api_key = ?`,
            [token]
        );
        if (sessions.length === 0) {
            return returnJson ? false : res.redirect("/login");
        }
        return apiKeys[0].user_id;
    }
    return returnJson ? false : res.redirect("/login");
};

app.get("/", (req, res) => {
    res.render("pages/index", { user: req.session.user });
});

app.get("/login", (req, res) => {
    if (req.session.user) {
        return res.redirect("/");
    }
    res.render("pages/login");
});

app.get("/logout", (req, res) => {
    res.clearCookie("session_id");
    req.session.destroy();
    // delete the session from the database
    const hashedToken = crypto
        .createHash("sha256")
        .update(req.cookies.session_id)
        .digest("hex");
    pool.query(`DELETE FROM sessions WHERE hashed_token = ?`, [hashedToken]);
    res.redirect("/");
});

app.get("/newDomain", async (req, res) => {
    await checkAuth(req);
    res.render("pages/newDomain", { user: req.session.user });
});

app.get("/dashabord", async (req, res) => {
    await checkAuth(req);
    res.render("pages/dashboard", { user: req.session.user });
});

app.get("p/:project/:page", async (req, res) => {
    const user_id = await checkAuth(req);
    const pages = {
        "": "overview",
        files: "files",
        settings: "settings",
        install: "install",
    };
    if (!pages[req.params.page]) {
        return res.status(404).send("Page not found");
    }
    // check owner from database
    const { project } = req.params;
    const [projects] = await pool.query(
        `SELECT * FROM projects WHERE project_id = ? AND user_id = ?`,
        [project, user_id]
    );
    if (projects.length === 0) {
        return res.status(404).send("Project not found");
    }
    res.render("pages/" + pages[req.params.page], {
        user: req.session.user,
        project: projects[0],
    });
});

app.post("/api/domains/verify", async (req, res) => {
    const user_id = await checkAuth(req);
    const domain = req.query.domain;
    if (!domain) {
        return res.status(400).json({ error: "Domain is required" });
    }
    try {
        const [result] = await pool.query(
            `SELECT * FROM domain_verification WHERE domain_name = ?`,
            [domain]
        );
        if (result.length === 0) {
            return res.status(404).json({ error: "no verification requested" });
        }
        var verified = 1;
        // get the challenge token
        const challenge_token = result[0].challenge_token;
        // check in dns if the challenge token is set as a txt record for the domain
        resolveTxt(domain, async (err, records) => {
            if (err) {
                return res.status(500).json({
                    error: "Failed to resolve TXT records",
                    details: err.message,
                });
            }
            const found = records.some(record =>
                record.includes(challenge_token)
            );
            if (!found) {
                const url = `http://${domain}/emfont.txt`;
                const response = await axios.get(url);
                const challengeToken = response.data.trim();
                if (challengeToken !== challenge_token) {
                    return res
                        .status(401)
                        .json({ error: "Invalid challenge token" });
                }
                verified = 2;
            }
            const favicon = `https://www.google.com/s2/favicons?domain=${domain}`;
            const owner_id = req.session.user.user_id;
            await pool.query(
                `INSERT INTO domains (owner_id, project_id, domain_name, verified, favicon, challenge_token)
               VALUES (?, ?, ?, ?, ?)`,
                [
                    owner_id,
                    project_id,
                    domain,
                    verified,
                    favicon,
                    challenge_token,
                ]
            );
            res.status(200).json({ new: true });
        });
    } catch (error) {
        console.error("Error checking domain verification:", error);
        return res.status(500).send("Internal Server Error");
    }
});

app.post("/api/domains/add", async (req, res) => {
    const user_id = await checkAuth(req);
    const domain = req.query.domain;
    if (!domain) {
        return res.status(400).json({ error: "Domain is required" });
    }
    try {
        const challenge_token = crypto.randomBytes(5).toString("hex");
        const [result] = await pool.query(
            `INSERT INTO domain_verification (owner_id, domain_name, challenge_token)
           VALUES (?, ?, ?)`,
            [req.session.user.user_id, domain, challenge_token]
        );
        return res.status(201).json({ challenge_token });
    } catch (error) {
        console.error("Error adding domain:", error);
        return res.status(500).send("Internal Server Error");
    }
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

        let userId;
        if (users.length === 0) {
            // 新用戶，將用戶資訊寫入資料庫
            const [result] = await pool.query(
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
            userId = result.insertId;
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
            userId = users[0].user_id;
        }

        // generate a new session id
        const sessionId = crypto.randomBytes(16).toString("hex"); // This will produce a 32-character hex string
        const hashedToken = crypto
            .createHash("sha256")
            .update(sessionId)
            .digest("hex");
        const sessionExpires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 1 week

        await pool.query(
            `INSERT INTO sessions (session_id, hashed_token, user_id, session_expires)
   VALUES (?, ?, ?, ?)`,
            [sessionId, hashedToken, userId, sessionExpires]
        );

        // 设置 cookie
        res.cookie("session_id", sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            expires: sessionExpires,
        });

        // return to user and redirect
        if (users.length === 0) res.redirect("/newDomain");
        else res.redirect("/dashboard");
    } catch (error) {
        console.error("GitHub OAuth Error:", error);
        res.status(500).send("Authentication failed");
    }
});

// 讀取專案列表
app.get("/api/projects", async (req, res) => {
    const user_id = await checkAuth(req);
    try {
        const [projects] = await pool.query(
            `SELECT * FROM projects WHERE user_id = ?`,
            [user_id]
        );
        res.status(200).json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).send("Internal Server Error");
    }
});

// 讀取網域列表
app.get("/api/domain/list", async (req, res) => {
    const user_id = await checkAuth(req);
    try {
        const [domains] = await pool.query(
            `SELECT * FROM domains WHERE owner_id = ?`,
            [user_id]
        );
        res.status(200).json(domains);
    } catch (error) {
        console.error("Error fetching domains:", error);
        res.status(500).send("Internal Server Error");
    }
});

// 寫入專案資料
app.post("/api/projects/new", async (req, res) => {
    const user_id = await checkAuth(req);
    const project_name = req.body.project_name;
    try {
        const [result] = await pool.query(
            `INSERT INTO projects (user_id, project_name, cloudflare, all_in_one, keep_font, pagination)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                user_id,
                project_name,
                true,
                false,
                false,
                JSON.stringify({
                    params: [],
                }),
            ]
        );
        res.status(201).json({ project_id: result.insertId });
    } catch (error) {
        console.error("Error inserting project:", error);
        res.status(500).send("Internal Server Error");
    }
});

// 更改專案資料
app.post("/api/projects/edit", async (req, res) => {
    const user_id = await checkAuth(req);
    // check the owner of the project
    const { project_id } = req.body;
    const [projects] = await pool.query(
        `SELECT user_id FROM projects WHERE project_id = ?`,
        [project_id]
    );
    if (projects.length === 0) {
        return res.status(404).json({ error: "Project not found" });
    }
    if (projects[0].user_id !== req.session.user.user_id) {
        return res.status(403).json({ error: "Forbidden" });
    }
    const { project_name, cloudflare, all_in_one, keep_font, pagination } =
        req.body;
    try {
        await pool.query(
            `UPDATE projects SET project_name = ?, cloudflare = ?, all_in_one = ?, keep_font = ?, pagination = ?
           WHERE project_id = ?`,
            [
                project_name,
                cloudflare,
                all_in_one,
                keep_font,
                pagination,
                project_id,
            ]
        );
        res.status(200).send("Project updated");
    } catch (error) {
        console.error("Error updating project:", error);
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
            `INSERT INTO usage_records (file_id, ip_address, user_agent)
           VALUES (?, ?, ?)`,
            [file_id, ip_address, user_agent]
        );
        res.status(201).send("Usage record inserted");
    } catch (error) {
        console.error("Error inserting usage record:", error);
        res.status(500).send("Internal Server Error");
    }
});

// 寫入 API 金鑰資料
app.post("/api/api-keys", async (req, res) => {
    const user_id = await checkAuth(req);
    const api_key = crypto.randomBytes(16).toString("hex");
    const salt = crypto.randomBytes(16).toString("hex");
    const hashed_key = crypto
        .createHash("sha256")
        .update(api_key + salt)
        .digest("hex");
    const created_at = new Date();
    try {
        await pool.query(
            `INSERT INTO api_keys (hashed_key, salt, user_id, created_at)
           VALUES (?, ?, ?, ?)`,
            [hashed_key, salt, user_id, created_at]
        );
        res.status(201).json({ api_key, status: "created" });
    } catch (error) {
        console.error("Error inserting API key:", error);
        res.status(500).send("Internal Server Error");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
