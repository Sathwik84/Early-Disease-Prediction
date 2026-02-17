# utils/input_validator.py

def validate_input(disease: str, input_type: str):
    rules = {
        "BRAIN": ["mri"],
        "LUNG": ["xray", "ct"],
        "BIO": ["numeric"]
    }

    disease = disease.upper()

    if disease not in rules:
        raise ValueError("Invalid disease module selected")

    if input_type not in rules[disease]:
        raise ValueError(
            f"Invalid input for {disease} module. "
            f"Expected {rules[disease]}, but got {input_type}"
        )
