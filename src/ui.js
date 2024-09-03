
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
    document.querySelector("#newIngredientForm").classList = "d-none"
  }
  getRecipeItem(name, unitOfMeasure, weight, id) {
    const recipeView = document.querySelector("#recipe")
    // const { name, unitOfMeasure } = ingredient
    recipeView.innerHTML += `
    <td>${name}</td>
    <td>${weight} ${unitOfMeasure}</td>
    <td><button type="button" id="editIngredient"class="btn btn-outline-primary bi bi-pencil" data-bs-toggle="modal" data-bs-target="#addIngredientsWeight" value="${id}"></button></td>
    <td><button id="deleteIngredient"class="btn btn-outline-danger bi bi-trash" value="${id}"></button></td>
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
    deleteBtn.setAttribute("value", id)
  }
  setIngredientEdit(myIngredient) {
    document.querySelector("#weight-modal-header").classList = ("modal-header bg-warning text-light")
    document.querySelector("#weight-modal-header").name = `${myIngredient.name}`
    document.querySelector("#weight-modal-header").querySelector("h5").innerText = `Edit Ingredient "${myIngredient.name}":`
    document.querySelector("#weightAddInput").placeholder = `Unit of mesure: ${myIngredient.unitOfMeasure}`
    document.querySelector("#weightAddInput").value = myIngredient.weight
    document.querySelector("#submitBtnAdd").value = myIngredient.id
    document.querySelector("#submitBtnAdd").textContent = "Edit"
    document.querySelector("#submitBtnAdd").name = "editRecipeIngredient"
  }

  resetIngredientButtons() {
    document.querySelector("#deleteIngredientButton").classList = "d-none"
    document.querySelector("#saveIngredientButton").removeAttribute("value")
    document.querySelector("#saveIngredientButton").textContent = "Save"
  }

  resetRecipeButtons() {
    document.querySelector("#recipeNameForm").reset()
    document.querySelector("#save-button").textContent = "Save"
    document.querySelector("#save-button").removeAttribute("value")
    document.querySelector("#delete-button").removeAttribute("value")
    document.querySelector("#delete-button").className = "d-none"
  }

  setIngredientNew(recipeName, myIngredient, id = "") {
    document.querySelector("#weight-modal-header").querySelector("h5").innerText = `Add "${myIngredient.name}" to "${recipeName}"`
    document.querySelector("#weight-modal-header").querySelector("h5").value = myIngredient.name
    document.querySelector("#weight-modal-header").name = `${myIngredient.name}`
    document.querySelector("#weight-modal-header").classList = ("modal-header bg-primary text-light")
    document.querySelector("#weightAddLabel").innerText = `Enter the quantity in ${myIngredient.unitOfMeasure} for "${myIngredient.name}"`
    document.querySelector("#weightAddInput").placeholder = `Unit of mesure: ${myIngredient.unitOfMeasure}`
    document.querySelector("#weightAddInput").name = `${myIngredient.unitOfMeasure}`
    document.querySelector("#submitBtnAdd").value = id
    document.querySelector("#submitBtnAdd").textContent = "Done" 
    document.querySelector("#submitBtnAdd").name = "addIngredientToRecipe"
  }
  setIngredientIntoForm(myIngredient) {
    document.querySelector("#ingredientHeader").textContent = `${myIngredient.name}`
    const deleteIngredientButton = document.querySelector("#deleteIngredientButton")
    deleteIngredientButton.classList = "btn myButton-danger"
    deleteIngredientButton.value = myIngredient.FSId
    const saveChangesButton = document.querySelector("#saveIngredientButton")
    saveChangesButton.textContent = "Save Changes"
    saveChangesButton.name = "save-changes"
    saveChangesButton.value = myIngredient.FSId

    const form = document.querySelector("#newIngredientForm");
    Object.entries(myIngredient).forEach(([key, value]) => {
      const input = form.querySelector(`#${key}`);
      if (input) {
        input.value = value;
      } else {
        if (key !== "id" && key !== "userId") {
          console.warn(`Input with id "${key}" not found in the form.`)
        }
      }
    });
  }
  getCustomTable(tableContent) {
    document.querySelector("#custom-table-title").textContent = `Cost Table for: ${tableContent.tableTitle}`;
    const tableHeader = document.querySelector("#custom-table-header");
    const tableBody = document.querySelector("#custom-table-body");

    const tableHeads = tableContent.tableHeads.map(item => ` <th class="table-primary">${item}</th>`).join('');
    tableHeader.innerHTML = `<tr>${tableHeads}</tr>`;
    
    tableBody.innerHTML = '';
    tableContent.tableItems.forEach((row) => {
        const rowHTML = tableContent.tableHeads.map((head) => `<td>${row[head] || ''}</td>`).join('');
        tableBody.innerHTML += `<tr>${rowHTML}</tr>`;
    });
  }
  getTableCostComplements(recipeData, calculations) {
    const complements = document.querySelector("#custom-table-complements")
            complements.classList.remove("d-none")
            complements.innerHTML = `
            <table class="table table-striped table-bordered">
                <thead class="thead-dark">
                    <tr>
                        <th>Product</th>
                        <th>Amount</th>
                        <th>Weight Per Unit</th>
                        <th>Cost Per Unit</th>
                        <th>Total Cost</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${recipeData.name}</td>
                        <td>${recipeData.amount} Units</td>
                        <td>${recipeData.weightPerUnit} g</td>
                        <td>${calculations["Cost Per Unit"]}</td>
                        <td>${calculations["Total Cost"]}</td>
                    </tr>
                </tbody>
            </table>
            <h5 class='bg-primary text-light p-2 mb-0'>Cost per ingredient:</h5>`
  }
  showHideWindows(elementToShow, classes) {
    document.querySelector("#newIngredientForm").classList = ("d-none")
    document.querySelector("#name-card").classList = ("d-none")
    document.querySelector("#recipeViewContainer").classList = ("d-none")
    document.querySelector("#custom-table-container").classList = ("d-none")
    document.querySelector(elementToShow).classList = (classes)
  }
}