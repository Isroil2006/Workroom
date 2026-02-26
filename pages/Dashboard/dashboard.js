import { translations } from "../Dashboard/translations.js";

let allTests = JSON.parse(localStorage.getItem("myTests")) || [];
let currentView = localStorage.getItem("currentView") || "dashboard";
let currentTestId = localStorage.getItem("currentTestId") || null;
let currentTab = localStorage.getItem("currentTab") || "basic";

const saveToLocal = () => {
    localStorage.setItem("myTests", JSON.stringify(allTests));
    localStorage.setItem("currentView", currentView);
    localStorage.setItem("currentTestId", currentTestId);
    localStorage.setItem("currentTab", currentTab);
};

let currentLang = localStorage.getItem("language") || "uz";
const t = (key) => translations[currentLang][key] || key;

// 1. DASHBOARD VA ASOSIY STRUKTURA (O'zgarishsiz)
export const DashboardPage = () => {
    return `
        <div class="dashboard-wrapper">
        <div class="dashboard__main-content">
            <div class="total-tests-row">
                <div class="total-test-card">
                    <div class="top"><span class="total-title">${t("total_tests")}</span></div>
                    <div class="bottom"><span style="color: #3f8cff" class="total-count">0</span></div>
                </div>

                <div class="total-test-card">
                    <div class="top"><span class="total-title">${t("active_tests")}</span></div>
                    <div class="bottom"><span style="color: #3f8cff" class="total-count">0</span></div>
                </div>
                
                <div class="total-test-card">
                    <div class="top"><span class="total-title">${t("not_active_tests")}</span></div>
                    <div class="bottom"><span style="color: #3f8cff" class="total-count">0</span></div>
                </div>
            </div>
            <div class="tests"></div>
        </div>
        <div class="dashboard__right-content">
            <div class="dashboard__create-box">
                <span>${t("quick_actions")}</span>
                <button class="btn create-test-btn">${t("create_test")}</button>
            </div>
            <div class="dashboard__liderboard"></div>
        </div>
    </div>

    <div class="modal-overlay" id="modal" style="display:none">
        <div class="modal-content">
            <h3>${t("new_test_name")}</h3>
            <input class="input" type="text" id="test-name-input" placeholder="${t("new_test_input")}">
            <div class="modal-btns">
                <button class="cancel-btn" id="close-modal">${t("new_test_cancel")}</button>
                <button class="add-btn" id="add-test-btn">${t("new_test_btn")}</button>
            </div>
        </div>
    </div>

    <div class="modal-overlay" id="start-test-modal" style="display:none">
        <div class="modal-content">
            <h3 id="start-test-title"></h3>
            <p id="start-test-desc">Savollar soni: 0 ta</p>
            <div class="modal-btns">
                <button class="cancel-btn" id="cancel-start">Cancel</button>
                <button class="add-btn" id="confirm-start">Start</button>
            </div>
        </div>
    </div>

    <div class="modal-overlay" id="result-modal" style="display:none">
        <div class="modal-content result-modal-content">
            <h2>Test Natijasi</h2>
            <div class="result-score-badge">
                <span id="res-score">0</span> ball
            </div>
            <div id="res-details-list" class="res-details-list">
                </div>
            <button class="btn" id="close-res-btn" style="width:100%; margin-top:20px;">Dashboardga qaytish</button>
        </div>
    </div>
    `;
};

