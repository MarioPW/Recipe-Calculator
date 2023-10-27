import {
    getName,
    getValues,
    calculate,
    getCalculatedRecipe,
    myRecipesDropdown
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
document.getElementById("userIngredientsEdit"),
    addEventListener("submit", modalEdit);
document.getElementById("newRecipe").addEventListener("click", newRecipe);

const recipe = new Recipe()

function newRecipe() {
    localStorage.removeItem("amountWeight")
    localStorage.removeItem("calculatedRecipe")
    localStorage.removeItem("recipeName")
    localStorage.removeItem("ingredients")
    location.reload()
}

function saveName(e) {
    localStorage.removeItem("amountWeight")
    localStorage.removeItem("calculatedRecipe")
    localStorage.removeItem("ingredients")
    const name = document.getElementById("name").value.toUpperCase()

    const myRecipes = JSON.parse(localStorage.getItem("myRecipes"))
    if (myRecipes) {
        const names = myRecipes.map((recipe) => recipe.name)
        if (names && names.includes(name)) {
            alert(`Recipe name ${name} already exists`)
            e.preventDefault()
        } else {
            recipe.setName(name)
            const localStorageName = { name: `${name}` }
            localStorage.setItem("recipeName", JSON.stringify(localStorageName));
            getName(recipe.name);
            document.getElementById("recipeViewContainer").className = "card p-3 shadow rounded-0";
            e.preventDefault();
        }
    } else {
        recipe.setName(name)
        const localStorageName = { name: `${name}` }
        localStorage.setItem("recipeName", JSON.stringify(localStorageName));
        getName(recipe.name);
        document.getElementById("recipeViewContainer").className = "card p-3 shadow rounded-0";
        e.preventDefault();
    }
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
    const weight = e.target.weightEdit.value;
    const name = e.target.ingredientEdit.value;
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
    if (confirmDelete) {
        const ingredients = JSON.parse(localStorage.getItem("ingredients"));
        for (let i = 0; i < ingredients.length; i++) {
            if (ingredients[i].name == ingredient) {
                ingredients.splice(i, 1);
            }
        }
        localStorage.setItem("ingredients", JSON.stringify(ingredients));
        getValues();
    }
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
    const myRecipes = JSON.parse(localStorage.getItem("myRecipes"));

    if (index == "") {
        recipe.setIngredients(ingredients)
        if (localStorage.getItem("myRecipes") === null) {
            const myRecipes = [];
            myRecipes.push(recipe);
            localStorage.setItem("myRecipes", JSON.stringify(myRecipes));
            alert("Recipe saved on this device.");
        } else {
            const repited = myRecipes.filter((n) => n.name == recipe.name);
            if (repited.length === 0) {
                myRecipes.push(recipe);
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
}

function getMyRecipe(e) {
    document.getElementById("recipeViewContainer").className = "card p-3 shadow rounded-0";
    //document.getElementById("name-card").className = "hide"
    const myRecipeName = e.target.id;
    const nameJSON = { name: myRecipeName };
    localStorage.setItem("recipeName", JSON.stringify(nameJSON));
    const myRecipes = JSON.parse(localStorage.getItem("myRecipes"));
    const recipe = myRecipes.filter((myRecipe) => myRecipe.name == myRecipeName);
    const index = myRecipes.findIndex((myRecipe) => myRecipe.name == myRecipeName);
    const ingredients = recipe[0].ingredients;
    if (ingredients) {
        localStorage.setItem("ingredients", JSON.stringify(ingredients));
    }
    const buttonContainer = document.getElementById("saveButtonContainer");
    const saveBtn = document.getElementById("saveButton");
    const deleteBtn = document.getElementById("deleteButton");
    saveBtn.textContent = "Save Changes";
    saveBtn.setAttribute("value", index);
    deleteBtn.className = "btn btn-danger btn-sm";
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("value", recipe[0].name);
    buttonContainer.className = "";

    getName(myRecipeName);
    getValues(ingredients);
}

function saveChanges(index, myRecipes) {
    console.log(myRecipes[index].ingredients)
    const name = JSON.parse(localStorage.getItem("recipeName"));
    let ingredients = JSON.parse(localStorage.getItem("ingredients"));
    if (!ingredients) { // Only recipe name was changed
        ingredients = myRecipes[index].ingredients
    }
    const repited = myRecipes.filter((a) => a.name == name.name);
    if (repited.length != 1) {
        recipe.setName(name.name)
        recipe.setIngredients(ingredients)
        myRecipes[index] = recipe;
        localStorage.setItem("myRecipes", JSON.stringify(myRecipes));

        alert("Changes Saved Successfully");
    }
    for (let i = 0; i < myRecipes.length; i++) {
        if (myRecipes[i].name === name.name) {
            if (i != index) {
                alert(`Recipe with name ${name.name} already exists`);
            } else {

                recipe.setIngredients(ingredients)
                recipe.setName(name.name)
                myRecipes[index] = recipe;
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
// convertAndStoreRecipes()
myRecipesDropdown()
