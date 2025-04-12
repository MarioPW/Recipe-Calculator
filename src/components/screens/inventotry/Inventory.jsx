import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../../utilities/Spinner';
import { FireRecipeModal } from './FireRecipeModal';
import { useMainContext } from '../../../context/MainContext';
import { generatePDF, generateXlsxTable } from '../../../utilities/filesGenerator';
import { SecondaryNavbar } from '../../utilities/SecondaryNavbar';
import { AddSubstractModal } from './AddSubstractModal';

export const Inventory = () => {
  const { t } = useTranslation();
  const { ingredients, ingredientService } = useMainContext();
  const [currentInventory, setCurrentInventory] = useState(ingredients);
  const [fireRecipeModal, setFireRecipeModal] = useState(false);
  const [alert, setAlert] = useState(false);
  const [stockAlert, setStockAlert] = useState(false)
  const [newStock, setNewStock] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockAdjustment, setStockAdjustment] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  useEffect(() => {
    const inventory = ingredients.filter((ingredient) => ingredient.setInInventory);
    setCurrentInventory(inventory);
  }, [ingredients]);
  useEffect(() => {
    if (fireRecipeModal && newStock) {
      setStockAlert(true);
    }
  }, [fireRecipeModal, newStock]);

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
            await ingredientService.updateMyIngredient(ingredient.FSId, ingredient);
          })
        );
      } catch (error) {
        console.error(t('inventory.updateError'), error);
      }
      setNewStock(!newStock)
      setAlert(false);
    }
  }
  const handleUpdateStock = (operation) => {
    if (!selectedIngredient || !stockAdjustment) return;
    setCurrentInventory(prev => {
      const index = prev.findIndex(item => item.FSId === selectedIngredient.FSId);
      if (index === -1) return prev;
      const prevItem = prev[index];
      const currentAdjusted = Number(prevItem.adjustedAmount ?? prevItem.stock ?? 0);
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

  const handleGenerateExcel = () => {
    const tableData = currentInventory.map((ingredient) => ({
      [t('inventory.ref')]: ingredient.reference,
      [t('inventory.item')]: ingredient.name,
      [t('inventory.stock')]: `${ingredient.stock || 0} ${ingredient.unitOfMeasure}`,
    }));
    generateXlsxTable(t('inventory.stockInventory'), tableData);
  };

  const handleGeneratePDF = () => {
    const title = t('inventory.stockInventory');
    const tableData = currentInventory.map((ingredient) => ({
      [t('inventory.ref')]: ingredient.reference,
      [t('inventory.item')]: ingredient.name,
      [t('inventory.stock')]: `${ingredient.stock || 0} ${ingredient.unitOfMeasure}`,
    }));
    generatePDF(title, tableData);
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
        action: () => setNewStock(!newStock)
      },
      {
        label: t('inventory.fireRecipes'),
        action: () => setFireRecipeModal(true),
      },
      {
        label: t('inventory.updateStock'),
        action: updateIngredientsStock,
      },
      {
        label: t('inventory.downloadPDF'),
        action: handleGeneratePDF,
      },
      {
        label: t('inventory.downloadExcel'),
        action: handleGenerateExcel,
      }
    ]
  }

  return (
    <>
      {ingredients.length > 0 ? (
        <>
          <SecondaryNavbar {...navBarData}/>
          <div className="table-responsive overflow-x-auto">
            {alert && <p className="alert alert-warning position-fixed top-50 start-50">{t('inventory.updating')}...</p>}
            {stockAlert && <div className="alert alert-warning alert-dismissible fade show m-0" role="alert">
              <strong>Holy Pepperoni!</strong> {t('inventory.updateStockAlert')}
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>}
            <table className="table table-light mb-0 text-nowrap">
              <thead>
                <tr>
                  <th>{t('inventory.ref')}</th>
                  <th>{t('inventory.item')}</th>
                  <th>{t('inventory.stock')}</th>
                  {newStock && <th>{t('inventory.newStock')}</th>}
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {currentInventory.map((ingredient) => (
                  <tr key={ingredient.FSId}>
                    <td>{ingredient.reference}</td>
                    <td>{ingredient.name}</td>
                    <td>{ingredient.stock || 0} {ingredient.unitOfMeasure} </td>
                    {newStock && (
                      <td className="text-center">
                        {!ingredient.adjustedAmount
                          ? <button
                            id="AddNewValue"
                            className="btn btn-outline-success btn-sm mb-1"
                            onClick={() => handleOpenStockModal(ingredient)}
                          >
                            <i className="bi bi-pen" />
                          </button>
                          : <button
                            className="btn btn-sm btn-outline-dark"
                            onClick={() => handleOpenStockModal(ingredient)}
                          >
                            {ingredient.adjustedAmount} {ingredient.unitOfMeasure}
                          </button>
                        }
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
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
      {fireRecipeModal && !newStock && (
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