import "../../components/component.js";
import "../../pages/pages.js";

if (localStorage.getItem("isLoggedIn") !== "true" || localStorage.getItem("users").length === 0) {
    window.location.href = "login.html";
}
