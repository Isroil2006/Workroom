export const DashboardPage = `
    <div class="dashboard-wrapper">
        <div class="dashboard__main-content">
            <div class="total-tests-row">
            
                <div class="total-test-card">
                    <div class="top">
                        <span class="total-title">Total Tests</span>
                        <div class="icon-box">
                            <img src="./pages/Dashboard/images/test.svg" alt="" />
                        </div>
                    </div>
                    <div class="bottom">
                        <span style="color: #3f8cff" class="total-count">-</span>
                    </div>
                </div>

                <div class="total-test-card">
                    <div class="top">
                        <span class="total-title">Active Tests</span>
                        <div class="icon-box">
                            <img src="./pages/Dashboard/images/active-test.svg" alt="" />
                        </div>
                    </div>
                    <div class="bottom">
                        <span style="color: #16d81f" class="total-count">-</span>
                    </div>
                </div>

                <div class="total-test-card">
                    <div class="top">
                        <span class="total-title">Not active Tests</span>
                        <div class="icon-box">
                            <img src="./pages/Dashboard/images/inactive-test.svg" alt="" />
                        </div>
                    </div>
                    <div class="bottom">
                        <span style="color: #ff0000" class="total-count">-</span>
                    </div>
                </div>

            </div>

            <span class="dashboard-tests-line"></span>

            <div class="tests"></div>
        </div>
        <div class="dashboard__create-box">
            <span>Quick actions</span>
            <button class="btn">Create test</button>
        </div>
    </div>


    <div id="testModal" class="modal" style="display:none;">
    <div class="modal-content large-modal">
        <h2 class="modal-title">Create New Test</h2>
        <input type="text" id="test-name" placeholder="Test Name" class="input ">
        
        <div class="question-setup">
            <div class="question-type-select" >
                <select id="question-type" class="question-type">
                    <option value="single">Single Choice</option>
                    <option value="multiple">Multiple Choice</option>
                    <option value="true-false">True / False</option>
                </select>
                <span class="question-type-label" >Enter question type</span>
            </div>
            <input type="text" id="question-text" placeholder="Enter your question" class="input">
        </div>

        <div id="answers-container">
        </div>

        <button id="add-answer-btn" class="btn add-answer-btn">Add Answer</button>
        
        <div class="modal-footer">
            <button id="save-test-btn" class="btn">Save Test</button>
            <button id="close-test-modal" class="btn cancel">Cancel</button>
        </div>
    </div>
</div>

<div id="solveModal" class="modal solve-modal" style="display:none;">
    <div class="modal-content">
        <h2 id="solve-test-title"></h2>
        <div id="solve-questions-container"></div>
        <div class="modal-footer">
            <button id="submit-test-btn" class="btn">Send</button>
            <button id="close-solve-modal" class="btn cancel">Cancel</button>
        </div>
    </div>
</div>
`;

