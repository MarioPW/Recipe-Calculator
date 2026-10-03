import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { CustomButton } from '../../common/CustomButton';
import { formatNumber } from '../../../utilities/utils';


export const AddSubstractModal = ({ setStockAdjustment, handleUpdateStock, stockAdjustment, setShowStockModal, selectedIngredient, columnIndex, tareValue = 0, setTareValue, handleToggleTare }) => {
  const { t } = useTranslation();
  const [keepOpen, setKeepOpen] = useState(false);

  const displayFormatted = stockAdjustment ? formatNumber(stockAdjustment) : '';
  const placeholderText = tareValue > 0 ? `${t('inventory.tare')}: ${formatNumber(tareValue)}` : '0';

  const handleDisableTare = () => {
    if (setTareValue) {
      setTareValue(0);
    } else if (handleToggleTare) {
      handleToggleTare();
    }
  };

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
            <div className="input-group mt-1">
              <input
                type="text"
                inputMode="numeric"
                className="form-control fs-5"
                placeholder={placeholderText}
                value={displayFormatted}
                onChange={(e) => {
                  const val = e.target.value.replace(/\./g, '').replace(',', '.');
                  if (val === '' || val === '-' || !isNaN(Number(val))) {
                    setStockAdjustment(val);
                  }
                }}
              />
              {tareValue > 0 && (
                <button
                  type="button"
                  className="btn btn-warning text-dark fw-bold px-3 fs-5"
                  onClick={handleDisableTare}
                  title={`${t('inventory.tare')}: ${formatNumber(tareValue)}`}
                >
                  T
                </button>
              )}
            </div>
          </div>
          <div className="modal-footer justify-content-between">
            <CustomButton
              className={keepOpen ? 'primary active' : 'secondary'}
              onClick={() => setKeepOpen(!keepOpen)}
              title={t('inventory.keepOpen')}
            >
              <i className={`bi ${keepOpen ? 'bi-pin-angle-fill' : 'bi-pin-angle'} fs-6`}></i>
            </CustomButton>
            <div className="d-flex gap-2">
              <CustomButton
                className="danger"
                onClick={() => handleUpdateStock('substract', columnIndex, keepOpen)}
                label={t('common.substract')}
              />
              <CustomButton
                className="success"
                onClick={() => handleUpdateStock('add', columnIndex, keepOpen)}
                label={t('common.add')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}