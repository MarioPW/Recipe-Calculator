import React, { useState, useEffect, useCallback } from 'react';
import { Calculator } from '../../../utilities/calculator';
import { CalculatedRecipeModal } from './recipeModals/CalculatedRecipeModal';
import { AmountWeightModal } from './recipeModals/AmountWeightModal';
import { AddIngredientModal } from './recipeModals/AddIngredientModal';
import { AddSubRecipeModal } from './recipeModals/AddSubRecipeModal';
import { RecipeFeaturesModal } from './recipeModals/RecipeFeaturesModal';
import { TraceabilityModal } from './recipeModals/TraceabilityModal';
import { useMainContext } from '../../../context/MainContext';

const OPERATIONS = {
  CALCULATE: "Calculate",
  COST: "Cost",
  TRACEABILITY: "Make Traceability",
};

export const RecipeNavBar = ({ currentRecipe }) => {
  const calculator = new Calculator();
  const { ingredients, setRecipe, recipes } = useMainContext();

  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const [amountWeightModal, setAmountWeightModal] = useState(false);
  const [addIngredientModal, setAddIngredientModal] = useState(false);
  const [addSubRecipeModal, setAddSubRecipeModal] = useState(false);
  const [amount, setAmount] = useState(0);
  const [operation, setOperation] = useState("");
  const [weightPerUnit, setWeightPerUnit] = useState(0);
  const [convertionsModal, setConvertionsModal] = useState(false);
  const [convertions, setConvertions] = useState([]);
  const [traceability, setTraceability] = useState(null);
  const [missingIngredient, setMissingIngredient] = useState(null);
  const [traceabilityModal, setTraceabilityModal] = useState(false);
  const [recipeFeaturesModal, setRecipeFeaturesModal] = useState(false);

  const recipeData = {
    amount,
    weightPerUnit,
    name: currentRecipe?.name,
  };

  useEffect(() => {
    const loadRecipeIngredients = () => {
      try {
        const loadedRecipeIngredients = currentRecipe?.ingredients?.map((ingredient) =>
          ingredients.find((ing) => ing.name === ingredient.name) || ingredient
        );
        const missing = currentRecipe.ingredients?.find(
          (ingredient, index) => !loadedRecipeIngredients[index]
        );
        missing && setMissingIngredient(missing.name);
        setRecipeIngredients(loadedRecipeIngredients);
      } catch (error) {
        console.error('Error loading Ingredients:', error);
      }
    };
    loadRecipeIngredients();
  }, [currentRecipe, ingredients]);

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
        try {
          const costParams = {
            ...recipeData,
            ingredients: recipeIngredients.map((ing, index) => ({
              name: ing.name,
              requiredQuantity: convertions[index].conversion,
              costPerKg: ing.costPerKg,
              unitOfMeasure: ing.unitOfMeasure,
            })),
          };
          const calculations = calculator.costRecipe(costParams);
          console.log(calculations); //TODO: Show the cost of the recipe in a modal
        } catch (error) {
          alert(error);
        }
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

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary p-3">
        <div className="container-fluid">
          <h3 className="navbar-brand fw-bold">
            {currentRecipe.name && `${currentRecipe.name} X ${currentRecipe.productWeight} g`}
          </h3>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-2">
              <li className="nav-item">
                <button
                  className="myButton-yellow border-0 py-1"
                  onClick={toggleModal(setRecipeFeaturesModal)}
                >
                  Features
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="myButton-primary border-0 py-1"
                  onClick={() => handleAmountWeightModal(OPERATIONS.CALCULATE)}
                >
                  Calculate
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="myButton-primary border-0 py-1"
                  onClick={() => handleAmountWeightModal(OPERATIONS.COST)}
                >
                  Cost $
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="myButton-purple border-0 py-1"
                  onClick={() => handleAmountWeightModal(OPERATIONS.TRACEABILITY)}
                >
                  Traceability
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="myButton-purple border-0 py-1"
                  onClick={toggleModal(setAddIngredientModal)}
                >
                  Add Ingredient
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="myButton-success fw-bold border-0 py-1"
                  onClick={toggleModal(setAddSubRecipeModal)}
                >
                  Add SubRecipe
                </button>
              </li>
            </ul>
          </div>
        </div>

        {missingIngredient && (
          <div className="alert alert-danger alert-dismissible fade show w-100 p-2" role="alert">
            <section className="fw-bold m-0">
              Missing ingredient {missingIngredient}:
              <p className="fw-light mb-1">
                This ingredient has not been added yet or has been deleted from your
                ingredients table. Please add it or delete it from your recipes or you
                will not be able to traceability or cost your recipe correctly.
              </p>
            </section>
            <button
              type="button"
              className="btn-close p-3"
              data-bs-dismiss="alert"
              aria-label="Close"
            ></button>
          </div>
        )}
      </nav>

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
      {traceabilityModal && (
        <TraceabilityModal
          traceability={traceability}
          handleTraceabilityModal={toggleModal(setTraceabilityModal)}
        />
      )}
    </>
  );
};