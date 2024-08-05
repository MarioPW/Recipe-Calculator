import { uniqueId } from "./services/utils.js"

export class Recipe {
    constructor() {
        this.id = uniqueId()
        this.name = ""
        this.ingredients = [] // Type: IngredientRecipe()
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
        unitOfMeasure = null,
        presentation = null,
        purchasePrice = null,
        brand = null,
        supplier = null,
        portionPrice = null,
        expirationDate = null,
        batch = null
        })
    {
        this.id = uniqueId()
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
