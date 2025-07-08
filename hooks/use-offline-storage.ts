"use client"

import { useState, useEffect, useCallback } from "react"

interface UserProfile {
  name: string
  fatherName: string
  address: string
  phoneNumber: string
  aadhaarNumber: string
  dateOfBirth: string
  bankAccount: string
  ifscCode: string
}

interface FormData {
  id: string
  fields: any[]
  image: string
  createdAt: string
  status: "draft" | "completed"
}

interface OfflineStorageHook {
  getUserProfile: () => Promise<UserProfile | null>
  saveUserProfile: (profile: UserProfile) => Promise<void>
  saveForm: (form: FormData) => Promise<void>
  getForms: () => Promise<FormData[]>
  deleteForm: (id: string) => Promise<void>
  isReady: boolean
}

export function useOfflineStorage(): OfflineStorageHook {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Initialize IndexedDB or localStorage
    setIsReady(true)
  }, [])

  const encrypt = useCallback((data: string): string => {
    // Simple encryption for demo - in production use proper encryption
    return btoa(data)
  }, [])

  const decrypt = useCallback((data: string): string => {
    try {
      return atob(data)
    } catch {
      return data
    }
  }, [])

  const getUserProfile = useCallback(async (): Promise<UserProfile | null> => {
    try {
      const encryptedProfile = localStorage.getItem("sahayika_profile")
      if (!encryptedProfile) return null

      const profileData = decrypt(encryptedProfile)
      return JSON.parse(profileData)
    } catch (error) {
      console.error("Get profile error:", error)
      return null
    }
  }, [decrypt])

  const saveUserProfile = useCallback(
    async (profile: UserProfile): Promise<void> => {
      try {
        const profileData = JSON.stringify(profile)
        const encryptedProfile = encrypt(profileData)
        localStorage.setItem("sahayika_profile", encryptedProfile)
      } catch (error) {
        console.error("Save profile error:", error)
        throw error
      }
    },
    [encrypt],
  )

  const saveForm = useCallback(
    async (form: FormData): Promise<void> => {
      try {
        const forms = await getForms()
        const updatedForms = [...forms, form]
        const formsData = JSON.stringify(updatedForms)
        const encryptedForms = encrypt(formsData)
        localStorage.setItem("sahayika_forms", encryptedForms)
      } catch (error) {
        console.error("Save form error:", error)
        throw error
      }
    },
    [encrypt],
  )

  const getForms = useCallback(async (): Promise<FormData[]> => {
    try {
      const encryptedForms = localStorage.getItem("sahayika_forms")
      if (!encryptedForms) return []

      const formsData = decrypt(encryptedForms)
      return JSON.parse(formsData)
    } catch (error) {
      console.error("Get forms error:", error)
      return []
    }
  }, [decrypt])

  const deleteForm = useCallback(
    async (id: string): Promise<void> => {
      try {
        const forms = await getForms()
        const updatedForms = forms.filter((form) => form.id !== id)
        const formsData = JSON.stringify(updatedForms)
        const encryptedForms = encrypt(formsData)
        localStorage.setItem("sahayika_forms", encryptedForms)
      } catch (error) {
        console.error("Delete form error:", error)
        throw error
      }
    },
    [encrypt, getForms],
  )

  return {
    getUserProfile,
    saveUserProfile,
    saveForm,
    getForms,
    deleteForm,
    isReady,
  }
}
