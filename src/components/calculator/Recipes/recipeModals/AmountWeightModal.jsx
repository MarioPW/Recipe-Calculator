import React from 'react'

export const AmountWeightModal = ( {handleAmountWeightModal, amount, setAmount, weightPerUnit, setWeightPerUnit, handleSaveAmountWeight, operation} ) => {
  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
    <div className="modal-dialog">
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Enter Amount and Weight</h5>
                <button
                    type="button"
                    className="btn-close"
                    onClick={handleAmountWeightModal}
                ></button>
            </div>
            <div className="modal-body">
                <label htmlFor="amount">Amount:</label>
                <input
                id='amount'
                    className='form-control'
                    value={amount}
                    type='number'
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>
            <div className="modal-body">
                <label htmlFor="amount">Weight per Unit:</label>
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
                    className="btn btn-secondary"
                    onClick={handleAmountWeightModal}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
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
