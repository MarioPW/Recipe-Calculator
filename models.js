
const uniqueID = () => {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let uniqueID = '';
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        uniqueID += characters.charAt(randomIndex);
    }
    return uniqueID;
}

export class Recipe {
    constructor() {
        this.id = uniqueID()
        this.name = "";
        this.ingredients = [];
    }
    setName(name) {
        this.name = name;
    }
    setIngredients(ingredients) {
        this.ingredients = ingredients
    }
    saveRecipe() {
        try {
            const recipes = JSON.parse(localStorage.getItem("myRecipes")) || [];
            recipes.push({ name: this.name, ingredients: this.ingredients });
            localStorage.setItem("myRecipes", JSON.stringify(recipes));
            return true;
        } catch (error) {
            console.error("Error parsing or saving data to localStorage:", error);
            return false;
        }
    }
    getRecipeByName() {
        try {
            const recipes = JSON.parse(localStorage.getItem("myRecipes")) || [];
            return recipes.find((recipe) => this.name.toLowerCase() === recipe.name.toLowerCase());
        } catch (error) {
            console.error("Error parsing or retrieving data from localStorage:", error);
            return undefined;
        }
    }
    updateRecipe(recipeUpdates) {
        return recipeUpdates
    }
}

export class Ingredient {
    constructor(name, weight, costperKg = null, suplier = null) {
        this.id = uniqueID()
        this.name = name
        this.weight = weight
        this.costPerKg = costperKg
        this.suplier = suplier
    }
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
            return ingredients.find((ingredient) => ingredient[id] === this.id)
        } catch {
            console.error(`Error parsing or retrieving ingredient`, error);
            return undefined;
        }
    }
    saveIngredient() {
        try {
            if (localStorage.getItem("ingredients") === null) {
                const ingredients = [];
                ingredients.push(this);
                localStorage.setItem("ingredients", JSON.stringify(ingredients));
            } else {
                const ingredients = JSON.parse(localStorage.getItem("ingredients"))
                ingredients.push(this);
                localStorage.setItem("ingredients", JSON.stringify(ingredients));
            }
        }
        catch (error) {
            console.error("Error setting ingredient", error);
            return undefined;
        }
    }
    updateIngredient(updates /* :Ingredient */) {
        try {
            const ingredients = JSON.parse(localStorage.getItem("ingredients"));
            if (!ingredients) {
                console.error("No ingredients available");
                return;
            }

            const index = ingredients.findIndex((ingredient) => ingredient.id === this.id);

            if (index !== -1) {
                ingredients[index] = { ...ingredients[index], ...updates };

                localStorage.setItem("ingredients", JSON.stringify(ingredients));
            }
        } catch (error) {
            console.error("Error updating ingredient", error);
        }
    }
    deleteIngredient(id) {
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

export function isRepited(itemName, file) {
    const items = JSON.parse(localStorage.getItem(file))
    if (!items) {
        return false
    }
    const names = items.map((item) => item.name)
    if (names && names.includes(itemName)) {
        return true
    } return false

}