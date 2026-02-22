def explain_disease(disease: str, prediction: str) -> dict:
    disease = disease.lower()
    pred = prediction.lower()

    # ─────────────── BRAIN ───────────────
    if disease == "brain":
        if "glioma" in pred:
            return {
                "summary": "Glioma is a tumor arising from glial cells in the brain or spine. It is one of the most common primary brain tumors.",
                "risk_level": "High",
                "symptoms": [
                    "Persistent headaches (often worse in the morning)",
                    "Seizures or convulsions",
                    "Nausea or vomiting",
                    "Memory or personality changes",
                    "Vision or speech problems"
                ],
                "risk_factors": [
                    "Genetic syndromes (e.g., Neurofibromatosis)",
                    "Exposure to ionizing radiation",
                    "Family history of brain tumors"
                ],
                "next_steps": [
                    "Immediate consultation with a neurosurgeon",
                    "MRI with contrast for detailed staging",
                    "Biopsy for histological confirmation",
                    "Consider oncology referral for treatment planning"
                ]
            }
        elif "meningioma" in pred:
            return {
                "summary": "Meningioma is a tumor that forms on the membranes (meninges) surrounding the brain and spinal cord. Most are benign but can grow and cause pressure.",
                "risk_level": "Moderate",
                "symptoms": [
                    "Headaches that worsen over time",
                    "Weakness in arms or legs",
                    "Vision or hearing changes",
                    "Memory difficulties",
                    "Seizures (less common)"
                ],
                "risk_factors": [
                    "Female gender (more common in women)",
                    "Prior radiation to the head",
                    "Neurofibromatosis Type 2",
                    "Age above 40"
                ],
                "next_steps": [
                    "Neurosurgical evaluation recommended",
                    "Contrast-enhanced MRI for detailed assessment",
                    "Monitor for growth if asymptomatic",
                    "Radiotherapy may be considered for inaccessible tumors"
                ]
            }
        elif "pituitary" in pred:
            return {
                "summary": "Pituitary tumors (adenomas) arise in the pituitary gland and can affect hormone production and regulation throughout the body.",
                "risk_level": "Moderate",
                "symptoms": [
                    "Headaches",
                    "Vision problems (especially peripheral vision loss)",
                    "Hormonal imbalances (fatigue, weight gain, infertility)",
                    "Acromegaly or Cushing's syndrome symptoms"
                ],
                "risk_factors": [
                    "Multiple Endocrine Neoplasia (MEN) syndrome",
                    "Family history of pituitary tumors",
                    "Genetic mutations (AIP, PRKAR1A)"
                ],
                "next_steps": [
                    "Endocrinology consultation for hormone panel",
                    "Ophthalmology assessment for visual field testing",
                    "MRI sella protocol for precise localisation",
                    "Surgery or medication depending on hormone type"
                ]
            }
        else:
            return {
                "summary": "No tumor-related pattern was detected in the MRI scan. The scan appears within normal limits.",
                "risk_level": "Low",
                "symptoms": [],
                "risk_factors": [
                    "Regular follow-up recommended if symptomatic"
                ],
                "next_steps": [
                    "Continue routine neurological check-ups",
                    "Report any new symptoms (headaches, vision changes) to a neurologist",
                    "Maintain a healthy lifestyle to reduce risk"
                ]
            }

    # ─────────────── LUNG ───────────────
    if disease == "lung":
        if "pneumonia" in pred:
            return {
                "summary": "Pneumonia is an infection that inflames the air sacs (alveoli) in one or both lungs. The air sacs may fill with fluid or pus, causing cough, fever, chills, and difficulty breathing.",
                "risk_level": "High",
                "symptoms": [
                    "Productive cough (phlegm or pus)",
                    "Fever, sweating, and chills",
                    "Shortness of breath",
                    "Chest pain when breathing or coughing",
                    "Fatigue and loss of appetite",
                    "Confusion (especially in older adults)"
                ],
                "risk_factors": [
                    "Age under 2 or over 65",
                    "Hospitalisation or mechanical ventilation",
                    "Chronic lung disease (COPD, asthma)",
                    "Weakened immune system",
                    "Smoking history"
                ],
                "next_steps": [
                    "Immediate consultation with a pulmonologist or physician",
                    "Antibiotic / antiviral treatment based on causative organism",
                    "Blood oxygen monitoring and pulse oximetry",
                    "Stay hydrated and rest; hospitalisation if severe",
                    "Follow-up chest X-ray in 4–6 weeks to confirm clearance"
                ]
            }
        else:
            return {
                "summary": "No signs of pneumonia or significant pulmonary abnormality were detected in the chest X-ray. Lung fields appear clear.",
                "risk_level": "Low",
                "symptoms": [],
                "risk_factors": [
                    "Smoking is the single biggest risk factor for future lung disease",
                    "Air pollution and occupational exposures"
                ],
                "next_steps": [
                    "Maintain annual health check-ups",
                    "Avoid smoking and second-hand smoke",
                    "Report persistent cough or breathlessness to a doctor",
                    "Ensure vaccinations (influenza, pneumococcal) are up to date"
                ]
            }

    # Fallback
    return {
        "summary": "No additional explanation available.",
        "risk_level": "Unknown",
        "symptoms": [],
        "risk_factors": [],
        "next_steps": []
    }
