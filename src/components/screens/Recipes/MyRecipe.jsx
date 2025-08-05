import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Spinner } from '../../common/Spinner';
import { RecipeNavBar } from './RecipeNavBar';
import { EditRecipeIngredient } from './recipeModals/EditRecipeIngredient';
import { RemoveIngredientModal } from './recipeModals/RemoveIngredientModal';
import { ConfirmDeleteRecipe } from './ConfirmDeleteRecipe';
import { useMainContext } from '../../../context/MainContext';
import { CustomButton } from '../../common/CustomButton';
import { CustomTable } from '../../common/CustomTable';

export const MyRecipe = () => {
  const { t } = useTranslation();
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [deleteRecipe, setDeleteRecipe] = useState(false);
  const [editIngredient, setEditIngredient] = useState(false);
  const [removeIngredient, setRemoveIngredient] = useState(false);
  const [ingredient, setIngredient] = useState();
  const { recipeService, recipes, setRecipes, recipe, setRecipe } = useMainContext();
  const [loading, setLoading] = useState(false);

  const newRecipe = {
    name: "",
    description: "",
    ingredients: [],
    productWeight: "",
    isSubRecipe: false,
    steps: [],
    imageUrl: ""
  };


  useEffect(() => {
    const loadRecipe = () => {
      try {
        const recipeFromContext = recipes.find((recipe) => recipe.id === recipeId);
        setRecipe(recipeFromContext);

      } catch (error) {
        console.error('Error loading recipe:', error);
      }
    };
    recipeId ? loadRecipe() : setRecipe(newRecipe);
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
      const nameExists = recipes.some(
        (item) => item.name === recipe.name && item.id !== recipe.id
      );

      if (nameExists) {
        alert(t("myRecipe.nameExists", { name: recipe.name }));
        return;
      }
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

          <CustomTable
          thead={[
            t("myRecipe.ingredient"),
            t("myRecipe.weight"),
            t("myRecipe.edit"),
            t("myRecipe.remove")
          ]}
          tableData={recipe.ingredients?.map((ingredient) => ({
            [t("myRecipe.ingredient")]: ingredient.name,
            [t("myRecipe.weight")]: `${ingredient.weight} ${ingredient.unitOfMeasure}`,
            [t("myRecipe.edit")]: (
              <CustomButton
                className="primary"
                onClick={() => handleEdit(ingredient)}
                label={<i className="bi bi-pen"></i>}
              />
            ),
            [t("myRecipe.remove")]: (
              <CustomButton
                className="danger"
                onClick={() => handleRemove(ingredient)}
                label={<i className="bi bi-trash"></i>}
              />
            ),
          }))}
        />
          <div className='container d-flex justify-content-end bg-light p-2 gap-2'>
            <CustomButton
              onClick={() => { navigate("/my-recipes"); setRecipe({}) }}
              className="info"
              label={t("myRecipe.goBack")}
            />

            <CustomButton
              onClick={handleSaveChanges}
              className="primary"
              label={t("myRecipe.saveChanges")}
            />

            <CustomButton
              onClick={() => setDeleteRecipe(true)}
              className="danger"
              label={t("myRecipe.delete")}
            />
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
