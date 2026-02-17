from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import bcrypt
from backend.database import get_db

router = APIRouter()

class SignupData(BaseModel):
    username: str
    email: str
    password: str

class LoginData(BaseModel):
    email: str
    password: str

@router.post("/signup")
def signup(data: SignupData):
    db = get_db()
    cursor = db.cursor()

    hashed_password = bcrypt.hashpw(
        data.password.encode(), bcrypt.gensalt()
    ).decode()

    try:
        cursor.execute(
            "INSERT INTO users (username, email, password) VALUES (%s,%s,%s)",
            (data.username, data.email, hashed_password)
        )
        db.commit()
        return {"message": "Account created"}
    except Exception:
        raise HTTPException(
            status_code=409,
            detail="Email already exists"
        )

@router.post("/login")
def login(data: LoginData):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM users WHERE email=%s",
        (data.email,)
    )
    user = cursor.fetchone()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not bcrypt.checkpw(
        data.password.encode(), user["password"].encode()
    ):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # ✅ ONLY ACTUAL CHANGE:
    # 1. Proper indentation
    # 2. Added email in response
    return {
        "message": "Login successful",
        "user_id": user["id"],
        "username": user["username"],
        "email": user["email"]
    }
