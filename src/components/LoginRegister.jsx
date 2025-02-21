import React, { useState } from 'react'
import {
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { auth, firebaseErrors } from "../firebaseConfig.js"
import { useNavigate } from 'react-router-dom';
import { useMainContext } from '../context/MainContext';

export const LoginRegister = () => {
    const [credentials, setCredentials] = useState({})
    const navigate = useNavigate();
    const { setUser } = useMainContext();
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    }
    const [showLogin, setShowLogin] = useState(true);
    const handleSocialLogin = async (provider, auth) => {
        try {
            const response = await signInWithPopup(auth, provider);
            const userName = response.user.displayName || response.user.email;
            alert(`Welcome ${userName} !!!`);
            navigate("/");
        } catch (error) {
            alert(firebaseErrors[error.code] || "Error logging in")
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await signInWithEmailAndPassword(auth, credentials.email, credentials.password)
            const userName = response.user.displayName || response.user.email;
            // setUser(response.user)
            alert(`Welcome ${userName} !!!`);
            navigate(`/`);
        } catch (error) {
            alert(firebaseErrors[error.code] || "Error logging in")
        }
    };
    const handleForgotPassword = async () => {
        if (!credentials.email) {
            alert("Please enter your email address to reset your password.");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, credentials.email);
            alert("Password reset email sent! Please check your inbox.");
        } catch (error) {
            alert(firebaseErrors[error.code] || "Error sending password reset email.");
        }
    };
    return (
        <>
            {showLogin && (
                <div className="mt-2" id="loginFormContainer">
                    <form className="bg-light p-4 rounded-2" id="loginForm" onSubmit={handleSubmit}>
                        <h5 className="text-center text-light rounded-2 p-2 bg-success">Login</h5>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email address:</label>
                            <input type="email" className="form-control" id="email" name="email" placeholder="email@example.com" onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password:</label>
                            <input type="password" className="form-control" id="password" name="password" placeholder="******" onChange={handleInputChange} />
                        </div>
                        <div className="d-flex gap-2 justify-content-between align-items-center">
                            <div className="d-flex gap-2">
                                <a className='fs-6'
                                    id="forgotPasswordLink"
                                    onClick={handleForgotPassword}>Forgot Password?</a>
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
                        <button className="btn btn-info my-1 text-light w-100" type="button" onClick={() => handleSocialLogin(new GoogleAuthProvider(), auth)}>
                            <img
                                src="https://cdn-teams-slug.flaticon.com/google.jpg"
                                style={{ width: "1.5rem", height: "1.5rem" }}
                                className="me-2 rounded-1"
                                alt="Google"
                            />Sign in with Google
                        </button>
                        <button className="btn btn-primary my-1 text-light w-100" type="button" onClick={() => handleSocialLogin(new FacebookAuthProvider(), auth)}>
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
