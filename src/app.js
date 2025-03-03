/** @format */

import Fastify from "fastify";
import pov from "point-of-view";
import ejs from "ejs";
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import axios from "axios";
import { db } from "./database.js";
import { users } from "./schema.js";
import "dotenv/config";

const app = Fastify({ logger: true });

app.register(fastifyCookie);
app.register(fastifyJwt, { secret: process.env.JWT_SECRET });
app.register(pov, { engine: { ejs } });

app.register(import("@fastify/static"), {
    root: new URL("./static", import.meta.url).pathname,
    prefix: "/static/",
});

// Home route
app.get("/", async (req, reply) => {
    let user = null;
    try {
        const token = req.cookies.token;
        if (token) {
            user = await req.jwtVerify();
        }
    } catch (err) {}

    reply.view("/src/views/pages/home.ejs", { user });
});

// GitHub OAuth login redirect
app.get("/login", async (req, reply) => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user`;
    reply.redirect(githubAuthUrl);
});

// GitHub OAuth callback
app.get("/callback", async (req, reply) => {
    const { code } = req.query;
    if (!code) return reply.send("No code provided");

    try {
        const tokenRes = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            { headers: { Accept: "application/json" } }
        );

        const accessToken = tokenRes.data.access_token;
        if (!accessToken) return reply.send("Failed to get access token");

        const userRes = await axios.get("https://api.github.com/user", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const { login, avatar_url } = userRes.data;

        await db
            .insert(users)
            .values({ username: login, avatar: avatar_url })
            .onConflictDoNothing();

        const token = app.jwt.sign({ username: login, avatar: avatar_url });

        reply.setCookie("token", token, { httpOnly: true, path: "/" });
        reply.redirect("/");
    } catch (err) {
        reply.send("Login failed");
    }
});

// Logout
app.get("/logout", (req, reply) => {
    reply.clearCookie("token");
    reply.redirect("/");
});

// Start server
app.listen({ port: 3000 }, () => {
    console.log("Server running at http://localhost:3000");
});
