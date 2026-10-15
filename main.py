"""
VITALIS // High-Performance Recovery & Readiness Predictor
Production FastAPI Inference Microservice
==========================================================
Serves real-time inference using the serialized Scikit-Learn SVM Pipeline.
"""

import os
import sys
import logging
from typing import Dict, Any
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("vitalis-inference-service")

MODEL_PATH = os.path.join(os.path.dirname(__file__), "vitalis_svm_model.pkl")

# Initialize FastAPI application
app = FastAPI(
    title="VITALIS Biometric Readiness Engine",
    description="High-Performance Human Recovery & Biological Priming Inference API",
    version="1.0.0"
)

# Enable CORS for local Vite development and production domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model container
pipeline = None
model_metadata = {}

MODEL_PATHS = [
    os.path.join(os.path.dirname(__file__), "vitalis_model.pkl"),
    os.path.join(os.path.dirname(__file__), "vitalis_svm_model.pkl")
]


def load_model():
    """Load the calibrated model pipeline from disk."""
    global pipeline, model_metadata
    chosen_path = None
    for p in MODEL_PATHS:
        if os.path.exists(p):
            chosen_path = p
            break

    if not chosen_path:
        logger.error(f"No model file found in {MODEL_PATHS}. Please run train_pipeline.py first.")
        raise FileNotFoundError(f"Model artifact not found in {MODEL_PATHS}")

    try:
        loaded = joblib.load(chosen_path)
        if isinstance(loaded, dict) and 'pipeline' in loaded:
            pipeline = loaded['pipeline']
            model_metadata = loaded.get('metrics', {})
        else:
            pipeline = loaded
            model_metadata = {}
        logger.info(f"Successfully loaded VITALIS Model Pipeline from: {chosen_path}")
    except Exception as e:
        logger.error(f"Failed to deserialize model: {e}")
        raise RuntimeError(f"Model loading failure: {e}")


@app.on_event("startup")
async def startup_event():
    load_model()

try:
    load_model()
except Exception:
    pass



class BiometricTelemetryInput(BaseModel):
    sleep_hours: float = Field(
        ...,
        ge=2.0,
        le=16.0,
        description="Duration of sleep in hours (e.g., 7.5)",
        example=7.8
    )
    stress_index: int = Field(
        ...,
        ge=1,
        le=10,
        description="Subjective or biomarker-derived stress level on a scale from 1 to 10",
        example=3
    )
    activity_mins: float = Field(
        ...,
        ge=0.0,
        le=360.0,
        description="Daily physical activity level in minutes (e.g., 60.0)",
        example=65.0
    )
    resting_heart_rate: float = Field(
        ...,
        ge=35.0,
        le=140.0,
        description="Resting heart rate in beats per minute (e.g., 58.0)",
        example=58.0
    )


class ReadinessPredictionResponse(BaseModel):
    readiness_state: str = Field(..., description="'OPTIMAL' or 'REST_REQUIRED'")
    readiness_score: float = Field(..., description="Continuous calibrated readiness probability in [0, 1]")
    readiness_percentage: float = Field(..., description="Readiness score represented as percentage (0-100%)")
    prediction_raw: int = Field(..., description="Binary model output: 1 for Optimal, 0 for Rest Required")
    clinical_recommendation: str = Field(..., description="Targeted biological prescription for athlete")
    biometric_breakdown: Dict[str, Any] = Field(..., description="Breakdown of key physiological indices")


def formulate_clinical_prescription(
    readiness_state: str,
    probability: float,
    sleep_hours: float,
    stress_index: int,
    activity_mins: float,
    resting_hr: float
) -> str:
    """Generate precise biological recommendations based on physiological inputs & model confidence."""
    pct = round(probability * 100, 1)

    if readiness_state == "OPTIMAL":
        if pct >= 80:
            return (
                f"Peak physiological priming confirmed ({pct}% readiness index). "
                "Central nervous system excitability and parasympathetic tone are elevated. "
                "Cleared for maximal neuro-muscular loading, high-velocity power output, or competitive split cycles."
            )
        else:
            return (
                f"Sufficient biological adaptation detected ({pct}% readiness index). "
                "Autonomic tone is balanced with adequate restorative sleep latency. "
                "Approved for moderate-to-high intensity hypertrophy or threshold endurance work. Prioritize post-session glycogen resynthesis."
            )
    else:
        # Rest mandated or fatigued
        if stress_index >= 7 and sleep_hours < 6.5:
            return (
                f"High allostatic load detected ({pct}% readiness index). "
                "Marked sympatho-adrenal hyperactivation coupled with sleep architecture deficit. "
                "Mandatory active recovery: 20-min low-intensity Zone 1 walk, 400mg magnesium glycinate, and protocol down-regulation breathwork."
            )
        elif resting_hr >= 76:
            return (
                f"Autonomic cardiac strain identified ({pct}% readiness index, resting HR {resting_hr} BPM). "
                "Resting tachycardia vs baseline indicates incomplete parasympathetic deceleration. "
                "Suspend heavy eccentric lifting. Substitute with mild contrast hydrotherapy, hydration replenishments, and 8.5h sleep window."
            )
        else:
            return (
                f"Sub-optimal systemic readiness ({pct}% readiness index). "
                "Biometric telemetry indicates incomplete myofibrillar and neurological recovery. "
                "Mandate active restoration session, structural mobility, and sleep hygiene extension (+60 mins tonight)."
            )


