from fastapi import APIRouter, HTTPException
from backend.database import get_db


router = APIRouter()

@router.get("/predictions/{patient_id}")
def get_predictions(patient_id: int):
    if patient_id <= 0:
        raise HTTPException(status_code=400)

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT disease, result, confidence, created_at
        FROM predictions
        WHERE patient_id = %s
        ORDER BY created_at
        """,
        (patient_id,)
    )

    rows = cursor.fetchall()

    return [
        {
            "disease": r["disease"],
            "prediction": r["result"],
            "confidence": float(r["confidence"]),
            "date": r["created_at"].strftime("%Y-%m-%d")
        }
        for r in rows
    ]
