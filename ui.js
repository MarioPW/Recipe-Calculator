export function getName(reference = "recipeTitle") {
  if (reference == "recipeTitle") {
    let name = JSON.parse(localStorage.getItem(reference));
    if (name) {
      let nameView = document.getElementById("recipeView");
      nameView.innerHTML = `<h4 class='my-2'>${name.name}</h4>`;
    } else {
      alert("No Recipes Available");
    }
  } else {
    let nameView = document.getElementById("recipeView");
    nameView.innerHTML = `<h4 class='my-2'>${reference}</h4>`;
  }
}

export function getConvertionHeader() {
  let name = JSON.parse(localStorage.getItem("recipeTitle"));
  let amountWeight = JSON.parse(localStorage.getItem("amountWeight"));
  let calculatedView = document.getElementById("getConvertionHeader");
  calculatedView.innerHTML = `<h4 class='bg-success text-light p-2 rounded-2'>For ${amountWeight.amount} units of ${name.name} of ${amountWeight.unitWeight}g each, you need:</h4>`;
}

export function getCalculatedRecipe() {
  const calculatedRecipe = JSON.parse(localStorage.getItem("calculatedRecipe"));
  const recipeView = document.getElementById("savedRecipe");
  recipeView.innerHTML = "";

  calculatedRecipe.ingredients.forEach((ingredient, i) => {
    const weight = calculatedRecipe.convertion[i];
    recipeView.innerHTML += `
          <td>${ingredient}</td>
          <td>${weight} g</td>`;
  });
}

export function getValues(reference = "valuesList") {
  let valuesList = "";
  let recipeView = document.getElementById("recipe");
  recipeView.innerHTML = "";
  if (reference == "valuesList") {
    valuesList = JSON.parse(localStorage.getItem(reference));
  } else {
    valuesList = reference;
  }
  if (valuesList) {
    valuesList.forEach((value, i) => {
      let ingredient = value.ingredient;
      let weight = value.weight;
      recipeView.innerHTML += `
        <td>${ingredient}</td>
        <td>${weight} g</td>
        
          <td><button type="button" id="editBtn${i}"class="btn btn-outline-primary bi bi-pencil" data-bs-toggle="modal" data-bs-target="#staticBackdrop" value="${i}"></button></td>
          <td><button id="deleteBtn${i}"class="btn btn-outline-danger bi bi-trash" value="${ingredient}"></button></td>
    `;
    });
  }
}

export function calculate() {
  let values = JSON.parse(localStorage.getItem("valuesList"));
  let params = JSON.parse(localStorage.getItem("amountWeight"));

  let sumatory = values
    .map((v) => parseFloat(v.weight))
    .reduce((a, b) => a + b);
  let totalRequiredDought =
    parseFloat(params.amount) * parseFloat(params.unitWeight);
  let percentages = values.map((b) => parseFloat(b.weight) / sumatory);
  let convertion = [];
  let ingredients = values.map((i) => i.ingredient);

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
  localStorage.setItem("calculatedRecipe", JSON.stringify(calculatedRecipe));
  getConvertionHeader();
}

export function myRecipesDropdown() {
  let recipeNames = JSON.parse(localStorage.getItem("myRecipes"));
  recipeNames.forEach((recipe) => {
    let ulDropdown = document.getElementById("recipes-dropdown");
    let li = document.createElement("li");
    li.className = "btn btn-light d-block ";
    li.innerHTML = recipe.name;
    li.setAttribute("id", recipe.name);
    ulDropdown.appendChild(li);
  });
}
