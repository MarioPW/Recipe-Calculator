// React
import { useEffect } from "react";
import { Route, Routes } from 'react-router-dom'
import { Suspense } from "react";

// Components
import { Home } from "./components/Home";
import { NavBar } from './components/NavBar'
import { LoginRegister } from './components/LoginRegister'
import { MyRecipes } from './components/screens/Recipes/MyRecipes';
import { MyRecipe } from './components/screens/Recipes/MyRecipe';
import { MyIngredients } from './components/screens/Ingredients/MyIngredients';
import { IngredientForm } from './components/screens/Ingredients/IngredientForm';
import { Inventory } from './components/screens/inventotry/Inventory';
import { Spinner } from './components/common/Spinner';

// Utilities
import { cleanLocalStorage, checkIngredientsOrder } from './utilities/utils';
import { useMainContext } from "./context/MainContext";

// Firebase
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { auth } from "./firebaseConfig";


function App() {
  const { setUser, setIngredients, ingredientService, recipeService, setRecipes } = useMainContext();

  useEffect(() => {
    cleanLocalStorage()
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const orderedIngredients = checkIngredientsOrder()
        try {
          const ingredients = await ingredientService.getAllIngredients();
          switch (orderedIngredients) {
            case 'name':
              setIngredients(ingredients.sort((a, b) => a.name.localeCompare(b.name)));
              break;
            case 'reference':
              setIngredients(ingredients.sort((a, b) => {
                const refA = a.reference ? parseInt(a.reference, 10) : Infinity;
                const refB = b.reference ? parseInt(b.reference, 10) : Infinity;
                return refA - refB;
              }));
              break;
            default:
              setIngredients(ingredients);
          }

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
      <div className="fixed-top">
        <NavBar />
      </div>
      <Suspense fallback={<Spinner />}>
        <div style={{ paddingTop: '64px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login-register" element={<LoginRegister />} />
            <Route path="/my-recipes" element={<MyRecipes />} />
            <Route path="/my-recipe/:recipeId?" element={<MyRecipe />} />
            <Route path="/my-ingredients" element={<MyIngredients />} />
            <Route path="/ingredient/:ingredientId?" element={<IngredientForm />} />
            <Route path="/inventory" element={<Inventory />} />
          </Routes>
        </div>
      </Suspense>
    </>
  )
}

export default App