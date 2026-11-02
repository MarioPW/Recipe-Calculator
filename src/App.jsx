// React
import { lazy, Suspense, useEffect, useRef } from "react";
import { Route, Routes } from 'react-router-dom'

// Components
import { NavBar } from './components/screens/Home/NavBar'
import { Inventory } from './components/screens/inventotry/Inventory';
import { Spinner } from './components/common/Spinner';

// Screens loaded on demand to keep the initial bundle small
const Home = lazy(() => import('./components/screens/Home/Home').then(m => ({ default: m.Home })));
const LoginRegister = lazy(() => import('./components/screens/Home/LoginRegister').then(m => ({ default: m.LoginRegister })));
const MyRecipes = lazy(() => import('./components/screens/Recipes/MyRecipes').then(m => ({ default: m.MyRecipes })));
const MyRecipe = lazy(() => import('./components/screens/Recipes/MyRecipe').then(m => ({ default: m.MyRecipe })));
const MyIngredients = lazy(() => import('./components/screens/Ingredients/MyIngredients').then(m => ({ default: m.MyIngredients })));
const IngredientForm = lazy(() => import('./components/screens/Ingredients/IngredientForm').then(m => ({ default: m.IngredientForm })));

// Utilities
import { cleanLocalStorage, checkIngredientsOrder } from './utilities/utils';
import { useMainContext } from "./context/MainContext";

// Firebase
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { auth } from "./firebaseConfig";


function App() {
  const { setUser, setIngredients, ingredientService, recipeService, setRecipes } = useMainContext();
  const prevUidRef = useRef(null);

  useEffect(() => {
    cleanLocalStorage()
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        if (prevUidRef.current && prevUidRef.current !== currentUser.uid) {
          localStorage.removeItem("unsavedInventoryChanges");
          localStorage.removeItem(`unsavedInventoryChanges_${prevUidRef.current}`);
          localStorage.removeItem("ingredientsSort");
          localStorage.removeItem("recipeTitle");
          localStorage.removeItem("ingredients");
          localStorage.removeItem("valuesList");
        }
        prevUidRef.current = currentUser.uid;

        const orderedIngredients = checkIngredientsOrder()
        const currentOrder = orderedIngredients || 'reference';
        try {
          const ingredients = await ingredientService.getAllIngredients();
          switch (currentOrder) {
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
        if (prevUidRef.current) {
          localStorage.removeItem(`unsavedInventoryChanges_${prevUidRef.current}`);
        }
        localStorage.removeItem("unsavedInventoryChanges");
        localStorage.removeItem("ingredientsSort");
        localStorage.removeItem("recipeTitle");
        localStorage.removeItem("ingredients");
        localStorage.removeItem("valuesList");
        prevUidRef.current = null;
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
