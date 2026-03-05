
const getUsers = () => JSON.parse(localStorage.getItem("users")) || [];
const saveUsers = (users) => localStorage.setItem("users", JSON.stringify(users));
const getCurrentUser = () => JSON.parse(localStorage.getItem("currentUser"));

// ─── HTML TEMPLATE ─────────────────────────────────────────────
export const BusinessPage = `
<div class="biz-root">

  <!-- TOP STATS -->
  <div class="biz-header">
    <div>
      <p class="biz-greeting">Hi <span id="biz-username">User</span>,</p>
      <h1 class="biz-welcome">Welcome to System!</h1>
    </div>
    <div class="biz-search">
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" stroke="#aaa" stroke-width="2"/><path d="M21 21l-4.35-4.35" stroke="#aaa" stroke-width="2" stroke-linecap="round"/></svg>
      <input type="text" placeholder="Search clients..." id="biz-search-input" />
    </div>
  </div>

  <div class="biz-stats-row">
    <div class="biz-stat-card">
      <div class="biz-stat-icon waiting-icon">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 8v4l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/></svg>
      </div>
      <div>
        <p class="biz-stat-label">Waiting to pay</p>
        <p class="biz-stat-value" id="stat-waiting">$0</p>
      </div>
    </div>
    <div class="biz-stat-card">
      <div class="biz-stat-icon paid-icon">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div>
        <p class="biz-stat-label">Already paid</p>
        <p class="biz-stat-value" id="stat-paid">$0</p>
      </div>
    </div>
    <div class="biz-stat-card">
      <div class="biz-stat-icon clients-icon">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </div>
      <div>
        <p class="biz-stat-label">Clients</p>
        <p class="biz-stat-value" id="stat-clients">0</p>
      </div>
    </div>
    <div class="biz-stat-card biz-stat-accent">
      <div class="biz-stat-icon account-icon">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="M16 3H8L2 7h20l-6-4z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
      </div>
      <div>
        <p class="biz-stat-label" style="color:rgba(255,255,255,0.75)">Account Balance</p>
        <p class="biz-stat-value" id="stat-balance" style="color:#fff">$0</p>
      </div>
    </div>
  </div>

  <!-- TABS -->
  <div class="biz-tabs">
    <button class="biz-tab active" data-tab="clients">Clients</button>
    <button class="biz-tab" data-tab="payments">Payments</button>
    <button class="biz-tab" data-tab="cards">Cards & Accounts</button>
  </div>

  <!-- TAB CONTENTS -->
  <div class="biz-tab-content" id="biz-tab-clients">
    <div class="biz-table-header">
      <span>User</span>
      <span>Total payments</span>
      <span>Total paid</span>
      <span>Payment Location</span>
      <span>Home Address</span>
      <span></span>
    </div>
    <div id="clients-list"></div>
    <div class="biz-pagination">
      <span id="clients-page-info">1–5 of 0 items</span>
      <div class="biz-page-btns">
        <button id="clients-prev">&#8249;</button>
        <span id="clients-page-num">1</span>
        <button id="clients-next">&#8250;</button>
      </div>
    </div>
  </div>

  <div class="biz-tab-content" id="biz-tab-payments" style="display:none">
    <div class="biz-table-header payments-header">
      <span>Recipient</span>
      <span>Amount</span>
      <span>Date</span>
      <span>Method</span>
      <span>Status</span>
      <span>Action</span>
    </div>
    <div id="payments-list"></div>
  </div>

  <div class="biz-tab-content" id="biz-tab-cards" style="display:none">
    <div class="biz-cards-grid" id="cards-grid"></div>
    <div style="margin-top:20px; display:flex; gap:12px; flex-wrap:wrap; padding: 0 20px 20px;">
      <button class="biz-btn-primary" id="add-card-btn">+ Add Card</button>
      <button class="biz-btn-secondary" id="add-account-btn">+ Add Bank Account</button>
    </div>
  </div>

</div>

<!-- ── SEND PAYMENT DRAWER ─────────────────────── -->
<div id="send-drawer-overlay" class="biz-drawer-overlay" style="display:none">
  <div class="biz-drawer">
    <div class="biz-drawer-header">
      <div>
        <h3>Fund Wallet</h3>
        <p>To fund wallet provide the details below</p>
      </div>
      <button class="biz-drawer-close" id="close-drawer">&#10005;</button>
    </div>
    <div class="biz-drawer-balance">
      Wallet Balance
      <span id="drawer-balance">$0</span>
    </div>
    <label class="biz-label">Recipient</label>
    <div id="drawer-recipient-info" class="biz-recipient-chip"></div>
    <label class="biz-label">Amount</label>
    <input class="biz-input" type="number" id="drawer-amount" placeholder="Enter Amount" />
    <label class="biz-label">Payment Method</label>
    <select class="biz-input" id="drawer-method">
      <option value="">— select method —</option>
    </select>
    <label class="biz-label">Description</label>
    <textarea class="biz-input" id="drawer-desc" rows="3" placeholder="Write a description..."></textarea>
    <button class="biz-btn-primary" id="drawer-proceed" style="width:100%;margin-top:10px">PROCEED</button>
    <p class="biz-drawer-error" id="drawer-error"></p>
  </div>
</div>

<!-- ── ADD CARD MODAL ─────────────────────────── -->
<div id="card-modal-overlay" class="biz-modal-overlay" style="display:none">
  <div class="biz-modal">
    <h3 id="card-modal-title">Add New Card</h3>
    <label class="biz-label">Card Number</label>
    <input class="biz-input" id="cm-number" placeholder="1234 5678 9012 3456" maxlength="19" />
    <label class="biz-label">Card Holder</label>
    <input class="biz-input" id="cm-holder" placeholder="Full Name" />
    <div style="display:flex;gap:12px">
      <div style="flex:1"><label class="biz-label">Expiry (MM/YY)</label><input class="biz-input" id="cm-expiry" placeholder="05/27" maxlength="5" /></div>
      <div style="flex:1"><label class="biz-label">Balance ($)</label><input class="biz-input" type="number" id="cm-balance" placeholder="0" /></div>
    </div>
    <div style="display:flex;gap:10px;margin-top:16px">
      <button class="biz-btn-secondary" id="card-modal-cancel" style="flex:1">Cancel</button>
      <button class="biz-btn-primary" id="card-modal-save" style="flex:1">Save</button>
    </div>
  </div>
</div>

<!-- ── ADD BANK ACCOUNT MODAL ─────────────────── -->
<div id="bank-modal-overlay" class="biz-modal-overlay" style="display:none">
  <div class="biz-modal">
    <h3>Add Bank Account</h3>
    <label class="biz-label">Account Number</label>
    <input class="biz-input" id="bm-number" placeholder="0123456789" />
    <label class="biz-label">Bank Name</label>
    <input class="biz-input" id="bm-bank" placeholder="e.g. Kapital Bank" />
    <label class="biz-label">Beneficiary Name</label>
    <input class="biz-input" id="bm-name" placeholder="Full Name" />
    <label class="biz-label">Balance ($)</label>
    <input class="biz-input" type="number" id="bm-balance" placeholder="0" />
    <div style="display:flex;gap:10px;margin-top:16px">
      <button class="biz-btn-secondary" id="bank-modal-cancel" style="flex:1">Cancel</button>
      <button class="biz-btn-primary" id="bank-modal-save" style="flex:1">Save</button>
    </div>
  </div>
</div>

<!-- ── ADD CLIENT MODAL ───────────────────────── -->
<div id="client-modal-overlay" class="biz-modal-overlay" style="display:none">
  <div class="biz-modal">
    <h3 id="client-modal-title">Add / Edit Client</h3>
    <input type="hidden" id="client-modal-idx" value="" />
    <label class="biz-label">Full Name</label>
    <input class="biz-input" id="client-name" placeholder="Sierra Ferguson" />
    <label class="biz-label">Phone</label>
    <input class="biz-input" id="client-phone" placeholder="+998 99 123 45 67" />
    <label class="biz-label">Home Address</label>
    <input class="biz-input" id="client-address" placeholder="Tashkent, Uzbekistan" />
    <div style="display:flex;gap:10px;margin-top:16px">
      <button class="biz-btn-secondary" id="client-modal-cancel" style="flex:1">Cancel</button>
      <button class="biz-btn-primary" id="client-modal-save" style="flex:1">Save</button>
    </div>
  </div>
</div>
`;

