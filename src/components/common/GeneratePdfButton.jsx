import { generatePDF } from '../../utilities/filesGenerator'
import { CustomButton } from './CustomButton';

export const GeneratePdfButton = ({ label, title, tableData, summary = null }) => {
  const handleGeneratePDF = () => {
    generatePDF(title, tableData, summary);
  }

  return (
    <CustomButton
      type="button"
      className="warning"
      onClick={handleGeneratePDF}
    >
      <i className="bi bi-download me-1"></i> PDF
    </CustomButton>
  )
}
