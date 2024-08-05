import { Ui } from "./src/ui.js"
import { Recipe, Ingredient } from "./src/models.js"
import { isRepeated, cleanLocalStorage, startNewRecipe, convertAndStoreRecipes } from "./src/services/utils.js"
import { calculate } from "./src/services/calculator.js"
import { RecipeRepository } from "./src/repositories/recipeRepository.js"
import { IngredientsRepository } from "./src/repositories/ingredientRepository.js"

const recipeRepository = new RecipeRepository()
export const ingredientRepository = new IngredientsRepository()
const ui = new Ui()
const recipeViewContainer = document.querySelector("#recipeViewContainer")

// ALL EVENT LISTENERS HERE:

const recipeName = document.querySelector("#recipeName")
recipeName.addEventListener("submit", (e) => {
    const name = document.querySelector("#name").value.toUpperCase()
    if (isRepeated(name, "myRecipes")) {
        alert(`Recipe name "${name}" already exists`)
    } else {
        recipeViewContainer.className = "card p-3 shadow rounded-0"
        ui.getName(name)
    }
    e.preventDefault()
})
const newIngredient = document.querySelector("#newIngredient")
newIngredient.addEventListener("click", () => {
    const newIngredientForm = document.querySelector("#userIngredients")
    //document.querySelector(("#newIngredientForm")).classList = ""
    newIngredientForm.reset()
    document.querySelector("#ingredientHeader").textContent = `New Ingredient:`
    document.querySelector("#saveIngredientButton").textContent = "Save"
    //document.querySelector(("#name-card")).classList = "hide"
    ui.showHideWindows("#newIngredientForm", "")
})
const userIngredients = document.querySelector("#userIngredients")
userIngredients.addEventListener("submit", e => {
    e.preventDefault()
    const button = document.querySelector("#saveIngredientButton")
    const data = Object.fromEntries(
        new FormData(e.target)
    )
    if (button.textContent == "Save") {
        if (isRepeated(data.name, "myIngredients")) {
            alert(`Ingerdient "${data.name}" already exist!`)
        } else {
            const ingredient = new Ingredient({ ...data })
            alert(`Ingerdient "${data.name}" saved successfully`)
            ingredientRepository.save(ingredient)
            userIngredients.reset()
            ui.getDropdown("myIngredients", "ingredients-dropdown")
            ui.getDropdown("myIngredients", "nav-ingredients-dropdown")
        }
    }
})
const amounts = document.querySelector("#amounts")
amounts.addEventListener("submit", (e) => {
    const weightPerUnit = document.querySelector("#eachOneWeight").value
    const amount = document.querySelector("#unitsAmount").value
    const name = document.querySelector("#newRecipeName").textContent
    const params = { weightPerUnit, amount, name }
    const ingredients = ingredientRepository.getAllIngredients()
    const calculatedRecipe = calculate(params, ingredients)
    ui.getCalculatedRecipe(calculatedRecipe, params)
    e.preventDefault()
})
const editDeleteIngredient = document.querySelector("#recipe")
editDeleteIngredient.addEventListener("click", (e) => {
    if (e.target.localName == "button" || e.target.nodeName == "BUTTON") {
        const index = e.target.id
        const id = e.target.value
        const ingredient = ingredientRepository.getIngredientByid(id)
        if (index == "deleteIngredient") {
            if (confirm(`Sure you want to delete "${ingredient.name}"?`)) {
                ingredientRepository.deleteFromRecipe(id)
                const ingredients = ingredientRepository.getAllIngredients()
                ui.getRecipeItems(ingredients)
            }
        } else {
            ui.setIngredientEdit(ingredient)
        }
    }
})
const saveNewRecipe = document.querySelector("#save-button")
saveNewRecipe.addEventListener("click", (e) => {
    const id = e.target.value
    const ingredients = ingredientRepository.getAllIngredients()
    const name = document.querySelector("#newRecipeName").textContent
    if (id === "") {
        if (isRepeated(name, "myRecipes")) {
            alert(`Recipe name "${name}" already exists`)
        }
        const recipe = new Recipe()
        recipe.name = name
        recipe.ingredients = ingredients
        recipeRepository.saveRecipe(recipe)
        ui.setSavedRecipeButtons(recipe.id)
        alert("Recipe saved on this device.")
    } else {
        const updates = recipeRepository.getRecipeById(id)
        updates.name = name
        updates.ingredients = ingredients
        recipeRepository.update(updates)
    }
    ui.getDropdown("myRecipes", "recipes-dropdown")
})
const setNewRecipe = document.querySelector("#newRecipe")
setNewRecipe.addEventListener("click", () => {
    cleanLocalStorage()
    ui.showHideWindows("#name-card", "card rounded-0")
    document.querySelector("#newRecipeName")
        ? document.querySelector("#name-card").classList = "card rounded-0"
        : location.reload()
})
const getMyRecipe = document.querySelector("#recipes-dropdown")
getMyRecipe.addEventListener("click", (e) => {
    if (e.target.localName == "li" || e.target.nodeName == "LI") {
        recipeViewContainer.className = "card p-3 shadow rounded-0"
        const myRecipe = recipeRepository.getRecipeById(e.target.id)
        ingredientRepository.storageIngredients(myRecipe.ingredients)
        ui.getName(myRecipe.name)
        ui.getRecipeItems(myRecipe.ingredients)
        ui.setSavedRecipeButtons(myRecipe.id)
    }
})
const addIngredient = document.querySelector("#ingredients-dropdown")
addIngredient.addEventListener("click", (e) => {
    if (e.target.localName == "li" || e.target.nodeName == "LI") {
        const id = e.target.id
        const ingredient = ingredientRepository.getMyIngredientByid(id)
        const recipeName = document.querySelector("#newRecipeName").textContent
        if (isRepeated(ingredient.name, "ingredients")) {
            const weight = ingredientRepository.getIngredientByid(id).weight
            ui.setIngredientEdit(ingredient, weight)
        } else {
            ui.setIngredientNew(recipeName, ingredient)
        }
    }
})
const weightModalForm = document.querySelector("#weightModalForm")
weightModalForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const submitButton = document.querySelector("#submitBtnAdd")
    const id = submitButton.value
    const weight = document.querySelector("#weightAdd").value
    const ingredient = ingredientRepository.getMyIngredientByid(id)
    const name = ingredient.name
    if (submitButton.textContent === "Edit") {
        const updates = { name, weight, id }
        ingredientRepository.update(updates)
        const ingredients = ingredientRepository.getAllIngredients()
        ui.getRecipeItems(ingredients)
        e.preventDefault()
        document.querySelector("#weightModalForm").reset();
    } else {
        ui.getRecipeItem(ingredient, weight)
        ingredientRepository.storageIngredient(id, ingredient.name, weight, ingredient.unitOfMeasure)
    }
})
const deleteRecipe = document.querySelector("#delete-button")
deleteRecipe.addEventListener("click", (e) => {
    const recipeToDelete = recipeRepository.getRecipeById(e.target.value)
    const message = `Sure you want to delete "${recipeToDelete.name}"?`
    if (confirm(message)) {
        recipeRepository.delete(recipeToDelete.id)
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
            ingredientRepository.update(updates);
            const ingredients = ingredientRepository.getAllIngredients()
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
setMyIngredient.addEventListener("click", (e) => {
    if (e.target.localName == "li" || e.target.nodeName == "LI") {
        const id = e.target.id
        const ingredient = ingredientRepository.getMyIngredientByid(id)
        if (ingredient) {
            ui.showHideWindows("#newIngredientForm", "")
            document.querySelector("#ingredientHeader").textContent = `${ingredient.name}`
            const deleteIngredientButton = document.querySelector("#deleteIngredientButton")
            deleteIngredientButton.classList = "btn myButton-danger"
            deleteIngredientButton.value = ingredient.id
            const saveChangesButton = document.querySelector("#saveIngredientButton")
            saveChangesButton.textContent = "Save Changes"
            saveChangesButton.value = ingredient.id
            ui.setIngredientIntoForm(ingredient)
        } else {
            alert("Ingredient not found")
        }
    }
})
const saveEditIngredientButton = document.querySelector("#saveIngredientButton")
saveEditIngredientButton.addEventListener("click", (e) => {
    if (e.target.textContent === "Save Changes") {
        const id = e.target.value
        const updates = Object.fromEntries(
            new FormData(e.target.form)
        )
        try {
            ingredientRepository.editMyIngredient(id, updates)
            alert("Changes Saved Successfully")
        } catch (error) {
            alert(error)
        }
    }
})
const delteMyIngredient = document.querySelector("#deleteIngredientButton")
delteMyIngredient.addEventListener("click", (e) => {
    const id = e.target.value
    const ingredientToDelete = ingredientRepository.getMyIngredientByid(id)
    if (confirm(`Sure you want to delete "${ingredientToDelete.name}"?`)) {
        ingredientRepository.deleteMyIngredient(id)
        alert("Ingredient Deleted Successfully")
        location.reload()
    }
})

startNewRecipe()
convertAndStoreRecipes()
ui.getDropdown("myRecipes", "recipes-dropdown")
ui.getDropdown("myIngredients", "nav-ingredients-dropdown")
ui.getDropdown("myIngredients", "ingredients-dropdown")