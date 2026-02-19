const userProfileBtn = document.querySelector(".user-profile-btn");

// tablar
const projectsHTML = `
    <div class="project-cards-wrapper">
    <div class="project-card">
        <div class="project-main-info">
            <div class="project-info-top">
                <img src="/pages/user-profile/images/user-profile-project-1.svg" alt="" />
                <div class="project-main-detail">
                    <span class="project-id">PN0001265</span>
                    <span class="project-name">Medical App (iOS native)</span>
                </div>
            </div>
            <div class="project-meta">
                <span class="creation-date">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M7 2C7 1.44772 7.44772 1 8 1C8.55228 1 9 1.44772 9 2V3H15V2C15 1.44772 15.4477 1 16 1C16.5523 1 17 1.44772 17 2V3C19.2091 3 21 4.79086 21 7V17C21 19.2091 19.2091 21 17 21H7C4.79086 21 3 19.2091 3 17V7C3 4.79086 4.79086 3 7 3V2ZM15 5C15 5.55228 15.4477 6 16 6C16.5523 6 17 5.55228 17 5L17.1493 5.00549C18.1841 5.08183 19 5.94564 19 7V8H5V7L5.00549 6.85074C5.08183 5.81588 5.94564 5 7 5C7 5.55228 7.44772 6 8 6C8.55228 6 9 5.55228 9 5H15Z"
                            fill="currentColor"
                        />
                    </svg>
                    Created Sep 12, 2020
                </span>

                <span class="level">
                    <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M6.6129 0.209705L6.70711 0.292893L11.7071 5.29289C12.0976 5.68342 12.0976 6.31658 11.7071 6.70711C11.3466 7.06759 10.7794 7.09532 10.3871 6.7903L10.2929 6.70711L7 3.415V15C7 15.5523 6.55228 16 6 16C5.48716 16 5.06449 15.614 5.00673 15.1166L5 15V3.415L1.70711 6.70711C1.34662 7.06759 0.779392 7.09532 0.387101 6.7903L0.292893 6.70711C-0.0675907 6.34662 -0.0953203 5.77939 0.209705 5.3871L0.292893 5.29289L5.29289 0.292893C5.65338 -0.0675907 6.22061 -0.0953203 6.6129 0.209705Z"
                            fill="currentColor"
                        />
                    </svg>
                    Medium
                </span>
            </div>
        </div>
        <span class="line"></span>
        <div class="project-stats">
            <h3>Project Data</h3>
            <div class="stats-box">
                <div class="stat-item">
                    <span class="stats-label">All tasks</span>
                    <span class="stats-value">34</span>
                </div>
                <div class="stat-item">
                    <span class="stats-label">Active tasks</span>
                    <span class="stats-value">13</span>
                </div>
                <div class="stat-item">
                    <span class="stats-label">Assignees</span>
                    <img src="/pages/user-profile/images/user-profile-project-avatars.png" alt="" />
                </div>
            </div>
        </div>
    </div>

    <div class="project-card">
        <div class="project-main-info">
            <div class="project-info-top">
                <img src="/pages/user-profile/images/user-profile-project-2.svg" alt="" />
                <div class="project-main-detail">
                    <span class="project-id">PN0001221</span>
                    <span class="project-name">Food Delivery Service</span>
                </div>
            </div>
            <div class="project-meta">
                <span class="creation-date">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M7 2C7 1.44772 7.44772 1 8 1C8.55228 1 9 1.44772 9 2V3H15V2C15 1.44772 15.4477 1 16 1C16.5523 1 17 1.44772 17 2V3C19.2091 3 21 4.79086 21 7V17C21 19.2091 19.2091 21 17 21H7C4.79086 21 3 19.2091 3 17V7C3 4.79086 4.79086 3 7 3V2ZM15 5C15 5.55228 15.4477 6 16 6C16.5523 6 17 5.55228 17 5L17.1493 5.00549C18.1841 5.08183 19 5.94564 19 7V8H5V7L5.00549 6.85074C5.08183 5.81588 5.94564 5 7 5C7 5.55228 7.44772 6 8 6C8.55228 6 9 5.55228 9 5H15Z"
                            fill="currentColor"
                        />
                    </svg>
                    Created Sep 12, 2020
                </span>

                <span class="level">
                    <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M6.6129 0.209705L6.70711 0.292893L11.7071 5.29289C12.0976 5.68342 12.0976 6.31658 11.7071 6.70711C11.3466 7.06759 10.7794 7.09532 10.3871 6.7903L10.2929 6.70711L7 3.415V15C7 15.5523 6.55228 16 6 16C5.48716 16 5.06449 15.614 5.00673 15.1166L5 15V3.415L1.70711 6.70711C1.34662 7.06759 0.779392 7.09532 0.387101 6.7903L0.292893 6.70711C-0.0675907 6.34662 -0.0953203 5.77939 0.209705 5.3871L0.292893 5.29289L5.29289 0.292893C5.65338 -0.0675907 6.22061 -0.0953203 6.6129 0.209705Z"
                            fill="currentColor"
                        />
                    </svg>
                    Medium
                </span>
            </div>
        </div>
        <span class="line"></span>
        <div class="project-stats">
            <h3>Project Data</h3>
            <div class="stats-box">
                <div class="stat-item">
                    <span class="stats-label">All tasks</span>
                    <span class="stats-value">50</span>
                </div>
                <div class="stat-item">
                    <span class="stats-label">Active tasks</span>
                    <span class="stats-value">24</span>
                </div>
                <div class="stat-item">
                    <span class="stats-label">Assignees</span>
                    <img src="/pages/user-profile/images/user-profile-project-avatars.png" alt="" />
                </div>
            </div>
        </div>
    </div>

    <div class="project-card">
        <div class="project-main-info">
            <div class="project-info-top">
                <img src="/pages/user-profile/images/user-profile-project-3.svg" alt="" />
                <div class="project-main-detail">
                    <span class="project-id">PN0001290</span>
                    <span class="project-name">Internal Project</span>
                </div>
            </div>
            <div class="project-meta">
                <span class="creation-date">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M7 2C7 1.44772 7.44772 1 8 1C8.55228 1 9 1.44772 9 2V3H15V2C15 1.44772 15.4477 1 16 1C16.5523 1 17 1.44772 17 2V3C19.2091 3 21 4.79086 21 7V17C21 19.2091 19.2091 21 17 21H7C4.79086 21 3 19.2091 3 17V7C3 4.79086 4.79086 3 7 3V2ZM15 5C15 5.55228 15.4477 6 16 6C16.5523 6 17 5.55228 17 5L17.1493 5.00549C18.1841 5.08183 19 5.94564 19 7V8H5V7L5.00549 6.85074C5.08183 5.81588 5.94564 5 7 5C7 5.55228 7.44772 6 8 6C8.55228 6 9 5.55228 9 5H15Z"
                            fill="currentColor"
                        />
                    </svg>
                    Created Sep 12, 2020
                </span>

                <span style="color: #0ac947" class="level">
                    <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M6.6129 15.7903L6.70711 15.7071L11.7071 10.7071C12.0976 10.3166 12.0976 9.68342 11.7071 9.29289C11.3466 8.93241 10.7794 8.90468 10.3871 9.2097L10.2929 9.29289L7 12.585V1C7 0.447715 6.55228 0 6 0C5.48716 0 5.06449 0.38604 5.00673 0.883379L5 1V12.585L1.70711 9.29289C1.34662 8.93241 0.779392 8.90468 0.387101 9.2097L0.292893 9.29289C-0.0675907 9.65338 -0.0953203 10.2206 0.209705 10.6129L0.292893 10.7071L5.29289 15.7071C5.65338 16.0676 6.22061 16.0953 6.6129 15.7903Z"
                            fill="currentColor"
                        />
                    </svg>
                    Low
                </span>
            </div>
        </div>
        <span class="line"></span>
        <div class="project-stats">
            <h3>Project Data</h3>
            <div class="stats-box">
                <div class="stat-item">
                    <span class="stats-label">All tasks</span>
                    <span class="stats-value">34</span>
                </div>
                <div class="stat-item">
                    <span class="stats-label">Active tasks</span>
                    <span class="stats-value">13</span>
                </div>
                <div class="stat-item">
                    <span class="stats-label">Assignees</span>
                    <img src="/pages/user-profile/images/user-profile-project-avatars.png" alt="" />
                </div>
            </div>
        </div>
    </div>
</div>
`;
const teamHTML = `
<div class="team-cards-wrapper">
    <div class="team-card">
        <img src="/assets/images/User-avatar.png" alt="" />
        <div class="team-card-info">
            <span class="team-card-name">Shawn Stone</span>
            <span class="team-card-role">UI/UX Designer</span>
            <span class="team-card-level">Middle</span>
        </div>
    </div>
</div>
`;
const vacations = `
<div class="vacations-wrapper">
    <div class="vacations-top">
        <div class="vacations-top-card">
            <span class="progress-circle">12</span>
            <h4 class="">Vacation</h4>
            <p class="">12/16 days availible</p>
        </div>

        <div class="vacations-top-card">
            <span style="border: 2px solid #f65160; color: #f65160" class="progress-circle">6</span>
            <h4 class="">Sick Leave</h4>
            <p class="">6/12 days availible</p>
        </div>

        <div class="vacations-top-card">
            <span style="border: 2px solid #6d5dd3; color: #6d5dd3" class="progress-circle">42</span>
            <h4 class="">Work remotely</h4>
            <p class="">42/50 days availible</p>
        </div>
    </div>

    <div class="vacations-requests">
        <h2>My Requests</h2>
    </div>
</div>
`;

