export const EmployeesPage = `
    <div class="employees-page">
        <div class="employees-header">
            <h2 id="employee-count-title">Employees(0)</h2>
            <button class="btn add-employee-btn">+ Add Employee</button>
        </div>

        <div id="employees-list"></div>

        <div class="pagination" id="pagination"></div>
    </div>

    <div class="modal" id="employeeModal" style="display:none;">
        <div class="modal-content">
            <h3 id="modalTitle">Add Employee</h3>
            
            <div class="avatar-upload-wrapper">
                <div class="avatar-preview">
                    <img id="modal-avatar-img" src="./assets/images/User-avatar.png" alt="Preview" />
                </div>
                <label for="avatar-input" class="upload-label">Change Photo</label>
                <input type="file" id="avatar-input" accept="image/*" style="display:none;" />
            </div>

            <div class="modal-body">
                <input class="input" id="emp-username" placeholder="Full Name" />
                <input class="input" id="emp-email" placeholder="Email Address" />
                <input class="input" id="emp-password" placeholder="Password" />
                <input class="input" id="emp-tel" placeholder="Phone Number" />
                
                <select id="emp-gender">
                    <option value="" disabled selected>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>

                <input class="input" id="emp-age" type="number" placeholder="Age" />
                <input class="input" id="emp-position" placeholder="Job Position" />
                <input class="input" id="emp-level" placeholder="Level (Junior, Middle, Senior)" />
            </div>

            <div class="modal-actions">
                <button id="cancelModal" class="btn-cancel">Cancel</button>
                <button id="saveEmployee" class="btn-save">Save</button>
            </div>
        </div>
    </div>


    <div class="modal" id="deleteConfirmModal" style="display:none;">
        <div class="modal-content delete-modal">
            <h3>O'chirishni tasdiqlaysizmi?</h3>
            <div class="delete-modal-actions modal-actions">
                <button id="cancelDelete" class="btn-cancel">Yo'q</button>
                <button id="confirmDelete" class="btn-delete-confirm">Ha</button>
            </div>
        </div>
    </div>
`;

