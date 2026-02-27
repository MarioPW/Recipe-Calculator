import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMainContext } from '../../../context/MainContext';

export const useInventoryState = () => {
    const { t } = useTranslation();
    const { ingredients } = useMainContext();

    const [currentInventory, setCurrentInventory] = useState([]);
    const [countColumns, setCountColumns] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [selectedSection, setSelectedSection] = useState(0);

    const [fireRecipeModal, setFireRecipeModal] = useState(false);
    const [alert, setAlert] = useState(false);
    const [showStockModal, setShowStockModal] = useState(false);
    const [stockAdjustment, setStockAdjustment] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('unsavedInventoryChanges');
        if (saved) {
            const lastStock = JSON.parse(saved);
            setCurrentInventory(lastStock.items);
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
        }
    }, [ingredients]);

    // Auto-save changes to localStorage
    useEffect(() => {
        if (currentInventory.length > 0) {
            const lastStock = {
                lastUpdate: new Date().toISOString(),
                items: currentInventory
            };
            localStorage.setItem('unsavedInventoryChanges', JSON.stringify(lastStock));
        }
    }, [currentInventory]);

    const handleNewInventory = () => {
        if (confirm(t('inventory.newConfirmation'))) {
            localStorage.removeItem('unsavedInventoryChanges');
            const resetInventory = ingredients
                .filter(ing => ing.setInInventory)
                .map(ing => ({
                    ...ing,
                    stock: 0
                }));
            setCurrentInventory(resetInventory);
        }
    };

    const saveInventory = () => {
        if (confirm(t('inventory.updateMainStockConfirmation'))) {
            setAlert(true);
            const lastStock = {
                lastUpdate: new Date().toISOString(),
                items: currentInventory
            };
            localStorage.setItem('unsavedInventoryChanges', JSON.stringify(lastStock));
            setAlert(false);
        }
    };

    const handleUpdateStock = (operation, index) => {
        if (!selectedIngredient || !stockAdjustment) return;

        const adjustment = Number(stockAdjustment);

        setCurrentInventory(prev =>
            prev.map(item => {
                if (item.id !== selectedIngredient.id) return item;

                const updatedCounts = [...(item.counts || [])];
                const currentValue = Number(updatedCounts[index] || 0);

                updatedCounts[index] = operation === 'add'
                    ? currentValue + adjustment
                    : currentValue - adjustment;
                return {
                    ...item,
                    updated: true,
                    counts: updatedCounts,
                    stock: updatedCounts.reduce((acc, count) => acc + count, 0)
                };
            })
        );
        setShowStockModal(false);
    };

    const handleOpenStockModal = (ingredient) => {
        setSelectedIngredient(ingredient);
        setStockAdjustment('');
        setShowStockModal(true);
    };

    const handleAddCountColumn = () => {
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
        showStockModal,
        setShowStockModal,
        stockAdjustment,
        setStockAdjustment,
        handleNewInventory,
        saveInventory,
        handleUpdateStock,
        handleOpenStockModal,
        handleAddCountColumn,
        handleDeleteCountColumn
    };
};
