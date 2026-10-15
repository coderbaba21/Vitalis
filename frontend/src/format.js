export const CLASS_ORDER = ["None", "Insomnia", "Sleep Apnea"];

export const CLASS_COLORS = {
  None: "#2E4036",
  Insomnia: "#CC5833",
  "Sleep Apnea": "#3E6F8C",
};

export const MODEL_ORDER = ["logistic_regression", "naive_bayes", "random_forest"];

export const MODEL_LABELS = {
  logistic_regression: "Logistic Regression",
  naive_bayes: "Naive Bayes",
  random_forest: "Random Forest",
};

export const MODEL_COLORS = {
  logistic_regression: "#CC5833",
  naive_bayes: "#C4A35A",
  random_forest: "#6FA184",
};

export const SHORT_FEATURES = {
  Age: "Age",
  "Sleep Duration": "Sleep",
  "Quality of Sleep": "Quality",
  "Physical Activity Level": "Activity",
  "Stress Level": "Stress",
  "Heart Rate": "HR",
  "Daily Steps": "Steps",
  Systolic: "Systolic",
  Diastolic: "Diastolic",
};

export function pct(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }
  return `${(Number(value) * 100).toFixed(digits)}%`;
}

export function presetToInputs(preset) {
  return {
    age: preset.age,
    gender: preset.gender,
    occupation: preset.occupation,
    sleep_duration: preset.sleep_duration,
    quality_of_sleep: preset.quality_of_sleep,
    physical_activity: preset.physical_activity,
    stress_level: preset.stress_level,
    bmi_category: preset.bmi_category,
    systolic: preset.systolic,
    diastolic: preset.diastolic,
    heart_rate: preset.heart_rate,
    daily_steps: preset.daily_steps,
  };
}

export function disagreementNote(prediction) {
  if (!prediction?.models) return "";
  if (prediction.agreement) return "All three models agree on this class.";
  const groups = {};
  MODEL_ORDER.forEach((key) => {
    const call = prediction.models[key];
    if (!call) return;
    const label = MODEL_LABELS[key] || key;
    if (!groups[call.predicted_class]) groups[call.predicted_class] = [];
    groups[call.predicted_class].push(label);
  });
  return Object.entries(groups)
    .map(([className, names]) => {
      const verb = names.length === 1 ? "calls" : "call";
      const subject = names.length === 2 ? `${names[0]} and ${names[1]}` : names.join(", ");
      return `${subject} ${verb} this ${className}`;
    })
    .join(". ") + ".";
}
