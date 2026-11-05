import { Link } from 'react-router-dom';
import { Spinner } from '../../common/Spinner';
import { SecondaryNavbar } from '../../common/SecondaryNavbar';
import { ExportDropdown } from '../../common/ExportDropdown';
import { CustomTable } from '../../common/CustomTable';
import { CustomButton } from '../../common/CustomButton';
import { formatNumber } from '../../../utilities/utils';
import { useRecipeRequisition } from '../../../hooks/useRecipeRequisition';

export const Requisitions = () => {
  const {
    t,
    entries,
    requisition,
    totals,
    calculatedRecipes,
    isLoading,
    isResultsView,
    error,
    calculate,
    backToInputs,
    updateEntry,
    selectOnlyRecipes,
    selectOnlySubRecipes,
    requisitionExportData
  } = useRecipeRequisition();

  if (isLoading) return <Spinner />;

  const recipesTableData = {
    tableData: entries.map((entry, index) => ({
      [t('common.name')]: (
        <Link to={`/my-recipe/${entry.id}`}>
          {entry.name || `${t('myRecipes.defaultRecipe')} ${index + 1}`}
        </Link>
      ),
      [t('myRecipes.products')]: (
        <input
          type="number"
          min="0"
          step="1"
          className="form-control form-control-sm"
          value={entry.quantity}
          onChange={(e) => updateEntry(entry.id, 'quantity', e.target.value)}
          placeholder="0"
          aria-label={`${t('myRecipes.products')} ${entry.name}`}
        />
      ),
      [t('myRecipes.weightPerUnitInput')]: (
        <input
          type="number"
          min="0"
          step="0.1"
          className="form-control form-control-sm"
          value={entry.weightPerUnit}
          onChange={(e) => updateEntry(entry.id, 'weightPerUnit', e.target.value)}
          placeholder="0"
          aria-label={`${t('myRecipes.weightPerUnitInput')} ${entry.name}`}
        />
      ),
      [t('myRecipes.requiredWeight')]: `${formatNumber(entry.requiredWeight)} g`
    }))
  };

  const requisitionTableData = {
    tableData: requisition.map((item) => ({
      [t('myRecipes.ingredient')]: item.name,
      [t('myRecipes.requiredQuantity')]: `${formatNumber(item.quantity)} ${item.unitOfMeasure}`.trim()
    }))
  };

  if (isResultsView) {
    return (
      <>
        <SecondaryNavbar
          title={t('myRecipes.requisitionTitle')}
          buttons={[
            { label: t('myRecipes.back'), action: backToInputs }
          ]}
          links={[
            { label: t('myRecipes.backToRecipes'), url: '/my-recipes' }
          ]}
          collapseButtonId="requisitionResultsNavbarCollapse"
        >
          <ExportDropdown fileGeneratorData={requisitionExportData} />
        </SecondaryNavbar>

        <div className="container p-0">
          <div className="table-responsive">
            <CustomTable {...requisitionTableData} />
          </div>
          <div className="d-flex flex-wrap gap-3 justify-content-end align-items-center bg-light border p-2">
            {calculatedRecipes.length > 0 && (
              <span className="me-auto">
                <strong>{t('myRecipes.usedRecipes')}:</strong>{' '}
                {calculatedRecipes.map((item, i) => (
                  <span key={item.id || i}>
                    {`${item.name}: ${formatNumber(item.quantity)}`}
                    {i < calculatedRecipes.length - 1 && <span className="text-muted mx-1">|</span>}
                  </span>
                ))}
              </span>
            )}
            <span>{`${t('myRecipes.totalProducts')}: ${formatNumber(totals.products)}`}</span>
            <CustomButton
              className="secondary"
              onClick={backToInputs}
              label={t('myRecipes.back')}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SecondaryNavbar
        title={t('myRecipes.requisitionTitle')}
        buttons={[
          { label: t('myRecipes.onlyRecipes'), action: selectOnlyRecipes },
          { label: t('myRecipes.onlySubRecipes'), action: selectOnlySubRecipes }
        ]}
        links={[
          { label: t('myRecipes.backToRecipes'), url: '/my-recipes' }
        ]}
        collapseButtonId="requisitionsNavbarCollapse"
      />

      {error && (
        <p className="alert alert-warning m-0">{t(error)}</p>
      )}

      <div className="container p-0">
        <div className="table-responsive">
          <CustomTable {...recipesTableData} />
        </div>
        <div className="d-flex justify-content-end bg-light border p-2">
          <CustomButton
            className="primary"
            onClick={calculate}
            label={t('myRecipes.calculate')}
          />
        </div>
      </div>
    </>
  );
};
