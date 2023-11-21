

export function getName(recipeName) {
  const nameView = document.querySelector("#recipeView");
  nameView.innerHTML = `<h4 id='newRecipeName' class='my-2'>${recipeName}</h4>`
}

export function getCalculatedRecipe(calculatedRecipe, params) {
  const calculatedView = document.querySelector("#getConvertionHeader");
  calculatedView.innerHTML = `<h4 class='bg-purple text-light p-2'>For ${params.amount} units of ${params.name} of ${params.unitWeight}g each, you need:</h4>`;
  const recipeView = document.querySelector("#savedRecipe");
  recipeView.innerHTML = "";

  calculatedRecipe.ingredientNames.forEach((ingredient, i) => {
    const weight = calculatedRecipe.convertion[i];
    recipeView.innerHTML += `
            <td>${ingredient}</td>
            <td>${weight} g</td>`;
  });
}

export function getRecipeItems(items = null) {
  const recipeView = document.querySelector("#recipe");
  recipeView.innerHTML = "";
  let ingredients = ""
  if (items != null) {
    ingredients = items
  } else {
    ingredients = JSON.parse(localStorage.getItem("ingredients"))
  }
  if (ingredients) {
    ingredients.forEach((ingredient) => {
      const name = ingredient.name
      const weight = ingredient.weight
      const id = ingredient.id
      recipeView.innerHTML += `
          <td>${name}</td>
          <td>${weight} g</td>         
            <td><button type="button" id="editIngredient"class="btn btn-outline-primary bi bi-pencil" data-bs-toggle="modal" data-bs-target="#staticBackdrop" value="${id}"></button></td>
            <td><button id="deleteIngredient"class="btn btn-outline-danger bi bi-trash" value="${id}"></button></td>
      `
    })
  }
}

export function getRecipeItem(ingredient) {
  const recipeView = document.querySelector("#recipe")
  const  {name, weight, id} = ingredient

  recipeView.innerHTML += `
    <td>${name}</td>
    <td>${weight} g</td>
    <td><button type="button" id="editBtn${id}"class="btn btn-outline-primary bi bi-pencil" data-bs-toggle="modal" data-bs-target="#staticBackdrop" value="${id}"></button></td>
    <td><button id="deleteBtn${id}"class="btn btn-outline-danger bi bi-trash" value="${name}"></button></td>
    `
}

export function getDropdown(file, docElement) {
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

export function setSavedRecipeButtons(id) {
  const saveButton = document.querySelector("#save-button")
  const deleteBtn = document.querySelector("#delete-button")
  saveButton.textContent = "Save Changes"
  saveButton.setAttribute("value", id)
  deleteBtn.className = "btn myButton-danger btn-sm"
  deleteBtn.textContent = "Delete"
  deleteBtn.setAttribute("value", id)
}