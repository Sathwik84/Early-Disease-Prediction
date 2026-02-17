from backend.utils.biomarker_reference import (
    HEART_REFERENCE,
    DIABETES_REFERENCE
)

def explain_biomarkers(sample: dict, disease: str):
    explanation = []

    reference = (
        HEART_REFERENCE if disease == "heart"
        else DIABETES_REFERENCE
    )

    for biomarker, value in sample.items():
        if biomarker not in reference:
            continue

        normal_min, normal_max = reference[biomarker]
        abnormal = not (normal_min <= value <= normal_max)

        explanation.append({
            "biomarker": biomarker,
            "observed": value,
            "normal_range": f"{normal_min} – {normal_max}",
            "status": "⚠️ Abnormal" if abnormal else "Normal"
        })

    return explanation