export function initTestLogic() {
    const createBtn = document.querySelector(".dashboard__create-box .btn");
    const testModal = document.getElementById("testModal");
    const solveModal = document.getElementById("solveModal");
    const answersContainer = document.getElementById("answers-container");
    const questionType = document.getElementById("question-type");
    const saveTestBtn = document.getElementById("save-test-btn");
    const testsDiv = document.querySelector(".tests");

    let editTestIndex = null; // Tahrirlash uchun ID ni saqlaymiz

    // Modalni tozalash funksiyasi
    function resetTestModal() {
        document.getElementById("test-name").value = "";
        document.getElementById("question-text").value = "";
        answersContainer.innerHTML = "";
        questionType.value = "single";
        editTestIndex = null;
        document.getElementById("add-answer-btn").style.display = "block";
    }

    // Modalni yopish (Cancel)
    document.getElementById("close-test-modal").onclick = () => {
        testModal.style.display = "none";
        resetTestModal();
    };

    document.getElementById("close-solve-modal").onclick = () => {
        solveModal.style.display = "none";
    };

    // 1. Dropdown o'zgarganda inputlarni sozlash
    questionType.onchange = () => {
        answersContainer.innerHTML = "";
        const addAnswerBtn = document.getElementById("add-answer-btn");
        if (questionType.value === "true-false") {
            addAnswerBtn.style.display = "none";
            renderTrueFalseOptions();
        } else {
            addAnswerBtn.style.display = "block";
        }
    };

    function renderTrueFalseOptions() {
        answersContainer.innerHTML = `
            <div class="ans-row">
                <input class="input" type="text" value="True" disabled>
                <input type="radio" name="tf-correct" value="True">
            </div>
            <div class="ans-row">
                <input class="input" type="text" value="False" disabled>
                <input type="radio" name="tf-correct" value="False">
            </div>
        `;
    }

    // 2. Add Answer  logikasi
    function addAnswerRow(text = "", isChecked = false) {
        const type = questionType.value;
        const inputType = type === "multiple" ? "checkbox" : "radio";
        const div = document.createElement("div");
        div.className = "ans-row";
        div.innerHTML = `
            <input type="text" placeholder="Answer variant" class="input ans-input" value="${text}">
            <input type="${inputType}" name="correct-ans" ${isChecked ? "checked" : ""}>
        `;
        answersContainer.appendChild(div);
    }

    document.getElementById("add-answer-btn").onclick = () => addAnswerRow();

    // 3. Edit (Tahrirlash) - Global funksiya
    window.editTest = (id) => {
        const tests = JSON.parse(localStorage.getItem("all_tests")) || [];
        const test = tests.find((t) => t.id === id);
        if (!test) return;

        editTestIndex = id;
        document.getElementById("test-name").value = test.name;
        document.getElementById("question-text").value = test.question;
        questionType.value = test.type;

        answersContainer.innerHTML = "";
        if (test.type === "true-false") {
            document.getElementById("add-answer-btn").style.display = "none";
            renderTrueFalseOptions();
            const radios = document.querySelectorAll('input[name="tf-correct"]');
            radios[0].checked = test.answers[0].isCorrect;
            radios[1].checked = test.answers[1].isCorrect;
        } else {
            document.getElementById("add-answer-btn").style.display = "block";
            test.answers.forEach((ans) => addAnswerRow(ans.text, ans.isCorrect));
        }
        testModal.style.display = "flex";
    };

    // 4. Delete (O'chirish)  logikasi
    window.deleteTest = (id) => {
        let tests = JSON.parse(localStorage.getItem("all_tests")) || [];
        tests = tests.filter((t) => t.id !== id);
        localStorage.setItem("all_tests", JSON.stringify(tests));
        renderTests();
    };

    // 5. Testni saqlash
    saveTestBtn.onclick = () => {
        const testName = document.getElementById("test-name").value || "Test";
        const qText = document.getElementById("question-text").value;
        const type = questionType.value;
        let answers = [];

        if (type === "true-false") {
            const radios = document.querySelectorAll('input[name="tf-correct"]');
            answers = [
                { text: "True", isCorrect: radios[0].checked },
                { text: "False", isCorrect: radios[1].checked },
            ];
        } else {
            document.querySelectorAll(".ans-row").forEach((row) => {
                answers.push({
                    text: row.querySelector(".ans-input").value,
                    isCorrect: row.querySelector('input[name="correct-ans"]').checked,
                });
            });
        }

        let tests = JSON.parse(localStorage.getItem("all_tests")) || [];
        const testData = {
            id: editTestIndex !== null ? editTestIndex : Date.now(),
            name: testName,
            question: qText,
            type: type,
            answers: answers,
            status: editTestIndex !== null ? tests.find((t) => t.id === editTestIndex).status : "draft",
        };

        if (editTestIndex !== null) {
            const idx = tests.findIndex((t) => t.id === editTestIndex);
            tests[idx] = testData;
        } else {
            tests.push(testData);
        }

        localStorage.setItem("all_tests", JSON.stringify(tests));
        testModal.style.display = "none";
        resetTestModal();
        renderTests();
    };

    // 6. Cardlarni chiqarish
    function renderTests() {
        const tests = JSON.parse(localStorage.getItem("all_tests")) || [];

        // 1. Hisob-kitoblar
        const totalCount = tests.length;
        const activeCount = tests.filter((t) => t.status === "active").length;
        const inactiveCount = tests.filter((t) => t.status === "draft").length;

        // 2. UI dagi raqamlarni yangilash
        const counters = document.querySelectorAll(".total-count");
        if (counters.length >= 3) {
            counters[0].innerText = totalCount; // Total
            counters[1].innerText = activeCount; // Active
            counters[2].innerText = inactiveCount; // Inactive
        }

        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const results = JSON.parse(localStorage.getItem("test_results")) || {};

        testsDiv.innerHTML = "";
        tests.forEach((test) => {
            const userResult = results[currentUser?.email]?.[test.id];
            let statusBadge = "";
            if (userResult === true) statusBadge = '<span style="color:green"> (Correct)</span>';
            if (userResult === false) statusBadge = '<span style="color:red"> (Incorrect)</span>';

            const card = document.createElement("div");
            card.className = "test-card";
            card.innerHTML = `
                <div style="flex-grow:1; cursor:${test.status === "active" ? "pointer" : "default"}" 
                    onclick="${test.status === "active" ? `openSolveModal(${test.id})` : ""}">
                    <h3>${test.name} ${statusBadge}</h3>
                </div>
                <div class="actions">
                    ${
                        test.status === "draft"
                            ? `
                        <button class="btn btn-edit" onclick="editTest(${test.id})">Edit</button>
                        <button class="btn btn-active" onclick="activateTest(${test.id})">Active</button>
                    `
                            : ""
                    }
                    <button class="btn btn-delete" onclick="deleteTest(${test.id})">Delete</button>
                </div>
            `;
            testsDiv.appendChild(card);
        });
    }

    window.activateTest = (id) => {
        let tests = JSON.parse(localStorage.getItem("all_tests"));
        const idx = tests.findIndex((t) => t.id === id);
        tests[idx].status = "active";
        localStorage.setItem("all_tests", JSON.stringify(tests));
        renderTests();
    };

    window.openSolveModal = (id) => {
        const tests = JSON.parse(localStorage.getItem("all_tests"));
        const test = tests.find((t) => t.id === id);
        const solveCont = document.getElementById("solve-questions-container");
        document.getElementById("solve-test-title").innerText = test.name;
        solveCont.innerHTML = `<p>${test.question}</p>`;
        test.answers.forEach((ans, i) => {
            const inputType = test.type === "multiple" ? "checkbox" : "radio";
            solveCont.innerHTML += `<div><label><input type="${inputType}" name="solve-ans" value="${i}"> ${ans.text}</label></div>`;
        });
        solveModal.setAttribute("data-current-id", id);
        solveModal.style.display = "flex";
    };

    document.getElementById("submit-test-btn").onclick = () => {
        const id = solveModal.getAttribute("data-current-id");
        const tests = JSON.parse(localStorage.getItem("all_tests"));
        const test = tests.find((t) => t.id == id);
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const selectedIndices = Array.from(document.querySelectorAll('input[name="solve-ans"]:checked')).map((el) => parseInt(el.value));
        const correctIndices = test.answers.map((a, i) => (a.isCorrect ? i : null)).filter((i) => i !== null);
        const isCorrect = JSON.stringify(selectedIndices.sort()) === JSON.stringify(correctIndices.sort());

        let results = JSON.parse(localStorage.getItem("test_results")) || {};
        if (!results[currentUser.email]) results[currentUser.email] = {};
        results[currentUser.email][id] = isCorrect;

        localStorage.setItem("test_results", JSON.stringify(results));
        solveModal.style.display = "none";
        renderTests();
    };

    renderTests();
    createBtn.onclick = () => {
        resetTestModal();
        testModal.style.display = "flex";
    };
}
