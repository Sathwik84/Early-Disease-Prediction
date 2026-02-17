import re

def parse_diabetes_biomarkers(text: str):
    return {
        "Pregnancies": int(re.search(r"Pregnancies:\s*(\d+)", text).group(1)),
        "Glucose": int(re.search(r"Glucose.*?(\d+)", text).group(1)),
        "BloodPressure": int(re.search(r"Blood Pressure.*?(\d+)", text).group(1)),
        "SkinThickness": int(re.search(r"Skin Thickness.*?(\d+)", text).group(1)),
        "Insulin": int(re.search(r"Insulin.*?(\d+)", text).group(1)),
        "BMI": float(re.search(r"BMI.*?([\d.]+)", text).group(1)),
        "DiabetesPedigreeFunction": float(re.search(r"Pedigree.*?([\d.]+)", text).group(1)),
        "Age": int(re.search(r"Age:\s*(\d+)", text).group(1))
    }