// ─── HELPERS ───────────────────────────────────────────────────
const fmt = (n) => "$" + Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const initials = (name = "") =>
    name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();

// ─── STATS ─────────────────────────────────────────────────────
const refreshStats = (currentUser) => {
    const users = getUsers();
    const me = users.find((u) => u.username === currentUser?.username);
    if (!me) return;

    const allPayments = me.payments || [];
    const waiting = allPayments.filter((p) => p.status === "waiting").reduce((s, p) => s + Number(p.amount), 0);
    const paid = allPayments.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);
    const clients = (me.clients || []).length;
    const methods = me.paymentMethods || [];
    const balance = methods.reduce((s, m) => s + Number(m.balance || 0), 0);

    document.getElementById("stat-waiting").textContent = fmt(waiting);
    document.getElementById("stat-paid").textContent = fmt(paid);
    document.getElementById("stat-clients").textContent = clients;
    document.getElementById("stat-balance").textContent = fmt(balance);
    document.getElementById("biz-username").textContent = me.username || "User";

    const drawer = document.getElementById("drawer-balance");
    if (drawer) drawer.textContent = fmt(balance);
};

// ─── CLIENTS TAB ───────────────────────────────────────────────
const PAGE_SIZE = 5;
let clientPage = 1;
let filteredClients = [];

