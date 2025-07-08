# ==============================================================================
# File: backend/ocr_service.py
# Responsibility: Team C
# ==============================================================================

import time

def run_ocr(image_bytes):
    """
    Simulates the OCR process by Team C.
    In a real application, this would call the OCR API or run a local model.
    
    Args:
        image_bytes (bytes): The image data from the uploaded file.
        
    Returns:
        dict: A dictionary containing the extracted data from the Aadhaar card.
    """
    print("BACKEND: OCR service processing Aadhaar image...")
    # Simulate a network delay or processing time
    time.sleep(2)
    
    # In a real scenario, you would process the 'image_bytes'.
    # For now, we return mock data.
    mock_extracted_data = {
        "name": "Priya Sharma",
        "dob": "15/08/1990",
        "gender": "Female",
        "aadhaar_number": "1234 5678 9012",
        "address": "123, MG Road, Koramangala, Bengaluru, Karnataka 560034"
    }
    print(f"BACKEND: OCR service extracted: {mock_extracted_data}")
    return mock_extracted_data
