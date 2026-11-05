import { useTranslation } from "react-i18next";
import { CustomButton } from '../../../common/CustomButton';
import { CustomModal } from '../../../common/CustomModal';

export const RemoveIngredientModal = ({ ingredient, setRecipe, recipe, setRemoveIngredient }) => {
  const { t } = useTranslation();

  const handleRemove = () => {
    const modifiedRecipe = {
      ...recipe,
      ingredients: recipe.ingredients.filter((item) => item.id !== ingredient.id)
    };
    setRecipe(modifiedRecipe);
    setRemoveIngredient(false)
  }

  return (
    <CustomModal
      id="remove-ingredient-modal"
      title={t("removeIngredientModal.title", { ingredient: ingredient.name })}
      onClose={() => setRemoveIngredient(false)}
      footer={
        <>
          <CustomButton
            type="button"
            className="danger"
            onClick={handleRemove}
            label={t("common.remove")}
          />
          <CustomButton
            type="button"
            className="primary"
            onClick={() => setRemoveIngredient(false)}
            label={t("common.cancel")}
          />
        </>
      }
    >
      <p className="mb-0">{t("removeIngredientModal.description", { ingredient: ingredient.name })}</p>
    </CustomModal>
  )
}
