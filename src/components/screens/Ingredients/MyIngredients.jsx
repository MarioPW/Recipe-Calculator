import React from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../../common/Spinner';
import { Link } from 'react-router-dom';
import { useMainContext } from '../../../context/MainContext';
import { SecondaryNavbar } from '../../common/SecondaryNavbar';
import { GenerateExelButton } from '../../common/GenerateExelButton';
import { GeneratePdfButton } from '../../common/GeneratePdfButton';
import { CustomTable } from '../../common/CustomTable';

export const MyIngredients = () => {
  const { t } = useTranslation();
  const { ingredients, setIngredients } = useMainContext();

  const sortByName = () => {
    setIngredients([...ingredients].sort((a, b) => a.name.localeCompare(b.name)));
    localStorage.setItem('ingredientsSort', 'name');
  };

  const sortByReference = () => {
    setIngredients([...ingredients].sort((a, b) => {
      const refA = a.reference ? parseInt(a.reference, 10) : Infinity;
      const refB = b.reference ? parseInt(b.reference, 10) : Infinity;
      return refA - refB;
    }));
    localStorage.setItem('ingredientsSort', 'reference');
  };

  const ingredientData = {
    tableData: ingredients.map((item) => ({
      [t('myIngredients.table.ref')]: item.reference,
      [t('myIngredients.table.name')]: item.name,
      [t('myIngredients.table.stock')]: item.stock,
      [t('myIngredients.table.unit')]: item.unitOfMeasure,
      [t('myIngredients.table.brand')]: item.brand,
      [t('myIngredients.table.supplier')]: item.supplier,
      [t('myIngredients.table.batch')]: item.batch,
      [t('myIngredients.table.expiration')]: item.expirationDate,
      [t('myIngredients.table.cost')]: item.costPerKg,
    })),
  }
  const tableData = {
    title: t('myIngredients.title'),
    tableData: ingredients.map((ingredient) => ({
      [t('myIngredients.table.ref')]: ingredient.reference,
      [t('myIngredients.table.name')]: (
        <Link to={`/ingredient/${ingredient.id}`}>
          {ingredient.name}
        </Link>
      ),
      [t('myIngredients.table.stock')]: ingredient.stock,
      [t('myIngredients.table.unit')]: ingredient.unitOfMeasure,
      [t('myIngredients.table.brand')]: ingredient.brand,
      [t('myIngredients.table.supplier')]: ingredient.supplier,
      [t('myIngredients.table.batch')]: ingredient.batch,
      [t('myIngredients.table.expiration')]: ingredient.expirationDate,
      [t('myIngredients.table.cost')]: `$ ${ingredient.costPerKg}`,
    })),
  };
  
  return (
    <>
      <SecondaryNavbar
        title={t('myIngredients.title')}
        buttons={[
          { label: t('myIngredients.sortByName'), action: sortByName },
          { label: t('myIngredients.sortByRef'), action: sortByReference }
        ]}
        links={[
          { label: t('myIngredients.addNew'), url: "/ingredient" }
        ]}
        searchInput={{ items: ingredients, url: "/ingredient", setItemsList: setIngredients }}
        collapseButtonText={t('myIngredients.actions')}
        collapseButtonId="myIngredientsNavbarCollapse"
      >
        <GenerateExelButton {...ingredientData} />
        <GeneratePdfButton {...ingredientData} />
      </SecondaryNavbar>
      
      {ingredients.length > 0 ? (
        <div className="container p-0">

          <div className="table-responsive">
            {/* <table className="table table-light table-striped text-nowrap">
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
                  <tr key={ingredient.id} className="table-striped">
                    <td>{ingredient.reference}</td>
                    <td><Link to={`/ingredient/${ingredient.id}`}>{ingredient.name}</Link></td>
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
            </table> */}
            <CustomTable {...tableData} className="table table-light table-striped text-nowrap" />
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
};