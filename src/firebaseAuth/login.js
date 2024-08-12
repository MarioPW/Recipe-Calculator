import { auth } from "../firebaseConfig.js"
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { basePath } from "../../main.js";

const login = document.querySelector("#loginForm")

if (login) {
    login.addEventListener("submit", async (e) => {
        e.preventDefault()
        const credentials = Object.fromEntries(new FormData(login))
        try {
            const user = await signInWithEmailAndPassword(auth, credentials.email, credentials.password)
            window.location.href = `${basePath}/templates/calculator.html`
        } catch (error) {
            const firebaseErrors = {
                "auth/invalid-login-credentials": "Invalid email or password",
                "auth/missing-password": "Missing password"
            }
            alert(firebaseErrors[error.code] || "Error logging in")
        }
    })
}
