import React from 'react'

export const RemoveIngredientModal = ({ingredient, setRecipe, recipe, setRemoveIngredient}) => {
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
                            <h5 className="modal-title text-white">Sure you want to remove {ingredient.name} from the recipe?</h5>
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
                                Remove
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {setRemoveIngredient(false)}}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
  )
}
