
export function isRepeated(itemName, file) {
  const items = JSON.parse(localStorage.getItem(file))
  if (!items) {
    return false
  }
  const names = items.map((item) => item.name)
  if (names && names.includes(itemName)) {
    return true
  } return false
}

export function cleanLocalStorage() {
  localStorage.removeItem("ingredients")
  localStorage.removeItem("recipeTitle")
  localStorage.removeItem("valuesList")
}

export function checkIngredientsOrder() {
  return localStorage.getItem('ingredientsSort')
}

export function startNewRecipe() {
  const recipe = document.querySelector("#recipe")
  if (recipe.children.length === 0) {
    cleanLocalStorage()
  }
}

export function formatNumber(val) {
  if (val === null || val === undefined || val === '') return '0';
  if (typeof val === 'number') {
    return new Intl.NumberFormat('es-CO', { maximumFractionDigits: 4 }).format(val);
  }
  if (typeof val === 'string') {
    const normalized = val.trim().replace(',', '.');
    const num = Number(normalized);
    if (!isNaN(num) && val.trim() !== '') {
      return new Intl.NumberFormat('es-CO', { maximumFractionDigits: 4 }).format(num);
    }
  }
  return val;
}