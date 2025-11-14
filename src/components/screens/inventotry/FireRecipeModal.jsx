import React, { useState, useEffect } from "react";
import { Calculator } from "../../../utilities/calculator";
import { useMainContext } from "../../../context/MainContext";
import { useTranslation } from "react-i18next";

export const FireRecipeModal = ({ setFireRecipeModal, currentInventory, setCurrentInventory }) => {
  const { recipes } = useMainContext();
  const [amount, setAmount] = useState({});
  const calculator = new Calculator();
  const [validRecipes, setValidRecipes] = useState([]);
  const [invalidRecipes, setInvalidRecipes] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const validRecipes = recipes.filter((recipe) => recipe.productWeight && !recipe.isSubRecipe);
    const invalidRecipes = recipes.filter((recipe) => !recipe.productWeight || recipe.isSubRecipe);
    setValidRecipes(validRecipes);
    setInvalidRecipes(invalidRecipes);
  }, [recipes]);

  const handleClick = (e) => {
    const { name, dataset } = e.target;
    const action = dataset.action;

    setAmount((prevAmount) => {
      const currentAmount = prevAmount[name] || 0;
      return {
        ...prevAmount,
        [name]: action === "increment" ? currentAmount + 1 : Math.max(0, currentAmount - 1),
      };
    });
  };
  const handleUpdateInventory = () => {
    let updatedInventory = currentInventory;

    validRecipes.forEach((recipe) => {
      if (amount[recipe.name] > 0) {
        const recipeData = {
          amount: amount[recipe.name],
          weightPerUnit: recipe.productWeight,
        };

        const conversions = calculator.calculateInProportion(recipeData, recipe.ingredients);
        const baseConversions = conversions.filter((r) => !r.isSubRecipe);
        const subRecipeConversions = conversions.filter((r) => r.isSubRecipe);

        updatedInventory = calculator.updateInventoryWithRecipe(updatedInventory, baseConversions);

        subRecipeConversions.forEach((subRecipe) => {
          const subRecipeWithIngredients = recipes.find((r) => r.id === subRecipe.id);
          if (subRecipeWithIngredients) {
            const subRecipeData = {
              amount: 1,
              weightPerUnit: subRecipe.conversion,
            };

            const subRecipeCalc = calculator.calculateInProportion(subRecipeData, subRecipeWithIngredients.ingredients);
            updatedInventory = calculator.updateInventoryWithRecipe(updatedInventory, subRecipeCalc);
          }
        });

        setAmount({});
      }
    });

    setCurrentInventory(updatedInventory);
    setFireRecipeModal(false);
  }

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Fire Products
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => setFireRecipeModal(false)}
            ></button>
          </div>
          <div>
            <div className="container">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">{t('common.name')}</th>
                    <th scope="col">{t('common.amount')}</th>
                  </tr>
                </thead>
                <tbody>
                  {validRecipes.map((recipe) => (
                    <tr key={recipe.id}>
                      <td className="fw-bold"><span className="fw-bold bg-success text-white p-1 rounded me-2">{amount[recipe.name] || 0}</span> {recipe.name} x {recipe.productWeight || '?'}g</td>
                      <td className="">
                        <button
                          className="btn btn-sm btn-outline-danger text-danger me-2"
                          name={recipe.name}
                          onClick={handleClick}
                          data-action="decrement"
                        > -
                        </button>
                        <button
                          className="btn btn-sm btn-outline-success text-success"
                          name={recipe.name}
                          onClick={handleClick}
                          data-action="increment"
                        >
                          +
                        </button>
                      </td>
                    </tr>))}
                </tbody>
              </table>

            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary text-secondary"
              data-bs-dismiss="modal"
              onClick={() => setFireRecipeModal(false)}
            >
              {t('common.close')}
            </button>
            <button type="button" className="btn btn-sm btn-outline-primary text-primary" onClick={handleUpdateInventory}>
              {t('common.update')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
