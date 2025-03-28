import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../../utilities/Spinner';
import { FireRecipeModal } from './FireRecipeModal';
import { useMainContext } from '../../../context/MainContext';
import { generatePDF, generateXlsxTable } from '../../../utilities/filesGenerator';
import { SecondaryNavbar } from '../../utilities/SecondaryNavbar';

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
          await ingredientService.updateMyIngredient(ingredient.FSId, ingredient);
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
  const handleGeneratePDF = () => {
    const title = t('inventory.stockInventory');
    const tableData = currentInventory.map(ingredient => ({
      [t('inventory.ref')]: ingredient.reference,
      [t('inventory.item')]: ingredient.name,
      [t('inventory.stock')]: `${ingredient.stock || 0} ${ingredient.unitOfMeasure}`,
    }));
    generatePDF(title, tableData);
  }

  const navBarData = {
    title: t('inventory.stockInventory'),
    collapseButtonText: t('inventory.actions'),
    buttons: [
      {
        label: t('inventory.fireRecipes'),
        action: () => setFireRecipeModal(true),
      },
      {
        label: t('inventory.updateStock'),
        action: updateIngredientsStock,
      },
      {
        label: t('inventory.downloadPDF'),
        action: handleGeneratePDF,
      },
      {
        label: t('inventory.downloadExcel'),
        action: handleGenerateExcel,
      }
    ]
  };
  return (
    <>
      {ingredients.length > 0 ? (
        <>
          <SecondaryNavbar {...navBarData} />
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