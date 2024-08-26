import { Ui } from "./src/ui.js"
import { Recipe, Ingredient } from "./src/models.js"
import { isRepeated, cleanLocalStorage, startNewRecipe, convertAndStoreRecipes } from "./src/services/utils.js"
import { Calculator } from "./src/services/calculator.js"
import { IngredientRepo } from "./src/repositories/ingredientRepo.js"
import { RecipeRepo } from "./src/repositories/recipeRepo.js"
import { IngRecipeRepo } from "./src/repositories/ingredientRecipe.js"

import { auth, db } from "./src/firebaseConfig.js"
import "./src/firebaseAuth/logout.js"

// ================ LOCALSTORAGE DB =============
const ingredientRecipe = new IngRecipeRepo()
// ----------------------------------------------

// ================ FIREBASE DB =================================
export const ingredientRepository = new IngredientRepo(db, auth)
const recipeRepository = new RecipeRepo(db, auth)
// --------------------------------------------------------------

const ui = new Ui()
const calculator = new Calculator()

// ALL EVENT LISTENERS HERE:

const recipeName = document.querySelector("#recipeName")
recipeName.addEventListener("submit", (e) => {
    const name = document.querySelector("#name").value.toUpperCase()
    if (isRepeated(name, "myRecipes")) {
        alert(`Recipe name "${name}" already exists`)
    } else {
        ui.showHideWindows("#recipeViewContainer", "card p-3 shadow rounded-0")
        ui.getName(name)
    }
    e.preventDefault()
})
const newIngredientButton = document.querySelector("#newIngredient")
newIngredientButton.addEventListener("click", () => {
    const newIngredientForm = document.querySelector("#userIngredientsForm")
    newIngredientForm.reset()
    document.querySelector("#ingredientHeader").textContent = `New Ingredient:`
    ui.showHideWindows("#newIngredientForm", "")
    ui.resetIngredientButtons()
})
const userIngredientsForm = document.querySelector("#userIngredientsForm")
userIngredientsForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const button = document.querySelector("#saveIngredientButton")
    const data = Object.fromEntries(
        new FormData(e.target)
    )
    if (button.name == "save") {
        if (isRepeated(data.name, "myIngredients")) {
            alert(`Ingerdient "${data.name}" already exist!`)
        } else {
            const ingredient = new Ingredient({ ...data })
            const response = await ingredientRepository.saveIngredient(ingredient)
            if (response) {
                userIngredientsForm.reset()
                ui.getDropdown("myIngredients", "add-ingredients-dropdown")
                ui.getDropdown("myIngredients", "nav-ingredients-dropdown")
            }
        }
    }
})
const calculateButton = document.querySelector("#calculateToggleButton")
calculateButton.addEventListener("click", () => {
    const button = document.querySelector("#calculateButton")
    button.setAttribute("data-bs-target", "#calculated")
    button.textContent = "Calculate"
    button.name = "calculate"
})
const amounts = document.querySelector("#amounts")
amounts.addEventListener("submit", async (e) => {
    e.preventDefault()
    const button = document.querySelector("#calculateButton")
    const name = document.querySelector("#newRecipeName").textContent
    const values = Object.fromEntries(new FormData(amounts))
    const recipeData = { ...values, name }
    const ingredientsRecipe = ingredientRecipe.getAllIngredients()
    const calculatedProportions = calculator.calculateInProportion(recipeData, ingredientsRecipe)
    if (button.name == "calculate") {
        ui.getCalculatedRecipe(calculatedProportions, recipeData)
        amounts.reset()

    } else if (button.name == "makeTraceability") {
        const recipeingredients = ingredientRecipe.getAllIngredients()
        const ingredientsPromises  = recipeingredients.map(async (ingredient) => {
            return await ingredientRepository.getMyIngredientByid(ingredient.id)
        })
        const ingredients = await Promise.all(ingredientsPromises);
        ui.getTraceability(ingredients, calculatedProportions, recipeData)
    }
})
const editDeleteIngredient = document.querySelector("#recipe")
editDeleteIngredient.addEventListener("click", (e) => {
    if (e.target.localName == "button" || e.target.nodeName == "BUTTON") {
        const index = e.target.id
        const id = e.target.value
        const ingredient = ingredientRecipe.getIngredientByid(id)
        if (index == "deleteIngredient") {
            if (confirm(`Sure you want to delete "${ingredient.name}"?`)) {
                ingredientRecipe.deleteFromRecipe(id)
                const ingredients = ingredientRecipe.getAllIngredients()
                const recipeId = document.querySelector("#save-button").value
                const name = document.querySelector("#newRecipeName").textContent
                recipeRepository.update(ingredients, recipeId, name)
                ui.getRecipeItems(ingredients)
            }
        } else {
            ui.setIngredientEdit(ingredient, id)
        }
    }
})
const saveNewRecipe = document.querySelector("#save-button")
saveNewRecipe.addEventListener("click", async (e) => {
    const id = e.target.value
    const ingredients = ingredientRecipe.getAllIngredients()
    const name = document.querySelector("#newRecipeName").textContent
    if (id === "") {
        if (isRepeated(name, "myRecipes")) {
            alert(`Recipe name "${name}" already exists`)
        }
        const recipe = new Recipe(name, ingredients)
        const response = await recipeRepository.saveRecipe(recipe)
        ui.setSavedRecipeButtons(response.id)
    } else {
        const name = document.querySelector("#newRecipeName").textContent
        const recipeId = document.querySelector("#save-button").value
        const ingredientChanges = ingredientRecipe.getAllIngredients()
        recipeRepository.update(ingredientChanges, recipeId, name)
    }
    ui.getDropdown("myRecipes", "nav-recipes-dropdown")
})
const setNewRecipe = document.querySelector("#newRecipe")
setNewRecipe.addEventListener("click", () => {
    cleanLocalStorage()
    ui.resetRecipeButtons()
    document.querySelector("#recipe").textContent = ""
    const ingredients = ingredientRepository.getAllIngredients()
    if (!ingredients) {
        alert("Please add ingredients first")
    } else {
        ui.showHideWindows("#name-card", "card rounded-0")
    }
})
const getMyRecipe = document.querySelector("#nav-recipes-dropdown")
getMyRecipe.addEventListener("click", async (e) => {
    if (e.target.localName == "li" || e.target.nodeName == "LI") {
        const id = e.target.id
        ui.showHideWindows("#recipeViewContainer", "card p-3 shadow rounded-0")
        const myRecipe = await recipeRepository.getRecipeById(id)
        ingredientRecipe.storageIngredients(myRecipe.ingredients)
        ui.getName(myRecipe.name)
        ui.getRecipeItems(myRecipe.ingredients)
        ui.setSavedRecipeButtons(id)
    }
})
const addIngredient = document.querySelector("#add-ingredients-dropdown")
addIngredient.addEventListener("click", async (e) => {
    if (e.target.localName == "li" || e.target.nodeName == "LI") {
        const id = e.target.id
        const ingredient = await ingredientRepository.getMyIngredientByid(id)
        const recipeName = document.querySelector("#newRecipeName").textContent
        if (isRepeated(ingredient.name, "ingredients")) {
            ui.setIngredientEdit(ingredient, id)
        } else {
            ui.setIngredientNew(recipeName, ingredient, id)
        }
    }
})
const weightModalForm = document.querySelector("#weightModalForm")
weightModalForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const submitButton = document.querySelector("#submitBtnAdd")
    const id = submitButton.value
    const weight = document.querySelector("#weightAdd").value
    const unitOfMeasure = document.querySelector("#weightAdd").name
    if (submitButton.name === "editRecipeIngredient") {
        const name = document.querySelector("#weight-modal-header").name
        const updates = { name, weight, id }
        ingredientRecipe.update(updates)
        const ingredients = ingredientRecipe.getAllIngredients()
        ui.getRecipeItems(ingredients)
        e.preventDefault()
        document.querySelector("#weightModalForm").reset();
    } else if (submitButton.name === "addIngredientToRecipe") {
        const name = document.querySelector("#weight-modal-header").name
        ui.getRecipeItem(name, unitOfMeasure, weight, id)
        ingredientRecipe.storageIngredient(id, name, weight, unitOfMeasure)
    }
})
const deleteRecipe = document.querySelector("#delete-button")
deleteRecipe.addEventListener("click", async (e) => {
    const id = e.target.value
    const name = document.querySelector("#newRecipeName").textContent
    const message = `Sure you want to delete "${name}"?`
    if (confirm(message)) {
        await recipeRepository.delete(id)
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
        if (!isRepeated(name, "ingredients")) {
            const updates = { name, weight, id }
            ingredientRecipe.update(updates);
            const ingredients = ingredientRecipe.getAllIngredients()
            ui.getRecipeItems(ingredients)
            e.preventDefault()
            document.querySelector("#userIngredientsEdit").reset()
        } else {
            alert(`Ingredient "${name}" already exists here`)
            e.preventDefault()
        }
    }
})
const setMyIngredient = document.querySelector("#nav-ingredients-dropdown")
setMyIngredient.addEventListener("click", async (e) => {
    if (e.target.localName == "li" || e.target.nodeName == "LI") {
        const id = e.target.id
        const ingredient = await ingredientRepository.getMyIngredientByid(id)
        if (ingredient) {
            ui.showHideWindows("#newIngredientForm", "")
            document.querySelector("#ingredientHeader").textContent = `${ingredient.name}`
            const deleteIngredientButton = document.querySelector("#deleteIngredientButton")
            deleteIngredientButton.classList = "btn myButton-danger"
            deleteIngredientButton.value = ingredient.FSId
            const saveChangesButton = document.querySelector("#saveIngredientButton")
            saveChangesButton.textContent = "Save Changes"
            saveChangesButton.name = "save-changes"
            saveChangesButton.value = ingredient.FSId
            ui.setIngredientIntoForm(ingredient)
        } else {
            alert("Ingredient not found")
        }
    }
})
const saveEditIngredientButton = document.querySelector("#saveIngredientButton")
saveEditIngredientButton.addEventListener("click", (e) => {
    const id = e.target.value
    const updates = Object.fromEntries(new FormData(e.target.form))
    e.target.name === "save-changes" && ingredientRepository.updateMyIngredient(id, updates)
})
const deleteMyIngredient = document.querySelector("#deleteIngredientButton")
deleteMyIngredient.addEventListener("click", (e) => {
    const id = e.target.value
    const name = document.querySelector("#ingredientHeader")
    const form = document.querySelector("#userIngredientsForm")
    const confirmation = confirm(`Sure you want to delete "${name.textContent}"?`)
    if (confirmation) {
        ingredientRepository.deleteMyIngredient(id)
        form.reset()
        name.textContent = "New Ingredient"
        ui.resetIngredientButtons()
    }
})
const traceability = document.querySelector("#traceabilityToggleButton")
traceability.addEventListener("click", () => {
    const button = document.querySelector("#calculateButton")
    button.textContent = "Make Traceability"
    button.name = "makeTraceability"
    button.setAttribute("data-bs-target", "#traceabilityModal")
})
const getIngredientsForDropdown = document.querySelectorAll("#my-ingredients, #addIngredientButton");
getIngredientsForDropdown.forEach(element => {
    element.addEventListener("click", async (e) => {
        if (e.target.localName === "a" || e.target.nodeName === "A" || e.target.localName === "button" || e.target.nodeName === "BUTTON") {
            const myIngredients = await ingredientRepository.getAllIngredients();
            const sortedItems = myIngredients.sort((a, b) => a.name.localeCompare(b.name));
            const ulDropdowns = document.querySelectorAll("#nav-ingredients-dropdown, #add-ingredients-dropdown");
            ulDropdowns.forEach(ulDropdown => {
                ulDropdown.innerHTML = '';
                ulDropdown.innerHTML = sortedItems.map(item => `<li class="btn btn-light d-block" id="${item.FSId}">${item.name}</li>`).join('');
            })
        }
    })
})
const getRecipesForDropdown = document.querySelector("#my-recipes")
getRecipesForDropdown.addEventListener("click", async () => {
    const myRecipes = await recipeRepository.getAllRecipes();
    const sortedItems = myRecipes.sort((a, b) => a.name.localeCompare(b.name));
    const ulDropdown = document.querySelector("#nav-recipes-dropdown");
    ulDropdown.innerHTML = '';
    ulDropdown.innerHTML = sortedItems.map(item => `<li class="btn btn-light d-block" id="${item.id}">${item.name}</li>`).join('');
})
startNewRecipe()
convertAndStoreRecipes()
ui.getDropdown("myIngredients", "ingredients-dropdown")