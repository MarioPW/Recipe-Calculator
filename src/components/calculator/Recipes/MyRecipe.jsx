import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Spinner } from '../../utilities/Spinner';
import { RecipeNavBar } from './RecipeNavBar';
import { EditRecipeIngredient } from './recipeModals/EditRecipeIngredient';
import { RemoveIngredientModal } from './recipeModals/RemoveIngredientModal';
import { ConfirmDeleteRecipe } from './ConfirmDeleteRecipe';
import { useMainContext } from '../../../context/MainContext';

export const MyRecipe = () => {
  const { t } = useTranslation();
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [deleteRecipe, setDeleteRecipe] = useState(false);
  const [editIngredient, setEditIngredient] = useState(false);
  const [removeIngredient, setRemoveIngredient] = useState(false);
  const [ingredient, setIngredient] = useState({});
  const { recipeService, recipes, setRecipes, recipe, setRecipe } = useMainContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadRecipe = () => {
      try {
        const currentRecipe = recipes.find((recipe) => recipe.id === recipeId);
        setRecipe(currentRecipe);
      } catch (error) {
        console.error('Error loading recipe:', error);
      }
    };
    recipeId && loadRecipe();
  }, [recipeId, recipes]);

  const handleEdit = (ingredient) => {
    setIngredient(ingredient);
    setEditIngredient(!editIngredient);
  };

  const handleRemove = (ingredient) => {
    setIngredient(ingredient);
    setRemoveIngredient(!removeIngredient);
  };

  const handleSaveChanges = async () => {
    setLoading(true);

    if (recipeId) {
        await recipeService.update(recipe, recipeId);
        setRecipes(recipes.map((r) => (r.id === recipeId ? { ...r, ...recipe } : r)));
    } else {
        const response = await recipeService.saveRecipe(recipe);

        if (response) {
            setRecipes([...recipes, { ...recipe, id: response }]);
            navigate("/my-recipe/" + response);
        }
    }

    setLoading(false);
};

  const handleDelete = async () => {
    if (!recipeId) {
      alert(t("myRecipe.notSaved"));
      return;
    }

    try {
      await recipeService.delete(recipeId);
      const updatedRecipes = await recipeService.getAllRecipes();
      setRecipes(updatedRecipes);
      setDeleteRecipe(!deleteRecipe);
      navigate("/my-recipes");
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert(t("myRecipe.deleteError"));
    }
  };

  return (
    <>
      {recipe ? (
        <>
          <RecipeNavBar currentRecipe={recipe} setRecipe={setRecipe} />
          {loading && <p className="alert alert-warning m-0">{t("myRecipe.updating")}</p>}
          <table className="table table-light table-striped table-bordered table-hover mw-25 mb-0">
            <thead>
              <tr>
                <th scope="col">{t("myRecipe.ingredient")}</th>
                <th scope="col">{t("myRecipe.weight")}</th>
                <th scope="col">{t("myRecipe.edit")}</th>
                <th scope="col">{t("myRecipe.remove")}</th>
              </tr>
            </thead>
            <tbody>
              {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
                <tr key={index}>
                  <td>{ingredient.name}</td>
                  <td>{ingredient.weight}</td>
                  <td><button className='myButton-yellow border-0' onClick={() => handleEdit(ingredient)}><i className="bi bi-pen"></i></button></td>
                  <td><button className='myButton-danger border-0' onClick={() => handleRemove(ingredient)}><i className="bi bi-trash"></i></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='container d-flex justify-content-end bg-light p-2 gap-2'>
            <button onClick={() => { navigate("/my-recipes"); setRecipe({}) }} className='myButton-success fw-bold py-1 border-0'>{t("myRecipe.goBack")}</button>
            <button className='myButton-primary border-0 py-1' onClick={handleSaveChanges}>{t("myRecipe.saveChanges")}</button>
            <button className='myButton-danger border-0 py-1' onClick={() => setDeleteRecipe(true)}>{t("myRecipe.delete")}</button>
          </div>
        </>
      ) : (
        <Spinner />
      )}
      {editIngredient && <EditRecipeIngredient ingredient={ingredient} recipe={recipe} setRecipe={setRecipe} setEditIngredient={setEditIngredient} />}
      {removeIngredient && <RemoveIngredientModal ingredient={ingredient} recipe={recipe} setRecipe={setRecipe} removeIngredient={removeIngredient} setRemoveIngredient={setRemoveIngredient} />}
      {deleteRecipe && <ConfirmDeleteRecipe recipe={recipe} setDeleteRecipe={setDeleteRecipe} handleDelete={handleDelete} />}
    </>
  );
};
