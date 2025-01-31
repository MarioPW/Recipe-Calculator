import { MyRecipes } from "./MyRecipes";
import React from "react";
import { Link } from "react-router-dom";

export const Menu = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 w-100 bg-dark">
      <div className="d-grid gap-4">
        <Link
          to="/Recipe-Calculator/my-recipe/new"
          href="#"
          className="btn btn-outline-light text-uppercase fw-bold square-button"
          id="newRecipe"
        >
          New Recipe
        </Link>
        <Link
          to="/Recipe-Calculator/ingredient/new"
          className="btn btn-outline-light text-uppercase fw-bold square-button"
          id="newIngredient"
        >
          New Ingredient
        </Link>
        <Link
          to="/Recipe-Calculator/my-recipes"
          className="btn btn-outline-light text-uppercase fw-bold square-button"
          id="myRecipes"
        >
          My Recipes
        </Link>
        <Link
          to="/Recipe-Calculator/my-ingredients"
          className="btn btn-outline-light text-uppercase fw-bold square-button"
          id="myIngredients"
        >
          My Ingredients
        </Link>
      </div>
    </div>
  );
};
