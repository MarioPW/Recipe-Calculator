import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { useMainContext } from "../context/MainContext";
import { signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { useTranslation } from "react-i18next";
import { SecondaryNavbar } from "./common/SecondaryNavbar";
import { UserMenu } from "./UserMenu";

export const NavBar = () => {
  const { user } = useMainContext();
  const navigate = useNavigate();
  const navbarCollapseRef = useRef(null);
  const { t, i18n } = useTranslation();

  const langs = {
    es: "https://flagcdn.com/w40/mx.png",
    en: "https://flagcdn.com/w40/us.png",
  };

  const [lang, setLang] = useState(langs[localStorage.getItem("lang") || "en"]);

  const changeLanguage = (langKey) => {
    i18n.changeLanguage(langKey);
    localStorage.setItem("lang", langKey);
    setLang(langs[langKey]);
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

  const closeNavbar = () => {
    if (navbarCollapseRef.current) {
      const bsCollapse = window.bootstrap.Collapse.getInstance(navbarCollapseRef.current);
      if (bsCollapse) bsCollapse.hide();
    }
  };

  const title = (
    <>
      <a className="navbar-brand text-light" href="#">
        <img src="favicon.png" alt="@PW" style={{ width: "30px" }} /> {t("navbar.title")}
      </a>
    </>
  );

  const links = user
    ? [
      { label: t("navbar.ingredients"), url: "/my-ingredients" },
      { label: t("navbar.recipes"), url: "/my-recipes" },
      { label: t("navbar.inventory"), url: "/inventory" },
    ]
    : [];

  const buttons = !user
    ? [
      {
        label: t("navbar.login_register"),
        action: () => {
          closeNavbar();
          navigate("/login-register");
        },
      },
    ]
    : [];

  const children = [
    <UserMenu
      key="user-menu"
      user={user}
      langs={langs}
      lang={lang}
      handleLogout={handleLogout}
      changeLanguage={changeLanguage}
      closeNavbar={closeNavbar}
    />,
  ];

  return (
    <SecondaryNavbar
      title={title}
      buttons={buttons}
      links={links}
      children={children}
      collapseButtonId="navbarCollapse"
      border={false}
    />
  );
};


