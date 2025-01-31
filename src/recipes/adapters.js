export class Recipe {
    constructor(name, ingredients) {
        this.name = name
        this.ingredients = ingredients // Type: Array[{IngredientRecipe()}]
        this.prodoctWeight = 0
        this.isSubRecipe = false
    }
}