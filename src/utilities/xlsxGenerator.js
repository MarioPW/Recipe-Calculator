import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getLocalISOString } from './utils';

export const generateXlsxTable = (title, tableData, summary = {}) => {
  const wb = XLSX.utils.book_new()
  // solves "ERROR: Invalid sheet name"
  const sanitizeSheetName = (name) => {
    let sanitized = name.replace(/[:\\/?*[\]]/g, '-');
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
  saveAs(new Blob([buffer]), `${title}_${getLocalISOString().slice(0, 10)}.xlsx`);
};
