
export class Ingredient {
    constructor(name, weight, costperKg = null, suplier = null) {
        this.name = name
        this.weight = weight
        this.costPerKg = costperKg
        this.suplier = suplier
    }
    getIngredient() {
        try {
            const ingredients = JSON.parse(localStorage.getItem("ingredients"))
            return ingredients.find((ingredient) => this.name === ingredient.name)
        } catch {
            console.error("Error parsing or retrieving data from localStorage:", error);
            return undefined;
        }
    }
    setIngerdient() {
        try {
            const ingredients = JSON.parse(localStorage.getItem("ingredients"))
            if (!ingredients) {
                console.error("No ingredients available");
            }
            ingredients.push(this)
            localStorage.setItem(JSON.stringify(ingredients))
        }
        catch {
            console.error("Error setting ingredient", error);
            return undefined;
        }
    }
}
export class Recipe {
    constructor() {
        this.name = "";
        this.ingredients = [];
    }

    setName(name) {
        this.name = name;
    }

    setIngredients(ingredients) {
        this.ingredients = ingredients;
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
}