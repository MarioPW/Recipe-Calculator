import { reference } from "@popperjs/core";

export class IngredientAdapter {
    adapt(ingredient) {
        return {
            name: ingredient.name, // required, text
            unitOfMeasure: ingredient.unitOfMeasure, // required
            brand: ingredient.brand || null, // optional
            supplier: ingredient.supplier || null, // optional
            costPerKg: ingredient.costPerKg || null,   // optional
            expirationDate: ingredient.expirationDate || null, // optional
            batch: ingredient.batch || null, // optional
            stock: ingredient.stock || null,   // optional
            reference: ingredient.reference || null // optional
        };
    }
}