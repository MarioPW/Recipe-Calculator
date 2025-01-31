import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate , useParams } from 'react-router-dom'
import { RecipeRepo } from '../../recipes/sevices';
import { auth, db } from '../../firebaseConfig';
import { Spinner } from '../../utilities/components/Spinner';
import { RecipeNavBar } from './RecipeNavBar';
import { EditRecipeIngredient } from './modals/EditRecipeIngredient';
import { RemoveIngredientModal } from './modals/RemoveIngredientModal';
import { ConfirmDeleteRecipe } from './Recipes/ConfirmDeleteRecipe';

export const MyRecipe = () => {
  const { recipeId } = useParams()
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    name: 'New Recipe',
    ingredients: [{
      name: 'Remove this Field',
      weight: 0,
      unitOfMeasure: '',
      id: ''
    }],
    userId: ''
  })
  const [deleteRecipe, setDeleteRecipe] = useState(false)
  const [editIngredient, setEditIngredient] = useState(false)
  const [removeIngredient, setRemoveIngredient] = useState(false)
  const [ingredient, setIngreident] = useState({})
  const recipeRepo = new RecipeRepo(db, auth)

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await recipeRepo.getRecipeById(recipeId);
        setRecipe(response);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }
    };
    recipeId !== "new" && fetchRecipe();
  }, [recipeId]);
  const handleEdit = (ingredient) => {
    setIngreident(ingredient)
    setEditIngredient(!editIngredient)
  }

  const handleRemove = (ingredient) => {
    setIngreident(ingredient)
    setRemoveIngredient(!removeIngredient)
  }

  const handleSaveChanges = async () => {
    if (recipeId !== "new"){
      recipeRepo.update(recipe.ingredients, recipeId, recipe.name)
    } else {
      const response = await recipeRepo.saveRecipe(recipe)
      navigate("/Recipe-Calculator/my-recipe/" + response.id)
    }
  }

  const handleDelete = () => {
    recipeId !== "new" ? recipeRepo.delete(recipeId).then(() => setDeleteRecipe(!deleteRecipe)) : alert ("You have not saved this recipe yet")
    setDeleteRecipe(!deleteRecipe)
    navigate("/Recipe-Calculator/my-recipes")
  }

  return (
    <div>
      {recipe.name !== 'New Recipe' ? (
        <div className="container">
          <RecipeNavBar currentRecipe={recipe} setRecipe={setRecipe} />
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
            <Link to="/Recipe-Calculator/my-recipes" className='myButton-success fw-bold py-1'>Go Back</Link>
            <button className='myButton-primary border-0 py-1' onClick={handleSaveChanges}>Save Changes</button>
            <button className='myButton-danger border-0 py-1' onClick={() => setDeleteRecipe (true)}>Delete</button>
          </div>
        </div>
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
      handleDelete={handleDelete}/>}
    </div>
  )
}