// 2. DETAL SAHIFASI
const renderDetailView = (container, testId) => {
    const test = allTests[testId];
    currentView = "detail";
    currentTestId = testId;
    saveToLocal();

    container.innerHTML = `
        <div class="test-detail-wrapper">
            <div class="sidebar">
                <div class="sidebar-top">
                    <div style="display: flex; justify-content: space-between; align-items: center;" >
                        <button class="btn back-to-dash">${t("back_dash")}</button>
                        <div class="custom-select" id="language-selector">
                            <div class="selected">
                                <img src="../assets/images/uzb-flag.png" alt="" />
                                <span>UZ</span>
                            </div>

                            <ul class="options">
                                <li data-value="uz">
                                    <img src="../assets/images/uzb-flag.png" alt="" />
                                    UZ
                                </li>

                                <li data-value="en">
                                    <img src="../assets/images/usa-flag.png" alt="" />
                                    EN
                                </li>

                                <li data-value="ru">
                                    <img src="../assets/images/rus-flag.png" alt="" />
                                    RU
                                </li>
                            </ul>
                        </div>
                    </div>
                    <nav class="nav-wrapper">
                        <div class="nav-item ${currentTab === "basic" ? "active" : ""}" data-tab="basic">${t("basic")}</div>
                        <div class="nav-item ${currentTab === "questions" ? "active" : ""}" data-tab="questions">${t("questions")}</div>
                        <div class="nav-item ${currentTab === "settings" ? "active" : ""}" data-tab="settings">${t("time")}</div>
                    </nav>
                </div>
                <div class="sidebar-bottom">
                    <button class="btn active-btn" id="activate-test-btn" style="background: #22c55e; width: 90%; margin: 10px;">
                        ${t("active_test_btn")}
                    </button>
                </div>
            </div>

            <div class="detail-content" style="flex: 1; padding: 20px;">
                <div id="tab-basic" class="tab-pane" style="display: ${currentTab === "basic" ? "flex" : "none"}">
                    <h2>${t("test_name")}</h2>
                    <input type="text" id="edit-name" value="${test.name || ""}" class="input">
                    <button class="btn save-name">${t("save")}</button></button>
                </div>
                <div id="tab-questions" class="tab-pane" style="display: ${currentTab === "questions" ? "block" : "none"}">
                    <div id="question-list-view">
                        <div class="q-manager-header">
                            <h2>${t("questions")}</h2>
                            <button class="btn add-q-main-btn" id="add-question-btn">${t("add_question")}</button>
                        </div>
                        <div class="created-questions-list"></div>
                    </div>
                    <div id="question-edit-view" style="display:none;"></div>
                </div>
                <div id="tab-settings" class="tab-pane" style="display: ${currentTab === "settings" ? "flex" : "none"}; flex-direction: column;">
                    <h2>${t("time")}</h2>
                    <div class="time-config-box" style="margin-top: 20px; background: #f8fafc; padding: 20px; border-radius: 12px;">
                        <div class="toggle-group" style="margin-bottom: 20px;">
                            <label><input style="margin-right: 5px" type="radio" name="time-limit-toggle" value="unlimited" ${!test.timeLimit ? "checked" : ""}>${t("time_unlimited")}</label>
                            <label style="margin-left: 15px;"><input style="margin-right: 5px" type="radio" name="time-limit-toggle" value="limited" ${test.timeLimit ? "checked" : ""}>${t("time_limited")}</label>
                        </div>
                        <div id="time-input-fields" style="display: ${test.timeLimit ? "flex" : "none"}; gap: 15px;">
                            <div><small>Min</small><br><input type="number" id="min-input" value="${test.minutes || 0}" class="input" style="width: 80px;"></div>
                            <div><small>Sec</small><br><input type="number" id="sec-input" value="${test.seconds || 0}" class="input" style="width: 80px;"></div>
                        </div>
                    </div>
                    <button class="btn save-time-btn">Save Settings</button>
                </div>
            </div>
        </div>
    `;

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

    setupGeneralEvents(container, testId);
    if (currentTab === "questions") renderQuestionList(container, testId);

    // Set Active & Exit tugmasi endi faqat dashboardga qaytaradi
    container.querySelector("#activate-test-btn").onclick = () => {
        if (test.questions.length === 0) return alert("Avval savol qo'shing!");
        test.isActive = true;
        currentView = "dashboard"; // Dashboardga qaytish
        currentTestId = null;
        saveToLocal();
        location.reload();
    };

    const saveNameBtn = container.querySelector(".save-name");
    saveNameBtn.onclick = () => {
        test.name = container.querySelector("#edit-name").value;
        saveToLocal();
        saveNameBtn.style.background = "#22c55e";
        saveNameBtn.innerHTML = "Saved";
        setTimeout(() => {
            saveNameBtn.style.background = "var(--primary-blue)";
            saveNameBtn.innerHTML = "Save";
        }, 1500);
    };

    const timeToggleGroup = container.querySelectorAll('input[name="time-limit-toggle"]');
    const timeInputFields = container.querySelector("#time-input-fields");

    timeToggleGroup.forEach((radio) => {
        radio.onchange = (e) => {
            if (e.target.value === "limited") {
                timeInputFields.style.display = "flex";
            } else {
                timeInputFields.style.display = "none";
            }
        };
    });

    // "Save Settings" tugmasi bosilganda
    const saveTimeBtn = container.querySelector(".save-time-btn");
    if (saveTimeBtn) {
        saveTimeBtn.onclick = () => {
            const isLimited = container.querySelector('input[name="time-limit-toggle"]:checked').value === "limited";
            const minutes = container.querySelector("#min-input").value;
            const seconds = container.querySelector("#sec-input").value;

            test.timeLimit = isLimited;
            test.minutes = parseInt(minutes) || 0;
            test.seconds = parseInt(seconds) || 0;

            saveToLocal();
            saveTimeBtn.style.background = "#22c55e";
            saveTimeBtn.innerHTML = "Settings Saved";
            setTimeout(() => {
                saveTimeBtn.style.background = "var(--primary-blue)";
                saveTimeBtn.innerHTML = "Save Settings";
            }, 1500);
        };
    }
};

