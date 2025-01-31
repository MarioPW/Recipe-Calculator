
import React from 'react'
import { useState, useEffect } from 'react';
import { IngredientRepo } from '../../ingredients/services';
import { auth, db } from '../../firebaseConfig';
import { Spinner } from '../../utilities/components/Spinner';
import { Link } from 'react-router-dom';
export const MyIngredients = () => {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const ingredientRepository = new IngredientRepo(db, auth);
        const fetchedIngredients = await ingredientRepository.getAllIngredients();
        const sortedItems = fetchedIngredients.sort((a, b) => a.name.localeCompare(b.name))
        setIngredients(sortedItems);
      } catch (error) {
        console.error('Error fetching Ingredients:', error);
      }
    };

    fetchIngredients();
  }, []);

  return (
    <>
      {ingredients.length > 0 ? (
        <table className='table table-light table-striped w-75 m-auto'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Stock</th>
              <th>U of Meassure</th>
              <th>Brand</th>
              <th>Supplier</th>
              <th>Batch</th>
              <th>Expiration Date </th>
              <th>Cost per Kg</th>
            </tr>
          </thead>
          <tbody className='table-group-divider'>
            {ingredients.map((ingredient) => (
              <tr key={ingredient.FSId} className='table-striped'>
                <td><Link to={`/Recipe-Calculator/ingredient/${ingredient.FSId}`}>{ingredient.name}</Link> </td>
                <td>{ingredient.stock}</td>
                <td>{ingredient.unitOfMeasure}</td>
                <td>{ingredient.brand}</td>
                <td>{ingredient.supplier}</td>
                <td>{ingredient.batch}</td>
                <td>{ingredient.expirationDate}</td>
                <td>$ {ingredient.costPerKg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <Spinner />
      )}
    </>
  );
};