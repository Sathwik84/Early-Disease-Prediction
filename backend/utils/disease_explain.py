def explain_disease(disease: str, prediction: str):
    disease = disease.lower()

    explanations = {
        "brain": {
            "glioma": "Glioma is a tumor that arises from glial cells in the brain.",
            "meningioma": "Meningioma is a tumor that forms in the meninges surrounding the brain.",
            "pituitary": "Pituitary tumors affect hormone regulation.",
            "notumor": "No tumor-related abnormality detected in the MRI scan."
        },
        "lung": {
            "Pneumonia Detected": "Pneumonia is an infection that inflames air sacs in the lungs.",
            "Normal Lungs": "No signs of pneumonia detected in the chest X-ray."
        }
    }

    return explanations.get(disease, {}).get(
        prediction,
        "No additional explanation available."
    )
