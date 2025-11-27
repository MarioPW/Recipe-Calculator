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
  const wb = XLSX.utils.book_new()
  // solves "ERROR: Invalid sheet name"
  const sanitizeSheetName = (name) => {
    let sanitized = name.replace(/[:\\/\?\*\[\]]/g, '-');
    // Solves "ERROR: Sheet names cannot exceed 31 characters"
    if (sanitized.length > 31) {
      sanitized = sanitized.substring(0, 28) + '...';
    }

    return sanitized;
  };

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

  XLSX.utils.book_append_sheet(wb, ws, sanitizeSheetName(title));
  const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([buffer]), `${title}_${new Date().toISOString().slice(0, 10)}.xlsx`);
};


export const generatePDF = (title, tableData, summary = null) => {
  try {
    const doc = new jsPDF();

    doc.setFontSize(12);
    doc.text(title, 10, 10);

    let yOffset = 15;
    if (summary) {
      Object.entries(summary).forEach(([key, value]) => {
        doc.text(`${key}: ${value}`, 10, yOffset);
        yOffset += 6;
      });
    }

    if (!tableData || tableData.length === 0) {
      alert('⚠️ No hay datos para generar el PDF');
      return;
    }

    const headers = tableData.length > 0 ? Object.keys(tableData[0]) : [];
    const bodyData = tableData.map(item => headers.map(header => item[header] ?? "N/A"));

    autoTable(doc, {
      startY: yOffset + 2,
      head: [headers],
      body: bodyData,
      styles: { fontSize: 6, cellPadding: 1 },
      headStyles: { fillColor: [44, 62, 80], fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 'wrap' },
      }
    });

    const date = new Date().toLocaleDateString().replace(/\//g, "-");
    const fileName = `${title.replace(/\s+/g, "_")}_${date}.pdf`;

    doc.save(fileName);

    // ✅ Alert de éxito
    alert(`✅ PDF generado correctamente\nArchivo: ${fileName}`);

  } catch (error) {
    console.error('Error al generar PDF:', error);

    // ❌ Alert de error
    alert('❌ Error al generar el PDF. Por favor, inténtalo de nuevo.');
  }
};