export class IngredientsService {
    
    getAllIngredients() {
        try {
            const ingredients = JSON.parse(localStorage.getItem("ingredients"))
            return ingredients;
        } catch {
            console.error(`Error parsing or retrieving ingredients from localStorage:`, error);
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
            const ingredients = JSON.parse(localStorage.getItem("ingredients")) || [];
            ingredients.push(ingredient);
            localStorage.setItem("ingredients", JSON.stringify(ingredients));
        }
        catch (error) {
            console.error("Error setting ingredient", error);
            return undefined;
        }
    }

    storageIngredients(ingredients) {
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
            const { name, weight, id } = updates
            const ingredients = JSON.parse(localStorage.getItem("ingredients"))
            const ingredient = this.getIngredientByid(id)

            ingredient.name = name
            ingredient.weight = weight
            const index = ingredients.findIndex((i) => i.id == id)
            ingredients[index] = ingredient
            localStorage.setItem("ingredients", JSON.stringify(ingredients));

        } catch (error) {
            console.error("Error updating ingredient", error);
        }
    }
    delete(id) {
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