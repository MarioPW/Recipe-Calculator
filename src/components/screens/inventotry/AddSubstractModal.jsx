import React from 'react'
import { useTranslation } from 'react-i18next';
import { CustomButton } from '../../common/CustomButton';


export const AddSubstractModal = ({ setStockAdjustment, handleUpdateStock, stockAdjustment, setShowStockModal, selectedIngredient }) => {
  const { t } = useTranslation();

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
    <div className="modal-dialog" role="document">
      <div className="modal-content border">
        <div className="modal-header bg-color-main gap-2 w-100 p-2 m-0 text-light">
          <h5 className="modal-title">
            {selectedIngredient?.name}: <span className='fw-bold'>{selectedIngredient.stock} ({selectedIngredient.unitOfMeasure})</span>
          </h5>
          <button
            type="button"
            className="bg-light btn-close me-1"
            onClick={() => setShowStockModal(false)}
          />
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
          <CustomButton
            className="danger"
            onClick={() => handleUpdateStock('substract')}
            label={t('common.substract')}
          />
          <CustomButton
            className="success"
            onClick={() => handleUpdateStock('add')}
            label={t('common.add')}
          />
        </div>
      </div>
    </div>
  </div>
  )
}