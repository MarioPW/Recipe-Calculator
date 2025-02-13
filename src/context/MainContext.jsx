import { createContext, useState, useContext } from "react";
import { IngredientRepo } from "../ingredients/services";
import { RecipeRepo } from "../recipes/sevices";

export const MainContext = createContext();

export const MainProvider = ({ children }) => {
    const [user, setUser] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [recipe, setRecipe] = useState({});
    const ingredientRepo = new IngredientRepo();
    const recipeRepo = new RecipeRepo ();
    return (
        <MainContext.Provider value={{ user, setUser, recipes, setRecipes, ingredients, setIngredients, recipe, setRecipe, ingredientRepo, recipeRepo }}>
            {children}
        </MainContext.Provider>
    );
}
export const useMainContext = () => {

    const context = useContext(MainContext);

    if (!context) {
        throw new Error("useMainContext must be used within a MainProvider");
    }
    return context;
} 