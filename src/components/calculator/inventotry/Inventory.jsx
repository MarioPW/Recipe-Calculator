import React from 'react'
import { useState, useEffect } from 'react'
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Spinner } from '../../utilities/Spinner';
import { FireRecipeModal } from './FireRecipeModal';
import { useMainContext } from '../../../context/MainContext';
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
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Stock Inventory" + " " + new Date().toLocaleDateString(), 10, 15);

    const tableData = currentInventory.map(ingredient => [
      ingredient.name,
      `${ingredient.stock || 0} ${ingredient.unitOfMeasure}`
    ]);

    autoTable(doc, {
      head: [['Item', 'Stock']],
      body: tableData,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fontSize: 10 }
    });

    doc.save("Inventory" + "_" + new Date().toLocaleDateString() + ".pdf");
  };

  const generateExcel = () => {
    const wb = XLSX.utils.book_new();

    const tableData = currentInventory.map(ingredient => ({
      Item: ingredient.name,
      Stock: `${ingredient.stock || 0} ${ingredient.unitOfMeasure}`,
    }));

    const ws = XLSX.utils.json_to_sheet(tableData);

    XLSX.utils.book_append_sheet(wb, ws, "Inventory");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(data, "Inventory" + " " + new Date().toLocaleDateString() + ".xlsx");
  };

  return (
    <>
      {ingredients.length > 0 ? (
        <div className="w-100">
          <nav className='navbar bg-light border-bottom p-2 my-1 d-flex justify-content-between'>
            <h5>
              <strong>Stock Inventory</strong>
            </h5>
            <ul className='d-flex flex-row mb-0 gap-3'>
              <li className='nav-item list-group-item'>
                <button className="myButton-success fw-bold border-0 py-2" onClick={() => setFireRecipeModal(true)}>
                  Fire Recipe
                </button>
              </li>
              <li className='nav-item list-group-item'>
                <button className="myButton-purple fw-bold border-0 py-2" onClick={updateIngredientsStock}>
                  Update Ingredients Stock
                </button>
              </li>
              <li className='nav-item list-group-item'>
                <button className="myButton-primary fw-bold border-0 py-2" onClick={generatePDF}>
                  Export to PDF
                </button>
              </li>
              <li className='nav-item list-group-item'>
                <button className="myButton-yellow fw-bold border-0 py-2" onClick={generateExcel}>
                  Export to Excel
                </button>
              </li>
            </ul>
          </nav>

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
                    <td className={ingredient.updated ? "bg-info" : ""}>{ingredient.stock || 0} {ingredient.unitOfMeasure}</td>
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
