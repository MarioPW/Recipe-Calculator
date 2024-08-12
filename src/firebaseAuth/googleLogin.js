import { auth } from "../firebaseConfig.js"
import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";


const googleLoginButton = document.querySelector("#loginGoogle")
if (googleLoginButton) {
    googleLoginButton.addEventListener("click", async () => {
        const provider = new GoogleAuthProvider()
        try {
            const response = await signInWithPopup(auth, provider)
            window.location.href = "../templates/calculator.html"
        } catch (error) {
            console.log(error)
        }
    })
}