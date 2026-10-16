# VITALIS // Machine Learning Lab Demonstration & Viva Guide
**Complete Teacher Presentation Script, Scientific Results & Academic Defense Cheat Sheet**

---

## 📌 Executive Project Summary

| Parameter | Project Specification |
|---|---|
| **Project Title** | **VITALIS** — Clinical & Lifestyle Machine Learning Sleep Disorder Classifier |
| **Dataset Source** | Kaggle *Sleep Health and Lifestyle Dataset* (374 Verified Human Cohorts) |
| **Target Classes** | 3 Classes: `None` (Healthy: 219), `Insomnia` (77), `Sleep Apnea` (78) |
| **Features Used** | 12 Biometrics: Age, Sleep Duration, Sleep Quality, Activity Mins, Stress Level, Heart Rate, Daily Steps, Systolic BP, Diastolic BP, Gender, Occupation, BMI Category |
| **Validation Protocol** | Stratified 80/20 Holdout Split (299 Train / 75 Test) + 5-Fold Stratified Cross-Validation |
| **Winning Algorithm** | **Logistic Regression (L2 Regularization, $C=1.0$)** with **Macro-F1: 0.908** (Accuracy: **93.3%**) |
| **Benchmark Models** | Random Forest (100 Trees, OOB: 0.880 F1) & Gaussian Naive Bayes (0.877 F1) |

---

## 🎬 Part 1: The 4-Minute Demonstration Walkthrough (What to Show & Say)

### Step 1: The 30-Second Elevator Pitch (Start on the Hero Screen)
> **What to Say to Your Teacher:**  
> *"Good morning, Professor. Our lab project is **VITALIS**, an end-to-end Machine Learning system for automated screening and multi-class classification of sleep disorders. Using 374 real clinical patient cohorts from Kaggle, we trained, evaluated, and benchmarked three distinct algorithms—Logistic Regression, Random Forest, and Gaussian Naive Bayes—to classify individuals into three clinical states: **None (Healthy)**, **Insomnia**, and **Sleep Apnea**, based on 12 physiological and lifestyle biometrics."*

---

### Step 2: Show the Dataset & Exploratory Analysis (Scroll to `#dataset`)
> **What to Point Out on Screen:**
> 1. **Class Distribution:** Show the three class count bars:
>    - `None` (Healthy): **219 records (58.6%)**
>    - `Sleep Apnea`: **78 records (20.9%)**
>    - `Insomnia`: **77 records (20.6%)**
>    - *Explain:* *"Professor, because healthy individuals make up almost 60% of the dataset, standard accuracy is misleading. This is why we adopted **Macro-F1** as our primary optimization metric to ensure balanced clinical detection across all three conditions."*
> 2. **Biometric Distributions:** Show the histograms for Blood Pressure, Sleep Duration, and Stress.
>    - *Explain:* *"Our exploratory analysis showed that Sleep Apnea strongly correlates with elevated Systolic/Diastolic blood pressure (>140/90) and higher BMI, whereas Insomnia is strongly correlated with elevated stress and reduced sleep duration."*

---

### Step 3: Show the Model Benchmark & Holdout Metrics (Scroll to `#study`)
> **What to Explain to Your Teacher:**
> 1. **Comparison Table:** Show that all three algorithms were evaluated on the **identical stratified 80/20 holdout set (75 test samples)** and verified via 5-fold cross-validation.
> 2. **The Winner:** Highlight that **Logistic Regression won with a Macro-F1 of 0.908 and 93.3% accuracy**, outperforming Random Forest (0.880 F1) and Naive Bayes (0.877 F1).
> 3. **The Confusion Matrix:** Point to the 3×3 matrix:
>    - `None`: 42 of 44 correctly identified.
>    - `Insomnia`: 12 of 15 correctly identified.
>    - `Sleep Apnea`: **16 of 16 correctly identified (100% Recall!)** — point out that in healthcare screening, zero false negatives for sleep apnea is critical for preventing cardiovascular complications.
> 4. **Curves:** Show the SGD log-loss convergence curve and the Random Forest Out-of-Bag (OOB) error curve.
> 5. **Feature Importance Ranking:** Point out that **Systolic Blood Pressure (15.5%)**, **Diastolic BP (12.7%)**, and **Sleep Duration (10.2%)** are the three most influential predictors.

