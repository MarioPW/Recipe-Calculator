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