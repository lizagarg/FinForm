# NLP Processing Pipeline for Sahayika
# This script demonstrates the ML components for field matching and text processing

import re
import json
from typing import List, Dict, Tuple
from difflib import SequenceMatcher

class SahayikaNLP:
    def __init__(self):
        self.field_mappings = {
            # Hindi to English mappings
            'नाम': 'name',
            'पिता': 'father_name',
            'माता': 'mother_name',
            'पता': 'address',
            'फोन': 'phone',
            'मोबाइल': 'mobile',
            'आधार': 'aadhaar',
            'जन्म': 'birth_date',
            'उम्र': 'age',
            'व्यवसाय': 'occupation',
            'आय': 'income',
            'बैंक': 'bank_account',
            'हस्ताक्षर': 'signature'
        }
        
        self.common_patterns = {
            'phone': r'[6-9]\d{9}',
            'aadhaar': r'\d{4}\s?\d{4}\s?\d{4}',
            'pincode': r'\d{6}',
            'ifsc': r'[A-Z]{4}0[A-Z0-9]{6}',
            'pan': r'[A-Z]{5}\d{4}[A-Z]'
        }
    
    def extract_fields_from_ocr(self, ocr_text: str) -> List[Dict]:
        """Extract form fields from OCR text"""
        lines = ocr_text.split('\n')
        fields = []
        
        for i, line in enumerate(lines):
            line = line.strip()
            if not line:
                continue
                
            # Look for field patterns (label followed by blank space or colon)
            if ':' in line or '_' in line:
                parts = re.split(r'[:\s_]+', line)
                if len(parts) >= 2:
                    label = parts[0].strip()
                    value = parts[1].strip() if len(parts) > 1 else ''
                    
                    field = {
                        'id': f'field_{i}',
                        'label': label,
                        'value': value,
                        'confidence': self.calculate_confidence(label),
                        'field_type': self.detect_field_type(label),
                        'is_required': self.is_required_field(label)
                    }
                    fields.append(field)
        
        return fields
    
    def calculate_confidence(self, label: str) -> float:
        """Calculate confidence score for field recognition"""
        label_lower = label.lower()
        
        # Check against known field mappings
        for hindi_term in self.field_mappings:
            if hindi_term in label_lower:
                return 0.9
        
        # Check for English terms
        english_terms = ['name', 'father', 'address', 'phone', 'mobile', 'aadhaar']
        for term in english_terms:
            if term in label_lower:
                return 0.8
        
        return 0.5
    
    def detect_field_type(self, label: str) -> str:
        """Detect the type of form field"""
        label_lower = label.lower()
        
        if any(term in label_lower for term in ['फोन', 'मोबाइल', 'phone', 'mobile']):
            return 'tel'
        elif any(term in label_lower for term in ['जन्म', 'birth', 'date']):
            return 'date'
        elif any(term in label_lower for term in ['आय', 'income', 'amount', 'राशि']):
            return 'number'
        elif any(term in label_lower for term in ['पता', 'address']):
            return 'textarea'
        else:
            return 'text'
    
    def is_required_field(self, label: str) -> bool:
        """Determine if a field is required"""
        required_terms = ['नाम', 'name', 'पिता', 'father', 'आधार', 'aadhaar']
        label_lower = label.lower()
        return any(term in label_lower for term in required_terms)
    
    def match_with_profile(self, fields: List[Dict], profile: Dict) -> List[Dict]:
        """Match form fields with user profile data"""
        matched_fields = []
        
        for field in fields:
            matched_field = field.copy()
            
            # Try to find matching profile data
            profile_value = self.find_profile_match(field['label'], profile)
            if profile_value:
                matched_field['value'] = profile_value
                matched_field['confidence'] = min(matched_field['confidence'] + 0.2, 1.0)
            
            matched_fields.append(matched_field)
        
        return matched_fields
    
    def find_profile_match(self, field_label: str, profile: Dict) -> str:
        """Find matching value from user profile"""
        label_lower = field_label.lower()
        
        # Direct mappings
        if any(term in label_lower for term in ['नाम', 'name']):
            return profile.get('name', '')
        elif any(term in label_lower for term in ['पिता', 'father']):
            return profile.get('father_name', '')
        elif any(term in label_lower for term in ['पता', 'address']):
            return profile.get('address', '')
        elif any(term in label_lower for term in ['फोन', 'phone', 'mobile']):
            return profile.get('phone_number', '')
        elif any(term in label_lower for term in ['आधार', 'aadhaar']):
            return profile.get('aadhaar_number', '')
        elif any(term in label_lower for term in ['जन्म', 'birth']):
            return profile.get('date_of_birth', '')
        elif any(term in label_lower for term in ['बैंक', 'bank']):
            return profile.get('bank_account', '')
        elif 'ifsc' in label_lower:
            return profile.get('ifsc_code', '')
        
        return ''
    
    def validate_field_data(self, field_type: str, value: str) -> Tuple[bool, str]:
        """Validate field data based on type"""
        if not value:
            return True, ""  # Empty values are handled by required field check
        
        if field_type == 'tel':
            if re.match(self.common_patterns['phone'], value):
                return True, ""
            else:
                return False, "कृपया सही फोन नंबर दर्ज करें"
        
        elif field_type == 'aadhaar':
            clean_aadhaar = re.sub(r'\s', '', value)
            if re.match(self.common_patterns['aadhaar'], clean_aadhaar):
                return True, ""
            else:
                return False, "कृपया सही आधार नंबर दर्ज करें"
        
        elif field_type == 'date':
            # Basic date validation
            date_patterns = [r'\d{2}/\d{2}/\d{4}', r'\d{2}-\d{2}-\d{4}']
            if any(re.match(pattern, value) for pattern in date_patterns):
                return True, ""
            else:
                return False, "कृपया सही तारीख दर्ज करें (DD/MM/YYYY)"
        
        return True, ""
    
    def similarity_score(self, text1: str, text2: str) -> float:
        """Calculate similarity between two text strings"""
        return SequenceMatcher(None, text1.lower(), text2.lower()).ratio()

# Example usage
if __name__ == "__main__":
    nlp = SahayikaNLP()
    
    # Sample OCR text
    sample_ocr = """
    नाम / Name: ________________
    पिता का नाम / Father's Name: ________________
    पता / Address: ________________
    फोन नंबर / Phone Number: ________________
    आधार नंबर / Aadhaar Number: ________________
    """
    
    # Sample user profile
    sample_profile = {
        'name': 'सुनीता देवी',
        'father_name': 'राम प्रसाद',
        'address': 'गांव - रामपुर, जिला - सीतापुर, उत्तर प्रदेश - 261001',
        'phone_number': '9876543210',
        'aadhaar_number': '1234 5678 9012'
    }
    
    # Process form
    fields = nlp.extract_fields_from_ocr(sample_ocr)
    matched_fields = nlp.match_with_profile(fields, sample_profile)
    
    print("Extracted and matched fields:")
    for field in matched_fields:
        print(f"Label: {field['label']}")
        print(f"Value: {field['value']}")
        print(f"Confidence: {field['confidence']:.2f}")
        print(f"Type: {field['field_type']}")
        print("---")
