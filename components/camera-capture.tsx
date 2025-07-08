"use client"

import { useState, useRef, useCallback } from "react"
import { Camera, RotateCcw, Check, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useVoiceInterface } from "@/hooks/use-voice-interface"

interface CameraCaptureProps {
  onImageCaptured: (image: string) => void
  onBack: () => void
}

export default function CameraCapture({ onImageCaptured, onBack }: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { speak } = useVoiceInterface()

  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      speak("कैमरा तैयार है। फॉर्म को फ्रेम में रखें और फोटो बटन दबाएं।", "hi")
    } catch (error) {
      console.error("Camera access error:", error)
      speak("कैमरा एक्सेस में समस्या है। कृपया अनुमति दें।", "hi")
    } finally {
      setIsLoading(false)
    }
  }, [speak])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0)

    const imageData = canvas.toDataURL("image/jpeg", 0.8)
    setCapturedImage(imageData)
    speak("फोटो ली गई। अगर यह सही है तो टिक करें, नहीं तो दोबारा लें।", "hi")
  }, [speak])

  const retakePhoto = useCallback(() => {
    setCapturedImage(null)
    speak("दोबारा फोटो लेने के लिए तैयार।", "hi")
  }, [speak])

  const confirmPhoto = useCallback(() => {
    if (capturedImage) {
      onImageCaptured(capturedImage)
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [capturedImage, onImageCaptured, stream])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    onBack()
  }, [stream, onBack])

  return (
    <div className="space-y-4 text-white">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={stopCamera}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-xl font-semibold text-white">फॉर्म स्कैन करें</h2>
          <p className="text-sm text-gray-400">Scan Form</p>
        </div>
      </div>

      <Card className="bg-gray-700 border-gray-600">
        <CardContent className="p-4">
          <div className="relative aspect-[4/3] bg-gray-800 rounded-lg overflow-hidden">
            {!stream && !capturedImage && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Camera className="w-12 h-12 text-gray-400 mb-4" />
                <Button onClick={startCamera} disabled={isLoading}>
                  {isLoading ? "कैमरा शुरू हो रहा है..." : "कैमरा शुरू करें"}
                </Button>
              </div>
            )}

            {stream && !capturedImage && (
              <>
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-0 border-2 border-dashed border-white/50 m-4 rounded-lg flex items-center justify-center">
                  <div className="text-white text-center bg-black/50 px-3 py-1 rounded">
                    <p className="text-sm">फॉर्म को यहाँ रखें</p>
                  </div>
                </div>
              </>
            )}

            {capturedImage && (
              <img
                src={capturedImage || "/placeholder.svg"}
                alt="Captured form"
                className="w-full h-full object-cover"
              />
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="flex justify-center gap-4 mt-4">
            {stream && !capturedImage && (
              <Button onClick={capturePhoto} size="lg" className="rounded-full">
                <Camera className="w-6 h-6" />
              </Button>
            )}

            {capturedImage && (
              <>
                <Button onClick={retakePhoto} variant="outline" size="lg">
                  <RotateCcw className="w-5 h-5 mr-2" />
                  दोबारा लें
                </Button>
                <Button onClick={confirmPhoto} size="lg">
                  <Check className="w-5 h-5 mr-2" />
                  पुष्टि करें
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-gray-300 space-y-1">
        <p>• फॉर्म को अच्छी रोशनी में रखें</p>
        <p>• सभी टेक्स्ट साफ दिखना चाहिए</p>
        <p>• फॉर्म को सीधा रखें</p>
      </div>
    </div>
  )
}
