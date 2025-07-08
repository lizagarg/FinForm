"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileText, Home, Banknote, Users, Shield } from "lucide-react"
import type { AadhaarData, FormTemplate } from "@/types/form-types"
import { governmentForms } from "@/data/form-templates"

interface FormSelectorProps {
  aadhaarData: AadhaarData
  onFormSelected: (form: FormTemplate) => void
  onBack: () => void
}

const getFieldLabel = (fieldId: string) => {
  return fieldId
}

export default function FormSelector({ aadhaarData, onFormSelected, onBack }: FormSelectorProps) {
  const getFormIcon = (formId: string) => {
    switch (formId) {
      case "pmay":
        return <Home className="w-5 h-5 sm:w-6 sm:h-6" />
      case "jan-dhan":
        return <Banknote className="w-5 h-5 sm:w-6 sm:h-6" />
      case "ayushman":
        return <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
      case "ration":
        return <Users className="w-5 h-5 sm:w-6 sm:h-6" />
      default:
        return <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 sm:mb-8">
        <Button variant="outline" size="sm" onClick={onBack} className="bg-white/80 self-start">
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Back / वापस</span>
          <span className="sm:hidden">Back</span>
        </Button>
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Select Government Form
          </h2>
          <h3 className="text-lg sm:text-xl font-bold text-gray-700">सरकारी फॉर्म चुनें</h3>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Welcome, {aadhaarData.name}! Choose a form to auto-fill with your Aadhaar data.
          </p>
          <p className="text-xs sm:text-sm text-gray-500">स्वागत है! अपने आधार डेटा के साथ भरने के लिए एक फॉर्म चुनें।</p>
        </div>
      </div>

      {/* Aadhaar Summary */}
      <Card className="mb-6 sm:mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
        <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg">
              {aadhaarData.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-semibold text-green-800 truncate">{aadhaarData.name}</h3>
              <p className="text-sm sm:text-base text-green-700 font-medium">Aadhaar: {aadhaarData.aadhaarNumber}</p>
              <p className="text-sm sm:text-base text-green-700 font-medium">DOB: {aadhaarData.dateOfBirth}</p>
              <p className="text-xs sm:text-sm text-green-600">
                आधार: {aadhaarData.aadhaarNumber} • जन्म तिथि: {aadhaarData.dateOfBirth}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {governmentForms.map((form) => (
          <Card
            key={form.id}
            className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg hover:scale-105 bg-gradient-to-br from-white to-gray-50"
          >
            <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="text-blue-600 bg-blue-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                  {getFormIcon(form.id)}
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg sm:text-xl text-gray-800 leading-tight">{form.name}</CardTitle>
                  <CardDescription className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
                    {form.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="space-y-3 sm:space-y-4">
                {/* Auto-fillable fields */}
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-green-700 mb-2 sm:mb-3">
                    Auto-fillable from Aadhaar / आधार से स्वतः भरे जाने वाले:
                  </p>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {form.fields
                      .filter((field) => field.autoFillable)
                      .slice(0, 4) // Show only first 4 on mobile
                      .map((field) => (
                        <Badge
                          key={field.id}
                          variant="secondary"
                          className="text-xs bg-green-100 text-green-800 border-green-200"
                        >
                          {getFieldLabel(field.id)}
                        </Badge>
                      ))}
                    {form.fields.filter((field) => field.autoFillable).length > 4 && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 border-green-200">
                        +{form.fields.filter((field) => field.autoFillable).length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Manual fields */}
                {form.fields.some((field) => !field.autoFillable) && (
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-orange-700 mb-2 sm:mb-3">
                      Requires manual input / मैन्युअल इनपुट आवश्यक:
                    </p>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {form.fields
                        .filter((field) => !field.autoFillable)
                        .slice(0, 3) // Show only first 3 on mobile
                        .map((field) => (
                          <Badge key={field.id} variant="outline" className="text-xs border-orange-200 text-orange-700">
                            {getFieldLabel(field.id)}
                          </Badge>
                        ))}
                      {form.fields.filter((field) => !field.autoFillable).length > 3 && (
                        <Badge variant="outline" className="text-xs border-orange-200 text-orange-700">
                          +{form.fields.filter((field) => !field.autoFillable).length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => onFormSelected(form)}
                  className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                  size="lg"
                >
                  <span className="hidden sm:inline">Select This Form / यह फॉर्म चुनें</span>
                  <span className="sm:hidden">Select Form</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
