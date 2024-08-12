import { auth } from "../firebaseConfig.js"
import { signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { basePath } from "../../main.js";

const logout = document.querySelector("#logout")

logout.addEventListener("click", async () => {
    try {
        await signOut(auth);
        window.location.href = `${basePath}/templates/index.html`
        alert("Logged out successfully")
    } catch (error) {
        console.log(error);
    }
})