const renderClients = (currentUser, query = "") => {
    const users = getUsers();
    const me = users.find((u) => u.username === currentUser?.username);
    const clients = me?.clients || [];

    filteredClients = clients.filter((c) => !query || c.name?.toLowerCase().includes(query.toLowerCase()) || c.phone?.includes(query));

    const total = filteredClients.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (clientPage > totalPages) clientPage = totalPages;

    const start = (clientPage - 1) * PAGE_SIZE;
    const slice = filteredClients.slice(start, start + PAGE_SIZE);

    const list = document.getElementById("clients-list");
    if (!list) return;

    list.innerHTML = slice.length
        ? slice
              .map((c, i) => {
                  const realIdx = start + i;
                  const payments = (me?.payments || []).filter((p) => p.recipientName === c.name);
                  const totalP = payments.length;
                  const paidP = payments.filter((p) => p.status === "paid").length;
                  return `
          <div class="biz-table-row">
            <div class="biz-user-cell">
              <div class="biz-avatar">${initials(c.name)}</div>
              <div>
                <p class="biz-user-name">${c.name || "—"}</p>
                <p class="biz-user-phone">${c.phone || "—"}</p>
              </div>
            </div>
            <span style="font-weight:700;color:#1a1d2e">${totalP}</span>
            <span style="font-weight:700;color:#22c55e">${paidP}</span>
            <span class="biz-address-cell">${c.address || "—"}</span>
            <span class="biz-address-cell">${c.address || "—"}</span>
            <div class="biz-row-actions">
              <button class="biz-icon-btn edit" data-ci="${realIdx}" title="Edit">
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <button class="biz-icon-btn del" data-ci="${realIdx}" title="Delete">
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              </button>
            </div>
          </div>`;
              })
              .join("")
        : `<div style="text-align:center;padding:40px;color:#8892a4;font-size:14px">No clients found.</div>`;

    document.getElementById("clients-page-info").textContent = `${start + 1}–${Math.min(start + PAGE_SIZE, total)} of ${total} items`;
    document.getElementById("clients-page-num").textContent = clientPage;

    list.querySelectorAll(".biz-icon-btn.edit").forEach((btn) => {
        btn.onclick = () => openClientModal(currentUser, parseInt(btn.dataset.ci));
    });
    list.querySelectorAll(".biz-icon-btn.del").forEach((btn) => {
        btn.onclick = () => {
            if (!confirm("Delete this client?")) return;
            const us = getUsers();
            const m = us.find((u) => u.username === currentUser?.username);
            if (m) {
                m.clients.splice(parseInt(btn.dataset.ci), 1);
                saveUsers(us);
            }
            renderClients(currentUser, query);
            refreshStats(currentUser);
        };
    });
};

