import React, { useState } from 'react'
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { basePath } from "../../main.js";
import { auth } from "../firebaseConfig.js"


export const LoginRegister = () => {
    const [showLogin, setShowLogin] = useState(true);
    const handleSocialLogin = async (provider, auth) => {
        try {
            const response = await signInWithPopup(auth, provider);
            const userName = response.user.displayName || response.user.email;
            alert(`Welcome ${userName} !!!`);
            window.location.href = "/templates/calculator.html";
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
    }
    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        handleSocialLogin(provider, auth);
    }
    const handleFacebookLogin = async () => {
        const provider = new FacebookAuthProvider();
        handleSocialLogin(provider, auth);
    }

    return (
        <>
            {/* Formulario de Login */}
            {showLogin && (
                <div className="mt-2" id="loginFormContainer">
                    <form className="bg-light p-4 rounded-2" id="loginForm">
                        <h5 className="text-center text-light rounded-2 p-2 bg-success">Login</h5>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email address:</label>
                            <input type="email" className="form-control" id="email" name="email" placeholder="email@example.com" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password:</label>
                            <input type="password" className="form-control" id="password" name="password" placeholder="******" />
                        </div>
                        <div className="d-flex gap-2 justify-content-between align-items-center">
                            <div className="d-flex gap-2">
                                <a className='fs-6' id="forgotPasswordLink">Forgot Password?</a>
                                <a
                                    className='fs-6'
                                    id="registerLink"
                                    onClick={() => setShowLogin(false)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Not registered? Click here!
                                </a>
                            </div>
                            <button type="submit" className="btn btn-primary">Login</button>
                        </div>
                        <hr />
                        <button  className="btn btn-info my-1 text-light w-100" type="button" onClick={handleGoogleLogin}>
                            <img
                                src="https://cdn-teams-slug.flaticon.com/google.jpg"
                                style={{ width: "1.5rem", height: "1.5rem" }}
                                className="me-2 rounded-1"
                                alt="Google"
                            />Sign in with Google
                        </button>
                        <button  className="btn btn-primary my-1 text-light w-100" type="button" onClick={handleFacebookLogin}>
                            <img
                                src="https://i.pinimg.com/originals/67/5c/af/675cafde751be69ba38a16504cb93e39.jpg"
                                style={{ width: "1.5rem", height: "1.5rem" }}
                                className="me-2 rounded-1"
                                alt="Facebook"
                            />Sign in with Facebook
                        </button>
                    </form>
                </div>
            )}

            {/* Formulario de Registro */}
            {!showLogin && (
                <div className="mt-2" id="registerFormContainer">
                    <form className="bg-light p-4 rounded-2" id="registerForm">
                        <h5 className="text-center text-light rounded-2 p-2 bg-success">Register</h5>
                        <div className="mb-3">
                            <label htmlFor="emailRegister" className="form-label">Email address:</label>
                            <input type="email" className="form-control" id="emailRegister" name="email" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="passwordRegister" className="form-label">Password:</label>
                            <input type="password" className="form-control" id="passwordRegister" name="password" />
                            <div id="emailHelp" className="form-text">At least 6 characters.</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password2Register" className="form-label">Repeat Password</label>
                            <input type="password" className="form-control" id="password2Register" name="password2" />
                        </div>
                        <div className="d-flex gap-2 justify-content-between align-items-center">
                            <a
                                className='fs-6'
                                id="loginLink"
                                onClick={() => setShowLogin(true)}
                                style={{ cursor: 'pointer' }}
                            >
                                Back to Login
                            </a>
                            <button type="submit" className="btn btn-primary">Register</button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};
