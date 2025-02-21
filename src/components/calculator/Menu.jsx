import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useMainContext } from "../../context/MainContext";


export const Menu = ({signOut, auth}) => {
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
    <nav className="navbar navbar-dark bg-dark">
      <div className="container">


        <Link className="navbar-brand text-light fs-6 fst-italic" to="/"><img src="favicon.png" alt="@PW" style={{ width: "25px" }} /> Recipe Calculator</Link>

        <ul className="d-flex flex-row align-items-center mb-0 gap-3">
          {user ? (
            <>
              <li className="nav-item list-group-item text-light fs-6">
                <a className="nav-link text-light fs-6" href="#">
                  {user.displayName || user.email}
                </a>
              </li>

              <li className="nav-item list-group-item text-light fs-6">
                <button className="btn myButton-success" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li className="nav-item list-group-item text-light fs-6">
              <Link to="/login-register" className="btn myButton-success">Log In / Register </Link>
            </li>
          )}
        </ul>

        {/* <a className="navbar-brand" href="#">Offcanvas dark navbar</a> */}
        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="offcanvas offcanvas-end text-bg-dark" tabIndex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
          <div className="offcanvas-header">
            {/* <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">Dark offcanvas</h5> */}


            <nav className="navbar navbar-dark">

            </nav>


            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav gap-2">
              <li className="nav-item">
                <Link
                  onClick={() => navigate("/my-ingredients")}
                  className="btn border-bottom fw-bold text-light"
                  id="myIngredients"
                  data-bs-dismiss="offcanvas"
                >
                  Ingredients
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  onClick={() => {navigate("/ingredient") }}
                  className="btn border-bottom fw-bold text-light"
                  id="newIngredient"
                  data-bs-dismiss="offcanvas"
                >
                  New Ingredient
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  onClick={() => { setRecipe({}); navigate("/my-recipe") }}
                  className="btn border-bottom fw-bold text-light"
                  id="newRecipe"
                  data-bs-dismiss="offcanvas"
                >
                  New Recipe
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  onClick={() => navigate("/my-recipes")}

                  className="btn border-bottom fw-bold text-light"
                  id="myRecipes"
                  data-bs-dismiss="offcanvas"
                >
                  Recipes
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  onClick={() => navigate("/inventory")}
                  className="btn border-bottom fw-bold text-light"
                  id="inventory"
                  data-bs-dismiss="offcanvas"
                >
                  Inventory
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};
