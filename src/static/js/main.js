/** @format */

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".fader").classList.add("fade-in");
    console.log("hohoho")

    document.querySelector("#copy").addEventListener("click", () => {
        navigator.clipboard.writeText(code.innerText).then(() => {
            document
                .querySelector(".code")
                .style.setProperty("--copied-bg", "#e5ffe4");
        });
    });

    const aElements = document.querySelectorAll("a");

    aElements.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            const href = link.getAttribute("href");
            document.querySelector(".fader").classList.add("fade-out");
            setTimeout(() => {
                // if new tab
                if (link.getAttribute("target") === "_blank")
                    window.open(href, "_blank");
                else window.location.href = href;
            }, 400);
        });
    });
});
