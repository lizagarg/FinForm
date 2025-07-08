# ==============================================================================
# File: backend/speech_service.py
# Responsibility: Team B
# ==============================================================================

import time

def transcribe_audio(audio_bytes):
    """
    Simulates the Speech-to-Text process by Team B (Fallback).
    
    Args:
        audio_bytes (bytes): The audio data captured from the user's microphone.
        
    Returns:
        str: The transcribed text.
    """
    print("BACKEND: Speech service transcribing audio...")
    time.sleep(2)
    
    # This is a mock transcription. A real implementation would use a
    # speech-to-text API (e.g., Google Speech-to-Text, Whisper).
    # We will return a fixed value for demonstration.
    transcribed_text = "9876543210"
    print(f"BACKEND: Speech service returned: '{transcribed_text}'")
    return transcribed_text
