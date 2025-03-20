import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Spinner } from '../../utilities/Spinner';
import { RecipeNavBar } from './RecipeNavBar';
import { EditRecipeIngredient } from './recipeModals/EditRecipeIngredient';
import { RemoveIngredientModal } from './recipeModals/RemoveIngredientModal';
import { ConfirmDeleteRecipe } from './ConfirmDeleteRecipe';
import { useMainContext } from '../../../context/MainContext';

export const MyRecipe = () => {
  const { recipeId } = useParams()
  const navigate = useNavigate();
  const [deleteRecipe, setDeleteRecipe] = useState(false)
  const [editIngredient, setEditIngredient] = useState(false)
  const [removeIngredient, setRemoveIngredient] = useState(false)
  const [ingredient, setIngreident] = useState({})
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
    setIngreident(ingredient)
    setEditIngredient(!editIngredient)
  }

  const handleRemove = (ingredient) => {
    setIngreident(ingredient)
    setRemoveIngredient(!removeIngredient)
  }

  const handleSaveChanges = async () => {

    if (recipeId) {
      setLoading(true)
      recipeService.update(recipe, recipeId).then(() => setLoading(false))
      setRecipes(recipes.map((r) => (r.id === recipeId ? { ...r, ...recipe } : r)))

    } else {
      setLoading(true)
      const response = await recipeService.saveRecipe(recipe).then(() => setLoading(false))
      setRecipes([...recipes, { ...recipe, id: response.id }])
      navigate("/my-recipe/" + response.id)
    }
  }

  const handleDelete = async () => {
    if (!recipeId) {
      alert("You have not saved this recipe yet");
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
      alert("An error occurred while deleting the recipe.");
    }
  }

  return (
    <>
      {recipe ? (
        <>
          <RecipeNavBar currentRecipe={recipe} setRecipe={setRecipe} />
          {loading && <p className="alert alert-warning m-0">Updating...</p>}
          <table className="table table-light table-striped table-bordered table-hover mw-25 mb-0">
            <thead>
              <tr>
                <th scope="col">Ingredient</th>
                <th scope="col">Weight</th>
                <th scope="col">Edit</th>
                <th scope="col">Remove</th>

              </tr>
            </thead>
            <tbody>
              {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
                <tr key={index}>
                  <td>{ingredient.name}</td>
                  <td>{ingredient.weight}</td>
                  <td><button className='myButton-yellow  border-0' onClick={() => handleEdit(ingredient)}><i className="bi bi-pen"></i></button></td>
                  <td><button className='myButton-danger  border-0' onClick={() => handleRemove(ingredient)}><i className="bi bi-trash"></i></button></td>
                </tr>
              ))}

            </tbody>
          </table>
          <div className='container d-flex justify-content-end bg-light p-2 gap-2'>
            {/* <Link to="/my-recipes" className='myButton-success fw-bold py-1'>Go Back</Link> */}
            <button onClick={() => { navigate("/my-recipes"); setRecipe({}) }} className='myButton-success fw-bold py-1 border-0'>Go Back</button>
            <button className='myButton-primary border-0 py-1' onClick={handleSaveChanges}>Save Changes</button>
            <button className='myButton-danger border-0 py-1' onClick={() => setDeleteRecipe(true)}>Delete</button>
          </div>
        </>
      ) : (
        <Spinner />
      )}
      {editIngredient && <EditRecipeIngredient
        ingredient={ingredient}
        recipe={recipe}
        setRecipe={setRecipe}
        setEditIngredient={setEditIngredient}
      />}
      {removeIngredient && <RemoveIngredientModal
        ingredient={ingredient}
        recipe={recipe}
        setRecipe={setRecipe}
        removeIngredient={removeIngredient}
        setRemoveIngredient={setRemoveIngredient}
      />}
      {deleteRecipe && <ConfirmDeleteRecipe
        recipe={recipe}
        setDeleteRecipe={setDeleteRecipe}
        handleDelete={handleDelete} />}
    </>
  )
}
