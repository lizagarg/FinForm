"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Upload, FileImage, Loader2, CheckCircle, Shield } from "lucide-react"
import type { AadhaarData } from "@/types/form-types"
import { mockAadhaarData } from "@/data/mock-data"

interface AadhaarUploadProps {
  onAadhaarProcessed: (data: AadhaarData) => void
}

export default function AadhaarUpload({ onAadhaarProcessed }: AadhaarUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const processAadhaar = async () => {
    if (!file) return

    setProcessing(true)

    // Simulate OCR processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Use mock data for demonstration
    const randomProfile = mockAadhaarData[Math.floor(Math.random() * mockAadhaarData.length)]

    setProcessing(false)
    onAadhaarProcessed(randomProfile)
  }

  const handleUseMockData = () => {
    const randomProfile = mockAadhaarData[Math.floor(Math.random() * mockAadhaarData.length)]
    onAadhaarProcessed(randomProfile)
  }

  return (
    <div className="max-w-2xl mx-auto p-3 sm:p-6">
      <Card className="border-0 shadow-none sm:border sm:shadow-lg">
        <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 border-b px-4 sm:px-6">
          <CardTitle className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xl sm:text-2xl">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <FileImage className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <div className="text-lg sm:text-2xl">Upload Aadhaar Card</div>
              <div className="text-base sm:text-lg text-gray-600">आधार कार्ड अपलोड करें</div>
            </div>
          </CardTitle>
          <CardDescription className="text-sm sm:text-base mt-2 px-2">
            Upload a clear image of your Aadhaar card to extract personal information
            <br />
            <span className="text-gray-500">व्यक्तिगत जानकारी निकालने के लिए अपने आधार कार्ड की स्पष्ट छवि अपलोड करें</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-6 sm:p-12 text-center transition-all duration-300 ${
              dragOver
                ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 scale-105"
                : file
                  ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {file ? (
              <div className="space-y-3 sm:space-y-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <p className="text-green-700 font-semibold text-base sm:text-lg break-all">{file.name}</p>
                  <p className="text-green-600 text-sm sm:text-base">
                    File ready for processing / फ़ाइल प्रसंस्करण के लिए तैयार
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg sm:text-xl font-semibold text-gray-700">Drop your Aadhaar card image here</p>
                  <p className="text-base sm:text-lg text-gray-600">अपनी आधार कार्ड की छवि यहाँ छोड़ें</p>
                  <p className="text-sm sm:text-base text-gray-500">
                    or click to browse files / या फ़ाइलें ब्राउज़ करने के लिए क्लिक करें
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  size="lg"
                  className="bg-white/80 w-full sm:w-auto"
                >
                  Choose File / फ़ाइल चुनें
                </Button>
              </div>
            )}
          </div>

          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0]
              if (selectedFile) handleFileSelect(selectedFile)
            }}
          />

          {/* Process Button */}
          {file && (
            <Button
              onClick={processAadhaar}
              disabled={processing}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              size="lg"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-3 animate-spin" />
                  <span className="text-sm sm:text-base">Processing Aadhaar... / आधार प्रसंस्करण...</span>
                </>
              ) : (
                <>
                  <FileImage className="w-4 h-4 sm:w-5 sm:h-5 mr-3" />
                  <span className="text-sm sm:text-base">Process Aadhaar Card / आधार कार्ड प्रसंस्करण करें</span>
                </>
              )}
            </Button>
          )}

          {/* Demo Button */}
          <div className="border-t pt-4 sm:pt-6">
            <p className="text-gray-600 text-center mb-3 sm:mb-4 font-medium text-sm sm:text-base">
              For testing purposes, you can use mock data:
              <br />
              <span className="text-xs sm:text-sm text-gray-500">परीक्षण के लिए, आप मॉक डेटा का उपयोग कर सकते हैं:</span>
            </p>
            <Button
              variant="outline"
              onClick={handleUseMockData}
              className="w-full bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100"
              size="lg"
            >
              <span className="text-sm sm:text-base">Use Mock Aadhaar Data / मॉक आधार डेटा का उपयोग करें</span>
            </Button>
          </div>

          {/* Security Notice */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">Security Notice / सुरक्षा सूचना</p>
                <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
                  Your Aadhaar data is processed locally and never stored on our servers. All information is kept secure
                  and private.
                </p>
                <p className="text-xs sm:text-sm text-blue-600 mt-1">
                  आपका आधार डेटा स्थानीय रूप से संसाधित होता है और कभी भी हमारे सर्वर पर संग्रहीत नहीं होता। सभी जानकारी सुरक्षित और
                  निजी रखी जाती है।
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
