
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

export function getLocalISOString(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return new Date().toLocaleString();
  const pad = (num) => String(num).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}