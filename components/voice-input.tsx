"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, MicOff, Volume2, X } from "lucide-react"

interface VoiceInputProps {
  onTranscript: (transcript: string) => void
  onClose: () => void
}

export default function VoiceInput({ onTranscript, onClose }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check if speech recognition is supported
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      setIsSupported(!!SpeechRecognition)

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = ""
          let interimTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }

          setTranscript(finalTranscript + interimTranscript)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current && isSupported) {
      setTranscript("")
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }

  const handleConfirm = () => {
    if (transcript.trim()) {
      onTranscript(transcript.trim())
    }
  }

  const handleCancel = () => {
    stopListening()
    onClose()
  }

  if (!isSupported) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 text-orange-700">
            <Volume2 className="w-4 h-4" />
            <span className="text-sm">Voice input is not supported in your browser. Please type manually.</span>
          </div>
          <Button variant="outline" size="sm" onClick={onClose} className="mt-2 bg-transparent">
            Close
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="pt-4">
        <div className="space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isListening ? (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-red-700">Listening...</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Voice Input</span>
                </>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Transcript */}
          {transcript && (
            <div className="bg-white border rounded p-3 min-h-[60px]">
              <p className="text-sm text-gray-700">{transcript || "Start speaking..."}</p>
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-2">
            {!isListening ? (
              <Button onClick={startListening} size="sm" className="flex-1">
                <Mic className="w-4 h-4 mr-2" />
                Start Recording
              </Button>
            ) : (
              <Button onClick={stopListening} variant="destructive" size="sm" className="flex-1">
                <MicOff className="w-4 h-4 mr-2" />
                Stop Recording
              </Button>
            )}

            {transcript && (
              <Button onClick={handleConfirm} variant="outline" size="sm">
                Use This Text
              </Button>
            )}
          </div>

          <p className="text-xs text-blue-600">Speak clearly and wait for the text to appear above.</p>
        </div>
      </CardContent>
    </Card>
  )
}
