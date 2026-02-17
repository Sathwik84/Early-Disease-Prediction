def explain_brain(prediction: str):
    return {
        "summary": (
            f"The MRI scan indicates a pattern consistent with {prediction}. "
            "This may require further clinical correlation and specialist review."
        )
    }


def explain_lung(prediction: str):
    return {
        "summary": (
            f"The chest X-ray analysis suggests {prediction}. "
            "Radiological findings should be confirmed by a pulmonologist."
        )
    }


def explain_biomarkers(disease: str, biomarkers: list):
    return {
        "biomarkers": biomarkers
    }
