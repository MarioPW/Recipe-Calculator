import React from 'react'
import { useTranslation } from "react-i18next";

export const RemoveIngredientModal = ({ingredient, setRecipe, recipe, setRemoveIngredient}) => {
    const { t } = useTranslation();
    const prevRecipe = recipe;
    const handleRemove = () => {
        const modifiedRecipe = prevRecipe.ingredients.filter((item) => item.id !== ingredient.id);
        prevRecipe.ingredients = modifiedRecipe
        setRecipe(prevRecipe);
        setRemoveIngredient(false)
    }
  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header bg-danger">
                            <h5 className="modal-title text-white">{t("removeIngredientModal.title", { ingredient: ingredient.name })}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => {setRemoveIngredient(false)}}
                            ></button>
                        </div>
                       
                        <div className="modal-footer d-flex justify-content-evenly">
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleRemove}
                            >
                                {t("common.remove")}
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {setRemoveIngredient(false)}}
                            >
                                {t("common.cancel")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
  )
}
