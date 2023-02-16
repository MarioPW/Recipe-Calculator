// "With the Recipe Calculator, you can fill in a basic recipe and modify it proportionally
// according to a specific amount of units you want to prepare."

document.getElementById('userIngredients').addEventListener('submit', saveIngredient);
document.getElementById('recipeName').addEventListener('submit', saveName);
document.getElementById('amounts').addEventListener('submit', saveParams);


function saveName(e){
    let name = document.getElementById('name').value;
    const rname = {
        name,
    } 
    localStorage.setItem('recipeTitle', JSON.stringify(rname));
    getName();
    document.getElementById('recipeName').reset();
    e.preventDefault();
}
function getName(){
    let name = JSON.parse(localStorage.getItem('recipeTitle'));
    let nameView = document.getElementById('recipeView');
    nameView.innerHTML = `<h4 class='my-2'>${name.name}</h4>`
}
function setEditableIngredient(index){
    let ingInput  = document.getElementById('ingredient')
    let weightInput  = document.getElementById('weight')
    let button = document.getElementById("submitBtn")
    let ings  = JSON.parse(localStorage.getItem('valuesList'))
    ingInput.value  = ings[index].ingredient
    weightInput.value = ings[index].weight
    button.textContent = "Edit"
    button.value = index
}
function saveIngredient(e){
    let ingredient = document.getElementById('ingredient').value;
    let weight = document.getElementById('weight').value;
    let button = document.getElementById('submitBtn');
    const values = {
        ingredient,
        weight
    };
    if (button.textContent == "Add"){  
        if (localStorage.getItem('valuesList') === null) {
            let valuesList = [];
            valuesList.push(values);
            localStorage.setItem('valuesList', JSON.stringify(valuesList));
        } else {
            let valuesList = JSON.parse(localStorage.getItem('valuesList'));
            valuesList.push(values);
            localStorage.setItem('valuesList', JSON.stringify(valuesList))
        }
        button.textContent = "Add"
    } else {
        let index = button.value 
        editIngredient(index, values)
        button.textContent = "Add"
    }
    
    getValues();
    document.getElementById('userIngredients').reset();
    e.preventDefault();
}
function getValues(){
    let valuesList = JSON.parse(localStorage.getItem('valuesList'));
    let recipeView = document.getElementById('recipe');
    recipeView.innerHTML = '';
    for(let i=0; i < valuesList.length; i++) {
        let ingredient = valuesList[i].ingredient;
        let weight = valuesList[i].weight;
        recipeView.innerHTML +=`
        <td>${ingredient}</td>
        <td>${weight} g</td>
        <td><a class="btn btn-outline-danger" onclick="deleteIngredient('${ingredient}')"><i class="bi bi-trash"></i></a></td>
         
        <td><a id="editBtn"class="btn btn-outline-primary" value="${i}"onclick="setEditableIngredient('${i}')"><i class="bi bi-pencil"></i></a></td>`
                   
    }   
}    
function deleteIngredient(ingredient){
    let valuesList = JSON.parse(localStorage.getItem('valuesList'));
    for(let i=0; i < valuesList.length; i++) {
        if (valuesList[i].ingredient == ingredient){
            valuesList.splice(i, 1);
        }
    }
    localStorage.setItem('valuesList', JSON.stringify(valuesList));
    getValues()
}
function editIngredient(index, newValues){
    let valuesList = JSON.parse(localStorage.getItem('valuesList')); 
    toEdit = valuesList[index]
    valuesList[index].ingredient  = newValues.ingredient
    valuesList[index].weight  = newValues.weight
    localStorage.setItem('valuesList', JSON.stringify(valuesList));
    //console.log(valuesList)
}
function saveParams(e){
    let unitWeight = document.getElementById('eachOneWeight').value;
    let amount = document.getElementById('unitsAmount').value;
    const params = {
        unitWeight,
        amount
    }
    if (localStorage.getItem('amountWeight') === null) {
        let amountWeight = params;
        localStorage.setItem('amountWeight', JSON.stringify(amountWeight));
    } else {
        localStorage.setItem('amountWeight', JSON.stringify(params))
    }
    calculate();
    getCalculatedRecipe();
    e.preventDefault();
}
function calculate(){
    let values = JSON.parse(localStorage.getItem('valuesList'));
    let params = JSON.parse(localStorage.getItem('amountWeight'));
    
    let sumatory = 0;
    let totalRequiredDought = parseFloat(params.amount) * parseFloat(params.unitWeight)
    let percentages = [];
    let convertion = [];
    let ingredients = [];
    for(let i=0; i < values.length; i++) {
        let eachIng = parseFloat(values[i].weight)
        sumatory += eachIng    
    }
    for(let i=0; i < values.length; i++) {
        let b = parseFloat(values[i].weight)
        percentages.push(b/sumatory)       
    }
    for(let i=0; i < values.length; i++) {
        let b = parseInt(totalRequiredDought*percentages[i])
        if(b == 0){b=1};
        let str = b.toString()
        convertion.push(str)         
    }
    for(let i=0; i < values.length; i++) {
        let b = values[i].ingredient
        ingredients.push(b)         
    }
    const calculatedRecipe = {
        ingredients,
        convertion
    }
    localStorage.setItem('calculatedRecipe', JSON.stringify(calculatedRecipe))
    getConvertionHeader();
    
}
function getConvertionHeader(){
    let name = JSON.parse(localStorage.getItem('recipeTitle'));
    let amountWeight = JSON.parse(localStorage.getItem('amountWeight'));
    let calculatedView = document.getElementById('getConvertionHeader');
    calculatedView.innerHTML = `<h4 class='bg-warning text-light p-2 rounded-2'>For ${amountWeight.amount} units of ${name.name} of ${amountWeight.unitWeight}g each, you need:</h4>`  
}
function getCalculatedRecipe(){
    let calculatedRecipe = JSON.parse(localStorage.getItem('calculatedRecipe'));
    let recipeView = document.getElementById('savedRecipe');
    recipeView.innerHTML = '';
    for(let i=0; i < calculatedRecipe.ingredients.length; i++) {
        let ingredient = calculatedRecipe.ingredients[i];
        let weight = calculatedRecipe.convertion[i];
        recipeView.innerHTML +=`
        <td>${ingredient}</td>
        <td>${weight} g</td>`                   
    }
}
getName();
getValues();
calculate();