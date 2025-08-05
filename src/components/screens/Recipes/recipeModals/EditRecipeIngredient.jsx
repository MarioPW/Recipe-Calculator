import React from 'react'
import { useState } from 'react'
import { useTranslation } from "react-i18next";
import { CustomButton } from '../../../common/CustomButton';


export const EditRecipeIngredient = ({ ingredient, recipe, setRecipe, setEditIngredient }) => {
    const [weight, setWeight] = useState(0);
    const { t } = useTranslation();
    const handleAddIngredient = () => {
        if (weight <= 0) {
            alert(t("editRecipeIngredient.weightAlert"));
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
        setEditIngredient()
    }
    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{t("editRecipeIngredient.title", { ingredient: ingredient.name })}</h5>
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
                            placeholder={`${t("editRecipeIngredient.cuurentWeight")}: ${ingredient.weight}`}
                            required
                        />
                    </div>
                    <div className="modal-footer">
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
                    </div>
                </div>
            </div>
        </div>
    )
}
