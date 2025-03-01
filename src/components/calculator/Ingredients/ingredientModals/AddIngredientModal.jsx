import React from 'react'
import { useState } from 'react'
import { AddIngredient } from './AddIngredient';

export const AddIngredientModal = ({ handleAddIngredientModal, allIngredients, setRecipe, currentRecipe }) => {
    const [weightModal, setWeightModal] = useState(false);
    const [currentIngredient, setCurrentIngredient] = useState('');

    const handleWeightModal = (ingredient) => {
        if (currentRecipe.ingredients?.some((item) => item.id === ingredient.FSId)) {
            alert('You already added this ingredient')
        }
        else {
            setCurrentIngredient(ingredient)
            setWeightModal(true)
        }
    }
    return (
        <div className='modal fade show d-block ' tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} id='add-ingredient-modal' >

            < div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add New Ingredient</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleAddIngredientModal}></button>
                    </div>
                    <div className="modal-body">
                        <ul className='list-unstyled'>
                            {allIngredients.map((ingredient) => {
                                return (
                                    <li key={ingredient.FSId} value={ingredient.name} className='btn btn-light d-block text-start' onClick={() => { handleWeightModal(ingredient) }}>
                                        {ingredient.name}
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>
            {weightModal && <AddIngredient
                setWeightModal={setWeightModal}
                ingredient={currentIngredient}
                handleAddIngredientModal={handleAddIngredientModal}
                setRecipe={setRecipe}
                currentRecipe={currentRecipe}
            />}
        </div>
    )
}
