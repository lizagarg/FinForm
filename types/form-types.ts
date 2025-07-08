export interface AadhaarData {
  name: string
  aadhaarNumber: string
  dateOfBirth: string
  gender: string
  address: string
  pincode: string
  state: string
  district: string
  phoneNumber?: string
  email?: string
}

export interface FormField {
  id: string
  label: string
  type: "text" | "email" | "tel" | "date" | "number" | "textarea"
  required: boolean
  autoFillable: boolean
  aadhaarMapping?: string
  placeholder?: string
}

export interface FormTemplate {
  id: string
  name: string
  description: string
  department: string
  fields: FormField[]
}

export interface FormData {
  formId: string
  formName: string
  data: Record<string, string>
  submittedAt: string
}
