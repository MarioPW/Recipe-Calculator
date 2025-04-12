import React, { useState } from 'react';
import {
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { auth, firebaseErrors } from "../firebaseConfig.js";
import { useNavigate } from 'react-router-dom';
import { useMainContext } from '../context/MainContext';
import { useTranslation } from 'react-i18next';

export const LoginRegister = () => {
    const { t } = useTranslation();
    const [credentials, setCredentials] = useState({});
    const navigate = useNavigate();
    const { setUser } = useMainContext();
    const [showLogin, setShowLogin] = useState(true);
    const [registerData, setRegisterData] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };
    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData({ ...registerData, [name]: value });
        console.log(registerData)
    };
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        const { email, password, password2 } = registerData;
        console.log(registerData)
        if (password !== password2) {
            alert(t("auth.passwords_not_match"));
            return;
        }
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            const userName = response.user.email;
            alert(`${t("auth.welcome")}, ${userName} !!!`);
            navigate("/");
        } catch (error) {
            alert(firebaseErrors[error.code] || t("auth.register_error"));
        }
    };

    const handleSocialLogin = async (provider, auth) => {
        try {
            const response = await signInWithPopup(auth, provider);
            const userName = response.user.displayName || response.user.email;
            alert(`${t("auth.welcome")}, ${userName} !!!`);
            navigate("/");
        } catch (error) {
            alert(firebaseErrors[error.code] || t("auth.login_error"));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
            const userName = response.user.displayName || response.user.email;
            alert(`${t("auth.welcome")}, ${userName} !!!`);
            navigate(`/`);
        } catch (error) {
            alert(firebaseErrors[error.code] || t("auth.login_error"));
        }
    };

    const handleForgotPassword = async () => {
        if (!credentials.email) {
            alert(t("auth.enter_email_reset"));
            return;
        }
        try {
            await sendPasswordResetEmail(auth, credentials.email);
            alert(t("auth.password_reset_sent"));
        } catch (error) {
            alert(firebaseErrors[error.code] || t("auth.password_reset_error"));
        }
    };

    return (
        <>
            {showLogin ? (
                <div className="mt-2 w-100 d-flex justify-content-center" id="loginFormContainer">
                    <form className="bg-light p-4 rounded-2" id="loginForm" onSubmit={handleSubmit}>
                        <h5 className="text-center text-light rounded-2 p-2 bg-success">{t("auth.login")}</h5>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">{t("auth.email")}:</label>
                            <input type="email" className="form-control" id="email" name="email" placeholder="email@example.com" onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">{t("auth.password")}:</label>
                            <input type="password" className="form-control" id="password" name="password" placeholder="******" onChange={handleInputChange} />
                        </div>
                        <div className="d-flex gap-2 justify-content-between align-items-center">
                            <div className="d-flex gap-2">
                                <a className='fs-6' id="forgotPasswordLink" onClick={handleForgotPassword}>
                                    {t("auth.forgot_password")}
                                </a>
                                <a className='fs-6' id="registerLink" onClick={() => setShowLogin(false)} style={{ cursor: 'pointer' }}>
                                    {t("auth.not_registered")}
                                </a>
                            </div>
                            <button type="submit" className="btn btn-primary">{t("auth.login")}</button>
                        </div>
                        <hr />
                        <button className="btn btn-info my-1 text-light w-100" type="button" onClick={() => handleSocialLogin(new GoogleAuthProvider(), auth)}>
                            <img src="https://cdn-teams-slug.flaticon.com/google.jpg" style={{ width: "1.5rem", height: "1.5rem" }} className="me-2 rounded-1" alt="Google" />
                            {t("auth.sign_in_google")}
                        </button>
                        <button className="btn btn-primary my-1 text-light w-100" type="button" onClick={() => handleSocialLogin(new FacebookAuthProvider(), auth)}>
                            <img src="https://i.pinimg.com/originals/67/5c/af/675cafde751be69ba38a16504cb93e39.jpg" style={{ width: "1.5rem", height: "1.5rem" }} className="me-2 rounded-1" alt="Facebook" />
                            {t("auth.sign_in_facebook")}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="mt-2 w-100 d-flex justify-content-center" id="registerFormContainer">
                    <form className="bg-light p-4 rounded-2" style={{ minWidth: "370px" }} id="registerForm" onSubmit={handleRegisterSubmit}>
                        <h5 className="text-center text-light rounded-2 p-2 bg-success">{t("auth.register")}</h5>
                        <div className="mb-3">
                            <label htmlFor="emailRegister" className="form-label">{t("auth.email")}:</label>
                            <input type="email" className="form-control" id="emailRegister" name="email" onChange={(e) => handleRegisterChange(e)}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="passwordRegister" className="form-label">{t("auth.password")}:</label>
                            <input type="password" className="form-control" id="passwordRegister" name="password" onChange={(e) => handleRegisterChange(e)}/>
                            <div id="emailHelp" className="form-text">{t("auth.password_requirement")}</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password2Register" className="form-label">{t("auth.repeat_password")}</label>
                            <input type="password" className="form-control" id="password2Register" name="password2" onChange={(e) => handleRegisterChange(e)}/>
                        </div>
                        <div className="d-flex gap-2 justify-content-between align-items-center">
                            <a className='fs-6' id="loginLink" onClick={() => setShowLogin(true)} style={{ cursor: 'pointer' }}>
                                {t("auth.back_to_login")}
                            </a>
                            <button type="submit" className="btn btn-primary">{t("auth.register")}</button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};
