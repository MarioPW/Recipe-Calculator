import React from 'react'
import { useState } from 'react'
import { AddIngredient } from './AddIngredient';
import { SearchInput } from '../../../common/SearchInput';
import { useTranslation } from "react-i18next";

export const AddIngredientModal = ({ handleAddIngredientModal, allIngredients, setRecipe, currentRecipe }) => {
    const [weightModal, setWeightModal] = useState(false);
    const [currentIngredient, setCurrentIngredient] = useState('');
    const [ingredients, setIngredients] = useState(allIngredients);
    const { t } = useTranslation();

    const handleWeightModal = (ingredient) => {
        if (currentRecipe.ingredients?.some((item) => item.id === ingredient.id)) {
            alert(t("addIngredientModal.alreadyAddedAlert"));
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
                    <div className="modal-header gap-3">
                        <h5 className="modal-title">{t("addIngredientModal.title") }</h5>
                        <SearchInput items={allIngredients} setItemsList={setIngredients} withDropdown={false} />
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleAddIngredientModal}></button>
                    </div>
                    <div className="modal-body">
                        <ul className='list-unstyled'>
                            {ingredients.map((ingredient) => {
                                return (
                                    <li key={ingredient.id} value={ingredient.name} className='btn btn-light d-block text-start' onClick={() => { handleWeightModal(ingredient) }}>
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
