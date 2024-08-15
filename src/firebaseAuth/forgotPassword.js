import { auth } from "../firebaseConfig.js"
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

const forgotPassword = document.querySelector("#forgotPasswordLink")
if (forgotPassword) {
    const email = document.querySelector("#email")
    forgotPassword.addEventListener("click", async () => {
        try {
            await sendPasswordResetEmail(auth, email.value)
            alert("Password reset email sent")
        } catch (error) {
            const firebaseErrors = {
                "auth/invalid-value-(email)": "You must enter a valid email",
                "auth/missing-email": "Please enter your Email",
            }
            alert(firebaseErrors[error.code] || "Error sending password reset email")
        }
    })
}
