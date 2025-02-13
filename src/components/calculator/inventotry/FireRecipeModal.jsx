import React, { useState, useEffect } from "react";
import { Calculator } from "../../../utilities/calculator";
import { useMainContext } from "../../../context/MainContext";

export const FireRecipeModal = ({ setFireRecipeModal, currentInventory, setCurrentInventory }) => {
  const { recipes } = useMainContext();
  const [amount, setAmount] = useState({});
  const calculator = new Calculator();
  const [ validRecipes, setValidRecipes ] = useState([]);
  const [ invalidRecipes, setInvalidRecipes ] = useState([]);

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
    validRecipes.forEach((recipe) => {
      if (amount[recipe.name] > 0) {
        const recipeData = {
          amount: amount[recipe.name],
          weightPerUnit: recipe.productWeight,
        }
        const recipeIngredients = recipe.ingredients
        const convertions = calculator.calculateInProportion(recipeData, recipeIngredients);
        // const updatedIngreidents = calculator.updateInventoryWithRecipe(convertions, ingredients);
        const updatedIngredients = currentInventory.map((ing) => {
          const conversion = convertions.find((con) => con.name === ing.name)?.conversion || 0;
        return {
          ...ing,
          stock: parseFloat((ing.stock - conversion).toFixed(1)),
          }
        })
        setCurrentInventory(updatedIngredients);
        setAmount({})
      }
    })
    setFireRecipeModal(false)
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
          <div className="modal-body">
            <div className="container">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">Recipe</th>
                    <th scope="col">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {validRecipes.map((recipe) => (
                    <tr key={recipe.id}>
                      <td className="fw-bold"><span className="fw-bold bg-success text-white p-1 rounded me-2">{amount[recipe.name] || 0}</span> {recipe.name} x {recipe.productWeight || '?'}g</td>
                      <td className="">
                        <button
                          className="btn myButton-primary me-2"
                          name={recipe.name}
                          onClick={handleClick}
                          data-action="increment"
                        >
                          +
                        </button>
                        <button
                          className="btn myButton-danger"
                          name={recipe.name}
                          onClick={handleClick}
                          data-action="decrement"
                        > -
                        </button>
                      </td>
                    </tr> ))}
                </tbody>
              </table>

            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={() => setFireRecipeModal(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={handleUpdateInventory}>
              Update Inventory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
