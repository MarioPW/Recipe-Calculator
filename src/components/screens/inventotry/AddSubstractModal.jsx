import React from 'react'
import { useTranslation } from 'react-i18next';
import { CustomButton } from '../../common/CustomButton';
import { formatNumber } from '../../../utilities/utils';


export const AddSubstractModal = ({ setStockAdjustment, handleUpdateStock, stockAdjustment, setShowStockModal, selectedIngredient, columnIndex }) => {
  const { t } = useTranslation();

  const displayFormatted = stockAdjustment ? formatNumber(stockAdjustment) : '';

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content border">
          <div className="modal-header bg-color-main gap-2 w-100 p-2 m-0 text-light">
            <h5 className="modal-title">
              {selectedIngredient?.name}: <span className='fw-bold'>{formatNumber(selectedIngredient?.stock)} ({selectedIngredient?.unitOfMeasure})</span>
            </h5>
            <button
              type="button"
              className="bg-light btn-close me-1"
              onClick={() => setShowStockModal(false)}
            />
          </div>
          <div className="modal-body">
            <label className="form-label fw-bold">{t('inventory.insertValue')}</label>
            <input
              type="text"
              inputMode="numeric"
              className="form-control mt-1 fs-5"
              placeholder="0"
              value={displayFormatted}
              onChange={(e) => {
                const val = e.target.value.replace(/\./g, '').replace(',', '.');
                if (val === '' || val === '-' || !isNaN(Number(val))) {
                  setStockAdjustment(val);
                }
              }}
            />
            {/* {stockAdjustment && stockAdjustment !== '0' && (
              <div className="form-text text-muted mt-2">
                Valor: <span className="fw-bold text-primary">{displayFormatted} {selectedIngredient?.unitOfMeasure}</span>
              </div>
            )} */}
          </div>
          <div className="modal-footer">
            <CustomButton
              className="danger"
              onClick={() => handleUpdateStock('substract', columnIndex)}
              label={t('common.substract')}
            />
            <CustomButton
              className="success"
              onClick={() => handleUpdateStock('add', columnIndex)}
              label={t('common.add')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}