"""
VITALIS // Sleep Disorder Classification
Academic training pipeline
========================================
Dataset : Kaggle Sleep Health and Lifestyle (374 records)
Target  : Sleep Disorder — None, Insomnia, or Sleep Apnea.
          Blank cells in the source file are the published "None" class.

Models  : Logistic Regression, Gaussian Naive Bayes, Random Forest.
          All three see the same stratified 80/20 holdout.
"""

import json
import os
import sys

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression, SGDClassifier
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import (
    StratifiedKFold,
    cross_val_score,
    learning_curve,
    train_test_split,
)
from sklearn.naive_bayes import GaussianNB
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.utils.class_weight import compute_class_weight

CLASSES = ["None", "Insomnia", "Sleep Apnea"]

NUMERIC_FEATURES = [
    "Age",
    "Sleep Duration",
    "Quality of Sleep",
    "Physical Activity Level",
    "Stress Level",
    "Heart Rate",
    "Daily Steps",
    "Systolic",
    "Diastolic",
]

CATEGORICAL_FEATURES = ["Gender", "Occupation", "BMI Category"]

FEATURE_COLUMNS = NUMERIC_FEATURES + CATEGORICAL_FEATURES

DISTRIBUTION_FEATURES = [
    "Sleep Duration",
    "Stress Level",
    "Heart Rate",
    "Physical Activity Level",
]

MODEL_SPECS = [
    ("logistic_regression", "Logistic Regression"),
    ("naive_bayes", "Naive Bayes"),
    ("random_forest", "Random Forest"),
]


def find_dataset_path() -> str:
    candidates = [
        os.path.join("data", "sleep_health.csv"),
        os.path.join("data", "Sleep_health_and_lifestyle_dataset.csv"),
        "sleep_health.csv",
        "Sleep_health_and_lifestyle_dataset.csv",
    ]
    for path in candidates:
        if os.path.exists(path):
            return path
    raise FileNotFoundError(f"Dataset not found. Checked: {candidates}")


def make_one_hot() -> OneHotEncoder:
    try:
        return OneHotEncoder(handle_unknown="ignore", sparse_output=False)
    except TypeError:
        return OneHotEncoder(handle_unknown="ignore", sparse=False)


def make_preprocessor(scale_numeric: bool) -> ColumnTransformer:
    numeric = StandardScaler() if scale_numeric else "passthrough"
    return ColumnTransformer(
        transformers=[
            ("num", numeric, NUMERIC_FEATURES),
            ("cat", make_one_hot(), CATEGORICAL_FEATURES),
        ]
    )


def make_estimator(key: str):
    if key == "logistic_regression":
        return LogisticRegression(
            C=1.0,
            class_weight="balanced",
            max_iter=1000,
            random_state=42,
        )
    if key == "naive_bayes":
        return GaussianNB()
    if key == "random_forest":
        return RandomForestClassifier(
            n_estimators=200,
            class_weight="balanced",
            random_state=42,
            n_jobs=1,
        )
    raise KeyError(key)


def make_pipeline(key: str) -> Pipeline:
    scale = key != "random_forest"
    return Pipeline(
        [
            ("prep", make_preprocessor(scale_numeric=scale)),
            ("clf", make_estimator(key)),
        ]
    )


def load_frame(dataset_path: str) -> pd.DataFrame:
    raw = pd.read_csv(dataset_path)
    frame = pd.DataFrame()
    frame["Age"] = raw["Age"].astype(float)
    frame["Gender"] = raw["Gender"].astype(str)
    frame["Occupation"] = raw["Occupation"].astype(str)
    frame["Sleep Duration"] = raw["Sleep Duration"].astype(float)
    frame["Quality of Sleep"] = raw["Quality of Sleep"].astype(float)
    frame["Physical Activity Level"] = raw["Physical Activity Level"].astype(float)
    frame["Stress Level"] = raw["Stress Level"].astype(float)
    frame["BMI Category"] = (
        raw["BMI Category"].astype(str).replace({"Normal Weight": "Normal"})
    )
    pressure = raw["Blood Pressure"].astype(str).str.split("/", expand=True)
    frame["Systolic"] = pressure[0].astype(float)
    frame["Diastolic"] = pressure[1].astype(float)
    frame["Heart Rate"] = raw["Heart Rate"].astype(float)
    frame["Daily Steps"] = raw["Daily Steps"].astype(float)
    frame["Sleep Disorder"] = raw["Sleep Disorder"].fillna("None").astype(str)
    frame = frame.dropna().reset_index(drop=True)
    unknown = sorted(set(frame["Sleep Disorder"]) - set(CLASSES))
    if unknown:
        raise ValueError(f"Unexpected sleep-disorder labels: {unknown}")
    return frame


