import { collection, doc, getDoc, getDocs, where, query, deleteDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { db, auth } from "../firebaseConfig";
import { getLocalISOString } from "../utilities/utils";

const PENDING_SAVE_KEY = 'inventoryPendingSave';
const SYNC_EVENT = 'inventory-sync';

const NON_RETRYABLE_SAVE_ERRORS = new Set([
    'permission-denied',
    'unauthenticated',
    'invalid-argument',
    'failed-precondition',
    'not-found',
    'already-exists',
    'out-of-range',
    'unsupported',
]);

const readPendingSave = () => {
    try {
        const raw = localStorage.getItem(PENDING_SAVE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        console.error('Error reading pending inventory save:', error);
        return null;
    }
};

const writePendingSave = (pendingSave) => {
    try {
        localStorage.setItem(PENDING_SAVE_KEY, JSON.stringify(pendingSave));
    } catch (error) {
        console.error('Error storing pending inventory save:', error);
    }
};

const removePendingSave = () => {
    try {
        localStorage.removeItem(PENDING_SAVE_KEY);
    } catch (error) {
        console.error('Error removing pending inventory save:', error);
    }
};

const isRetryableSaveError = (error) => {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return true;
    return !NON_RETRYABLE_SAVE_ERRORS.has(error?.code);
};

const notifyInventorySync = (detail) => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail }));
};

export const hasPendingInventorySave = () => Boolean(readPendingSave());

let isFlushing = false;

export const flushPendingInventorySaves = async () => {
    if (isFlushing) return { status: 'busy' };

    const pendingSave = readPendingSave();
    if (!pendingSave || !auth.currentUser) return { status: 'idle' };
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        return { status: 'queued', id: pendingSave.id };
    }

    isFlushing = true;
    try {
        await setDoc(doc(db, 'inventories', pendingSave.id), pendingSave.payload);

        // A newer save could have replaced the pending one while this was in flight.
        if (readPendingSave()?.id === pendingSave.id) removePendingSave();
        notifyInventorySync({ status: 'synced', id: pendingSave.id });
        return { status: 'synced', id: pendingSave.id };
    } catch (error) {
        console.error('Error syncing pending inventory:', error);
        const status = isRetryableSaveError(error) ? 'queued' : 'error';
        if (status === 'error' && readPendingSave()?.id === pendingSave.id) {
            removePendingSave();
        }
        notifyInventorySync({ status, id: pendingSave.id, error });
        return { status, id: pendingSave.id, error };
    } finally {
        isFlushing = false;
    }
};

export class InventoryService {
    constructor() {
        this.db = db;
        this.auth = auth;
    }

    async saveInventory(inventoryData) {
        const currentUser = this.auth.currentUser;
        if (!currentUser) {
            return { status: 'unauthenticated' };
        }

        const userId = currentUser.uid;
        const inventoriesCollectionRef = collection(this.db, "inventories");
        const docRef = doc(inventoriesCollectionRef);

        const payload = {
            userId: userId,
            createdAt: getLocalISOString(),
            creationDate: inventoryData.creationDate ? getLocalISOString(inventoryData.creationDate) : getLocalISOString(),
            items: inventoryData.items || [],
            countColumns: inventoryData.countColumns || [],
            tareValue: inventoryData.tareValue || 0
        };

        // Persist before attempting the network write so the save survives a reload.
        const pendingSave = {
            id: docRef.id,
            payload,
            queuedAt: getLocalISOString()
        };
        writePendingSave(pendingSave);

        if (typeof navigator !== 'undefined' && navigator.onLine === false) {
            return { status: 'queued', id: docRef.id };
        }

        try {
            await setDoc(docRef, payload);
            if (readPendingSave()?.id === docRef.id) removePendingSave();
            notifyInventorySync({ status: 'synced', id: docRef.id });
            return { status: 'synced', id: docRef.id };
        } catch (error) {
            console.error("Error saving inventory to Firebase:", error);
            if (!isRetryableSaveError(error)) {
                if (readPendingSave()?.id === docRef.id) removePendingSave();
                return { status: 'error', error };
            }
            return { status: 'queued', id: docRef.id, error };
        }
    }

    hasPendingSave() {
        return hasPendingInventorySave();
    }

    flushPendingInventorySaves() {
        return flushPendingInventorySaves();
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

// Retry pending saves when connectivity returns or when the user session is restored.
if (typeof window !== 'undefined' && !window.__recipeInventorySyncInitialized) {
    window.__recipeInventorySyncInitialized = true;

    window.addEventListener('online', () => {
        flushPendingInventorySaves();
    });

    onAuthStateChanged(auth, (user) => {
        if (user) flushPendingInventorySaves();
    });
}