export function initEmployeesPage() {
    // DOM Elementlar
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
    let indexToDelete = null;

    //O'zgaruvchilar
    const ITEMS_PER_PAGE = 4;
    let currentPageNum = 1;
    let editIndex = null;
    let currentImage = "./assets/images/User-avatar.png";

    //Rasm yuklash logikasi
    avatarInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                currentImage = event.target.result;
                modalAvatarImg.src = currentImage;
            };
            reader.readAsDataURL(file);
        }
    };

    // Render funksiyasi
    function renderEmployees() {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        list.innerHTML = "";
        employeeCountTitle.innerText = `Employees(${users.length})`;

        const start = (currentPageNum - 1) * ITEMS_PER_PAGE;
        const pageUsers = users.slice(start, start + ITEMS_PER_PAGE);

        if (pageUsers.length === 0 && currentPageNum > 1) {
            currentPageNum--;
            renderEmployees();
            return;
        }

        pageUsers.forEach((u, idx) => {
            const realIndex = start + idx;
            list.innerHTML += `
            <div class="employee-card">
                <div class="employee-box">
                    <img src="${u.avatar || "./assets/images/User-avatar.png"}" alt="User" class="user-avatar-img"/>
                    <div class="name-email-box">
                        <span class="username">${u.username || "-"}</span>
                        <span class="useremail">${u.email || "-"}</span>
                    </div>
                </div>

                <div class="user-main-info">
                    <div class="gender-box">
                        <span class="user-gender-title">Gender</span>
                        <span class="user-gender">${u.gender || "-"}</span>
                    </div>
                    <div class="user-age-box">
                        <span class="user-age-title">Age</span>
                        <span class="user-age">${u.age || "-"}</span>
                    </div>
                    <div class="user-position-box">
                        <span class="user-position-title">Position</span>
                        <span class="user-position">${u.position || "-"}</span>
                    </div>
                        
                    <div class="employee-actions">
                        <button class="dots-btn" data-idx="${realIndex}">
                            <svg width="4" height="18" viewBox="0 0 4 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M4 2C4 3.10457 3.10457 4 2 4C0.895431 4 0 3.10457 0 2C0 0.895431 0.895431 0 2 0C3.10457 0 4 0.895431 4 2ZM4 9C4 10.1046 3.10457 11 2 11C0.895431 11 0 10.1046 0 9C0 7.89543 0.895431 7 2 7C3.10457 7 4 7.89543 4 9ZM2 18C3.10457 18 4 17.1046 4 16C4 14.8954 3.10457 14 2 14C0.895431 14 0 14.8954 0 16C0 17.1046 0.895431 18 2 18Z" fill="#0A1629"/>
                            </svg>
                        </button>
                        <div class="dots-menu">
                            <div class="menu-item edit" data-idx="${realIndex}">Edit</div>
                            <div class="menu-item delete" data-idx="${realIndex}">Delete</div>
                        </div>
                    </div>
                </div>
            </div>`;
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
        document.querySelectorAll(".dots-btn").forEach((btn) => {
            btn.onclick = (e) => {
                e.stopPropagation();
                document.querySelectorAll(".employee-actions").forEach((a) => a.classList.remove("active"));
                btn.parentElement.classList.toggle("active");
            };
        });

        document.querySelectorAll(".edit").forEach((btn) => {
            btn.onclick = () => openEdit(parseInt(btn.getAttribute("data-idx")));
        });

        document.querySelectorAll(".delete").forEach((btn) => {
            btn.onclick = () => deleteEmployee(parseInt(btn.getAttribute("data-idx")));
        });
    }

    function openEdit(index) {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        const u = users[index];
        editIndex = index;
        modalTitle.innerText = "Edit Employee";

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
        const data = {
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
        modal.style.display = "none";
        renderEmployees();
        window.location.reload();
    };

    cancelBtn.onclick = () => {
        modal.style.display = "none";
    };

    addBtn.onclick = () => {
        editIndex = null;
        modalTitle.innerText = "Add Employee";
        [usernameInput, emailInput, telInput, ageInput, positionInput, levelInput].forEach((i) => (i.value = ""));
        genderInput.value = "";
        currentImage = "./assets/images/User-avatar.png";
        modalAvatarImg.src = currentImage;
        modal.style.display = "flex";
    };

    function deleteEmployee(index) {
        indexToDelete = index;
        deleteModal.style.display = "flex";
    }

    // Modalda "Yoq" bosilganda
    cancelDeleteBtn.onclick = () => {
        deleteModal.style.display = "none";
        indexToDelete = null;
    };

    // Modalda "Ha" bosilganda
    confirmDeleteBtn.onclick = () => {
        if (indexToDelete === null) return;

        let users = JSON.parse(localStorage.getItem("users")) || [];
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const deletingUser = users[indexToDelete];

        users.splice(indexToDelete, 1);
        localStorage.setItem("users", JSON.stringify(users));

        deleteModal.style.display = "none"; // Modalni yopish

        // Login logikasi
        if (currentUser && deletingUser && deletingUser.email === currentUser.email) {
            localStorage.removeItem("currentUser");
            window.location.href = "login.html";
            return;
        }

        // Paginationni to'g'irlash va qayta render
        const maxPage = Math.ceil(users.length / ITEMS_PER_PAGE) || 1;
        if (currentPageNum > maxPage) currentPageNum = maxPage;

        renderEmployees();
        indexToDelete = null;
    };

    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = "none";
        if (e.target === deleteModal) deleteModal.style.display = "none"; // Yangi modal uchun
        if (!e.target.closest(".employee-actions")) {
            document.querySelectorAll(".employee-actions").forEach((a) => a.classList.remove("active"));
        }
    };

    renderEmployees();
}
