import React from 'react'
import { useState, useEffect } from 'react'
import { auth, db } from '../../../firebaseConfig';
import { RecipeRepo } from '../../../recipes/sevices';
import { Spinner } from '../../../utilities/components/Spinner';
import { FireRecipeModal } from './FireRecipeModal';
import { useMainContext } from '../../../context/MainContext';
export const Inventory = () => {
    const { ingredients , setIngredients} = useMainContext();
    const [ recipes, setRecipes ] = useState([]);
    const [ fireRecipeModal, setFireRecipeModal ] = useState(false);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const recipeRepository = new RecipeRepo(db, auth);
                const fetchedRecipes = await recipeRepository.getAllRecipes();
                const sortedItems = fetchedRecipes.sort((a, b) => a.name.localeCompare(b.name))
                setRecipes(sortedItems);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        }

        fetchRecipes();
    }, [])


  return (
    <div>
      {ingredients.length > 0 ? (
        <div className='container w-75 m-auto max-vh-75'>
        <table className='table table-light table-striped mb-0'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody className='table-group-divider'>
            {ingredients.map((ingredient) => (
              <tr key={ingredient.FSId} className='table-striped'>
                <td>{ingredient.name}</td>
                <td>{ingredient.stock || 0} {ingredient.unitOfMeasure}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='container d-flex justify-content-end bg-light p-2 gap-2'>
            <button className='myButton-success border-0 py-1 fw-bold' onClick={() => setFireRecipeModal(true)}>Fire Recipe</button>
            <button className='myButton-purple border-0 py-1 fw-bold'>Update Ingredients Stock</button>
            <button className='myButton-primary border-0 py-1' >Save Changes</button>
            <button className='myButton-danger border-0 py-1' >Delete</button>
          </div>
        </div>
      ) : (
        <Spinner />
      )}
      {fireRecipeModal && <FireRecipeModal
        setFireRecipeModal={setFireRecipeModal}
        recipes={recipes}
        ingredients={ingredients} setIngredients={setIngredients} />}
    </div>
  )
}
