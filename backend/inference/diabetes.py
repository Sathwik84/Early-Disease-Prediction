import joblib
import pandas as pd
import os

# --------------------------------------------------
# 📍 Current file: backend/inference/diabetes.py
# --------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ✅ Correct path to BIO_MODULE/models
MODEL_PATH = os.path.join(
    BASE_DIR,
    "..",            # inference → backend
    "BIO_MODULE",
    "models",
    "diabetes_model.pkl"
)

# Load trained model
model = joblib.load(MODEL_PATH)

# --------------------------------------------------
# 🔮 DIABETES PREDICTION
# --------------------------------------------------
def predict_diabetes(sample: dict):
    """
    sample: dict containing diabetes biomarkers
    """

    # If model was trained with feature names (sklearn ≥1.0)
    if hasattr(model, "feature_names_in_"):
        feature_order = list(model.feature_names_in_)

        missing = [f for f in feature_order if f not in sample]
        if missing:
            raise ValueError(f"Missing features: {missing}")

        df = pd.DataFrame(
            [[sample[f] for f in feature_order]],
            columns=feature_order
        )
    else:
        # Fallback (older models)
        df = pd.DataFrame([sample])

    pred = model.predict(df)[0]

    if hasattr(model, "predict_proba"):
        confidence = float(max(model.predict_proba(df)[0]))
    else:
        confidence = 0.88  # safe fallback

    result = (
        "Diabetes Possible"
        if pred == 1
        else "Diabetes Not Detected"
    )

    return result, confidence
