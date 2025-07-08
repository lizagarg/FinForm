"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Save, Edit, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useOfflineStorage } from "@/hooks/use-offline-storage"
import { useVoiceInterface } from "@/hooks/use-voice-interface"

interface UserProfileProps {
  onBack: () => void
}

interface ProfileData {
  name: string
  fatherName: string
  address: string
  phoneNumber: string
  aadhaarNumber: string
  dateOfBirth: string
  bankAccount: string
  ifscCode: string
}

export default function UserProfile({ onBack }: UserProfileProps) {
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    fatherName: "",
    address: "",
    phoneNumber: "",
    aadhaarNumber: "",
    dateOfBirth: "",
    bankAccount: "",
    ifscCode: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const { getUserProfile, saveUserProfile } = useOfflineStorage()
  const { speak } = useVoiceInterface()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const savedProfile = await getUserProfile()
      if (savedProfile) {
        setProfile(savedProfile)
      } else {
        setIsEditing(true)
        speak("कृपया अपनी प्रोफाइल जानकारी भरें। यह आपके फॉर्म भरने में मदद करेगी।", "hi")
      }
    } catch (error) {
      console.error("Load profile error:", error)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await saveUserProfile(profile)
      setIsEditing(false)
      speak("प्रोफाइल सफलतापूर्वक सहेजी गई।", "hi")
    } catch (error) {
      console.error("Save profile error:", error)
      speak("प्रोफाइल सहेजने में समस्या है।", "hi")
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const profileFields = [
    { key: "name" as keyof ProfileData, label: "नाम / Name", type: "text", required: true },
    { key: "fatherName" as keyof ProfileData, label: "पिता का नाम / Father's Name", type: "text", required: true },
    { key: "address" as keyof ProfileData, label: "पता / Address", type: "text", required: true },
    { key: "phoneNumber" as keyof ProfileData, label: "फोन नंबर / Phone Number", type: "tel", required: true },
    { key: "aadhaarNumber" as keyof ProfileData, label: "आधार नंबर / Aadhaar Number", type: "text", required: false },
    { key: "dateOfBirth" as keyof ProfileData, label: "जन्म तिथि / Date of Birth", type: "date", required: true },
    { key: "bankAccount" as keyof ProfileData, label: "बैंक खाता / Bank Account", type: "text", required: false },
    { key: "ifscCode" as keyof ProfileData, label: "IFSC कोड / IFSC Code", type: "text", required: false },
  ]

  return (
    <div className="space-y-4 text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-xl font-semibold text-white">मेरी प्रोफाइल</h2>
            <p className="text-sm text-gray-400">My Profile</p>
          </div>
        </div>

        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="w-4 h-4 mr-2" />
            संपादित करें
          </Button>
        )}
      </div>

      <Card className="bg-gray-700 border-gray-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <User className="w-5 h-5" />
            व्यक्तिगत जानकारी
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profileFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key} className="text-sm font-medium text-white">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Input
                id={field.key}
                type={field.type}
                value={profile[field.key]}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50" : ""}
                placeholder={isEditing ? `${field.label} दर्ज करें` : ""}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {isEditing && (
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setIsEditing(false)
              loadProfile()
            }}
            className="flex-1"
          >
            रद्द करें
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "सहेज रहे हैं..." : "सहेजें"}
          </Button>
        </div>
      )}

      <Card className="bg-blue-900/30 border-blue-700">
        <CardContent className="p-4">
          <div className="text-sm text-blue-200">
            <p className="font-medium mb-2 text-blue-100">💡 सुझाव:</p>
            <ul className="space-y-1 text-xs">
              <li>• यह जानकारी आपके डिवाइस पर सुरक्षित रूप से सहेजी जाती है</li>
              <li>• फॉर्म भरते समय यह जानकारी अपने आप भर जाएगी</li>
              <li>• आप कभी भी इसे अपडेट कर सकते हैं</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
