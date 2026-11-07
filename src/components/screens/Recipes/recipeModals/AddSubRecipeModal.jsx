import React from 'react'
import { useState } from 'react'
import { AddIngredient } from './AddIngredient';
import { useTranslation } from "react-i18next";
import { SearchInput } from '../../../common/SearchInput';
import { CustomModal } from '../../../common/CustomModal';


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
        <>
            <CustomModal
                id="add-sub-recipe-modal"
                title={t("addSubRecipeModal.title")}
                // Escape must only close the nested weight modal while it is open
                onClose={() => { if (!weightModal) handleAddSubRecipeModal(); }}
                headerActions={
                    <SearchInput
                        items={recipes.filter((recipe) => recipe.isSubRecipe)}
                        action={handleAddSubRecipeModal}
                    />
                }
            >
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
            </CustomModal>
            {weightModal && <AddIngredient
                setWeightModal={setWeightModal}
                ingredient={currentIngredient}
                handleAddIngredientModal={handleAddSubRecipeModal}
                setRecipe={setRecipe}
                currentRecipe={currentRecipe}
            />}
        </>
    )
}
