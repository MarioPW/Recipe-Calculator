
export class Ui {

  getName(recipeName) {
    const nameView = document.querySelector("#recipeView")
    nameView.innerHTML = `<h4 id='newRecipeName' class='my-2'>${recipeName}</h4>`
  }
  getCalculatedRecipe(calculatedRecipe, params) {
    const calculatedView = document.querySelector("#getConvertionHeader");
    calculatedView.innerHTML = `<h4 class='bg-purple text-light p-2'>For ${params.amount} units of ${params.name} of ${params.weightPerUnit}g each, you need:</h4>`;
    const recipeView = document.querySelector("#savedRecipe");
    recipeView.innerHTML = "";
  
    calculatedRecipe.forEach((ingredient) => {
      recipeView.innerHTML += `
        <tr>
          <td>${ingredient.name}</td>
          <td>${ingredient.conversion} ${ingredient.unitOfMeasure}</td>
        </tr>`;
    });
  }
  getTraceability(ingredients, calculatedProportions, recipeData) {
    console.log(calculatedProportions)
    const traceabilityHeader = document.querySelector("#traceabilityHeader")
    traceabilityHeader.innerHTML = `<h5 class='bg-primary text-light p-2'>Product: ${recipeData.name} <br>Weight per Unit: ${recipeData.weightPerUnit} g <br>Amount: ${recipeData.amount}</h5>`
    const traceabilityView = document.querySelector("#traceabilityTableBody")
    traceabilityView.innerHTML = ""
    ingredients.forEach((ingredient) => {
      const { name, unitOfMeasure, batch, expirationDate } = ingredient
      const calculatedProportion = calculatedProportions.find(item => item.name === name);
      const weight = calculatedProportion ? calculatedProportion.conversion : "N/A";
      traceabilityView.innerHTML += `
        <tr>
          <td>${name}</td>
          <td>${weight}</td>
          <td>${unitOfMeasure}</td>
          <td>${batch}</td>
          <td>${expirationDate}</td>
        </tr>`;
    });
  }
  getRecipeItems(items /* type: List */) {
    const recipeView = document.querySelector("#recipe")
    recipeView.innerHTML = ""
    items.forEach((ingredient) => {
      const { name, weight, id, unitOfMeasure } = ingredient
      recipeView.innerHTML += `
        <td>${name}</td>
        <td>${weight} ${unitOfMeasure}</td>     
        <td><button type="button" id="editIngredient"class="btn btn-outline-primary bi bi-pencil" data-bs-toggle="modal" data-bs-target="#addIngredientsWeight" value="${id}"></button></td>
        <td><button id="deleteIngredient"class="btn btn-outline-danger bi bi-trash" value="${id}"></button></td>
       `
    })
    document.querySelector("#newIngredientForm").classList = "hide"
  }
  getRecipeItem(ingredient, weight) {
    const recipeView = document.querySelector("#recipe")
    const { name, id, unitOfMeasure } = ingredient
    recipeView.innerHTML += `
    <td>${name}</td>
    <td>${weight} ${unitOfMeasure}</td>
    <td><button type="button" id="editBtn${id}"class="btn btn-outline-primary bi bi-pencil" data-bs-toggle="modal" data-bs-target="#addIngredientsWeight" value="${id}"></button></td>
    <td><button id="deleteBtn${id}"class="btn btn-outline-danger bi bi-trash" value="${id}"></button></td>
    `
  }
  getDropdown(file, docElement) {
    const myItems = JSON.parse(localStorage.getItem(file));
    if (myItems) {
      const sortedItems = myItems.sort((a, b) => a.name.localeCompare(b.name))
      const ulDropdown = document.getElementById(docElement);
      ulDropdown.innerHTML = ''
      ulDropdown.innerHTML = sortedItems.map(item => `<li class="btn btn-light d-block" id="${item.id}">${item.name}</li>`).join('')
    }
  }
  setSavedRecipeButtons(id) {
    const saveButton = document.querySelector("#save-button")
    const deleteBtn = document.querySelector("#delete-button")
    const traceability = document.querySelector("#calculateButton")
    saveButton.textContent = "Save Changes"
    traceability.setAttribute("value", id)
    saveButton.setAttribute("value", id)
    deleteBtn.className = "btn myButton-danger btn-sm"
    deleteBtn.textContent = "Delete"
    deleteBtn.setAttribute("value", id)
  }
  setIngredientEdit(myIngredient) {
    document.querySelector("#weight-modal-header").classList = ("modal-header bg-warning text-light")
    document.querySelector("#weight-modal-header").querySelector("h5").innerText = `Edit Ingredient "${myIngredient.name}":`
    document.querySelector("#weightAdd").placeholder = `Unit of mesure: ${myIngredient.unitOfMeasure}`
    document.querySelector("#weightAdd").value = myIngredient.weight
    document.querySelector("#submitBtnAdd").value = myIngredient.id
    document.querySelector("#submitBtnAdd").textContent = "Edit"
  }

  setIngredientNew(recipeName, myIngredient) {
    document.querySelector("#weight-modal-header").querySelector("h5").innerText = `Add "${myIngredient.name}" to "${recipeName}"`
    document.querySelector("#weight-modal-header").classList = ("modal-header bg-primary text-light")
    document.querySelector("#weightAddLabel").innerText = `Enter the quantity in ${myIngredient.unitOfMeasure} for "${myIngredient.name}"`
    document.querySelector("#weightAdd").placeholder = `Unit of mesure: ${myIngredient.unitOfMeasure}`
    document.querySelector("#submitBtnAdd").value = myIngredient.id
    document.querySelector("#submitBtnAdd").textContent = "Done"
  }
  setIngredientIntoForm(myIngredient) {
    const form = document.querySelector("#newIngredientForm");
    Object.entries(myIngredient).forEach(([key, value]) => {
      const input = form.querySelector(`#${key}`);
      if (input) {
        input.value = value;
      } else {
        console.warn(`Input with id "${key}" not found in the form.`);
      }
    });
  }
  showHideWindows(elementToShow, classes) {
    document.querySelector("#newIngredientForm").classList = ("hide")
    document.querySelector("#name-card").classList = ("hide")
    document.querySelector("#recipeViewContainer").classList = ("hide")
    document.querySelector("#info").classList = ("hide")
    document.querySelector(elementToShow).classList = (classes)
  }
}