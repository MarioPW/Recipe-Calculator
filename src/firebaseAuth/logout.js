import { auth } from "../firebaseConfig.js"
import { signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

const logout = document.querySelector("#logout")

logout.addEventListener("click", async () => {
    try {
        await signOut(auth);
        window.location.href = "../../index.html";
        alert("Logged out successfully")
    } catch (error) {
        console.log(error);
    }
})