import React from 'react'

export const AddSubstractModal = ({setStockAdjustment, handleUpdateStock, stockAdjustment, setShowStockModal, selectedIngredient}) => {
  return (
    <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
    <div className="modal-dialog" role="document">
      <div className="modal-content border">
        <div className="modal-header bg-color-main gap-2 w-100 p-2 m-0 text-light">
          <h5 className="modal-title fw-bold">{selectedIngredient?.name} X {selectedIngredient.stock} {selectedIngredient.unitOfMeasure}:</h5>
          <button type="button" className="bg-light btn-close me-1" onClick={() => setShowStockModal(false)}></button>
        </div>
        <div className="modal-body">
          <label>Valor a ajustar:</label>
          <input
            type="number"
            className="form-control mt-2"
            value={stockAdjustment}
            onChange={(e) => setStockAdjustment(e.target.value)}
          />
        </div>
        <div className="modal-footer">
          <button className="myButton-success border-0 text-center py-2" onClick={() => handleUpdateStock('add')}>Add</button>
          <button className="myButton-purple border-0 text-center py-2" onClick={() => handleUpdateStock('substract')}>Substract</button>
        </div>
      </div>
    </div>
  </div>
  )
}