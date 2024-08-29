import { auth } from "../firebaseConfig.js"
import { createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { basePath } from "../../main.js";

export const register = document.querySelector("#registerForm")
if (register) {
    register.addEventListener("submit", async (e) => {
        e.preventDefault()
        const user = Object.fromEntries(new FormData(register))
        if (user.password === user.password2) {
            try {
                const response = await createUserWithEmailAndPassword(auth, user.email, user.password)
                await sendEmailVerification(response.user)
                alert("Check your email to verify your account")
                await response.user.reload()
                if (response.user.emailVerified) {
                    alert(`Welcome ${response.user.displayName || response.user.email} !!!`);
                } else {
                    alert("Please verify your email before accessing the calculator.");
                }
            } catch (error) {
                const firebaseErrors = {
                    "auth/weak-password": "Password must have at least 6 characters",
                    "auth/email-already-in-use": "Email already in use",
                    "auth/invalid-email": "Invalid email",
                    "auth/missing-password": "Missing password",
                    "auth/missing-email": "Missing email"
                }
                alert(firebaseErrors[error.code] || "Error creating user")
            }
        } else {
            alert("Passwords must match")
        }
    })
}
