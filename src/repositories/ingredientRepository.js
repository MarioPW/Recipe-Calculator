import { IngredientRecipe } from "../models.js"

export class IngredientsRepository {

    getAllIngredients() {
        try {
            const ingredients = JSON.parse(localStorage.getItem("ingredients"))
            return ingredients;
        } catch {
            console.error(`Error parsing or retrieving ingredients from localStorage:`, error);
            return undefined;
        }
    }
    getMyIngredientByid(id) {
        try {
            const ingredients = JSON.parse(localStorage.getItem("myIngredients"))
            return (ingredients.find((ingredient) => ingredient.id === id))
        } catch (error) {
            console.error(`Error parsing or retrieving ingredient`, error);
            return undefined;
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
    save(ingredient) {
        try {
            const ingredients = JSON.parse(localStorage.getItem("myIngredients")) || []
            ingredients.push(ingredient)
            localStorage.setItem("myIngredients", JSON.stringify(ingredients))
        }
        catch (error) {
            console.error("Error setting ingredient", error);
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
    update(updates /* :Ingredient */) {
        try {
            //const { name, weight, id } = updates
            const ingredients = JSON.parse(localStorage.getItem("ingredients"))
            const ingredient = this.getIngredientByid(updates.id)
            ingredient.name = updates.name
            ingredient.weight = updates.weight
            const index = ingredients.findIndex((i) => i.id == updates.id)
            ingredients[index] = ingredient
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
    editMyIngredient(id, updatedFields) {
        const ingredients = JSON.parse(localStorage.getItem('myIngredients')) || [];
        const ingredientIndex = ingredients.findIndex(ingredient => ingredient.id === id);
        if (ingredientIndex !== -1) {
            ingredients[ingredientIndex] = { ...ingredients[ingredientIndex], ...updatedFields };
            localStorage.setItem('myIngredients', JSON.stringify(ingredients));
        } else {
            console.error(`Ingredient with id not found.`);
        }
    }
    deleteMyIngredient(id) {   
        const ingredients = JSON.parse(localStorage.getItem('myIngredients')) || [];
        const ingredientIndex = ingredients.findIndex(ingredient => ingredient.id === id);
        if (ingredientIndex !== -1) {
            ingredients.splice(ingredientIndex, 1);
            localStorage.setItem('myIngredients', JSON.stringify(ingredients));
        } else {
            console.error(`Ingredient with id not found.`);
        }
    }
}