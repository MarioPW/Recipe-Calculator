
export class Recipe {
    constructor(name, ingredients) {
        this.name = name
        this.ingredients = ingredients // Type: IngredientRecipe()
        this.prodoctWeight = 0
    }
}
export class IngredientRecipe {
    constructor(id, name, weight, unitOfMeasure) {
        this.id = id
        this.name = name
        this.weight = weight
        this.unitOfMeasure = unitOfMeasure
    }
}
export class Ingredient {
    constructor({
        name,
        unitOfMeasure,
        brand = null,
        supplier = null,
        costPerKg = null,
        expirationDate = null,
        batch = null
        })
    {
        this.name = name
        this.unitOfMeasure = unitOfMeasure
        this.costPerKg = costPerKg
        this.supplier = supplier
        this.brand = brand
        this.expirationDate = expirationDate
        this.batch = batch
    }
}
