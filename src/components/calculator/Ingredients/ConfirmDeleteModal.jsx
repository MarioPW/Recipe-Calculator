import React from 'react'
import { useNavigate } from 'react-router-dom';

export const ConfirmDeleteModal = ({ ingredient, setDeleteModal, ingredientRepository }) => {
    const navigate = useNavigate();
    const handleDeleteIngredient = (e) => {
        e.preventDefault();
        ingredientRepository.deleteMyIngredient(ingredient.FSId);
        setDeleteModal(false)
        navigate(`/my-ingredients`);
    }
    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header bg-danger">
                        <h5 className="modal-title text-white d-flex">Sure you want to delete<strong className='fw-bold'>{ingredient.name}</strong>?</h5>
                        <button type="button" className="btn-close bg-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => setDeleteModal(false)}></button>
                    </div>
                    <div className="modal-body bg-dark text-white fw-bold">
                        <p>Deletting this ingredient will remove it from ALL your recipes.</p>
                    </div>
                    <div className="modal-footer bg-danger">
                        <button type="button" className="btn btn-dark" data-bs-dismiss="modal"  onClick={() => setDeleteModal(false)}>Cancel</button>
                        <button type="button" className="btn btn-light border-dark fw-bold" onClick={(e) => handleDeleteIngredient(e)}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
