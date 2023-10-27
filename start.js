
document.getElementById("start").addEventListener("click", start);

function start() {
    const myRecipes = JSON.parse(localStorage.getItem("myRecipes"))
    if (!myRecipes) {
        const recipe = [{ name: "" }];
        localStorage.setItem("myRecipes", JSON.stringify(recipe));
    }
}