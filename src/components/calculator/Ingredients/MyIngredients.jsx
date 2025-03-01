
import React, { useState } from 'react';
import { Spinner } from '../../../utilities/components/Spinner';
import { Link } from 'react-router-dom';
import { useMainContext } from '../../../context/MainContext';

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
        <div className='w-75 m-auto'>
          <nav className='navbar bg-light border-bottom p-2 my-1 d-flex justify-content-between'>
            <h3 className='fs-5 mb-0'>My Ingredients</h3>
            <ul className='d-flex flex-row mb-0 gap-3'>
              <li className='nav-item list-group-item'>
                <Link className='myButton-success fw-bold' to={'/ingredient'}>
                  <strong className='fw-bold me-2'>+</strong>Add New
                </Link>
              </li>
              <div className="position-relative d-flex align-items-center">
              <i className="bi bi-search position-absolute ms-2 text-muted"></i>
                <input
                  className="form-control"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={search}
                  onChange={handleSearch}
                  style={{ paddingLeft: '2rem' }}
                />
                {filteredIngredients.length > 0 && (
                  <ul 
                    className='list-group position-absolute w-100 mt-1 shadow-sm bg-white border rounded'
                    style={{ zIndex: 1000, top: '100%' }}
                  >
                    {filteredIngredients.map((ingredient) => (
                      <li 
                        key={ingredient.id} 
                        className='list-group-item list-group-item-action'
                        onClick={() => setSearch('')} // Opcional: limpiar búsqueda al seleccionar
                      >
                        <Link to={`/ingredient/${ingredient.FSId}`} className="text-decoration-none text-dark">
                          {ingredient.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </ul>
          </nav>
          <table className='table table-light table-striped'>
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
      ) : (
        <Spinner />
      )}
    </>
  );
};