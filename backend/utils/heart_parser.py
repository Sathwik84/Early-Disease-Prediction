import re

def parse_heart_biomarkers(text: str):
    return {
        "age": int(re.search(r"Age:\s*(\d+)", text).group(1)),
        "trestbps": int(re.search(r"Blood Pressure.*?(\d+)", text).group(1)),
        "chol": int(re.search(r"Cholesterol.*?(\d+)", text).group(1)),
        "thalach": int(re.search(r"Heart Rate.*?(\d+)", text).group(1)),
        "oldpeak": float(re.search(r"ST Depression.*?([\d.]+)", text).group(1)),
        # Fixed/default fields
        "sex": 1,
        "cp": 2,
        "fbs": 0,
        "restecg": 1,
        "exang": 0,
        "slope": 1,
        "ca": 0,
        "thal": 2
    }
