export class IngredientAdapter {
    adapt(ingredient) {
        return {
            name: ingredient.name,
            unitOfMeasure: ingredient.unitOfMeasure,
            brand: ingredient.brand || null,
            supplier: ingredient.supplier || null,
            costPerKg: ingredient.costPerKg || null,
            expirationDate: ingredient.expirationDate || null,
            batch: ingredient.batch || null,
            stock: ingredient.stock || null,
        };
    }
}