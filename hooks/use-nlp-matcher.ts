"use client"

import { useCallback } from "react"

interface FormField {
  id: string
  label: string
  value: string
  confidence: number
  isRequired: boolean
  fieldType: "text" | "number" | "date" | "select"
}

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

interface NLPMatcherHook {
  matchFields: (fields: FormField[], profile: UserProfile | null) => Promise<FormField[]>
  getProfileSuggestion: (fieldLabel: string, profile: UserProfile | null) => string
}

export function useNLPMatcher(): NLPMatcherHook {
  const matchFields = useCallback(async (fields: FormField[], profile: UserProfile | null): Promise<FormField[]> => {
    if (!profile) return fields

    // Simulate NLP matching with semantic similarity
    const fieldMappings: Record<string, keyof UserProfile> = {
      नाम: "name",
      name: "name",
      पिता: "fatherName",
      father: "fatherName",
      पता: "address",
      address: "address",
      फोन: "phoneNumber",
      phone: "phoneNumber",
      mobile: "phoneNumber",
      आधार: "aadhaarNumber",
      aadhaar: "aadhaarNumber",
      aadhar: "aadhaarNumber",
      जन्म: "dateOfBirth",
      birth: "dateOfBirth",
      dob: "dateOfBirth",
      बैंक: "bankAccount",
      bank: "bankAccount",
      account: "bankAccount",
      ifsc: "ifscCode",
    }

    return fields.map((field) => {
      const labelLower = field.label.toLowerCase()

      // Find matching profile field
      for (const [key, profileKey] of Object.entries(fieldMappings)) {
        if (labelLower.includes(key)) {
          const profileValue = profile[profileKey]
          if (profileValue) {
            return {
              ...field,
              value: profileValue,
              confidence: 0.9,
            }
          }
        }
      }

      return field
    })
  }, [])

  const getProfileSuggestion = useCallback((fieldLabel: string, profile: UserProfile | null): string => {
    if (!profile) return ""

    const labelLower = fieldLabel.toLowerCase()

    if (labelLower.includes("नाम") || labelLower.includes("name")) {
      return profile.name
    }
    if (labelLower.includes("पिता") || labelLower.includes("father")) {
      return profile.fatherName
    }
    if (labelLower.includes("पता") || labelLower.includes("address")) {
      return profile.address
    }
    if (labelLower.includes("फोन") || labelLower.includes("phone")) {
      return profile.phoneNumber
    }
    if (labelLower.includes("आधार") || labelLower.includes("aadhaar")) {
      return profile.aadhaarNumber
    }
    if (labelLower.includes("जन्म") || labelLower.includes("birth")) {
      return profile.dateOfBirth
    }
    if (labelLower.includes("बैंक") || labelLower.includes("bank")) {
      return profile.bankAccount
    }
    if (labelLower.includes("ifsc")) {
      return profile.ifscCode
    }

    return ""
  }, [])

  return {
    matchFields,
    getProfileSuggestion,
  }
}
