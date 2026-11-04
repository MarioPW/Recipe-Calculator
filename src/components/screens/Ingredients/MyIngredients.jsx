import { Spinner } from '../../common/Spinner';
import { Link } from 'react-router-dom';
import { SecondaryNavbar } from '../../common/SecondaryNavbar';
import { CustomTable } from '../../common/CustomTable';
import { ExportDropdown } from '../../common/ExportDropdown';
import { useIngredients } from './useIngredients';

export const MyIngredients = () => {
  const {
    t,
    ingredients,
    setIngredients,
    defaultFiles,
    loadDefaultIngredients,
    sortByName,
    sortByReference,
    formatNumber,
  } = useIngredients();

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
      [t('myIngredients.table.cost')]: `$ ${formatNumber(item.costPerKg)}`
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
      [t('myIngredients.table.cost')]: `$ ${formatNumber(ingredient.costPerKg)}`,
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
        <div className="dropdown">
          <button
            type="button"
            className="btn btn-sm btn-outline-light dropdown-toggle"
            id="loadDefaultsDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ fontSize: '0.75rem' }}
          >
            <i className="bi bi-grid-3x3-gap me-1"></i>
            {t('myIngredients.loadDefaults') || 'Sets'}
          </button>
          <ul className="dropdown-menu" aria-labelledby="loadDefaultsDropdown">
            {defaultFiles.map((df) => (
              <li key={df.key}>
                <button className="dropdown-item" onClick={() => loadDefaultIngredients(df.file)}>
                  {df.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
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