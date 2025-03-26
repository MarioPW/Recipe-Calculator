import React from 'react'

export const ConfirmDeleteRecipe = ( { recipe, setDeleteRecipe, handleDelete} ) => {
  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
    <div className="modal-dialog">
        <div className="modal-content">
            <div className="modal-header bg-danger">
                <h5 className="modal-title text-white d-flex">Confirm Delete:</h5>
                <button type="button" className="btn-close bg-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => setDeleteRecipe(false)}></button>
            </div>
            <div className="modal-body fw-bold">
                <p>Sure you want to delete<strong className='fw-bold'>{recipe.name}</strong>?</p>
            </div>
            <div className="modal-footer bg-danger">
                <button type="button" className="btn btn-dark" data-bs-dismiss="modal"  onClick={() => setDeleteRecipe(false)}>Cancel</button>
                <button type="button" className="btn btn-light border-dark fw-bold" onClick={handleDelete}>Delete</button>
            </div>
        </div>
    </div>
</div>
  )
}
