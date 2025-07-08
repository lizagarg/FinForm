"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CloudUpload, CheckCircle, FileText, Upload, AlertCircle, Loader2, Download } from "lucide-react"
import type { AadhaarData, FormTemplate, FormData } from "@/types/form-types"

interface FormUploadProps {
  aadhaarData: AadhaarData
  formTemplate: FormTemplate
  formData: FormData
  onBack: () => void
  onComplete: () => void
}

export default function FormUpload({ aadhaarData, formTemplate, formData, onBack, onComplete }: FormUploadProps) {
  const [uploadStatus, setUploadStatus] = useState<"ready" | "uploading" | "success" | "error">("ready")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [applicationId, setApplicationId] = useState("")

  const handleUpload = async () => {
    setUploadStatus("uploading")
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return 95
        }
        return prev + Math.random() * 15
      })
    }, 200)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Generate application ID
      const appId = `${formTemplate.id.toUpperCase()}-${Date.now().toString().slice(-8)}`
      setApplicationId(appId)

      setUploadProgress(100)
      setUploadStatus("success")
      clearInterval(progressInterval)
    } catch (error) {
      setUploadStatus("error")
      clearInterval(progressInterval)
    }
  }

  const handleDownloadReceipt = () => {
    // Generate receipt PDF
    const receiptContent = `
      Application Receipt
      
      Application ID: ${applicationId}
      Form: ${formTemplate.name}
      Applicant: ${aadhaarData.name}
      Submitted: ${new Date().toLocaleString()}
      Status: Successfully Submitted
    `

    const blob = new Blob([receiptContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `receipt-${applicationId}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6">
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
              Submit Application
            </h2>
            <h3 className="text-lg sm:text-xl font-bold text-gray-700">आवेदन जमा करें</h3>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Upload your completed form to the government portal
            </p>
            <p className="text-xs sm:text-sm text-gray-500">अपना पूरा किया गया फॉर्म सरकारी पोर्टल पर अपलोड करें</p>
          </div>
        </div>
      </div>

      {uploadStatus === "ready" && (
        <>
          {/* Form Summary */}
          <Card className="mb-6 sm:mb-8">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                Application Summary / आवेदन सारांश
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Form Type / फॉर्म प्रकार</label>
                    <p className="font-semibold text-gray-800">{formTemplate.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Applicant Name / आवेदक का नाम</label>
                    <p className="font-semibold text-gray-800">{aadhaarData.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Aadhaar Number / आधार संख्या</label>
                    <p className="font-semibold text-gray-800">{aadhaarData.aadhaarNumber}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Department / विभाग</label>
                    <p className="font-semibold text-gray-800">{formTemplate.department}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Submission Date / जमा करने की तारीख</label>
                    <p className="font-semibold text-gray-800">{new Date().toLocaleDateString("en-IN")}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Fields Completed / पूरे किए गए फील्ड</label>
                    <p className="font-semibold text-gray-800">
                      {Object.keys(formData.data).length} / {formTemplate.fields.length}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload Instructions */}
          <Card className="mb-6 sm:mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-800 mb-2 text-base sm:text-lg">
                    Ready to Submit / जमा करने के लिए तैयार
                  </h3>
                  <div className="space-y-2 text-sm sm:text-base text-blue-700">
                    <p>• Your form has been completed and is ready for submission</p>
                    <p>• आपका फॉर्म पूरा हो गया है और जमा करने के लिए तैयार है</p>
                    <p>• You will receive an application ID after successful submission</p>
                    <p>• सफल जमा करने के बाद आपको एक आवेदन आईडी मिलेगी</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              onClick={handleUpload}
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 px-8 sm:px-12 py-3 text-base sm:text-lg font-semibold"
            >
              <CloudUpload className="w-5 h-5 mr-3" />
              Submit Application / आवेदन जमा करें
            </Button>
          </div>
        </>
      )}

      {uploadStatus === "uploading" && (
        <Card className="text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-spin" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Uploading Application / आवेदन अपलोड हो रहा है
            </h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              Please wait while we submit your form to the government portal
              <br />
              कृपया प्रतीक्षा करें जब तक हम आपका फॉर्म सरकारी पोर्टल पर जमा करते हैं
            </p>
            <div className="max-w-md mx-auto">
              <Progress value={uploadProgress} className="h-3 mb-2" />
              <p className="text-sm text-gray-500">{Math.round(uploadProgress)}% Complete</p>
            </div>
          </CardContent>
        </Card>
      )}

      {uploadStatus === "success" && (
        <Card className="text-center bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-green-800 mb-2">Application Submitted Successfully!</h3>
            <h4 className="text-lg sm:text-xl font-bold text-green-700 mb-4">आवेदन सफलतापूर्वक जमा किया गया!</h4>

            <div className="bg-white rounded-lg p-4 sm:p-6 mb-6 max-w-md mx-auto">
              <p className="text-sm text-gray-600 mb-2">Application ID / आवेदन आईडी</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800 font-mono">{applicationId}</p>
            </div>

            <div className="space-y-3 mb-6 text-sm sm:text-base text-green-700">
              <p>✓ Your application has been successfully submitted</p>
              <p>✓ आपका आवेदन सफलतापूर्वक जमा किया गया है</p>
              <p>✓ You will receive updates via SMS and email</p>
              <p>✓ आपको SMS और ईमेल के माध्यम से अपडेट मिलेंगे</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleDownloadReceipt}
                variant="outline"
                className="bg-white/80 border-green-300 text-green-700 hover:bg-green-50"
              >
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Download Receipt / रसीद डाउनलोड करें</span>
                <span className="sm:hidden">Download Receipt</span>
              </Button>
              <Button
                onClick={onComplete}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <span className="hidden sm:inline">Submit Another Form / दूसरा फॉर्म जमा करें</span>
                <span className="sm:hidden">New Form</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {uploadStatus === "error" && (
        <Card className="text-center bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-red-800 mb-2">Upload Failed / अपलोड असफल</h3>
            <p className="text-red-700 mb-6 text-sm sm:text-base">
              There was an error submitting your application. Please try again.
              <br />
              आपका आवेदन जमा करने में त्रुटि हुई। कृपया पुनः प्रयास करें।
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => setUploadStatus("ready")}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Try Again / पुनः प्रयास करें</span>
                <span className="sm:hidden">Try Again</span>
              </Button>
              <Button variant="outline" onClick={onBack} className="bg-white/80">
                <span className="hidden sm:inline">Go Back / वापस जाएं</span>
                <span className="sm:hidden">Go Back</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
