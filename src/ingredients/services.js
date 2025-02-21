import { collection, addDoc, doc, setDoc, getDoc, getDocs, where, query, deleteDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { db, auth } from "../firebaseConfig";

import { IngredientAdapter } from "./adapters";

export class IngredientRepo {
    constructor() {
        this.db = db;
        this.auth = auth;
        // this.ingredientAdapter = new IngredientAdapter();
    }
    async saveIngredient(ingredient) {
        try {
            const userId = this.auth.currentUser.uid;
            // const adaptedIngredient = this.ingredientAdapter.adapt(ingredient);
            const ingredientsCollectionRef = collection(this.db, `ingredients`);
            const newIngredient = await addDoc(ingredientsCollectionRef, { userId: userId, ...ingredient });
            alert(`Ingerdient "${ingredient.name}" saved successfully`)
            return newIngredient.id
        } catch (error) {
            alert("Error adding ingredient. Make sure you are logged in.");
            return false
        }
    }
    async getMyIngredientByid(ingredientId) {
        try {
            const ingredientDocRef = doc(this.db, "ingredients", ingredientId);
            const docSnapshot = await getDoc(ingredientDocRef);
    
            if (docSnapshot.exists()) {
                return  { FSId: docSnapshot.id, ...docSnapshot.data() }
            } else {
                console.error(`Ingredient with ID ${ingredientId} not found.`);
                return null;
            }
        } catch (error) {
            console.error("Error getting ingredient:", error);
            return null;
        }
    }
    async getAllIngredients() {
        const userId = this.auth.currentUser.uid;
        const ingredientsCollectionRef = collection(this.db, "ingredients");
      
        try {
          const querySnapshot = await getDocs(query(ingredientsCollectionRef, where("userId", "==", userId)));
          const ingredients = querySnapshot.docs.map(doc => ({ FSId: doc.id, ...doc.data() }));
          return ingredients;
        } catch (error) {
          if (error.code === "unauthenticated") {
            alert("You must be logged in.");
          } else {
            alert("Error getting ingredients: " + error.message);
          }
          return [];
        }
      }
    async updateMyIngredient(id, ingredient) {
        try {
            const ingredientDocRef = doc(this.db, "ingredients", id);
            await setDoc(ingredientDocRef, {FSUid: id, userId: this.auth.currentUser.uid, ...ingredient});
            // alert(`Ingerdient "${ingredient.name}" updated successfully`)
            return true
        } catch (error) {
            alert("Error updating ingredient. Make sure you are logged in.");
        }
    }
    async deleteMyIngredient(id) {
        try {
            const ingredientDocRef = doc(this.db, "ingredients", id);
            await deleteDoc(ingredientDocRef);
            alert(`Ingerdient deleted successfully`)
        } catch (error) {
            alert("Error deleting ingredient. Make sure you are logged in." + error);
        }
    }
}