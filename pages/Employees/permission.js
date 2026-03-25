//  permissions.js
const _key = (u) => `user_permissions_${u}`;

const DEFAULT_PERMISSIONS = {
    nav_dashboard: true,
    nav_vacations: true,
    nav_messenger: true,
    nav_tasks: true,
    nav_employees: true,
    nav_business: true,
    nav_infoportal: true,

    // Vacations
    vac_add_tour: true,
    vac_edit_tour: true,
    vac_delete_tour: true,

    // Employees
    emp_perm_btn: true,
    emp_edit_btn: true,
    // emp_delete_btn: true,
};

export const getPermissions = (username) => {
    if (!username) return { ...DEFAULT_PERMISSIONS };
    try {
        const saved = JSON.parse(localStorage.getItem(_key(username)) || "null");
        return { ...DEFAULT_PERMISSIONS, ...(saved || {}) };
    } catch {
        return { ...DEFAULT_PERMISSIONS };
    }
};

export const savePermissions = (username, perms) => {
    if (username) localStorage.setItem(_key(username), JSON.stringify(perms));
};

export const applyPermissions = (username) => {
    if (!username) return;
    const perms = getPermissions(username);
    document.querySelectorAll("[data-perm]").forEach((el) => {
        if (el.classList.contains("emp-perm-btn")) return;
        const key = el.getAttribute("data-perm");
        el.style.display = perms[key] !== false ? "" : "none";
    });
};

// ─── TRANSLATIONS ────────────────────────────────────────────────
const TR = {
    uz: {
        btn_label: "Cheklovlar",
        title: "Foydalanuvchi cheklovlari",
        sub: "uchun ruxsatlar",
        save: "Saqlash",
        cancel: "Bekor qilish",
        saved: "Saqlandi ✓",
        section_nav: "Sahifalarga kirish",
        nav_dashboard: "Testlar",
        nav_vacations: "Ta'tillar",
        nav_messenger: "Messenger",
        nav_tasks: "Tasks",
        nav_employees: "Employees",
        nav_business: "Payments",
        nav_infoportal: "InfoPortal",
        //------------------------------------
        // Vacations
        vac_add_tour: "Yangi tur qo'shish",
        vac_edit_tour: "Turni tahrirlash",
        vac_delete_tour: "Turni o'chirish",
        // Employees
        emp_edit_btn: "Xodim tahrirlash tugmasi",
        emp_delete_btn: "Xodim o'chirish tugmasi",
        //---------------------------------------
        emp_perm_btn: "Xodim cheklovlari tugmasi",
        expand_hint: "Ichki sozlamalar",
    },
    en: {
        btn_label: "Permissions",
        title: "User Permissions",
        sub: "permissions for",
        save: "Save",
        cancel: "Cancel",
        saved: "Saved ✓",
        section_nav: "Page access",
        nav_dashboard: "Tests",
        nav_vacations: "Vacations",
        nav_messenger: "Messenger",
        nav_tasks: "Tasks",
        nav_employees: "Employees",
        nav_business: "Payments",
        nav_infoportal: "InfoPortal",
        //------------------------------------
        // Vacations
        vac_add_tour: "Add tour",
        vac_edit_tour: "Edit tour",
        vac_delete_tour: "Delete tour",
        // Employees
        emp_edit_btn: "Edit employee button",
        emp_delete_btn: "Delete employee button",
        //---------------------------------------
        emp_perm_btn: "Employee permissions button",
        expand_hint: "Inner settings",
    },
    ru: {
        btn_label: "Ограничения",
        title: "Ограничения пользователя",
        sub: "разрешения для",
        save: "Сохранить",
        cancel: "Отмена",
        saved: "Сохранено ✓",
        section_nav: "Доступ к страницам",
        nav_dashboard: "Тесты",
        nav_vacations: "Отпуска",
        nav_messenger: "Мессенджер",
        nav_tasks: "Задачи",
        nav_employees: "Сотрудники",
        nav_business: "Платежи",
        nav_infoportal: "InfoPortal",
        //------------------------------------
        // Vacations
        vac_add_tour: "Добавить тур",
        vac_edit_tour: "Редактировать тур",
        vac_delete_tour: "Удалить тур",
        // Employees
        emp_edit_btn: "Кнопка редактирования сотрудника",
        emp_delete_btn: "Кнопка удаления сотрудника",
        //---------------------------------------
        emp_perm_btn: "Кнопка ограничений сотрудника",
        expand_hint: "Вложенные настройки",
    },
};

