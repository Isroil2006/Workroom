import { translations } from "./trasnslations.js";

let currentLang = localStorage.getItem("language") || "uz";
const t = (key) => translations[currentLang]?.[key] ?? key;

// ─── DATA HELPERS ─────────────────────────────────────────────
const getProjects = () => JSON.parse(localStorage.getItem("todo_projects")) || [];
const saveProjects = (p) => localStorage.setItem("todo_projects", JSON.stringify(p));
const getUsers = () => JSON.parse(localStorage.getItem("users")) || [];
const getCurrent = () => JSON.parse(localStorage.getItem("currentUser"));
const genId = () => `id_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

// ─── PERMISSION & STATUS HELPERS ────────────────────────────
const isOwner = (task) => {
    const cu = getCurrent();
    if (!cu) return false;
    if (!task.createdBy) return true;
    return task.createdBy === cu.username;
};

const isAssignee = (task) => {
    const cu = getCurrent();
    if (!cu) return false;
    const ids = task.assigneeIds || (task.assigneeId ? [task.assigneeId] : []);
    return ids.includes(cu.username);
};

const canSeeTask = (task) => {
    const cu = getCurrent();
    if (!cu) return true;
    const ids = task.assigneeIds || (task.assigneeId ? [task.assigneeId] : []);
    if (ids.length === 0) return true;
    return isOwner(task) || ids.includes(cu.username);
};

// Joriy userga ko'rinadigan status (personal yoki global)
const getVisibleStatus = (task) => {
    const cu = getCurrent();
    const ids = task.assigneeIds || (task.assigneeId ? [task.assigneeId] : []);
    if (cu && ids.includes(cu.username)) {
        return task.userStatus?.[cu.username] || "todo";
    }
    return task.status || "todo";
};

// Global task.status ni qayta hisoblash (owner uchun ko'rsatish)
const recalcGlobalStatus = (task) => {
    const ids = task.assigneeIds || (task.assigneeId ? [task.assigneeId] : []);
    if (ids.length === 0) return;
    const allDone = ids.every((id) => task.userStatus?.[id] === "done");
    const anyProgress = ids.some((id) => task.userStatus?.[id] === "progress" || task.userStatus?.[id] === "done");
    task.status = allDone ? "done" : anyProgress ? "progress" : "todo";
};

// ─── CONFIGS ──────────────────────────────────────────────────
const priorityConfig = {
    none: { label: () => t("priority_none"), icon: "⬜", cls: "p-none" },
    low: { label: () => t("priority_low"), icon: "🟢", cls: "p-low" },
    medium: { label: () => t("priority_medium"), icon: "🟡", cls: "p-medium" },
    high: { label: () => t("priority_high"), icon: "🔴", cls: "p-high" },
    urgent: { label: () => t("priority_urgent"), icon: "🔥", cls: "p-urgent" },
};
const statusConfig = {
    todo: { label: () => t("status_todo"), cls: "s-todo" },
    progress: { label: () => t("status_progress"), cls: "s-progress" },
    done: { label: () => t("status_done"), cls: "s-done" },
};

// ─── AVATAR ───────────────────────────────────────────────────
const avatarColors = ["#5b6ef5", "#7c3aed", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#6d505f"];
const avatarColor = (name = "") => {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    return avatarColors[Math.abs(h) % avatarColors.length];
};

const initials = (name = "") =>
    name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0] || "")
        .join("")
        .toUpperCase();

const userAvatarHtml = (user, size = 26) => {
    const s = `width:${size}px;height:${size}px;`;
    if (!user) return `<div class="todo-avatar-empty" style="${s}"><svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#aaa" stroke-width="2"/><circle cx="12" cy="7" r="4" stroke="#aaa" stroke-width="2"/></svg></div>`;
    if (user.avatar && user.avatar !== "./assets/images/User-avatar.png") return `<img src="${user.avatar}" class="todo-avatar" style="${s}" title="${user.username}" />`;
    return `<div class="todo-avatar" style="${s};background:${avatarColor(user.username)};font-size:${Math.round(size * 0.35)}px;" title="${user.username}">${initials(user.username)}</div>`;
};

// Bir nechta assignee avatarlarini stack ko'rinishida chiqaradi
const assigneeStackHtml = (task, size = 26) => {
    const users = getUsers();
    const ids = task.assigneeIds || (task.assigneeId ? [task.assigneeId] : []);
    if (ids.length === 0) return userAvatarHtml(null, size);
    const shown = ids.slice(0, 3);
    const extra = ids.length - 3;
    let html = `<div class="todo-avatar-stack">`;
    shown.forEach((id) => {
        const u = users.find((u) => u.username === id);
        html += userAvatarHtml(u, size);
    });
    if (extra > 0) html += `<div class="todo-avatar-extra" style="width:${size}px;height:${size}px;font-size:${Math.round(size * 0.35)}px">+${extra}</div>`;
    html += `</div>`;
    return html;
};

// ─── BADGES ───────────────────────────────────────────────────
const getPriorityBadge = (p) => {
    const cfg = priorityConfig[p] || priorityConfig.none;
    return `<span class="todo-priority-badge ${cfg.cls}">${cfg.icon} ${cfg.label()}</span>`;
};

const dueDateHtml = (dateStr) => {
    if (!dateStr) return `<span class="todo-due-date date-empty">—</span>`;
    const due = new Date(dateStr);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diff = Math.floor((due - now) / 86400000);
    if (diff < 0) return `<span class="todo-due-date date-overdue">${t("overdue")}</span>`;
    if (diff === 0) return `<span class="todo-due-date date-today">${t("today")}</span>`;
    return `<span class="todo-due-date date-normal">${due.toLocaleDateString()}</span>`;
};

