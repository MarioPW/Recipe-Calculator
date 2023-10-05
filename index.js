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
  const name = document.getElementById("name").value;
  const rname = {
    name,
  };
  localStorage.setItem("recipeTitle", JSON.stringify(rname));
  getName(name);
  document.getElementById("recipeName").reset();
  e.preventDefault();
}

function saveIngredient(values) {
  if (localStorage.getItem("valuesList") === null) {
    const valuesList = [];
    valuesList.push(values);
    localStorage.setItem("valuesList", JSON.stringify(valuesList));
  } else {
    const valuesList = JSON.parse(localStorage.getItem("valuesList"));

    const repited = valuesList.filter((n) => n.ingredient == values.ingredient);
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
  const ingredient = e.target.ingredient.value;
  const weight = e.target.weight.value;
  const values = {
    ingredient,
    weight,
  };
  saveIngredient(values);
  getValues();
  e.preventDefault();
}

function modalEdit(e) {
  const ingredient = e.target.ingredientEdit.value;
  const weight = e.target.weightEdit.value;
  const values = {
    ingredient,
    weight,
  };
  const index = e.target.submitBtnEdit.value;
  editIngredient(index, values);
  getValues();
  e.preventDefault();
}

function edit_delete(e) {
  const index = e.target.id;
  const value = e.target.value;
  if (index.includes("delete")) {
    deleteIngredient(value);
  } else {
    setEditableIngredient(value);
  }
}

function setEditableIngredient(index) {
  const ingInput = document.getElementById("ingredientEdit");
  const weightInput = document.getElementById("weightEdit");
  const button = document.getElementById("submitBtnEdit");
  const ings = JSON.parse(localStorage.getItem("valuesList"));
  ingInput.value = ings[index].ingredient;
  weightInput.value = ings[index].weight;
  button.value = index;
}

function deleteIngredient(ingredient) {
  const valuesList = JSON.parse(localStorage.getItem("valuesList"));
  for (let i = 0; i < valuesList.length; i++) {
    if (valuesList[i].ingredient == ingredient) {
      valuesList.splice(i, 1);
    }
  }
  localStorage.setItem("valuesList", JSON.stringify(valuesList));
  getValues();
}

function editIngredient(index, newValues) {
  const valuesList = JSON.parse(localStorage.getItem("valuesList"));
  const existingIndex = valuesList.findIndex(
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
  const unitWeight = document.getElementById("eachOneWeight").value;
  const amount = document.getElementById("unitsAmount").value;
  const params = {
    unitWeight,
    amount,
  };
  if (localStorage.getItem("amountWeight") === null) {
    const amountWeight = params;
    localStorage.setItem("amountWeight", JSON.stringify(amountWeight));
  } else {
    localStorage.setItem("amountWeight", JSON.stringify(params));
  }
  calculate();
  getCalculatedRecipe();
  e.preventDefault();
}

function saveMyRecipe(e) {
  const index = e.target.value;
  const values = JSON.parse(localStorage.getItem("valuesList"));
  const name = JSON.parse(localStorage.getItem("recipeTitle"));
  const myRecipes = JSON.parse(localStorage.getItem("myRecipes"));

  if (index == "") {
    const myRecipe = {
      name: name.name,
      values,
    };
    if (localStorage.getItem("myRecipes") === null) {
      const myRecipes = [];
      myRecipes.push(myRecipe);
      localStorage.setItem("myRecipes", JSON.stringify(myRecipes));
      alert("Recipe saved on this device.");
    } else {
      const repited = myRecipes.filter((n) => n.name == myRecipe.name);
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
  const myRecipeName = e.target.id;
  const nameJSON = { name: myRecipeName };
  localStorage.setItem("recipeTitle", JSON.stringify(nameJSON));
  const a = JSON.parse(localStorage.getItem("myRecipes"));
  const recipe = a.filter((a) => a.name == myRecipeName);
  const index = a.findIndex((a) => a.name == myRecipeName);
  const values = recipe[0].values;
  localStorage.setItem("valuesList", JSON.stringify(values));
  const buttonContainer = document.getElementById("saveButtonContainer");
  const saveBtn = document.getElementById("saveButton");
  const deleteBtn = document.getElementById("deleteButton");
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
  const name = JSON.parse(localStorage.getItem("recipeTitle"));
  const values = JSON.parse(localStorage.getItem("valuesList"));
  const repited = myRecipes.filter((a) => a.name == name.name);
  if (repited.length == 1) {
    for (let i = 0; i < myRecipes.length; i++) {
      if (myRecipes[i].name === name.name) {
        if (i != index) {
          alert("This recipe name already exists");
        } else {
          const myRecipe = {
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
    const myRecipe = {
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
