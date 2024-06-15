/** @format */

const express = require("express");
const fs = require("fs");
const Fontmin = require("fontmin");
const path = require("path");
const app = express();
const port = 3000;

// Middleware to parse JSON body
app.use(express.json());

app.use('/static', express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, words"
    );
    next();
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/list", (req, res) => {
    const fonts = require("./Database/fonts.json");
    res.json(fonts);
});

// Route to handle font downloads
app.get("/f/:fileName/:fontName", (req, res) => {
    const { fileName, fontName } = req.params;
    logAccess(fontName, req, "download");
    res.download(
        path.join(__dirname, "fonts", "generated", fileName, fontName)
    );
});

// Route to handle font generate
app.post("/g/:font", async (req, res) => {
    try {
        const words = req.body.words;
        if (!words) {
            return res.status(400).send("Words are required");
        }
        console.log(words);
        var fontID = req.params.font;
        // load Database/font.json
        const fontList = require("./Database/fonts.json");
        const fontData = fontList[fontID];
        let generated = require("./Database/generated.json");
        if (generated[words] && generated[words][fontID]) {
            return res.json({
                url: `https://font.emtech.cc/f/${generated[words][fontID]}/${fontData.output}`,
                font: fontData.name,
                style: fontData.style,
                weight: fontData.weight,
            });
        }


        // check if font is in the list
        if (!fontList[fontID]) {
            return res.status(400).send("Font not found");
        }
        const fontFile = "normal-400.ttf";
        const fontName = fontData.name;
        // Check if words are provided

        // generate random file name
        let outputID = generateID(10);
        console.log(outputID);
        while (
            fs.existsSync(path.join(__dirname, "fonts", "generated", outputID))
        ) {
            outputID = generateID();
        }

        // Generate font file
        await generateFont(fontID,fontFile, words, outputID);
        logAccess(fontFile, req, "generate");
        generated = require("./Database/generated.json");
        if (!generated[words]) {
            generated[words] = {};
        }
        generated[words][fontID] = outputID;
        fs.writeFileSync(
            path.join(__dirname, "Database", "generated.json"),
            JSON.stringify(generated)
        );

        res.json({
            url: `https://font.emtech.cc/f/${outputID}/${fontData.output}`,
            font: fontName,
            style: fontData.style,
            weight: fontData.weight,
        });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Function to generate font file with specified words
async function generateFont(fontID,originalFontPath, words, fileName) {
    const fontmin = new Fontmin()
        .src(path.join(__dirname, "fonts", "original", fontID,originalFontPath))
        .use(
            Fontmin.glyph({
                text: words,
                hinting: false, // keep ttf hint info (fpgm, prep, cvt). default = true
            })
        )
        .use(
            Fontmin.ttf2woff({
                deflate: true, // deflate woff. default = false
            })
        )
        .dest(path.join(__dirname, "fonts", "generated", fileName));

    return new Promise((resolve, reject) => {
        fontmin.run(function (err, files) {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
}

// Function to log access
function logAccess(fontName, req, action) {
    const referer =
        req.headers["referer"] || req.headers["origin"] || "Unknown";
    const logEntry = {
        font: fontName,
        timestamp: new Date().toISOString(),
        userAgent: req.headers["user-agent"],
        ip: req.ip,
        referer: referer,
        action: action,
    };
    fs.appendFileSync(action + ".log", JSON.stringify(logEntry) + "\n");
}

//: 10 random characters and numbers
const generateID = length => {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () =>
        characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");
};

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
