import { NavBar } from './components/NavBar'
import { Abaut } from './components/Abaut'
import { LoginRegister } from './components/LoginRegister'
import { Menu } from './components/calculator/Menu';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { auth } from "./firebaseConfig";
import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation } from 'react-router-dom'
import { MyRecipes } from './components/calculator/MyRecipes';
import { MyRecipe } from './components/calculator/MyRecipe';
import { MyIngredients } from './components/calculator/MyIngredients';
import { cleanLocalStorage } from './utilities/utils';
import { IngredientForm } from './components/calculator/Ingredients/IngredientForm';
import { RecipeForm } from './components/calculator/Recipes/RecipeForm';

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    cleanLocalStorage()
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && currentUser.emailVerified) {
        setUser({
          email: currentUser.email,
          displayName: currentUser.displayName || null,
        });
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
        <Route path="/Recipe-Calculator" element={<Abaut />} />
        <Route path="/Recipe-Calculator/login-register" element={<LoginRegister />} />
        <Route path="/Recipe-Calculator/menu" element={<Menu />} />
        <Route path="/Recipe-Calculator/my-recipes" element={<MyRecipes />} />
        <Route path="/Recipe-Calculator/recipe/:recipeId?" element={<RecipeForm />} />
        <Route path="/Recipe-Calculator/my-recipe/:recipeId" element={<MyRecipe />} />
        <Route path="/Recipe-Calculator/my-ingredients" element={<MyIngredients />} />
        <Route path="/Recipe-Calculator/ingredient/:ingredientId?" element={<IngredientForm />} />
      </Routes>
    </>
  )
}

export default App