import {
    getName,
    getRecipeItems,
    calculate,
    getCalculatedRecipe,
    getConvertionHeader,
    dropdown,
    convertAndStoreRecipes
} from "./ui.js";
import { Recipe, Ingredient, isRepited } from "./models.js";

const recipe = new Recipe()
const recipeViewContainer = document.getElementById("recipeViewContainer")

document.getElementById("recipeName").addEventListener("submit", (e) => {
    localStorage.removeItem("amountWeight")
    localStorage.removeItem("calculatedRecipe")
    localStorage.removeItem("ingredients")
    const name = document.getElementById("name").value.toUpperCase()
    if (isRepited(name, "myRecipes")) {
        alert(`Recipe name ${name} already exists`)
    } else {
        recipe.setName(name)
        recipeViewContainer.className = "card p-3 shadow rounded-0"
        getName(recipe.name)
       
    }
    e.preventDefault();
});

document.getElementById("userIngredients").addEventListener("submit", (e) => {
    const name = e.target.ingredient.value
    const weight = e.target.weight.value
    if (isRepited(name, "ingredients")) {
        alert(`Ingerdient ${name} already exist!`)
    } else {
        const ingredient = new Ingredient(
            name,
            weight
        );
        ingredient.saveIngredient()
        getRecipeItems()
        document.getElementById("userIngredients").reset()
    }
    e.preventDefault()
});

document.getElementById("amounts").addEventListener("submit", (e) => {
    const unitWeight = document.getElementById("eachOneWeight").value;
    const amount = document.getElementById("unitsAmount").value;
    const params = {
        unitWeight,
        amount,
        name: recipe.name,
        unitWeight
    };
    const calculatedRecipe = calculate(params);
    getCalculatedRecipe(calculatedRecipe);
    getConvertionHeader(params);
    e.preventDefault();
});

document.getElementById("recipe").addEventListener("click", (e) => {
    if (e.target.localName == "button" || e.target.nodeName == "BUTTON") {
        const index = e.target.id;
        const value = e.target.value;
        index.includes("delete") ?
            deleteIngredient(value) :
            setEditableIngredient(value);
    }
});

const saveChangesButton = document.getElementById("saveButton")
saveChangesButton.addEventListener("click", (e) => {
    const index = e.target.value
    const ingredients = JSON.parse(localStorage.getItem("ingredients"))
    const myRecipes = JSON.parse(localStorage.getItem("myRecipes"))

    if (index == "") {
        recipe.setIngredients(ingredients)
        if (localStorage.getItem("myRecipes") === null) {
            const myRecipes = []
            myRecipes.push(recipe)
            localStorage.setItem("myRecipes", JSON.stringify(myRecipes))
            alert("Recipe saved on this device.")
        } else {
            const repited = myRecipes.filter((n) => n.name == recipe.name)
            if (repited.length === 0) {
                myRecipes.push(recipe)
                myRecipes.sort()
                localStorage.setItem("myRecipes", JSON.stringify(myRecipes))
                alert("Recipe saved on this device.")
            } else {
                alert("This recipe already exists")
            }
        }

    } else {
        saveChanges(index, myRecipes);
    }
    dropdown("myRecipes", "recipes-dropdown")
});

const getMyRecipe = document.getElementById("recipes-dropdown")
getMyRecipe.addEventListener("click", (e) => {
    if (e.target.localName == "li" || e.target.nodeName == "LI") {
        recipeViewContainer.className = "card p-3 shadow rounded-0"
        const myRecipeName = e.target.id;
        const myRecipes = JSON.parse(localStorage.getItem("myRecipes"));
        const recipe = myRecipes.filter((myRecipe) => myRecipe.name == myRecipeName);
        const index = myRecipes.findIndex((myRecipe) => myRecipe.name == myRecipeName);
        const ingredients = recipe[0].ingredients;
        if (ingredients) {localStorage.setItem("ingredients", JSON.stringify(ingredients))}
        document.getElementById("saveButtonContainer").className = "";;
        const saveBtn = document.getElementById("saveButton");
        const deleteBtn = document.getElementById("delete-button");
        saveBtn.textContent = "Save Changes";
        saveBtn.setAttribute("value", index);
        deleteBtn.className = "btn btn-danger btn-sm";
        deleteBtn.textContent = "Delete";
        deleteBtn.setAttribute("value", recipe[0].name);

        getName(myRecipeName);
        getRecipeItems(ingredients);
    }
})

document.getElementById("delete-button").addEventListener("click", (e) => {
    const message = `Sure you want to delete ${e.target.value}?`
    if (confirm(message)) {
        const recipeName = e.target.value;
        const myRecipes = JSON.parse(localStorage.getItem("myRecipes"));
        const del = myRecipes.findIndex((a) => a.name === recipeName);
        if (del != -1) {
            myRecipes.splice(del, 1);
            localStorage.removeItem("ingredients");
        }
        localStorage.setItem("myRecipes", JSON.stringify(myRecipes));
        location.reload();
        newRecipe();
    }
})

document.getElementById("userIngredientsEdit")
    .addEventListener("submit", (e) => {
        if (e.target) {
            const weight = e.target.weightEdit.value;
            const name = e.target.ingredientEdit.value;
            const editedIngredient = new Ingredient(
                name,
                weight
            );
            const index = e.target.submitBtnEdit.value;
            editIngredient(index, editedIngredient);
            getRecipeItems();
            e.preventDefault();
        }
    })

const setNewRecipe = document.getElementById("newRecipe")
setNewRecipe.addEventListener("click", newRecipe)
function newRecipe() {
    localStorage.removeItem("amountWeight")
    localStorage.removeItem("calculatedRecipe")
    localStorage.removeItem("recipeName")
    localStorage.removeItem("ingredients")
    location.reload()
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
        getRecipeItems();
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

function saveChanges(index, myRecipes) {
    const name = myRecipes[index].name
    let ingredients = JSON.parse(localStorage.getItem("ingredients"));

    // Check if ingredients are not present in the localStorage
    if (!ingredients) {
        ingredients = myRecipes[index].ingredients;
    }

    // Check if the new recipe name is the same as the old name
    if (name === recipe.name || recipe.name == "") {
        recipe.setName(name);
        recipe.setIngredients(ingredients);
        myRecipes[index] = recipe
        localStorage.setItem("myRecipes", JSON.stringify(myRecipes));
        alert("Changes Saved Successfully ok");
    } else {
        // Check if the new recipe name already exists
        const isNameAlreadyExists = myRecipes.some((r, i) => i != index && r.name == name);
        if (isNameAlreadyExists) {
            alert(`Recipe with name ${name} already exists`);
        } else {
            recipe.setIngredients(ingredients);
            myRecipes[index] = recipe
            localStorage.setItem("myRecipes", JSON.stringify(myRecipes));
            alert("Changes Saved Successfully");
        }
    }
}

convertAndStoreRecipes()
dropdown("myRecipes", "recipes-dropdown")
