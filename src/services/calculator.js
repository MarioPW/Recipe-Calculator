import { ingredientRepository } from "../services/index.js";
import { IngredientRecipe } from "../models.js";

export class Calculator {
  calculateInProportion(recipeData, ingredients = IngredientRecipe) {
    const sumatory = ingredients
      .map((ing) => parseFloat(ing.weight))
      .reduce((a, b) => a + b);
    const totalRequiredDought = parseFloat(recipeData.amount) * parseFloat(recipeData.weightPerUnit);
    const percentages = ingredients.map((ing) => parseFloat(ing.weight) / sumatory);
  
    const calculatedRecipe = ingredients.map((ingredient, i) => {
      const conversion = (totalRequiredDought * percentages[i]).toFixed(1);
      return {
        name: ingredient.name,
        conversion: conversion,
        unitOfMeasure: ingredient.unitOfMeasure
      };
    });
  
    return calculatedRecipe;
  }
  costRecipe(recipe) { // ToDo: Finish this function
    const ingredientsCosts = recipeIngredients.map((ing) => {
      let ingredient = ingredientRepository.getIngredientByid(ing.id)
      return  ing.weight * ingredient.portionPrice
    })
  }
}