// 3. SAVOLLAR RO'YXATINI RENDER QILISH
const renderQuestionList = (container, testId) => {
    const listDiv = container.querySelector(".created-questions-list");
    const test = allTests[testId];
    if (!listDiv) return;
    listDiv.innerHTML = "";

    test.questions.forEach((q, index) => {
        const card = document.createElement("div");
        card.className = "q-item-card";

        // Javoblarni generatsiya qilish
        const answersHTML = q.answers
            .map(
                (ans) => `
            <div class="ans-preview-row ${ans.isCorrect ? "correct-bg" : ""}">
                <span class="q-circle ${ans.isCorrect ? "q-correct-circle" : ""}"></span>
                <span class="ans-preview-text">${ans.text}</span>
            </div>
        `,
            )
            .join("");

        card.innerHTML = `
            <div class="q-item-top">
                <div class="q-item-info">
                    <span class="q-label">Q. ${index + 1}</span>
                    <button class="del-q-btn" data-idx="${index}"><img src="./pages/Dashboard/images/trash.svg" width="18">
                    </button>
                </div>
                
                <div class="q-item-meta">
                    <span class="type-info"><span >${t("type")}</span> ${q.type}</span>
                    <span class="points-info"><span >${t("points")}</span> ${q.score}</span>
                </div>
            </div>
            <div class="q-item-body">
                <p class="q-text-main">${q.text}</p>
                <div class="q-answers-container">
                    ${answersHTML}
                </div>
            </div>
        `;

        // renderQuestionList ichida card yaratilgandan so'ng:
        const delBtn = card.querySelector(".del-q-btn");
        if (delBtn) {
            delBtn.onclick = (e) => {
                e.stopPropagation(); // Kartochka ochilib ketmasligi uchun
                if (confirm("Ushbu savolni rostdan ham o'chirmoqchimisiz?")) {
                    test.questions.splice(index, 1); // Savolni o'chirish
                    saveToLocal();
                    renderQuestionList(container, testId); // Ro'yxatni qayta chizish
                }
            };
        }

        card.onclick = (e) => {
            if (e.target.type !== "checkbox" && !e.target.classList.contains("more-btn")) {
                openQuestionEditor(container, testId, index);
            }
        };
        listDiv.appendChild(card);
    });

    container.querySelector("#add-question-btn").onclick = () => openQuestionEditor(container, testId);
};

