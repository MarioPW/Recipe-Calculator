import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../../utilities/Spinner';
import { useMainContext } from '../../../context/MainContext';
import { SecondaryNavbar } from '../../utilities/SecondaryNavbar';

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
    <>
      <SecondaryNavbar
        title={t('myRecipes.title')}
        collapseButtonText={t('myRecipes.actions')}
        searchInput={
          {
            items: recipes,
            url: "/my-recipe",
            setItemsList: setRecipes
          }}
        links={[
          { label: t('myRecipes.addNew'), url: "/my-recipe" }
        ]}
      />
      {recipes.length > 0 ? (
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
      ) : (
        <Spinner />
      )}
    </>
  );
};