// settings
const userSettings = `
    <div class="user-profile-setting">
    <div class="user-profile-setting-header">
        <button class="back-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M4.2097 11.3871L4.29289 11.2929L9.29289 6.29289C9.68342 5.90237 10.3166 5.90237 10.7071 6.29289C11.0676 6.65338 11.0953 7.22061 10.7903 7.6129L10.7071 7.70711L7.415 11H19C19.5523 11 20 11.4477 20 12C20 12.5128 19.614 12.9355 19.1166 12.9933L19 13H7.415L10.7071 16.2929C11.0676 16.6534 11.0953 17.2206 10.7903 17.6129L10.7071 17.7071C10.3466 18.0676 9.77939 18.0953 9.3871 17.7903L9.29289 17.7071L4.29289 12.7071C3.93241 12.3466 3.90468 11.7794 4.2097 11.3871Z"
                    fill="#3F8CFF"
                />
            </svg>
        </button>
        <h2>Settings</h2>
    </div>
    <div class="wrapper">
        <div class="user-setting-navigation">
            <button class="user-setting-navigation-btn active">
                <i class="setting-icon">
                    <img src="/pages/user-profile/images/setting-icons/account.svg" alt="" />
                </i>
                Account
            </button>

            <button class="user-setting-navigation-btn">
                <i class="setting-icon">
                    <img src="/pages/user-profile/images/setting-icons/notifications.svg" alt="" />
                </i>
                Notifications
            </button>

            <button class="user-setting-navigation-btn">
                <i class="setting-icon">
                    <img src="/pages/user-profile/images/setting-icons/company.svg" alt="" />
                </i>
                My Company
            </button>

            <button class="user-setting-navigation-btn">
                <i class="setting-icon">
                    <img src="/pages/user-profile/images/setting-icons/apps.svg" alt="" />
                </i>
                Connected Apps
            </button>

            <button class="user-setting-navigation-btn">
                <i class="setting-icon">
                    <img src="/pages/user-profile/images/setting-icons/payments.svg" alt="" />
                </i>
                Payments
            </button>

            <button class="user-setting-navigation-btn">
                <i class="setting-icon">
                    <img src="/pages/user-profile/images/setting-icons/confidentiality.svg" alt="" />
                </i>
                Confidentiality
            </button>

            <button class="user-setting-navigation-btn">
                <i class="setting-icon">
                    <img src="/pages/user-profile/images/setting-icons/safety.svg" alt="" />
                </i>
                Safety
            </button>
        </div>
        <div class="user-setting-navigation-content">
        </div>
    </div>
</div>
`;

