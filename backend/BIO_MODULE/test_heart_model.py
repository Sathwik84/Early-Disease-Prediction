import joblib
import pandas as pd

# Load model
model = joblib.load("models/heart_disease_model.pkl")

# SAMPLE INPUT (example patient)
# Adjust values if your dataset columns differ
sample = {
    "age": 55,
    "sex": 1,
    "cp": 2,
    "trestbps": 140,
    "chol": 240,
    "fbs": 0,
    "restecg": 1,
    "thalach": 150,
    "exang": 0,
    "oldpeak": 1.5,
    "slope": 1,
    "ca": 0,
    "thal": 2
}

df = pd.DataFrame([sample])

# Predict
prediction = model.predict(df)[0]

if prediction == 1:
    print("⚠️ Heart Disease: POSSIBLE (early warning)")
else:
    print("✅ Heart Disease: NOT DETECTED")
