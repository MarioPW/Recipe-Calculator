import React from "react";
import { useTranslation } from "react-i18next";
import { ExportDropdown } from '../../../common/ExportDropdown';
import { CustomButton } from "../../../common/CustomButton";
import { formatNumber } from "../../../../utilities/utils";


export const CostModal = ({ handleCostModal, recipeCosts }) => {
  const { t } = useTranslation();

  if (!recipeCosts) return null;

  const fileGeneratorData = {
    title: t("costModal.title"),
    tableData: recipeCosts.ingredients.map((item) => ({
      [t("costModal.ingredients")]: item.name,
      [t("costModal.cost")]: `$ ${formatNumber(item.cost)}`,
      [t("costModal.percentage")]: `${item.percentage || "N/A"} %`,
      [t("costModal.requiredQuantity")]: `${formatNumber(item.requiredQuantity)} ${item.unitOfMeasure || "g"}`,
    })),
    summary: {
      [t("costModal.name")]: recipeCosts.name,
      [t("costModal.costPerUnit")]: `$ ${formatNumber(recipeCosts.costPerUnit)}`,
      [t("costModal.totalCost")]: `$ ${formatNumber(recipeCosts.totalCost)}`,
      [t("traceabilityModal.amount")]: formatNumber(recipeCosts.amount),
      [t("costModal.weightPerUnit")]: `${formatNumber(recipeCosts.weightPerUnit)} g`,
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ background: "rgba(0,0,0,0.5)", transition: "opacity 0.3s ease" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header d-flex justify-content-between align-items-center bg-color-main text-white">
            <div className="d-flex align-items-center">
              <h5 className="modal-title m-0">{t("costModal.title")}</h5>
            </div>
            <div className='d-flex justify-content-end align-items-center gap-2'>
              <ExportDropdown fileGeneratorData={fileGeneratorData} className="light" />
              <button
                type="button"
                className="btn-close ms-2 bg-white text-light"
                onClick={handleCostModal}
              ></button>
            </div>

          </div>

          <div className="modal-body">
            <div>
              <p className="m-1 border-bottom">
                <strong className="fw-bold">{t("costModal.name")}: </strong>
                {recipeCosts.name}
              </p>
              <p className="m-1 border-bottom">
                <strong className="fw-bold">{t("costModal.costPerUnit")}: </strong>
                $ {formatNumber(recipeCosts.costPerUnit)}
              </p>

              <p className="m-1 border-bottom">
                <strong className="fw-bold">{t("traceabilityModal.amount")}: </strong>
                {formatNumber(recipeCosts.amount)}
              </p>
              <p className="m-1 border-bottom">
                <strong className="fw-bold">{t("costModal.weightPerUnit")}: </strong>
                {formatNumber(recipeCosts.weightPerUnit)} g
              </p>
              <p className="m-1 border-bottom">
                <strong className="fw-bold">{t("costModal.totalCost")}: </strong>
                $ {formatNumber(recipeCosts.totalCost)}
              </p>
            </div>

            <h5 className="mt-4 mb-3">{t("costModal.ingredients")}:</h5>

            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="bg-color-main text-white">
                  <tr>
                    <th className="text-nowrap">{t("costModal.ingredients")}</th>
                    <th className="text-nowrap">{t("costModal.cost")}</th>
                    <th className="text-nowrap">{t("costModal.percentage")}</th>
                    <th className="text-nowrap">{t("costModal.requiredQuantity")}</th>
                  </tr>
                </thead>
                <tbody>
                  {recipeCosts.ingredients?.map((ingredient, index) => (
                    <tr key={index}>
                      <td className="text-nowrap">{ingredient.name}</td>
                      <td className="text-nowrap">$ {formatNumber(ingredient.cost)}</td>
                      <td className="text-nowrap">{ingredient.percentage} % </td>
                      <td className="text-nowrap">{formatNumber(ingredient.requiredQuantity) + " " + (ingredient.unitOfMeasure || " g")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="modal-footer">
            <CustomButton
              type="button"
              className="secondary"
              onClick={handleCostModal}
              label={t("common.close")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
