import { collection, addDoc, doc, setDoc, getDoc, getDocs, where, query, deleteDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
// import { collection, addDoc, doc, setDoc, getDoc, getDocs, where, query, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

export class RecipeService {
    constructor() {
        this.db = db;
        this.auth = auth;
    }
    async getAllRecipes() { /* -> type: [{Recipe}] || [] */
        const recipes = [];
        const userId = this.auth.currentUser?.uid;
        if (!userId) {
            console.error("User is not authenticated.");
            return [];
        }
        try {
            const q = query(collection(this.db, "recipes"), where("userId", "==", userId));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                recipes.push({ id: doc.id, ...doc.data() });
            });
            return recipes;
        } catch (error) {
            console.error("Error getting recipes:", error);
            return [];
        }
    }
    async saveRecipe(recipe) { /* -> type: Recipe() || false */
        try {
            const querySnapshot = collection(this.db, "recipes");
            const response = await addDoc(querySnapshot, {...recipe, userId: this.auth.currentUser.uid});
            alert(`Recipe "${recipe.name}" saved successfully`)
            return response.id
        } catch (error) {
            console.error("Error parsing or saving data to localStorage:", error);
            return false;
        }
    }
    async getRecipeByName(name) { /* -> type: Recipe() || undefined */
        try {
            const recipes = JSON.parse(localStorage.getItem("myRecipes")) || [];
            return recipes.find((recipe) => recipe.name === name);
        } catch (error) {
            console.error("Error parsing or retrieving data from localStorage:", error);
            return undefined;
        }
    }
    async getRecipeById(id) { /* -> type: Recipe() || console.error */
        try {
            const querySnapshot = await getDoc(doc(this.db, "recipes", id));
            return querySnapshot.data();
        } catch (error) {
            console.error("Error parsing or retrieving data from localStorage:", error);
        }
    }
    async update(updates, recipeId) { /* -> alert || error */
        try {
            const recipeDocRef = doc(this.db, "recipes", recipeId);
            await setDoc(recipeDocRef, {userId: this.auth.currentUser.uid, ...updates});
            alert(`Recipe "${updates.name}" updated successfully`)
        } catch (error) {
            alert("Error updating recipe. Make sure you are logged in." + error);
        }
    }
    async delete(id) {
        try {
            const recipeDocRef = doc(this.db, "recipes", id);
            await deleteDoc(recipeDocRef);
            alert(`Recipe deleted successfully`)
        } catch (error) {
            console.error("Error deleting recipe", error);
        }
    }

}