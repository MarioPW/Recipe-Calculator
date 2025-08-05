import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../../common/Spinner';
import { useMainContext } from '../../../context/MainContext';
import { SecondaryNavbar } from '../../common/SecondaryNavbar';
import { GenerateExelButton } from '../../common/GenerateExelButton';
import { GeneratePdfButton } from '../../common/GeneratePdfButton';
import { CustomTable } from '../../common/CustomTable';

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

  const exportData = {
    title: t('myRecipes.title'),
    tableData: recipes.map((item) => ({
      [t('common.name')]: item.name,
      [t('myRecipes.weightPerUnit')]: item.productWeight,
      [t('myRecipes.isSubRecipe')]: item.isSubRecipe ? t('common.yes') : t('common.no'),
    })),
  };
  const tableData = {
    title: t('myRecipes.title'),
    tableData: recipes.map((item, index) => ({
      [t('common.name')]: (
        <Link to={`/my-recipe/${item.id}`}>
          {item.name || `${t('myRecipes.defaultRecipe')} ${index + 1}`}
        </Link>
      ),
      [t('myRecipes.weightPerUnit')]: item.productWeight,
      [t('myRecipes.isSubRecipe')]: item.isSubRecipe ? t('common.yes') : t('common.no'),
    })),
  };
  return (
    <>
      <SecondaryNavbar
        title={t('myRecipes.title')}
        collapseButtonText={t('common.actions')}
        searchInput={
          {
            items: recipes,
            url: "/my-recipe",
            setItemsList: setRecipes
          }}
        links={[
          { label: t('myRecipes.addNew'), url: "/my-recipe" }
        ]}
        collapseButtonId="myRecipesNavbarCollapse"
      >
        <GenerateExelButton {...exportData} />
        <GeneratePdfButton {...exportData} />
      </SecondaryNavbar>
      {recipes.length > 0 ? (
        // <table className="table table-light table-hover">
        //   <thead>
        //     <tr>
        //       <th scope="col">#</th>
        //       <th scope="col">{t('myRecipes.recipeName')}</th>
        //       <th scope="col">{t('myRecipes.weightPerUnit')}</th>
        //       <th scope="col">{t('myRecipes.isSubRecipe')}</th>
        //     </tr>
        //   </thead>
        //   <tbody>
        //     {recipes.map((recipe, index) => (
        //       <tr key={index}>
        //         <th scope="row">{index + 1}</th>
        //         <td><Link to={`/my-recipe/${recipe.id}`}>{recipe.name || `${t('myRecipes.defaultRecipe')} ${index + 1}`}</Link></td>
        //         <td>{recipe.productWeight}</td>
        //         <td>{recipe.isSubRecipe ? t('common.yes') : t('common.no')}</td>
        //       </tr>
        //     ))}
        //   </tbody>
        // </table>
        <CustomTable {...tableData} className="table table-light table-hover" />
      ) : (
        <Spinner />
      )}
    </>
  );
};