import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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