// 4. SAVOL TAHRIRLASH ()
const openQuestionEditor = (container, testId, qIndex = null) => {
    const listView = container.querySelector("#question-list-view");
    const editView = container.querySelector("#question-edit-view");
    const test = allTests[testId];

    listView.style.display = "none";
    editView.style.display = "flex";

    const isNew = qIndex === null;
    let qData = isNew ? { text: "", type: "single", answers: [], score: 1, penalty: 0 } : JSON.parse(JSON.stringify(test.questions[qIndex]));

    const renderEditorUI = () => {
        // Textarea matnini saqlab qolamiz (agar u allaqachon DOMda bo'lsa)
        const currentTextInDOM = editView.querySelector("#q-text") ? editView.querySelector("#q-text").value : qData.text;
        qData.text = currentTextInDOM;

        editView.innerHTML = `
            <div class="editor-header">
                <button class="btn-back-q">
                    <img src="./pages/Dashboard/images/back-img.svg" alt="" />
                    ${t("question")}
                    ${qIndex !== null ? qIndex + 1 : test.questions.length + 1}
                </button>
            </div>
            <div class="editor-body">
                <div class="editor-section">
                    <label>${t("question_text")}</label>
                    <textarea id="q-text" class="input q-textarea">${qData.text}</textarea>
                </div>
                <div class="editor-section">
                    <label>${t("ansver_type")}</label>
                    <select id="q-type" class="input">
                        <option value="single" ${qData.type === "single" ? "selected" : ""}>${t("single_choise")}</option>
                        <option value="multiple" ${qData.type === "multiple" ? "selected" : ""}>${t("multiple_choise")}</option>
                        <option value="true-false" ${qData.type === "true-false" ? "selected" : ""}>${t("true_false")}</option>
                    </select>
                </div>
                <div id="answers-wrapper">
                    <h4>${t("ansvers")}</h4>
                    <div id="answers-list"></div>
                    <button class="btn" id="add-ans-btn" style="display: ${qData.type === "true-false" ? "none" : "block"}">${t("add_ansver")}</button>
                </div>
                <div class="score-settings">
                    <div class="input-group">
                        <label>${t("points")}</label>
                        <input type="number" id="q-score" class="input" value="${qData.score}">
                    </div>
                    <div class="input-group">
                        <label>${t("penalty")}</label>
                        <input type="number" id="q-penalty" class="input" value="${qData.penalty}">
                    </div>
                </div>
                <div class="editor-actions">
                    <button class="btn save-q-btn">${t("save")}</button>
                    <button class="btn cancel-q-btn">${t("cancel")}</button>
                </div>
            </div>
        `;

        const ansList = editView.querySelector("#answers-list");
        if (qData.type === "true-false" && qData.answers.length !== 2) {
            qData.answers = [
                { text: "True", isCorrect: true },
                { text: "False", isCorrect: false },
            ];
        }

        qData.answers.forEach((ans, i) => {
            const div = document.createElement("div");
            div.className = "ans-edit-row";
            div.innerHTML = `
                <input type="${qData.type === "multiple" ? "checkbox" : "radio"}" name="correct-ans" ${ans.isCorrect ? "checked" : ""} class="ans-check">
                <input type="text" value="${ans.text}" class="input ans-input-text" ${qData.type === "true-false" ? "readonly" : ""}>
                ${qData.type !== "true-false" ? `<button class="del-ans-btn">X</button>` : ""}
            `;

            div.querySelector(".ans-check").onclick = (e) => {
                if (qData.type !== "multiple") qData.answers.forEach((a) => (a.isCorrect = false));
                qData.answers[i].isCorrect = e.target.checked;
            };

            div.querySelector(".ans-input-text").oninput = (e) => {
                qData.answers[i].text = e.target.value;
            };

            if (qData.type !== "true-false") {
                div.querySelector(".del-ans-btn").onclick = () => {
                    qData.text = editView.querySelector("#q-text").value; // O'chirishdan oldin textni saqlash
                    qData.answers.splice(i, 1);
                    renderEditorUI();
                };
            }
            ansList.appendChild(div);
        });

        editView.querySelector("#q-type").onchange = (e) => {
            qData.text = editView.querySelector("#q-text").value; // Typeni o'zgartirganda textni saqlash
            qData.type = e.target.value;
            if (qData.type === "true-false") {
                qData.answers = [
                    { text: "True", isCorrect: true },
                    { text: "False", isCorrect: false },
                ];
            }
            renderEditorUI();
        };

        editView.querySelector("#add-ans-btn").onclick = () => {
            qData.text = editView.querySelector("#q-text").value; // Javob qo'shganda textni saqlash
            qData.answers.push({ text: "", isCorrect: false });
            renderEditorUI();
        };

        editView.querySelector(".save-q-btn").onclick = () => {
            qData.text = editView.querySelector("#q-text").value;
            qData.score = editView.querySelector("#q-score").value;
            qData.penalty = editView.querySelector("#q-penalty").value;
            if (isNew) test.questions.push(qData);
            else test.questions[qIndex] = qData;
            saveToLocal();
            renderDetailView(container, testId);
        };

        editView.querySelector(".cancel-q-btn").onclick = () => renderDetailView(container, testId);

        const backBtn = editView.querySelector(".btn-back-q");
        if (backBtn) {
            backBtn.onclick = () => {
                listView.style.display = "block";
                editView.style.display = "none";
                renderQuestionList(container, testId);
            };
        }
    };

    renderEditorUI();
};

