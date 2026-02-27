import React from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../../common/Spinner';
import { FireRecipeModal } from './FireRecipeModal';
import { SecondaryNavbar } from '../../common/SecondaryNavbar';
import { AddSubstractModal } from './AddSubstractModal';
import { CustomButton } from '../../common/CustomButton';
import { CustomTable } from '../../common/CustomTable';
import { ExportDropdown } from '../../common/ExportDropdown';
import { useInventoryState } from './useInventory';

// Helper to determine styling for stock levels
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

export const Inventory = () => {
  const { t } = useTranslation();
  const {
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
    handleUpdateStock,
    handleOpenStockModal,
    handleAddCountColumn,
    handleDeleteCountColumn
  } = useInventoryState();

  // --- Data Preparation for Components ---

  const navBarData = {
    title: t('inventory.stockInventory'),
    collapseButtonText: t('inventory.actions'),
    searchInput: {
      items: currentInventory,
      action: handleOpenStockModal
    },
    collapseButtonId: 'inventoryNavbarCollapse'
  };

  const fileGeneratorData = {
    title: `${t('inventory.stockInventory')} - ${new Date().toLocaleDateString()}`,
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
      ...countColumns.map((col, index) => {
        const isSelected = selectedSection === index;
        return (
          <div
            key={col.id}
            className={`d-flex align-items-center gap-2 p-1 ${isSelected ? 'bg-primary bg-opacity-10' : ''}`}
            onClick={() => setSelectedSection(index)}
          >
            <span
              className={`p-0 text-decoration-none text-reset fw-bold ${isSelected ? 'text-primary' : ''}`}
              style={{ fontSize: '0.90rem' }}
            >
              {col.name}
            </span>
            <button
              className="btn btn-sm btn-light p-0 px-1 hover-danger"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCountColumn(index);
              }}
              title={t('common.delete')}
              style={{ fontSize: '1rem', lineHeight: '1' }}
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        );
      }),
      t('inventory.total')
    ],
    tableData: currentInventory.map((ingredient) => {
      const stockCellStyles = getStockCellStyles(ingredient);

      const row = {
        [t('inventory.ref')]: ingredient.reference,
        [t('inventory.item')]: (
          <CustomButton
            className="none"
            onClick={() => handleOpenStockModal(ingredient)}
            label={ingredient.name}
          />
        ),
      };

      // Add dynamic count columns
      countColumns.forEach((col, index) => {
        const isSelected = selectedSection === index;
        row[col.name] = (
          <div className={`p-1 text-start ${isSelected ? 'bg-primary bg-opacity-10 fw-bold' : ''}`}
            onClick={() => setSelectedSection(index)}
          >
            {ingredient.counts?.[index] || 0}
          </div>
        );
      });

      // Total counts column - moved to the end
      row[t('inventory.total')] = (
        <div className={`${stockCellStyles} p-1`}>
          {ingredient.stock}
        </div>
      );

      return row;
    })
  };

  // --- Render ---

  if (ingredients.length === 0) return <Spinner />;

  return (
    <>
      <SecondaryNavbar {...navBarData}>
        <CustomButton className='light' label={t('inventory.new')} onClick={handleNewInventory} />
        <CustomButton className='light' label={t('inventory.addCount')} onClick={handleAddCountColumn} />
        <CustomButton className='light' label={t('inventory.fireRecipes')} onClick={() => setFireRecipeModal(true)} />
        <ExportDropdown
          fileGeneratorData={fileGeneratorData}
          label={t('download.export')}
          className="light"
        />
      </SecondaryNavbar>

      <main className="table-responsive overflow-x-auto">
        {alert && (
          <div className="alert alert-warning position-fixed top-50 start-50 translate-middle" style={{ zIndex: 1050 }}>
            {t('inventory.updating')}...
          </div>
        )}
        <CustomTable {...tableData} />
      </main>

      {/* Modals */}
      {showStockModal && (
        <AddSubstractModal
          setStockAdjustment={setStockAdjustment}
          handleUpdateStock={handleUpdateStock}
          stockAdjustment={stockAdjustment}
          setShowStockModal={setShowStockModal}
          selectedIngredient={selectedIngredient}
          columnIndex={selectedSection}
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
