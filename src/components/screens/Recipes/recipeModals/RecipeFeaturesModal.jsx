import React from 'react'
import { useState } from 'react'
import { useMainContext } from '../../../../context/MainContext';
import { useTranslation } from 'react-i18next';

export const RecipeFeaturesModal = ({ setRecipeFeaturesModal, recipe, setRecipe }) => {
    const { t } = useTranslation();
    const { recipes } = useMainContext()
    const [currentRecipe, setCurrentRecipe] = useState({
        name: recipe.name || '',
        description: recipe.description || '',
        steps: recipe.steps || [],
        imageUrl: recipe.imageUrl || '',
        isSubRecipe: recipe.isSubRecipe || false,
        productWeight: recipe.productWeight || 0
    });
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;
        setCurrentRecipe({
            ...currentRecipe,
            [name]: newValue
        });
    }
    const handleSaveChanges = () => {
        if (recipes.find((r) => r.name === currentRecipe.name) && currentRecipe.name !== recipe.name) {
            alert(`Recipe with name ${currentRecipe.name} already exists.`)
            return
        } else {
            const updatedRecipe = {
                ...recipe,
                name: currentRecipe.name,
                description: currentRecipe.description,
                steps: currentRecipe.steps,
                imageUrl: currentRecipe.imageUrl,
                isSubRecipe: currentRecipe.isSubRecipe,
                productWeight: currentRecipe.productWeight,
            }
            setRecipe(updatedRecipe);
            setRecipeFeaturesModal(false);
        }
    }
    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{t('recipeFeaturesModal.title')}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setRecipeFeaturesModal(false)}
                        ></button>
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="recipeName" className="form-label">{t('common.name')}</label>
                                <input
                                    id="recipeName"
                                    className="form-control"
                                    value={currentRecipe.name}
                                    name='name'
                                    onChange={(e) => handleChange(e)}
                                    placeholder="Enter recipe name"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="recipeDescription" className="form-label">{t('recipeFeaturesModal.description')}</label>
                                <textarea
                                    id="recipeDescription"
                                    className="form-control"
                                    value={currentRecipe.description}
                                    name='description'
                                    onChange={(e) => handleChange(e)}
                                    placeholder="Enter recipe description"
                                    rows="3"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="recipeSteps" className="form-label">{t('recipeFeaturesModal.steps')}</label>
                                <textarea
                                    id="recipeSteps"
                                    className="form-control"
                                    value={currentRecipe.steps}
                                    name='steps'
                                    onChange={(e) => handleChange(e)}
                                    placeholder="Enter recipe steps"
                                    rows="5"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="recipeImage" className="form-label">{t('recipeFeaturesModal.imageUrl')}</label>
                                <input
                                    id="recipeImage"
                                    className="form-control"
                                    value={currentRecipe.image}
                                    name='image'
                                    onChange={(e) => handleChange(e)}
                                    placeholder="Enter image URL"
                                />
                            </div>
                            <div className='row' >
                                <div className="mb-3 col-md-6">
                                    <label htmlFor="productWeight" className="form-label">{t('recipeFeaturesModal.productWeight')} (g)</label>
                                    <input
                                        id="productWeight"
                                        type="number"
                                        className="form-control"
                                        value={currentRecipe.productWeight}
                                        name='productWeight'
                                        onChange={(e) => handleChange(e)}
                                        placeholder="Enter product weight"
                                    />
                                </div>

                                <div className="mb-3 form-check col-md-6">
                                    <label htmlFor="isSubRecipe" className="form-check-label">{t('recipeFeaturesModal.isSubRecipe')}</label>
                                    <input
                                        id="isSubRecipe"
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={currentRecipe.isSubRecipe}
                                        name='isSubRecipe'
                                        onChange={(e) => handleChange(e)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setRecipeFeaturesModal(false)}
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                            // onClick={handleSaveChanges}
                            >
                                {t('common.saveChanges')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
