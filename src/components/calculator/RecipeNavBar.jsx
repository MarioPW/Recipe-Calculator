import React, { useState, useEffect } from 'react';
import { Calculator } from '../../utilities/calculator';
import { CalculatedRecipeModal } from './modals/CalculatedRecipeModal';
import { AmountWeightModal } from './modals/AmountWeightModal';
import { AddIngredientModal } from './modals/AddIngredientModal';
import { AddSubRecipeModal } from './modals/AddSubRecipeModal';
import { RecipeFeaturesModal } from './modals/RecipeFeaturesModal';
import { useMainContext } from '../../context/MainContext';

export const RecipeNavBar = ({ currentRecipe }) => {
    const calculator = new Calculator();
    const { ingredients, setRecipe, recipes } = useMainContext()

    const [recipeIngredients, setRecipeIngredients] = useState([]);
    const [amountWeightModal, setamountWeightModal] = useState(false);
    const [addIngredientModal, setAddIngredientModal] = useState(false);
    const [addSubRecipeModal, setAddSubRecipeModal] = useState(false);
    const [amount, setAmount] = useState(0);
    const [operation, setOperation] = useState("");
    const [weightPerUnit, setWeightPerUnit] = useState(0);
    const [convertionsModal, setConvertionsModal] = useState(false);
    const [convertions, setConvertions] = useState([]);
    const [missingIngredient, setMissingIngredient] = useState(null);
    const [recipeFeaturesModal, setRecipeFeaturesModal] = useState(false);
    const recipeData = {
        amount,
        weightPerUnit,
        name: currentRecipe?.name
    }

    useEffect(() => {
        const loadRecipeIngredients = () => {
            try {
                const loadedRecipeIngredients = currentRecipe?.ingredients?.map((ingredient) => {
                    return ingredients.find((ing) => ing.name === ingredient.name) || { ingredient };
                })
                const missingIngredient = currentRecipe.ingredients?.find((ingredient, index) => {
                    return !loadedRecipeIngredients[index];
                })
                missingIngredient && setMissingIngredient(missingIngredient.name)
                setRecipeIngredients(loadedRecipeIngredients);
            } catch (error) {
                console.error('Error loading Ingredients:', error);
            }

        };
        loadRecipeIngredients()

    }, []);

    const handleAmountWeightModal = (operation) => {
        setOperation(operation);
        setamountWeightModal(!amountWeightModal);
    };
    const handleConvertionsModal = () => {
        setConvertionsModal(!convertionsModal);
    };
    const handleAddIngredientModal = () => {
        setAddIngredientModal(!addIngredientModal);
    }
    const handleAddSubRecipeModal = () => {
        setAddSubRecipeModal(!addSubRecipeModal);
    }
    const handleSaveAmountWeight = () => {
        setamountWeightModal(!amountWeightModal);
        const convertions = calculator.calculateInProportion(recipeData, currentRecipe.ingredients);
        setConvertions(convertions);
        switch (operation) {
            case "Calculate":
                setConvertionsModal(!convertionsModal);
                break
            case "Cost":
                try {
                    const costParams = {
                        ...recipeData,
                        ingredients: recipeIngredients.map((ing, index) => ({
                            name: ing.name,
                            requiredQuantity: convertions[index].conversion,
                            costPerKg: ing.costPerKg,
                            unitOfMeasure: ing.unitOfMeasure
                        }))
                    }
                    const calculations = calculator.costRecipe(costParams);
                    console.log(calculations) //TODO: Show the cost in a modal
                    break
                } catch (error) {
                    alert(error)
                }
            case "Make Traceability":
                try {
                    const traceabilityHeader = {
                        name: recipeData.name,
                        weightPerUnit,
                        amount: recipeData.amount
                    }
                    const traceabilityIngredients = recipeIngredients.map((ingredient) => {
                        const calculatedProportion = convertions.find(item => item.name === ingredient.name);

                        return {
                            name: ingredient.name,
                            unitOfMeasure: ingredient.unitOfMeasure,
                            batch: ingredient.batch,
                            expirationDate: ingredient.expirationDate,
                            calculatedProportion: calculatedProportion.conversion
                        }
                    })
                    const traceabilityParams = { ...traceabilityHeader, ingredients: traceabilityIngredients }
                    console.log(traceabilityParams) // TODO: Show the traceability in a modal

                    break
                } catch (error) {
                    alert(error)
                }
        }
    }
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary p-3">
                <div className="container-fluid">
                    <h3 className="navbar-brand fw-bold">
                        {currentRecipe.name && currentRecipe.name}
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
                                    className="btn myButton-yellow"
                                    onClick={() => setRecipeFeaturesModal(true)}
                                >
                                    Features
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className="btn myButton-primary"
                                    onClick={() => handleAmountWeightModal("Calculate")}
                                >
                                    Calculate
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className="btn myButton-primary"
                                    onClick={() => handleAmountWeightModal("Cost")}
                                >
                                    Cost $
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className="btn myButton-purple"
                                    onClick={() => handleAmountWeightModal("Make Traceability")}
                                >
                                    Traceability
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className="btn myButton-purple"
                                    onClick={handleAddIngredientModal}
                                >
                                    Add Ingredient
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className="btn myButton-success fw-bold"
                                    onClick={handleAddSubRecipeModal}
                                >
                                    Add SubRecipe
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>


                {missingIngredient && (
                    <div
                        className="alert alert-danger alert-dismissible fade show w-100 p-2"
                        role="alert"
                    >
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
                    handleConvertionsModal={handleConvertionsModal}
                />
            )}
            {amountWeightModal && (
                <AmountWeightModal
                    handleAmountWeightModal={handleAmountWeightModal}
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
                    handleAddIngredientModal={handleAddIngredientModal}
                    allIngredients={ingredients}
                    setRecipe={setRecipe}
                    currentRecipe={currentRecipe}
                />
            )}
            {addSubRecipeModal && (
                <AddSubRecipeModal
                handleAddSubRecipeModal={handleAddSubRecipeModal}
                recipes={recipes}
                    setRecipe={setRecipe}
                    currentRecipe={currentRecipe}
                />
            )}
        </>
    );
};