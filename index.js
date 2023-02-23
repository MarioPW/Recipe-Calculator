import {
  getName,
  getValues,
  calculate,
  getCalculatedRecipe,
  myRecipesDropdown,
} from "./ui.js";

document.getElementById("recipeName").addEventListener("submit", saveName);
document.getElementById("userIngredients").addEventListener("submit", save);
document.getElementById("amounts").addEventListener("submit", saveParams);
document.getElementById("recipe").addEventListener("click", edit_delete);
document.getElementById("saveButton").addEventListener("click", saveMyRecipe);
document
  .getElementById("recipes-dropdown")
  .addEventListener("click", getMyRecipe);
document.getElementById("deleteButton").addEventListener("click", deleteRecipe);
document.getElementById("newRecipe").addEventListener("click", newRecipe);
document.getElementById("userIngredientsEdit"),
  addEventListener("submit", modalEdit);

function newRecipe() {
  localStorage.removeItem("amountWeight");
  localStorage.removeItem("calculatedRecipe");
  localStorage.removeItem("recipeTitle");
  localStorage.removeItem("valuesList");
  location.reload();
}
function saveName(e) {
  let name = document.getElementById("name").value;
  const rname = {
    name,
  };
  localStorage.setItem("recipeTitle", JSON.stringify(rname));
  getName();
  document.getElementById("recipeName").reset();
  e.preventDefault();
}

function saveIngredient(values) {
  if (localStorage.getItem("valuesList") === null) {
    let valuesList = [];
    valuesList.push(values);
    localStorage.setItem("valuesList", JSON.stringify(valuesList));
  } else {
    let valuesList = JSON.parse(localStorage.getItem("valuesList"));

    let repited = valuesList.filter((n) => n.ingredient == values.ingredient);
    if (repited.length === 0) {
      valuesList.push(values);
      localStorage.setItem("valuesList", JSON.stringify(valuesList));
    } else {
      alert("Ingerdient already exist!");
    }
  }
  getValues();
  document.getElementById("userIngredients").reset();
}

function save(e) {
  let ingredient = e.target.ingredient.value;
  let weight = e.target.weight.value;
  const values = {
    ingredient,
    weight,
  };
  saveIngredient(values);
  getValues();
  e.preventDefault();
}

function modalEdit(e) {
  let ingredient = e.target.ingredientEdit.value;
  let weight = e.target.weightEdit.value;
  const values = {
    ingredient,
    weight,
  };
  let index = e.target.submitBtnEdit.value;
  editIngredient(index, values);
  getValues();
  e.preventDefault();
}

function edit_delete(e) {
  let index = e.target.id;
  let value = e.target.value;
  if (index.includes("delete")) {
    deleteIngredient(value);
  } else {
    setEditableIngredient(value);
  }
}

function setEditableIngredient(index) {
  let ingInput = document.getElementById("ingredientEdit");
  let weightInput = document.getElementById("weightEdit");
  let button = document.getElementById("submitBtnEdit");
  let ings = JSON.parse(localStorage.getItem("valuesList"));
  ingInput.value = ings[index].ingredient;
  weightInput.value = ings[index].weight;
  button.value = index;
}

function deleteIngredient(ingredient) {
  let valuesList = JSON.parse(localStorage.getItem("valuesList"));
  for (let i = 0; i < valuesList.length; i++) {
    if (valuesList[i].ingredient == ingredient) {
      valuesList.splice(i, 1);
    }
  }
  localStorage.setItem("valuesList", JSON.stringify(valuesList));
  getValues();
}

function editIngredient(index, newValues) {
  let valuesList = JSON.parse(localStorage.getItem("valuesList"));
  let existingIndex = valuesList.findIndex(
    (n) => n.ingredient === newValues.ingredient
  );
  if (existingIndex == index || existingIndex === -1) {
    valuesList[index].ingredient = newValues.ingredient;
    valuesList[index].weight = newValues.weight;
    localStorage.setItem("valuesList", JSON.stringify(valuesList));
    document.getElementById("userIngredientsEdit").reset();
  } else {
    alert("Ingredient already exists!");
  }
}

