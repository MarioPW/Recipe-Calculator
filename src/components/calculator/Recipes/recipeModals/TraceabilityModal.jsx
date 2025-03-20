import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export const TraceabilityModal = ({ handleTraceabilityModal, traceability }) => {
    if (!traceability) return null;
    console.log(traceability)

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text("Traceability Report", 10, 10);
        doc.text(`Name: ${traceability.name}`, 10, 20);
        doc.text(`Weight per Unit: ${traceability.weightPerUnit}`, 10, 30);
        doc.text(`Amount: ${traceability.amount}`, 10, 40);

        const tableData = traceability.ingredients.map(ingredient => [
            ingredient.reference,
            ingredient.name,
            ingredient.batch || "?",
            ingredient.expirationDate || "N/A",
            ingredient.calculatedProportion ? ingredient.calculatedProportion + " " + (ingredient.unitOfMeasure || "") : "N/A"
        ]);

        autoTable(doc, {
            startY: 50,
            head: [["Ref","Name", "Batch", "Expiration Date", "Calculated Proportion"]],
            body: tableData,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [44, 62, 80] }
        });

        doc.save(`Traceability_${new Date().toLocaleDateString()}.pdf`);
    };

    const generateExcel = () => {
        const wsData = [
            ["Name", traceability.name],
            ["Weight per Unit", traceability.weightPerUnit],
            ["Amount", traceability.amount],
            [],
            ["Ingredients"],
            ["Name", "Batch", "Expiration Date", "Calculated Proportion"]
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
                    <div className="modal-header d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <h5 className="modal-title m-0">Traceability Details</h5>
                        </div>

                        <div className="d-flex flex-row gap-2 ms-auto">
                            <button type="button" className="myButton-primary border-0 py-2 px-3 fw-bold" onClick={generatePDF}>
                                <i className="bi bi-download me-1"></i> .pdf
                            </button>
                            <button type="button" className="myButton-success border-0 py-2 px-3 fw-bold" onClick={generateExcel}>
                                <i className="bi bi-download me-1"></i> .xlsx
                            </button>
                        </div>

                        <button type="button" className="btn-close ms-2" onClick={handleTraceabilityModal}></button>
                    </div>
                    <div className="modal-body">
                        <div>
                            <p className="m-1 border-bottom"><strong className="fw-bold">Name: </strong>{traceability.name}</p>
                            <p className="m-1 border-bottom"><strong className="fw-bold">Weight per Unit: </strong>{traceability.weightPerUnit}</p>
                            <p className="m-1 border-bottom"><strong className="fw-bold">Amount: </strong>{traceability.amount}</p>
                        </div>
                        <h5 className="mt-4 mb-3 text-primary">Ingredients</h5>
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Name</th>
                                        <th>Batch</th>
                                        <th>Expiration Date</th>
                                        <th>Calculated Proportion</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {traceability.ingredients.map((ingredient, index) => (
                                        <tr key={index}>
                                            <td>{ingredient.name}</td>
                                            <td>{ingredient.batch || "?"}</td>
                                            <td>{ingredient.expirationDate || "N/A"}</td>
                                            <td>{ingredient.calculatedProportion ? ingredient.calculatedProportion + " " + (ingredient.unitOfMeasure || "") : "N/A"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="myButton-primary border-0 py-2" onClick={handleTraceabilityModal}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
