import React from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../../utilities/Spinner';
import { Link } from 'react-router-dom';
import { useMainContext } from '../../../context/MainContext';
import { SearchInput } from '../../utilities/SearchInput';

export const MyIngredients = () => {
  const { t } = useTranslation();
  const { ingredients, setIngredients } = useMainContext();

  return (
    <>
      {ingredients.length > 0 ? (
        <div className="container p-0">
          <nav className="navbar navbar-expand-lg border mt-1 bg-color-main pe-2">
            <a className="navbar-brand text-light ps-2" href="#">{t('myIngredients.title')}</a>

            <button
              className="btn btn-outline-light me-2 d-lg-none"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#actionsCollapse2"
              aria-expanded="false"
              aria-controls="actionsCollapse2"
            >
              <i className="bi bi-list"></i> {t('myIngredients.actions')}
            </button>
            <SearchInput items={ingredients} url="/ingredient" />
            <div className="collapse navbar-collapse position-relative d-lg-block" id="actionsCollapse2">
              <ul className="navbar-nav position-absolute bg-color-main gap-2 w-100 p-2 m-0 d-flex justify-content-end">
                <li className="nav-item list-group-item">
                  <button 
                    className="btn btn-sm btn-outline-light d-sm-block" 
                    onClick={() => setIngredients([...ingredients].sort((a, b) => a.name.localeCompare(b.name)))}
                  >
                    {t('myIngredients.sortByName')}
                  </button>
                </li>
                <li className="nav-item list-group-item">
                  <button 
                    className="btn btn-sm btn-outline-light d-sm-block" 
                    onClick={() =>
                      setIngredients([...ingredients].sort((a, b) => {
                        const refA = a.reference ? parseInt(a.reference, 10) : Infinity;
                        const refB = b.reference ? parseInt(b.reference, 10) : Infinity;
                        return refA - refB;
                      }))
                    }
                  >
                    {t('myIngredients.sortByRef')}
                  </button>
                </li>
                <li className="nav-item list-group-item">
                  <Link className="myButton-success fw-bold d-inline-block text-center" to="/ingredient">
                    <strong className="fw-bold me-2">+</strong>{t('myIngredients.addNew')}
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          <div className="table-responsive">
            <table className="table table-light table-striped text-nowrap">
              <thead>
                <tr>
                  <th>{t('myIngredients.table.ref')}</th>
                  <th>{t('myIngredients.table.name')}</th>
                  <th>{t('myIngredients.table.stock')}</th>
                  <th>{t('myIngredients.table.unit')}</th>
                  <th>{t('myIngredients.table.brand')}</th>
                  <th>{t('myIngredients.table.supplier')}</th>
                  <th>{t('myIngredients.table.batch')}</th>
                  <th>{t('myIngredients.table.expiration')}</th>
                  <th>{t('myIngredients.table.cost')}</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {ingredients.map((ingredient) => (
                  <tr key={ingredient.FSId} className="table-striped">
                    <td>{ingredient.reference}</td>
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