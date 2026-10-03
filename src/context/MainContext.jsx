import { createContext, useState, useContext } from "react";
import { IngredientService } from "../services/IngredientServices";
import { RecipeService } from "../services/recipeServices";
import { InventoryService } from "../services/inventoryServices";

export const MainContext = createContext();

export const MainProvider = ({ children }) => {
    const [user, setUser] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [recipe, setRecipe] = useState({});
    const ingredientService = new IngredientService();
    const recipeService = new RecipeService();
    const inventoryService = new InventoryService();
    return (
        <MainContext.Provider value={{ user, setUser, recipes, setRecipes, ingredients, setIngredients, recipe, setRecipe, ingredientService, recipeService, inventoryService }}>
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