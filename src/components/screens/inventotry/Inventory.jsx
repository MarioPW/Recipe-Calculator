import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../../common/Spinner';
import { FireRecipeModal } from './FireRecipeModal';
import { useMainContext } from '../../../context/MainContext';
import { SecondaryNavbar } from '../../common/SecondaryNavbar';
import { AddSubstractModal } from './AddSubstractModal';
import { GeneratePdfButton } from '../../common/GeneratePdfButton';
import { GenerateExelButton } from '../../common/GenerateExelButton';
import { CustomButton } from '../../common/CustomButton';
import { CustomTable } from '../../common/CustomTable';

export const Inventory = () => {
  const { t } = useTranslation();
  const { ingredients, ingredientService } = useMainContext();
  const [currentInventory, setCurrentInventory] = useState(ingredients);
  const [fireRecipeModal, setFireRecipeModal] = useState(false);
  const [alert, setAlert] = useState(false);
  const [stockAlert, setStockAlert] = useState(false)
  const [newStockColumn, setNewStockColumn] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockAdjustment, setStockAdjustment] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  useEffect(() => {
    const inventory = ingredients.filter((ingredient) => ingredient.setInInventory);
    setCurrentInventory(inventory);
  }, [ingredients]);
  useEffect(() => {
    if (fireRecipeModal && newStockColumn) {
      setStockAlert(true);
    }
  }, [fireRecipeModal, newStockColumn]);

  const updateIngredientsStock = async () => {
    if (confirm(t('inventory.updateMainStockConfirmation'))) {
      setAlert(true);
      const changedStockIngredients = currentInventory.filter((ingredient) => {
        if (ingredient.adjustedAmount !== undefined) {
          ingredient.stock = ingredient.adjustedAmount
          ingredient.updated = false
          delete ingredient.adjustedAmount
          return true
        }
        return false
      })
      try {
        await Promise.all(
          changedStockIngredients.map(async (ingredient) => {
            await ingredientService.updateMyIngredient(ingredient.id, ingredient);
          })
        );
      } catch (error) {
        console.error(t('inventory.updateError'), error);
      }
      setNewStockColumn(!newStockColumn)
      setAlert(false);
    }
  }
  const handleUpdateStock = (operation) => {
    if (!selectedIngredient || !stockAdjustment) return;
    setCurrentInventory(prev => {
      const index = prev.findIndex(item => item.id === selectedIngredient.id);
      if (index === -1) return prev;
      const prevItem = prev[index];
      const currentAdjusted = Number(prevItem.adjustedAmount ?? 0);
      const adjustment = Number(stockAdjustment);

      const updatedItem = {
        ...prevItem,
        updated: true,
        adjustedAmount: operation === 'add'
          ? currentAdjusted + adjustment
          : currentAdjusted - adjustment,
      };
      const newInventory = [...prev];
      newInventory[index] = updatedItem;
      return newInventory;
    });

    setShowStockModal(false);
  }

  const fileGeneratorData = {
    title: t('inventory.stockInventory'),
    summary: { 'Stock': currentInventory.length },
    tableData: currentInventory.map((ingredient) => ({
      [t('inventory.ref')]: ingredient.reference,
      [t('inventory.item')]: ingredient.name,
      [t('inventory.stock')]: `${ingredient.stock || 0} ${ingredient.unitOfMeasure}`,
    }))
  };

  const handleOpenStockModal = (ingredient) => {
    setSelectedIngredient(ingredient);
    setStockAdjustment('');
    setShowStockModal(true);
  };

  const navBarData = {
    title: t('inventory.stockInventory'),
    collapseButtonText: t('inventory.actions'),
    searchInput: {
      items: currentInventory,
      action: handleOpenStockModal
    },
    buttons: [
      {
        label: t('inventory.new'),
        action: () => setNewStockColumn(!newStockColumn)
      },
      {
        label: t('inventory.fireRecipes'),
        action: () => setFireRecipeModal(true),
      },
      {
        label: t('inventory.updateStock'),
        action: updateIngredientsStock,
      }
    ],
    collapseButtonId: 'inventoryNavbarCollapse'
  }
  const tableData = {
    title: t('inventory.title'),
    thead: [
      t('inventory.ref'),
      t('inventory.item'),
      t('inventory.stock'),
      ...(newStockColumn ? [t('inventory.newStockColumn')] : [])
    ],
    tableData: currentInventory.map((ingredient) => {
      const isLowStock = Number(ingredient.stock || 0) < Number(ingredient.minStock || 0);
      const stockCell = (
        <div className={isLowStock ? 'bg-danger p-1 text-light' : 'text-secondary'}>
          {ingredient.stock || 0} {ingredient.unitOfMeasure}
        </ div>
      );
      const stockControl = newStockColumn && (
        !ingredient.adjustedAmount ? (
          <CustomButton
            id="AddNewValue"
            className="success"
            onClick={() => handleOpenStockModal(ingredient)}
            label={<i className="bi bi-pen" />}
          />
        ) : (
          <CustomButton
            className="dark"
            onClick={() => handleOpenStockModal(ingredient)}
            label={`${ingredient.adjustedAmount} ${ingredient.unitOfMeasure}`}
          />
        )
      );
      const row = {
        [t('inventory.ref')]: ingredient.reference,
        [t('inventory.item')]: ingredient.name,
        [t('inventory.stock')]: stockCell
      };
      if (newStockColumn) {
        row[t('inventory.newStockColumn')] = stockControl;
      }
      return row;
    })
  };

  return (
    <>
      {ingredients.length > 0 ? (
        <>
          <SecondaryNavbar {...navBarData} >
            <GeneratePdfButton {...fileGeneratorData} />
            <GenerateExelButton {...fileGeneratorData} />
          </SecondaryNavbar>
          <div className="table-responsive overflow-x-auto">
            {alert && <p className="alert alert-warning position-fixed top-50 start-50">{t('inventory.updating')}...</p>}
            {stockAlert && <div className="alert alert-warning alert-dismissible fade show m-0" role="alert">
              <strong>Holy Pepperoni!</strong> {t('inventory.updateStockAlert')}
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>}
            <CustomTable {...tableData} />
          </div>
        </>
      ) : (
        <Spinner />
      )}
      {showStockModal && (
        <AddSubstractModal setStockAdjustment={setStockAdjustment}
          handleUpdateStock={handleUpdateStock}
          stockAdjustment={stockAdjustment}
          setShowStockModal={setShowStockModal}
          selectedIngredient={selectedIngredient} />
      )}
      {fireRecipeModal && !newStockColumn && (
        <FireRecipeModal
          setFireRecipeModal={setFireRecipeModal}
          currentInventory={currentInventory}
          setCurrentInventory={setCurrentInventory}
        />
      )
      }
    </>
  );
}