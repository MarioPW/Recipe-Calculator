

export function convertAndStoreRecipes() {
    const oldFormatRecipes = JSON.parse(localStorage.getItem("myRecipes"))
    if (Array.isArray(oldFormatRecipes) && oldFormatRecipes.length > 0 && oldFormatRecipes[0].values) {
      const newFormatRecipes = [];
      const confirmation = confirm("We have updated our website, confirrm to update you're data.")
      if (confirmation) {
        oldFormatRecipes.forEach((recipe) => {
          const newRecipe = {
            name: recipe.name,
            ingredients: [],
          };
          recipe.values.forEach((ingredient) => {
            newRecipe.ingredients.push({
              name: ingredient.ingredient,
              weight: ingredient.weight,
              costPerKg: null,
              suplier: null
            });
          });
          newFormatRecipes.push(newRecipe)
          localStorage.setItem("myRecipes", JSON.stringify(newFormatRecipes));
        })
      }
    }
  }