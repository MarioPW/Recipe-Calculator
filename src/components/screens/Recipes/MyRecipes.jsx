import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../../utilities/Spinner';
import { useMainContext } from '../../../context/MainContext';
import { SearchInput } from '../../utilities/SearchInput';

export const MyRecipes = () => {
  const { t } = useTranslation();
  const { recipes, setRecipes } = useMainContext();

  useEffect(() => {
    const sortRecipes = () => {
      const sortedItems = recipes.sort((a, b) => a.name.localeCompare(b.name));
      setRecipes(sortedItems);
    };
    sortRecipes();
  }, []);

  return (
    <div>
      {recipes.length > 0 ? (
        <>
          <nav className='navbar navbar-expand-lg border mt-1 bg-color-main d-flex flex-wrap justify-content-between'>
            <a className="navbar-brand text-light ps-2" href="#">{t('myRecipes.title')}</a>
            <ul className='d-flex flex-row mb-0 gap-3 align-items-center pe-2'>
              <SearchInput items={recipes} url={'/my-recipe'} />
              <li className='nav-item list-group-item'>
                <Link className='myButton-success fw-bold' to={'/my-recipe'}>
                  <strong className='fw-bold me-2'>+</strong>{t('myRecipes.addNew')}
                </Link>
              </li>
            </ul>
          </nav>

          <table className="table table-light table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{t('myRecipes.recipeName')}</th>
                <th scope="col">{t('myRecipes.weightPerUnit')}</th>
                <th scope="col">{t('myRecipes.isSubRecipe')}</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((recipe, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td><Link to={`/my-recipe/${recipe.id}`}>{recipe.name || `${t('myRecipes.defaultRecipe')} ${index + 1}`}</Link></td>
                  <td>{recipe.productWeight}</td>
                  <td>{recipe.isSubRecipe ? t('myRecipes.yes') : t('myRecipes.no')}</td>
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
};