---

### Step 4: Live Telemetry Prediction Console (Scroll to `#telemetry`)
> **Interactive Actions to Perform:**
> 1. Click the preset **"None"**: Show that all three models agree on *None* with high confidence (~88–96%).
> 2. Click the preset **"Insomnia"**: Show that the models predict *Insomnia*, driven by high stress (8/10) and low sleep (6.5h).
> 3. Click the preset **"Sleep Apnea"**: Show that high blood pressure (140/95) and overweight BMI trigger *Sleep Apnea*.
> 4. **Fidget with sliders live:** Move Systolic/Diastolic BP from 120/80 up to 142/95 and watch the Sleep Apnea probability climb in real-time, served directly from the Scikit-Learn inference backend!

---

## 📊 Part 2: Complete Scientific Results & Evaluation Tables

### Table 1: Model Comparison Benchmark (Stratified 80/20 Holdout)

| Model Architecture | Test Accuracy | Holdout Macro-F1 | 5-Fold CV Macro-F1 | Train Macro-F1 | Status |
|---|---|---|---|---|---|
| **Logistic Regression (L2, $C=1.0$)** | **93.33%** | **0.9076** | **0.8820 ± 0.046** | 0.8923 | **★ Declared Winner** |
| **Random Forest (100 Trees, OOB)** | 92.00% | 0.8799 | 0.8515 ± 0.026 | 0.9141 | Competitive Benchmark |
| **Gaussian Naive Bayes** | 89.33% | 0.8768 | 0.8514 ± 0.052 | 0.8587 | Probabilistic Baseline |

---

### Table 2: Class-by-Class Performance (Winning Logistic Regression Model)

| Class Label | Support (Holdout N) | Precision | Recall (Sensitivity) | F1-Score | Clinical Interpretation |
|---|---|---|---|---|---|
| **None (Healthy)** | 44 patients | 1.0000 (100%) | 0.9545 (95.5%) | 0.9767 | Zero false positives; healthy cohorts screened cleanly |
| **Insomnia** | 15 patients | 0.9231 (92.3%) | 0.8000 (80.0%) | 0.8571 | High precision; 12 of 15 correctly flagged |
| **Sleep Apnea** | 16 patients | 0.8000 (80.0%) | **1.0000 (100%)** | 0.8889 | **Perfect recall**; 0 missed apnea cases (essential for triage) |

---

### Table 3: Top Feature Importances (Random Forest Gini Impurity)

| Rank | Feature Name | Importance | Physiological Mechanism |
|---|---|---|---|
| 1 | **Systolic Blood Pressure** | **15.52%** | Nocturnal hypoxemia triggers sympathetic alpha-adrenergic vasoconstriction |
| 2 | **Diastolic Blood Pressure** | **12.73%** | Elevated peripheral arterial resistance secondary to recurrent upper airway collapse |
| 3 | **Sleep Duration** | **10.22%** | Direct objective marker of total restorative sleep architecture |
| 4 | **Age** | **9.24%** | Loss of upper airway muscular tone and anatomical compliance with age |
| 5 | **BMI Category: Overweight** | **8.80%** | Pharyngeal fat pad deposition narrowing the upper respiratory airway lumen |
| 6 | **Physical Activity (Mins)** | **7.51%** | Regular cardiovascular exercise enhances parasympathetic vagal recovery |
| 7 | **Daily Steps** | **6.48%** | Proxy for baseline metabolic expenditure and cardiovascular conditioning |

---

## 🎯 Part 3: Anticipated Teacher Viva Questions & Academic Answers

