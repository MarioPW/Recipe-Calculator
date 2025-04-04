import React from 'react'
import { useState } from 'react'
export const EditRecipeIngredient = ({ ingredient, recipe, setRecipe, setEditIngredient }) => {
    const [weight, setWeight] = useState(0);
    const handleAddIngredient = () => {
        if (weight <= 0) {
            alert("You must enter a weight");
            return
          }
        const edit = {
            id: ingredient.id,
            weight: weight,
            unitOfMeasure: ingredient.unitOfMeasure,
            name: ingredient.name
        }
        
        const newIngredients = recipe.ingredients.map((ing) => ing.id === edit.id ? edit : ing)
        const newRecipe = {
            ...recipe,
            ingredients: newIngredients
        }
        setRecipe(newRecipe);
        setEditIngredient()}
        return (
            <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header bg-warning">
                            <h5 className="modal-title">Enter Weight of {ingredient.name}:</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setEditIngredient(false)}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <input
                                type='number'
                                className='form-control'
                                onChange={(e) => setWeight(e.target.value)}
                                placeholder={`${ingredient.weight}`}
                                required
                            />
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setEditIngredient(false)}
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
