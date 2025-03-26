import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../../utilities/Spinner';
import { FireRecipeModal } from './FireRecipeModal';
import { useMainContext } from '../../../context/MainContext';
import { generateTablePDF, generateXlsxTable } from '../../../utilities/filesGenerator';
import { GeneratePdfButton } from '../../utilities/GeneratePdfButton';

export const Inventory = () => {
  const { t } = useTranslation();
  const { ingredients, ingredientService } = useMainContext();
  const [currentInventory, setCurrentInventory] = useState(ingredients);
  const [fireRecipeModal, setFireRecipeModal] = useState(false);
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    const inventory = ingredients.filter((ingredient) => ingredient.setInInventory);
    setCurrentInventory(inventory);
  }, [ingredients]);

  const updateIngredientsStock = async () => {
    setAlert(true);
    const changedStockIngredients = currentInventory.filter((ingredient) => {
      const matchingIngredient = ingredients.find((ing) => ing.name === ingredient.name);
      return matchingIngredient && Number(ingredient.stock) !== Number(matchingIngredient.stock);
    })
    
    try {
      await Promise.all(
        changedStockIngredients.map(async (ingredient) => {
          if (!ingredient.isSubRecipe) {
            await ingredientService.updateMyIngredient(ingredient.FSId, ingredient);
            // console.log(ingredient);
          }
        })
      )
    } catch (error) {
      console.error(t('inventory.updateError'), error);
    }
    setAlert(false);
  };
  const handleGenerateExcel = () => {
    const tableData = currentInventory.map(ingredient => ({
      [t('inventory.ref')]: ingredient.reference,
      [t('inventory.item')]: ingredient.name,
      [t('inventory.stock')]: `${ingredient.stock || 0} ${ingredient.unitOfMeasure}`,
    }));
    generateXlsxTable(t('inventory.stockInventory'), tableData);
  };

  return (
    <>
      {ingredients.length > 0 ? (
        <>
          <nav className="navbar navbar-expand-lg border mt-1 bg-color-main d-flex flex-wrap justify-content-between">
            <a className="navbar-brand text-light ps-2" href="#">
              {t('inventory.stockInventory')}
            </a>

            <button
              className="btn btn-outline-light me-2 d-lg-none"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#actionsCollapse1"
              aria-expanded="false"
              aria-controls="actionsCollapse1"
            >
              <i className="bi bi-list"></i> {t('inventory.actions')}
            </button>

            <div className="collapse navbar-collapse position-relative d-lg-block" id="actionsCollapse1">
              <ul className="navbar-nav position-absolute bg-color-main gap-2 w-100 p-2 m-0">
                <li className="nav-item mx-2">
                  <button className="btn btn-sm btn-outline-light d-sm-block" onClick={() => setFireRecipeModal(true)}>
                    {t('inventory.fireRecipes')}
                  </button>
                </li>
                <li className="nav-item mx-2">
                  <button className="btn btn-sm btn-outline-light" onClick={updateIngredientsStock}>
                    {t('inventory.updateStock')}
                  </button>
                </li>
                <li>
                  <GeneratePdfButton
                    label={t('inventory.downloadPDF')}
                    title={t('inventory.stockInventory')}
                    tableData={currentInventory.map((item) => ({
                      [t('inventory.ref')]: item.reference,
                      [t('inventory.item')]: item.name,
                      [t('inventory.stock')]: `${item.stock || 0} ${item.unitOfMeasure}`
                    }))}
                  />
                </li>
                <li className="nav-item mx-2">
                  <button type="button" className="btn btn-sm btn-outline-light" onClick={handleGenerateExcel}>
                    <i className="bi bi-download me-1"></i>{t('inventory.downloadExcel')}
                  </button>
                </li>
              </ul>
            </div>
          </nav>

          {/* Table */}
          <div className="table-responsive overflow-x-auto">
            {alert && <p className="alert alert-warning position-fixed top-50 start-50">{t('inventory.updating')}...</p>}
            <table className="table table-light mb-0 text-nowrap">
              <thead>
                <tr>
                  <th>{t('inventory.ref')}</th>
                  <th>{t('inventory.item')}</th>
                  <th>{t('inventory.stock')}</th>
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