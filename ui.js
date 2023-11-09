

export function getName(recipeName) {
  const nameView = document.getElementById("recipeView");
  nameView.innerHTML = `<h4 class='my-2'>${recipeName}</h4>`
}

export function getConvertionHeader(params) {
  const amountWeight = JSON.parse(localStorage.getItem("amountWeight"));
  const calculatedView = document.getElementById("getConvertionHeader");
  calculatedView.innerHTML = `<h4 class='bg-success text-light p-2'>For ${params.amount} units of ${params.name} of ${params.unitWeight}g each, you need:</h4>`;
}

export function getCalculatedRecipe(calculatedRecipe) {
  const recipeView = document.getElementById("savedRecipe");
  recipeView.innerHTML = "";

  calculatedRecipe.ingredients.forEach((ingredient, i) => {
    const weight = calculatedRecipe.convertion[i];
    recipeView.innerHTML += `
            <td>${ingredient}</td>
            <td>${weight} g</td>`;
  });
}

export function getRecipeItems(items = null) {
  const recipeView = document.getElementById("recipe");
  recipeView.innerHTML = "";
  let ingredients = ""
  if (items != null) {
    ingredients = items
  } else {
    ingredients = JSON.parse(localStorage.getItem("ingredients"))
  }
  if(ingredients){
    ingredients.forEach((ingredient, i) => {
      const name = ingredient.name;
      const weight = ingredient.weight;
      recipeView.innerHTML += `
          <td>${name}</td>
          <td>${weight} g</td>
          
            <td><button type="button" id="editBtn${i}"class="btn btn-outline-primary bi bi-pencil" data-bs-toggle="modal" data-bs-target="#staticBackdrop" value="${i}"></button></td>
            <td><button id="deleteBtn${i}"class="btn btn-outline-danger bi bi-trash" value="${name}"></button></td>
      `;
    });
  }
}

export function calculate(params) {
  const values = JSON.parse(localStorage.getItem("ingredients"));
  const sumatory = values
    .map((v) => parseFloat(v.weight))
    .reduce((a, b) => a + b);
  const totalRequiredDought =
    parseFloat(params.amount) * parseFloat(params.unitWeight);
  const percentages = values.map((b) => parseFloat(b.weight) / sumatory);
  const convertion = [];
  const ingredients = values.map((i) => i.name);

  for (let i = 0; i < values.length; i++) {
    let b = parseInt(totalRequiredDought * percentages[i]);
    if (b == 0) {
      b = 1;
    }
    let str = b.toString();
    convertion.push(str);
  }
  const calculatedRecipe = {
    ingredients,
    convertion,
  };
  return calculatedRecipe;
}

export function dropdown(file, docElement) {
  const myItems = JSON.parse(localStorage.getItem(file));
  if (myItems) {
    const itemNames = myItems.map((i) => i.name);
    itemNames.sort();
    const ulDropdown = document.getElementById(docElement);
    ulDropdown.innerHTML = '';
    itemNames.forEach((name) => {
      const li = document.createElement("li");
      li.className = "btn btn-light d-block ";
      li.innerHTML = name;
      li.setAttribute("id", name);
      ulDropdown.appendChild(li);
    })
  };
}

export function convertAndStoreRecipes() {
  const oldFormatRecipes = JSON.parse(localStorage.getItem("myRecipes"))

  if (Array.isArray(oldFormatRecipes) && oldFormatRecipes.length > 0 && oldFormatRecipes[0].values) {
    const newFormatRecipes = [];
    const confirmation = confirm("We have updated our website, so you need to convert your saved recipes to a new format so that the app can read them correctly. Do you want to make the conversion?")
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
