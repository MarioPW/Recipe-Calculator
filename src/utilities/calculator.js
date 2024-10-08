import { ingredientRepository } from "../../index.js";
import { IngredientRecipe } from "../ingredientsRecipePibot/adapters.js";

export class Calculator {
  calculateInProportion(recipeData, ingredients = IngredientRecipe) {
    const sumatory = ingredients
      .map((ing) => parseFloat(ing.weight))
      .reduce((a, b) => a + b);
    const totalRequiredDought = parseFloat(recipeData.amount) * parseFloat(recipeData.weightPerUnit);
    const percentages = ingredients.map((ing) => parseFloat(ing.weight) / sumatory);

    const calculatedRecipe = ingredients.map((ingredient, i) => {
      const conversion = (totalRequiredDought * percentages[i]);
      return {
        name: ingredient.name,
        conversion: conversion.toFixed(1),
        unitOfMeasure: ingredient.unitOfMeasure
      };
    });

    return calculatedRecipe;
  }
  costRecipe(costParams) {
    const costPerIngredient = costParams.ingredients.map((ing) => {
        return (ing.costPerKg / 1000 * ing.requiredQuantity).toFixed(2);
    });

    const totalCost = costPerIngredient.reduce((acc, curr) => acc + parseFloat(curr), 0).toFixed(2);
    const costPerUnit = (totalCost / costParams.amount).toFixed(2);

    const ingredients = costParams.ingredients.map((ing, index) => {
        const cost = costPerIngredient[index];
        const percentage = ((cost / totalCost) * 100).toFixed(2);

        return {
            "Ingredient": ing.name,
            "Cost Per Kg | mL": `$ ${parseFloat(ing.costPerKg).toLocaleString('es-ES')}`,
            "Required Quantity": `${parseFloat(ing.requiredQuantity).toLocaleString('es-ES')} ${ing.unitOfMeasure}`,
            "Cost": `$${parseFloat(cost).toLocaleString('es-ES')}`,
            "Percentage": `${parseFloat(percentage).toLocaleString('es-ES')} %`
        };
    });

    return { "Total Cost": `$ ${parseFloat(totalCost).toLocaleString('es-ES')}`, ingredients, "Cost Per Unit": `$ ${parseFloat(costPerUnit).toLocaleString('es-ES')}`,
  };
}

}