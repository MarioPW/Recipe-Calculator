import React, { useState } from 'react';
import {
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { auth, firebaseErrors } from "../../../firebaseConfig.js";
import { useNavigate } from 'react-router-dom';
import { useMainContext } from '../../../context/MainContext.jsx';
import { useTranslation } from 'react-i18next';
import { CustomButton } from '../../common/CustomButton.jsx';

export const LoginRegister = () => {
    const { t } = useTranslation();
    const [credentials, setCredentials] = useState({});
    const navigate = useNavigate();
    const { setUser } = useMainContext();
    const [showLogin, setShowLogin] = useState(true);
    const [registerData, setRegisterData] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [showRegisterPassword2, setShowRegisterPassword2] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };
    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData({ ...registerData, [name]: value });
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
                        <h5 className="text-center text-light rounded-2 p-2 bg-color-main">{t("auth.login")}</h5>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">{t("auth.email")}:</label>
                            <input type="email" className="form-control" id="email" name="email" placeholder="email@example.com" onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">{t("auth.password")}:</label>
                            <div className="input-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    placeholder="******"
                                    onChange={handleInputChange}
                                />
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    id="toggle-login-password"
                                >
                                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                </button>
                            </div>
                        </div>
                        <div className="d-flex gap-2 justify-content-between align-items-center">
                            <div className="d-flex gap-2">
                                <a className='fs-8' id="forgotPasswordLink" onClick={handleForgotPassword}>
                                    {t("auth.forgot_password")}
                                </a>
                                <a className='fs-8' id="registerLink" onClick={() => setShowLogin(false)} style={{ cursor: 'pointer' }}>
                                    {t("auth.not_registered")}
                                </a>
                            </div>
                            <CustomButton
                                type="submit"
                                className="dark"
                                label={t("auth.login")}
                                id="login-submit-btn"
                            />
                        </div>
                        <hr />
                        {/* Social GOOGLE Login */}
                        <CustomButton
                            type="button"
                            className=" bg-info my-1 text-light w-100"
                            onClick={() => handleSocialLogin(new GoogleAuthProvider(), auth)}
                            id="google-login-btn"
                        >
                            <img
                                src="https://cdn-teams-slug.flaticon.com/google.jpg"
                                style={{ width: "1.5rem", height: "1.5rem" }}
                                className="me-2 rounded-1"
                                alt="Google"
                            />
                            {t("auth.sign_in_google")}
                        </CustomButton>

                        {/* Social FACEBOOK Login */}
                        <CustomButton
                            type="button"
                            className=" bg-primary my-1 text-light w-100"
                            onClick={() => handleSocialLogin(new FacebookAuthProvider(), auth)}
                            id="facebook-login-btn"
                        >
                            <img
                                src="https://i.pinimg.com/originals/67/5c/af/675cafde751be69ba38a16504cb93e39.jpg"
                                style={{ width: "1.5rem", height: "1.5rem" }}
                                className="me-2 rounded-1"
                                alt="Facebook"
                            />
                            {t("auth.sign_in_facebook")}
                        </CustomButton>
                    </form>
                </div>
            ) : (
                <div className="mt-2 w-100 d-flex justify-content-center" id="registerFormContainer">
                    <form className="bg-light p-4 rounded-2" style={{ minWidth: "370px" }} id="registerForm" onSubmit={handleRegisterSubmit}>
                        <h5 className="text-center text-light rounded-2 p-2 bg-color-main">{t("auth.register")}</h5>
                        <div className="mb-3">
                            <label htmlFor="emailRegister" className="form-label">{t("auth.email")}:</label>
                            <input type="email" className="form-control" id="emailRegister" name="email" onChange={(e) => handleRegisterChange(e)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="passwordRegister" className="form-label">{t("auth.password")}:</label>
                            <div className="input-group">
                                <input
                                    type={showRegisterPassword ? "text" : "password"}
                                    className="form-control"
                                    id="passwordRegister"
                                    name="password"
                                    onChange={(e) => handleRegisterChange(e)}
                                />
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                                    id="toggle-register-password"
                                >
                                    <i className={`bi ${showRegisterPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                </button>
                            </div>
                            <div id="emailHelp" className="form-text">{t("auth.password_requirement")}</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password2Register" className="form-label">{t("auth.repeat_password")}</label>
                            <div className="input-group">
                                <input
                                    type={showRegisterPassword2 ? "text" : "password"}
                                    className="form-control"
                                    id="password2Register"
                                    name="password2"
                                    onChange={(e) => handleRegisterChange(e)}
                                />
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => setShowRegisterPassword2(!showRegisterPassword2)}
                                    id="toggle-register-password2"
                                >
                                    <i className={`bi ${showRegisterPassword2 ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                </button>
                            </div>
                        </div>
                        <div className="d-flex gap-2 justify-content-between align-items-center">
                            <a className='fs-8' id="loginLink" onClick={() => setShowLogin(true)} style={{ cursor: 'pointer' }}>
                                {t("auth.back_to_login")}
                            </a>
                            <CustomButton
                                type="submit"
                                className="dark"
                                label={t("auth.register")}
                                id="register-submit-btn"
                            />
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};