function saveParams(e) {
  let unitWeight = document.getElementById("eachOneWeight").value;
  let amount = document.getElementById("unitsAmount").value;
  const params = {
    unitWeight,
    amount,
  };
  if (localStorage.getItem("amountWeight") === null) {
    let amountWeight = params;
    localStorage.setItem("amountWeight", JSON.stringify(amountWeight));
  } else {
    localStorage.setItem("amountWeight", JSON.stringify(params));
  }
  calculate();
  getCalculatedRecipe();
  e.preventDefault();
}

function saveMyRecipe(e) {
  let index = e.target.value;
  let values = JSON.parse(localStorage.getItem("valuesList"));
  let name = JSON.parse(localStorage.getItem("recipeTitle"));
  let myRecipes = JSON.parse(localStorage.getItem("myRecipes"));

  if (index == "") {
    let myRecipe = {
      name: name.name,
      values,
    };
    if (localStorage.getItem("myRecipes") === null) {
      let myRecipes = [];
      myRecipes.push(myRecipe);
      localStorage.setItem("myRecipes", JSON.stringify(myRecipes));
      alert("Recipe saved on this device.");
    } else {
      let repited = myRecipes.filter((n) => n.name == myRecipe.name);
      if (repited.length === 0) {
        myRecipes.push(myRecipe);
        localStorage.setItem("myRecipes", JSON.stringify(myRecipes));
        alert("Recipe saved on this device.");
      } else {
        alert("This recipe already exists");
      }
    }
  } else {
    saveChanges(index, myRecipes);
  }
  location.reload();
}

function getMyRecipe(e) {
  let myRecipeName = e.target.id;
  let nameJSON = { name: myRecipeName };
  localStorage.setItem("recipeTitle", JSON.stringify(nameJSON));
  let a = JSON.parse(localStorage.getItem("myRecipes"));
  let recipe = a.filter((a) => a.name == myRecipeName);
  let index = a.findIndex((a) => a.name == myRecipeName);
  let values = recipe[0].values;
  localStorage.setItem("valuesList", JSON.stringify(values));
  let buttonContainer = document.getElementById("saveButtonContainer");
  let saveBtn = document.getElementById("saveButton");
  let deleteBtn = document.getElementById("deleteButton");
  saveBtn.textContent = "Save Changes";
  saveBtn.setAttribute("value", index);
  deleteBtn.className = "btn btn-danger";
  deleteBtn.textContent = "Delete";
  deleteBtn.setAttribute("value", recipe[0].name);
  buttonContainer.className = "";

  getName(myRecipeName);
  getValues(values);
}

function saveChanges(index, myRecipes) {
  let name = JSON.parse(localStorage.getItem("recipeTitle"));
  let values = JSON.parse(localStorage.getItem("valuesList"));
  let repited = myRecipes.filter((a) => a.name == name.name);
  if (repited.length == 1) {
    for (let i = 0; i < myRecipes.length; i++) {
      if (myRecipes[i].name === name.name) {
        if (i != index) {
          alert("This recipe name already exists");
        } else {
          let myRecipe = {
            name: name.name,
            values,
          };

          myRecipes[index] = myRecipe;
          localStorage.setItem("myRecipes", JSON.stringify(myRecipes));

          alert("Changes Saved");
        }
      }
    }
  } else {
    let myRecipe = {
      name: name.name,
      values,
    };
    myRecipes[index] = myRecipe;
    localStorage.setItem("myRecipes", JSON.stringify(myRecipes));

    alert("Changes Saved ok");
  }
}

function deleteRecipe(e) {
  const message = `Sure you want to delete ${e.target.value}?`
  const confirmDelete = confirm( message );
  if (confirmDelete === true) {
    const recipeName = e.target.value;
    const myRecipes = JSON.parse(localStorage.getItem("myRecipes"));
    const del = myRecipes.findIndex((a) => a.name === recipeName);
    if (del != -1) {
      myRecipes.splice(del, 1);
    }
    localStorage.setItem("myRecipes", JSON.stringify(myRecipes));
    location.reload();
    newRecipe();
  }
}

getName();
getValues();
myRecipesDropdown();
