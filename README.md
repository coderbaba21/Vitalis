# VITALIS // Sleep Disorder Classification

A faculty demo that classifies sleep disorder from the Kaggle Sleep Health and Lifestyle dataset. Three models share one split: logistic regression, Gaussian naive Bayes, and a random forest.

The label is the dataset's own `Sleep Disorder` column. Blank cells are the published no-disorder class, coded here as **None**. The other classes are **Insomnia** and **Sleep Apnea**.

This is a lifestyle screen on 374 public records. It is not a diagnosis.

---

## Classes

| Class | Records |
| --- | ---: |
| None | 219 |
| Sleep Apnea | 78 |
| Insomnia | 77 |

None is 59% of the file, so accuracy alone flatters a model that mostly says "no disorder." The headline score is **macro-F1**. The holdout is a stratified 80/20 split (`random_state=42`, 299 train / 75 test), reported next to 5-fold cross-validated macro-F1.

Latest run:

| Model | Holdout accuracy | Holdout macro-F1 | 5-fold macro-F1 |
| --- | ---: | ---: | ---: |
| Logistic Regression | 93.3% | 90.8% | 88.2% |
| Naive Bayes | 89.3% | 87.7% | 85.1% |
| Random Forest | 85.3% | 81.9% | 83.4% |

The live prediction uses logistic regression because it won holdout macro-F1. The dashboard still shows the other two answers.

## Features

Age, gender, occupation, sleep duration, sleep quality, physical activity, stress, BMI (the source value `Normal Weight` is merged into `Normal`), systolic and diastolic blood pressure, heart rate, and daily steps. `Person ID` is dropped.

## Graphs

- Dataset: class counts, feature distributions by disorder, numeric correlation.
- Logistic regression: training log-loss versus epoch from `SGDClassifier` on the same log-loss objective. The scored model is `LogisticRegression`.
- Random forest: out-of-bag error as trees are added, plus feature importance.
- All three: learning curves of macro-F1 versus training-set size. Naive Bayes has no epoch loss, so this is where it appears.
- Comparison bars and a confusion matrix for each model.

## Project layout

```text
├── data/sleep_health.csv
├── train_pipeline.py          # trains the three models and writes the lab file
├── server.py                  # FastAPI: /api/predict and /api/lab
├── vitalis_model.pkl
├── vitalis_lab.json
└── frontend/                  # React + Vite dashboard
```

`main.py` is an older inference server from the readiness prototype. The demo entrypoint is `server.py`.

## Run it

```bash
pip install -r requirements.txt
python train_pipeline.py
python -m uvicorn server:app --host 127.0.0.1 --port 8000 --reload
```

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The API docs are at `http://127.0.0.1:8000/docs`.

If the API is down, the dataset and training charts still load from `frontend/public/vitalis_lab.json`. Live classification needs the server.

## What to say in the viva

- The label comes from the dataset. Empty disorder cells are None, not dropped rows.
- The test set is about 75 people, so the cross-validation number sits beside the holdout number.
- The three models are allowed to disagree. That disagreement is the comparison.
- The loss chart is logistic log-loss from SGD. It is not a neural-network training curve.
