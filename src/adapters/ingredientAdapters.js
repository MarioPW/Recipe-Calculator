export class IngredientAdapter {
    adapt(ingredient) {
        return {
            name: ingredient.name, // required, text
            unitOfMeasure: ingredient.unitOfMeasure, // required
            brand: ingredient.brand || "", // optional
            supplier: ingredient.supplier || "", // optional
            costPerKg: ingredient.costPerKg || "",   // optional
            expirationDate: ingredient.expirationDate || "", // optional
            batch: ingredient.batch || "", // optional
            stock: ingredient.stock || "",   // optional
            reference: ingredient.reference || "", // optional
            setInInventory:  ingredient.setInInventory || false // optional 
        };
    }
}