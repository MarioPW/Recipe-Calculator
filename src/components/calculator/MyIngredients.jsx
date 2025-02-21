
import React from 'react'
import { Spinner } from '../../utilities/components/Spinner';
import { Link } from 'react-router-dom';
import { useMainContext } from '../../context/MainContext';
export const MyIngredients = () => {
  const { ingredients } = useMainContext();

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
                <td><Link to={`/ingredient/${ingredient.FSId}`}>{ingredient.name}</Link> </td>
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