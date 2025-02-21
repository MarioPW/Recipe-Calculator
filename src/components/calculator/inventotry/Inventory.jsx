import React from 'react'
import { useState, useEffect } from 'react'
import { Spinner } from '../../../utilities/components/Spinner';
import { FireRecipeModal } from './FireRecipeModal';
import { useMainContext } from '../../../context/MainContext';
export const Inventory = () => {
  const { ingredients, ingredientRepo } = useMainContext();
  const [currentInventory, setCurrentInventory] = useState(ingredients);
  const [fireRecipeModal, setFireRecipeModal] = useState(false);
  const [alert, setAlert] = useState(false);


  useEffect (() =>  {
    setCurrentInventory(ingredients);
  }, [ingredients])

  const updateIngredientsStock = async () => {
    setAlert(true);
    const changedStockIngredients = currentInventory.filter((ingredient) => {
      const matchingIngredient = ingredients.find((ing) => ing.name === ingredient.name);
      return matchingIngredient && Number(ingredient.stock) !== Number(matchingIngredient.stock);
    });
    try {
      await Promise.all(
        changedStockIngredients.map(async (ingredient) => {
          await ingredientRepo.updateMyIngredient(ingredient.FSId, ingredient);
        })
      );
    } catch (error) {
      console.error("Error al actualizar los ingredientes:", error);
    }
    setAlert(false);
  }
  return (
    <>
      {ingredients.length > 0 ? (
        <div className="w-100">
        
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
        
          {/* Table */}
          <div className="table-responsive">
            {alert && <p className="alert alert-warning position-fixed top-50 start-50">Updatting... </p>}
            <table className="table table-light mb-0">
              
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
                    <td  className={ingredient.updated ? "bg-info" : "" }>{ingredient.stock || 0} {ingredient.unitOfMeasure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    </>
  )
}
