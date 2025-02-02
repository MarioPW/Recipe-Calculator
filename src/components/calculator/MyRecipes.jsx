import React, { useState, useEffect } from 'react';
import { RecipeRepo } from '../../recipes/sevices';
import { auth, db } from '../../firebaseConfig';
import { Link } from 'react-router-dom';
import { Spinner } from '../../utilities/components/Spinner';

export const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);

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
    };

    fetchRecipes();
  }, []);

  return (
    <div className="table-responsive">
      {recipes.length > 0 ? (
        <table className="table table-light table-bordered table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Recipe Name</th>
              <th scope="col">Weight per unit</th>
              <th scope="col">Is Subrecipe</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td><Link to={`/Recipe-Calculator/my-recipe/${recipe.id}`}>{recipe.name || `Recipe ${index + 1}`}</Link></td>
                <td>{recipe.productWeight}</td>
                <td>{recipe.isSubRecipe ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <Spinner />
      )}
    </div>
  );
}