// setting contentlari
const accountContent = `
    <div class="account-content">
        <h2>Account</h2>
    </div>
`;
const notificationsContent = `
    <div class="notifications-content">
        <h2>Notifications</h2>
    </div>
`;
function userProfileRender() {
    const content = document.querySelector(".content");
    //Kim login qilganini bilib olamiz
    const loggedInInfo = JSON.parse(localStorage.getItem("currentUser"));
    if (!loggedInInfo) return;
    // 2. Barcha userlar orasidan o'sha odamni qidirib topamiz
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const user = allUsers.find((u) => u.email === loggedInInfo.email) || loggedInInfo;

    content.innerHTML = `
    <div class="my-profile">
        <div class="my-profile-top">
            <h2>My Profile</h2>
            <button class="setting-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12 0C10.3431 0 9 1.34315 9 3V3.17L8.99255 3.26444C8.96857 3.41945 8.88797 3.56073 8.76793 3.66135L8.706 3.705L8.64655 3.71811C8.60218 3.73073 8.55864 3.74642 8.51623 3.76514C8.27314 3.87243 7.98922 3.82095 7.79926 3.63514L7.74711 3.58289C7.18479 3.01996 6.42123 2.70343 5.625 2.70343C4.82877 2.70343 4.0652 3.01996 3.5025 3.58329C2.93996 4.14521 2.62343 4.90877 2.62343 5.705C2.62343 6.43488 2.8894 7.13731 3.36764 7.68274L3.56289 7.88711C3.74095 8.06922 3.79243 8.35314 3.68514 8.59623C3.56934 8.90531 3.33344 9.07403 3.06662 9.08027L3 9.08C1.34315 9.08 0 10.4231 0 12.08C0 13.7369 1.34315 15.08 3 15.08H3.17C3.42508 15.081 3.6588 15.2358 3.76086 15.4739C3.87243 15.7269 3.82095 16.0108 3.63514 16.2007L3.58289 16.2529C3.01996 16.8152 2.70343 17.5788 2.70343 18.375C2.70343 19.1712 3.01996 19.9348 3.58329 20.4975C4.14521 21.06 4.90877 21.3766 5.705 21.3766C6.43488 21.3766 7.13731 21.1106 7.68274 20.6324L7.88711 20.4371C8.06922 20.2591 8.35314 20.2076 8.59623 20.3149C8.90531 20.4307 9.07403 20.6666 9.08027 20.9334L9.08 21C9.08 22.6569 10.4231 24 12.08 24C13.7369 24 15.08 22.6569 15.08 21V20.83C15.081 20.5749 15.2358 20.3412 15.4739 20.2391C15.7269 20.1276 16.0108 20.1791 16.2007 20.3649L16.2529 20.4171C16.8152 20.98 17.5788 21.2966 18.375 21.2966C19.1712 21.2966 19.9348 20.98 20.4975 20.4167C21.06 19.8548 21.3766 19.0912 21.3766 18.295C21.3766 17.5651 21.1106 16.8627 20.6324 16.3173L20.4371 16.1129C20.2591 15.9308 20.2076 15.6469 20.3149 15.4038C20.4212 15.1558 20.6549 15.001 20.914 15L21 15C22.6569 15 24 13.6569 24 12C24 10.3431 22.6569 9 21 9H20.83L20.7356 8.99255C20.5805 8.96857 20.4393 8.88797 20.3386 8.76793L20.294 8.706L20.2819 8.64655C20.2693 8.60218 20.2536 8.55864 20.2349 8.51623C20.1276 8.27314 20.1791 7.98922 20.3649 7.79926L20.4171 7.74711C20.98 7.18479 21.2966 6.42123 21.2966 5.625C21.2966 4.82877 20.98 4.0652 20.4167 3.5025C19.8548 2.93996 19.0912 2.62343 18.295 2.62343C17.5651 2.62343 16.8627 2.8894 16.3173 3.36764L16.1129 3.56289C15.9308 3.74095 15.6469 3.79243 15.4038 3.68514C15.1558 3.5788 15.001 3.34508 15 3.08601L15 3C15 1.34315 13.6569 0 12 0ZM12 2C12.5523 2 13 2.44772 13 3V3.09C13.0042 4.1502 13.6353 5.10306 14.6061 5.51914C15.5873 5.95227 16.7448 5.74239 17.5193 4.98486L17.5871 4.91711C17.7751 4.72894 18.0296 4.62343 18.295 4.62343C18.5604 4.62343 18.8149 4.72894 19.0025 4.91671C19.1911 5.10507 19.2966 5.35959 19.2966 5.625C19.2966 5.89041 19.1911 6.14493 19.0033 6.3325L18.9429 6.39289L18.8136 6.53472C18.2375 7.21376 18.0416 8.12568 18.2775 8.96794L18.32 9C18.32 9.13543 18.3475 9.26945 18.4009 9.39393C18.8169 10.3647 19.7698 10.9958 20.826 11L21 11C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H20.91C19.8498 13.0042 18.8969 13.6353 18.4809 14.6061C18.0477 15.5873 18.2576 16.7448 19.0151 17.5193L19.0829 17.5871C19.2711 17.7751 19.3766 18.0296 19.3766 18.295C19.3766 18.5604 19.2711 18.8149 19.0833 19.0025C18.8949 19.1911 18.6404 19.2966 18.375 19.2966C18.1096 19.2966 17.8551 19.1911 17.6675 19.0033L17.6071 18.9429C16.8248 18.1776 15.6673 17.9677 14.6762 18.4051C13.7153 18.8169 13.0842 19.7698 13.08 20.826L13.08 21C13.08 21.5523 12.6323 22 12.08 22C11.5277 22 11.08 21.5523 11.08 21V20.91C11.0558 19.8641 10.4451 18.9507 9.52187 18.5337L9.34518 18.4615C8.41268 18.0477 7.25516 18.2576 6.48073 19.0151L6.41289 19.0829C6.22493 19.2711 5.97041 19.3766 5.705 19.3766C5.43959 19.3766 5.18507 19.2711 4.9975 19.0833C4.80894 18.8949 4.70343 18.6404 4.70343 18.375C4.70343 18.1096 4.80894 17.8551 4.99671 17.6675L5.05711 17.6071C5.82239 16.8248 6.03227 15.6673 5.59486 14.6762C5.18306 13.7153 4.2302 13.0842 3.17399 13.08L3 13.08C2.44772 13.08 2 12.6323 2 12.08C2 11.5277 2.44772 11.08 3 11.08H3.09C4.13585 11.0558 5.04927 10.4451 5.46626 9.52187L5.53854 9.34518C5.95227 8.41268 5.74239 7.25516 4.98486 6.48073L4.91711 6.41289C4.72894 6.22493 4.62343 5.97041 4.62343 5.705C4.62343 5.43959 4.72894 5.18507 4.91671 4.9975C5.10507 4.80894 5.35959 4.70343 5.625 4.70343C5.89041 4.70343 6.14493 4.80894 6.3325 4.99671L6.39289 5.05711L6.53472 5.18637C7.21376 5.76253 8.12568 5.95835 8.96794 5.72251L9 5.68C9.13543 5.68 9.26945 5.65249 9.39393 5.59914C10.3647 5.18306 10.9958 4.2302 11 3.17399L11 3C11 2.44772 11.4477 2 12 2ZM12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8ZM12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10Z"
                        fill="#0A1629"
                    />
                </svg>
            </button>
        </div>

        <div class="my-profile-wrapper">
            <div class="user-info-left">
                <div class="user-header">
                    <div class="avatar-box">
                        <div class="avatar" >
                            <img src="${user.avatar || "./assets/images/User-avatar.png"}" alt="Avatar" />
                        </div>
                        <button id="edit-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M15.8787 2.87868L7.29289 11.4645C7.10536 11.652 7 11.9064 7 12.1716V16.1716C7 16.7239 7.44772 17.1716 8 17.1716H12C12.2652 17.1716 12.5196 17.0662 12.7071 16.8787L21.2929 8.29289C22.4645 7.12132 22.4645 5.22183 21.2929 4.05025L20.1213 2.87868C18.9497 1.70711 17.0503 1.70711 15.8787 2.87868ZM19.8787 5.46447L19.9619 5.55867C20.2669 5.95096 20.2392 6.5182 19.8787 6.87868L11.584 15.1716H9V12.5856L17.2929 4.29289C17.6834 3.90237 18.3166 3.90237 18.7071 4.29289L19.8787 5.46447ZM11.0308 4.17157C11.0308 3.61929 10.5831 3.17157 10.0308 3.17157H6L5.78311 3.17619C3.12231 3.28975 1 5.48282 1 8.17157V18.1716L1.00462 18.3885C1.11818 21.0493 3.31125 23.1716 6 23.1716H16L16.2169 23.167C18.8777 23.0534 21 20.8603 21 18.1716V13.2533L20.9933 13.1366C20.9355 12.6393 20.5128 12.2533 20 12.2533C19.4477 12.2533 19 12.701 19 13.2533V18.1716L18.9949 18.3478C18.9037 19.9227 17.5977 21.1716 16 21.1716H6L5.82373 21.1665C4.24892 21.0752 3 19.7693 3 18.1716V8.17157L3.00509 7.9953C3.09634 6.42049 4.40232 5.17157 6 5.17157H10.0308L10.1474 5.16485C10.6448 5.10708 11.0308 4.68441 11.0308 4.17157Z"
                                    fill="#0A1629"
                                />
                            </svg>
                        </button>
                    </div>
                    <span id="display-username">${user.username}</span>
                </div>

                <div class="input-box">
                    <div class="input-group">
                        <label>Mobile Number</label>
                        <input type="tel" id="prof-tel" class="profile-input input" value="${user.tel || ""}" disabled />
                    </div>
                    <div class="input-group">
                        <label>User Name</label>
                        <input type="text" id="prof-username" class="profile-input input" value="${user.username || ""}" disabled />
                    </div>
                    <div class="input-group">
                        <label>Email Address</label>
                        <input type="email" id="prof-email" class="profile-input input" value="${user.email || ""}" disabled />
                    </div>
                    <div class="input-group">
                        <label>Password</label>
                        <input type="text" id="prof-password" class="profile-input input" value="${user.password || ""}" disabled />
                    </div>
                </div>

                <button id="save-btn" class="save-btn hidden">Save Changes</button>
            </div>

            <div class="user-info-right">
                <div class="tabs">
                    <button class="tab-btn active">Projects</button>
                    <button class="tab-btn">Team</button>
                    <button class="tab-btn">My vacations</button>
                </div>
                <div class="tab-contents">
                ${projectsHTML} </div>
            </div>
        </div>
    </div>
    `;

    const editBtn = document.getElementById("edit-btn");
    const saveBtn = document.getElementById("save-btn");
    const settingBtn = document.querySelector(".setting-btn");
    const inputs = document.querySelectorAll(".profile-input");
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelector(".tab-contents");
    const userInfoRight = document.querySelector(".user-info-right");

    // Edit funksiyasi
    editBtn.onclick = () => {
        inputs.forEach((input) => (input.disabled = false));
        saveBtn.classList.remove("hidden");
        inputs[0].focus();
    };

    //. Save funksiyasi
    saveBtn.onclick = () => {
        const updatedUser = {
            // Avvalgi barcha ma'lumotlarni saqlab qolish uchun (masalan: avatar, position, age)
            ...JSON.parse(localStorage.getItem("currentUser")),
            username: document.getElementById("prof-username").value,
            email: document.getElementById("prof-email").value,
            tel: document.getElementById("prof-tel").value,
            password: document.getElementById("prof-password").value,
        };

        // --- ASOSIY USERS MASSIVINI YANGILASH ---
        let allUsers = JSON.parse(localStorage.getItem("users")) || [];
        const userIndex = allUsers.findIndex((u) => u.id === updatedUser.id || u.email === updatedUser.email);
        if (userIndex !== -1) {
            allUsers[userIndex] = updatedUser;
            localStorage.setItem("users", JSON.stringify(allUsers));
        }
        // ----------------------------------------
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        inputs.forEach((input) => (input.disabled = true));
        saveBtn.classList.add("saved");
        saveBtn.innerHTML = `Saved`;

        setTimeout(() => {
            saveBtn.classList.add("hidden");
            saveBtn.classList.remove("saved");
            saveBtn.innerHTML = `Save Changes`;
            window.location.reload();
        }, 1500);
    };

    // Setting funksiyasi
    settingBtn.onclick = () => {
        userInfoRight.innerHTML = userSettings;
        const settingButtons = userInfoRight.querySelectorAll(".user-setting-navigation-btn");
        const userSettingsContent = userInfoRight.querySelector(".user-setting-navigation-content");
        const backBtn = userInfoRight.querySelector(".back-btn");

        settingButtons.forEach((btn) => {
            btn.onclick = (e) => {
                // settning btnlarni active qilish
                settingButtons.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                const contentName = btn.innerText;

                if (contentName === "Account") {
                    userSettingsContent.innerHTML = accountContent;
                } else if (contentName === "Notifications") {
                    userSettingsContent.innerHTML = notificationsContent;
                } else {
                    userSettingsContent.innerHTML = `<h2>${contentName}</h2>`;
                }
            };
        });

        if (backBtn) {
            backBtn.onclick = () => {
                userProfileBtn.click();
            };
        }

        userSettingsContent.innerHTML = accountContent;
    };

    // Tablar funksiyasi
    tabBtns.forEach((btn) => {
        btn.onclick = () => {
            tabBtns.forEach((b) => b.classList.remove("active"));

            btn.classList.add("active");

            const text = btn.innerText;

            if (text.includes("Projects")) tabContents.innerHTML = projectsHTML;
            else if (text.includes("Team")) tabContents.innerHTML = teamHTML;
            else if (text.includes("vacations")) tabContents.innerHTML = vacations;
        };
    });
}

userProfileBtn.addEventListener("click", () => {
    localStorage.setItem("currentPage", "user-profile");
    window.location.reload();
    renderCurrentPage();
});

function renderCurrentPage() {
    const page = localStorage.getItem("currentPage");

    if (page === "user-profile") {
        userProfileRender();
    }
}

renderCurrentPage();
