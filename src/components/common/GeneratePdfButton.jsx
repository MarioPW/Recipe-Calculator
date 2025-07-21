import { generatePDF } from '../../utilities/filesGenerator'

export const GeneratePdfButton = ({ label, title, tableData, summary = null}) => {
    const handleGeneratePDF = () => {
      generatePDF( title, tableData, summary );
      }

      return (
        <button type="button" className="btn btn-sm btn-outline-light" onClick={handleGeneratePDF}>
          <i className="bi bi-download me-1"></i> PDF
        </button>
      )
    }
