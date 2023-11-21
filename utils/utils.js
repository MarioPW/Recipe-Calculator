export function uniqueId(){
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let uniqueID = '';
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        uniqueID += characters.charAt(randomIndex);
    }
    return uniqueID;
}

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
    localStorage.removeItem("amountWeight")
    localStorage.removeItem("calculatedRecipe")
    localStorage.removeItem("ingredients")
}