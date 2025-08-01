import React from 'react'
import { useTranslation } from "react-i18next";

export const AmountWeightModal = ( {handleAmountWeightModal, amount, setAmount, weightPerUnit, setWeightPerUnit, handleSaveAmountWeight, operation} ) => {
    const { t } = useTranslation();
  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
    <div className="modal-dialog">
        <div className="modal-content">
            <div className="modal-header bg-color-main text-white">
                <h5 className="modal-title">{t('amountWeightModal.title')}:</h5>
                <button
                    type="button"
                    className="btn-close ms-2 bg-white text-light"
                    onClick={handleAmountWeightModal}
                ></button>
            </div>
            <div className="modal-body">
                <label htmlFor="amount">{t('amountWeightModal.amount')}:</label>
                <input
                id='amount'
                    className='form-control'
                    value={amount}
                    type='number'
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>
            <div className="modal-body">
                <label htmlFor="amount">{t('amountWeightModal.weightPerUnit')}:</label>
                <input
                    className='form-control'
                    value={weightPerUnit}
                    type='number'
                    onChange={(e) => setWeightPerUnit(e.target.value)}
                    placeholder='Weight:'
                />
            </div>
            <div className="modal-footer">
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={handleAmountWeightModal}
                >
                   {t('common.close')}
                </button>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={handleSaveAmountWeight}
                >
                    {operation}
                </button>
            </div>
        </div>
    </div>
</div>
  )
}
