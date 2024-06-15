const emfont = (function() {
    // Function to get all elements with class starting with .emfont and load the custom font
    function loadCustomFonts(callback) {
        const elements = document.querySelectorAll("[class^='emfont']");
        let fonts = {};
        let promises = [];

        elements.forEach(element => {
            // Get target font name from element class
            const fontName = element.className
                .split(" ")
                .find(name => name.startsWith("emfont-"))
                .replace("emfont-", "");
            const words = element.textContent.trim(); // Custom words from element text
            if (fontName && words) {
                if (!fonts[fontName]) {
                    fonts[fontName] = words;
                } else {
                    fonts[fontName] += words;
                }
            }
        });

        // Load custom fonts
        for (const fontName in fonts) {
            var textList = fonts[fontName];
            // Remove duplicate characters and sort by UTF encoding
            textList = Array.from(new Set(textList.split("")))
                .sort()
                .join("");
            
            let promise = fetch("https://font.emtech.cc/g/" + fontName, {
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
                return font.load().then(loadedFont => {
                    document.fonts.add(loadedFont);
                    // Apply the font to the elements
                    elements.forEach(element => {
                        if (element.className.includes(`emfont-${fontName}`)) {
                            element.style.fontFamily = data.font;
                        }
                    });
                });
            });
            
            promises.push(promise);
        }

        // Wait for all fonts to load
        Promise.all(promises).then(() => {
            if (callback && typeof callback === 'function') {
                callback();
            }
        });
    }

    return {
        init: function(callback) {
            loadCustomFonts(callback);
        }
    };
})();
