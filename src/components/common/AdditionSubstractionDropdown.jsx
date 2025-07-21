import React, { useState } from 'react'



export const AdditionSubstractionDropdown = ({buttonText, amount, setAmount}) => {
const OPERATIONS = {
    ADD:'add',
    SUBSTRACT:'substract'
}
      const handleUpdateStock = (operation) => {
        const currentAmount = parseFloat(amount);
        if (!isNaN(currentAmount) && currentAmount > 0) {
            setAmount((prevData) => ({
            ...prevData,
            stock:
              operation === OPERATIONS.ADD
                ? parseFloat(prevData.stock) + currentAmount
                : Math.max(0, parseFloat(prevData.stock) - currentAmount),
          }));
          setStockInput("");
        }
      }
      
  return (
    <div className="dropdown">
    <button className="btn btn-sm dropdown-toggle btn-outline-light d-sm-block me-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
      {buttonText? buttonText: 'Button'}
    </button>
    <div className="dropdown-menu dropdown-menu-lg-end p-2 me-2">
      <input
        type="number"
        className="form-control mb-2"
        placeholder='Enter Amount'
        value={stockInput}
        onChange={(e) => setStockInput(e.target.value)}
      />
      <div className="d-flex gap-2 justify-content-end">
        <button className="myButton-success border-0 text-center" onClick={() => handleUpdateStock(OPERATIONS.ADD)}>
          Add
        </button>
        <button className="myButton-purple border-0 fw-light text-center" onClick={() => handleUpdateStock(OPERATIONS.SUBSTRACT)}>
          Substract
        </button>
      </div>
    </div>
  </div>
  )
}