// Ballarni saqlash va Liderboardni yangilash funksiyasi
const updateLeaderboardData = (score, testId) => {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser) {
        const userIndex = users.findIndex((u) => u.email === currentUser.email);
        if (userIndex !== -1) {
            // Agar foydalanuvchida completedTests bo'lmasa, ochamiz
            if (!users[userIndex].completedTests) users[userIndex].completedTests = [];

            // Tekshiramiz: bu testni avval yechganmi?
            if (!users[userIndex].completedTests.includes(testId)) {
                users[userIndex].totalScore = (users[userIndex].totalScore || 0) + score;
                users[userIndex].completedTests.push(testId); // Testni tugatilganlar ro'yxatiga qo'shish
                localStorage.setItem("users", JSON.stringify(users));
                // LocalStorage dagi currentUserni ham yangilab qo'yamiz
                currentUser.totalScore = users[userIndex].totalScore;
                localStorage.setItem("currentUser", JSON.stringify(currentUser));
            }
        }
    }
};

// Liderboard UI ni chizish
const renderLeaderboardUI = () => {
    const leaderboardDiv = document.querySelector(".dashboard__liderboard");
    if (!leaderboardDiv) return;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    // Ballar bo'yicha saralash (eng yuqori tepada)
    const sortedUsers = users.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0)).slice(0, 5);

    leaderboardDiv.innerHTML = `
        <h3 class="lider-title">
            ${t("lider_board_title")}
            <img src="./pages/Dashboard/images/leaderboard-img.svg" alt="">   
        </h3>
        <div class="lider-list">
            ${sortedUsers
                .map(
                    (u, index) => `
                <div class="lider-item">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-weight: bold; color: #3f8cff;">#${index + 1}</span>
                        <img src="${u.avatar || "./assets/images/User-avatar.png"}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
                        <span style="font-size: 14px;">${u.username}</span>
                    </div>
                    <span style="font-weight: bold; color: #22c55e;">${u.totalScore || 0} ${t("points")}</span>
                </div>
            `,
                )
                .join("")}
        </div>
    `;
};

// 5. ASOSIY LOGIKA
export const initDashboardLogic = () => {
    const container = document.querySelector(".container");

    if (currentView === "detail" && currentTestId !== null) {
        renderDetailView(container, currentTestId);
        return;
    }

    const testsList = document.querySelector(".tests");
    const totalCounts = document.querySelectorAll(".total-count");

    // Statistikani hisoblash
    const activeTests = allTests.filter((t) => t.isActive).length;
    const notActiveTests = allTests.filter((t) => !t.isActive).length;

    if (totalCounts.length >= 3) {
        totalCounts[0].innerText = allTests.length;
        totalCounts[1].innerText = activeTests;
        totalCounts[2].innerText = notActiveTests;
    }

    renderLeaderboardUI();

    // --- CREATE TEST LOGIKASI SHU YERDA ---
    const createBtn = document.querySelector(".create-test-btn");
    const modal = document.getElementById("modal");
    const closeModal = document.getElementById("close-modal");
    const addTestBtn = document.getElementById("add-test-btn");
    const testNameInput = document.getElementById("test-name-input");

    // Modalni ochish
    if (createBtn) {
        createBtn.onclick = () => {
            modal.style.display = "flex";
            testNameInput.value = ""; // Inputni tozalash
            testNameInput.focus();
        };
    }

    // Modalni yopish
    if (closeModal) {
        closeModal.onclick = () => {
            modal.style.display = "none";
        };
    }

    // Yangi test qo'shish
    if (addTestBtn) {
        addTestBtn.onclick = () => {
            const name = testNameInput.value.trim();
            if (!name) return alert("Test nomini kiriting!");

            const newTest = {
                name: name,
                questions: [],
                isActive: false,
                timeLimit: false,
                minutes: 0,
                seconds: 0,
            };

            allTests.push(newTest);
            saveToLocal();

            modal.style.display = "none";
            // Yangi yaratilgan testning tahrirlash sahifasiga o'tamiz
            renderDetailView(container, allTests.length - 1);
        };
    }
    // --------------------------------------

    const updateUI = () => {
        if (!testsList) return;
        testsList.innerHTML = "";
        allTests.forEach((test, index) => {
            const card = document.createElement("div");
            card.className = "test-card-item";
            card.innerHTML = `
                <div>
                    <h4 style="margin: 0; color: var(--primary-blue);">${test.name}</h4>
                    <small style="color: #64748b;">${test.questions.length} ${t("questions")}</small>
                </div>
                ${test.isActive ? `<span style="background: #dcfce7; color: #16a34a; padding: 4px 12px; border-radius: 20px; font-size: 12px;">${t("active")}</span>` : `<span style="background: #FDC748; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 12px;">${t("not_active")}</span>`}
            `;
            card.onclick = () => {
                if (test.isActive) {
                    const startModal = document.getElementById("start-test-modal");
                    document.getElementById("start-test-title").innerText = `Start ${test.name} ?`;
                    document.getElementById("start-test-desc").innerText = `${test.questions.length} questions.`;
                    startModal.style.display = "flex";

                    document.getElementById("confirm-start").onclick = () => {
                        startModal.style.display = "none";
                        renderQuizView(container, index);
                    };
                    document.getElementById("cancel-start").onclick = () => {
                        startModal.style.display = "none";
                    };
                } else {
                    renderDetailView(container, index);
                }
            };
            testsList.appendChild(card);
        });
    };
    updateUI();
};

