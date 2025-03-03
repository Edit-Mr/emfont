/** @format */

import express from "express";
import path from "path";
const app = express();
import { fileURLToPath } from "url";

// Convert __dirname to work with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/static", express.static(path.join(__dirname, "static")));
app.use(express.static(path.join(__dirname, "public")));

// Define a route
app.get("/", (req, res) => {
    res.render("pages/index");
});

// when enter /[view-name] in the url, it will render the view
app.get("/:view", (req, res) => {
    res.render(`pages/${req.params.view}`);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
