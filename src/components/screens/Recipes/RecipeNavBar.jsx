import React, { useState, useEffect, useCallback } from 'react';
import { Calculator } from '../../../utilities/calculator';
import { CalculatedRecipeModal } from './recipeModals/CalculatedRecipeModal';
import { AmountWeightModal } from './recipeModals/AmountWeightModal';
import { AddIngredientModal } from './recipeModals/AddIngredientModal';
import { AddSubRecipeModal } from './recipeModals/AddSubRecipeModal';
import { RecipeFeaturesModal } from './recipeModals/RecipeFeaturesModal';
import { TraceabilityModal } from './recipeModals/TraceabilityModal';
import { useMainContext } from '../../../context/MainContext';
import { useTranslation } from "react-i18next";
import { GeneratePdfButton } from '../../common/GeneratePdfButton';
import { CostModal } from './recipeModals/CostModal';
import { GenerateExelButton } from '../../common/GenerateExelButton';
import { SecondaryNavbar } from '../../common/SecondaryNavbar';



export const RecipeNavBar = ({ currentRecipe }) => {
  const { t } = useTranslation();
  const calculator = new Calculator();
  const { ingredients, setRecipe, recipes } = useMainContext();

  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const [amountWeightModal, setAmountWeightModal] = useState(false);
  const [addIngredientModal, setAddIngredientModal] = useState(false);
  const [addSubRecipeModal, setAddSubRecipeModal] = useState(false);
  const [amount, setAmount] = useState(0);
  const [operation, setOperation] = useState("");
  const [weightPerUnit, setWeightPerUnit] = useState(0);
  const [convertions, setConvertions] = useState([]);
  const [recipeCosts, setRecipeCosts] = useState({});
  const [traceability, setTraceability] = useState(null);
  const [missingIngredient, setMissingIngredient] = useState(null);

  // Navbar Buttons
  const [recipeFeaturesModal, setRecipeFeaturesModal] = useState(false);
  const [convertionsModal, setConvertionsModal] = useState(false);
  const [costModal, setCostModal] = useState(false);
  const [traceabilityModal, setTraceabilityModal] = useState(false);

  // PDF, XML Buttons
  const [fileGeneratorButton, setFileGeneratorButton] = useState(false);

  const recipeData = {
    amount,
    weightPerUnit,
    name: currentRecipe?.name,
  };

  const OPERATIONS = {
    CALCULATE: t("recipeNavbar.calculate"),
    COST: t("recipeNavbar.cost"),
    TRACEABILITY: t("recipeNavbar.traceability")
  };

  useEffect(() => {
    const loadRecipeIngredients = () => {
      try {
        const loadedRecipeIngredients = currentRecipe?.ingredients?.map((ingredient) =>
          ingredients.find((ing) => ing.FSId === ingredient.id) || recipes.find((rec) => rec.id === ingredient.id)
        );
        const missing = currentRecipe.ingredients?.find(
          (ingredient, index) => !loadedRecipeIngredients[index]
        );
        missing && setMissingIngredient(missing.name);
        setRecipeIngredients(loadedRecipeIngredients);
        setFileGeneratorButton(true);
      } catch (error) {
        console.error('Error loading Ingredients:', error);
      }
    };
    loadRecipeIngredients();
  }, [currentRecipe, ingredients]);

  const fileGeneratorData = {
    title: currentRecipe?.name || '',
    summary: {
      [t("common.name")]: recipeData.name || ''
    },
    tableData: currentRecipe?.ingredients?.map((item) => ({
      [t('recipeNavbar.ingredients')]: item.name,
      [t('recipeNavbar.weight')]: `${item.weight || 0} ${item.unitOfMeasure}`
    })) || []
  };

  const toggleModal = useCallback((setter) => () => setter((prev) => !prev), []);

  const handleAmountWeightModal = useCallback((operation) => {
    setOperation(operation);
    setAmountWeightModal((prev) => !prev);
  }, []);

  const handleSaveAmountWeight = useCallback(() => {
    setAmountWeightModal(false);
    const convertions = calculator.calculateInProportion(recipeData, currentRecipe.ingredients);
    setConvertions(convertions);

    switch (operation) {
      case OPERATIONS.CALCULATE:
        setConvertionsModal(true);
        break;
      case OPERATIONS.COST:
        const verifyIngredientsCost = recipeIngredients.filter((ing) => !ing.costPerKg && !ing.isSubRecipe);

        const verifySubRecipes = recipeIngredients.filter((ing) => ing.isSubRecipe);
        const subIngredientNames = new Set();
        let subRecipesCostPerKg = [];
        if (verifyIngredientsCost.length > 0) {
          alert(t("recipeNavbar.missingCostIngredients", { items: verifyIngredientsCost.map((r) => r.name).join(', ') }));
          break
        }
        if (verifySubRecipes.length > 0) {
          const subRecipes = recipes.filter((r) => verifySubRecipes.some((subRecipe) => subRecipe.id === r.id));

          // Check sub-recipe missing cost ingredients => ingredient names without costPerKg
          subRecipes.forEach((subRecipe) => {
            subRecipe.ingredients.forEach((ingredient) => {
              subIngredientNames.add(ingredient.name);
            });
          });
          const missingCostIngredients = Array.from(subIngredientNames).filter((name) => {
            const ingredient = ingredients.find((i) => i.name === name);
            return !ingredient || ingredient.costPerKg == undefined || ingredient.costPerKg === '';
          });
          if (missingCostIngredients.length > 0) {
            alert(t("recipeNavbar.missingCostIngredients", { items: verifyIngredientsCost.map((r) => r.name).join(', ') }));
            break;
          };

          // Calculate cost per Kilogram for sub-recipes
          subRecipesCostPerKg = subRecipes.map((subRecipe) => {
            let subRecipeData = {
              amount: 1,
              weightPerUnit: 1000,
              name: subRecipe.name,
            }
            const subRecipeConvertions = calculator.calculateInProportion(
              subRecipeData,
              subRecipe.ingredients
            );
            const subRecipeCostParams = {
              ...subRecipeData,
              ingredients: subRecipe.ingredients.map((ing, index) => ({
                name: ing.name,
                requiredQuantity: subRecipeConvertions[index].conversion,
                costPerKg: ingredients.find((i) => i.FSId === ing.id).costPerKg,
                unitOfMeasure: ing.unitOfMeasure,
              }))
            };
            return calculator.costRecipe(subRecipeCostParams);
          }
          )
        }
        const costParams = {
          ...recipeData,
          ingredients: recipeIngredients.map((ing, index) => (
            {
              name: ing.name,
              requiredQuantity: convertions[index].conversion,
              costPerKg: ing.costPerKg || subRecipesCostPerKg.find((sub) => sub.name === ing.name)?.totalCost,
              unitOfMeasure: ing.unitOfMeasure,
            })),
        };
        const costCalculations = calculator.costRecipe(costParams);
        setRecipeCosts({ ...recipeData, ...costCalculations });
        setCostModal(true);
        break;
      case OPERATIONS.TRACEABILITY:
        try {
          const traceabilityHeader = {
            name: recipeData.name,
            weightPerUnit,
            amount: recipeData.amount,
          };
          const traceabilityIngredients = recipeIngredients.map((ingredient) => {
            const calculatedProportion = convertions.find((item) => item.name === ingredient.name);
            return {
              name: ingredient.name,
              unitOfMeasure: ingredient.unitOfMeasure,
              batch: ingredient.batch,
              expirationDate: ingredient.expirationDate,
              calculatedProportion: calculatedProportion.conversion,
              reference: ingredient.reference,
            };
          });
          const traceabilityParams = { ...traceabilityHeader, ingredients: traceabilityIngredients };
          setTraceability(traceabilityParams);
          setTraceabilityModal(true);
        } catch (error) {
          alert(error);
        }
        break;
      default:
        break;
    }
  }, [operation, recipeData, currentRecipe, recipeIngredients, calculator]);

  const navbarData = {
    title: currentRecipe.name && `${currentRecipe.name} X ${currentRecipe.productWeight} g`,
    collapseButtonId: "recipeNavbar",
    buttons: [
      { label: t("recipeNavbar.features"), action: toggleModal(setRecipeFeaturesModal) },
      { label: t("recipeNavbar.calculate"), action: () => handleAmountWeightModal(OPERATIONS.CALCULATE) },
      { label: t("recipeNavbar.cost"), action: () => handleAmountWeightModal(OPERATIONS.COST) },
      { label: t("recipeNavbar.traceability"), action: () => handleAmountWeightModal(OPERATIONS.TRACEABILITY) },
      { label: t("recipeNavbar.addIngredient"), action: toggleModal(setAddIngredientModal) },
      { label: t("recipeNavbar.addSubRecipe"), action: toggleModal(setAddSubRecipeModal) },
    ],
    border: true,
  };

  return (
    <>
      <SecondaryNavbar {...navbarData}>
        {fileGeneratorButton &&
          [
            <GeneratePdfButton key="pdf" {...fileGeneratorData} />,
            <GenerateExelButton key="excel" {...fileGeneratorData} />
          ]}
      </SecondaryNavbar>

      {missingIngredient && (
        <div className="alert alert-danger alert-dismissible fade show w-100 p-2" role="alert">
          <section className="fw-bold m-0">
            {t("recipeNavbar.missingIngredient")} {missingIngredient}:
            <p className="fw-light">{t("recipeNavbar.missingIngredientDescription")}</p>
          </section>
          <button type="button" className="btn-close p-3" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}
      {amountWeightModal && (
        <AmountWeightModal
          handleAmountWeightModal={toggleModal(setAmountWeightModal)}
          amount={amount}
          setAmount={setAmount}
          weightPerUnit={weightPerUnit}
          setWeightPerUnit={setWeightPerUnit}
          handleSaveAmountWeight={handleSaveAmountWeight}
          operation={operation}
        />
      )}
      {recipeFeaturesModal && (
        <RecipeFeaturesModal
          setRecipeFeaturesModal={setRecipeFeaturesModal}
          recipe={currentRecipe}
          setRecipe={setRecipe}
        />
      )}
      {convertionsModal && (
        <CalculatedRecipeModal
          recipeData={recipeData}
          convertions={convertions}
          handleSaveAmountWeight={handleSaveAmountWeight}
          handleConvertionsModal={toggleModal(setConvertionsModal)}
        />
      )}
      {costModal && (
        <CostModal
          handleCostModal={toggleModal(setCostModal)}
          recipeCosts={recipeCosts}
        />
      )}
      {traceabilityModal && (
        <TraceabilityModal
          traceability={traceability}
          handleTraceabilityModal={toggleModal(setTraceabilityModal)}
        />
      )}
      {addIngredientModal && (
        <AddIngredientModal
          handleAddIngredientModal={toggleModal(setAddIngredientModal)}
          allIngredients={ingredients}
          setRecipe={setRecipe}
          currentRecipe={currentRecipe}
        />
      )}
      {addSubRecipeModal && (
        <AddSubRecipeModal
          handleAddSubRecipeModal={toggleModal(setAddSubRecipeModal)}
          recipes={recipes}
          setRecipe={setRecipe}
          currentRecipe={currentRecipe}
        />
      )}
    </>
  );
};