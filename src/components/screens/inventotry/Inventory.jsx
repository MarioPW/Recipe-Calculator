import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../../utilities/Spinner';
import { FireRecipeModal } from './FireRecipeModal';
import { useMainContext } from '../../../context/MainContext';
import { generatePDF, generateXlsxTable } from '../../../utilities/filesGenerator';
import { SecondaryNavbar } from '../../utilities/SecondaryNavbar';

export const Inventory = () => {
  const { t } = useTranslation();
  const { ingredients, setIngredients, ingredientService } = useMainContext();
  const [currentInventory, setCurrentInventory] = useState(ingredients);
  const [fireRecipeModal, setFireRecipeModal] = useState(false);
  const [alert, setAlert] = useState(false);
  const [newStock, setNewStock] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockAdjustment, setStockAdjustment] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  useEffect(() => {
    const inventory = ingredients.filter((ingredient) => ingredient.setInInventory);
    setCurrentInventory(inventory);
  }, [ingredients]);

  const updateIngredientsStock = async () => {
    setAlert(true);
    const changedStockIngredients = currentInventory.filter((ingredient) => {
      if (ingredient.adjustedAmount !== undefined) {
        ingredient.stock = ingredient.adjustedAmount;
        return true;
      }
      return false;
    });
    try {
      await Promise.all(
        changedStockIngredients.map(async (ingredient) => {
          await ingredientService.updateMyIngredient(ingredient.FSId, ingredient);
        })
      );
    } catch (error) {
      console.error(t('inventory.updateError'), error);
    }
    setAlert(false);
  };

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
  };


  const navBarData = {
    title: t('inventory.stockInventory'),
    collapseButtonText: t('inventory.actions'),
    buttons: [
      {
        label: 'New',
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
  };

  return (
    <>
      {ingredients.length > 0 ? (
        <>
          <SecondaryNavbar {...navBarData} searchInput={{ items: currentInventory, action: handleOpenStockModal}} />
          <div className="table-responsive overflow-x-auto">
            {alert && <p className="alert alert-warning position-fixed top-50 start-50">{t('inventory.updating')}...</p>}
            <table className="table table-light mb-0 text-nowrap">
              <thead>
                <tr>
                  <th>{t('inventory.ref')}</th>
                  <th>{t('inventory.item')}</th>
                  <th>{t('inventory.stock')}</th>
                  {newStock && <th>New Stock</th>}
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {currentInventory.map((ingredient) => (
                  <tr key={ingredient.FSId}>
                    <td>{ingredient.reference}</td>
                    <td>{ingredient.name}</td>
                    <td className={ingredient.updated ? "bg-info text-white fw-bold" : ""}>
                      {ingredient.stock || 0} {ingredient.unitOfMeasure}
                    </td>
                    {newStock && (
                      <td className="text-center">
                        <button
                          id="AddNewValue"
                          className="btn btn-outline-success btn-sm mb-1"
                          onClick={() => handleOpenStockModal(ingredient)}
                        >
                          {!ingredient.adjustedAmount ? <i className="bi bi-plus-circle"></i> : ingredient.adjustedAmount}
                        </button>
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

      {/* Modal */}
      {showStockModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content border">
              <div className="modal-header bg-color-main gap-2 w-100 p-2 m-0 text-light">
                <h5 className="modal-title">Actualizar stock de: {selectedIngredient?.name}</h5>
                <button type="button" className="bg-light btn-close me-1" onClick={() => setShowStockModal(false)}></button>
              </div>
              <div className="modal-body">
                <label>Valor a ajustar:</label>
                <input
                  type="number"
                  className="form-control mt-2"
                  value={stockAdjustment}
                  onChange={(e) => setStockAdjustment(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="myButton-success border-0 text-center py-2" onClick={() => handleUpdateStock('add')}>Add</button>
                <button className="myButton-purple border-0 text-center py-2" onClick={() => handleUpdateStock('substract')}>Substract</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {fireRecipeModal && (
        <FireRecipeModal
          setFireRecipeModal={setFireRecipeModal}
          currentInventory={currentInventory}
          setCurrentInventory={setCurrentInventory}
        />
      )}
    </>
  );
}