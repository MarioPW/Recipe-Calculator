import React from "react";
import { useTranslation } from "react-i18next";
import { GeneratePdfButton } from '../../../common/GeneratePdfButton';
import { GenerateExelButton } from '../../../common/GenerateExelButton';


export const CostModal = ({ handleCostModal, recipeCosts }) => {
  const { t } = useTranslation();

  if (!recipeCosts) return null;

  const fileGeneratorData = {
    title: t("costModal.title"),
    tableData: recipeCosts.ingredients.map((item) => ({
      [t("costModal.name")]: item.name,
      [t("costModal.requiredQuantity")]: item.requiredQuantity + " " + item.unitOfMeasure,
      [t("costModal.percentage")]: `${item.percentage || "N/A"} %`,
      [t("costModal.cost")]: `$ ${item.cost}`,
    })),
    summary: {
      [t("costModal.name")]: recipeCosts.name,
      [t("costModal.costPerUnit")]: `${'$ ' + recipeCosts.costPerUnit}`,
      [t("costModal.totalCost")]: `${'$ ' + recipeCosts.totalCost}`,
      [t("traceabilityModal.amount")]: recipeCosts.amount,
      [t("costModal.weightPerUnit")]: `${recipeCosts.weightPerUnit + ' g'}`,
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
              <GeneratePdfButton {...fileGeneratorData} />
              <GenerateExelButton {...fileGeneratorData} />
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
                $ {recipeCosts.costPerUnit}
              </p>

              <p className="m-1 border-bottom">
                <strong className="fw-bold">{t("traceabilityModal.amount")}: </strong>
                {recipeCosts.amount}
              </p>
              <p className="m-1 border-bottom">
                <strong className="fw-bold">{t("costModal.weightPerUnit")}: </strong>
                {recipeCosts.weightPerUnit} g
              </p>
              <p className="m-1 border-bottom">
                <strong className="fw-bold">{t("costModal.totalCost")}: </strong>
                $ {recipeCosts.totalCost}
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
                      <td className="text-nowrap">$ {ingredient.cost}</td>
                      <td className="text-nowrap">{ingredient.percentage} % </td>
                      <td className="text-nowrap">{ingredient.requiredQuantity + " " + (ingredient.unitOfMeasure || " g") }</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="myButton-primary border-0 py-2"
              onClick={handleCostModal}
            >
              {t("common.close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
