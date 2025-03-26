import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { Link } from "react-router-dom";
import { useMainContext } from "../context/MainContext";
import { signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { useTranslation } from "react-i18next";

export const NavBar = () => {
  const { user } = useMainContext();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const langs = {
    es: "https://flagcdn.com/w40/mx.png",
    en: "https://flagcdn.com/w40/us.png",
    fr: "https://flagcdn.com/w40/fr.png",
    it: "https://flagcdn.com/w40/it.png"
  }
  const [lang, setLang] = useState(langs[localStorage.getItem("lang") || "en"]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setLang(langs[lang]);
  };

  const handleLogout = async () => {
    if (!user) return;
    if (confirm(t("navbar.logout_confirm"))) {
      try {
        await signOut(auth);
        navigate("/");
        alert(t("navbar.logout_success"));
      } catch (error) {
        console.error("Error logging out:", error);
      }
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg mx-auto fixed-top bg-color-main px-2" style={{ height: "50px" }}>
        <div className="container-fluid">
          <a className="navbar-brand text-light" href="#">
            <img src="favicon.png" alt="@PW" style={{ width: "30px" }} /> {t("navbar.title")}
          </a>
          <button
            className="navbar-toggler bg-light"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse z-3 bg-color-main pb-3 pb-sm-0" id="navbarSupportedContent" style={{ height: "50px" }}>
            {user ? (
              <>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link to="/my-ingredients" className="btn custom-btn text-light w-100 text-start">
                      <i className="bi bi-basket me-2"></i>
                      {t("navbar.ingredients")}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/my-recipes" className="btn custom-btn text-light w-100 text-start">
                      <i className="bi bi-card-list me-2"></i>
                      {t("navbar.recipes")}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/inventory" className="btn custom-btn text-light w-100 text-start">
                      <i className="bi bi-box-seam me-2"></i>
                      {t("navbar.inventory")}
                    </Link>
                  </li>
                </ul>
                <div className="d-flex align-items-center gap-2 mb-3 mb-lg-0">
                  <div className="dropdown">
                    <button
                      className="btn btn-sm text-light dropdown-toggle"
                      type="button"
                      id="dropdownLanguage"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      aria-label="Select language"
                    >
                      <img src={lang} alt="Selected language" width="20" />
                    </button>
                    <ul className="dropdown-menu dropdown-menu-lg-end" aria-labelledby="dropdownLanguage">
                      {langs &&
                        Object.keys(langs).map((key) => (
                            <li key={key}>
                              <button className="dropdown-item" onClick={() => changeLanguage(key)}>
                                <img src={langs[key]} alt={`${key} flag`} width="20" /> {t(`language.${key}`)}
                              </button>
                            </li>
                          )
                        )}
                    </ul>
                  </div>
                  <h6 className="text-light m-0">{user.displayName || user.email}</h6>

                  <button className="myButton-purple fw-light border-0 py-1 fs-6" onClick={handleLogout}>
                    {t("navbar.logout")}
                  </button>
                </div>

              </>
            ) : (
              <li className="nav-item list-group-item text-light fs-6">
                <Link to="/login-register" className="myButton-success">
                  {t("navbar.login_register")}
                </Link>
              </li>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};
