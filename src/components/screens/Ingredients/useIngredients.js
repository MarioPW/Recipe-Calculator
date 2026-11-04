import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMainContext } from '../../../context/MainContext';
import { formatNumber } from '../../../utilities/utils';

export const useIngredients = () => {
    const { t } = useTranslation();
    const { ingredients, setIngredients, ingredientService } = useMainContext();

    const defaultFiles = [
        { key: 'pizzeria', file: 'defaultIngredients.json', label: t('myIngredients.sets.pizzeria') || 'Pizzería' }
    ];

    const norm = (s) => (s || '').toString().trim().toLowerCase();

    const loadDefaultIngredients = async (fileName = 'defaultIngredients.json') => {
        if (!confirm(t('myIngredients.loadDefaultsConfirm') || 'Se añadirán los ingredientes que falten y se actualizarán los existentes que coincidan por nombre para asignarles la referencia del catálogo por defecto y ponerlos en inventario. Solo se cambiarán la referencia y "mostrar en inventario". ¿Continuar?')) {
            return;
        }

        try {
            const baseUrl = import.meta.env.BASE_URL.endsWith('/')
                ? import.meta.env.BASE_URL
                : `${import.meta.env.BASE_URL}/`;
            const res = await fetch(`${baseUrl}defaults/${fileName}`);
            const defaults = await res.json();

            if (!Array.isArray(defaults) || defaults.length === 0) {
                alert(t('myIngredients.loadDefaultsEmpty') || 'No hay ingredientes por defecto para cargar.');
                return;
            }

            const existingByName = new Map(ingredients.filter(i => norm(i.name)).map(i => [norm(i.name), i]));
            const existingRefs = new Set(ingredients.map(i => (i.reference || '').toString().trim()).filter(Boolean));

            let added = 0;
            let updated = 0;
            const toAdd = [];
            const toUpdate = [];

            for (const def of defaults) {
                const defName = norm(def.name);
                const defRef = (def.reference || '').toString().trim();
                const match = defName ? existingByName.get(defName) : null;

                if (match) {
                    const updates = {};
                    if (defRef && defRef !== (match.reference || '').toString().trim()) {
                        if (!existingRefs.has(defRef)) {
                            updates.reference = defRef;
                            existingRefs.add(defRef);
                        }
                    }
                    if (match.setInInventory !== true) {
                        updates.setInInventory = true;
                    }
                    if (Object.keys(updates).length > 0) {
                        toUpdate.push({ id: match.id, current: match, updates });
                    }
                    continue;
                }

                if (defRef && existingRefs.has(defRef)) {
                    toAdd.push({ ...def, reference: '', setInInventory: true });
                    continue;
                }

                if (defRef) {
                    existingRefs.add(defRef);
                }
                toAdd.push({ ...def, setInInventory: true });
            }

            await Promise.all(toUpdate.map(async ({ id, current, updates }) => {
                await ingredientService.updateMyIngredient(id, { ...current, ...updates });
            }));

            const createdResults = await Promise.all(toAdd.map(def => ingredientService.saveIngredient(def, false)));
            for (let i = 0; i < toAdd.length; i++) {
                const def = toAdd[i];
                const newId = createdResults[i];
                if (newId) {
                    added++;
                    ingredients.push({ ...def, id: newId });
                }
            }

            updated = toUpdate.length;
            setIngredients([...ingredients]);

            alert(
                (t('myIngredients.loadDefaultsResult') || 'Proceso finalizado. Añadidos: {added}, Actualizados: {updated}')
                    .replace('{added}', added)
                    .replace('{updated}', updated)
            );
        } catch (error) {
            console.error('Error loading default ingredients:', error);
            alert(t('myIngredients.loadDefaultsError') || 'Error al cargar los ingredientes por defecto.');
        }
    };

    const sortByName = () => {
        setIngredients([...ingredients].sort((a, b) => a.name.localeCompare(b.name)));
        localStorage.setItem('ingredientsSort', 'name');
    };

    const sortByReference = () => {
        setIngredients([...ingredients].sort((a, b) => {
            const refA = a.reference ? parseInt(a.reference, 10) : Infinity;
            const refB = b.reference ? parseInt(b.reference, 10) : Infinity;
            return refA - refB;
        }));
        localStorage.setItem('ingredientsSort', 'reference');
    };

    return {
        t,
        ingredients,
        setIngredients,
        defaultFiles,
        loadDefaultIngredients,
        sortByName,
        sortByReference,
        formatNumber,
    };
};