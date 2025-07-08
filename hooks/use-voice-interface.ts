"use client"

import { useState, useCallback, useRef } from "react"
import type SpeechRecognition from "speech-recognition"

interface VoiceInterfaceHook {
  speak: (text: string, lang?: string) => void
  listen: () => Promise<string>
  stopListening: () => void
  isSupported: boolean
  isListening: boolean
}

export function useVoiceInterface(): VoiceInterfaceHook {
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  const isSupported =
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)

  const speak = useCallback(
    (text: string, lang = "hi-IN") => {
      if (!isSupported || !text) return

      try {
        const synth = window.speechSynthesis
        const utterance = new SpeechSynthesisUtterance(text)

        utterance.lang = lang
        utterance.rate = 0.8
        utterance.pitch = 1
        utterance.volume = 1

        // Find Hindi voice if available
        const voices = synth.getVoices()
        const hindiVoice = voices.find((voice) => voice.lang.includes("hi") || voice.lang.includes("Hindi"))

        if (hindiVoice) {
          utterance.voice = hindiVoice
        }

        synth.speak(utterance)
      } catch (error) {
        console.error("Speech synthesis error:", error)
      }
    },
    [isSupported],
  )

  const listen = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!isSupported) {
        reject(new Error("Speech recognition not supported"))
        return
      }

      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        const recognition = new SpeechRecognition()

        recognition.lang = "hi-IN"
        recognition.continuous = false
        recognition.interimResults = false
        recognition.maxAlternatives = 1

        recognition.onstart = () => {
          setIsListening(true)
        }

        recognition.onresult = (event) => {
          const result = event.results[0][0].transcript
          resolve(result)
        }

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error)
          reject(new Error(`Speech recognition error: ${event.error}`))
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current = recognition
        recognition.start()
      } catch (error) {
        console.error("Speech recognition setup error:", error)
        reject(error)
      }
    })
  }, [isSupported])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }, [])

  return {
    speak,
    listen,
    stopListening,
    isSupported,
    isListening,
  }
}