@app.get("/api/v1/health")
def health_check():
    """Health & model status probe."""
    return {
        "status": "HEALTHY",
        "service": "VITALIS Biometric Readiness Engine",
        "model_loaded": pipeline is not None,
        "model_path": MODEL_PATH,
        "benchmark": {
            "validation_accuracy": 0.8933,
            "roc_auc": 0.9095,
            "kernel": "SVC(kernel='rbf', C=1.0)"
        }
    }


@app.get("/api/v1/model-metadata")
def model_metadata():
    """Return model architecture and feature requirements."""
    return {
        "model_type": "Support Vector Classifier (RBF Kernel)",
        "features": [
            {"name": "Sleep_Hours", "type": "float", "unit": "hours", "normal_range": [5.5, 9.0]},
            {"name": "Stress_Index", "type": "int", "unit": "1-10 scale", "normal_range": [1, 6]},
            {"name": "Activity_Mins", "type": "float", "unit": "minutes/day", "normal_range": [30, 90]},
            {"name": "Resting_Heart_Rate", "type": "float", "unit": "BPM", "normal_range": [48, 75]}
        ],
        "target": {
            "name": "Readiness_State",
            "classes": {0: "Fatigued / Active Recovery Mandated", 1: "Optimal / Primed to Train"}
        }
    }


@app.post("/api/predict", response_model=ReadinessPredictionResponse)
@app.post("/api/v1/predict-readiness", response_model=ReadinessPredictionResponse)
def predict_readiness(telemetry: BiometricTelemetryInput):
    """
    Predict athlete biological readiness from biometric telemetry payload.
    """
    global pipeline
    if pipeline is None:
        load_model()

    try:
        # Construct DataFrame matching exact feature column names used during training
        input_df = pd.DataFrame([{
            "Sleep_Hours": float(telemetry.sleep_hours),
            "Stress_Index": int(telemetry.stress_index),
            "Activity_Mins": float(telemetry.activity_mins),
            "Resting_Heart_Rate": float(telemetry.resting_heart_rate)
        }])

        # Perform inference
        prediction_raw = int(pipeline.predict(input_df)[0])
        probabilities = pipeline.predict_proba(input_df)[0]
        # Probability for class 1 (Optimal)
        optimal_prob = float(probabilities[1])

        readiness_state = "OPTIMAL" if prediction_raw == 1 else "REST_REQUIRED"
        readiness_percentage = round(optimal_prob * 100.0, 1)

        recommendation = formulate_clinical_prescription(
            readiness_state=readiness_state,
            probability=optimal_prob,
            sleep_hours=telemetry.sleep_hours,
            stress_index=telemetry.stress_index,
            activity_mins=telemetry.activity_mins,
            resting_hr=telemetry.resting_heart_rate
        )

        breakdown = {
            "sleep_efficiency_factor": round(min(telemetry.sleep_hours / 8.0, 1.2), 2),
            "allostatic_stress_score": telemetry.stress_index,
            "metabolic_volume_mins": telemetry.activity_mins,
            "cardiac_strain_bpm": telemetry.resting_heart_rate,
            "parasympathetic_reserve": "HIGH" if optimal_prob > 0.65 else ("MODERATE" if optimal_prob > 0.45 else "COMPROMISED")
        }

        return ReadinessPredictionResponse(
            readiness_state=readiness_state,
            readiness_score=round(optimal_prob, 4),
            readiness_percentage=readiness_percentage,
            prediction_raw=prediction_raw,
            clinical_recommendation=recommendation,
            biometric_breakdown=breakdown
        )

    except Exception as e:
        logger.error(f"Inference error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference pipeline execution failure: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
