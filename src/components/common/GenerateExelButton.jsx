import React from 'react'
import { generateXlsxTable } from '../../utilities/filesGenerator';

export const GenerateExelButton = ({title, tableData, summary}) => {
    const handleGenerateXlsx = () => {
        generateXlsxTable(title, tableData, summary);
    };
    return (
        <button type="button" className="btn btn-sm btn-outline-light" onClick={handleGenerateXlsx}>
            <i className="bi bi-download me-1"></i> Excel
        </button>
    )
}