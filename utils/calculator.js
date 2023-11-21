export function calculate(params) {
    const values = JSON.parse(localStorage.getItem("ingredients"));
    const sumatory = values
      .map((v) => parseFloat(v.weight))
      .reduce((a, b) => a + b);
    const totalRequiredDought =
      parseFloat(params.amount) * parseFloat(params.unitWeight);
    const percentages = values.map((b) => parseFloat(b.weight) / sumatory);
    const convertion = [];
    const ingredientNames = values.map((i) => i.name);
  
    for (let i = 0; i < values.length; i++) {
      let b = parseInt(totalRequiredDought * percentages[i]);
      if (b == 0) {
        b = 1;
      }
      let str = b.toString();
      convertion.push(str);
    }
    const calculatedRecipe = {
      ingredientNames,
      convertion,
    };
    return calculatedRecipe;
  }