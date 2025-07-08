"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, Printer, Edit, CheckCircle, FileText } from "lucide-react"
import type { AadhaarData, FormTemplate, FormData } from "@/types/form-types"
import { generatePDF } from "@/utils/pdf-generator"
import { getFieldLabel } from "@/utils/bilingual-labels"

interface FormPreviewProps {
  aadhaarData: AadhaarData
  formTemplate: FormTemplate
  formData: FormData
  onBack: () => void
  onEdit: () => void
  onSubmit: () => void
}

export default function FormPreview({ aadhaarData, formTemplate, formData, onBack, onEdit, onSubmit }: FormPreviewProps) {
  const handleDownloadPDF = () => {
    generatePDF(formTemplate, formData.data, aadhaarData)
  }

  const handlePrint = () => {
    window.print()
  }

  const formatFieldValue = (field: any, value: string) => {
    if (field.type === "date" && value) {
      return new Date(value).toLocaleDateString("en-IN")
    }
    return value || "Not provided / प्रदान नहीं किया गया"
  }

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack} className="bg-white/80 shrink-0">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Back / वापस</span>
            <span className="sm:hidden">Back</span>
          </Button>
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Form Preview
            </h2>
            <h3 className="text-lg sm:text-xl font-bold text-gray-700">फॉर्म पूर्वावलोकन</h3>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Review your form before submitting
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              जमा करने से पहले अपना फॉर्म देखें
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button variant="outline" onClick={onEdit} className="bg-white/80 text-sm sm:text-base">
            <Edit className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Edit / संपादित करें</span>
            <span className="sm:hidden">Edit</span>
          </Button>
          <Button variant="outline" onClick={handlePrint} className="bg-white/80 text-sm sm:text-base">
            <Printer className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Print / प्रिंट</span>
            <span className="sm:hidden">Print</span>
          </Button>
          <Button
            onClick={handleDownloadPDF}
            variant="outline"
            className="bg-white/80 text-sm sm:text-base"
          >
            <Download className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Download PDF / पीडीएफ डाउनलोड करें</span>
            <span className="sm:hidden">Download PDF</span>
          </Button>
        </div>
      </div>

      {/* Success Message */}
      <Card className="mb-6 sm:mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-1">
                Form Completed Successfully!
              </h3>
              <h4 className="text-base sm:text-lg font-semibold text-green-700 mb-1">
                फॉर्म सफलतापूर्वक पूरा हुआ!
              </h4>
              <p className="text-sm sm:text-base text-green-700">Your {formTemplate.name} application is ready for submission.</p>
              <p className="text-xs sm:text-sm text-green-600">आपका {formTemplate.name} आवेदन जमा करने के लिए तैयार है।</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Preview */}
      <Card className="print:shadow-none border-0 shadow-xl mb-6 sm:mb-8">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white print:bg-white print:text-black print:border-b-2 print:border-black p-4 sm:p-6">
          <div className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-3 sm:mb-4 print:mb-2">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 print:text-black" />
              <div>
                <CardTitle className="text-xl sm:text-2xl print:text-black">{formTemplate.name}</CardTitle>
                <CardDescription className="text-blue-100 print:text-gray-600 mt-1 text-sm sm:text-base">
                  Government of India - {formTemplate.department}
                </CardDescription>
                <CardDescription className="text-blue-100 print:text-gray-600 text-xs sm:text-sm">
                  भारत सरकार - {formTemplate.department}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-8 print:p-6">
          {/* Application Details */}
          <div className="mb-6 sm:mb-8 print:mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">Application Details / आवेदन विवरण</h3>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs sm:text-sm self-start sm:self-center">
                Application ID: {formData.formId.toUpperCase()}-{Date.now().toString().slice(-6)}
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
              <div>
                <span className="font-medium">Submitted On / जमा किया गया:</span>{" "}
                {new Date(formData.submittedAt).toLocaleDateString("en-IN")}
              </div>
              <div>
                <span className="font-medium">Form Type / फॉर्म प्रकार:</span> {formTemplate.name}
              </div>
            </div>
          </div>

          <Separator className="my-4 sm:my-6" />

          {/* Form Fields */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
              Personal Information / व्यक्तिगत जानकारी
            </h3>

            <div className="grid gap-4 sm:gap-6">
              {formTemplate.fields.map((field, index) => {
                const value = formData.data[field.id]
                const isAutoFilled = field.autoFillable && value

                return (
                  <div key={field.id} className="group">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          {getFieldLabel(field.id)} / {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <div
                          className={`min-h-[40px] p-3 rounded-lg border-2 transition-all duration-200 ${
                            isAutoFilled
                              ? "bg-green-50 border-green-200 text-green-800"
                              : "bg-gray-50 border-gray-200 text-gray-800"
                          }`}
                        >
                          <span className="font-medium text-sm sm:text-base break-words">{formatFieldValue(field, value)}</span>
                        </div>
                      </div>
                      <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2 sm:gap-1 sm:ml-4">
                        {isAutoFilled && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">Auto-filled / स्वतः भरा गया</span>
                            <span className="sm:hidden">Auto-filled</span>
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500">
                          Field {index + 1} / फील्ड {index + 1}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <Separator className="my-6 sm:my-8" />

          {/* Signature Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-12 print:mt-16">
            <div className="text-center">
              <div className="border-t-2 border-gray-400 pt-2 mt-12\