// ─── PAGE HTML ────────────────────────────────────────────────
export const TodoPage = `
<div class="todo-wrap">
  <div class="todo-header">
    <div class="todo-header-left">
      <h1 class="todo-main-title">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" style="flex-shrink:0">
          <path d="M9 11l3 3L22 4" stroke="#5b6ef5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#5b6ef5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span id="todo-project-title">Tasks</span>
      </h1>
    </div>
    <div class="todo-header-right">
      <div class="todo-view-tabs">
        <button class="todo-view-tab active" id="tab-list">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          <span id="tab-list-label">List</span>
        </button>
        <button class="todo-view-tab" id="tab-board">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/></svg>
          <span id="tab-board-label">Board</span>
        </button>
      </div>
      <button class="todo-add-project-btn" id="todo-add-project-btn">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
        <span id="todo-add-project-label">+ Project</span>
      </button>
    </div>
  </div>

  <div class="todo-toolbar">
    <div class="todo-search-wrap">
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" stroke="#aaa" stroke-width="2"/><path d="M21 21l-4.35-4.35" stroke="#aaa" stroke-width="2" stroke-linecap="round"/></svg>
      <input type="text" id="todo-search" placeholder="Search..." />
    </div>
    <div class="todo-filters">
      <button class="todo-filter-btn active" data-filter="all"      id="filter-all">All</button>
      <button class="todo-filter-btn"        data-filter="todo"     id="filter-todo">To Do</button>
      <button class="todo-filter-btn"        data-filter="progress" id="filter-progress">In Progress</button>
      <button class="todo-filter-btn"        data-filter="done"     id="filter-done">Done</button>
    </div>
    <button class="todo-create-btn" id="todo-create-task-btn">
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
      <span id="todo-add-task-label">+ Add Task</span>
    </button>
  </div>

  <div class="todo-project-tabs" id="todo-project-tabs"></div>

  <div class="todo-content-area">
    <div class="todo-no-projects" id="todo-no-projects" style="display:none">
      <svg width="64" height="64" fill="none" viewBox="0 0 24 24" style="margin:0 auto 16px;display:block;opacity:.3">
        <path d="M9 11l3 3L22 4" stroke="#5b6ef5" stroke-width="2"/>
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#5b6ef5" stroke-width="2"/>
      </svg>
      <p id="no-projects-msg" style="color:#8892a4;font-size:14px;text-align:center;margin:0"></p>
    </div>
    <div id="todo-view-container"></div>
  </div>
</div>

<!-- ══ TASK CREATE/EDIT MODAL ══ -->
<div id="task-modal" class="todo-modal-overlay" style="display:none">
  <div class="todo-modal">
    <div class="todo-modal-header">
      <h3 id="task-modal-title">Create Task</h3>
      <button class="todo-modal-close" id="task-modal-close">✕</button>
    </div>
    <div class="todo-modal-body">
      <div class="todo-form-group">
        <label class="todo-form-label" id="lbl-task-name">Task Name</label>
        <input class="todo-form-input" id="tm-title" placeholder="Enter task title..." />
      </div>
      <div class="todo-form-group">
        <label class="todo-form-label" id="lbl-task-desc">Description</label>
        <textarea class="todo-form-input" id="tm-desc" rows="3" placeholder="Description..."></textarea>
      </div>
      <div class="todo-form-row">
        <div class="todo-form-group">
          <label class="todo-form-label" id="lbl-task-status">Status</label>
          <select class="todo-form-input" id="tm-status"></select>
        </div>
        <div class="todo-form-group">
          <label class="todo-form-label" id="lbl-task-priority">Priority</label>
          <select class="todo-form-input" id="tm-priority"></select>
        </div>
      </div>
      <div class="todo-form-group">
        <label class="todo-form-label" id="lbl-task-assignee">Assignees</label>
        <div class="todo-assignee-picker" id="tm-assignee-picker"></div>
      </div>
      <div class="todo-form-group">
        <label class="todo-form-label" id="lbl-task-duedate">Due Date</label>
        <input class="todo-form-input" type="date" id="tm-duedate" />
      </div>
    </div>
    <div class="todo-modal-footer">
      <button class="todo-btn-secondary" id="task-modal-cancel">Cancel</button>
      <button class="todo-btn-primary"   id="task-modal-save">Create</button>
    </div>
  </div>
</div>

<!-- ══ TASK DETAIL MODAL ══ -->
<div id="task-detail-modal" class="todo-modal-overlay" style="display:none">
  <div class="todo-detail-modal">
    <div class="todo-detail-header">
      <div class="todo-detail-header-left">
        <span class="todo-detail-status-badge" id="td-status-badge"></span>
      </div>
      <div class="todo-detail-header-right">
        <button class="todo-detail-edit-btn" id="td-edit-btn">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          <span id="td-edit-label">Edit</span>
        </button>
        <button class="todo-modal-close" id="task-detail-close">✕</button>
      </div>
    </div>

    <div class="todo-detail-body">
      <!-- LEFT: main content -->
      <div class="todo-detail-left">
        <h2 class="todo-detail-title" id="td-title"></h2>

        <div class="todo-detail-section">
          <p class="todo-detail-section-label" id="td-lbl-desc">Description</p>
          <p class="todo-detail-desc" id="td-desc"></p>
        </div>
      </div>

      <!-- RIGHT: meta info -->
      <div class="todo-detail-right">
        <p class="todo-detail-meta-heading" id="td-lbl-details">Details</p>

        <div class="todo-detail-meta-row">
          <span class="todo-detail-meta-key" id="td-lbl-status">Status</span>
          <span id="td-meta-status"></span>
        </div>
        <div class="todo-detail-meta-row">
          <span class="todo-detail-meta-key" id="td-lbl-priority">Priority</span>
          <span id="td-meta-priority"></span>
        </div>
        <div class="todo-detail-meta-row">
          <span class="todo-detail-meta-key" id="td-lbl-duedate">Due Date</span>
          <span id="td-meta-duedate"></span>
        </div>
        <div class="todo-detail-meta-row">
          <span class="todo-detail-meta-key" id="td-lbl-assignees">Assignees</span>
          <div class="todo-detail-assignees" id="td-meta-assignees"></div>
        </div>
        <div class="todo-detail-meta-row">
          <span class="todo-detail-meta-key" id="td-lbl-created">Created</span>
          <span class="todo-detail-meta-val" id="td-meta-created"></span>
        </div>
        <div class="todo-detail-meta-row">
          <span class="todo-detail-meta-key" id="td-lbl-createdby">Author</span>
          <span class="todo-detail-meta-val" id="td-meta-createdby"></span>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ══ NO PROJECT MODAL ══ -->
<div id="no-project-modal" class="todo-modal-overlay" style="display:none">
  <div class="todo-modal" style="max-width:460px;text-align:center;padding:20px">
    <div class="todo-del-icon-wrap" style="background:#fff3cd;border-color:#fcd34d">
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
    <h3 class="todo-del-title" id="noproj-title"></h3>
    <p  class="todo-del-desc"  id="noproj-desc"></p>
    <div class="todo-del-actions">
      <button class="todo-btn-secondary" id="noproj-cancel-btn"></button>
      <button class="todo-btn-primary"   id="noproj-create-btn"></button>
    </div>
  </div>
</div>

<!-- ══ PROJECT MODAL ══ -->
<div id="project-modal" class="todo-modal-overlay" style="display:none">
  <div class="todo-modal" style="max-width:400px">
    <div class="todo-modal-header">
      <h3 id="project-modal-title">${t("new_project")}</h3>
      <button class="todo-modal-close" id="project-modal-close">✕</button>
    </div>
    <div class="todo-modal-body">
      <div class="todo-form-group">
        <label class="todo-form-label" id="lbl-project-name">Project Name</label>
        <input class="todo-form-input" id="pm-name" placeholder="Enter project name..." />
      </div>
    </div>
    <div class="todo-modal-footer">
      <button class="todo-btn-secondary" id="project-modal-cancel">Cancel</button>
      <button class="todo-btn-primary"   id="project-modal-save">Create</button>
    </div>
  </div>
</div>

<!-- ══ DELETE CONFIRM MODAL ══ -->
<div id="todo-del-modal" class="todo-modal-overlay" style="display:none">
  <div class="todo-modal" style="max-width:460px;text-align:center;padding:20px">
    <div class="todo-del-icon-wrap">
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
    <h3 class="todo-del-title" id="del-modal-title"></h3>
    <p  class="todo-del-desc"  id="del-modal-desc"></p>
    <div class="todo-del-actions">
      <button class="todo-btn-secondary" id="del-modal-cancel">Cancel</button>
      <button class="todo-btn-danger"    id="del-modal-confirm">Delete</button>
    </div>
  </div>
</div>
`;

