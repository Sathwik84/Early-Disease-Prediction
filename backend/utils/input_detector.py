# utils/input_detector.py

def detect_input_type(filename: str):
    name = filename.lower()

    if "mri" in name or "brain" in name:
        return "mri"
    elif "xray" in name or "chest" in name or "lung" in name:
        return "xray"
    elif filename.endswith(".csv") or filename.endswith(".json"):
        return "numeric"
    else:
        return "unknown"
