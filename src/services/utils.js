export function uniqueId(){
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let uniqueID = '';
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        uniqueID += characters.charAt(randomIndex);
    }
    return uniqueID;
}

export function isRepeated(itemName, file) {
    const items = JSON.parse(localStorage.getItem(file))
    if (!items) {
        return false
    }
    const names = items.map((item) => item.name)
    if (names && names.includes(itemName)) {
        return true
    } return false
}

export function cleanLocalStorage() {
    localStorage.removeItem("ingredients")
    localStorage.removeItem("recipeTitle")
    localStorage.removeItem("valuesList")
}

export function startNewRecipe() {
    const recipe = document.querySelector("#recipe")
    if (recipe.children.length === 0) {
        cleanLocalStorage()
    }
}

export function convertAndStoreRecipes() {
    const oldFormatRecipes = JSON.parse(localStorage.getItem("myRecipes"))
    if (Array.isArray(oldFormatRecipes) && oldFormatRecipes.length > 0 && oldFormatRecipes[0].values) {
      const newFormatRecipes = [];
      const confirmation = confirm("We have updated our website, confirm to update your recipes.")
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