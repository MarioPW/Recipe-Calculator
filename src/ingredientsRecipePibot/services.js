import { IngredientRecipe } from "./adapters.js";

export class IngRecipeRepo {
    getAllIngredients() {
        try {
            const ingredients = JSON.parse(localStorage.getItem("ingredients"))
            return ingredients;
        } catch {
            console.error(`Error parsing or retrieving ingredients from localStorage:`, error);
        }
    }
    getIngredientByid(id) {
        try {
            const ingredients = JSON.parse(localStorage.getItem("ingredients"))
            return (ingredients.find((ingredient) => ingredient.id === id))
        } catch (error) {
            console.error(`Error parsing or retrieving ingredient`, error);
            return undefined;
        }
    }
    storageIngredient(ingredientId, ingredientName, weight, unitOfMeasure) {
        try {
            const ingredients = JSON.parse(localStorage.getItem("ingredients")) || [];
            const ingredientRecipe = new IngredientRecipe(ingredientId, ingredientName, weight, unitOfMeasure)
            ingredients.push(ingredientRecipe);
            localStorage.setItem("ingredients", JSON.stringify(ingredients));
        }
        catch (error) {
            console.error("Error setting ingredient", error);
            return undefined;
        }
    }
    storageIngredients(ingredients /*: [Ingredient] */) {
        try {
            localStorage.setItem("ingredients", JSON.stringify(ingredients))
        }
        catch (error) {
            console.error("Error setting ingredient", error);
            return undefined;
        }
    }
    update(updates /* Type: Ingredient */) {
        try {
            const ingredients = JSON.parse(localStorage.getItem("ingredients")) || [];
            const index = ingredients.findIndex((i) => i.id === updates.id);
            if (index === -1) {
                console.error(`Ingredient with ID ${updates.id} not found.`);
                return}
            ingredients[index] = { ...ingredients[index], ...updates };
            localStorage.setItem("ingredients", JSON.stringify(ingredients));
        } catch (error) {
            console.error("Error updating ingredient", error);
        }
    }
    deleteFromRecipe(id) {
        try {
            const ingredients = JSON.parse(localStorage.getItem("ingredients"));
            if (!ingredients) {
                console.error("No ingredients available");
                return;
            }
            const index = ingredients.findIndex((ingredient) => ingredient.id === id);
            if (index !== -1) {
                ingredients.splice(index, 1);
                localStorage.setItem("ingredients", JSON.stringify(ingredients));
            }
        } catch (error) {
            console.error("Error deleting ingredient", error);
        }
    }
}