const getModalSections = (tr) => [
    {
        label: tr.section_nav,
        items: [
            { key: "nav_dashboard", label: tr.nav_dashboard },
            //------------------------------------------------------------------------
            { key: "nav_business", label: tr.nav_business },
            //------------------------------------------------------------------------
            { key: "nav_tasks", label: tr.nav_tasks },
            //------------------------------------------------------------------------
            {
                key: "nav_vacations",
                label: tr.nav_vacations,
                subs: [
                    { key: "vac_add_tour", label: tr.vac_add_tour },
                    { key: "vac_edit_tour", label: tr.vac_edit_tour },
                    { key: "vac_delete_tour", label: tr.vac_delete_tour },
                ],
            },
            //------------------------------------------------------------------------
            {
                key: "nav_employees",
                label: tr.nav_employees,
                subs: [
                    { key: "emp_perm_btn", label: tr.emp_perm_btn },
                    { key: "emp_edit_btn", label: tr.emp_edit_btn },
                    // { key: "emp_delete_btn", label: tr.emp_delete_btn },
                ],
            },
            //------------------------------------------------------------------------
            { key: "nav_messenger", label: tr.nav_messenger },
            //------------------------------------------------------------------------
            { key: "nav_infoportal", label: tr.nav_infoportal },
        ],
    },
];

// ─── BLOCKED COUNT ─────────────────────────────────────────
// subs ichida nechta bloklangan
const blockedCount = (subs, perms) => subs.filter((s) => perms[s.key] === false).length;
const countBadgeHtml = (count) => (count > 0 ? `<span class="perm-sub-count perm-sub-count--active">${count}</span>` : `<span class="perm-sub-count"></span>`);

