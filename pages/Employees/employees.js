// employees.js
import { openPermissionsModal, getPermissions } from "./permission.js";
import { translations } from "../Employees/translations.js";

let currentLang = localStorage.getItem("language") || "uz";
const t = (key) => translations[currentLang][key] || key;

export const EmployeesPage = `
    <div class="employees-page">
        <div class="employees-header">
            <h2 id="employee-count-title">${t("employees")} (0)</h2>
            <button class="btn add-employee-btn">${t("add_employees")}</button>
        </div>
        <div id="employees-list"></div>
        <div class="pagination" id="pagination"></div>
    </div>

    <div class="modal" id="employeeModal" style="display:none;">
        <div class="modal-content">
            <h3 id="modalTitle">${t("add_employees")}</h3>
            <div class="avatar-upload-wrapper">
                <div class="avatar-preview">
                    <img id="modal-avatar-img" src="./assets/images/User-avatar.png" alt="Preview"/>
                </div>
                <label for="avatar-input" class="upload-label">${t("change_photo")}</label>
                <input type="file" id="avatar-input" accept="image/*" style="display:none;"/>
            </div>
            <div class="modal-body">
                <input class="input" id="emp-username" placeholder="${t("full_name")}"/>
                <input class="input" id="emp-email"    placeholder="${t("email_address")}"/>
                <input class="input" id="emp-password" placeholder="${t("password")}"/>
                <input class="input" id="emp-tel"      placeholder="${t("phone_number")}"/>
                <select id="emp-gender">
                    <option value="" disabled selected>${t("select_gander")}</option>
                    <option value="Male">${t("male")}</option>
                    <option value="Female">${t("famale")}</option>
                </select>
                <input class="input" id="emp-age"      type="number" placeholder="${t("age")}"/>
                <input class="input" id="emp-position" placeholder="${t("job_position")}"/>
                <input class="input" id="emp-level"    placeholder="${t("level")}"/>
            </div>
            <div class="modal-actions">
                <button id="cancelModal"  class="btn-cancel">${t("cancel")}</button>
                <button id="saveEmployee" class="btn-save">${t("save")}</button>
            </div>
        </div>
    </div>

    <div class="modal" id="deleteConfirmModal" style="display:none;">
        <div class="modal-content delete-modal">
            <h3>O'chirishni tasdiqlaysizmi?</h3>
            <div class="delete-modal-actions modal-actions">
                <button id="cancelDelete"  class="btn-cancel">Yo'q</button>
                <button id="confirmDelete" class="btn-delete-confirm">Ha</button>
            </div>
        </div>
    </div>
`;

