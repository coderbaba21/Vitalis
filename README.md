# VITALIS // High-Performance Recovery & Readiness Predictor

An end-to-end Machine Learning laboratory project that predicts athlete biological readiness and recovery states from physiological biometric telemetry.

---

## 📌 Project Overview

**VITALIS** analyzes 4 core human biometrics:
- **Sleep Duration** (`Sleep_Hours` in hours)
- **Daily Stress & Fatigue Index** (`Stress_Index` on 1–10 scale)
- **Physical Activity Duration** (`Activity_Mins` in minutes/day)
- **Resting Heart Rate** (`Resting_Heart_Rate` in BPM)

It maps these parameters into a readiness score, categorizing the subject into:
1. **OPTIMAL** (Primed to train / High parasympathetic reserve)
2. **MODERATE** (Adaptive load recommended)
3. **FATIGUE_DETECTED** (Active recovery / CNS rest mandated)

---

## 🗂️ Project Structure

```text
├── data/
│   └── sleep_health.csv       # Kaggle "Sleep, Health, and Lifestyle Dataset" (374 records)
├── frontend/                  # React + Vite + Tailwind CSS dashboard
│   ├── src/
│   │   ├── App.jsx            # Main interactive telemetry dashboard & 3D visualizer
│   │   ├── main.jsx           # React DOM root
│   │   └── index.css          # Design system & custom animations
│   ├── package.json
│   └── vite.config.js
├── train_pipeline.py          # ML training, preprocessing, holdout validation & serialization
├── server.py                  # Production FastAPI inference engine (serves /api/predict)
├── main.py                    # Standalone FastAPI inference microservice
├── requirements.txt           # Python dependency manifest
├── vitalis_model.pkl          # Serialized scikit-learn model package
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Python**: 3.9+
- **Node.js**: 18+ and `npm`

---

### 2. Backend Setup & Inference Engine

```bash
# 1. Install Python dependencies
pip install -r requirements.txt

# 2. (Optional) Retrain or verify the ML pipeline
python train_pipeline.py

# 3. Start the FastAPI backend server
python -m uvicorn server:app --host 127.0.0.1 --port 8000 --reload
```

The inference server will be live at: `http://127.0.0.1:8000`
- **Swagger Docs**: `http://127.0.0.1:8000/docs`
- **Health Check**: `http://127.0.0.1:8000/api/health`
- **Model Evaluation**: `http://127.0.0.1:8000/api/model-evaluation`

---

### 3. Frontend Dashboard Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🧠 Machine Learning Details

- **Dataset**: Kaggle Sleep, Health and Lifestyle Dataset (374 verified human cohorts).
- **Primary Algorithm**: Scikit-Learn `Pipeline` with `StandardScaler` + `LogisticRegression` (L2, $C=1.0$).
- **Benchmark Model**: `CalibratedClassifierCV` with RBF Support Vector Classifier (`SVC`).
- **Holdout Validation**: Stratified 80/20 train/test split.
- **Model Evaluation Metrics**:
  - Test Accuracy: **~97.3%**
  - ROC-AUC: **1.000**
  - Physiologically verified coefficient gradients (Sleep: $+3.45$, Stress: $-2.01$, Activity: $+2.25$, Heart Rate: $-0.75$).

---

## 🛠️ Roadmap & Next Steps for Collaborators

Here are recommended areas for team members to extend:
1. **Model Variations**: Compare Tree-based algorithms (`RandomForestClassifier`, `XGBoost`) vs. `LogisticRegression`.
2. **True Continuous Regression**: Train a `Ridge` or `RandomForestRegressor` to directly predict continuous recovery index from 0 to 100 without sigmoid boundary saturation.
3. **Additional Features**: Add Blood Pressure (`Systolic`/`Diastolic`), BMI Category, or Sleep Quality rating from the raw Kaggle dataset.
4. **Export to ONNX**: Export the model to ONNX format for zero-latency client-side browser inference.
