export const bilingualLabels: Record<string, string> = {
  // Personal Information
  applicant_name: "Name / नाम",
  account_holder_name: "Name / नाम",
  beneficiary_name: "Name / नाम",
  head_of_family: "Name / नाम",
  aadhaar_number: "Aadhaar Number / आधार संख्या",
  date_of_birth: "Date of Birth / जन्म तिथि",
  gender: "Gender / लिंग",
  address: "Address / पता",
  current_address: "Current Address / वर्तमान पता",
  permanent_address: "Permanent Address / स्थायी पता",
  residential_address: "Residential Address / आवासीय पता",
  pincode: "PIN Code / पिन कोड",
  state: "State / राज्य",
  district: "District / जिला",

  // Contact Information
  phone_number: "Phone Number / फोन नंबर",
  mobile_number: "Mobile Number / मोबाइल नंबर",
  email: "Email / ईमेल",

  // Financial Information
  monthly_income: "Monthly Income / मासिक आय",
  annual_income: "Annual Income / वार्षिक आय",
  monthly_household_income: "Monthly Household Income / मासिक घरेलू आय",
  annual_family_income: "Annual Family Income / वार्षिक पारिवारिक आय",

  // Family Information
  family_size: "Family Size / परिवार का आकार",
  family_members: "Family Members / परिवार के सदस्य",
  family_head_name: "Family Head Name / परिवार के मुखिया का नाम",

  // Banking Information
  nominee_name: "Nominee Name / नामांकित व्यक्ति का नाम",
  nominee_relation: "Relationship with Nominee / नामांकित व्यक्ति के साथ संबंध",

  // Document Types
  card_type: "Card Type / कार्ड प्रकार",

  // Default fallback
  default: "Field / फील्ड",
}

export const getFieldLabel = (fieldId: string): string => {
  return bilingualLabels[fieldId] || bilingualLabels.default
}
