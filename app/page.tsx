"use client"

import { useState, useEffect } from "react"
import { Camera, Mic, FileText, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import CameraCapture from "@/components/camera-capture"
import FormProcessor from "@/components/form-processor"
import UserProfile from "@/components/user-profile"
import { useVoiceInterface } from "@/hooks/use-voice-interface"
import { useOfflineStorage } from "@/hooks/use-offline-storage"

export default function SahayikaApp() {
  const [currentStep, setCurrentStep] = useState<"home" | "capture" | "process" | "profile">("home")
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isOffline, setIsOffline] = useState(false)
  const { speak, isSupported: voiceSupported } = useVoiceInterface()
  const { isReady: storageReady } = useOfflineStorage()

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    setIsOffline(!navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleWelcome = () => {
    speak("नमस्ते! मैं सहायिका हूं। आपके फॉर्म भरने में आपकी मदद करूंगी।", "hi")
  }

  useEffect(() => {
    if (voiceSupported && storageReady) {
      handleWelcome()
    }
  }, [voiceSupported, storageReady])

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "capture":
        return (
          <CameraCapture
            onImageCaptured={(image) => {
              setCapturedImage(image)
              setCurrentStep("process")
            }}
            onBack={() => setCurrentStep("home")}
          />
        )
      case "process":
        return (
          <FormProcessor
            image={capturedImage}
            onBack={() => setCurrentStep("home")}
            onComplete={() => setCurrentStep("home")}
          />
        )
      case "profile":
        return <UserProfile onBack={() => setCurrentStep("home")} />
      default:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <Mic className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">सहायिका</h1>
                <p className="text-lg text-gray-300 mt-2">आपका आवाज़-संचालित फॉर्म सहायक</p>
                <p className="text-sm text-gray-400">Your Voice-Powered Form Assistant</p>
              </div>
              <div className="flex justify-center gap-2">
                <Badge variant={isOffline ? "destructive" : "default"}>{isOffline ? "ऑफलाइन" : "ऑनलाइन"}</Badge>
                {voiceSupported && <Badge variant="secondary">आवाज़ समर्थित</Badge>}
              </div>
            </div>

            <div className="grid gap-4">
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow bg-gray-700 border-gray-600"
                onClick={() => setCurrentStep("capture")}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Camera className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-white">नया फॉर्म स्कैन करें</CardTitle>
                      <CardDescription className="text-gray-400">Scan New Form</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300">फॉर्म की फोटो लें और आवाज़ से भरें</p>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-md transition-shadow bg-gray-700 border-gray-600"
                onClick={() => setCurrentStep("profile")}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-white">मेरी प्रोफाइल</CardTitle>
                      <CardDescription className="text-gray-400">My Profile</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300">व्यक्तिगत जानकारी देखें और अपडेट करें</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow bg-gray-700 border-gray-600">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-white">सहेजे गए फॉर्म</CardTitle>
                      <CardDescription className="text-gray-400">Saved Forms</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300">पहले भरे गए फॉर्म देखें</p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button variant="outline" size="sm" onClick={handleWelcome}>
                <Mic className="w-4 h-4 mr-2" />
                सहायता सुनें
              </Button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-md mx-auto bg-gray-800 min-h-screen">
        <div className="p-6">{renderCurrentStep()}</div>
      </div>
    </div>
  )
}
