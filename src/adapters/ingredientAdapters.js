export class IngredientAdapter {
    adapt(ingredient) {
      return {
        name: ingredient.name,
        unitOfMeasure: ingredient.unitOfMeasure,
        brand: ingredient.brand || "",
        supplier: ingredient.supplier || "",
        costPerKg: this.parseNumber(ingredient.costPerKg),
        expirationDate: ingredient.expirationDate || "",
        batch: ingredient.batch || "",
        stock: this.parseNumber(ingredient.stock),
        minStock: this.parseNumber(ingredient.minStock),
        reference: ingredient.reference || "",
        setInInventory: ingredient.setInInventory || false
      };
    }
  
    parseNumber(value) {
      // Si es null, undefined o string vacío, devuelve null
      if (value === null || value === undefined || value === "") return null;
  
      const parsed = Number(value);
      return isNaN(parsed) ? null : parsed;
    }
  }