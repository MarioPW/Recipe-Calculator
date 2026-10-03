import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { CustomButton } from '../../common/CustomButton';
import { formatNumber } from '../../../utilities/utils';


export const AddSubstractModal = ({ setStockAdjustment, handleUpdateStock, stockAdjustment, setShowStockModal, selectedIngredient, columnIndex, countColumns = [], tareValue = 0, setTareValue, handleToggleTare }) => {
  const { t } = useTranslation();
  const [keepOpen, setKeepOpen] = useState(false);

  const activeIndex = columnIndex || 0;
  const sectionName = countColumns?.[activeIndex]?.name || `${t('inventory.section')} ${activeIndex + 1}`;
  const sectionValue = selectedIngredient?.counts?.[activeIndex] ?? 0;

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
          <div className="modal-header bg-color-main text-light p-2 px-3 m-0 d-flex align-items-center justify-content-between">
            <div className="d-flex flex-column lh-sm me-2">
              <h5 className="modal-title fs-6 fw-bold m-0 text-light">
                {selectedIngredient?.name}
              </h5>
              <span className="text-light text-opacity-75" style={{ fontSize: '0.75rem' }}>
                {sectionName}: <strong className="text-warning">{formatNumber(sectionValue)} {selectedIngredient?.unitOfMeasure}</strong>
                <span className="mx-1.5">•</span>
                {t('inventory.total')}: <strong className="text-light">{formatNumber(selectedIngredient?.stock)} {selectedIngredient?.unitOfMeasure}</strong>
              </span>
            </div>
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