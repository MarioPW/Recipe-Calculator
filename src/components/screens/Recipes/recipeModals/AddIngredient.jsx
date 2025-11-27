import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomButton } from '../../../common/CustomButton';

export const AddIngredient = ({ setWeightModal, ingredient, currentRecipe, handleAddIngredientModal, setRecipe }) => {
    const { t } = useTranslation();
    const [weight, setWeight] = useState(0);

    const handleAddIngredient = () => {
        if (weight <= 0) {
            alert(t('addIngredient.alertEnterWeight'));
            return;
        }
        const newIngredient = {
            id: ingredient.id || ingredient.id,
            weight: weight,
            unitOfMeasure: ingredient.unitOfMeasure || "g",
            name: ingredient.name,
            isSubRecipe: ingredient.isSubRecipe || false
        };
        const updatedIngredients = (currentRecipe.ingredients || []).concat(newIngredient);
        setRecipe({
            ...currentRecipe,
            ingredients: updatedIngredients,
        });
        handleAddIngredientModal();
    };

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header bg-color-main text-white">
                        <h5 className="modal-title">{t('addIngredient.enterWeight')} {ingredient.name}:</h5>
                        <button
                            type="button"
                            className="btn-close ms-2 bg-white text-light"
                            onClick={() => setWeightModal(false)}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <input
                            type='number'
                            min="0"
                            className='form-control'
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder={t('addIngredient.enterWeightPlaceholder')}
                            required
                        />
                    </div>
                    <div className="modal-footer">
                        <CustomButton
                            type="button"
                            className="secondary"
                            onClick={() => setWeightModal(false)}
                            label={t('addIngredient.cancel')}
                        />
                        <CustomButton
                            type="button"
                            className="primary"
                            onClick={handleAddIngredient}
                            label={t('addIngredient.save')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};