import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { Link } from "react-router-dom";
import { useMainContext } from "../context/MainContext";
import { signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";


export const NavBar = () => {
  const { user } = useMainContext()
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const closeNavbar = () => setIsOpen(false);

  const handleLogout = async () => {
    if (!user) return
    if (confirm("Are you sure you want to log out?")) {
      try {
        await signOut(auth);
        navigate("/");
        alert("Logged out successfully");
      } catch (error) {
        console.error("Error logging out:", error);
      }
    } else {
      return;
    }

  };
  return (
    <>
      <nav className="navbar navbar-expand-lg mx-auto fixed-top bg-color-main px-2" style={{ height: "50px" }}>
        <div className="container-fluid">
          <a className="navbar-brand text-light" href="#"><img src="favicon.png" alt="@PW" style={{ width: "30px" }} /> Recipe Master</a>
          <button className="navbar-toggler bg-light"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse z-3 bg-color-main pb-3 pb-sm-0" id="navbarSupportedContent" style={{ height: "50px" }}>
            {user ? (
              <>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link
                      to="/my-ingredients"
                      className="btn custom-btn text-light w-100 text-start"
                      id="myIngredients"
                    >
                      <i className="bi bi-basket me-2"></i>
                      Ingredients
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/my-recipes"
                      className="btn custom-btn text-light w-100 text-start"
                      id="myRecipes"
                    >
                      <i className="bi bi-card-list me-2"></i>
                      Recipes
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      to="/inventory"
                      className="btn custom-btn text-light w-100 text-start"
                      id="inventory"
                    >
                      <i className="bi bi-box-seam me-2"></i>
                      Inventory
                    </Link>
                  </li>
                </ul>
                <div className="d-flex align-items-center gap-2">
                  <h6 className="text-light m-0">{user.displayName || user.email}</h6>
                  <button
                    className="myButton-purple fw-light border-0 py-1 fs-6"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>

              </>
            ) : (
              <li className="nav-item list-group-item text-light fs-6">
                <Link to="/login-register" className="myButton-success">Log In / Register </Link>
              </li>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};
