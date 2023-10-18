import {
    getName,
    getValues,
    calculate,
    getCalculatedRecipe,
    myRecipesDropdown,
} from "./ui.js";
import { Recipe, Ingredient } from "./models.js";

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
    localStorage.removeItem("recipeName");
    localStorage.removeItem("ingredients");
    location.reload();
}

function saveName(e) {
    const name = document.getElementById("name").value;
    const recipeName = {
        name,
    };
    localStorage.setItem("recipeName", JSON.stringify(recipeName));
    getName(name);
    document.getElementById("recipeName").reset();
    e.preventDefault();
}

function saveIngredient(ingredient /* Type Ingredient */) {
    if (localStorage.getItem("ingredients") === null) {
        const ingredients = [];
        ingredients.push(ingredient);
        localStorage.setItem("ingredients", JSON.stringify(ingredients));
    } else {
        const ingredients = JSON.parse(localStorage.getItem("ingredients"));
        const repited = ingredients.filter((n) => n.name == ingredient.name);
        if (repited.length === 0) {
            ingredients.push(ingredient);
            localStorage.setItem("ingredients", JSON.stringify(ingredients));
        } else {
            alert("Ingerdient already exist!");
        }
    } 
    getValues();
    document.getElementById("userIngredients").reset();
}

function save(e) {
    const name = e.target.ingredient.value;
    const weight = e.target.weight.value;
    const ingredient = new Ingredient(
        name,
        weight
    );
    saveIngredient(ingredient);
    getValues();
    e.preventDefault();
}

function modalEdit(e) {
    const name = e.target.ingredientEdit.value;
    const weight = e.target.weightEdit.value;
    const editedIngredient = new Ingredient(
        name,
        weight
        );
    const index = e.target.submitBtnEdit.value;
    editIngredient(index, editedIngredient);
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
    const ings = JSON.parse(localStorage.getItem("ingredients"));
    ingInput.value = ings[index].name;
    weightInput.value = ings[index].weight;
    button.value = index;
}

function deleteIngredient(ingredient) {
    const message = `Sure you want to delete ${ingredient}?`
    const confirmDelete = confirm(message);
    if (confirmDelete){
        const ingredients = JSON.parse(localStorage.getItem("ingredients"));
        for (let i = 0; i < ingredients.length; i++) {
            if (ingredients[i].name == ingredient) {
                ingredients.splice(i, 1);
            }
        }
        localStorage.setItem("ingredients", JSON.stringify(ingredients));
        getValues();}
}

function editIngredient(index, newValues) {
    const ingredients = JSON.parse(localStorage.getItem("ingredients"));
    const existingIndex = ingredients.findIndex(
        (n) => n.name === newValues.name
    );
    if (existingIndex == index || existingIndex === -1) {
        ingredients[index].name = newValues.name;
        ingredients[index].weight = newValues.weight;
        localStorage.setItem("ingredients", JSON.stringify(ingredients));
        document.getElementById("userIngredientsEdit").reset();
    } else {
        alert("Ingredient already exists");
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
    const ingredients = JSON.parse(localStorage.getItem("ingredients"));
    const name = JSON.parse(localStorage.getItem("recipeName"));
    const myRecipes = JSON.parse(localStorage.getItem("myRecipes"));

    if (index == "") {
        const myRecipe = new Recipe(
            name.name,
            ingredients,
            );
        if (localStorage.getItem("myRecipes") === null) {
            const myRecipes = [];
            myRecipes.push(myRecipe);
            localStorage.setItem("myRecipes", JSON.stringify(myRecipes));
            alert("Recipe saved on this device.");
        } else {
            const repited = myRecipes.filter((n) => n.name == myRecipe.name);
            if (repited.length === 0) {
                myRecipes.push(myRecipe);
                myRecipes.sort();
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
    const nameCard = document.getElementById("name-card")
    nameCard.className = "hide"
    const myRecipeName = e.target.id;
    const nameJSON = { name: myRecipeName };
    localStorage.setItem("recipeName", JSON.stringify(nameJSON));
    const a = JSON.parse(localStorage.getItem("myRecipes"));
    const recipe = a.filter((a) => a.name == myRecipeName);
    const index = a.findIndex((a) => a.name == myRecipeName);
    const ingredients = recipe[0].ingredients;
    localStorage.setItem("ingredients", JSON.stringify(ingredients));
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
    getValues(ingredients);
}

function saveChanges(index, myRecipes) {
    const name = JSON.parse(localStorage.getItem("recipeName"));
    const ingredients = JSON.parse(localStorage.getItem("ingredients"));
    const repited = myRecipes.filter((a) => a.name == name.name);
    if (repited.length != 1) {
        const myRecipe = new Recipe(
        name.name,
        ingredients,
        );
    myRecipes[index] = myRecipe;
    localStorage.setItem("myRecipes", JSON.stringify(myRecipes));

    alert("Changes Saved Successfully");
    }
    for (let i = 0; i < myRecipes.length; i++) {
        if (myRecipes[i].name === name.name) {
            if (i != index) {
                alert("This recipe name already exists");
            } else {
                const myRecipe = new Recipe(
                    name.name,
                    ingredients,
                    );
                myRecipes[index] = myRecipe;
                localStorage.setItem("myRecipes", JSON.stringify(myRecipes));
                alert("Changes Saved ok");
            }
        }
    }        
}

function deleteRecipe(e) {
    const message = `Sure you want to delete ${e.target.value}?`
    const confirmDelete = confirm(message);
    if (confirmDelete === true) {
        const recipeName = e.target.value;
        const myRecipes = JSON.parse(localStorage.getItem("myRecipes"));
        const del = myRecipes.findIndex((a) => a.name === recipeName);
        const ingredients = JSON.parse(localStorage.getItem("ingredients"));
        if (del != -1) {
            myRecipes.splice(del, 1);
            localStorage.removeItem("ingredients");
        }
        localStorage.setItem("myRecipes", JSON.stringify(myRecipes));
        location.reload();
        newRecipe();
    }
}

getName();
getValues();
myRecipesDropdown();
