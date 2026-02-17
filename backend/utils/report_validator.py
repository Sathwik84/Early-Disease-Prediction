# backend/utils/report_validator.py

KEYWORDS = {
    "brain": [
        "mri", "brain", "glioma", "meningioma", "pituitary", "tumor"
    ],
    "lung": [
        "chest", "x-ray", "xray", "lung", "pneumonia", "opacity"
    ]
}


def validate_report_for_disease(text: str, disease: str) -> bool:
    text = text.lower()
    keywords = KEYWORDS.get(disease, [])
    return any(word in text for word in keywords)
