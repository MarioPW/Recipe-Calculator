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
  const { ingredients } = useMainContext();

  const [currentInventory, setCurrentInventory] = useState([]);
  const [fireRecipeModal, setFireRecipeModal] = useState(false);
  const [alert, setAlert] = useState(false);
  const [stockAlert, setStockAlert] = useState(false);
  const [newStockColumn, setNewStockColumn] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockAdjustment, setStockAdjustment] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState(null);

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
          stock: 0
        }));
      setCurrentInventory(baseInventory);
    }
  }, [ingredients]);

  useEffect(() => {
    if (fireRecipeModal) {
      setStockAlert(true);
    }
  }, [fireRecipeModal]);

  const getStockCellStyles = (ingredient) => {
    if (ingredient.stock !== undefined) {
      if (Number(ingredient.stock) < Number(ingredient.minStock || 0)) {
        return 'bg-danger text-light'; // Low stock warning
      } else if (ingredient.stock > 0) {
        return 'bg-info text-light'; // Stock adjusted but not low
      }
    }
    return 'text-dark'; // No stock defined or zero
  };

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
      setNewStockColumn(true);
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

  const handleUpdateStock = (operation) => {
    if (!selectedIngredient || !stockAdjustment) return;
    // console.log('Ajustando stock:', operation, selectedIngredient.id);
    setCurrentInventory(prev => {
      const newInventory = prev.map(item =>
        item.id === selectedIngredient.id
          ? {
              ...item,
              updated: true,
              stock: operation === 'add'
                ? Number(item.stock || 0) + Number(stockAdjustment)
                : Number(item.stock || 0) - Number(stockAdjustment),
            }
          : item
      );
      localStorage.setItem(
        'unsavedInventoryChanges',
        JSON.stringify({ lastUpdate: new Date().toISOString(), items: newInventory })
      );
      return newInventory;
    });
    setShowStockModal(false);
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
    // buttons: [
    //   { label: t('inventory.new'), action: handleNewInventory },
    //   { label: t('inventory.fireRecipes'), action: () => setFireRecipeModal(true) },
    //   { label: t('common.save'), action: saveInventory }
    // ],
    collapseButtonId: 'inventoryNavbarCollapse'
  };

  const fileGeneratorData = {
    title: t('inventory.stockInventory'),
    summary: { Stock: currentInventory.length },
    tableData: currentInventory.map((ingredient) => ({
      [t('inventory.ref')]: ingredient.reference,
      [t('inventory.item')]: ingredient.name,
      [t('inventory.stock')]: `${ingredient.stock || 0} ${ingredient.unitOfMeasure}`,
    }))
  };

  const tableData = {
    title: t('inventory.title'),
    thead: [
      t('inventory.ref'),
      t('inventory.item'),
      t('inventory.stock'),
      t('inventory.newStockColumn')
    ],
    tableData: currentInventory.map((ingredient) => {
      const stockCellStyles = getStockCellStyles(ingredient);
      const stockCell = (
        <div className={`${stockCellStyles} p-1 text-center`}>
          {ingredient.stock || 0} {ingredient.unitOfMeasure}
        </div>
      );
      const stockControl = (
        <CustomButton
          id="AddNewValue"
          className="success"
          onClick={() => handleOpenStockModal(ingredient)}
          label={<i className="bi bi-pen" />}
        />
      );
      const row = {
        [t('inventory.ref')]: ingredient.reference,
        [t('inventory.item')]: ingredient.name,
        [t('inventory.stock')]: stockCell,
        [t('inventory.newStockColumn')]: stockControl
      };
      // if (newStockColumn) {
      //   row = stockControl;
      // }
      return row;
    })
  };

  return (
    <>
      {ingredients.length > 0 ? (
        <>
          <SecondaryNavbar {...navBarData} >
          < CustomButton className='light' label = {t('inventory.new')} onClick={handleNewInventory}/>
          < CustomButton className='light' label = {t('inventory.fireRecipes')} onClick={() => setFireRecipeModal(true)}/>
          {/* < CustomButton className='light' label = {t('inventory.fireRecipes')} onClick={ () => setFireRecipeModal(true)}/> */}
          
            <GeneratePdfButton {...fileGeneratorData} />
            <GenerateExelButton {...fileGeneratorData} />
          </SecondaryNavbar>
          <div className="table-responsive overflow-x-auto">
            {alert && <p className="alert alert-warning position-fixed top-50 start-50">{t('inventory.updating')}...</p>}
            {/* {stockAlert && (
              <div className="alert alert-warning alert-dismissible fade show m-0" role="alert">
                <strong>Holy Pepperoni!</strong> {t('inventory.updateStockAlert')}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
            )} */}
            <CustomTable {...tableData} />
          </div>
        </>
      ) : (
        <Spinner />
      )}
      {showStockModal && (
        <AddSubstractModal
          setStockAdjustment={setStockAdjustment}
          handleUpdateStock={handleUpdateStock}
          stockAdjustment={stockAdjustment}
          setShowStockModal={setShowStockModal}
          selectedIngredient={selectedIngredient}
        />
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
};
