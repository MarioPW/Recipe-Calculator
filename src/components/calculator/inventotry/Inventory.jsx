import React from 'react'
import { useState } from 'react'
import { Spinner } from '../../../utilities/components/Spinner';
import { FireRecipeModal } from './FireRecipeModal';
import { useMainContext } from '../../../context/MainContext';
export const Inventory = () => {
  const { ingredients, ingredientRepo } = useMainContext();
  const [currentInventory, setCurrentInventory] = useState(ingredients);
  const [fireRecipeModal, setFireRecipeModal] = useState(false);

  const updateIngredientsStock = () => {
    const changedStockIngredients = currentInventory.filter((ingredient) => {
      const matchingIngredient = ingredients.find((ing) => ing.name === ingredient.name);
      return matchingIngredient && Number(ingredient.stock) !== Number(matchingIngredient.stock);
    });
    changedStockIngredients.forEach((ingredient) => {
      ingredientRepo.updateMyIngredient(ingredient.FSId, ingredient);
    })
  }
  return (
    <div className="container">
      {ingredients.length > 0 ? (
        <div className="container w-100 px-2 px-md-3">
          {/* Tabla responsive */}
          <div className="table-responsive">
            <table className="table table-light table-striped mb-0">
              <thead className="text-center">
                <tr>
                  <th>Name</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody className="table-group-divider text-center">
                {currentInventory.map((ingredient) => (
                  <tr key={ingredient.FSId}>
                    <td>{ingredient.name}</td>
                    <td>{ingredient.stock || 0} {ingredient.unitOfMeasure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Contenedor de botones responsive */}
          <div className="d-flex flex-wrap justify-content-center justify-content-md-end bg-light p-3 gap-2">
            <button className="btn myButton-success fw-bold" onClick={() => setFireRecipeModal(true)}>
              Fire Recipe
            </button>
            <button className="btn myButton-purple fw-bold" onClick={updateIngredientsStock}>
              Update Ingredients Stock
            </button>
            <button className="btn myButton-primary" disabled>Save Inventory</button>
            <button className="btn myButton-danger" disabled>Delete</button>
          </div>
        </div>
      ) : (
        <Spinner />
      )}

      {fireRecipeModal && (
        <FireRecipeModal
          setFireRecipeModal={setFireRecipeModal}
          currentInventory={currentInventory}
          setCurrentInventory={setCurrentInventory}
        />
      )}
    </div>
  )
}
