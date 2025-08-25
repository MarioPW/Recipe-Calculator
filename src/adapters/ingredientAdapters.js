export class IngredientAdapter {
    adapt(ingredient) {
      return {
        id: ingredient.id,
        name: ingredient.name,
        unitOfMeasure: ingredient.unitOfMeasure,
        brand: ingredient.brand || "",
        supplier: ingredient.supplier || "",
        costPerKg: this.parseNumber(ingredient.costPerKg),
        expirationDate: ingredient.expirationDate || "",
        batch: ingredient.batch || "",
        // stock: this.parseNumber(ingredient.stock),
        minStock: this.parseNumber(ingredient.minStock),
        reference: ingredient.reference || "",
        setInInventory: ingredient.setInInventory || false
      };
    }
  
    parseNumber(value) {
      if (value === null || value === undefined || value === "") return null;
  
      const parsed = Number(value);
      return isNaN(parsed) ? null : parsed;
    }
  }