"""
VITALIS // Sleep Disorder Classification
Academic FastAPI server
========================================
POST /api/predict  — all three saved models
GET  /api/lab      — dataset series, metrics, and training curves
"""

import json
import logging
import os

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("vitalis-backend")

ROOT = os.path.dirname(__file__)
MODEL_PATH = os.path.join(ROOT, "vitalis_model.pkl")
LAB_PATH = os.path.join(ROOT, "vitalis_lab.json")

FEATURE_COLUMNS = [
    "Age",
    "Sleep Duration",
    "Quality of Sleep",
    "Physical Activity Level",
    "Stress Level",
    "Heart Rate",
    "Daily Steps",
    "Systolic",
    "Diastolic",
    "Gender",
    "Occupation",
    "BMI Category",
]

app = FastAPI(
    title="VITALIS // Sleep Disorder Classification",
    description="Logistic Regression, Naive Bayes, and Random Forest on the Kaggle Sleep Health dataset.",
    version="3.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

package = None


def load_model_package():
    global package
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            f"Model file not found at {MODEL_PATH}. Run train_pipeline.py first."
        )
    package = joblib.load(MODEL_PATH)
    logger.info("Loaded model package from %s", MODEL_PATH)


def read_lab() -> dict:
    if not os.path.exists(LAB_PATH):
        raise FileNotFoundError(
            f"Lab file not found at {LAB_PATH}. Run train_pipeline.py first."
        )
    with open(LAB_PATH, "r", encoding="utf-8") as handle:
        return json.load(handle)


try:
    load_model_package()
except Exception as exc:
    logger.warning("Model load deferred: %s", exc)


class SleepProfile(BaseModel):
    age: int = Field(..., ge=18, le=90)
    gender: str
    occupation: str
    sleep_duration: float = Field(..., ge=3.0, le=12.0)
    quality_of_sleep: int = Field(..., ge=1, le=10)
    physical_activity: float = Field(..., ge=0.0, le=240.0)
    stress_level: int = Field(..., ge=1, le=10)
    bmi_category: str
    systolic: float = Field(..., ge=80.0, le=220.0)
    diastolic: float = Field(..., ge=40.0, le=140.0)
    heart_rate: float = Field(..., ge=40.0, le=160.0)
    daily_steps: float = Field(..., ge=0.0, le=40000.0)


def profile_frame(profile: SleepProfile) -> pd.DataFrame:
    bmi = profile.bmi_category.strip()
    if bmi == "Normal Weight":
        bmi = "Normal"
    row = {
        "Age": float(profile.age),
        "Sleep Duration": float(profile.sleep_duration),
        "Quality of Sleep": float(profile.quality_of_sleep),
        "Physical Activity Level": float(profile.physical_activity),
        "Stress Level": float(profile.stress_level),
        "Heart Rate": float(profile.heart_rate),
        "Daily Steps": float(profile.daily_steps),
        "Systolic": float(profile.systolic),
        "Diastolic": float(profile.diastolic),
        "Gender": profile.gender.strip(),
        "Occupation": profile.occupation.strip(),
        "BMI Category": bmi,
    }
    columns = package.get("feature_columns", FEATURE_COLUMNS) if package else FEATURE_COLUMNS
    return pd.DataFrame([row])[columns]


def model_call(pipeline, frame: pd.DataFrame) -> dict:
    predicted = str(pipeline.predict(frame)[0])
    probabilities = pipeline.predict_proba(frame)[0]
    classes = [str(label) for label in pipeline.named_steps["clf"].classes_]
    mapping = {
        label: round(float(probability), 4)
        for label, probability in zip(classes, probabilities)
    }
    return {"predicted_class": predicted, "probabilities": mapping}


@app.on_event("startup")
async def startup_event():
    load_model_package()


@app.get("/api/health")
def health_endpoint():
    loaded = package is not None
    return {
        "status": "ONLINE" if loaded else "NO_MODEL",
        "service": "VITALIS Sleep Disorder Classification",
        "model_loaded": loaded,
        "model_file": MODEL_PATH,
        "winner": None if package is None else package.get("winner"),
        "metrics": None if package is None else package.get("metrics"),
    }


@app.get("/api/model-evaluation")
def model_evaluation_endpoint():
    lab = read_lab()
    return {
        "project": lab.get("project"),
        "dataset_source": lab.get("dataset_source"),
        "classes": lab.get("classes"),
        "split": lab.get("split"),
        "winner": lab.get("winner"),
        "models": lab.get("models"),
        "notes": lab.get("notes"),
    }


@app.get("/api/lab")
def lab_endpoint():
    try:
        return read_lab()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc


@app.post("/api/predict")
def predict_endpoint(profile: SleepProfile):
    global package
    if package is None:
        load_model_package()

    try:
        frame = profile_frame(profile)
        calls = {
            key: model_call(pipeline, frame)
            for key, pipeline in package["pipelines"].items()
        }
        winner = package.get("winner") or "logistic_regression"
        headline = calls[winner]
        predicted = {item["predicted_class"] for item in calls.values()}
        return {
            "winner": winner,
            "predicted_class": headline["predicted_class"],
            "probabilities": headline["probabilities"],
            "models": calls,
            "agreement": len(predicted) == 1,
            "inputs_echo": profile.model_dump(),
        }
    except Exception as exc:
        logger.error("Prediction failed: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference failed: {exc}",
        ) from exc


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