const renderQuizView = (container, testId) => {
    const test = allTests[testId];
    let totalSeconds = (parseInt(test.minutes) || 0) * 60 + (parseInt(test.seconds) || 0);
    let timeLeft = totalSeconds;
    let currentQ = 0;
    let userAnswers = {};
    let timerInterval = null;

    container.innerHTML = `
        <div class="quiz-wrapper">
            <div class="quiz-header">
                <div class="quiz-info">
                    <h3>${test.name}</h3>
                </div>
                <div id="quiz-timer">
                    <span style="color: var(--primary-blue);">Time:</span> ${test.timeLimit ? "Starting..." : "Unlimited"}
                </div>
                <button class="btn" id="finish-btn" style="background: #3f8cff; color:white; font-weight: 600; padding: 10px 24px; border-radius: 8px;">Finish Test</button>
            </div>

            <div id="quiz-body" style="margin-top: 24px; background: white; padding: 40px; border-radius: 16px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); min-height: 400px;">
            </div>

            <div class="quiz-actions">
                <button class="btn" id="prev-btn" style="background: #f1f5f9; color: #475569; padding: 12px 30px; border-radius: 8px;">Previous</button>
                <button class="btn" id="next-btn" style="background: #3f8cff; color: white; padding: 12px 30px; border-radius: 8px;">Next Question</button>
            </div>
        </div>

        <div class="modal-overlay" id="result-modal" style="display:none; position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1000; justify-content:center; align-items:center;">
            <div class="modal-content result-modal-content" style="background:white; padding:30px; border-radius:15px; max-width:600px; width:90%; max-height: 80vh; overflow-y:auto;">
                <h2>Test Natijasi</h2>
                <div class="result-score-badge" style="font-size: 24px; font-weight:bold; margin: 20px 0; text-align:center;">
                    <span id="res-score">0</span> ball
                </div>
                <div id="res-details-list" class="res-details-list"></div>
                <button class="btn" id="close-res-btn" style="width:100%; margin-top:20px; background:#3f8cff; color:white; padding:12px; border:none; border-radius:8px; cursor:pointer;">Close</button>
            </div>
        </div>
    `;

    // Timer funksiyasi
    if (test.timeLimit) {
        timerInterval = setInterval(() => {
            if (timeLeft <= 0) {
                finishQuizLogic(test, userAnswers, timerInterval);
                return;
            }
            timeLeft--;
            const m = Math.floor(timeLeft / 60);
            const s = timeLeft % 60;
            container.querySelector("#quiz-timer").innerText = `Time: ${m}:${s < 10 ? "0" + s : s}`;
        }, 1000);
    }

    // Savolni chizish funksiyasi
    const renderQ = (idx) => {
        const q = test.questions[idx];
        const body = container.querySelector("#quiz-body");
        if (!q) return;

        body.innerHTML = `
            <div class= "quiz-body-top">
                <span>Question ${idx + 1} of ${test.questions.length}</span>
                <p>Points: ${q.score}</p>
            </div>
            <h2 class="quiz-title" style="">${q.text}</h2>
            <div class="options-container" style="">
                ${q.answers
                    .map((ans, i) => {
                        const isSelected = (userAnswers[idx] || []).includes(i);
                        return `
                        <label style=" border: 2px solid ${isSelected ? "#3f8cff" : "#f1f5f9"}; background: ${isSelected ? "#f0f7ff" : "transparent"}; ">
                            <input type="${q.type === "multiple" ? "checkbox" : "radio"}" 
                                name="quiz-option" 
                                value="${i}" 
                                ${isSelected ? "checked" : ""} 
                                style="width: 20px; height: 20px; accent-color: #3f8cff;">
                            <span style="font-size: 1.1rem; color: #334155;">${ans.text}</span>
                        </label>
                    `;
                    })
                    .join("")}
            </div>
        `;

        // Input o'zgarganda javobni saqlash
        body.querySelectorAll('input[name="quiz-option"]').forEach((inp) => {
            inp.onchange = () => {
                const checked = Array.from(body.querySelectorAll('input[name="quiz-option"]:checked')).map((v) => parseInt(v.value));
                userAnswers[idx] = checked;
                renderQ(idx);
            };
        });
    };

    // Tugmalar eventlari
    container.querySelector("#next-btn").onclick = () => {
        if (currentQ < test.questions.length - 1) renderQ(++currentQ);
    };
    container.querySelector("#prev-btn").onclick = () => {
        if (currentQ > 0) renderQ(--currentQ);
    };
    container.querySelector("#finish-btn").onclick = () => {
        finishQuizLogic(test, userAnswers, timerInterval);
    };

    renderQ(0);
};

