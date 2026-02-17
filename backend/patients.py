from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.database import get_db


router = APIRouter(prefix="", tags=["Patients"])

class PatientCreate(BaseModel):
    user_id: int
    patient_name: str
    age: int
    gender: str


# ✅ ADD PATIENT
@router.post("/patients")
def add_patient(data: PatientCreate):
    db = get_db()
    cursor = db.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO patients (user_id, patient_name, age, gender)
            VALUES (%s, %s, %s, %s)
            """,
            (data.user_id, data.patient_name, data.age, data.gender)
        )
        db.commit()
        return {"message": "Patient added successfully"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# ✅ GET PATIENTS FOR USER
@router.get("/patients/{user_id}")
def get_patients(user_id: int):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM patients WHERE user_id=%s",
        (user_id,)
    )
    return cursor.fetchall()


# ✅ DELETE PATIENT (REQUIRED)
@router.delete("/patients/{patient_id}")
def delete_patient(patient_id: int):
    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        "DELETE FROM patients WHERE id=%s",
        (patient_id,)
    )
    db.commit()

    return {"message": "Patient deleted"}
