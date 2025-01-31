import React from 'react'
import { useState } from 'react'

export const AddIngredient = ({ setWeightModal, ingredient, currentRecipe, handleAddIngredientModal, setRecipe }) => {
    const [weight, setWeight] = useState(0);

    const handleAddIngredient = () => {
        if (weight <= 0){
            alert("You must enter a weight")
            return
        }
        const add = {
            id: ingredient.FSId,
            weight: weight,
            unitOfMeasure: ingredient.unitOfMeasure,
            name: ingredient.name
        }
        const newRecipe = {
            ...currentRecipe,
            ingredients: [...currentRecipe.ingredients, add]
        }
        setRecipe(newRecipe);
        handleAddIngredientModal();
    }
    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header bg-warning">
                        <h5 className="modal-title">Enter Weight of {ingredient.name}:</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setWeightModal(false)}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <input
                            type='number'
                            min="0"
                            className='form-control'
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder='Enter Weight'
                            required
                        />
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setWeightModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleAddIngredient}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
