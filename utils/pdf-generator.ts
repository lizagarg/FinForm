import type { FormTemplate, AadhaarData } from "@/types/form-types"

export const generatePDF = (formTemplate: FormTemplate, formData: Record<string, string>, aadhaarData: AadhaarData) => {
  // Create a new window for PDF generation
  const printWindow = window.open("", "_blank")

  if (!printWindow) {
    alert("Please allow popups to download PDF")
    return
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${formTemplate.name}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          line-height: 1.6;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .form-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .department {
          font-size: 16px;
          color: #666;
        }
        .field-group {
          margin-bottom: 20px;
          display: flex;
          align-items: flex-start;
        }
        .field-label {
          font-weight: bold;
          min-width: 200px;
          margin-right: 20px;
        }
        .field-value {
          flex: 1;
          border-bottom: 1px solid #ccc;
          padding-bottom: 2px;
          min-height: 20px;
        }
        .signature-section {
          margin-top: 50px;
          display: flex;
          justify-content: space-between;
        }
        .signature-box {
          text-align: center;
          width: 200px;
        }
        .signature-line {
          border-top: 1px solid #333;
          margin-top: 50px;
          padding-top: 5px;
        }
        @media print {
          body { margin: 0; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="form-title">${formTemplate.name}</div>
        <div class="department">Government of India - ${formTemplate.department}</div>
      </div>
      
      <div class="form-content">
        ${formTemplate.fields
          .map(
            (field) => `
          <div class="field-group">
            <div class="field-label">${field.label}:</div>
            <div class="field-value">${formData[field.id] || ""}</div>
          </div>
        `,
          )
          .join("")}
      </div>
      
      <div class="signature-section">
        <div class="signature-box">
          <div class="signature-line">Applicant Signature</div>
        </div>
        <div class="signature-box">
          <div class="signature-line">Date</div>
        </div>
        <div class="signature-box">
          <div class="signature-line">Officer Signature</div>
        </div>
      </div>
      
      <script>
        window.onload = function() {
          window.print();
          window.onafterprint = function() {
            window.close();
          }
        }
      </script>
    </body>
    </html>
  `

  printWindow.document.write(htmlContent)
  printWindow.document.close()
}