// ─── STATE ────────────────────────────────────────────────────
let currentView = "list";
let currentProjectId = null;
let currentFilter = "all";
let searchQuery = "";
let editingTaskId = null;
let deleteCallback = null;
let dragSrcTask = null;
let selectedAssignees = []; // multi-select state for modal

const $ = (id) => document.getElementById(id);

// ─── ASSIGNEE PICKER ──────────────────────────────────────────
const renderAssigneePicker = () => {
    const picker = $("tm-assignee-picker");
    if (!picker) return;
    const users = getUsers();

    if (!users.length) {
        picker.innerHTML = `<p style="color:#8892a4;font-size:12px;padding:8px 0">${t("no_users_yet") || "No users"}</p>`;
        return;
    }

    picker.innerHTML = users
        .map((u) => {
            const sel = selectedAssignees.includes(u.username);
            return `<div class="todo-assignee-option ${sel ? "PicSelected" : ""}" data-uname="${u.username}">
            ${userAvatarHtml(u, 26)}
            <span>${u.username}</span>
        </div>`;
        })
        .join("");

    picker.querySelectorAll(".todo-assignee-option").forEach((div) => {
        div.addEventListener("click", () => {
            const val = div.dataset.uname;
            if (selectedAssignees.includes(val)) {
                selectedAssignees = selectedAssignees.filter((v) => v !== val);
            } else {
                selectedAssignees.push(val);
            }
            renderAssigneePicker();
        });
    });
};

