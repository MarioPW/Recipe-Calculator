import React from "react";
import { useTranslation } from "react-i18next";
import { GeneratePdfButton } from "../../../common/GeneratePdfButton";
import { GenerateExelButton } from "../../../common/GenerateExelButton";

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
          [t("traceabilityModal.calculatedProportion")]: `${item.calculatedProportion || 0} ${item.unitOfMeasure || ""}`,
        })),
        summary: {
          [t("traceabilityModal.name")]: traceability.name,
          [t("traceabilityModal.weightPerUnit")]: `${traceability.weightPerUnit} g`,
          [t("traceabilityModal.amount")]: traceability.amount
        }
      };

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)", transition: "opacity 0.3s ease" }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header d-flex justify-content-between align-items-center bg-color-main text-white">
                        <div className="d-flex align-items-center">
                            <h5 className="modal-title m-0">{t("traceabilityModal.title")}</h5>
                        </div>

                        <div className="d-flex flex-row gap-2 ms-auto">
                            <GeneratePdfButton {...fileGeneratorData} />
                            <GenerateExelButton {...fileGeneratorData} />
                        </div>

                        <button type="button" className="btn-close ms-2 bg-white" onClick={handleTraceabilityModal}></button>
                    </div>
                    <div className="modal-body">
                        <div>
                            <p className="m-1 border-bottom"><strong className="fw-bold">{t("traceabilityModal.name")}: </strong>{traceability.name}</p>
                            <p className="m-1 border-bottom"><strong className="fw-bold">{t("traceabilityModal.weightPerUnit")}: </strong>{traceability.weightPerUnit}</p>
                            <p className="m-1 border-bottom"><strong className="fw-bold">{t("traceabilityModal.amount")}: </strong>{traceability.amount}</p>
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
                                        <th className="text-nowrap">{t("costModal.requiredQuantity")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {traceability.ingredients.map((ingredient, index) => (
                                        <tr key={index}>
                                            <td className="text-nowrap">{ingredient.reference}</td>
                                            <td className="text-nowrap">{ingredient.name}</td>
                                            <td className="text-nowrap">{ingredient.batch || "?"}</td>
                                            <td className="text-nowrap">{ingredient.expirationDate || "N/A"}</td>
                                            <td className="text-nowrap">{ingredient.calculatedProportion ? ingredient.calculatedProportion + " " + (ingredient.unitOfMeasure || "") : "N/A"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="myButton-primary border-0 py-2" onClick={handleTraceabilityModal}>
                            {t("traceabilityModal.close")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};