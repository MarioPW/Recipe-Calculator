import React from 'react'
import { useState } from 'react'

export const NameModal = ( {setNameModal, recipe, setRecipe}) => {
    const [newName, setNewName] = useState(recipe.name);
    const handleSaveName = () => {
        setNameModal(false);
        setRecipe({...recipe, name: newName});
    }
  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
    <div className="modal-dialog">
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Edit Recipe Name</h5>
                <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setNameModal(false)}
                ></button>
            </div>
            <div className="modal-body">
                <input 
                    className='form-control' 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)} 
                    placeholder='Enter new recipe name'
                />
            </div>
            <div className="modal-footer">
                <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setNameModal(false)}
                >
                    Cancel
                </button>
                <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={handleSaveName}
                >
                    Ok
                </button>
            </div>
        </div>
    </div>
</div>
  )
}
