import React, { useState, useEffect } from "react";
import { NavBar } from './components/NavBar'
import { Abaut } from './components/Abaut'
import { LoginRegister } from './components/LoginRegister'
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { auth } from "./firebaseConfig";
import { Route, Routes } from 'react-router-dom'
import { MyRecipes } from './components/calculator/Recipes/MyRecipes';
import { MyRecipe } from './components/calculator/Recipes/MyRecipe';
import { MyIngredients } from './components/calculator/MyIngredients';
import { cleanLocalStorage } from './utilities/utils';
import { IngredientForm } from './components/calculator/Ingredients/IngredientForm';
import { Inventory } from './components/calculator/inventotry/Inventory';
import { useMainContext } from "./context/MainContext";

function App() {
  const { setUser, setIngredients, ingredientService, recipeService, setRecipes } = useMainContext();

  useEffect(() => {
    cleanLocalStorage()
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const ingredients = await ingredientService.getAllIngredients();
          setIngredients(ingredients.sort((a, b) => a.name.localeCompare(b.name)));

          const recipes = await recipeService.getAllRecipes();
          setRecipes(recipes.sort((a, b) => a.name.localeCompare(b.name)));
          setUser({
            email: currentUser.email,
            displayName: currentUser.displayName || null,
          });

        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Abaut />} />
        <Route path="/login-register" element={<LoginRegister />} />
        <Route path="/my-recipes" element={<MyRecipes />} />
        <Route path="/my-recipe/:recipeId?" element={<MyRecipe />} />
        <Route path="/my-ingredients" element={<MyIngredients />} />
        <Route path="/ingredient/:ingredientId?" element={<IngredientForm />} />
        <Route path="/inventory" element={<Inventory />} />
      </Routes>
    </>
  )
}

export default App