### Q1. Why did you choose Macro-F1 instead of Accuracy as your primary evaluation metric?
> **Model Answer:**  
> *"Our dataset exhibits inherent class imbalance: 58.6% of patients belong to the healthy None class, while Insomnia and Sleep Apnea comprise ~20.6% and ~20.9% each. If a naive model simply guessed 'None' for every patient, it would achieve a deceptive 58.6% accuracy while having zero clinical value. Macro-F1 calculates the harmonic mean of Precision and Recall for each class independently and averages them unweighted:  
> $$\text{Macro-F1} = \frac{F1_{\text{None}} + F1_{\text{Insomnia}} + F1_{\text{Apnea}}}{3}$$  
> This ensures minority clinical conditions are weighted with equal gravity to the majority healthy cohort."*

---

### Q2. Why did Logistic Regression outperform Random Forest on this dataset?
> **Model Answer:**  
> *"For three mathematical and empirical reasons:  
> 1. **Sample Size vs. Model Complexity:** We have 374 records and 12 features. On tabular data of this scale, linear models with L2 regularization ($C=1.0$) generalize exceptionally well without overfitting.  
> 2. **Overfitting in Ensembles:** Random Forest achieved a higher training Macro-F1 ($0.914$) than Logistic Regression ($0.892$), but dropped to $0.880$ on the unseen holdout test set, exhibiting mild variance.  
> 3. **Linear Decision Hyperplanes:** The physiological boundaries—specifically the strong linear correlation between blood pressure, BMI, and sleep apnea—are effectively separated by hyperplanes in standardized continuous feature space."*

---

### Q3. How did you prevent Data Leakage during feature preprocessing?
> **Model Answer:**  
> *"We encapsulated preprocessing strictly within Scikit-Learn `Pipeline` and `ColumnTransformer` constructs. The `StandardScaler` (for numerical features) and `OneHotEncoder(handle_unknown='ignore')` (for categorical features like Gender, Occupation, and BMI) were fitted **only** on the training split ($N=299$) during each cross-validation fold, and were merely transformed on the holdout test set ($N=75$). No test set statistics ever leaked into the training pipeline."*

---

### Q4. Why is the prediction instantaneous on the frontend? Is it really using the ML model?
> **Model Answer:**  
> *"Yes, it is 100% pure Scikit-Learn machine learning. The inference is instantaneous (<5 milliseconds) because the serialized model package (`vitalis_model.pkl`) is pre-loaded into RAM once at FastAPI server startup using `@app.on_event('startup')`.  
> When a prediction is requested, computing `model.predict(X)` on a single sample involves only calculating a dot product $z = W \cdot X + b$ followed by softmax (or traversing 100 small decision trees), which a standard laptop CPU executes in less than 1 millisecond."*

---

### Q5. What is the difference between the SGD loss curve and the learning curve shown in your UI?
> **Model Answer:**  
> *"The **SGD loss curve** plots cross-entropy log-loss minimization over successive epochs during stochastic gradient descent, verifying algorithmic convergence.  
> The **learning curve** plots training score versus 5-fold cross-validation Macro-F1 across expanding training set sample sizes (from 20% to 100% of data). The convergence of the two curves confirms that the model has reached healthy sample saturation without severe bias or variance."*

---

### Q6. Is this system suitable for clinical diagnosis in a hospital?
> **Model Answer:**  
> *"No, Professor. VITALIS is designed strictly as an automated **screening, risk-stratification, and primary-care triage tool**, not a diagnostic replacement for in-lab Polysomnography (PSG). Gold-standard diagnosis of Sleep Apnea requires overnight multi-channel recording of EEG, EOG, EMG, and the Apnea-Hypopnea Index (AHI). VITALIS helps clinicians identify patients who urgently need clinical PSG."*

---

## 💻 Part 4: System Architecture & Run Commands

```bash
# Terminal 1: Launch FastAPI Backend Server (Port 8000)
python -m uvicorn server:app --host 127.0.0.1 --port 8000 --reload

# Terminal 2: Launch Interactive React Telemetry Dashboard (Port 5173)
cd frontend
npm run dev

# (Optional) Retrain and re-verify ML Pipeline
python train_pipeline.py
```

- **Swagger REST API Docs:** `http://127.0.0.1:8000/docs`
- **Lab Study Endpoint:** `http://127.0.0.1:8000/api/lab`
- **Predict Endpoint:** `http://127.0.0.1:8000/api/predict`