const finishQuizLogic = (test, userAnswers, timerInterval) => {
    if (timerInterval) clearInterval(timerInterval);

    let totalScore = 0;
    let detailsHTML = "";

    test.questions.forEach((q, idx) => {
        const userAnsIndices = userAnswers[idx] || []; // User tanlagan indexlar [0, 1]
        const correctIndices = q.answers.map((a, i) => (a.isCorrect ? i : null)).filter((v) => v !== null);

        const isCorrect = userAnsIndices.length === correctIndices.length && userAnsIndices.every((v) => correctIndices.includes(v));

        if (isCorrect) totalScore += parseInt(q.score || 0);
        else totalScore -= parseInt(q.penalty || 0);

        let answersInfo = q.answers
            .map((ans, i) => {
                const isUserSelected = userAnsIndices.includes(i);
                const isActuallyCorrect = ans.isCorrect;

                let statusClass = "info-text";
                let prefix = "";

                if (isUserSelected && isActuallyCorrect) {
                    statusClass = "correct-text";
                    prefix = "✅ correct answer: ";
                } else if (isUserSelected && !isActuallyCorrect) {
                    statusClass = "wrong-text";
                    prefix = "❌ wrong answer: ";
                } else if (!isUserSelected && isActuallyCorrect) {
                    statusClass = "correct-text";
                    prefix = "💡 Correct answer is: ";
                } else {
                    return "";
                }

                return `<div class="res-ans-row ${statusClass}">${prefix} <b>${ans.text}</b></div>`;
            })
            .join("");

        detailsHTML += `
            <div class="res-item" style="border-left: 5px solid ${isCorrect ? "#22c55e" : "#ef4444"}">
                <span class="res-q-text">${idx + 1}. ${q.text}</span>
                <div class="res-answers-box">
                    ${answersInfo || "<div class='res-ans-row wrong-text'>❌ No answer</div>"}
                </div>
            </div>
        `;
    });

    const finalScore = Math.max(0, totalScore);
    const testIndex = allTests.findIndex((t) => t.name === test.name);
    updateLeaderboardData(finalScore, testIndex);

    // Modalni ko'rsatish
    const resModal = document.getElementById("result-modal");
    if (resModal) {
        document.getElementById("res-score").innerText = finalScore;
        document.getElementById("res-details-list").innerHTML = detailsHTML;
        resModal.style.display = "flex";
    } else {
        console.error("Modal topilmadi!");
    }

    document.getElementById("close-res-btn").onclick = () => {
        resModal.style.display = "none";
        currentView = "dashboard";
        currentTestId = null;
        saveToLocal();
        location.reload();
    };
};

const setupGeneralEvents = (container, testId) => {
    container.querySelectorAll(".nav-item").forEach((item) => {
        item.onclick = () => {
            currentTab = item.dataset.tab;
            saveToLocal();
            renderDetailView(container, testId);
        };
    });
    container.querySelector(".back-to-dash").onclick = () => {
        currentView = "dashboard";
        currentTestId = null;
        saveToLocal();
        location.reload();
    };
};