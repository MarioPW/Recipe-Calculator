import React from 'react'
import { useTranslation } from "react-i18next";
import { SecondaryNavbar } from '../../../common/SecondaryNavbar';
import { CustomButton } from '../../../common/CustomButton';

export const RemoveIngredientModal = ({ ingredient, setRecipe, recipe, setRemoveIngredient }) => {
  const { t } = useTranslation();
  const prevRecipe = recipe;
  const handleRemove = () => {
    const modifiedRecipe = prevRecipe.ingredients.filter((item) => item.id !== ingredient.id);
    prevRecipe.ingredients = modifiedRecipe
    setRecipe(prevRecipe);
    setRemoveIngredient(false)
  }
  const navbarData = {
    title: t("removeIngredientModal.title", { ingredient: ingredient.name }),
    collapseButtonId: "removeIngredientNavbar",
    buttons: [
      { label: 'X', action: () => setRemoveIngredient(false) },
    ],
    border: false, // puedes activarlo si deseas mostrar borde
  };
  return (

    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <SecondaryNavbar {...navbarData} />

          <div className="modal-footer d-flex justify-content-evenly">
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
          </div>
        </div>
      </div>
    </div>
  )
}
