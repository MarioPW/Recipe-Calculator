import React from 'react'
import { generateXlsxTable } from '../../utilities/filesGenerator';
import { CustomButton } from './CustomButton';

export const GenerateExelButton = ({ title, tableData, summary }) => {
    const handleGenerateXlsx = () => {
        generateXlsxTable(title, tableData, summary);
    };
    return (
        <CustomButton
            type="button"
            className="warning"
            onClick={handleGenerateXlsx}
        >
            <i className="bi bi-download me-1"></i> Excel
        </CustomButton>
    )
}