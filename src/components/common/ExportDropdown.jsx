import { generatePDF, generateXlsxTable } from '../../utilities/filesGenerator';
import { useTranslation } from 'react-i18next';

export const ExportDropdown = ({
    fileGeneratorData,
    className = 'light',
    id = 'exportDropdown'
}) => {
    const { t } = useTranslation();
    const { title, tableData, summary = {} } = fileGeneratorData;

    const handleExportPDF = () => {
        try {
            generatePDF(title, tableData, summary);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    const handleExportXLS = () => {
        try {
            generateXlsxTable(title, tableData, summary);
        } catch (error) {
            console.error('Error generating Excel:', error);
        }
    };

    // const handleExportSVG = () => {
    //     try {
    //         generateSVG(title, tableData);
    //     } catch (error) {
    //         console.error('Error generating SVG:', error);
    //     }
    // };

    return (
        <div className="dropdown">
            <button
                type="button"
                className={`btn btn-sm btn-outline-${className} dropdown-toggle`}
                id={id}
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <i className="bi bi-download me-1"></i>
                {t('download.export')}
            </button>
            <ul className="dropdown-menu" aria-labelledby={id}>
                <li>
                    <button
                        className="dropdown-item"
                        onClick={handleExportPDF}
                    >
                        <i className="bi bi-file-pdf text-danger me-2"></i>
                        {t('download.pdf')}
                    </button>
                </li>
                <li>
                    <button
                        className="dropdown-item"
                        onClick={handleExportXLS}
                    >
                        <i className="bi bi-file-earmark-excel text-success me-2"></i>
                        {t('download.excel')}
                    </button>
                </li>
                {/* <li>
                    <button
                        className="dropdown-item"
                        onClick={handleExportSVG}
                    >
                        <i className="bi bi-image text-primary me-2"></i>
                        Export SVG
                    </button>
                </li> */}
            </ul>
        </div>
    );
};
