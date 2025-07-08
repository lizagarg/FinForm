"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Mic, MicOff, Check, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useOCR } from "@/hooks/use-ocr"
import { useVoiceInterface } from "@/hooks/use-voice-interface"
import { useNLPMatcher } from "@/hooks/use-nlp-matcher"
import { useOfflineStorage } from "@/hooks/use-offline-storage"

interface FormField {
  id: string
  label: string
  value: string
  confidence: number
  isRequired: boolean
  fieldType: "text" | "number" | "date" | "select"
}

interface FormProcessorProps {
  image: string | null
  onBack: () => void
  onComplete: () => void
}

export default function FormProcessor({ image, onBack, onComplete }: FormProcessorProps) {
  const [processingStep, setProcessingStep] = useState<"ocr" | "voice" | "review" | "complete">("ocr")
  const [fields, setFields] = useState<FormField[]>([])
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [progress, setProgress] = useState(0)

  const { extractText, isProcessing: ocrProcessing } = useOCR()
  const { speak, listen, stopListening, isSupported: voiceSupported } = useVoiceInterface()
  const { matchFields, getProfileSuggestion } = useNLPMatcher()
  const { saveForm, getUserProfile } = useOfflineStorage()

  useEffect(() => {
    if (image) {
      processForm()
    }
  }, [image])

  const processForm = async () => {
    if (!image) return

    try {
      setProgress(20)
      speak("फॉर्म को स्कैन कर रहे हैं...", "hi")

      // Extract text using OCR
      const extractedText = await extractText(image)
      setProgress(40)

      // Parse fields from extracted text
      const parsedFields = parseFormFields(extractedText)
      setProgress(60)

      // Match with user profile
      const userProfile = await getUserProfile()
      const matchedFields = await matchFields(parsedFields, userProfile)
      setProgress(80)

      setFields(matchedFields)
      setProgress(100)

      setTimeout(() => {
        setProcessingStep("voice")
        startVoiceGuidance()
      }, 1000)
    } catch (error) {
      console.error("Form processing error:", error)
      speak("फॉर्म प्रोसेसिंग में समस्या है। कृपया दोबारा कोशिश करें।", "hi")
    }
  }

  const parseFormFields = (text: string): FormField[] => {
    // Simulate field extraction from OCR text
    const commonFields = [
      { label: "नाम / Name", type: "text", required: true },
      { label: "पिता का नाम / Father's Name", type: "text", required: true },
      { label: "पता / Address", type: "text", required: true },
      { label: "फोन नंबर / Phone Number", type: "number", required: true },
      { label: "आधार नंबर / Aadhaar Number", type: "number", required: false },
      { label: "जन्म तिथि / Date of Birth", type: "date", required: true },
    ]

    return commonFields.map((field, index) => ({
      id: `field_${index}`,
      label: field.label,
      value: "",
      confidence: Math.random() * 0.3 + 0.7,
      isRequired: field.required,
      fieldType: field.type as FormField["fieldType"],
    }))
  }

  const startVoiceGuidance = () => {
    if (fields.length === 0) return

    const currentField = fields[currentFieldIndex]
    const hindiPrompt = getHindiPrompt(currentField.label)
    speak(`${hindiPrompt} बोलें।`, "hi")
  }

  const getHindiPrompt = (label: string): string => {
    const prompts: Record<string, string> = {
      "नाम / Name": "कृपया अपना नाम",
      "पिता का नाम / Father's Name": "कृपया अपने पिता का नाम",
      "पता / Address": "कृपया अपना पता",
      "फोन नंबर / Phone Number": "कृपया अपना फोन नंबर",
      "आधार नंबर / Aadhaar Number": "कृपया अपना आधार नंबर",
      "जन्म तिथि / Date of Birth": "कृपया अपनी जन्म तिथि",
    }

    return prompts[label] || "कृपया जानकारी"
  }

  const handleVoiceInput = async () => {
    if (isListening) {
      stopListening()
      setIsListening(false)
      return
    }

    setIsListening(true)
    try {
      const result = await listen()
      if (result) {
        updateFieldValue(currentFieldIndex, result)
        moveToNextField()
      }
    } catch (error) {
      console.error("Voice input error:", error)
      speak("आवाज़ समझने में समस्या है। कृपया दोबारा कोशिश करें।", "hi")
    } finally {
      setIsListening(false)
    }
  }

  const updateFieldValue = (index: number, value: string) => {
    setFields((prev) => prev.map((field, i) => (i === index ? { ...field, value } : field)))
  }

  const moveToNextField = () => {
    if (currentFieldIndex < fields.length - 1) {
      setCurrentFieldIndex((prev) => prev + 1)
      setTimeout(() => {
        startVoiceGuidance()
      }, 500)
    } else {
      setProcessingStep("review")
      speak("सभी जानकारी भर गई है। कृपया समीक्षा करें।", "hi")
    }
  }

  const handleReview = () => {
    setProcessingStep("review")
  }

  const handleSaveForm = async () => {
    try {
      const formData = {
        id: Date.now().toString(),
        fields,
        image,
        createdAt: new Date().toISOString(),
        status: "completed",
      }

      await saveForm(formData)
      setProcessingStep("complete")
      speak("फॉर्म सफलतापूर्वक सहेजा गया।", "hi")

      setTimeout(() => {
        onComplete()
      }, 2000)
    } catch (error) {
      console.error("Save form error:", error)
      speak("फॉर्म सहेजने में समस्या है।", "hi")
    }
  }

  const renderProcessingStep = () => {
    switch (processingStep) {
      case "ocr":
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">फॉर्म स्कैन हो रहा है</h3>
              <p className="text-sm text-gray-400">Processing Form...</p>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )

      case "voice":
        const currentField = fields[currentFieldIndex]
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Badge variant="secondary" className="mb-2">
                {currentFieldIndex + 1} / {fields.length}
              </Badge>
              <h3 className="text-lg font-semibold text-white">{currentField?.label}</h3>
              <p className="text-sm text-red-400">आवश्यक फील्ड</p>
            </div>

            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleVoiceInput}
                    size="lg"
                    variant={isListening ? "destructive" : "default"}
                    className="rounded-full"
                  >
                    {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </Button>
                  <div className="flex-1">
                    <Input
                      value={currentField?.value || ""}
                      onChange={(e) => updateFieldValue(currentFieldIndex, e.target.value)}
                      placeholder="या यहाँ टाइप करें..."
                      className="text-lg"
                    />
                  </div>
                </div>
                {isListening && (
                  <div className="mt-3 text-center">
                    <div className="inline-flex items-center gap-2 text-sm text-blue-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      सुन रहे हैं...
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentFieldIndex(Math.max(0, currentFieldIndex - 1))}
                disabled={currentFieldIndex === 0}
              >
                पिछला
              </Button>
              <Button onClick={moveToNextField}>
                {currentFieldIndex === fields.length - 1 ? "समीक्षा करें" : "अगला"}
              </Button>
            </div>
          </div>
        )

      case "review":
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white">फॉर्म समीक्षा</h3>
              <p className="text-sm text-gray-400">Form Review</p>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <Card key={field.id} className="bg-gray-700 border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-white">{field.label}</p>
                        <p className="text-lg text-gray-200">{field.value || "खाली"}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={field.confidence > 0.8 ? "default" : "secondary"} className="text-xs">
                            {Math.round(field.confidence * 100)}% विश्वसनीय
                          </Badge>
                          {field.isRequired && !field.value && (
                            <Badge variant="destructive" className="text-xs">
                              आवश्यक
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCurrentFieldIndex(index)
                          setProcessingStep("voice")
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button onClick={handleSaveForm} className="w-full" size="lg">
              <Check className="w-5 h-5 mr-2" />
              फॉर्म सहेजें
            </Button>
          </div>
        )

      case "complete":
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-400">फॉर्म तैयार!</h3>
              <p className="text-sm text-gray-400">Form Completed Successfully</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-4 text-white">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-xl font-semibold text-white">फॉर्म प्रोसेसिंग</h2>
          <p className="text-sm text-gray-400">Form Processing</p>
        </div>
      </div>

      {renderProcessingStep()}
    </div>
  )
}
