/** @format */

// Function to get all elements with class starts with .emfont and load the custom font
function loadCustomFonts() {
    const elements = document.querySelectorAll("[class^='emfont']");
    let fonts = {};
    elements.forEach(element => {
        // get target font name from element class
        const fontName = element.className
            .split(" ")
            .find(name => name.startsWith("emfont-"))
            .replace("emfont-", "");
        const words = element.textContent.trim(); // Custom words from element text
        if (fontName && words) {
            fonts[fontName] = fonts[fontName] + words;
        }
    });
    // Load custom fonts
    for (const fontName in fonts) {
        var textList = fonts[fontName];
        // 移除重複字體，並按照 UTF 編碼排序
        textList = Array.from(new Set(textList.split("")))
            .sort()
            .join("");
        fetch("https://font.emtech.cc/g/" + fontName, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ words: textList }),
        })
            .then(response => response.json())
            .then(data => {
                const font = new FontFace(data.font, `url(${data.url})`, {
                    style: data.style,
                    weight: data.weight,
                });
                // Add to the document.fonts (FontFaceSet)
                document.fonts.add(font);
                // Load the font
                font.load().then(loadedFont => {
                    document.fonts.add(loadedFont);
                    // Apply the font to the element
                    element.style.fontFamily = data.font;
                });
            });
    }
}