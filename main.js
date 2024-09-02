import { onAuthStateChanged, signOut  } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { auth } from "./src/firebaseConfig.js"
import { cleanLocalStorage } from "./src/services/utils.js"

// --------- FIREBASE AUTH ----------

import "./src/firebaseAuth/register.js"
import "./src/firebaseAuth/login.js"
import "./src/firebaseAuth/forgotPassword.js"
import "./src/firebaseAuth/googleLogin.js"
import "./src/firebaseAuth/facebookLogin.js"

// ----------------------------------

// Base Path in PRODUCTION
export const basePath = "/Recipe-Calculator";

// Base Path in DEVELOPMENT
// export const basePath = "http://localhost:5500/";

onAuthStateChanged(auth, async (user) => {
    if (user.emailVerified) {
        const divUserInfo = document.querySelector("#nav-user-info")
        const userNameTag = document.querySelector("#user-name")
        if (divUserInfo) {
            const userName = document.createElement("li");
            userName.classList = "nav-item list-group-item text-light fs-6"
            userName.classList
            userName.innerHTML = ` <a class="nav-link text-light fs-6" href="#">${user.email}</a>`;
            divUserInfo.appendChild(userName)
            
            const calculatorLink = document.createElement("li");
            calculatorLink.classList = "nav-item list-group-item text-light fs-6"
            calculatorLink.innerHTML = `<a class="nav-link myButton-success" href="templates/calculator.html">Go to Calculator</a>`;
            divUserInfo.appendChild(calculatorLink)

            const logout = document.createElement("li")
            logout.classList = "nav-item list-group-item text-light fs-6"
            logout.innerHTML = `<a class="myButton-success" id="logoutMain">Logout</a>`;
            divUserInfo.appendChild(logout)
            
            const logoutMain = document.querySelector("#logoutMain")
            logoutMain.addEventListener("click", async () => {
                try {
                    await signOut(auth)
                    window.location.href = `${basePath}/index.html`
                    alert("Logged out successfully")
                } catch (error) {
                    console.log(error)
                }
            })
        } else if (userNameTag) {
            if (user.displayName !== null) {
                userNameTag.textContent = `User: ${user.displayName}`
            } else {
                userNameTag.textContent = `User: ${user.email}`
            }
        }
    } else {
        // User is signed out
        // ...
    }
});

const register = document.querySelector("#registerLink")
const login = document.querySelector("#loginLink")

if (register || login) {
    register.addEventListener("click", () => {
        const login = document.querySelector("#loginFormContainer")
        login.classList = ("d-none")
        const register = document.querySelector("#registerFormContainer")
        register.classList = ("mt-2")
    })

    login.addEventListener("click", () => {
        const login = document.querySelector("#loginFormContainer")
        login.classList = ("mt-2")
        const register = document.querySelector("#registerFormContainer")
        register.classList = ("d-none")
    })
}

cleanLocalStorage()