// ─── PROJECT TABS ─────────────────────────────────────────────
const renderProjectTabs = () => {
    const projects = getProjects();
    const el = $("todo-project-tabs");
    if (!el) return;
    el.innerHTML = projects
        .map(
            (p) => `
        <div class="todo-project-tab ${p.id === currentProjectId ? "active" : ""}" data-pid="${p.id}">
            <span>${p.name}</span>
            <button class="todo-project-tab-del" data-pid="${p.id}">✕</button>
        </div>
    `,
        )
        .join("");

    el.querySelectorAll(".todo-project-tab").forEach((tab) => {
        tab.addEventListener("click", (e) => {
            if (e.target.classList.contains("todo-project-tab-del")) return;
            currentProjectId = tab.dataset.pid;
            renderProjectTabs();
            renderView();
        });
    });
    el.querySelectorAll(".todo-project-tab-del").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            showDeleteConfirm(t("confirm_delete_project"), () => {
                const ps = getProjects().filter((p) => p.id !== btn.dataset.pid);
                saveProjects(ps);
                if (currentProjectId === btn.dataset.pid) currentProjectId = ps[0]?.id || null;
                renderProjectTabs();
                renderView();
            });
        });
    });
};

// ─── RENDER VIEW ──────────────────────────────────────────────
const renderView = () => {
    const projects = getProjects();
    const noProj = $("todo-no-projects");
    const container = $("todo-view-container");
    if (!container) return;

    if (projects.length === 0) {
        if (noProj) {
            noProj.style.display = "flex";
            $("no-projects-msg").textContent = t("no_projects");
        }
        container.innerHTML = "";
        if ($("todo-project-title")) $("todo-project-title").textContent = t("todo_title");
        return;
    }
    if (noProj) noProj.style.display = "none";
    if (!currentProjectId || !projects.find((p) => p.id === currentProjectId)) currentProjectId = projects[0].id;

    const proj = projects.find((p) => p.id === currentProjectId);
    if ($("todo-project-title")) $("todo-project-title").textContent = proj.name;

    // Filter tasks by visibility & status & search
    let tasks = (proj.tasks || []).filter(canSeeTask);
    if (currentFilter !== "all") tasks = tasks.filter((t) => getVisibleStatus(t) === currentFilter);
    if (searchQuery) tasks = tasks.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || (t.desc || "").toLowerCase().includes(searchQuery.toLowerCase()));

    if (currentView === "list") renderListView(tasks, proj);
    else renderBoardView(tasks, proj);
};

// ─── LIST VIEW ────────────────────────────────────────────────
const renderListView = (tasks) => {
    const container = $("todo-view-container");
    if (!container) return;
    const statuses = ["todo", "progress", "done"];
    let html = `<div class="todo-list-view">`;

    statuses.forEach((status) => {
        const statusTasks = tasks.filter((t) => getVisibleStatus(t) === status);
        if (currentFilter !== "all" && currentFilter !== status) return;
        const cfg = statusConfig[status];
        html += `
        <div class="todo-list-section">
          <div class="todo-list-section-header" data-collapse="${status}">
            <div class="todo-section-header-left">
              <svg class="todo-collapse-icon" data-status="${status}" width="12" height="12" fill="none" viewBox="0 0 24 24">
                <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
              <span class="todo-section-label ${cfg.cls}">
                <span class="todo-section-dot ${cfg.cls}"></span>
                ${cfg.label()}
              </span>
              <span class="todo-section-count ${cfg.cls}">${tasks.filter((t) => getVisibleStatus(t) === status).length}</span>
            </div>
            <button class="todo-add-in-section" data-status="${status}">+ ${t("add_task")}</button>
          </div>
          <div class="todo-list-section-body" id="list-section-${status}">
            <div class="todo-list-table-header">
              <span class="todo-col-name">${t("task_name_col")}</span>
              <span class="todo-col-center">${t("assignee")}</span>
              <span class="todo-col-center">${t("due_date")}</span>
              <span class="todo-col-center">${t("priority")}</span>
              <span class="todo-col-center">${t("actions")}</span>
            </div>
            ${statusTasks.length ? statusTasks.map((task) => renderListRow(task)).join("") : `<div class="todo-list-empty">${t("no_tasks")}</div>`}
          </div>
        </div>`;
    });
    html += `</div>`;
    container.innerHTML = html;
    attachListEvents(container);
};

