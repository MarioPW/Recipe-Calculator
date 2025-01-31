import React, { useState, useEffect } from 'react';
import { Calculator } from '../../utilities/calculator';
import { CalculatedRecipeModal } from './modals/CalculatedRecipeModal';
import { NameModal } from './modals/NameModal';
import { AmountWeightModal } from './modals/AmountWeightModal';
import { IngredientRepo } from '../../ingredients/services';
import { auth, db } from '../../firebaseConfig';
import { AddIngredientModal } from './modals/AddIngredientModal';
import { RecipeFeaturesModal } from './modals/RecipeFeaturesModal';

export const RecipeNavBar = ({ currentRecipe, setRecipe }) => {
    const calculator = new Calculator();
    const ingredientRepository = new IngredientRepo(db, auth);

    const [recipeIngredients, setRecipeIngredients] = useState([]);
    const [allIngredients, setAllIngredients] = useState([]);
    const [nameModal, setNameModal] = useState(false);
    const [amountWeightModal, setamountWeightModal] = useState(false);
    const [addIngredientModal, setAddIngredientModal] = useState(false);
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
        const fetchRecipeIngredients = async () => {
            try {
                const ingredientsPromises = currentRecipe.ingredients.map((ingredient) => {
                    return ingredientRepository.getMyIngredientByid(ingredient.id)
                })
                const fetchedIngredients = await Promise.all(ingredientsPromises)
                const missingIngredient = currentRecipe.ingredients.find((ingredient, index) => {
                    return !fetchedIngredients[index];
                })
                missingIngredient && setMissingIngredient(missingIngredient.name)
                setRecipeIngredients(fetchedIngredients);
            } catch (error) {
                console.error('Error fetching Ingredients:', error);
            }
        };
        const fetchAllIngredients = async () => {
            try {
                const allIngredients = await ingredientRepository.getAllIngredients();
                const sortedItems = allIngredients.sort((a, b) => a.name.localeCompare(b.name))
                setAllIngredients(sortedItems);
            } catch (error) {
                console.error('Error fetching Ingredients:', error);
            }
        };
        currentRecipe.name !== "New Recipe" ? fetchRecipeIngredients() : setRecipeIngredients([]);
        fetchAllIngredients();
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
    const handleSaveFeatures = () => {
        setRecipeFeaturesModal(!recipeFeaturesModal);
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
            <nav className='navbar bg-body-tertiary d-flex justify-content-end p-2 items-center p-3'>
                <div className="container-fluid">
                    {currentRecipe ? <p className='fw-bold mb-0'>{currentRecipe.name}</p> : <p className='fw-bold mb-0'>New Recipe</p>}
                    <ul className='block d-md-flex gap-2 list-unstyled mb-0'>
                        <li>
                            <button
                                className='myButton-yellow border-0 py-1'
                                onClick={() => setNameModal(true)}
                            >Edit Name</button>
                        </li>
                        <li>
                            <button
                                className='myButton-yellow border-0 py-1'
                                onClick={() => setRecipeFeaturesModal(true)}
                            >Recipe Features</button>
                        </li>
                        <li>
                            <button className='myButton-primary border-0 py-1'
                                onClick={() => handleAmountWeightModal("Calculate")} >Calculate</button>
                        </li>
                        <li>
                            <button className='myButton-primary border-0 py-1'
                                onClick={() => handleAmountWeightModal("Cost")}>Cost $</button>
                        </li>
                        <li>
                            <button className='myButton-purple border-0 py-1'
                                onClick={() => handleAmountWeightModal("Make Traceability")}>Traceability</button>
                        </li>
                        <li>
                            <button className='myButton-purple border-0 py-1'
                                onClick={handleAddIngredientModal}>Add Ingredient</button>
                        </li>
                    </ul></div>
                {missingIngredient && (
                    <div className="alert alert-danger alert-dismissible fade show w-100 p-2" role="alert">
                        <section className='fw-bold m-0'>Missing ingredient {missingIngredient}: <p className='fw-light mb-1'>This ingredient has not been added yet or has been deleted from your ingredients table. Please add it or delete it from your recipes or you will not be able to traceability or calculate your recipe correctly.</p></section>
                        <button type="button" className="btn-close p-3" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                )}

            </nav>
            {nameModal && (
                <NameModal
                    setNameModal={setNameModal}
                    recipe={currentRecipe}
                    setRecipe={setRecipe}
                    />
            )}
            {recipeFeaturesModal && (
                <RecipeFeaturesModal
                setRecipeFeaturesModal={setRecipeFeaturesModal}
                handleSaveFeatures={handleSaveFeatures}
                recipe={currentRecipe}
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
                    allIngredients={allIngredients}
                    setRecipe={setRecipe}
                    currentRecipe={currentRecipe}
                />
            )}
        </>
    );
};