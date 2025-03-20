import React from 'react'
import { useState, useEffect } from 'react'
import { Spinner } from '../../utilities/Spinner';
import { FireRecipeModal } from './FireRecipeModal';
import { useMainContext } from '../../../context/MainContext';
import { generateTablePDF, generateXlsxTable } from '../../../utilities/filesGenerator';
export const Inventory = () => {
  const { ingredients, ingredientRepo } = useMainContext();
  const [currentInventory, setCurrentInventory] = useState(ingredients);
  const [fireRecipeModal, setFireRecipeModal] = useState(false);
  const [alert, setAlert] = useState(false);


  useEffect(() => {
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
      console.error("Error updating stock:", error);
    }
    setAlert(false);
  }

  const handleGeneratePDF = () => {
    const pdfData = {
      title: "Stock Inventory",
      headers: ["Ref", "Item", "Stock"],
      data: currentInventory.map(ingredient => [
        ingredient.reference,
        ingredient.name,
        `${ingredient.stock || 0} ${ingredient.unitOfMeasure}`
      ]),
      fileName: "Inventory"
    }
    generateTablePDF(pdfData)
  }

  const handleGenerateExcel = () => {
    const tableData = currentInventory.map(ingredient => ({
      Ref: ingredient.reference,
      Item: ingredient.name,
      Stock: `${ingredient.stock || 0} ${ingredient.unitOfMeasure}`,
    }));
    generateXlsxTable("Inventory", tableData)
  };

  return (
    <>
      {ingredients.length > 0 ? (
        <>
            <nav className="navbar navbar-expand-lg border mt-1 bg-color-main d-flex flex-wrap justify-content-between">
              <a className="navbar-brand text-light ps-2" href="#">
                Stock Inventory
              </a>

              <button
                className="btn btn-outline-light me-2 d-lg-none"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#actionsCollapse1"
                aria-expanded="false"
                aria-controls="actionsCollapse1"
              >
                <i className="bi bi-list"></i> Actions
              </button>

              <div className="collapse navbar-collapse position-relative d-lg-block" id="actionsCollapse1">
                <ul className="navbar-nav position-absolute bg-color-main gap-2 w-100 p-2 m-0">
                  <li className="nav-item mx-2">
                    <button className="btn btn-sm btn-outline-light d-sm-block" onClick={() => setFireRecipeModal(true)}>
                      Fire Recipes
                    </button>
                  </li>
                  <li className="nav-item mx-2">
                    <button className="btn btn-sm btn-outline-light" onClick={updateIngredientsStock}>
                      Update Stock
                    </button>
                  </li>
                  <li className="nav-item mx-2">
                    <button type="button" className="btn btn-sm btn-outline-light" onClick={handleGeneratePDF}>
                      <i className="bi bi-download me-1"></i>Download as .pdf
                    </button>
                  </li>
                  <li className="nav-item mx-2">
                    <button type="button" className="btn btn-sm btn-outline-light" onClick={handleGenerateExcel}>
                      <i className="bi bi-download me-1"></i>Download as .xlsx
                    </button>
                  </li>
                </ul>
              </div>
            </nav>

          {/* Table */}
          <div className="table-responsive overflow-x-auto">
            {alert && <p className="alert alert-warning position-fixed top-50 start-50">Updating... </p>}
            <table className="table table-light mb-0 text-nowrap">
              <thead className="">
                <tr>
                  <th>Ref</th>
                  <th>Name</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {currentInventory.map((ingredient) => (
                  <tr key={ingredient.FSId}>
                    <td>{ingredient.reference}</td>
                    <td>{ingredient.name}</td>
                    <td className={ingredient.updated ? "bg-info" : ""}>
                      {ingredient.stock || 0} {ingredient.unitOfMeasure}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
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
  );
};  