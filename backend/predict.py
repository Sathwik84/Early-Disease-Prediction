from fastapi import APIRouter, UploadFile, File, Form
import os
import shutil
from datetime import datetime

from backend.database import get_db

# 🔮 Inference modules
from backend.inference.brain import predict_brain
from backend.inference.lung import predict_lung
from backend.inference.heart import predict_heart
from backend.inference.diabetes import predict_diabetes
from backend.inference.modality import detect_modality

# 🧠 Utils
from backend.utils.pdf_extractor import extract_text_from_pdf
from backend.utils.heart_parser import parse_heart_biomarkers
from backend.utils.diabetes_parser import parse_diabetes_biomarkers

# 🧠 Explainability
from backend.utils.biomarker_explain import explain_biomarkers
from backend.utils.disease_explain import explain_disease


router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

MODALITY_CONF_THRESHOLD = 0.85


@router.post("/predict")
def predict(
    patient_id: int = Form(...),
    disease: str = Form(...),
    report: UploadFile = File(None),
    image: UploadFile = File(None)
):
    disease = disease.lower()

    img_path = None
    report_path = None

    # ================= SAVE FILES =================
    if image:
        img_path = os.path.join(UPLOAD_DIR, image.filename)
        with open(img_path, "wb") as f:
            shutil.copyfileobj(image.file, f)

    if report:
        report_path = os.path.join(UPLOAD_DIR, report.filename)
        with open(report_path, "wb") as f:
            shutil.copyfileobj(report.file, f)

    # ================= HARD INPUT CONTRACT =================
    if disease in ["brain", "lung"] and report is not None:
        return {
            "status": "error",
            "message": f"{disease.capitalize()} module does NOT accept reports"
        }

    if disease in ["heart", "diabetes"] and image is not None:
        return {
            "status": "error",
            "message": f"{disease.capitalize()} module does NOT accept images"
        }

    result = "Prediction unavailable"
    confidence = 0.0
    explanation = None

    # ================= HEART =================
    if disease == "heart":
        if not report:
            return {
                "status": "error",
                "message": "Heart module requires biomarker PDF only"
            }

        text = extract_text_from_pdf(report_path)
        sample = parse_heart_biomarkers(text)

        # ✅ REVIEW-SAFE: DO NOT HARD FAIL
        if not sample:
            return {
                "prediction": "Inconclusive (Insufficient Biomarker Data)",
                "confidence": 0.0,
                "explanation": {
                    "summary": "Heart biomarkers could not be reliably extracted.",
                    "details": "The uploaded report does not contain clearly identifiable cardiac biomarkers.",
                    "note": "⚠️ Please consult a cardiologist with standardized lab reports."
                },
                "disclaimer": (
                    "⚠️ This AI output is for assistance only and does not "
                    "replace consultation with a certified medical professional."
                )
            }

        result, confidence = predict_heart(sample)
        explanation = explain_biomarkers(sample, "heart")

    # ================= DIABETES =================
    elif disease == "diabetes":
        if not report:
            return {
                "status": "error",
                "message": "Diabetes module requires biomarker PDF only"
            }

        text = extract_text_from_pdf(report_path)
        sample = parse_diabetes_biomarkers(text)

        # ✅ REVIEW-SAFE: DO NOT HARD FAIL
        if not sample:
            return {
                "prediction": "Inconclusive (Insufficient Biomarker Data)",
                "confidence": 0.0,
                "explanation": {
                    "summary": "Diabetes biomarkers could not be reliably extracted.",
                    "details": "The uploaded report does not contain clearly identifiable glucose or HbA1c values.",
                    "note": "⚠️ Please consult an endocrinologist with standardized lab reports."
                },
                "disclaimer": (
                    "⚠️ This AI output is for assistance only and does not "
                    "replace consultation with a certified medical professional."
                )
            }

        result, confidence = predict_diabetes(sample)
        explanation = explain_biomarkers(sample, "diabetes")

    # ================= BRAIN =================
    elif disease == "brain":
        if not img_path:
            return {
                "status": "error",
                "message": "Brain module requires MRI image"
            }

        modality, mod_conf = detect_modality(img_path)
        if modality != "brain_mri" or mod_conf < MODALITY_CONF_THRESHOLD:
            return {
                "status": "error",
                "message": "Uploaded image is NOT a Brain MRI"
            }

        result, confidence = predict_brain(img_path)
        explanation = explain_disease("brain", result)

    # ================= LUNG =================
    elif disease == "lung":
        if not img_path:
            return {
                "status": "error",
                "message": "Lung module requires Chest X-ray image"
            }

        modality, mod_conf = detect_modality(img_path)
        if modality != "chest_xray" or mod_conf < MODALITY_CONF_THRESHOLD:
            return {
                "status": "error",
                "message": "Uploaded image is NOT a Chest X-ray"
            }

        result, confidence = predict_lung(img_path)
        explanation = explain_disease("lung", result)

    else:
        return {
            "status": "error",
            "message": "Invalid module selected"
        }

    # ================= SAVE TO DB =================
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        """
        INSERT INTO predictions
        (patient_id, disease, result, confidence, created_at)
        VALUES (%s,%s,%s,%s,%s)
        """,
        (patient_id, disease, result, confidence, datetime.now())
    )
    db.commit()

    # ================= RESPONSE =================
    return {
        "prediction": result,
        "confidence": round(confidence, 2),
        "explanation": explanation,
        "disclaimer": (
            "⚠️ This AI output is for assistance only and does not "
            "replace consultation with a certified medical professional."
        )
    }
