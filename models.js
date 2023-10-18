
export class Ingredient {
    constructor(name, weight, costperKg = null, suplier = null) {
        this.name = name
        this.weight = weight
        this.costPerKg = costperKg
        this.suplier = suplier
    }

}
export class Recipe {
    constructor(name, ingredients) {
        this.name = name
        this.ingredients = ingredients
    }
}
// ToDo:
export class RecipeIngredient {
    constructor(ingredientName, recipeName) {
        this.ingredientName = ingredientName
        this.recipeName = recipeName
    }
}