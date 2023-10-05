
export class Ingredient {
    constructor(name, weight) {
        this.name = name
        this.weight = weight
    }

}
export class Recipe {
    constructor(name) {
        this.name = name
        this.ingredients = []
    }
    addIngredient(ingredient) {
        this.ingredients.push(ingredient);
    }
    removeIngredientByName(name) {
        this.ingredients = this.ingredients.filter(ingredient => ingredient.name !== name);
    }
    getIngredients() {
        return this.ingredients;
    }
}
