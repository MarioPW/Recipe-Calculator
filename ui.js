

export function getName(reference = "recipeTitle") {
  if (reference == "recipeTitle") {
    const name = JSON.parse(localStorage.getItem(reference));
    if (name) {
      const nameView = document.getElementById("recipeView");
      nameView.innerHTML = `<h4 class='my-2'>${name.name}</h4>`;
    } else {
      alert("No Recipes Available");
    }
  } else {
    const nameView = document.getElementById("recipeView");
    nameView.innerHTML = `<h4 class='my-2'>${reference}</h4>`;
  }
}

export function getConvertionHeader() {
  const name = JSON.parse(localStorage.getItem("recipeTitle"));
  const amountWeight = JSON.parse(localStorage.getItem("amountWeight"));
  const calculatedView = document.getElementById("getConvertionHeader");
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
  const recipeView = document.getElementById("recipe");
  recipeView.innerHTML = "";
  if (reference == "valuesList") {
    valuesList = JSON.parse(localStorage.getItem(reference));
  } else {
    valuesList = reference;
  }
  if (valuesList) {
    valuesList.forEach((value, i) => {
      const ingredient = value.ingredient;
      const weight = value.weight;
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
  const values = JSON.parse(localStorage.getItem("valuesList"));
  const params = JSON.parse(localStorage.getItem("amountWeight"));

  const sumatory = values
    .map((v) => parseFloat(v.weight))
    .reduce((a, b) => a + b);
  const totalRequiredDought =
    parseFloat(params.amount) * parseFloat(params.unitWeight);
  const percentages = values.map((b) => parseFloat(b.weight) / sumatory);
  const convertion = [];
  const ingredients = values.map((i) => i.ingredient);

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
  const recipeNames = JSON.parse(localStorage.getItem("myRecipes"));
  recipeNames.forEach((recipe) => {
    const ulDropdown = document.getElementById("recipes-dropdown");
    const li = document.createElement("li");
    li.className = "btn btn-light d-block ";
    li.innerHTML = recipe.name;
    li.setAttribute("id", recipe.name);
    ulDropdown.appendChild(li);
  });
}
