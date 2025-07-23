import React from 'react'
import { useState } from 'react'
import { AddIngredient } from './AddIngredient';
import { useTranslation } from "react-i18next";


export const AddSubRecipeModal = ({ handleAddSubRecipeModal, recipes, setRecipe, currentRecipe }) => {
    const [weightModal, setWeightModal] = useState(false);
    const [currentIngredient, setCurrentIngredient] = useState('');
    const { t } = useTranslation();

    const handleWeightModal = (ingredient) => {
        if (currentRecipe.ingredients?.some((item) => item.id === ingredient.id)) {
            alert(t("addSubRecipeModal.alreadyAddedAlert"));
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
                        <h5 className="modal-title">{t("addSubRecipeModal.title")}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleAddSubRecipeModal}></button>
                    </div>
                    <div className="modal-body">
                        <ul className='list-unstyled'>
                            {recipes
                                .filter((recipe) => recipe.isSubRecipe)
                                .map((recipe) => (
                                    <li
                                        key={recipe.id}
                                        value={recipe.name}
                                        className="btn btn-light d-block text-start"
                                        onClick={() => handleWeightModal(recipe)}
                                    >
                                        {recipe.name}
                                    </li>
                                )
                                )}
                        </ul>
                    </div>
                </div>
            </div>
            {weightModal && <AddIngredient
                setWeightModal={setWeightModal}
                ingredient={currentIngredient}
                handleAddIngredientModal={handleAddSubRecipeModal}
                setRecipe={setRecipe}
                currentRecipe={currentRecipe}
            />}
        </div>
    )
}