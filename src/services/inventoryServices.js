import { collection, addDoc, doc, getDoc, getDocs, where, query, deleteDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { db, auth } from "../firebaseConfig";
import { getLocalISOString } from "../utilities/utils";

export class InventoryService {
    constructor() {
        this.db = db;
        this.auth = auth;
    }

    async saveInventory(inventoryData) {
        try {
            const currentUser = this.auth.currentUser;
            if (!currentUser) {
                alert("Debes iniciar sesión para guardar el inventario.");
                return false;
            }
            const userId = currentUser.uid;
            const inventoriesCollectionRef = collection(this.db, "inventories");

            const payload = {
                userId: userId,
                createdAt: getLocalISOString(),
                creationDate: inventoryData.creationDate ? getLocalISOString(inventoryData.creationDate) : getLocalISOString(),
                items: inventoryData.items || [],
                countColumns: inventoryData.countColumns || [],
                tareValue: inventoryData.tareValue || 0
            };

            const docRef = await addDoc(inventoriesCollectionRef, payload);
            alert("Inventario guardado exitosamente.");
            return docRef.id;
        } catch (error) {
            console.error("Error saving inventory to Firebase:", error);
            alert("Error al guardar el inventario: " + error.message);
            return false;
        }
    }

    async getAllInventories() {
        const currentUser = this.auth.currentUser;
        if (!currentUser) {
            console.error("User is not authenticated.");
            return [];
        }
        const userId = currentUser.uid;
        const inventoriesCollectionRef = collection(this.db, "inventories");

        try {
            const q = query(
                inventoriesCollectionRef,
                where("userId", "==", userId)
            );
            const querySnapshot = await getDocs(q);
            const inventories = [];
            querySnapshot.forEach((docSnap) => {
                inventories.push({ id: docSnap.id, ...docSnap.data() });
            });

            // Sort by createdAt/creationDate descending (newest first)
            inventories.sort((a, b) => {
                const dateA = new Date(a.createdAt || a.creationDate || 0);
                const dateB = new Date(b.createdAt || b.creationDate || 0);
                return dateB - dateA;
            });

            return inventories;
        } catch (error) {
            console.error("Error getting inventories from Firebase:", error);
            return [];
        }
    }

    async getInventoryById(id) {
        try {
            const inventoryDocRef = doc(this.db, "inventories", id);
            const docSnapshot = await getDoc(inventoryDocRef);
            if (docSnapshot.exists()) {
                return { id: docSnapshot.id, ...docSnapshot.data() };
            } else {
                console.error(`Inventory with ID ${id} not found.`);
                return null;
            }
        } catch (error) {
            console.error("Error getting inventory:", error);
            return null;
        }
    }

    async deleteInventory(id) {
        try {
            const inventoryDocRef = doc(this.db, "inventories", id);
            await deleteDoc(inventoryDocRef);
            alert("Inventario eliminado exitosamente.");
            return true;
        } catch (error) {
            console.error("Error deleting inventory:", error);
            alert("Error al eliminar el inventario: " + error.message);
            return false;
        }
    }
}
