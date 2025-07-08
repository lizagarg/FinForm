"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Printer, Mic, CheckCircle, AlertCircle } from "lucide-react"
import type { AadhaarData, FormTemplate, FormData, FormField } from "@/types/form-types"
import VoiceInput from "@/components/voice-input"
import { generatePDF } from "@/utils/pdf-generator"

interface AutoFilledFormProps {
  aadhaarData: AadhaarData
  formTemplate: FormTemplate
  onFormFilled: (data: FormData) => void
  onBack: () => void
}

export default function AutoFilledForm({ aadhaarData, formTemplate, onFormFilled, onBack }: AutoFilledFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [voiceInputField, setVoiceInputField] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // Auto-fill fields from Aadhaar data
    const initialData: Record<string, string> = {}

    formTemplate.fields.forEach((field) => {
      if (field.autoFillable && field.aadhaarMapping) {
        const value = aadhaarData[field.aadhaarMapping as keyof AadhaarData]
        if (value) {
          initialData[field.id] = value.toString()
        }
      }
    })

    setFormData(initialData)
  }, [aadhaarData, formTemplate])

  useEffect(() => {
    // Check if all required fields are filled
    const requiredFields = formTemplate.fields.filter((field) => field.required)
    const allFilled = requiredFields.every((field) => formData[field.id]?.trim())
    setIsComplete(allFilled)
  }, [formData, formTemplate])

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  const handleVoiceInput = (fieldId: string, transcript: string) => {
    handleInputChange(fieldId, transcript)
    setVoiceInputField(null)
  }

  const handleSubmit = () => {
    const submissionData: FormData = {
      formId: formTemplate.id,
      formName: formTemplate.name,
      data: formData,
      submittedAt: new Date().toISOString(),
    }
    onFormFilled(submissionData)
  }

  const handleDownloadPDF = () => {
    generatePDF(formTemplate, formData, aadhaarData)
  }

  const handlePrint = () => {
    window.print()
  }

  const getFieldLabel = (fieldId: string) => {
    // Replace with your actual logic to fetch bilingual labels
    return formTemplate.fields.find((f) => f.id === fieldId)?.label || fieldId
  }

  const renderField = (field: FormField) => {
    const value = formData[field.id] || ""
    const isAutoFilled = field.autoFillable && value
    const isEmpty = field.required && !value.trim()

    return (
      <div key={field.id} className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor={field.id} className="text-base font-medium text-gray-700">
            {getFieldLabel(field.id)}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <div className="flex gap-2">
            {isAutoFilled && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                Auto-filled / स्वतः भरा गया
              </Badge>
            )}
            {isEmpty && (
              <Badge variant="destructive" className="text-xs">
                <AlertCircle className="w-3 h-3 mr-1" />
                Required / आवश्यक
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          {field.type === "textarea" ? (
            <Textarea
              id={field.id}
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className={`flex-1 transition-all duration-200 ${
                isAutoFilled
                  ? "bg-green-50 border-green-200 focus:border-green-400"
                  : isEmpty
                    ? "border-red-300 focus:border-red-400"
                    : "focus:border-blue-400"
              }`}
              rows={3}
            />
          ) : (
            <Input
              id={field.id}
              type={field.type}
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className={`flex-1 transition-all duration-200 ${
                isAutoFilled
                  ? "bg-green-50 border-green-200 focus:border-green-400"
                  : isEmpty
                    ? "border-red-300 focus:border-red-400"
                    : "focus:border-blue-400"
              }`}
            />
          )}

          {!field.autoFillable && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setVoiceInputField(field.id)}
              className="px-4 bg-white/80 hover:bg-blue-50 border-blue-200"
              title="Voice Input / आवाज़ इनपुट"
            >
              <Mic className="w-4 h-4" />
            </Button>
          )}
        </div>

        {voiceInputField === field.id && (
          <VoiceInput
            onTranscript={(transcript) => handleVoiceInput(field.id, transcript)}
            onClose={() => setVoiceInputField(null)}
          />
        )}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack} className="bg-white/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back / वापस
          </Button>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {formTemplate.name}
            </h2>
            <p className="text-gray-600 mt-1">{formTemplate.description}</p>
            <p className="text-gray-500 text-sm">फॉर्म भरें और जमा करें</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePrint} className="bg-white/80">
            <Printer className="w-4 h-4 mr-2" />
            Print / प्रिंट
          </Button>
          <Button variant="outline" onClick={handleDownloadPDF} className="bg-white/80">
            <Download className="w-4 h-4 mr-2" />
            Download PDF / पीडीएफ डाउनलोड करें
          </Button>
        </div>
      </div>

      {/* Form */}
      <Card className="print:shadow-none">
        <CardHeader className="print:pb-4">
          <CardTitle className="text-center text-xl">{formTemplate.name}</CardTitle>
          <CardDescription className="text-center">Government of India - {formTemplate.department}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Auto-fill Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 print:hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-blue-800">Auto-fill Summary / स्वतः भरने का सारांश</h3>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {formTemplate.fields.filter((f) => f.autoFillable && formData[f.id]).length}
                  </span>
                </div>
                <div>
                  <span className="text-green-700 font-semibold">Fields auto-filled</span>
                  <p className="text-green-600 text-sm">फील्ड स्वतः भरे गए</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {formTemplate.fields.filter((f) => !f.autoFillable || !formData[f.id]).length}
                  </span>
                </div>
                <div>
                  <span className="text-orange-700 font-semibold">Fields need input</span>
                  <p className="text-orange-600 text-sm">फील्ड में इनपुट चाहिए</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid gap-6">{formTemplate.fields.map(renderField)}</div>

          {/* Submit Button */}
          <div className="flex justify-center pt-8 print:hidden">
            <Button
              onClick={handleSubmit}
              disabled={!isComplete}
              size="lg"
              className={`px-12 py-3 text-lg font-semibold transition-all duration-300 ${
                isComplete
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl"
                  : "bg-gray-400"
              }`}
            >
              {isComplete ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-3" />
                  Submit Form / फॉर्म जमा करें
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 mr-3" />
                  Complete Required Fields / आवश्यक फील्ड पूरे करें
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:shadow-none,
          .print\\:shadow-none * {
            visibility: visible;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:pb-4 {
            padding-bottom: 1rem;
          }
        }
      `}</style>
    </div>
  )
}
