import { ingredientRepository } from "../../index.js";


export function 
calculate(params, ingredients) {
  const sumatory = ingredients
    .map((ing) => parseFloat(ing.weight))
    .reduce((a, b) => a + b)
  const totalRequiredDought =
    parseFloat(params.amount) * parseFloat(params.weightPerUnit)
  const percentages = ingredients.map((ing) => parseFloat(ing.weight) / sumatory)
  const convertion = []
  const ingredientNames = ingredients.map((i) => i.name)
  const unitOfMeasure = ingredients.map((i) => i.unitOfMeasure)

  for (let i = 0; i < ingredients.length; i++) {
    let b = parseInt(totalRequiredDought * percentages[i])
    if (b == 0) {
      b = 1
    }
    let str = b.toString()
    convertion.push(str)
  }
  
  const calculatedRecipe = {
    ingredientNames,
    convertion,
    unitOfMeasure
  };
  return calculatedRecipe
}

export function costRecipe(recipe) {
  const ingredientsCosts = recipeIngredients.map((ing) => {
    let ingredient = ingredientRepository.getIngredientByid(ing.id)
    return  ing.weight * ingredient.portionPrice
  })
}