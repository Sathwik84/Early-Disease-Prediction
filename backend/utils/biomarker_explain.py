from backend.utils.biomarker_reference import HEART_REFERENCE, DIABETES_REFERENCE

def explain_biomarkers(sample: dict, disease: str):
    reference = (
        HEART_REFERENCE if disease == "heart"
        else DIABETES_REFERENCE
    )

    explanation = []

    for field, (normal_min, normal_max, display_name, unit) in reference.items():
        # Only include biomarkers present in the sample
        if field not in sample:
            continue

        value = sample[field]
        midpoint = (normal_min + normal_max) / 2
        difference = round(float(value) - midpoint, 2)
        abnormal = not (normal_min <= float(value) <= normal_max)

        # Sign-aware deviation string
        if difference > 0:
            diff_str = f"+{difference}"
        elif difference < 0:
            diff_str = str(difference)
        else:
            diff_str = "0"

        explanation.append({
            "field":        field,
            "biomarker":    display_name,
            "observed":     value,
            "unit":         unit,
            "normal_range": f"{normal_min} – {normal_max}",
            "normal_min":   normal_min,
            "normal_max":   normal_max,
            "difference":   diff_str,
            "status":       "⚠️ Abnormal" if abnormal else "✅ Normal",
            "abnormal":     abnormal
        })

    return explanation
