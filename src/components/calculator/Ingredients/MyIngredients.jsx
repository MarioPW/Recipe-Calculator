
import React, { useState } from 'react';
import { Spinner } from '../../utilities/Spinner';
import { Link } from 'react-router-dom';
import { useMainContext } from '../../../context/MainContext';
import { SearchInput } from '../../utilities/SearchInput';

export const MyIngredients = () => {
  const { ingredients } = useMainContext();
  const [search, setSearch] = useState('');
  const [filteredIngredients, setFilteredIngredients] = useState([]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);

    if (query.trim() === '') {
      setFilteredIngredients([]);
    } else {
      const filtered = ingredients.filter((ingredient) =>
        ingredient.name.toLowerCase().includes(query)
      );
      setFilteredIngredients(filtered);
    }
  };

  return (
    <>
      {ingredients.length > 0 ? (
       <div className="container p-0">
       <nav className="navbar bg-light border-bottom p-2 my-1 d-flex flex-wrap justify-content-between align-items-center">
         <h5 className="mb-0 flex-grow-1">My Ingredients</h5>
         <ul className="d-flex flex-wrap mb-0 gap-2 justify-content-center">
           <li className="nav-item list-group-item">
             <Link className="myButton-success fw-bold d-inline-block text-center" to="/ingredient">
               <strong className="fw-bold me-2">+</strong>Add New
             </Link>
           </li>
           <li className="d-inline-block">
             <SearchInput items={ingredients} url="/ingredient" />
           </li>
         </ul>
       </nav>
     
       <div className="table-responsive">
         <table className="table table-light table-striped">
           <thead>
             <tr>
               <th>Name</th>
               <th>Stock</th>
               <th>U of Measure</th>
               <th>Brand</th>
               <th>Supplier</th>
               <th>Batch</th>
               <th>Expiration Date</th>
               <th>Cost per Kg</th>
             </tr>
           </thead>
           <tbody className="table-group-divider">
             {ingredients.map((ingredient) => (
               <tr key={ingredient.FSId} className="table-striped">
                 <td><Link to={`/ingredient/${ingredient.FSId}`}>{ingredient.name}</Link></td>
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
       </div>
     </div>
      ) : (
        <Spinner />
      )}
    </>
  );
};