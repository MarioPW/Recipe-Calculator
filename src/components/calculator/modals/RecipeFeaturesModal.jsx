import React from 'react'
import { useState } from 'react'

export const RecipeFeaturesModal = ({setRecipeFeaturesModal, handleSaveFeatures, recipe, setRecipe}) => {
    const [name, setName] = useState(recipe.name);
    console.log(recipe);
  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
    <div className="modal-dialog">
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Recipe Features</h5>
                <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setRecipeFeaturesModal(false)}
                ></button>
            </div>
            <div className="modal-body">
                <input 
                    className='form-control' 
                    value={name}
                    onChange={(e) => setName(e.target.value)} 
                    placeholder='Enter new recipe name'
                />
            </div>
            <div className="modal-footer">
                <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setRecipeFeaturesModal(false)}
                >
                    Cancel
                </button>
                <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={handleSaveFeatures}
                >
                    Ok
                </button>
            </div>
        </div>
    </div>
</div>
  )
}
