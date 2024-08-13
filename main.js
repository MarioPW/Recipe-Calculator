import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { auth } from "./src/firebaseConfig.js"

import "./src/firebaseAuth/register.js"
import "./src/firebaseAuth/login.js"
import "./src/firebaseAuth/googleLogin.js"
import "./src/firebaseAuth/facebookLogin.js"

// Use this in PRODUCTION
export const basePath = "/Recipe-Calculator";

// Use this in DEVELOPMENT
// export const basePath = "http://localhost:5500/";

export let loggedUser = null
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        loggedUser = user
        
        // ...
    } else {
        // User is signed out
        // ...
    }
});

const register = document.querySelector("#registerLink")
const login = document.querySelector("#LoginLink")

if (register || login) {
    register.addEventListener("click", (e) => {
        const login = document.querySelector("#loginFormContainer")
        login.classList = ("hide")
        const register = document.querySelector("#registerFormContainer")
        register.classList = ("container d-flex flex-column")
    })
    
    login.addEventListener("click", (e) => {
        const login = document.querySelector("#loginFormContainer")
        login.classList = ("container d-flex flex-column")
        const register = document.querySelector("#registerFormContainer")
        register.classList = ("hide")
    })
}

