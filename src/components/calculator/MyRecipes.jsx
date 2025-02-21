import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Spinner } from '../../utilities/components/Spinner';
import { useMainContext } from '../../context/MainContext';

export const MyRecipes = () => {
  const { recipes, setRecipes } = useMainContext();

  useEffect(() => {
    const sortRecipes = () => {
      const sortedItems = recipes.sort((a, b) => a.name.localeCompare(b.name))
      setRecipes(sortedItems);
    };
    sortRecipes();
  }, []);

  return (
    <div className="table-responsive">
      {recipes.length > 0 ? (
        <>
        <h5 className='bg-light p-2 mb-0 border-bottom'>My Recipes</h5>
        <table className="table table-light table-hover">
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
                <td><Link to={`/my-recipe/${recipe.id}`}>{recipe.name || `Recipe ${index + 1}`}</Link></td>
                <td>{recipe.productWeight}</td>
                <td>{recipe.isSubRecipe ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
}