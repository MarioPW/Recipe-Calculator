import React from 'react'
import { useState } from 'react'
import { AddIngredient } from './AddIngredient';
import { SearchInput } from '../../../common/SearchInput';
import { CustomModal } from '../../../common/CustomModal';
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
        <>
            <CustomModal
                id="add-ingredient-modal"
                title={t("addIngredientModal.title")}
                // Escape must only close the nested weight modal while it is open
                onClose={() => { if (!weightModal) handleAddIngredientModal(); }}
                headerActions={
                    <SearchInput items={allIngredients} setItemsList={setIngredients} withDropdown={false} />
                }
            >
                <ul className='list-unstyled'>
                    {ingredients.map((ingredient) => {
                        return (
                            <li key={ingredient.id} value={ingredient.name} className='btn btn-light d-block text-start' onClick={() => { handleWeightModal(ingredient) }}>
                                {ingredient.name}
                            </li>
                        )
                    })}
                </ul>
            </CustomModal>
            {weightModal && <AddIngredient
                setWeightModal={setWeightModal}
                ingredient={currentIngredient}
                handleAddIngredientModal={handleAddIngredientModal}
                setRecipe={setRecipe}
                currentRecipe={currentRecipe}
            />}
        </>
    )
}
