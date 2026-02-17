from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.auth import router as auth_router
from backend.predict import router as predict_router
from backend.predictions import router as predictions_router
from backend.patients import router as patients_router

app = FastAPI(title="Medical AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ ROUTERS (IMPORTANT PART)
app.include_router(auth_router, prefix="")         # /login, /signup
app.include_router(predict_router, prefix="")
app.include_router(predictions_router, prefix="")
app.include_router(patients_router, prefix="")

@app.get("/")
def root():
    return {"status": "Backend running 🚀"}
