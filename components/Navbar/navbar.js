const navbar = document.querySelector(".navbar");
const loggedInInfo = JSON.parse(localStorage.getItem("currentUser"));
const allUsers = JSON.parse(localStorage.getItem("users")) || [];
const user = allUsers.find((u) => u.email === loggedInInfo.email) || loggedInInfo;

const currentLang = localStorage.getItem("language") || "uz";
const t = (key) => translations[currentLang][key] || key;
const translations = {
    uz: {
        search: "Qidiruv",
    },
    en: {
        search: "Search",
    },
    ru: {
        search: "Поиск",
    },
};

navbar.innerHTML = `
    <div class="search-box">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M11.5 3C6.80558 3 3 6.80558 3 11.5C3 16.1944 6.80558 20 11.5 20C13.4845 20 15.3102 19.3199 16.7567 18.18L17.1601 18.5742L20.2929 21.7071L20.3871 21.7903C20.7794 22.0953 21.3466 22.0676 21.7071 21.7071C22.0976 21.3166 22.0976 20.6834 21.7071 20.2929L18.5661 17.1518L18.1721 16.7668C19.3167 15.3187 20 13.4892 20 11.5C20 6.80558 16.1944 3 11.5 3ZM11.5 5C15.0899 5 18 7.91015 18 11.5C18 15.0899 15.0899 18 11.5 18C7.91015 18 5 15.0899 5 11.5C5 7.91015 7.91015 5 11.5 5Z"
                fill="#0A1629"
            />
        </svg>

        <input type="text" placeholder="${t("search")}" />
    </div>

    <div class="user-nav">

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
        <button>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12 2C15.9511 2 19.169 5.13941 19.2961 9.06012L19.3 9.30112V13.8019C19.3 14.6917 19.9831 15.4218 20.8533 15.4962L21.1332 15.5094C22.2445 15.6286 22.2872 17.2401 21.2614 17.4741L21.1332 17.4954L21 17.5024H3L2.86683 17.4954C1.71106 17.3714 1.71106 15.6334 2.86683 15.5094L3.14668 15.4962C3.96851 15.4259 4.62352 14.7708 4.69376 13.9486L4.7 13.8019V9.30112C4.7 5.26886 7.96828 2 12 2ZM13.557 19.103C14.3277 19.103 14.8087 19.9381 14.422 20.6047C13.9211 21.4684 12.9983 22 12 22C11.0017 22 10.0789 21.4684 9.57796 20.6047C9.21064 19.9714 9.62639 19.1861 10.3296 19.1092L10.443 19.103H13.557ZM6.70442 9.0826C6.81899 6.25617 9.14611 4 12 4C14.9271 4 17.3 6.37335 17.3 9.30112V13.8019L17.3051 13.9984L17.3276 14.2563C17.3797 14.6817 17.504 15.0848 17.6878 15.453L17.714 15.502H6.285L6.3122 15.453L6.41182 15.2362C6.59742 14.7951 6.7 14.3105 6.7 13.8019V9.30112L6.70442 9.0826Z"
                    fill="#0A1629"
                />
            </svg>
        </button>
        <button  class="user-profile-btn">
            <span>${user.username}</span>
        </button>
    </div>
`;