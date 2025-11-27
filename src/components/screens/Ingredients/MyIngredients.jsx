import { useTranslation } from 'react-i18next';
import { Spinner } from '../../common/Spinner';
import { Link } from 'react-router-dom';
import { useMainContext } from '../../../context/MainContext';
import { SecondaryNavbar } from '../../common/SecondaryNavbar';
import { CustomTable } from '../../common/CustomTable';
import { ExportDropdown } from '../../common/ExportDropdown';

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
    title: t('myIngredients.title'),
    tableData: ingredients.map((item) => ({
      [t('myIngredients.table.ref')]: item.reference,
      [t('myIngredients.table.name')]: item.name,
      [t('myIngredients.table.unit')]: item.unitOfMeasure,
      [t('myIngredients.table.brand')]: item.brand,
      [t('myIngredients.table.supplier')]: item.supplier,
      [t('myIngredients.table.batch')]: item.batch,
      [t('myIngredients.table.expiration')]: item.expirationDate,
      [t('myIngredients.table.cost')]: `$ ${item.costPerKg}`
    })),
  };
  const tableData = {
    title: t('myIngredients.title'),
    tableData: ingredients.map((ingredient) => ({
      [t('myIngredients.table.ref')]: ingredient.reference,
      [t('myIngredients.table.name')]: (
        <Link to={`/ingredient/${ingredient.id}`}>
          {ingredient.name}
        </Link>
      ),
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
        <ExportDropdown fileGeneratorData={ingredientData} />
      </SecondaryNavbar>

      {ingredients.length > 0 ? (
        <div className="container p-0">

          <div className="table-responsive">
            <CustomTable {...tableData} className="table table-light table-striped text-nowrap" />
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
};