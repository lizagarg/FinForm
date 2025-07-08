# ==============================================================================
# File: app.py
# Responsibility: Team A (UI & Integration)
# ==============================================================================

import streamlit as st
import json
import os

# --- Import functions from the backend services ---
from backend.ocr_service import run_ocr
from backend.nlp_mapper import map_data_to_form
from backend.speech_service import transcribe_audio

# --- UI Configuration ---
st.set_page_config(page_title="Aadhaar Form Autofill", layout="wide")

# --- Initialize Session State ---
if 'page' not in st.session_state:
    st.session_state.page = 'home'
if 'form_data' not in st.session_state:
    st.session_state.form_data = {}
if 'uploaded_image' not in st.session_state:
    st.session_state.uploaded_image = None
if 'selected_form' not in st.session_state:
    st.session_state.selected_form = None

# --- Helper function to get form options ---
def get_form_options():
    """Scans the form_templates directory to get available forms."""
    template_dir = 'form_templates'
    if not os.path.exists(template_dir):
        return []
    options = []
    for filename in os.listdir(template_dir):
        if filename.endswith('.json'):
            with open(os.path.join(template_dir, filename), 'r') as f:
                try:
                    data = json.load(f)
                    options.append(data.get("form_name", "Unknown Form"))
                except json.JSONDecodeError:
                    print(f"Warning: Could not parse {filename}")
    return options

# --- UI Pages ---

def home_page():
    """Page 1: Home/Upload Page"""
    st.title("📄 Aadhaar-Based Form Autofill")
    st.markdown("Welcome! This tool helps you fill government forms quickly using your Aadhaar card.")

    st.header("Step 1: Upload your Aadhaar Card Image")
    uploaded_file = st.file_uploader(
        "Choose an image file",
        type=["png", "jpg", "jpeg"],
        help="Upload a clear picture of your Aadhaar card."
    )

    if uploaded_file:
        st.session_state.uploaded_image = uploaded_file.getvalue()
        st.image(st.session_state.uploaded_image, caption="Uploaded Aadhaar Card", width=300)

    st.header("Step 2: Select a Government Form")
    form_options = get_form_options()
    if not form_options:
        st.error("Could not find any form templates. Make sure the 'form_templates' directory exists and contains valid .json files.")
        return

    st.session_state.selected_form = st.selectbox(
        "Choose a form template from the list:",
        options=form_options
    )

    if st.session_state.uploaded_image and st.session_state.selected_form:
        if st.button("🚀 Process and Fill Form", type="primary"):
            st.session_state.page = 'fill_form'
            st.rerun()

def fill_form_page():
    """Page 2: Form Filling & Verification"""
    st.title("📝 Auto-Filling Form")
    st.markdown(f"**Selected Form:** `{st.session_state.selected_form}`")

    col1, col2 = st.columns(2)

    with col1:
        st.header("Your Aadhaar Card")
        st.image(st.session_state.uploaded_image, use_column_width=True)

    with col2:
        st.header("Auto-Filled Form")
        st.info("Please verify the auto-filled information and provide any missing details.")

        # Check if form data has already been processed
        if not st.session_state.form_data:
            with st.spinner("Extracting data and filling the form... Please wait."):
                # INTEGRATION: Call backend services
                ocr_result = run_ocr(st.session_state.uploaded_image)
                form_fields = map_data_to_form(ocr_result, st.session_state.selected_form)
                st.session_state.form_data = form_fields

        # Display form fields for user input
        for field, value in st.session_state.form_data.items():
            if value:
                st.session_state.form_data[field] = st.text_input(f"✅ {field}", value=value, key=f"field_{field}")
            else:
                st.warning(f"**Missing Information:** The field `{field}` could not be filled automatically.")
                input_col, audio_col = st.columns([3, 1])
                with input_col:
                    st.session_state.form_data[field] = st.text_input(f"❓ {field}", placeholder="Type the information here", key=f"field_{field}")
                with audio_col:
                    st.markdown("Or speak:")
                    if st.button("🎤 Record", key=f"audio_{field}"):
                        # INTEGRATION: Call fallback speech service
                        transcribed_text = transcribe_audio(None) # Pass actual audio bytes in a real app
                        st.session_state.form_data[field] = transcribed_text
                        st.rerun()

        if st.button("✅ All Information is Correct - Preview Final Form", type="primary"):
            st.session_state.page = 'preview'
            st.rerun()

def preview_page():
    """Page 3: Preview & Download Page"""
    st.title("🎉 Form Completed!")
    st.balloons()
    st.header("Final Form Data Preview")
    st.markdown("Here is the final data that has been compiled. You can now download it as a JSON file.")

    st.json(st.session_state.form_data)

    json_string = json.dumps(st.session_state.form_data, indent=4)
    file_name = f"{st.session_state.selected_form.replace(' ', '_')}_data.json"

    st.header("Download Your Form Data")
    st.download_button(
        label="📥 Download as .json",
        data=json_string,
        file_name=file_name,
        mime="application/json",
        type="primary"
    )

    if st.button("⬅️ Start Over"):
        keys_to_clear = list(st.session_state.keys())
        for key in keys_to_clear:
            del st.session_state[key]
        st.rerun()


# --- Main App Router ---
if __name__ == "__main__":
    if st.session_state.page == 'home':
        home_page()
    elif st.session_state.page == 'fill_form':
        fill_form_page()
    elif st.session_state.page == 'preview':
        preview_page()
    else:
        home_page()
