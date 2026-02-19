import { signInForm, signUpForm } from "../../pages/login/auth.js";

const wrapper = document.querySelector(".auth-wrapper");
const container = document.getElementById("auth-container");
const authBannerSignIn = document.querySelector(".auth-banner-content-signin");
const authBannerSignUp = document.querySelector(".auth-banner-content-signup");

function renderAuth(mode) {
    // Blur qo'shish
    container.classList.add("blur_animation");
    authBannerSignIn.classList.add("blur_animation");
    authBannerSignUp.classList.add("blur_animation");

    if (mode === "signup") {
        wrapper.classList.add("signup-mode");
    } else {
        wrapper.classList.remove("signup-mode");
    }

    // Kontentni o'zgartirish
    setTimeout(() => {
        container.innerHTML = mode === "signup" ? signUpForm : signInForm;

        if (mode === "signup") {
            authBannerSignIn.classList.add("hidden");
            authBannerSignUp.classList.remove("hidden");
        } else {
            authBannerSignIn.classList.remove("hidden");
            authBannerSignUp.classList.add("hidden");
        }

        // Blurni o'chirish
        container.classList.remove("blur_animation");
        authBannerSignIn.classList.remove("blur_animation");
        authBannerSignUp.classList.remove("blur_animation");

        attachEvents();
    }, 400);
}

function showError(inputId, message) {
    const inputField = document.getElementById(inputId);
    const errorText = inputField.nextElementSibling; // inputdan keyingi <p> olish uchun

    inputField.classList.add("error-border");
    errorText.innerText = message;
    errorText.style.opacity = "1";
}

function clearErrors() {
    const inputs = document.querySelectorAll(".input");
    const errors = document.querySelectorAll(".error-message");

    inputs.forEach((input) => input.classList.remove("error-border"));
    errors.forEach((error) => {
        error.innerText = "";
        error.style.opacity = "0";
    });
}

function attachEvents() {
    const toSignUp = document.getElementById("switch-to-signup");
    const toSignIn = document.getElementById("switch-to-signin");

    // signin va signup buttonlarni topamiz
    const signinbtn = document.querySelector(".signin-btn");
    const signupbtn = document.querySelector(".signup-btn");

    // signin va signup formlarini topamiz
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    if (toSignUp) toSignUp.onclick = () => renderAuth("signup");
    if (toSignIn) toSignIn.onclick = () => renderAuth("signin");

    // --- REGISTER
    if (registerForm) {
        signupbtn.onclick = () => {
            clearErrors();

            const username = document.getElementById("reg-username").value;
            const tel = document.getElementById("reg-tel").value;
            const email = document.getElementById("reg-email").value;
            const password = document.getElementById("reg-password").value;
            let hasError = false;

            if (username.length < 3) {
                showError("reg-username", "Username kamida 3 ta harf bo'lsin");
                hasError = true;
            }
            if (!tel.includes("+998") || tel.length < 13) {
                showError("reg-tel", "Telefon raqamini to'liq kiriting");
                hasError = true;
            }
            if (!email.includes("@")) {
                showError("reg-email", "Haqiqiy email kiriting");
                hasError = true;
            }
            if (password.length < 6) {
                showError("reg-password", "Parol kamida 6 belgidan iborat bo'lsin");
                hasError = true;
            }

            if (hasError) return;

            const users = JSON.parse(localStorage.getItem("users")) || [];
            if (users.some((user) => user.email === email)) {
                showError("reg-email", "Bu email band!");
                return;
            }

            // Yengi user qoshish
            users.push({ username, tel, email, password });
            localStorage.setItem("users", JSON.stringify(users));
            alert("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
            renderAuth("signin");
        };
    }

    // --- LOGIN
    if (loginForm) {
        signinbtn.onclick = () => {
            clearErrors();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            if (email.length == 0 || password.length == 0) {
                showError("email", "Emailni kiriting");
                showError("password", "Parolni kiriting");
                return;
            }

            const users = JSON.parse(localStorage.getItem("users")) || [];
            const foundUser = users.find((u) => u.email === email && u.password === password);

            if (foundUser) {
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("currentUser", JSON.stringify(foundUser));
                window.location.href = "index.html";
            } else {
                showError("email", "Bunday email mavjud emas");
                showError("password", "parol xato kiritildi");
            }
        };
    }

    // telfon raqamini togri kiritish logikasi
    const telInput = document.getElementById("reg-tel");
    if (telInput) {
        //Fokus bolganda +998 ni chiqarish
        telInput.onfocus = () => {
            if (!telInput.value) {
                telInput.value = "+998 ";
            }
        };

        telInput.oninput = (e) => {
            let value = telInput.value.replace(/\D/g, ""); // Faqat raqamlarni qoldirish

            if (value.length < 3) {
                telInput.value = "+998 ";
                return;
            }

            // Formatlash
            let formattedValue = "+998 ";

            if (value.length > 3) {
                formattedValue += value.substring(3, 5); // Kod 2ta raqam
            }
            if (value.length > 5) {
                formattedValue += " " + value.substring(5, 8); // 3ta raqam
            }
            if (value.length > 8) {
                formattedValue += " " + value.substring(8, 10); // 2ta raqam
            }
            if (value.length > 10) {
                formattedValue += " " + value.substring(10, 12); // oxirgi 2ta raqam
            }

            telInput.value = formattedValue;
        };
    }
}

renderAuth("signin");
