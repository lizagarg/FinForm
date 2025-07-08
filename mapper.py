import spacy
from transformers import BertTokenizer, BertModel
import torch
from sklearn.metrics.pairwise import cosine_similarity
import json

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained('bert-base-uncased')

# --- Templates ---
pmay_template = {
    "Applicant Name": "",
    "Date of Birth": "",
    "Aadhaar Number": "",
    "Full Address": "",
    "Contact Number": "",
    "Annual Family Income": ""
}


jandhan_template = {
    "Full Name": "",
    "Residential Address": "",
    "Aadhaar Card No.": "",
    "Mobile Number": "",
    "Occupation": "",
    "PAN Card Number": ""
}

# --- Sample Aadhaar Data ---
aadhaar_sample = {
    "name": "Sita Devi",
    "dob": "1985-06-15",
    "gender": "Female",
    "aadhaar_number": "1234-5678-9012",
    "address": "123 MG Road, Koramangala, Bengaluru, Karnataka 560034",
    "phone": "9876543210",
    "income": "50000",
    "occupation": "Farmer",
    "pan_number": "ABCDE1234F"
}


# --- Helper Functions ---
def get_embedding(text):
    """Get BERT embedding for a given text."""
    with torch.no_grad():
        inputs = tokenizer(text, return_tensors='pt')
        outputs = model(**inputs)
        return outputs.last_hidden_state.mean(dim=1).numpy()[0]

def map_fields(form_fields, aadhaar_fields):
    manual_mappings = {
        "Applicant Name": "name",
        "Full Name": "name",
        "Date of Birth": "dob",
        "Aadhaar Number": "aadhaar_number",
        "Aadhaar Card No.": "aadhaar_number",
        "Full Address": "address",
        "Residential Address": "address",
        "Contact Number": "phone",
        "Mobile Number": "phone",
        "Annual Family Income": "income",
        "Occupation": "occupation",
        "PAN Card Number": "pan_number"
    }
    
    mapping = {}
    for form_field in form_fields:
        if form_field in manual_mappings:
            mapping[form_field] = manual_mappings[form_field]
        else:
            form_embedding = get_embedding(form_field.lower().strip())
            similarities = []
            for aadhaar_field in aadhaar_fields:
                aadhaar_embedding = get_embedding(aadhaar_field.lower().strip())
                sim = cosine_similarity([form_embedding], [aadhaar_embedding])[0][0]
                similarities.append((aadhaar_field, sim))
            best_match = max(similarities, key=lambda x: x[1])
            mapping[form_field] = best_match[0] if best_match[1] > 0.7 else None
    return mapping


def fill_form(form_template, aadhaar_data, field_mapping):
    """Fill the form using Aadhaar data and field mapping."""
    filled = {}
    missing = []
    for form_field in form_template:
        aadhaar_key = field_mapping.get(form_field)
        value = aadhaar_data.get(aadhaar_key, "") if aadhaar_key else ""
        filled[form_field] = value
        if value == "":
            missing.append(form_field)
    return filled, missing

# --- Main Workflow ---
if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: py mapper.py [pmay|jandhan]")
        sys.exit(1)

    form_choice = sys.argv[1].lower()

    if form_choice == "pmay":
        form_template = pmay_template
    elif form_choice == "jandhan":
        form_template = jandhan_template
    else:
        print("Invalid form. Choose 'pmay' or 'jandhan'.")
        sys.exit(1)


    # Map fields
    form_fields = list(form_template.keys())
    aadhaar_fields = list(aadhaar_sample.keys())
    field_mapping = map_fields(form_fields, aadhaar_fields)

    # Fill form
    filled_form, missing_fields = fill_form(form_template, aadhaar_sample, field_mapping)

    # Output results
    print("\n--- Auto-filled Form ---")
    print(json.dumps(filled_form, indent=4, ensure_ascii=False))

    if missing_fields:
        print("\nFields needing fallback input:")
        for field in missing_fields:
            print(f"- {field}")

    # Save to JSON file
    output_filename = f"filled_{form_choice}.json"
    with open(output_filename, 'w', encoding='utf-8') as f:
        json.dump(filled_form, f, indent=4, ensure_ascii=False)
    print(f"\nFilled form saved as '{output_filename}'.")

