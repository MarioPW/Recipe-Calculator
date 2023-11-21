import {
    getName,
    getRecipeItems,
    getRecipeItem,
    getCalculatedRecipe,
    getDropdown,
    setSavedRecipeButtons
} from "./src/ui.js";
import { Recipe, Ingredient } from "./src/models.js"
import { isRepeated, cleanLocalStorage } from "./utils/utils.js"
import { calculate } from "./utils/calculator.js"
import { convertAndStoreRecipes } from "./utils/start.js"
import { RecipeService } from "./src/services/recipeService.js"
import { IngredientsService } from "./src/services/ingredientsService.js"

const recipeService = new RecipeService()
const ingredientService = new IngredientsService()
const recipeViewContainer = document.querySelector("#recipeViewContainer")

const recipeName = document.querySelector("#recipeName")
recipeName.addEventListener("submit", (e) => {
    const name = document.querySelector("#name").value.toUpperCase()
    if (isRepeated(name, "myRecipes")) {
        alert(`Recipe name "${name}" already exists`)
    } else {
        recipeViewContainer.className = "card p-3 shadow rounded-0"
        getName(name)
    }
    e.preventDefault();
});

const userIngredients = document.querySelector("#userIngredients")
userIngredients.addEventListener("submit", (e) => {
    const name = e.target.ingredient.value
    const weight = e.target.weight.value
    if (isRepeated(name, "ingredients")) {
        alert(`Ingerdient "${name}" already exist!`)
    } else {
        const ingredient = new Ingredient(
            name,
            weight
        );
        ingredientService.save(ingredient)
        getRecipeItem(ingredient)
        document.querySelector("#userIngredients").reset()
    }
    e.preventDefault()
});

document.querySelector("#amounts").addEventListener("submit", (e) => {
    const unitWeight = document.querySelector("#eachOneWeight").value
    const amount = document.querySelector("#unitsAmount").value
    const name = document.querySelector("#newRecipeName").textContent
    const params = {
        unitWeight,
        amount,
        name,
    }
    const calculatedRecipe = calculate(params)
    getCalculatedRecipe(calculatedRecipe, params)
    e.preventDefault()
})

document.querySelector("#recipe").addEventListener("click", (e) => {
    if (e.target.localName == "button" || e.target.nodeName == "BUTTON") {
        const index = e.target.id;
        const ingredientId = e.target.value;
        index == "deleteIngredient" ?
            deleteIngredient(ingredientId) :
            setEditableIngredient(ingredientId);
    }
})

const saveNewRecipe = document.querySelector("#save-button")
saveNewRecipe.addEventListener("click", (e) => {
    const id = e.target.value
    const ingredients = ingredientService.getAllIngredients()
    const name = document.querySelector("#newRecipeName").textContent
    if (id === "") {
        if (isRepeated(name, "myRecipes")) {
            alert(`Recipe name "${name}" already exists`)
        }
        const recipe = new Recipe()
        recipe.setName(name)
        recipe.setIngredients(ingredients)
        recipeService.saveRecipe(recipe)
        setSavedRecipeButtons(recipe.id)
        alert("Recipe saved on this device.")
    } else {
        saveChanges(id);
    }
    getDropdown("myRecipes", "recipes-dropdown")
})

const setNewRecipe = document.querySelector("#newRecipe")
setNewRecipe.addEventListener("click", () => {
    cleanLocalStorage()
    location.reload()
})

const getMyRecipe = document.querySelector("#recipes-dropdown")
getMyRecipe.addEventListener("click", (e) => {
    if (e.target.localName == "li" || e.target.nodeName == "LI") {
        recipeViewContainer.className = "card p-3 shadow rounded-0"
        const myRecipe = recipeService.getRecipeByName(e.target.id)
        ingredientService.storageIngredients(myRecipe.ingredients)
        getName(myRecipe.name)
        getRecipeItems(myRecipe.ingredients)
        setSavedRecipeButtons(myRecipe.id)
    }
})

document.querySelector("#delete-button").addEventListener("click", (e) => {
    const recipeToDel = recipeService.getRecipeById(e.target.value)
    const message = `Sure you want to delete "${recipeToDel.name}"?`
    if (confirm(message)) {
        recipeService.delete(recipeToDel.id)
        cleanLocalStorage();
        location.reload()
    }
})

const userIngredientsEdit = document.querySelector("#userIngredientsEdit")
userIngredientsEdit.addEventListener("submit", (e) => {
    if (e.target) {
        const weight = e.target.weightEdit.value
        const name = e.target.ingredientEdit.value
        const id = e.target.submitBtnEdit.value
        const ingredients = ingredientService.getAllIngredients()
        const existingName = ingredients.find((n) => n.name === name)
        if (!existingName || existingName.id == id) {
            const updates = { name, weight, id }
            ingredientService.update(updates);
            getRecipeItems();
            e.preventDefault();
            document.querySelector("#userIngredientsEdit").reset();
        } else {
            alert(`Ingredient "${name}" already exists`)
            e.preventDefault()
        }
    }
})

function setEditableIngredient(id) {
    const ingInput = document.querySelector("#ingredientEdit");
    const weightInput = document.querySelector("#weightEdit");
    const button = document.querySelector("#submitBtnEdit");
    const ing = ingredientService.getIngredientByid(id)
    ingInput.value = ing.name;
    weightInput.value = ing.weight;
    button.value = id;
}
function deleteIngredient(id) {
    const ingredient = ingredientService.getIngredientByid(id)
    const confirmDelete = confirm(`Sure you want to delete "${ingredient.name}"?`);
    if (confirmDelete) {
        ingredientService.delete(id)
        getRecipeItems();
    }
}
function saveChanges(id) {
    const updates = recipeService.getRecipeById(id)
    const newName = document.querySelector("#newRecipeName").textContent
    let ingredients = ingredientService.getAllIngredients()
    updates.name = newName
    updates.ingredients = ingredients
    if (recipeService.update(updates)){
        alert("Changes Saved Successfully")
    }
}
convertAndStoreRecipes()
getDropdown("myRecipes", "recipes-dropdown")