// ─── PAYMENTS TAB ──────────────────────────────────────────────
const renderPayments = (currentUser) => {
    const users = getUsers();
    const me = users.find((u) => u.username === currentUser?.username);
    const payments = me?.payments || [];

    const list = document.getElementById("payments-list");
    if (!list) return;

    list.innerHTML = payments.length
        ? payments
              .slice()
              .reverse()
              .map((p, i) => {
                  const realIdx = payments.length - 1 - i;
                  const isWaiting = p.status === "waiting";
                  return `
          <div class="biz-payments-row">
            <div class="biz-user-cell">
              <div class="biz-avatar">${initials(p.recipientName)}</div>
              <div>
                <p class="biz-user-name">${p.recipientName || "—"}</p>
                <p class="biz-user-phone">${p.method || "—"}</p>
              </div>
            </div>
            <span style="font-weight:700;color:#1a1d2e">${fmt(p.amount)}</span>
            <span style="font-size:12px;color:#8892a4">${p.date || "—"}</span>
            <span style="font-size:12px;color:#5a6279">${p.desc || "—"}</span>
            <span class="${isWaiting ? "biz-badge-waiting" : "biz-badge-paid"}">
              ${isWaiting ? "Waiting" : "Paid"}
            </span>
            <div>
              ${isWaiting ? `<button class="biz-icon-btn send" data-pi="${realIdx}">Send</button>` : `<span style="color:#22c55e;font-size:12px;font-weight:700">✓ Done</span>`}
            </div>
          </div>`;
              })
              .join("")
        : `<div style="text-align:center;padding:40px;color:#8892a4;font-size:14px">No payments yet.</div>`;

    list.querySelectorAll(".biz-icon-btn.send").forEach((btn) => {
        btn.onclick = () => openSendDrawer(currentUser, parseInt(btn.dataset.pi));
    });
};

// ─── CARDS TAB ─────────────────────────────────────────────────
const renderCards = (currentUser) => {
    const users = getUsers();
    const me = users.find((u) => u.username === currentUser?.username);
    const methods = me?.paymentMethods || [];

    const grid = document.getElementById("cards-grid");
    if (!grid) return;

    grid.innerHTML = methods.length
        ? methods
              .map(
                  (m, i) => `
        <div class="biz-card-item ${m.type === "card" ? "card-type" : "bank-type"}">
        <button class="biz-card-del" data-mi="${i}">&#10005;</button>
        <div>
            <p class="biz-card-tag">${m.type === "card" ? "💳 Card" : "🏦 Bank"}</p>
            <p class="biz-card-number">${m.number || "•••• •••• •••• ••••"}</p>
            <p class="biz-card-holder">${m.holder || m.beneficiary || "—"}</p>
        </div>
        <div class="biz-card-meta">
            <p class="biz-card-balance">${fmt(m.balance)}</p>
            <span style="font-size:11px;opacity:0.7">${m.expiry || m.bank || ""}</span>
        </div>
        </div>`,
              )
              .join("")
        : `<div class="biz-empty-cards">No cards or accounts yet. Add one below.</div>`;

    grid.querySelectorAll(".biz-card-del").forEach((btn) => {
        btn.onclick = () => {
            if (!confirm("Remove this payment method?")) return;
            const us = getUsers();
            const m = us.find((u) => u.username === currentUser?.username);
            if (m) {
                m.paymentMethods.splice(parseInt(btn.dataset.mi), 1);
                saveUsers(us);
            }
            renderCards(currentUser);
            refreshStats(currentUser);
        };
    });
};

// ─── SEND DRAWER ───────────────────────────────────────────────
let activePaymentIdx = null;

const openSendDrawer = (currentUser, paymentIdx) => {
    activePaymentIdx = paymentIdx;
    const users = getUsers();
    const me = users.find((u) => u.username === currentUser?.username);
    const payment = me?.payments?.[paymentIdx];
    if (!payment) return;

    document.getElementById("drawer-recipient-info").textContent = payment.recipientName || "—";
    document.getElementById("drawer-amount").value = payment.amount || "";
    document.getElementById("drawer-desc").value = payment.desc || "";
    document.getElementById("drawer-error").textContent = "";

    const methods = me?.paymentMethods || [];
    const sel = document.getElementById("drawer-method");
    sel.innerHTML = `<option value="">— select method —</option>` + methods.map((m, i) => `<option value="${i}">${m.type === "card" ? "💳" : "🏦"} ${m.number || m.bank} (${fmt(m.balance)})</option>`).join("");

    const totalBal = methods.reduce((s, m) => s + Number(m.balance || 0), 0);
    document.getElementById("drawer-balance").textContent = fmt(totalBal);
    document.getElementById("send-drawer-overlay").style.display = "flex";
};