export function initEmployeesPage() {
    const list = document.getElementById("employees-list");
    const modal = document.getElementById("employeeModal");
    const modalTitle = document.getElementById("modalTitle");
    const employeeCountTitle = document.getElementById("employee-count-title");
    const pagination = document.getElementById("pagination");
    const usernameInput = document.getElementById("emp-username");
    const emailInput = document.getElementById("emp-email");
    const passwordInput = document.getElementById("emp-password");
    const telInput = document.getElementById("emp-tel");
    const genderInput = document.getElementById("emp-gender");
    const ageInput = document.getElementById("emp-age");
    const positionInput = document.getElementById("emp-position");
    const levelInput = document.getElementById("emp-level");
    const avatarInput = document.getElementById("avatar-input");
    const modalAvatarImg = document.getElementById("modal-avatar-img");
    const saveBtn = document.getElementById("saveEmployee");
    const cancelBtn = document.getElementById("cancelModal");
    const addBtn = document.querySelector(".add-employee-btn");
    const deleteModal = document.getElementById("deleteConfirmModal");
    const confirmDeleteBtn = document.getElementById("confirmDelete");
    const cancelDeleteBtn = document.getElementById("cancelDelete");

    const ITEMS_PER_PAGE = 4;
    let currentPageNum = 1;
    let editIndex = null;
    let indexToDelete = null;
    let currentImage = "./assets/images/User-avatar.png";

    avatarInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            currentImage = ev.target.result;
            modalAvatarImg.src = currentImage;
        };
        reader.readAsDataURL(file);
    };

    // ── Permissions button ────────────────────────────────────────
    // JORIY login qilgan userning emp_perm_btn permissionini tekshiradi.
    // Isroil Islomni bloklasa → Islom kirganda bu funksiya
    // getPermissions("islom") → emp_perm_btn: false → "" qaytaradi
    function makePermBtn(targetUsername) {
        // Hozir kim login qilgan?
        const cu = JSON.parse(localStorage.getItem("currentUser") || "null");
        if (!cu?.username) return ""; // login qilinmagan

        // JORIY userning (masalan Islomning) permissionini tekshiramiz
        const myPerms = getPermissions(cu.username);
        if (myPerms["emp_perm_btn"] === false) return ""; // ruxsat yo'q — button chiqmaydi

        const label = currentLang === "ru" ? "Ограничения" : currentLang === "en" ? "Permissions" : "Cheklovlar";

        return `
        <button class="emp-perm-btn" data-username="${targetUsername}">
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            ${label}
        </button>`;
    }

    // ── Render ────────────────────────────────────────────────────
    function renderEmployees() {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        list.innerHTML = "";
        employeeCountTitle.innerText = `${t("employees")} (${users.length})`;

        const start = (currentPageNum - 1) * ITEMS_PER_PAGE;
        const pageUsers = users.slice(start, start + ITEMS_PER_PAGE);

        if (pageUsers.length === 0 && currentPageNum > 1) {
            currentPageNum--;
            renderEmployees();
            return;
        }

        pageUsers.forEach((u, idx) => {
            const realIndex = start + idx;
            const card = document.createElement("div");
            card.className = "employee-card";
            card.innerHTML = `
            <div class="employee-card-inner">
                <div class="employee-box">
                    <div class="emp-avatar-wrap">
                        <img src="${u.avatar || "./assets/images/User-avatar.png"}" alt="${u.username || "User"}"/>
                        <span class="emp-avatar-dot"></span>
                    </div>
                    <div class="name-email-box">
                        <span class="username">${u.username || "—"}</span>
                        <span class="useremail">${u.email || "—"}</span>
                    </div>
                </div>
                <div class="user-main-info">
                    <div class="info-chip">
                        <span class="info-chip-label">${t("gender")}</span>
                        <span class="info-chip-value">${u.gender || "—"}</span>
                    </div>
                    <div class="info-chip">
                        <span class="info-chip-label">${t("age")}</span>
                        <span class="info-chip-value">${u.age || "—"}</span>
                    </div>
                    <div class="info-chip info-chip">
                        <span class="info-chip-label">${t("position")}</span>
                        <span class="info-chip-value">${u.position || "—"}</span>
                    </div>
                    <div class="info-chip">
                        <span class="info-chip-label">${t("level_mini") || "Level"}</span>
                        <span class="info-chip-value">${u.level || "—"}</span>
                    </div>
                </div>
                <div class="employee-actions">
                    <button data-perm="emp_edit_btn" class="emp-action-btn emp-action-btn--edit" data-idx="${realIndex}" title="${t("edit")}">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                    <button data-perm="emp_delete_btn" class="emp-action-btn emp-action-btn--delete" data-idx="${realIndex}" title="${t("delete")}">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                    ${makePermBtn(u.username)}
                </div>
            </div>`;
            list.appendChild(card);
        });

        renderPagination(users.length);
        attachEvents();
    }

    function renderPagination(total) {
        pagination.innerHTML = "";
        const totalPages = Math.ceil(total / ITEMS_PER_PAGE) || 1;
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement("button");
            btn.innerText = i;
            if (i === currentPageNum) btn.classList.add("active");
            btn.onclick = () => {
                currentPageNum = i;
                renderEmployees();
            };
            pagination.appendChild(btn);
        }
    }

    function attachEvents() {
        document.querySelectorAll(".emp-action-btn--edit").forEach((btn) => {
            btn.onclick = () => openEdit(parseInt(btn.dataset.idx));
        });
        document.querySelectorAll(".emp-action-btn--delete").forEach((btn) => {
            btn.onclick = () => deleteEmployee(parseInt(btn.dataset.idx));
        });
        document.querySelectorAll(".emp-perm-btn[data-username]").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                openPermissionsModal(btn.dataset.username, currentLang);
            });
        });
    }

    // permissions-updated → list qayta render
    document.addEventListener("permissions-updated", () => renderEmployees());

    function openEdit(index) {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const u = users[index];
        editIndex = index;
        modalTitle.innerText = t("edit_employees");
        usernameInput.value = u.username || "";
        emailInput.value = u.email || "";
        passwordInput.value = u.password || "";
        telInput.value = u.tel || "";
        genderInput.value = u.gender || "";
        ageInput.value = u.age || "";
        positionInput.value = u.position || "";
        levelInput.value = u.level || "";
        currentImage = u.avatar || "./assets/images/User-avatar.png";
        modalAvatarImg.src = currentImage;
        modal.style.display = "flex";
    }

    saveBtn.onclick = () => {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        const existing = editIndex !== null ? users[editIndex] : {};
        const data = {
            ...existing,
            username: usernameInput.value,
            email: emailInput.value,
            tel: telInput.value,
            gender: genderInput.value,
            age: ageInput.value,
            position: positionInput.value,
            level: levelInput.value,
            avatar: currentImage,
            password: passwordInput.value,
            id: editIndex !== null ? users[editIndex].id : Date.now(),
        };
        if (editIndex !== null) users[editIndex] = data;
        else users.push(data);
        localStorage.setItem("users", JSON.stringify(users));

        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser && existing.email === currentUser.email) localStorage.setItem("currentUser", JSON.stringify(data));

        modal.style.display = "none";
        renderEmployees();
        window.location.reload();
    };

    cancelBtn.onclick = () => {
        modal.style.display = "none";
    };

    addBtn.onclick = () => {
        editIndex = null;
        modalTitle.innerText = t("add_employees");
        [usernameInput, emailInput, passwordInput, telInput, ageInput, positionInput, levelInput].forEach((i) => (i.value = ""));
        genderInput.value = "";
        currentImage = "./assets/images/User-avatar.png";
        modalAvatarImg.src = currentImage;
        modal.style.display = "flex";
    };

    function deleteEmployee(index) {
        indexToDelete = index;
        deleteModal.style.display = "flex";
    }

    cancelDeleteBtn.onclick = () => {
        deleteModal.style.display = "none";
        indexToDelete = null;
    };

    confirmDeleteBtn.onclick = () => {
        if (indexToDelete === null) return;
        let users = JSON.parse(localStorage.getItem("users")) || [];
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const deletingUser = users[indexToDelete];
        users.splice(indexToDelete, 1);
        localStorage.setItem("users", JSON.stringify(users));
        deleteModal.style.display = "none";
        if (currentUser && deletingUser && deletingUser.email === currentUser.email) {
            localStorage.removeItem("currentUser");
            window.location.href = "login.html";
            return;
        }
        const maxPage = Math.ceil(users.length / ITEMS_PER_PAGE) || 1;
        if (currentPageNum > maxPage) currentPageNum = maxPage;
        renderEmployees();
        indexToDelete = null;
    };

    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = "none";
        if (e.target === deleteModal) deleteModal.style.display = "none";
    };

    renderEmployees();
}
