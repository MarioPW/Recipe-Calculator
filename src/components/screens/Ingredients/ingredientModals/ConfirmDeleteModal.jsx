import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
export const ConfirmDeleteModal = ({ ingredient, setDeleteModal, ingredientService }) => {
    const { t } = useTranslation();
    if (!ingredient) return null;

    const navigate = useNavigate();
    const handleDeleteIngredient = (e) => {
        e.preventDefault();
        ingredientService.deleteMyIngredient(ingredient.id);
        setDeleteModal(false)
        navigate(`/my-ingredients`);
    }
    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header bg-dark">
                        <h5 className="modal-title text-white d-flex">{t("deleteIngredientModal.confirm", {ingredient: ingredient.name })}</h5>
                        <button type="button" className="btn-close bg-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => setDeleteModal(false)}></button>
                    </div>
                    <div className="modal-body bg-danger text-white fw-bold">
                        <p>{t("deleteIngredientModal.message")}</p>
                    </div>
                    <div className="modal-footer bg-dark">
                        <button type="button" className="btn btn-sm btn-light" data-bs-dismiss="modal"  onClick={() => setDeleteModal(false)}>{t("common.cancel")} </button>
                        <button type="button" className="btn btn-sm btn-danger border-dark fw-bold" onClick={(e) => handleDeleteIngredient(e)}>{t("common.delete")}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
