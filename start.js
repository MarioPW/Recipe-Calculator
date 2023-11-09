
const start = document.getElementById("start").addEventListener("click", () => {
    const myRecipes = JSON.parse(localStorage.getItem("myRecipes"))
    const ingredients = JSON.parse(localStorage.getItem("ingredients"))
    if (!myRecipes) {
        const recipes = [];
        localStorage.setItem("myRecipes", JSON.stringify(recipes));
    }
    if (!ingredients) {
        const ingredients = [];
        localStorage.setItem("ingredients", JSON.stringify(ingredients));
    }
});