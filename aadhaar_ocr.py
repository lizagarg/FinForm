import pytesseract
import cv2
import json
import re
import spacy

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Path to Tesseract
pytesseract.pytesseract.tesseract_cmd = r"D:\Tesseract\tesseract.exe"

def extract_text(image_path):
    img = cv2.imread(image_path)
    if img is None:
        raise FileNotFoundError(f"Image not found: {image_path}")
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return pytesseract.image_to_string(gray)

def extract_name_with_spacy(text):
    doc = nlp(text)
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            return ent.text
    return ""

def extract_aadhaar_info(front_image_path, back_image_path=None):
    front_text = extract_text(front_image_path)
    lines = [line.strip() for line in front_text.split('\n') if line.strip()]
    full_text = " ".join(lines).lower()

    name = dob = gender = aadhaar = ""
    govt_line_index = -1

    # Extract from front
    for i, line in enumerate(lines):
        line_lower = line.lower()

        if "government of india" in line_lower and govt_line_index == -1:
            govt_line_index = i

        if not dob and re.search(r'\d{2}/\d{2}/\d{4}', line_lower):
            match = re.search(r'\d{2}/\d{2}/\d{4}', line)
            if match:
                dob = match.group(0)
            if i > 0 and not name:
                name = lines[i - 1].strip()

        if any(g in line_lower for g in ["female", "f"]):
            gender = "Female"
        elif any(g in line_lower for g in ["male", "m"]):
            gender = "Male"

        if not aadhaar:
            match = re.search(r'\d{4}[\s\-]?\d{4}[\s\-]?\d{4}', line)
            if match:
                aadhaar = match.group(0).replace('-', ' ').strip()

    # Use spaCy to override name if confident
    spacy_name = extract_name_with_spacy(front_text)
    if spacy_name and len(spacy_name.split()) >= 2:
        name = spacy_name.strip()

    name = re.sub(r'[^A-Za-z ]+', '', name).strip()

    # Back side parsing (only for father name now)
    father_name = ""
    if back_image_path:
        back_text = extract_text(back_image_path)

        for line in back_text.split('\n'):
            line = line.strip()
            if not line:
                continue

            # Extract and skip full line with D/O, C/O, S/O
            if re.search(r'(C/O|S/O|D/O)', line, re.IGNORECASE):
                if not father_name:
                    match = re.search(r'(?:C/O|S/O|D/O)\s*[:\-]?\s*([A-Za-z .]+)', line, re.IGNORECASE)
                    if match:
                        father_name = match.group(1).strip()
                continue

    return {
        "name": name,
        "father_name": father_name,
        "dob": dob,
        "gender": gender,
        "aadhaar": aadhaar
    }

# Run the script
if __name__ == "__main__":
    result = extract_aadhaar_info("aadhar_sample4front.jpg", "aadhar_sample4back.jpg")
    print(json.dumps(result, indent=2))

    with open("aadhaar_profile.json", "w") as f:
        json.dump(result, f, indent=2)
