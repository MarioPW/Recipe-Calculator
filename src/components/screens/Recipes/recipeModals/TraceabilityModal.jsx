import React from "react";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";
import { GeneratePdfButton } from "../../../utilities/GeneratePdfButton";

export const TraceabilityModal = ({ handleTraceabilityModal, traceability }) => {
    const { t } = useTranslation();

    if (!traceability) return null;

    const generateExcel = () => {
        const wsData = [
            [t("traceabilityModal.name"), traceability.name],
            [t("traceabilityModal.weightPerUnit"), traceability.weightPerUnit],
            [t("traceabilityModal.amount"), traceability.amount],
            [],
            [t("traceabilityModal.ingredients")],
            [t("traceabilityModal.name"), t("traceabilityModal.batch"), t("traceabilityModal.expirationDate"), t("traceabilityModal.calculatedProportion")]
        ];
        traceability.ingredients.forEach(ingredient => {
            wsData.push([
                ingredient.name,
                ingredient.batch || "?",
                ingredient.expirationDate || "N/A",
                ingredient.calculatedProportion ? ingredient.calculatedProportion + " " + (ingredient.unitOfMeasure || "") : "N/A"
            ]);
        });
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, "Traceability");

        XLSX.writeFile(wb, `Traceability_${new Date().toLocaleDateString()}.xlsx`);
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
                            <GeneratePdfButton
                                label={t("traceabilityModal.downloadPDF")}
                                title={t("traceabilityModal.title")}
                                tableData={traceability.ingredients.map((item) => ({
                                    [t("traceabilityModal.ref")]: item.reference,
                                    [t("traceabilityModal.name")]: item.name,
                                    [t("traceabilityModal.batch")]: item.batch,
                                    [t("traceabilityModal.expirationDate")]: item.expirationDate,
                                    [t("traceabilityModal.calculatedProportion")]: item.calculatedProportion
                                }))}
                                summary={{
                                    [t("traceabilityModal.name")]: traceability.name,
                                    [t("traceabilityModal.weightPerUnit")]: traceability.weightPerUnit,
                                    [t("traceabilityModal.amount")]: traceability.amount
                                }}
                            />
                            <button type="button" className="btn btn-sm btn-outline-light" onClick={generateExcel}>
                                <i className="bi bi-download me-1"></i> {t("traceabilityModal.downloadExcel")}
                            </button>
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
                                        <th className="text-nowrap">{t("traceabilityModal.calculatedProportion")}</th>
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