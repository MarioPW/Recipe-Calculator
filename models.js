
export class Ingredient {
    constructor(name, weight, costperKg = null, suplier = null) {
        this.name = name
        this.weight = weight
        this.costPerKg = costperKg
        this.suplier = suplier
    }
    getIngredient(){
        try{
            const ingredients = JSON.parse(localStorage.getItem("ingredients"))
            return ingredients.find((ingredient) => this.name === ingredient.name)
        }catch{
            console.error("Error parsing or retrieving data from localStorage:", error);
            return undefined;
        }
    }
    setIngerdient(){
        try{
            const ingredients = JSON.parse(localStorage.getItem("ingredients"))
            if (!ingredients){
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
    constructor(name, ingredients) {
        this.name = name
        this.ingredients = ingredients
    }
    getRecipeByName() {
        try {
            const recipes = JSON.parse(localStorage.getItem("myRecipes"))
            return recipes.find((recipe) => this.name === recipe.name)
        }
        catch (error) {
            console.error("Error parsing or retrieving data from localStorage:", error);
            return undefined;
        }

    }
    setRecipe(){
        try{
            const recipes = JSON.parse(localStorage.getItem("myRecipes"))
            if (!recipes){
            console.error("No recipes available");
            }
            recipes.push(this)
            localStorage.setItem(JSON.stringify(recipes))
        }
        catch {
            console.error("Error setting recipe", error);
            return undefined;
        }
    }
}
// ToDo:
export class RecipeIngredient {
    constructor(ingredientName, recipeName) {
        this.ingredientName = ingredientName
        this.recipeName = recipeName
    }
}