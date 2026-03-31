import "../../components/component.js";
import "../../pages/pages.js";

if (localStorage.getItem("isLoggedIn") !== "true" || localStorage.getItem("users").length === 0) {
    window.location.href = "login.html";
}

const initLanguage = () => {
    const savedLang = localStorage.getItem("language") || "uz";
    const select = document.getElementById("language-selector");

    if (!select) return;

    const selected = select.querySelector(".selected");
    const options = select.querySelector(".options");
    const items = select.querySelectorAll(".options li");

    // 1️⃣ Saqlangan tilni UI ga o'rnatish
    items.forEach((item) => {
        if (item.dataset.value === savedLang) {
            const img = item.querySelector("img").src;
            const text = item.textContent.trim();
            selected.innerHTML = `<img src="${img}"> <span>${text}</span>`;
        }
    });

    // 2️⃣ Dropdown ochish/yopish
    selected.addEventListener("click", () => {
        options.style.display = options.style.display === "block" ? "none" : "block";
    });

    // 3️⃣ Til tanlanganda
    items.forEach((item) => {
        item.addEventListener("click", () => {
            const lang = item.dataset.value;
            localStorage.setItem("language", lang);

            // Tanlangan sanani saqlash (InfoPortal uchun)
            const calPanel = document.getElementById("cal-events-panel");
            const calEventsDate = document.getElementById("cal-events-date");
            if (calPanel?.classList.contains("active") && calEventsDate?.textContent) {
                localStorage.setItem("cal_selected_date", calEventsDate.textContent);
            }

            // Sahifani reload qilish
            window.location.reload();
        });
    });

    // 4️⃣ Tashqariga bossak yopiladi
    document.addEventListener("click", (e) => {
        if (!select.contains(e.target)) {
            options.style.display = "none";
        }
    });
};

window.addEventListener("DOMContentLoaded", initLanguage);
