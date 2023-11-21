
import { uniqueId } from "../utils/utils.js"

export class Recipe {
    constructor() {
        this.id = uniqueId()
        this.name = "";
        this.ingredients = [];
    }
    setName(name) {
        this.name = name;
    }
    setIngredients(ingredients) {
        this.ingredients = ingredients
    }
}

export class Ingredient {
    constructor(name, weight, costperKg = null, suplier = null) {
        this.id = uniqueId()
        this.name = name
        this.weight = weight
        this.costPerKg = costperKg
        this.suplier = suplier
    }
}