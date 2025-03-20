import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const generateTablePDF = (pdfData) => {
    const doc = new jsPDF();
    doc.text(`${pdfData.title} - ${new Date().toLocaleDateString()}`, 10, 15);

    autoTable(doc, {
        head: [pdfData.headers],
        body: pdfData.data,
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fontSize: 10 }
    });

    doc.save(`${pdfData.fileName}_${new Date().toLocaleDateString()}.pdf`);
}

export const generateXlsxTable = (title, xlsxData) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(xlsxData);
    XLSX.utils.book_append_sheet(wb, ws, title);
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(data, title + "_" + new Date().toLocaleDateString() + ".xlsx");
}