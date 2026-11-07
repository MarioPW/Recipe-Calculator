import React from "react";
import { useTranslation } from "react-i18next";
import { ExportDropdown } from "../../../common/ExportDropdown";
import { CustomButton } from "../../../common/CustomButton";
import { CustomModal } from "../../../common/CustomModal";
import { formatNumber } from "../../../../utilities/utils";

export const TraceabilityModal = ({ handleTraceabilityModal, traceability }) => {
    const { t } = useTranslation();

    if (!traceability) return null;

    const fileGeneratorData = {

        title: t("traceabilityModal.title"),
        tableData: traceability.ingredients.map((item) => ({
            [t("traceabilityModal.ref")]: item.reference,
            [t("traceabilityModal.name")]: item.name,
            [t("traceabilityModal.batch")]: item.batch,
            [t("traceabilityModal.expirationDate")]: item.expirationDate,
            [t("traceabilityModal.requiredQuantity")]: `${formatNumber(item.calculatedProportion || 0)} ${item.unitOfMeasure || ""}`,
        })),
        summary: {
            [t("traceabilityModal.name")]: traceability.name,
            [t("traceabilityModal.weightPerUnit")]: formatNumber(traceability.weightPerUnit),
            [t("traceabilityModal.amount")]: formatNumber(traceability.amount)
        }
    };

    return (
        <CustomModal
            id="traceability-modal"
            title={t("traceabilityModal.title")}
            onClose={handleTraceabilityModal}
            size="modal-lg"
            centered
            headerActions={<ExportDropdown fileGeneratorData={fileGeneratorData} />}
            footer={
                <CustomButton
                    type="button"
                    className="secondary"
                    onClick={handleTraceabilityModal}
                    label={t("traceabilityModal.close")}
                />
            }
        >
            <div>
                <p className="m-1 border-bottom"><strong className="fw-bold">{t("traceabilityModal.name")}: </strong>{traceability.name}</p>
                <p className="m-1 border-bottom"><strong className="fw-bold">{t("traceabilityModal.weightPerUnit")}: </strong>{formatNumber(traceability.weightPerUnit)}</p>
                <p className="m-1 border-bottom"><strong className="fw-bold">{t("traceabilityModal.amount")}: </strong>{formatNumber(traceability.amount)}</p>
            </div>
            <h5 className="mt-4 mb-3">{t("traceabilityModal.ingredients")}:</h5>
            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="bg-color-main text-white">
                        <tr>
                            <th className="text-nowrap">{t("traceabilityModal.ref")}</th>
                            <th className="text-nowrap">{t("traceabilityModal.name")}</th>
                            <th className="text-nowrap">{t("traceabilityModal.batch")}</th>
                            <th className="text-nowrap">{t("traceabilityModal.expirationDate")}</th>
                            <th className="text-nowrap">{t("traceabilityModal.requiredQuantity")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {traceability.ingredients.map((ingredient, index) => (
                            <tr key={index}>
                                <td className="text-nowrap">{ingredient.reference}</td>
                                <td className="text-nowrap">{ingredient.name}</td>
                                <td className="text-nowrap">{ingredient.batch || "?"}</td>
                                <td className="text-nowrap">{ingredient.expirationDate || "N/A"}</td>
                                <td className="text-nowrap">{ingredient.calculatedProportion ? formatNumber(ingredient.calculatedProportion) + " " + (ingredient.unitOfMeasure || "") : "N/A"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </CustomModal>
    );
};
