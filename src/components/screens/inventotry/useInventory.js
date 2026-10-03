import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMainContext } from '../../../context/MainContext';
import { getLocalISOString } from '../../../utilities/utils';

export const useInventoryState = () => {
    const { t } = useTranslation();
    const { ingredients } = useMainContext();

    const [currentInventory, setCurrentInventory] = useState([]);
    const [countColumns, setCountColumns] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [selectedSection, setSelectedSection] = useState(0);

    const [fireRecipeModal, setFireRecipeModal] = useState(false);
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showStockModal, setShowStockModal] = useState(false);
    const [stockAdjustment, setStockAdjustment] = useState('');
    const [tareValue, setTareValue] = useState(0);
    const [creationDate, setCreationDate] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('unsavedInventoryChanges');
        if (saved) {
            try {
                const lastStock = JSON.parse(saved);
                if (lastStock && Array.isArray(lastStock.items)) {
                    setCurrentInventory(lastStock.items);
                    if (lastStock.creationDate) {
                        setCreationDate(lastStock.creationDate);
                    }

                    // Show count columns ONLY if there are 2 or more counts; otherwise show only totals
                    const maxCounts = Math.max(
                        0,
                        ...lastStock.items.map(item => (Array.isArray(item.counts) ? item.counts.length : 0))
                    );

                    let restoredColumns = [];
                    if (Array.isArray(lastStock.countColumns) && lastStock.countColumns.length >= 2 && lastStock.countColumns.length >= maxCounts) {
                        restoredColumns = lastStock.countColumns;
                    } else if (maxCounts >= 2) {
                        restoredColumns = Array.from({ length: maxCounts }, (_, index) => ({
                            id: Date.now() + index,
                            name: `${t('inventory.section')} ${index + 1}`,
                            date: new Date().toLocaleDateString(),
                            value: 0
                        }));
                    }
                    setCountColumns(restoredColumns);
                }
            } catch (e) {
                console.error("Error loading unsavedInventoryChanges from localStorage:", e);
            }
        } else {
            const baseInventory = ingredients
                .filter(ing => ing.setInInventory)
                .map(ing => ({
                    id: ing.id,
                    name: ing.name,
                    reference: ing.reference,
                    unitOfMeasure: ing.unitOfMeasure,
                    minStock: ing.minStock || 0,
                    stock: 0,
                    counts: []
                }));
            setCurrentInventory(baseInventory);
            setCountColumns([]);
        }
    }, [ingredients]);

    // Auto-save changes to localStorage
    useEffect(() => {
        if (currentInventory.length > 0) {
            const lastStock = {
                lastUpdate: getLocalISOString(),
                creationDate: creationDate,
                items: currentInventory,
                countColumns: countColumns
            };
            localStorage.setItem('unsavedInventoryChanges', JSON.stringify(lastStock));
        }
    }, [currentInventory, countColumns, creationDate]);

    const handleNewInventory = () => {
        if (confirm(t('inventory.newConfirmation'))) {
            const newDate = getLocalISOString();
            setCreationDate(newDate);
            localStorage.removeItem('unsavedInventoryChanges');
            setCountColumns([]);
            const resetInventory = ingredients
                .filter(ing => ing.setInInventory)
                .map(ing => ({
                    ...ing,
                    stock: 0,
                    counts: []
                }));
            setCurrentInventory(resetInventory);
        }
    };

    const saveInventory = () => {
        if (confirm(t('inventory.updateMainStockConfirmation'))) {
            setAlert(true);
            const lastStock = {
                lastUpdate: new Date().toISOString(),
                creationDate: creationDate,
                items: currentInventory,
                countColumns: countColumns
            };
            localStorage.setItem('unsavedInventoryChanges', JSON.stringify(lastStock));
            setAlert(false);
        }
    };

    const handleUpdateStock = (operation, index, keepOpen = false) => {
        if (!selectedIngredient || stockAdjustment === undefined || stockAdjustment === '') return;

        const rawAdjustment = Number(String(stockAdjustment).replace(/\./g, '').replace(',', '.'));
        if (isNaN(rawAdjustment)) return;

        const adjustment = tareValue > 0 ? rawAdjustment - tareValue : rawAdjustment;

        const targetItem = currentInventory.find(item => item.id === selectedIngredient.id) || selectedIngredient;
        const targetIndex = (index !== undefined && index !== null) ? index : 0;
        const targetCounts = [...(targetItem.counts || [])];
        const currentValue = Number(targetCounts[targetIndex] || 0);

        const isSubstract = operation === 'substract' || operation === 'subtract';
        const expectedValue = isSubstract
            ? currentValue - adjustment
            : currentValue + adjustment;

        if (expectedValue < 0) {
            if (!confirm(t('inventory.negativeStockConfirm'))) {
                return;
            }
        }

        setCurrentInventory(prev =>
            prev.map(item => {
                if (item.id !== selectedIngredient.id) return item;

                const updatedCounts = [...(item.counts || [])];
                updatedCounts[targetIndex] = expectedValue;
                const updatedStock = updatedCounts.reduce((acc, count) => acc + count, 0);

                const updatedIngredient = {
                    ...item,
                    updated: true,
                    counts: updatedCounts,
                    stock: updatedStock
                };

                setSelectedIngredient(updatedIngredient);

                return updatedIngredient;
            })
        );

        setStockAdjustment('');

        if (!keepOpen) {
            setShowStockModal(false);
        }
    };

    const handleToggleTare = () => {
        if (tareValue > 0) {
            setTareValue(0);
        } else {
            const input = prompt(t('inventory.enterTareValue'), '');
            if (input !== null && input.trim() !== '') {
                const val = Number(input.replace(/\./g, '').replace(',', '.'));
                if (!isNaN(val) && val > 0) {
                    setTareValue(val);
                }
            }
        }
    };

    const handleOpenStockModal = (ingredient) => {
        setSelectedIngredient(ingredient);
        setStockAdjustment('');
        setShowStockModal(true);
    };

    const handleAddCountColumn = () => {
        if (countColumns.length >= 6) {
            setAlertMessage(t('inventory.maxColumnsLimit'));
            setTimeout(() => {
                setAlertMessage('');
            }, 4000);
            try {
                alert(t('inventory.maxColumnsLimit'));
            } catch (e) {
                console.error(e);
            }
            return;
        }

        const isFirstTime = countColumns.length === 0;
        const newColumn = {
            id: Date.now(),
            name: `${t('inventory.section')} ${countColumns.length + 1}`,
            date: new Date().toLocaleDateString(),
            value: 0
        };

        if (isFirstTime) {
            const col2 = {
                id: Date.now() + 1,
                name: `${t('inventory.section')} 2`,
                date: new Date().toLocaleDateString(),
                value: 0
            };
            setCountColumns([newColumn, col2]);
        } else {
            setCountColumns(prev => [...prev, newColumn]);
        }

        setCurrentInventory(prev => prev.map(item => {
            if (isFirstTime) {
                return {
                    ...item,
                    counts: [item.stock || 0, 0]
                };
            }
            return {
                ...item,
                counts: item.counts ? [...item.counts, 0] : [0]
            };
        }));
    };

    const handleDeleteCountColumn = (columnIndex) => {
        if (!confirm(t('inventory.deleteCountConfirm'))) return;

        if (countColumns.length <= 2) {
            setCurrentInventory(prev => prev.map(item => {
                const currentCounts = Array.isArray(item.counts) ? item.counts : [];
                const otherIndex = columnIndex === 0 ? 1 : 0;
                const remainingValue = Number(currentCounts[otherIndex]) || 0;

                return {
                    ...item,
                    counts: [remainingValue],
                    stock: remainingValue
                };
            }));

            setCountColumns([]);
            setSelectedSection(0);
        }

        else {
            const refreshedColumns = countColumns
                .filter((_, index) => index !== columnIndex)
                .map((col, index) => ({
                    ...col,
                    name: `${t('inventory.section')} ${index + 1}`
                }));

            setCountColumns(refreshedColumns);

            setCurrentInventory(prev => prev.map(item => {
                const oldCounts = Array.isArray(item.counts) ? [...item.counts] : [];
                const valueToDelete = Number(oldCounts[columnIndex]) || 0;

                const newCounts = oldCounts.filter((_, index) => index !== columnIndex);
                const currentStock = Number(item.stock) || 0;

                return {
                    ...item,
                    counts: newCounts,
                    stock: currentStock - valueToDelete
                };
            }));

            if (columnIndex < selectedSection) {
                setSelectedSection(prev => prev - 1);
            } else if (selectedSection >= refreshedColumns.length && refreshedColumns.length > 0) {
                setSelectedSection(refreshedColumns.length - 1);
            }
        }
    };
    return {
        ingredients,
        currentInventory,
        setCurrentInventory,
        countColumns,
        selectedIngredient,
        selectedSection,
        setSelectedSection,
        fireRecipeModal,
        setFireRecipeModal,
        alert,
        alertMessage,
        showStockModal,
        setShowStockModal,
        stockAdjustment,
        setStockAdjustment,
        tareValue,
        setTareValue,
        creationDate,
        setCreationDate,
        handleToggleTare,
        handleNewInventory,
        saveInventory,
        handleUpdateStock,
        handleOpenStockModal,
        handleAddCountColumn,
        handleDeleteCountColumn
    };
};
