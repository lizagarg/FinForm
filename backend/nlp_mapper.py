# ==============================================================================
# File: backend/nlp_mapper.py
# Responsibility: Team D
# ==============================================================================

import json
import os
import time

def map_data_to_form(ocr_data, form_template_name):
    """
    Simulates the NLP Mapping by Team D.
    Maps extracted Aadhaar data to the fields of a selected form template.
    
    Args:
        ocr_data (dict): The data extracted by the OCR service.
        form_template_name (str): The name of the form to map to.
        
    Returns:
        dict: A dictionary with form fields as keys and mapped data as values.
              Returns None for fields that cannot be filled.
    """
    print(f"BACKEND: NLP mapper processing for form '{form_template_name}'...")
    time.sleep(1)

    # A more sophisticated NLP model would have complex mapping rules.
    # For this example, we use a direct key-matching simulation.
    mapping_rules = {
        "Applicant Name": ocr_data.get("name"),
        "Full Name": ocr_data.get("name"),
        "Date of Birth": ocr_data.get("dob"),
        "Aadhaar Number": ocr_data.get("aadhaar_number"),
        "Aadhaar Card No.": ocr_data.get("aadhaar_number"),
        "Full Address": ocr_data.get("address"),
        "Residential Address": ocr_data.get("address"),
    }

    # Load the fields from the correct JSON template file
    form_file_map = {
        "PMAY (Pradhan Mantri Awas Yojana)": "pmay_template.json",
        "Jan Dhan Yojana": "jandhan_template.json"
    }
    
    file_name = form_file_map.get(form_template_name)
    if not file_name:
        return {}

    # Correctly build the path to the template file
    template_path = os.path.join('form_templates', file_name)
    
    try:
        with open(template_path, 'r') as f:
            template = json.load(f)
        
        # Initialize form data with None for all fields
        filled_form = {field: None for field in template["fields"]}
        
        # Apply mapping rules
        for field in filled_form:
            if field in mapping_rules:
                filled_form[field] = mapping_rules[field]

        print(f"BACKEND: NLP mapper returned: {filled_form}")
        return filled_form

    except FileNotFoundError:
        print(f"ERROR: Form template not found at {template_path}")
        return {}
