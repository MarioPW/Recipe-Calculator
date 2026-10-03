import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../../common/Spinner';
import { FireRecipeModal } from './FireRecipeModal';
import { SecondaryNavbar } from '../../common/SecondaryNavbar';
import { AddSubstractModal } from './AddSubstractModal';
import { CustomButton } from '../../common/CustomButton';
import { CustomTable } from '../../common/CustomTable';
import { ExportDropdown } from '../../common/ExportDropdown';
import { useInventoryState } from './useInventory';
import { formatNumber } from '../../../utilities/utils';
import { generatePDF, generateXlsxTable } from '../../../utilities/filesGenerator';

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
    alertMessage,
    showStockModal,
    setShowStockModal,
    stockAdjustment,
    setStockAdjustment,
    tareValue,
    setTareValue,
    creationDate,
    handleToggleTare,
    handleNewInventory,
    handleUpdateStock,
    handleOpenStockModal,
    handleAddCountColumn,
    handleDeleteCountColumn
  } = useInventoryState();

  const [exportModalType, setExportModalType] = useState(null); // 'pdf' | 'excel' | null

  // --- Export Handling ---

  const generateExport = (type, includeCounts) => {
    const exportTitle = `${t('inventory.stockInventory')} - ${new Date().toLocaleDateString()}`;
    let exportTableData = [];

    if (includeCounts && countColumns.length > 0) {
      exportTableData = currentInventory.map((ingredient) => {
        const row = {
          [t('inventory.ref')]: ingredient.reference,
          [t('inventory.item')]: ingredient.name,
        };
        countColumns.forEach((col, index) => {
          row[col.name] = formatNumber(ingredient.counts?.[index] || 0);
        });
        row[t('inventory.total')] = `${formatNumber(ingredient.stock || 0)} ${ingredient.unitOfMeasure}`;
        return row;
      });
    } else {
      exportTableData = currentInventory.map((ingredient) => ({
        [t('inventory.ref')]: ingredient.reference,
        [t('inventory.item')]: ingredient.name,
        [t('inventory.stock')]: `${formatNumber(ingredient.stock || 0)} ${ingredient.unitOfMeasure}`,
      }));
    }

    if (type === 'pdf') {
      generatePDF(exportTitle, exportTableData);
    } else if (type === 'excel') {
      generateXlsxTable(exportTitle, exportTableData);
    }

    setExportModalType(null);
  };

  const handleExportPDF = () => {
    if (countColumns.length > 0) {
      setExportModalType('pdf');
    } else {
      generateExport('pdf', false);
    }
  };

  const handleExportXLS = () => {
    if (countColumns.length > 0) {
      setExportModalType('excel');
    } else {
      generateExport('excel', false);
    }
  };

  // --- Data Preparation for Components ---

  const formatCreationDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString();
    } catch (e) {
      return dateStr;
    }
  };

  const navBarTitle = (
    <span className="d-flex flex-column align-items-start">
      <span className="lh-sm">{t('inventory.stockInventory')}</span>
      {creationDate && (
        <span className="fw-normal text-light text-opacity-75" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
          {formatCreationDate(creationDate)}
        </span>
      )}
    </span>
  );

  const navBarData = {
    title: navBarTitle,
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
      [t('inventory.stock')]: `${formatNumber(ingredient.stock || 0)} ${ingredient.unitOfMeasure}`,
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
            {formatNumber(ingredient.counts?.[index] || 0)}
          </div>
        );
      });

      // Total counts column - moved to the end
      row[t('inventory.total')] = (
        <div className={`${stockCellStyles} p-1`}>
          {formatNumber(ingredient.stock)}
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
        <CustomButton
          className={tareValue > 0 ? 'warning active text-dark fw-bold' : 'light'}
          label={tareValue > 0 ? `${t('inventory.tare')}: ${formatNumber(tareValue)}` : t('inventory.tare')}
          onClick={handleToggleTare}
        />
        <CustomButton className='light' label={t('inventory.fireRecipes')} onClick={() => setFireRecipeModal(true)} />
        <ExportDropdown
          fileGeneratorData={fileGeneratorData}
          label={t('download.export')}
          className="light"
          onExportPDF={handleExportPDF}
          onExportXLS={handleExportXLS}
        />
      </SecondaryNavbar>

      <main className="table-responsive overflow-x-auto">
        {(alert || alertMessage) && (
          <div className="alert alert-warning position-fixed top-50 start-50 translate-middle shadow-lg fs-5 text-center fw-bold" style={{ zIndex: 1050, minWidth: '300px' }}>
            {alertMessage || `${t('inventory.updating')}...`}
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
          tareValue={tareValue}
          setTareValue={setTareValue}
          handleToggleTare={handleToggleTare}
        />
      )}

      {fireRecipeModal && (
        <FireRecipeModal
          setFireRecipeModal={setFireRecipeModal}
          currentInventory={currentInventory}
          setCurrentInventory={setCurrentInventory}
        />
      )}

      {exportModalType && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border shadow">
              <div className="modal-header bg-color-main text-light">
                <h5 className="modal-title">
                  <i className="bi bi-file-earmark-arrow-down me-2"></i>
                  {t('exportModal.title')}
                </h5>
                <button
                  type="button"
                  className="bg-light btn-close"
                  onClick={() => setExportModalType(null)}
                />
              </div>
              <div className="modal-body text-center py-4">
                <p className="fs-5 fw-semibold mb-4">
                  {t('exportModal.question')}
                </p>
                <div className="d-grid gap-3 col-11 mx-auto">
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={() => generateExport(exportModalType, true)}
                  >
                    <i className="bi bi-grid-3x3-gap me-2"></i>
                    {t('exportModal.includeCounts')}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-lg"
                    onClick={() => generateExport(exportModalType, false)}
                  >
                    <i className="bi bi-calculator me-2"></i>
                    {t('exportModal.onlyTotals')}
                  </button>
                </div>
              </div>
              <div className="modal-footer justify-content-center">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setExportModalType(null)}
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
