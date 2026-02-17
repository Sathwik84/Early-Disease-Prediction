import joblib
import pandas as pd

# Load model
model = joblib.load("models/diabetes_model.pkl")

# SAMPLE INPUT (PIMA dataset format)
sample = {
    "Pregnancies": 3,
    "Glucose": 145,
    "BloodPressure": 80,
    "SkinThickness": 25,
    "Insulin": 130,
    "BMI": 32.0,
    "DiabetesPedigreeFunction": 0.45,
    "Age": 45
}

df = pd.DataFrame([sample])

# Predict
prediction = model.predict(df)[0]

if prediction == 1:
    print("⚠️ Diabetes: POSSIBLE (early warning)")
else:
    print("✅ Diabetes: NOT DETECTED")
