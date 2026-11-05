import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomButton } from '../../../common/CustomButton';
import { CustomModal } from '../../../common/CustomModal';

export const AddIngredient = ({ setWeightModal, ingredient, currentRecipe, handleAddIngredientModal, setRecipe }) => {
    const { t } = useTranslation();
    const [weight, setWeight] = useState(0);

    const handleAddIngredient = () => {
        if (weight <= 0) {
            alert(t('addIngredient.alertEnterWeight'));
            return;
        }
        const newIngredient = {
            id: ingredient.id,
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
        <CustomModal
            id="add-ingredient-weight-modal"
            title={`${t('addIngredient.enterWeight')} ${ingredient.name}`}
            onClose={() => setWeightModal(false)}
            footer={
                <>
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
                </>
            }
        >
            <input
                type="number"
                min="0"
                className="form-control"
                onChange={(e) => setWeight(e.target.value)}
                placeholder={t('addIngredient.enterWeightPlaceholder')}
                aria-label={t('addIngredient.enterWeightPlaceholder')}
                required
            />
        </CustomModal>
    );
};
