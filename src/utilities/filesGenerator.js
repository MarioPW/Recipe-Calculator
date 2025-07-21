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

export const generateXlsxTable = (title, tableData, summary = {}) => {
    const wb = XLSX.utils.book_new();

    const summaryRows = Object.entries(summary).map(([key, value]) => [key, value]);

    const headers = Object.keys(tableData[0] || {});
    const dataRows = tableData.map(row => headers.map(header => row[header]));

    const wsData = [...summaryRows, [], headers, ...dataRows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    const allRows = [...summaryRows, headers, ...dataRows];
    const maxCols = Math.max(...allRows.map(row => row.length));

    ws['!cols'] = Array.from({ length: maxCols }).map((_, colIndex) => {
        const maxWidth = allRows.reduce((width, row) => {
            const cell = row[colIndex];
            const len = cell ? String(cell).length : 0;
            return Math.max(width, len);
        }, 0);
        return { wch: maxWidth + 2 };
    });

    XLSX.utils.book_append_sheet(wb, ws, title);
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), `${title}_${new Date().toISOString().slice(0, 10)}.xlsx`);
};


export const generatePDF = (title, tableData, summary = null) => {
    const doc = new jsPDF();

    doc.text(title, 10, 10);

    if (summary) {
        let yOffset = 20;
        Object.entries(summary).forEach(([key, value]) => {
            doc.text(`${key}: ${value}`, 10, yOffset);
            yOffset += 10;
        });
    }

    const headers = tableData.length > 0 ? Object.keys(tableData[0]) : [];
    const bodyData = tableData.map(item => headers.map(header => item[header] ?? "N/A"));

    autoTable(doc, {
        startY: summary ? Object.keys(summary).length * 10 + 20 : 20,
        head: [headers],
        body: bodyData,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [44, 62, 80] }
    });

    const date = new Date().toLocaleDateString().replace(/\//g, "-");
    doc.save(`${title.replace(/\s+/g, "_")}_${date}.pdf`);
};