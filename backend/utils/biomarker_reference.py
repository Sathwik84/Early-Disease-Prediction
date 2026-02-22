# Normal reference ranges — keyed to EXACT parser field names
# Each entry: (normal_min, normal_max, display_name, unit)

HEART_REFERENCE = {
    "chol":     (125, 200,  "Cholesterol",           "mg/dL"),
    "trestbps": (90,  120,  "Resting Blood Pressure", "mmHg"),
    "thalach":  (60,  100,  "Max Heart Rate",          "bpm"),
    "oldpeak":  (0.0, 1.0,  "ST Depression",           "mm"),
    "age":      (0,   120,  "Age",                     "years"),
}

DIABETES_REFERENCE = {
    "Glucose":       (70,   140,  "Blood Glucose",    "mg/dL"),
    "BloodPressure": (60,   90,   "Blood Pressure",   "mmHg"),
    "Insulin":       (2,    25,   "Insulin",          "μU/mL"),
    "BMI":           (18.5, 24.9, "BMI",              "kg/m²"),
    "Age":           (0,    120,  "Age",              "years"),
}
