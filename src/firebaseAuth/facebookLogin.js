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
            console.log(error)
        }
    })
}