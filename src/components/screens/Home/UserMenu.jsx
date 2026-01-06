import React from "react";
import { useTranslation } from "react-i18next";

export const UserMenu = ({ user, lang, langs, handleLogout, changeLanguage, closeNavbar }) => {
  const { t } = useTranslation();

  return (
    <div className="dropdown">
      <button
        className="btn btn-sm btn-outline-light dropdown-toggle d-flex align-items-center gap-2"
        type="button"
        id="userDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <img src={lang} alt="Selected language" width="20" />
        <span className="d-md-inline">{user?.displayName || user?.email}</span>
      </button>

      <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">

        <li className="dropdown-item text-muted small">
          {user?.displayName || user?.email}
        </li>
        {Object.keys(langs).map((key) => (
          <li key={key}>
            <button
              className="dropdown-item"
              onClick={() => {
                changeLanguage(key);
                closeNavbar();
              }}
            >
              <img src={langs[key]} alt={`${key} flag`} width="20" className="me-2" />
              {t(`language.${key}`)}
            </button>
          </li>
        ))}
        <li><hr className="dropdown-divider" /></li>
        <li>
          <button
            className="dropdown-item text-danger"
            onClick={() => {
              handleLogout();
              closeNavbar();
            }}
          >
            {t("navbar.logout")}
          </button>
        </li>
      </ul>
    </div>
  );
};
