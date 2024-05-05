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
        console.log("emfont: 正在生成字體 " + fontName + "...");
        fetch("https://font.emtech.cc/g/" + fontName, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ words: fonts[fontName] }),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                console.log(
                    "emfont: 字體 " +
                        data.font +
                        "已生成完成，若網頁沒有變動文字建議直接直接載入網址\n" +
                        data.url +
                        " 來使用。"
                );
                const font = new FontFace(
                    data.font,
                    `url(${data.url})`,
                    {
                        style: data.style,
                        weight: data.weight,
                    }
                );

                // Add to the document.fonts (FontFaceSet)
                document.fonts.add(font);
            });
    }
}
// Call the function to load custom fonts when the document is ready
document.addEventListener("DOMContentLoaded", loadCustomFonts);