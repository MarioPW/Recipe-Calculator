import { uniqueId } from "./services/utils.js"

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
        presentation = null,
        purchasePrice = null,
        brand = null,
        supplier = null,
        portionPrice = null,
        expirationDate = null,
        batch = null
        })
    {
        this.name = name
        this.unitOfMeasure = unitOfMeasure
        this.presentation = presentation
        this.purchasePrice = purchasePrice
        this.supplier = supplier
        this.brand = brand
        this.portionPrice = portionPrice
        this.expirationDate = expirationDate
        this.batch = batch
    }
}