const renderListRow = (task) => {
    const owner = isOwner(task);
    const canEdit = owner;
    const canDel = owner;
    const cu = getCurrent();
    const ids = task.assigneeIds || (task.assigneeId ? [task.assigneeId] : []);
    const myStatus = getVisibleStatus(task);
    const myDone = myStatus === "done";
    // check button: assignee yoki owner (assignee yo'q bo'lsa) ko'radi
    const canCheck = ids.length === 0 || (cu && (ids.includes(cu.username) || isOwner(task)));

    return `
    <div class="todo-list-row todo-row-clickable" data-tid="${task.id}">
      <div class="todo-row-name-cell">
        <button class="todo-check-btn ${myDone ? "checked" : ""}" data-tid="${task.id}" data-action="check">
          ${myDone ? `<svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round"/></svg>` : ""}
        </button>
        <span class="todo-row-title ${myDone ? "done-text" : ""}">${task.title}</span>
      </div>
      <div class="todo-row-center-cell">${assigneeStackHtml(task, 26)}</div>
      <div class="todo-row-center-cell">${dueDateHtml(task.dueDate)}</div>
      <div class="todo-row-center-cell">${getPriorityBadge(task.priority || "none")}</div>
      <div class="todo-row-actions-cell">
        ${
            canEdit
                ? `
        <button class="todo-row-edit todo-action-btn edit" data-tid="${task.id}" data-action="edit" title="${t("edit")}">
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>`
                : ""
        }
        ${
            canDel
                ? `
        <button class="todo-row-del todo-action-btn del" data-tid="${task.id}" data-action="del" title="${t("delete")}">
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>`
                : ""
        }
      </div>
    </div>`;
};

const attachListEvents = (container) => {
    container.querySelectorAll(".todo-list-section-header").forEach((header) => {
        header.addEventListener("click", (e) => {
            if (e.target.closest(".todo-add-in-section")) return;
            const status = header.dataset.collapse;
            const body = $(`list-section-${status}`);
            const icon = container.querySelector(`.todo-collapse-icon[data-status="${status}"]`);
            const hidden = body.style.display === "none";
            body.style.display = hidden ? "block" : "none";
            if (icon) icon.style.transform = hidden ? "rotate(0deg)" : "rotate(-90deg)";
        });
    });
    container.querySelectorAll(".todo-add-in-section").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            openTaskModal(null, btn.dataset.status);
        });
    });
    // Row click → detail modal (if not action button)
    container.querySelectorAll(".todo-row-clickable").forEach((row) => {
        row.addEventListener("click", (e) => {
            const action = e.target.closest("[data-action]");
            if (action) {
                e.stopPropagation();
                const tid = action.dataset.tid;
                const act = action.dataset.action;
                if (act === "edit") openTaskModal(tid);
                if (act === "del") deleteTask(tid);
                if (act === "check") toggleDone(tid);
                return;
            }
            const tid = row.dataset.tid;
            if (tid) openDetailModal(tid);
        });
    });
};

// ─── BOARD VIEW ───────────────────────────────────────────────
const renderBoardView = (tasks, proj) => {
    const container = $("todo-view-container");
    if (!container) return;
    const columns = [
        { key: "todo", label: t("col_todo") },
        { key: "progress", label: t("col_progress") },
        { key: "done", label: t("col_done") },
    ];
    const all = (proj.tasks || []).filter(canSeeTask);
    let html = `<div class="todo-board-wrap">`;
    columns.forEach((col) => {
        const colTasks = tasks.filter((t) => getVisibleStatus(t) === col.key);
        const cfg = statusConfig[col.key];
        html += `
        <div class="todo-board-col" data-col="${col.key}">
          <div class="todo-board-col-header">
            <div class="todo-board-col-title">
              <span class="todo-board-col-dot ${cfg.cls}"></span>
              <span class="todo-board-col-label ${cfg.cls}">${col.label}</span>
              <span class="todo-board-col-count ${cfg.cls}">${all.filter((t) => getVisibleStatus(t) === col.key).length}</span>
            </div>
            <button class="todo-board-add-btn" data-col="${col.key}">+</button>
          </div>
          <div class="todo-board-col-body" id="board-col-${col.key}" data-col="${col.key}">
            ${colTasks.length ? colTasks.map((task) => renderBoardCard(task)).join("") : `<div class="todo-board-empty">${t("empty_column")}</div>`}
          </div>
        </div>`;
    });
    html += `</div>`;
    container.innerHTML = html;

    container.querySelectorAll(".todo-board-add-btn").forEach((btn) => {
        btn.addEventListener("click", () => openTaskModal(null, btn.dataset.col));
    });
    container.querySelectorAll(".todo-board-card").forEach((card) => {
        card.addEventListener("click", (e) => {
            const action = e.target.closest("[data-action]");
            if (action) {
                e.stopPropagation();
                const tid = action.dataset.tid;
                const act = action.dataset.action;
                if (act === "edit") openTaskModal(tid);
                if (act === "del") deleteTask(tid);
                if (act === "check") toggleDone(tid);
                return;
            }
            const tid = card.dataset.tid;
            if (tid) openDetailModal(tid);
        });
    });
    initDragDrop();
};

const renderBoardCard = (task) => {
    const owner = isOwner(task);
    const cu = getCurrent();
    const ids = task.assigneeIds || (task.assigneeId ? [task.assigneeId] : []);
    const myStatus = getVisibleStatus(task);
    const myDone = myStatus === "done";
    // Assignee yoki owner — hamma drag qila oladi, check ko'radi
    const canDrag = cu && (ids.includes(cu.username) || ids.length === 0 || owner);

    return `
    <div class="todo-board-card" draggable="${canDrag}" data-tid="${task.id}">
      <div class="todo-card-top">
        <button class="todo-check-btn ${myDone ? "checked" : ""}" data-tid="${task.id}" data-action="check">
          ${myDone ? `<svg width="10" height="10" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round"/></svg>` : ""}
        </button>
        <span class="todo-card-title ${myDone ? "done-text" : ""}">${task.title}</span>
        <div class="todo-card-actions">
          ${
              owner
                  ? `
          <button class="todo-action-btn edit" data-tid="${task.id}" data-action="edit">
            <svg width="11" height="11" fill="none" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
          <button class="todo-action-btn del" data-tid="${task.id}" data-action="del">
            <svg width="11" height="11" fill="none" viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>`
                  : ""
          }
        </div>
      </div>
      ${task.desc ? `<p class="todo-card-desc">${task.desc}</p>` : ""}
      <div class="todo-card-footer">
        <div class="todo-card-footer-left">
          ${getPriorityBadge(task.priority || "none")}
          ${dueDateHtml(task.dueDate)}
        </div>
        ${assigneeStackHtml(task, 24)}
      </div>
    </div>`;
};

// ─── DRAG & DROP ──────────────────────────────────────────────
const initDragDrop = () => {
    document.querySelectorAll(".todo-board-card[draggable='true']").forEach((card) => {
        card.addEventListener("dragstart", (e) => {
            dragSrcTask = card.dataset.tid;
            card.style.opacity = "0.5";
            e.dataTransfer.effectAllowed = "move";
        });
        card.addEventListener("dragend", () => {
            card.style.opacity = "1";
            dragSrcTask = null;
        });
    });
    document.querySelectorAll(".todo-board-col-body").forEach((col) => {
        col.addEventListener("dragover", (e) => {
            e.preventDefault();
            col.classList.add("drag-over");
        });
        col.addEventListener("dragleave", () => col.classList.remove("drag-over"));
        col.addEventListener("drop", (e) => {
            e.preventDefault();
            col.classList.remove("drag-over");
            if (!dragSrcTask) return;
            const ps = getProjects();
            const p = ps.find((p) => p.id === currentProjectId);
            const cu = getCurrent();
            if (p && cu) {
                const task = (p.tasks || []).find((t) => t.id === dragSrcTask);
                if (!task) return;
                const ids = task.assigneeIds || (task.assigneeId ? [task.assigneeId] : []);
                const newCol = col.dataset.col;
                if (ids.length > 0 && ids.includes(cu.username)) {
                    // Assignee — faqat o'z userStatus ini o'zgartiradi
                    if (!task.userStatus) task.userStatus = {};
                    task.userStatus[cu.username] = newCol;
                    recalcGlobalStatus(task);
                } else {
                    // Owner yoki assignee yo'q — global status
                    task.status = newCol;
                }
                saveProjects(ps);
                renderView();
            }
        });
    });
};

// ─── TASK ACTIONS ─────────────────────────────────────────────
const toggleDone = (tid) => {
    const ps = getProjects();
    const p = ps.find((p) => p.id === currentProjectId);
    if (!p) return;
    const task = (p.tasks || []).find((t) => t.id === tid);
    if (!task) return;

    const cu = getCurrent();
    const ids = task.assigneeIds || (task.assigneeId ? [task.assigneeId] : []);

    if (!cu) return;

    if (ids.length === 0) {
        // Assignee yo'q — global toggle
        task.status = task.status === "done" ? "todo" : "done";
        saveProjects(ps);
        renderView();
        return;
    }

    // Assignee — faqat o'z userStatus ini toggle qiladi (done <-> todo)
    if (ids.includes(cu.username)) {
        if (!task.userStatus) task.userStatus = {};
        const cur = task.userStatus[cu.username] || "todo";
        task.userStatus[cu.username] = cur === "done" ? "todo" : "done";
        recalcGlobalStatus(task);
        saveProjects(ps);
        renderView();
        return;
    }

    // Owner (assigneega kirmaydi) — global toggle
    if (isOwner(task) && !ids.includes(cu.username)) {
        task.status = task.status === "done" ? "todo" : "done";
        saveProjects(ps);
        renderView();
    }
};

// ─── NO-PROJECT MODAL ────────────────────────────────────────
const showNoProjectModal = () => {
    $("noproj-title").textContent = t("no_projects_title");
    $("noproj-desc").textContent = t("no_projects_desc");
    $("noproj-create-btn").textContent = t("add_project");
    $("noproj-cancel-btn").textContent = t("cancel");
    $("no-project-modal").style.display = "flex";
};

const deleteTask = (tid) => {
    showDeleteConfirm(t("confirm_delete_task"), () => {
        const ps = getProjects();
        const p = ps.find((p) => p.id === currentProjectId);
        if (p) {
            p.tasks = (p.tasks || []).filter((t) => t.id !== tid);
            saveProjects(ps);
        }
        renderView();
    });
};

// ─── TASK CREATE / EDIT MODAL ─────────────────────────────────
const openTaskModal = (taskId, defaultStatus = "todo") => {
    editingTaskId = taskId || null;
    const users = getUsers();
    const projects = getProjects();
    const proj = projects.find((p) => p.id === currentProjectId);
    const task = taskId ? (proj?.tasks || []).find((t) => t.id === taskId) : null;

    $("task-modal-title").textContent = task ? t("modal_edit_task") : t("modal_create_task");
    $("lbl-task-name").textContent = t("task_label");
    $("lbl-task-desc").textContent = t("description_label");
    $("lbl-task-status").textContent = t("status_label");
    $("lbl-task-priority").textContent = t("priority_label");
    $("lbl-task-assignee").textContent = t("assignee_label");
    $("lbl-task-duedate").textContent = t("duedate_label");
    $("task-modal-cancel").textContent = t("cancel");
    $("task-modal-save").textContent = task ? t("save") : t("create");

    $("tm-status").innerHTML = `
        <option value="todo">${t("status_todo")}</option>
        <option value="progress">${t("status_progress")}</option>
        <option value="done">${t("status_done")}</option>`;
    $("tm-priority").innerHTML = `
        <option value="none">${t("priority_none")}</option>
        <option value="low">${t("priority_low")}</option>
        <option value="medium">${t("priority_medium")}</option>
        <option value="high">${t("priority_high")}</option>
        <option value="urgent">${t("priority_urgent")}</option>`;

    // Init selected assignees
    selectedAssignees = task?.assigneeIds || (task?.assigneeId ? [task.assigneeId] : []);
    renderAssigneePicker();

    $("tm-title").value = task?.title || "";
    $("tm-desc").value = task?.desc || "";
    $("tm-status").value = task?.status || defaultStatus;
    $("tm-priority").value = task?.priority || "none";
    $("tm-duedate").value = task?.dueDate || "";

    $("tm-title").placeholder = t("task_title_placeholder");
    $("tm-desc").placeholder = t("task_desc_placeholder");
    $("task-modal").style.display = "flex";
    setTimeout(() => $("tm-title").focus(), 100);
};

const saveTask = () => {
    const title = $("tm-title").value.trim();
    if (!title) {
        $("tm-title").style.borderColor = "#ef4444";
        return;
    }
    $("tm-title").style.borderColor = "";

    const ps = getProjects();
    const p = ps.find((p) => p.id === currentProjectId);
    if (!p) return;
    const cu = getCurrent();

    if (editingTaskId) {
        const task = (p.tasks || []).find((t) => t.id === editingTaskId);
        if (task) {
            task.title = title;
            task.desc = $("tm-desc").value.trim();
            task.status = $("tm-status").value;
            task.priority = $("tm-priority").value;
            task.assigneeIds = [...selectedAssignees];
            task.dueDate = $("tm-duedate").value || null;
        }
    } else {
        if (!p.tasks) p.tasks = [];
        p.tasks.push({
            id: genId(),
            title,
            desc: $("tm-desc").value.trim(),
            status: $("tm-status").value,
            priority: $("tm-priority").value,
            assigneeIds: [...selectedAssignees],
            dueDate: $("tm-duedate").value || null,
            createdAt: new Date().toISOString(),
            createdBy: cu?.username || null,
        });
    }
    saveProjects(ps);
    $("task-modal").style.display = "none";
    renderView();
};

// ─── TASK DETAIL MODAL ────────────────────────────────────────
const openDetailModal = (tid) => {
    const projects = getProjects();
    const proj = projects.find((p) => p.id === currentProjectId);
    if (!proj) return;
    const task = (proj.tasks || []).find((t) => t.id === tid);
    if (!task) return;

    const users = getUsers();
    const owner = isOwner(task);
    const cfg = statusConfig[task.status] || statusConfig.todo;
    const pcfg = priorityConfig[task.priority] || priorityConfig.none;
    const ids = task.assigneeIds || (task.assigneeId ? [task.assigneeId] : []);

    $("td-status-badge").className = `todo-detail-status-badge s-${task.status}`;
    $("td-status-badge").textContent = cfg.label();
    $("td-title").textContent = task.title;
    $("td-desc").textContent = task.desc || (currentLang === "uz" ? "Tavsif yo'q" : currentLang === "ru" ? "Нет описания" : "No description");

    // Labels
    $("td-lbl-desc").textContent = t("description_label");
    $("td-lbl-details").textContent = currentLang === "uz" ? "Ma'lumotlar" : currentLang === "ru" ? "Сведения" : "Details";
    $("td-lbl-status").textContent = t("status_label");
    $("td-lbl-priority").textContent = t("priority_label");
    $("td-lbl-duedate").textContent = t("duedate_label");
    $("td-lbl-assignees").textContent = t("assignee_label");
    $("td-lbl-created").textContent = t("create_time");
    $("td-lbl-createdby").textContent = currentLang === "uz" ? "Muallif" : currentLang === "ru" ? "Автор" : "Author";
    $("td-edit-label").textContent = t("edit");

    // Meta
    $("td-meta-status").innerHTML = `<span class="todo-detail-status-badge s-${task.status}">${cfg.label()}</span>`;
    $("td-meta-priority").innerHTML = getPriorityBadge(task.priority || "none");
    $("td-meta-duedate").innerHTML = dueDateHtml(task.dueDate);
    $("td-meta-created").textContent = task.createdAt ? new Date(task.createdAt).toLocaleString() : "—";
    $("td-meta-createdby").textContent = task.createdBy || "—";

    // Assignees — har birining completion holati ko'rsatiladi
    $("td-meta-assignees").innerHTML = ids.length
        ? ids
              .map((id) => {
                  const u = users.find((u) => u.username === id);
                  const done = task.userStatus?.[id] === "done";
                  const isCu = getCurrent()?.username === id;
                  return `
            <div class="todo-detail-assignee-item ${done ? "assignee-done" : ""}" data-uid="${id}">
              ${userAvatarHtml(u, 26)}
              <span class="assignee-name ${done ? "assignee-name-done" : ""}">${u?.username || id}</span>
              ${done ? `<svg width="14" height="14" fill="none" viewBox="0 0 24 24" style="margin-left:auto;flex-shrink:0"><path d="M5 13l4 4L19 7" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round"/></svg>` : `<span style="margin-left:auto;font-size:10px;color:#c0c7d4;flex-shrink:0">${isCu ? "…" : ""}</span>`}
            </div>`;
              })
              .join("")
        : `<span style="color:#8892a4;font-size:12px">—</span>`;

    // Edit button visibility
    const editBtn = $("td-edit-btn");
    editBtn.style.display = owner ? "flex" : "none";
    editBtn.onclick = () => {
        $("task-detail-modal").style.display = "none";
        openTaskModal(tid);
    };

    $("task-detail-modal").style.display = "flex";
};

// ─── DELETE CONFIRM ───────────────────────────────────────────
const showDeleteConfirm = (msg, cb) => {
    deleteCallback = cb;
    $("del-modal-title").textContent = t("delete") + "?";
    $("del-modal-desc").textContent = msg;
    $("del-modal-cancel").textContent = t("cancel");
    $("del-modal-confirm").textContent = t("delete");
    $("todo-del-modal").style.display = "flex";
};

// ─── TRANSLATE UI ─────────────────────────────────────────────
const translateUI = () => {
    const el = (id, txt) => {
        const e = $(id);
        if (e) e.textContent = txt;
    };
    const ph = (id, txt) => {
        const e = $(id);
        if (e) e.placeholder = txt;
    };
    el("tab-list-label", t("list_view"));
    el("tab-board-label", t("board_view"));
    el("todo-add-project-label", t("add_project"));
    el("todo-add-task-label", t("add_task"));
    ph("todo-search", t("search_tasks"));
    ph("tm-title", t("task_title_placeholder"));
    ph("tm-desc", t("task_desc_placeholder"));
    ph("pm-name", t("project_name_placeholder"));
    el("filter-all", t("filter_all"));
    el("filter-todo", t("filter_todo"));
    el("filter-progress", t("filter_progress"));
    el("filter-done", t("filter_done"));
    if ($("lbl-project-name")) $("lbl-project-name").textContent = t("project_label");
    if ($("project-modal-cancel")) $("project-modal-cancel").textContent = t("cancel");
    if ($("project-modal-save")) $("project-modal-save").textContent = t("create");
    if ($("no-projects-msg")) $("no-projects-msg").textContent = t("no_projects");
    // No-project modal
    if ($("noproj-title")) $("noproj-title").textContent = t("no_projects_title");
    if ($("noproj-desc")) $("noproj-desc").textContent = t("no_projects_desc");
    if ($("noproj-create-btn")) $("noproj-create-btn").textContent = t("add_project");
    if ($("noproj-cancel-btn")) $("noproj-cancel-btn").textContent = t("cancel");
};

// ─── INIT ─────────────────────────────────────────────────────
export const initTodoLogic = () => {
    currentLang = localStorage.getItem("language") || "uz";
    translateUI();

    // NO default sample data — bo'sh boshlanadi
    if (getProjects().length === 0) {
        // faqat bo'sh holat, sample data yo'q
        currentProjectId = null;
    } else {
        currentProjectId = getProjects()[0].id;
    }

    renderProjectTabs();
    renderView();

    // View tabs
    $("tab-list")?.addEventListener("click", () => {
        currentView = "list";
        $("tab-list").classList.add("active");
        $("tab-board").classList.remove("active");
        renderView();
    });
    $("tab-board")?.addEventListener("click", () => {
        currentView = "board";
        $("tab-board").classList.add("active");
        $("tab-list").classList.remove("active");
        renderView();
    });

    // Filters
    document.querySelectorAll(".todo-filter-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            currentFilter = btn.dataset.filter;
            document.querySelectorAll(".todo-filter-btn").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            renderView();
        });
    });

    // Search
    $("todo-search")?.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        renderView();
    });

    // Create task
    $("todo-create-task-btn")?.addEventListener("click", () => {
        if (!currentProjectId) {
            showNoProjectModal();
            return;
        }
        openTaskModal(null);
    });

    // Add project
    $("todo-add-project-btn")?.addEventListener("click", () => {
        $("pm-name").value = "";
        $("pm-name").placeholder = t("project_name_placeholder");
        $("project-modal").style.display = "flex";
        setTimeout(() => $("pm-name").focus(), 100);
    });
    $("project-modal-save")?.addEventListener("click", () => {
        const name = $("pm-name").value.trim();
        if (!name) {
            $("pm-name").style.borderColor = "#ef4444";
            return;
        }
        $("pm-name").style.borderColor = "";
        const ps = getProjects();
        const newP = { id: genId(), name, tasks: [] };
        ps.push(newP);
        saveProjects(ps);
        currentProjectId = newP.id;
        $("project-modal").style.display = "none";
        renderProjectTabs();
        renderView();
    });
    const closeProjModal = () => ($("project-modal").style.display = "none");
    $("project-modal-cancel")?.addEventListener("click", closeProjModal);
    $("project-modal-close")?.addEventListener("click", closeProjModal);
    $("project-modal")?.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) closeProjModal();
    });

    // Task modal
    $("task-modal-save")?.addEventListener("click", saveTask);
    const closeTaskModal = () => ($("task-modal").style.display = "none");
    $("task-modal-cancel")?.addEventListener("click", closeTaskModal);
    $("task-modal-close")?.addEventListener("click", closeTaskModal);
    $("task-modal")?.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) closeTaskModal();
    });
    $("tm-title")?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") saveTask();
    });

    // Detail modal
    const closeDetailModal = () => ($("task-detail-modal").style.display = "none");
    $("task-detail-close")?.addEventListener("click", closeDetailModal);
    $("task-detail-modal")?.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) closeDetailModal();
    });

    // Delete modal
    $("del-modal-confirm")?.addEventListener("click", () => {
        if (deleteCallback) {
            deleteCallback();
            deleteCallback = null;
        }
        $("todo-del-modal").style.display = "none";
    });

    // No-project modal
    $("noproj-cancel-btn")?.addEventListener("click", () => ($("no-project-modal").style.display = "none"));
    $("no-project-modal")?.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) e.currentTarget.style.display = "none";
    });
    $("noproj-create-btn")?.addEventListener("click", () => {
        $("no-project-modal").style.display = "none";
        $("pm-name").value = "";
        $("project-modal").style.display = "flex";
        setTimeout(() => $("pm-name").focus(), 100);
    });
    $("del-modal-cancel")?.addEventListener("click", () => ($("todo-del-modal").style.display = "none"));
    $("todo-del-modal")?.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) e.currentTarget.style.display = "none";
    });
};
