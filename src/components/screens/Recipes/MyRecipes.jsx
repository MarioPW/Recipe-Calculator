import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useMainContext } from '../../../context/MainContext';
import { SecondaryNavbar } from '../../common/SecondaryNavbar';
import { ExportDropdown } from '../../common/ExportDropdown';
import { CustomTable } from '../../common/CustomTable';
import { formatNumber } from '../../../utilities/utils';
import { useTranslation } from 'react-i18next';

export const MyRecipes = () => {
  const { t } = useTranslation();
  const { recipes } = useMainContext();

  const sortedRecipes = useMemo(
    () => [...recipes].sort((a, b) => (a.name || '').localeCompare(b.name || '')),
    [recipes]
  );

  const exportData = {
    title: t('myRecipes.title'),
    tableData: sortedRecipes.map((item) => ({
      [t('common.name')]: item.name,
      [t('myRecipes.weightPerUnit')]: formatNumber(item.productWeight),
      [t('myRecipes.isSubRecipe')]: item.isSubRecipe ? t('common.yes') : t('common.no')
    }))
  };

  const tableData = {
    title: t('myRecipes.title'),
    tableData: sortedRecipes.map((item, index) => ({
      [t('common.name')]: (
        <Link to={`/my-recipe/${item.id}`}>
          {item.name || `${t('myRecipes.defaultRecipe')} ${index + 1}`}
        </Link>
      ),
      [t('myRecipes.weightPerUnit')]: formatNumber(item.productWeight),
      [t('myRecipes.isSubRecipe')]: item.isSubRecipe ? t('common.yes') : t('common.no')
    }))
  };

  return (
    <>
      <SecondaryNavbar
        title={t('myRecipes.title')}
        collapseButtonText={t('common.actions')}
        searchInput={{
          items: sortedRecipes,
          url: '/my-recipe'
        }}
        links={[
          { label: t('myRecipes.addNew'), url: '/my-recipe' },
          { label: t('myRecipes.requisitions'), url: '/requisitions' }
        ]}
        collapseButtonId="myRecipesNavbarCollapse"
      >
        <ExportDropdown fileGeneratorData={exportData} />
      </SecondaryNavbar>
      <div className="container p-0">
        <div className="table-responsive">
          <CustomTable {...tableData} />
        </div>
      </div>
    </>
  );
};
