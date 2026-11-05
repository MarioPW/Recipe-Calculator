import { useState } from 'react';
import { useTranslation } from "react-i18next";
import { CustomButton } from '../../../common/CustomButton';
import { CustomModal } from '../../../common/CustomModal';

export const EditRecipeIngredient = ({ ingredient, recipe, setRecipe, setEditIngredient }) => {
    const [weight, setWeight] = useState(0);
    const { t } = useTranslation();
    const inputId = `edit-recipe-ingredient-${ingredient.id}`;

    const handleAddIngredient = () => {
        if (weight <= 0) {
            alert(t("editRecipeIngredient.weightAlert"));
            return
        }
        const edit = {
            id: ingredient.id,
            weight: weight,
            unitOfMeasure: ingredient.unitOfMeasure,
            name: ingredient.name,
            isSubRecipe: ingredient.isSubRecipe || false
        }

        const newIngredients = recipe.ingredients.map((ing) => ing.id === edit.id ? edit : ing)
        const newRecipe = {
            ...recipe,
            ingredients: newIngredients
        }
        setRecipe(newRecipe);
        setEditIngredient(false)
    }

    return (
        <CustomModal
            id="edit-recipe-ingredient-modal"
            title={t("editRecipeIngredient.title", { ingredient: ingredient.name })}
            onClose={() => setEditIngredient(false)}
            footer={
                <>
                    <CustomButton
                        type="button"
                        className="secondary"
                        onClick={() => setEditIngredient(false)}
                        label={t("common.close")}
                    />
                    <CustomButton
                        type="button"
                        className="primary"
                        onClick={handleAddIngredient}
                        label={t("common.save")}
                    />
                </>
            }
        >
            <label className="form-label" htmlFor={inputId}>
                {t("editRecipeIngredient.currentWeight")}:
            </label>
            <input
                id={inputId}
                type="number"
                min="0"
                className="form-control"
                onChange={(e) => setWeight(e.target.value)}
                placeholder={`${t("editRecipeIngredient.currentWeight")}: ${ingredient.weight}`}
                required
            />
        </CustomModal>
    )
}
