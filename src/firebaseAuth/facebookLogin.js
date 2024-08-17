import { auth } from "../firebaseConfig.js"
import { FacebookAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { basePath } from "../../main.js";


const facebookLoginButton = document.querySelector("#loginFacebook")
if (facebookLoginButton) {
    facebookLoginButton.addEventListener("click", async () => {
        const provider = new FacebookAuthProvider()
        try {
            const response = await signInWithPopup(auth, provider)
            window.location.href = `${basePath}/templates/calculator.html`
        } catch (error) {
            const firebaseErrors = {
                "auth/account-exists-with-different-credential": "Email already in use",
                "auth/invalid-credential": "Invalid credentials",
                "auth/invalid-email": "Invalid email",
                "auth/operation-not-allowed": "Operation not allowed",
                "auth/user-disabled": "User disabled",
                "auth/user-not-found": "User not found",
                "auth/unauthorized-domain": "Unauthorized Domain"
            }
            alert(firebaseErrors[error.code] || "Error logging in")
        }
    })
}