const closeSendDrawer = () => {
    document.getElementById("send-drawer-overlay").style.display = "none";
    activePaymentIdx = null;
};

// ─── CLIENT MODAL ──────────────────────────────────────────────
let editClientIdx = null;

const openClientModal = (currentUser, idx = null) => {
    editClientIdx = idx;
    const users = getUsers();
    const me = users.find((u) => u.username === currentUser?.username);

    document.getElementById("client-modal-title").textContent = idx !== null ? "Edit Client" : "Add Client";

    if (idx !== null && me?.clients?.[idx]) {
        const c = me.clients[idx];
        document.getElementById("client-name").value = c.name || "";
        document.getElementById("client-phone").value = c.phone || "";
        document.getElementById("client-address").value = c.address || "";
    } else {
        document.getElementById("client-name").value = "";
        document.getElementById("client-phone").value = "";
        document.getElementById("client-address").value = "";
    }
    document.getElementById("client-modal-overlay").style.display = "flex";
};

// ─── MAIN INIT ─────────────────────────────────────────────────
export const initBusinessLogic = () => {
    const currentUser = getCurrentUser();

    refreshStats(currentUser);
    renderClients(currentUser);
    renderPayments(currentUser);
    renderCards(currentUser);

    // ── TABS ──
    document.querySelectorAll(".biz-tab").forEach((tab) => {
        tab.onclick = () => {
            document.querySelectorAll(".biz-tab").forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");
            ["clients", "payments", "cards"].forEach((name) => {
                const el = document.getElementById(`biz-tab-${name}`);
                if (el) el.style.display = tab.dataset.tab === name ? "" : "none";
            });
            if (tab.dataset.tab === "payments") renderPayments(currentUser);
            if (tab.dataset.tab === "cards") renderCards(currentUser);
        };
    });

    // ── SEARCH ──
    document.getElementById("biz-search-input")?.addEventListener("input", (e) => {
        clientPage = 1;
        renderClients(currentUser, e.target.value);
    });

    // ── PAGINATION ──
    document.getElementById("clients-prev")?.addEventListener("click", () => {
        if (clientPage > 1) {
            clientPage--;
            renderClients(currentUser);
        }
    });
    document.getElementById("clients-next")?.addEventListener("click", () => {
        const totalPages = Math.ceil(filteredClients.length / PAGE_SIZE);
        if (clientPage < totalPages) {
            clientPage++;
            renderClients(currentUser);
        }
    });

    // ── SEND DRAWER ──
    document.getElementById("close-drawer")?.addEventListener("click", closeSendDrawer);
    document.getElementById("send-drawer-overlay")?.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) closeSendDrawer();
    });

    document.getElementById("drawer-proceed")?.addEventListener("click", () => {
        const errEl = document.getElementById("drawer-error");
        errEl.textContent = "";

        const amount = parseFloat(document.getElementById("drawer-amount").value);
        const methodIdx = parseInt(document.getElementById("drawer-method").value);
        const desc = document.getElementById("drawer-desc").value;

        if (isNaN(amount) || amount <= 0) {
            errEl.textContent = "Enter a valid amount.";
            return;
        }
        if (isNaN(methodIdx)) {
            errEl.textContent = "Select a payment method.";
            return;
        }

        const users = getUsers();
        const me = users.find((u) => u.username === currentUser?.username);
        const method = me?.paymentMethods?.[methodIdx];

        if (!method) {
            errEl.textContent = "Invalid method.";
            return;
        }
        if (Number(method.balance) < amount) {
            errEl.textContent = "Insufficient balance.";
            return;
        }

        method.balance = Number(method.balance) - amount;

        if (activePaymentIdx !== null && me.payments?.[activePaymentIdx]) {
            me.payments[activePaymentIdx].status = "paid";
            me.payments[activePaymentIdx].amount = amount;
            me.payments[activePaymentIdx].desc = desc || me.payments[activePaymentIdx].desc;
            me.payments[activePaymentIdx].date = new Date().toLocaleDateString();
        }

        saveUsers(users);
        refreshStats(currentUser);
        renderPayments(currentUser);
        renderCards(currentUser);
        closeSendDrawer();
    });

    // ── CLIENT MODAL ──
    document.getElementById("client-modal-cancel")?.addEventListener("click", () => {
        document.getElementById("client-modal-overlay").style.display = "none";
    });
    document.getElementById("client-modal-overlay")?.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) e.currentTarget.style.display = "none";
    });
    document.getElementById("client-modal-save")?.addEventListener("click", () => {
        const name = document.getElementById("client-name").value.trim();
        const phone = document.getElementById("client-phone").value.trim();
        const address = document.getElementById("client-address").value.trim();
        if (!name) return alert("Enter client name.");

        const users = getUsers();
        const me = users.find((u) => u.username === currentUser?.username);
        if (!me.clients) me.clients = [];

        if (editClientIdx !== null) {
            me.clients[editClientIdx] = { name, phone, address };
        } else {
            me.clients.push({ name, phone, address });
        }

        saveUsers(users);
        document.getElementById("client-modal-overlay").style.display = "none";
        renderClients(currentUser);
        refreshStats(currentUser);
    });

    // ── CARD MODAL ──
    document.getElementById("add-card-btn")?.addEventListener("click", () => {
        document.getElementById("cm-number").value = "";
        document.getElementById("cm-holder").value = "";
        document.getElementById("cm-expiry").value = "";
        document.getElementById("cm-balance").value = "";
        document.getElementById("card-modal-overlay").style.display = "flex";
    });
    document.getElementById("card-modal-cancel")?.addEventListener("click", () => {
        document.getElementById("card-modal-overlay").style.display = "none";
    });
    document.getElementById("card-modal-overlay")?.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) e.currentTarget.style.display = "none";
    });
    document.getElementById("card-modal-save")?.addEventListener("click", () => {
        const number = document.getElementById("cm-number").value.trim();
        if (!number) return alert("Enter card number.");
        const users = getUsers();
        const me = users.find((u) => u.username === currentUser?.username);
        if (!me.paymentMethods) me.paymentMethods = [];
        me.paymentMethods.push({
            type: "card",
            number,
            holder: document.getElementById("cm-holder").value.trim(),
            expiry: document.getElementById("cm-expiry").value.trim(),
            balance: parseFloat(document.getElementById("cm-balance").value) || 0,
        });
        saveUsers(users);
        document.getElementById("card-modal-overlay").style.display = "none";
        renderCards(currentUser);
        refreshStats(currentUser);
    });

    // ── BANK MODAL ──
    document.getElementById("add-account-btn")?.addEventListener("click", () => {
        document.getElementById("bm-number").value = "";
        document.getElementById("bm-bank").value = "";
        document.getElementById("bm-name").value = "";
        document.getElementById("bm-balance").value = "";
        document.getElementById("bank-modal-overlay").style.display = "flex";
    });
    document.getElementById("bank-modal-cancel")?.addEventListener("click", () => {
        document.getElementById("bank-modal-overlay").style.display = "none";
    });
    document.getElementById("bank-modal-overlay")?.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) e.currentTarget.style.display = "none";
    });
    document.getElementById("bank-modal-save")?.addEventListener("click", () => {
        const number = document.getElementById("bm-number").value.trim();
        if (!number) return alert("Enter account number.");
        const users = getUsers();
        const me = users.find((u) => u.username === currentUser?.username);
        if (!me.paymentMethods) me.paymentMethods = [];
        me.paymentMethods.push({
            type: "bank",
            number,
            bank: document.getElementById("bm-bank").value.trim(),
            beneficiary: document.getElementById("bm-name").value.trim(),
            balance: parseFloat(document.getElementById("bm-balance").value) || 0,
        });
        saveUsers(users);
        document.getElementById("bank-modal-overlay").style.display = "none";
        renderCards(currentUser);
        refreshStats(currentUser);
    });
};
