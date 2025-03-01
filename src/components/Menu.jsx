import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useMainContext } from "../context/MainContext";

export const Menu = ({ signOut, auth }) => {
  const navigate = useNavigate();
  const { setRecipe, user } = useMainContext();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
      alert("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <button
        className="navbar-toggler custom-toggler"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasDarkNavbar"
        aria-controls="offcanvasDarkNavbar"
        aria-label="Toggle navigation"
      >
        <i className="bi bi-cookie"></i>
      </button>

      <div
        className="offcanvas offcanvas-end text-bg-dark custom-offcanvas"
        tabIndex="-1"
        id="offcanvasDarkNavbar"
        aria-labelledby="offcanvasDarkNavbarLabel"
      >
        <div className="offcanvas-header border-bottom p-3">
          <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">
            Menu
          </h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>

        <div className="offcanvas-body d-flex flex-column gap-3">
          <ul className="navbar-nav gap-3">
            <li className="nav-item">
              <Link
                onClick={() => navigate("/my-ingredients")}
                className="btn custom-btn text-light w-100 text-start"
                id="myIngredients"
                data-bs-dismiss="offcanvas"
              >
                <i className="bi bi-basket me-2"></i>
                Ingredients
              </Link>
            </li>
            {/* <li className="nav-item">
              <Link
                onClick={() => navigate("/ingredient")}
                className="btn custom-btn text-light w-100 text-start"
                id="newIngredient"
                data-bs-dismiss="offcanvas"
              >
                <i className="bi bi-plus-circle me-2"></i>
                New Ingredient
              </Link>
            </li> */}
            {/* <li className="nav-item">
              <Link
                onClick={() => {
                  setRecipe({});
                  navigate("/my-recipe");
                }}
                className="btn custom-btn text-light w-100 text-start"
                id="newRecipe"
                data-bs-dismiss="offcanvas"
              >
                <i className="bi bi-file-earmark-plus me-2"></i>
                New Recipe
              </Link>
            </li> */}
            <li className="nav-item">
              <Link
                onClick={() => navigate("/my-recipes")}
                className="btn custom-btn text-light w-100 text-start"
                id="myRecipes"
                data-bs-dismiss="offcanvas"
              >
                <i className="bi bi-card-list me-2"></i>
                Recipes
              </Link>
            </li>
            <li className="nav-item">
              <Link
                onClick={() => navigate("/inventory")}
                className="btn custom-btn text-light w-100 text-start"
                id="inventory"
                data-bs-dismiss="offcanvas"
              >
                <i className="bi bi-box-seam me-2"></i>
                Inventory
              </Link>
            </li>
          </ul>

          {user && (
            <button
              className="myButton-danger border-0 py-2 fs-6 mt-auto"
              onClick={handleLogout}
              data-bs-dismiss="offcanvas"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
};
