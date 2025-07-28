import React from 'react'
import { useTranslation } from 'react-i18next';


export const AddSubstractModal = ({ setStockAdjustment, handleUpdateStock, stockAdjustment, setShowStockModal, selectedIngredient }) => {
  const { t } = useTranslation();

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content border">
          <div className="modal-header bg-color-main gap-2 w-100 p-2 m-0 text-light">
            <h5 className="modal-title fw-bold">{selectedIngredient?.name} ({selectedIngredient.unitOfMeasure}):</h5>
            <button type="button" className="bg-light btn-close me-1" onClick={() => setShowStockModal(false)}></button>
          </div>
          <div className="modal-body">
            <label>{t('inventory.insertValue')}</label>
            <input
              type="number"
              className="form-control mt-2"
              value={stockAdjustment}
              onChange={(e) => setStockAdjustment(e.target.value)}
            />
          </div>
          <div className="modal-footer">
            <button className="btn btn-sm btn-outline-danger text-danger" onClick={() => handleUpdateStock('substract')}>{t('common.substract')}</button>
            <button className="btn btn-sm btn-outline-success text-success" onClick={() => handleUpdateStock('add')}> {t('common.add')} </button>
          </div>
        </div>
      </div>
    </div>
  )
}