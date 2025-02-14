import React from "react";
import { Link } from "react-router-dom";

export const Menu = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-transparent">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav gap-2">
            <li className="nav-item">
              <Link
                to="/Recipe-Calculator/my-ingredients"
                className="btn btn-outline-light fw-bold"
                id="myIngredients"
              >
                Ingredients
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/Recipe-Calculator/ingredient"
                className="btn btn-outline-light fw-bold"
                id="newIngredient"
              >
                New Ingredient
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/Recipe-Calculator/my-recipe/"
                className="btn btn-outline-light fw-bold"
                id="newRecipe"
              >
                New Recipe
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/Recipe-Calculator/my-recipes"
                className="btn btn-outline-light fw-bold"
                id="myRecipes"
              >
                Recipes
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/Recipe-Calculator/inventory"
                className="btn btn-outline-light fw-bold"
                id="inventory"
              >
                Inventory
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
