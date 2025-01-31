// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLwd6jQmcE0RZ5r0N2MYWmV4eH9lXhzoo",
  authDomain: "recipe-calculator-c05cc.firebaseapp.com",
  projectId: "recipe-calculator-c05cc",
  storageBucket: "recipe-calculator-c05cc.appspot.com",
  messagingSenderId: "522360127315",
  appId: "1:522360127315:web:cb1e56bd85c980b4736ba6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const firebaseErrors = {
  "auth/account-exists-with-different-credential": "Email already in use",
  "auth/invalid-credential": "Invalid credentials",
  "auth/invalid-email": "Invalid email",
  "auth/operation-not-allowed": "Operation not allowed",
  "auth/user-disabled": "User disabled",
  "auth/user-not-found": "User not found",
  "auth/unauthorized-domain": "Unauthorized Domain",
  "auth/invalid-login-credentials": "Invalid email or password",
  "auth/missing-password": "Missing password",
  "auth/missing-email": "Missing email"
}