import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExportDropdown } from '../../../common/ExportDropdown';
import { CustomButton } from '../../../common/CustomButton';
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
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header bg-color-main text-white">
                        <h5 className="modal-title">{t("calculatedRecipeModal.title")}</h5>
                        <div className='d-flex justify-content-end align-items-center gap-2'>
                            <ExportDropdown fileGeneratorData={fileGeneratorData} className="light" />
                            <button
                                type="button"
                                className="btn-close bg-white"
                                onClick={handleConvertionsModal}
                            ></button>
                        </div>
                    </div>

                    <div className="modal-header">
                        <ul className='list-unstyled'>
                            <li className="modal-title">{`${t("calculatedRecipeModal.recipe")}: ${recipeData.name}`}</li>
                            <li>{`${t("calculatedRecipeModal.numberOfUnits")}: ${formatNumber(recipeData.amount)}`}</li>
                            <li>{`${t("calculatedRecipeModal.weightPerUnit")}: ${formatNumber(recipeData.weightPerUnit)}g`}</li>
                        </ul>
                    </div>

                    <div className="modal-body">
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
                    </div>
                    <div className="modal-footer">
                        <CustomButton
                            type="button"
                            className="secondary"
                            onClick={handleConvertionsModal}
                            label={t("calculatedRecipeModal.close")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};