// ─── MODAL ───────────────────────────────────────────────────────
export const openPermissionsModal = (targetUsername, lang = "uz") => {
    const tr = TR[lang] || TR.en;
    const perms = getPermissions(targetUsername);

    const badgeText = (on) => (on ? (lang === "uz" ? "Ruxsat" : lang === "ru" ? "Разрешено" : "Allowed") : lang === "uz" ? "Bloklangan" : lang === "ru" ? "Заблокировано" : "Blocked");

    const toggleEl = (key, on) => `
        <div class="perm-toggle ${on ? "perm-toggle--on" : ""}" data-toggle-for="${key}">
            <div class="perm-toggle-thumb"></div>
            <input type="checkbox" class="perm-checkbox" data-key="${key}"
            ${on ? "checked" : ""} style="display:none"/>
        </div>`;

    const rowHtml = (item, isSub = false) => {
        const on = perms[item.key] !== false;
        return `
        <div class="perm-item ${on ? "perm-item--on" : "perm-item--off"}${isSub ? " perm-item--sub" : ""}"
            data-perm-key="${item.key}">
            <div class="perm-item-info">
                <span class="perm-item-label">${item.label}</span>
                <span class="perm-item-badge ${on ? "badge--on" : "badge--off"}">${badgeText(on)}</span>
            </div>
            <div class="perm-item-right">${toggleEl(item.key, on)}</div>
        </div>`;
    };

    const rowWithSubsHtml = (item) => {
        const on = perms[item.key] !== false;
        const count = blockedCount(item.subs, perms);

        return `
        <div class="perm-item-group">
            <div class="perm-item ${on ? "perm-item--on" : "perm-item--off"}" data-perm-key="${item.key}">
                <div class="perm-item-info">
                    <span class="perm-item-label">${item.label}</span>
                    <span class="perm-item-badge ${on ? "badge--on" : "badge--off"}">${badgeText(on)}</span>
                </div>
                <div class="perm-item-right">
                    <!-- Blocked count badge — chevron yonida -->
                    ${countBadgeHtml(count)}

                    <button class="perm-chevron-btn" data-expand-for="${item.key}" title="${tr.expand_hint}">
                        <svg class="perm-chevron-icon" width="15" height="15" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2.5"
                                  stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    ${toggleEl(item.key, on)}
                </div>
            </div>
            <div class="perm-sub-panel" data-sub-for="${item.key}">
                <div class="perm-sub-items">
                    ${item.subs.map((s) => rowHtml(s, true)).join("")}
                </div>
            </div>
        </div>`;
    };

    const sectionsHtml = getModalSections(tr)
        .map(
            (sec) => `
        <div class="perm-section">
            <div class="perm-section-label">${sec.label}</div>
            <div class="perm-items">
                ${sec.items.map((item) => (item.subs ? rowWithSubsHtml(item) : rowHtml(item))).join("")}
            </div>
        </div>`,
        )
        .join("");

    document.getElementById("perm-modal-overlay")?.remove();
    const overlay = document.createElement("div");
    overlay.id = "perm-modal-overlay";
    overlay.className = "perm-overlay";
    overlay.innerHTML = `
    <div class="perm-modal">
        <div class="perm-header">
            <div class="perm-header-left">
                <div class="perm-header-icon">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                        <rect x="3" y="11" width="18" height="11" rx="2" stroke="#fff" stroke-width="2"/>
                        <path d="M7 11V7a5 5 0 0110 0v4" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div>
                    <div class="perm-header-title">${tr.title}</div>
                    <div class="perm-header-sub">${tr.sub} ${targetUsername}</div>
                </div>
            </div>
            <button class="perm-close" id="perm-close-btn">✕</button>
        </div>
        <div class="perm-body">${sectionsHtml}</div>
        <div class="perm-footer">
            <button class="perm-btn-cancel" id="perm-cancel-btn">${tr.cancel}</button>
            <button class="perm-btn-save"   id="perm-save-btn">${tr.save}</button>
        </div>
    </div>`;
    document.body.appendChild(overlay);

    // ── Chevron ──
    overlay.querySelectorAll(".perm-chevron-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const panel = overlay.querySelector(`.perm-sub-panel[data-sub-for="${btn.dataset.expandFor}"]`);
            btn.classList.toggle("perm-chevron-btn--open", panel.classList.toggle("perm-sub-panel--open"));
        });
    });

    // ── Toggle — o'zgarganda count badge ni yangilaydi ──
    overlay.querySelectorAll(".perm-toggle").forEach((tog) => {
        tog.addEventListener("click", (e) => {
            e.stopPropagation();
            const cb = tog.querySelector(".perm-checkbox");
            const key = cb.dataset.key;
            const nowOn = !cb.checked;
            cb.checked = nowOn;
            tog.classList.toggle("perm-toggle--on", nowOn);

            const row = overlay.querySelector(`.perm-item[data-perm-key="${key}"]`);
            const bdg = row?.querySelector(".perm-item-badge");
            row?.classList.toggle("perm-item--on", nowOn);
            row?.classList.toggle("perm-item--off", !nowOn);
            if (bdg) {
                bdg.className = `perm-item-badge ${nowOn ? "badge--on" : "badge--off"}`;
                bdg.textContent = badgeText(nowOn);
            }

            const group = row?.closest(".perm-item-group");
            if (group) {
                const countBadgeEl = group.querySelector(".perm-sub-count");
                if (countBadgeEl) {
                    // Hozirgi holat bo'yicha nechta blocked
                    const blockedNow = group.querySelectorAll(".perm-sub-panel .perm-checkbox:not(:checked)").length;
                    countBadgeEl.textContent = blockedNow > 0 ? blockedNow : "";
                    countBadgeEl.classList.toggle("perm-sub-count--active", blockedNow > 0);
                }
            }
        });
    });

    // ── Save ──
    overlay.querySelector("#perm-save-btn").addEventListener("click", () => {
        const newPerms = { ...perms };
        overlay.querySelectorAll(".perm-checkbox[data-key]").forEach((cb) => {
            newPerms[cb.dataset.key] = cb.checked;
        });
        savePermissions(targetUsername, newPerms);

        const btn = overlay.querySelector("#perm-save-btn");
        btn.textContent = tr.saved;
        btn.style.background = "#22c55e";
        setTimeout(() => {
            btn.textContent = tr.save;
            btn.style.background = "";
        }, 1600);

        document.dispatchEvent(new CustomEvent("permissions-updated", { detail: { username: targetUsername } }));
        const cu = JSON.parse(localStorage.getItem("currentUser") || "null");
        if (cu?.username === targetUsername) applyPermissions(targetUsername);
    });

    // ── Close ──
    const close = () => {
        overlay.style.opacity = "0";
        overlay.style.transition = "opacity 0.2s";
        setTimeout(() => overlay.remove(), 200);
    };
    overlay.querySelector("#perm-close-btn").addEventListener("click", close);
    overlay.querySelector("#perm-cancel-btn").addEventListener("click", close);
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) close();
    });
    document.addEventListener("keydown", function esc(e) {
        if (e.key === "Escape") {
            close();
            document.removeEventListener("keydown", esc);
        }
    });
};

export const createPermissionsBtn = (targetUsername, lang = "uz") => {
    const tr = TR[lang] || TR.en;
    return `
    <button class="emp-perm-btn" data-username="${targetUsername}">
        <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        ${tr.btn_label}
    </button>`;
};

export const initPermissionsBtn = (lang = "uz") => {
    document.querySelectorAll(".emp-perm-btn[data-username]").forEach((btn) => {
        const fresh = btn.cloneNode(true);
        btn.parentNode.replaceChild(fresh, btn);
        fresh.addEventListener("click", (e) => {
            e.stopPropagation();
            openPermissionsModal(fresh.dataset.username, lang);
        });
    });
};