def json_ready(value):
    if isinstance(value, dict):
        return {str(key): json_ready(item) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [json_ready(item) for item in value]
    if isinstance(value, np.ndarray):
        return json_ready(value.tolist())
    if isinstance(value, (np.floating, float)):
        number = float(value)
        if np.isnan(number) or np.isinf(number):
            return None
        return round(number, 6)
    if isinstance(value, (np.integer, int)):
        return int(value)
    return value


def distribution_rows(series: pd.Series, labels: pd.Series):
    if series.nunique() <= 12:
        keys = sorted(series.unique().tolist())
        rows = []
        for key in keys:
            row = {"label": f"{key:g}" if isinstance(key, float) else str(key)}
            mask = series == key
            for class_name in CLASSES:
                row[class_name] = int((mask & (labels == class_name)).sum())
            rows.append(row)
        return rows

    edges = np.histogram_bin_edges(series.to_numpy(), bins=8)
    rows = []
    for index in range(len(edges) - 1):
        start = float(edges[index])
        end = float(edges[index + 1])
        if index == len(edges) - 2:
            mask = (series >= start) & (series <= end)
        else:
            mask = (series >= start) & (series < end)
        row = {"label": f"{start:.1f}-{end:.1f}"}
        for class_name in CLASSES:
            row[class_name] = int((mask & (labels == class_name)).sum())
        rows.append(row)
    return rows


def representative_preset(frame: pd.DataFrame, class_name: str) -> dict:
    subset = frame[frame["Sleep Disorder"] == class_name]
    center = subset[NUMERIC_FEATURES].median()
    scale = frame[NUMERIC_FEATURES].std().replace(0, 1)
    distance = ((subset[NUMERIC_FEATURES] - center) / scale).pow(2).sum(axis=1)
    row = subset.loc[distance.idxmin()]
    return {
        "label": class_name,
        "age": int(round(row["Age"])),
        "gender": str(row["Gender"]),
        "occupation": str(row["Occupation"]),
        "sleep_duration": float(row["Sleep Duration"]),
        "quality_of_sleep": int(round(row["Quality of Sleep"])),
        "physical_activity": int(round(row["Physical Activity Level"])),
        "stress_level": int(round(row["Stress Level"])),
        "bmi_category": str(row["BMI Category"]),
        "systolic": int(round(row["Systolic"])),
        "diastolic": int(round(row["Diastolic"])),
        "heart_rate": int(round(row["Heart Rate"])),
        "daily_steps": int(round(row["Daily Steps"])),
    }


def build_dataset_section(frame: pd.DataFrame) -> dict:
    labels = frame["Sleep Disorder"]
    counts = labels.value_counts()
    correlation = frame[NUMERIC_FEATURES].corr().round(4)
    return {
        "rows": int(len(frame)),
        "class_counts": [
            {"label": class_name, "count": int(counts.get(class_name, 0))}
            for class_name in CLASSES
        ],
        "distributions": {
            feature: distribution_rows(frame[feature], labels)
            for feature in DISTRIBUTION_FEATURES
        },
        "correlation": {
            "labels": NUMERIC_FEATURES,
            "matrix": correlation.to_numpy().tolist(),
        },
        "options": {
            "gender": sorted(frame["Gender"].unique().tolist()),
            "occupation": sorted(frame["Occupation"].unique().tolist()),
            "bmi_category": ["Normal", "Overweight", "Obese"],
        },
        "presets": {
            class_name: representative_preset(frame, class_name) for class_name in CLASSES
        },
    }


def per_class_scores(y_true, y_pred) -> dict:
    precision = precision_score(
        y_true, y_pred, labels=CLASSES, average=None, zero_division=0
    )
    recall = recall_score(
        y_true, y_pred, labels=CLASSES, average=None, zero_division=0
    )
    return {
        class_name: {
            "precision": float(precision[index]),
            "recall": float(recall[index]),
        }
        for index, class_name in enumerate(CLASSES)
    }


def evaluate_model(name: str, pipeline: Pipeline, X_train, X_test, y_train, y_test) -> dict:
    train_pred = pipeline.predict(X_train)
    test_pred = pipeline.predict(X_test)
    matrix = confusion_matrix(y_test, test_pred, labels=CLASSES)
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(
        make_pipeline(name),
        pd.concat([X_train, X_test]),
        pd.concat([y_train, y_test]),
        cv=cv,
        scoring="f1_macro",
        n_jobs=1,
    )
    return {
        "key": name,
        "accuracy": float(accuracy_score(y_test, test_pred)),
        "macro_f1": float(f1_score(y_test, test_pred, average="macro", labels=CLASSES)),
        "train_macro_f1": float(
            f1_score(y_train, train_pred, average="macro", labels=CLASSES)
        ),
        "cv_macro_f1": float(cv_scores.mean()),
        "cv_macro_f1_std": float(cv_scores.std()),
        "per_class": per_class_scores(y_test, test_pred),
        "confusion_matrix": matrix.astype(int).tolist(),
    }


def logistic_loss_curve(X_train: pd.DataFrame, y_train: pd.Series, epochs: int = 40):
    """Training log-loss of SGD on the logistic objective. Not the scored model."""
    preprocessor = make_preprocessor(scale_numeric=True)
    transformed = preprocessor.fit_transform(X_train, y_train)
    class_order = np.array(sorted(CLASSES))
    classifier = SGDClassifier(
        loss="log_loss",
        penalty="l2",
        alpha=1e-4,
        learning_rate="constant",
        eta0=0.001,
        random_state=42,
        tol=None,
    )
    curve = []
    for epoch in range(1, epochs + 1):
        classifier.partial_fit(transformed, y_train, classes=class_order)
        probabilities = classifier.predict_proba(transformed)
        column = {name: index for index, name in enumerate(classifier.classes_)}
        chosen = np.array([column[label] for label in y_train])
        picked = probabilities[np.arange(len(chosen)), chosen]
        loss = float(-np.mean(np.log(np.clip(picked, 1e-15, 1.0))))
        curve.append({"epoch": epoch, "loss": loss})
    return curve


def forest_oob_curve(X_train: pd.DataFrame, y_train: pd.Series):
    preprocessor = make_preprocessor(scale_numeric=False)
    transformed = preprocessor.fit_transform(X_train, y_train)
    present = np.unique(y_train)
    weights = compute_class_weight(class_weight="balanced", classes=present, y=y_train)
    weight_map = {label: float(weight) for label, weight in zip(present, weights)}
    forest = RandomForestClassifier(
        n_estimators=40,
        warm_start=True,
        oob_score=True,
        class_weight=weight_map,
        random_state=42,
        n_jobs=1,
    )
    curve = []
    for n_trees in range(40, 201, 20):
        forest.set_params(n_estimators=n_trees)
        forest.fit(transformed, y_train)
        curve.append(
            {
                "n_trees": n_trees,
                "oob_error": float(1.0 - forest.oob_score_),
            }
        )
    return curve


def build_learning_curves(X: pd.DataFrame, y: pd.Series) -> dict:
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    sizes = np.linspace(0.3, 1.0, 5)
    payload = {"train_sizes": [], "series": {}}
    for key, _label in MODEL_SPECS:
        train_sizes, train_scores, val_scores = learning_curve(
            make_pipeline(key),
            X,
            y,
            cv=cv,
            train_sizes=sizes,
            scoring="f1_macro",
            shuffle=True,
            random_state=42,
            n_jobs=1,
        )
        payload["train_sizes"] = [int(size) for size in train_sizes]
        payload["series"][key] = {
            "train_f1": train_scores.mean(axis=1).tolist(),
            "val_f1": val_scores.mean(axis=1).tolist(),
        }
    return payload


def feature_importances(pipeline: Pipeline, limit: int = 12) -> list:
    preprocessor = pipeline.named_steps["prep"]
    forest = pipeline.named_steps["clf"]
    names = preprocessor.get_feature_names_out()
    cleaned = []
    for name in names:
        text = str(name)
        if text.startswith("num__"):
            text = text[len("num__") :]
        elif text.startswith("cat__"):
            text = text[len("cat__") :]
        cleaned.append(text)
    pairs = sorted(
        zip(cleaned, forest.feature_importances_),
        key=lambda item: item[1],
        reverse=True,
    )
    return [
        {"feature": feature, "importance": float(score)}
        for feature, score in pairs[:limit]
    ]


def train_and_export(frame: pd.DataFrame):
    X = frame[FEATURE_COLUMNS]
    y = frame["Sleep Disorder"]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    print(f"Training rows: {len(X_train)}    Holdout rows: {len(X_test)}")
    pipelines = {}
    metrics = {}
    for key, label in MODEL_SPECS:
        print(f"Fitting {label}...")
        pipeline = make_pipeline(key)
        pipeline.fit(X_train, y_train)
        pipelines[key] = pipeline
        metrics[key] = evaluate_model(key, pipeline, X_train, X_test, y_train, y_test)
        metrics[key]["label"] = label
        print(
            f"  holdout macro-F1 {metrics[key]['macro_f1']:.3f}    "
            f"accuracy {metrics[key]['accuracy']:.3f}    "
            f"cv macro-F1 {metrics[key]['cv_macro_f1']:.3f}"
        )

    winner = max(metrics, key=lambda key: metrics[key]["macro_f1"])
    print(f"Holdout macro-F1 winner: {metrics[winner]['label']}")

    print("Building loss curve, forest curve, and learning curves...")
    loss_curve = logistic_loss_curve(X_train, y_train)
    oob_curve = forest_oob_curve(X_train, y_train)
    curves = build_learning_curves(X, y)

    lab = {
        "project": "VITALIS sleep-disorder classification",
        "dataset_source": "Kaggle Sleep Health and Lifestyle Dataset",
        "classes": CLASSES,
        "split": {
            "test_size": 0.2,
            "random_state": 42,
            "train_rows": int(len(X_train)),
            "test_rows": int(len(X_test)),
            "cv_folds": 5,
        },
        "winner": winner,
        "models": metrics,
        "comparison": [
            {
                "key": key,
                "model": metrics[key]["label"],
                "accuracy": metrics[key]["accuracy"],
                "macro_f1": metrics[key]["macro_f1"],
                "cv_macro_f1": metrics[key]["cv_macro_f1"],
            }
            for key, _label in MODEL_SPECS
        ],
        "confusion": {
            key: metrics[key]["confusion_matrix"] for key, _label in MODEL_SPECS
        },
        "loss_curve": loss_curve,
        "oob_curve": oob_curve,
        "learning_curves": curves,
        "feature_importance": feature_importances(pipelines["random_forest"]),
        "dataset": build_dataset_section(frame),
        "notes": {
            "label": "Blank Sleep Disorder cells are coded as None. That is the dataset's no-disorder class.",
            "loss_curve": "Training log-loss versus epoch from SGDClassifier on the logistic objective. The scored logistic model is LogisticRegression.",
            "naive_bayes": "Gaussian Naive Bayes has no epoch loss. It is shown on the learning curve and the comparison chart.",
            "oob_curve": "Random forest out-of-bag error as trees are added. The saved forest is a separate 200-tree fit.",
            "scope": "Lifestyle screening on 374 public records. Not a medical diagnosis.",
        },
    }
    return pipelines, lab, winner


def main():
    dataset_path = find_dataset_path()
    print(f"Loading {dataset_path}")
    frame = load_frame(dataset_path)
    counts = frame["Sleep Disorder"].value_counts().to_dict()
    print(f"Records: {len(frame)}    Class counts: {counts}")

    pipelines, lab, winner = train_and_export(frame)
    package = {
        "pipelines": pipelines,
        "winner": winner,
        "classes": CLASSES,
        "feature_columns": FEATURE_COLUMNS,
        "metrics": {
            key: {
                "label": lab["models"][key]["label"],
                "accuracy": lab["models"][key]["accuracy"],
                "macro_f1": lab["models"][key]["macro_f1"],
                "cv_macro_f1": lab["models"][key]["cv_macro_f1"],
            }
            for key, _label in MODEL_SPECS
        },
    }

    model_path = "vitalis_model.pkl"
    joblib.dump(package, model_path)
    lab_text = json.dumps(json_ready(lab), indent=2)
    lab_paths = [
        "vitalis_lab.json",
        os.path.join("frontend", "public", "vitalis_lab.json"),
    ]
    for path in lab_paths:
        os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
        with open(path, "w", encoding="utf-8") as handle:
            handle.write(lab_text)
        print(f"Wrote {path}")
    print(f"Wrote {model_path} ({os.path.getsize(model_path)} bytes)")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"[ERROR] Training failed: {exc}", file=sys.stderr)
        raise
