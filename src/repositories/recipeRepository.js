export class RecipeRepository {
    
    saveRecipe(recipe) {
        try {
            const recipes = JSON.parse(localStorage.getItem("myRecipes")) || [];
            recipes.push(recipe);
            localStorage.setItem("myRecipes", JSON.stringify(recipes));
        } catch (error) {
            console.error("Error parsing or saving data to localStorage:", error);
            return false;
        }
    }
    getAllRecipes() {
        return JSON.parse(localStorage.getItem("myRecipes"))
    }
    getRecipeByName(name) {
        try {
            const recipes = JSON.parse(localStorage.getItem("myRecipes")) || [];
            return recipes.find((recipe) => recipe.name === name);
        } catch (error) {
            console.error("Error parsing or retrieving data from localStorage:", error);
            return undefined;
        }
    }
    getRecipeById(id) {
        try {
            const recipes = JSON.parse(localStorage.getItem("myRecipes")) || [];
            return recipes.find((recipe) => recipe.id === id);
        } catch (error) {
            console.error("Error parsing or retrieving data from localStorage:", error);
            return undefined;
        }
    }
    update(updates) {
        try {
            const myRecipes = this.getAllRecipes()
            const index = myRecipes.findIndex((recipe) => recipe.id === updates.id)     
            myRecipes[index] = updates
            localStorage.setItem("myRecipes", JSON.stringify(myRecipes))
            alert("Changes Saved Successfully")
        } catch (error) {
            console.error("Error updating recipe:", error)
        }
    }
    delete(id) {
        try {
            const myRecipes = JSON.parse(localStorage.getItem("myRecipes"))
            if (!myRecipes) {
                console.error("No recipes available");
                return;
            }
            const index = myRecipes.findIndex((myRecipe) => myRecipe.id === id);
            if (index !== -1) {
                myRecipes.splice(index, 1);
                localStorage.setItem("myRecipes", JSON.stringify(myRecipes));
            }
        } catch (error) {
            console.error("Error deleting recipe", error);
        }
    }
}