// Select the checkbox and the page elements we need to update.
const themeToggle = document.querySelector("#theme-toggle");
const themeTitle = document.querySelector(".theme-title");
const themeDescription = document.querySelector(".theme-description");
const statusText = document.querySelector(".status-text");
const themeCode = document.querySelector(".theme-code");

// Change the entire page theme.
function setTheme(isLight) {
    // Add or remove the class that controls the CSS variables.
    document.body.classList.toggle("light-theme", isLight);

    // Keep the checkbox synchronized with the current theme.
    themeToggle.checked = isLight;

    // Update the text to match the selected theme.
    themeTitle.innerHTML = isLight
        ? "Light <span>mode.</span>"
        : "Dark <span>mode.</span>";

    themeDescription.textContent = isLight
        ? "A little more light. A fresh perspective."
        : "A little less light. A little more focus.";

    statusText.textContent = isLight ? "DAYLIGHT ACTIVE" : "NIGHT MODE ACTIVE";

    themeCode.innerHTML = isLight
        ? "THM—<span>02</span>"
        : "THM—<span>01</span>";

    // Update the browser's theme color.
    document
        .querySelector('meta[name="theme-color"]')
        .setAttribute("content", isLight ? "#e9edf5" : "#0b0d12");

    // Remember the selection for the next visit.
    try {
        localStorage.setItem("preferred-theme", isLight ? "light" : "dark");
    } catch (error) {
        // The switch still works if browser storage is unavailable.
    }
}

// Restore the saved theme when the page loads.
let savedTheme = "dark";

try {
    savedTheme = localStorage.getItem("preferred-theme") || "dark";
} catch (error) {
    // Use dark mode as the default if storage is unavailable.
}

setTheme(savedTheme === "light");

// Listen for changes to the checkbox.
themeToggle.addEventListener("change", () => {
    setTheme(themeToggle.checked);
});

// ------------------------------
// CUSTOM CURSOR
// ------------------------------

// Only activate the custom cursor for mouse-like devices.
const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

if (hasFinePointer.matches) {
    // Create the cursor elements without changing the HTML.
    const cursorRing = document.createElement("div");
    const cursorDot = document.createElement("div");

    cursorRing.className = "custom-cursor cursor-ring";
    cursorDot.className = "custom-cursor cursor-dot";

    document.body.append(cursorRing, cursorDot);

    // Current mouse position.
    let mouseX = 0;
    let mouseY = 0;

    // Smooth position of the outer ring.
    let ringX = 0;
    let ringY = 0;

    let cursorVisible = false;
    let animationFrame;

    // Move the cursor to its starting position.
    function updateCursor() {
        // The dot follows the pointer directly.
        cursorDot.style.transform = `translate3d(${mouseX - 2.5}px, ${mouseY - 2.5}px, 0)`;

        // The ring catches up gradually for a smooth effect.
        ringX += (mouseX - ringX) * 0.16;
        ringY += (mouseY - ringY) * 0.16;

        // Keep the bubble centered even when its size changes on hover.
        cursorRing.style.transform =
            `translate3d(${ringX - cursorRing.offsetWidth / 2}px, ` +
            `${ringY - cursorRing.offsetHeight / 2}px, 0)`;

        // Continue animating while the cursor is visible.
        if (cursorVisible) {
            animationFrame = requestAnimationFrame(updateCursor);
        }
    }

    // Track mouse movement.
    document.addEventListener("pointermove", (event) => {
        if (event.pointerType !== "mouse") return;

        mouseX = event.clientX;
        mouseY = event.clientY;

        // Update the spotlight position inside the card.
        const card = document.querySelector(".theme-card");
        const rect = card.getBoundingClientRect();

        card.style.setProperty("--mouse-x", `${mouseX - rect.left}px`);

        card.style.setProperty("--mouse-y", `${mouseY - rect.top}px`);

        // Reveal the cursor when the mouse enters the page.
        if (!cursorVisible) {
            cursorVisible = true;

            ringX = mouseX;
            ringY = mouseY;

            cursorRing.style.opacity = "1";
            cursorDot.style.opacity = "1";

            cancelAnimationFrame(animationFrame);
            updateCursor();
        }
    });

    // Hide the cursor when the pointer leaves the page.
    document.addEventListener("pointerout", (event) => {
        if (!event.relatedTarget) {
            cursorVisible = false;

            cursorRing.style.opacity = "0";
            cursorDot.style.opacity = "0";

            cancelAnimationFrame(animationFrame);
        }
    });

    // Enlarge the ring over interactive elements.
    const interactiveElements = document.querySelectorAll(
        "a, button, label, input, [role='button']",
    );

    interactiveElements.forEach((element) => {
        element.addEventListener("pointerenter", () => {
            cursorRing.classList.add("is-hovering");
            cursorDot.classList.add("is-hovering");
        });

        element.addEventListener("pointerleave", () => {
            cursorRing.classList.remove("is-hovering");
            cursorDot.classList.remove("is-hovering");
        });
    });

    // Give the cursor a subtle click animation.
    document.addEventListener("pointerdown", (event) => {
        if (event.pointerType !== "mouse") return;

        cursorRing.classList.add("is-pressed");
    });

    document.addEventListener("pointerup", () => {
        cursorRing.classList.remove("is-pressed");
    });
}
