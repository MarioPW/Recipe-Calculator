import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExportDropdown } from '../../../common/ExportDropdown';
import { CustomButton } from '../../../common/CustomButton';
import { CustomModal } from '../../../common/CustomModal';
import { formatNumber } from '../../../../utilities/utils';

export const CalculatedRecipeModal = ({ recipeData, convertions, handleConvertionsModal }) => {
    const { t } = useTranslation();

    const fileGeneratorData = {
        title: recipeData.name,
        tableData: convertions.map((ingredient) => ({
            [t("calculatedRecipeModal.ingredient")]: ingredient.name,
            [t("calculatedRecipeModal.weight")]: formatNumber(ingredient.conversion) + ' ' + ingredient.unitOfMeasure,
        })),
        summary: {
            [t("calculatedRecipeModal.recipe")]: recipeData.name,
            [t("calculatedRecipeModal.numberOfUnits")]: formatNumber(recipeData.amount),
            [t("calculatedRecipeModal.weightPerUnit")]: `${formatNumber(recipeData.weightPerUnit)} g`,
        },
    };

    return (
        <CustomModal
            id="calculated-recipe-modal"
            title={t("calculatedRecipeModal.title")}
            onClose={handleConvertionsModal}
            headerActions={<ExportDropdown fileGeneratorData={fileGeneratorData} className="light" />}
            footer={
                <CustomButton
                    type="button"
                    className="secondary"
                    onClick={handleConvertionsModal}
                    label={t("calculatedRecipeModal.close")}
                />
            }
        >
            <ul className='list-unstyled'>
                <li className="modal-title">{`${t("calculatedRecipeModal.recipe")}: ${recipeData.name}`}</li>
                <li>{`${t("calculatedRecipeModal.numberOfUnits")}: ${formatNumber(recipeData.amount)}`}</li>
                <li>{`${t("calculatedRecipeModal.weightPerUnit")}: ${formatNumber(recipeData.weightPerUnit)}g`}</li>
            </ul>

            <table className="table table-light table-striped table-bordered table-hover mw-25">
                <thead>
                    <tr>
                        <th scope="col">{t("calculatedRecipeModal.ingredient")}</th>
                        <th scope="col">{t("calculatedRecipeModal.weight")}</th>
                    </tr>
                </thead>
                <tbody>
                    {convertions && convertions.map((ingredient, index) => (
                        <tr key={index}>
                            <td>{ingredient.name}</td>
                            <td>{formatNumber(ingredient.conversion)} {ingredient.unitOfMeasure}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </CustomModal>
    );
};
