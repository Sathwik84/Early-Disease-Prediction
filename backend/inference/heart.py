import joblib
import pandas as pd
import os

# 📍 Current file: backend/inference/heart.py
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ✅ Correct path to BIO_MODULE/models
MODEL_PATH = os.path.join(
    BASE_DIR,
    "..",            # inference → backend
    "BIO_MODULE",
    "models",
    "heart_disease_model.pkl"
)

# Load trained model
model = joblib.load(MODEL_PATH)

def predict_heart(sample: dict):
    """
    sample: dict containing heart biomarkers
    """

    # 🔐 Use feature order from trained model
    feature_order = list(model.feature_names_in_)

    # Check missing features
    missing = [f for f in feature_order if f not in sample]
    if missing:
        raise ValueError(f"Missing features: {missing}")

    # Create DataFrame in exact training order
    df = pd.DataFrame(
        [[sample[f] for f in feature_order]],
        columns=feature_order
    )

    # Predict class
    pred = model.predict(df)[0]

    # Predict probability (0–1)
    proba = model.predict_proba(df)[0]
    confidence = float(max(proba))

    result = (
        "Heart Disease Detected"
        if pred == 1
        else "Normal"
    )

    return result, confidence
