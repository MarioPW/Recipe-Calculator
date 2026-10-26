export class IngredientAdapter {
    static adapt(ingredient) {
      return {
        id: ingredient.id || ingredient.FSUid || ingredient.FSId,
        name: ingredient.name,
        unitOfMeasure: ingredient.unitOfMeasure,
        brand: ingredient.brand || "",
        supplier: ingredient.supplier || "",
        costPerKg: IngredientAdapter.parseNumber(ingredient.costPerKg),
        expirationDate: ingredient.expirationDate || "",
        batch: ingredient.batch || "",
        minStock: IngredientAdapter.parseNumber(ingredient.minStock),
        reference: ingredient.reference || "",
        setInInventory: ingredient.setInInventory || false
      };
    }

    static parseNumber(value) {
      if (value === null || value === undefined || value === "") return null;

      const parsed = Number(value);
      return isNaN(parsed) ? null : parsed;
    }

    adapt(ingredient) {
      return IngredientAdapter.adapt(ingredient);
    }

    parseNumber(value) {
      return IngredientAdapter.parseNumber(value);
    }
  }