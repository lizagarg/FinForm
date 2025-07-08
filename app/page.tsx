"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, FileText, User, Eye, CloudUpload } from "lucide-react"
import AadhaarUpload from "@/components/aadhaar-upload"
import FormSelector from "@/components/form-selector"
import AutoFilledForm from "@/components/auto-filled-form"
import FormPreview from "@/components/form-preview"
import FormUpload from "@/components/form-upload"
import type { AadhaarData, FormTemplate, FormData } from "@/types/form-types"

export default function HomePage() {
  const [step, setStep] = useState<"upload" | "select" | "fill" | "preview" | "submit">("upload")
  const [aadhaarData, setAadhaarData] = useState<AadhaarData | null>(null)
  const [selectedForm, setSelectedForm] = useState<FormTemplate | null>(null)
  const [formData, setFormData] = useState<FormData | null>(null)

  const handleAadhaarProcessed = (data: AadhaarData) => {
    setAadhaarData(data)
    setStep("select")
  }

  const handleFormSelected = (form: FormTemplate) => {
    setSelectedForm(form)
    setStep("fill")
  }

  const handleFormFilled = (data: FormData) => {
    setFormData(data)
    setStep("preview")
  }

  const handleFormSubmit = () => {
    setStep("submit")
  }

  const resetFlow = () => {
    setStep("upload")
    setAadhaarData(null)
    setSelectedForm(null)
    setFormData(null)
  }

  const steps = [
    { id: "upload", icon: Upload, label: "Upload", labelHi: "अपलोड", desc: "Aadhaar", descHi: "आधार" },
    { id: "select", icon: FileText, label: "Select", labelHi: "चुनें", desc: "Form", descHi: "फॉर्म" },
    { id: "fill", icon: User, label: "Fill", labelHi: "भरें", desc: "Details", descHi: "विवरण" },
    { id: "preview", icon: Eye, label: "Preview", labelHi: "पूर्वावलोकन", desc: "Review", descHi: "समीक्षा" },
    { id: "submit", icon: CloudUpload, label: "Submit", labelHi: "जमा करें", desc: "Upload", descHi: "अपलोड" },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === step)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-20 left-20 sm:top-40 sm:left-40 w-40 h-40 sm:w-80 sm:h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-2 sm:p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-12 pt-4 sm:pt-8 px-4">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-3 sm:mb-6 shadow-lg">
              <FileText className="w-6 h-6 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 sm:mb-4">
              Government Form Auto-Filler
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-700 mb-1 sm:mb-2">
              सरकारी फॉर्म ऑटो-फिलर
            </h2>
            <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Upload your Aadhaar card and auto-fill government forms instantly
            </p>
            <p className="text-xs sm:text-sm md:text-lg text-gray-500 max-w-2xl mx-auto px-4">
              अपना आधार कार्ड अपलोड करें और सरकारी फॉर्म तुरंत भरें
            </p>
          </div>

          {/* Enhanced Progress Indicator */}
          <div className="flex justify-center mb-6 sm:mb-12 px-2">
            {/* Mobile Progress (Horizontal Scroll) */}
            <div className="sm:hidden w-full overflow-x-auto">
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-3 shadow-lg border border-white/20 min-w-max">
                {steps.map((stepItem, index) => (
                  <div key={stepItem.id} className="flex items-center">
                    <div
                      className={`flex flex-col items-center transition-all duration-300 ${
                        index <= currentStepIndex ? "text-blue-600" : "text-gray-400"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          index === currentStepIndex
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110"
                            : index < currentStepIndex
                              ? "bg-green-600 text-white"
                              : "bg-gray-300"
                        }`}
                      >
                        <stepItem.icon className="w-4 h-4" />
                      </div>
                      <div className="text-center mt-1">
                        <span className="font-medium text-xs block">{stepItem.label}</span>
                        <span className="text-xs opacity-75">{stepItem.labelHi}</span>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-6 h-0.5 mx-2 transition-all duration-500 ${
                          index < currentStepIndex ? "bg-green-600" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Progress */}
            <div className="hidden sm:flex items-center space-x-4 lg:space-x-6 bg-white/80 backdrop-blur-sm rounded-full px-6 lg:px-8 py-4 shadow-lg border border-white/20">
              {steps.map((stepItem, index) => (
                <div key={stepItem.id} className="flex items-center">
                  <div
                    className={`flex items-center space-x-3 transition-all duration-300 ${
                      index === currentStepIndex
                        ? "text-blue-600 scale-110"
                        : index < currentStepIndex
                          ? "text-green-600"
                          : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        index === currentStepIndex
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                          : index < currentStepIndex
                            ? "bg-green-600 text-white"
                            : "bg-gray-300"
                      }`}
                    >
                      <stepItem.icon className="w-5 h-5 lg:w-6 lg:h-6" />
                    </div>
                    <div className="text-center">
                      <span className="font-semibold block text-sm lg:text-base">
                        {stepItem.label} / {stepItem.labelHi}
                      </span>
                      <span className="text-xs opacity-75">
                        {stepItem.desc} / {stepItem.descHi}
                      </span>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 lg:w-12 h-1 rounded-full transition-all duration-500 ${
                        index < currentStepIndex ? "bg-green-600" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl border border-white/20 overflow-hidden mx-2 sm:mx-0">
            {step === "upload" && <AadhaarUpload onAadhaarProcessed={handleAadhaarProcessed} />}

            {step === "select" && aadhaarData && (
              <FormSelector
                aadhaarData={aadhaarData}
                onFormSelected={handleFormSelected}
                onBack={() => setStep("upload")}
              />
            )}

            {step === "fill" && aadhaarData && selectedForm && (
              <AutoFilledForm
                aadhaarData={aadhaarData}
                formTemplate={selectedForm}
                onFormFilled={handleFormFilled}
                onBack={() => setStep("select")}
              />
            )}

            {step === "preview" && aadhaarData && selectedForm && formData && (
              <FormPreview
                aadhaarData={aadhaarData}
                formTemplate={selectedForm}
                formData={formData}
                onBack={() => setStep("fill")}
                onEdit={() => setStep("fill")}
                onSubmit={handleFormSubmit}
              />
            )}

            {step === "submit" && aadhaarData && selectedForm && formData && (
              <FormUpload
                aadhaarData={aadhaarData}
                formTemplate={selectedForm}
                formData={formData}
                onBack={() => setStep("preview")}
                onComplete={resetFlow}
              />
            )}
          </div>

          {/* Reset Button */}
          {step !== "upload" && (
            <div className="text-center mt-4 sm:mt-8 px-4">
              <Button
                variant="outline"
                onClick={resetFlow}
                className="bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white/90 transition-all duration-300 text-sm sm:text-base"
                size={window.innerWidth < 640 ? "sm" : "default"}
              >
                Start Over / फिर से शुरू करें
              </Button>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
