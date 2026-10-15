import { Activity, Cpu, Heart, Moon, RefreshCw, Zap } from "lucide-react";
import { CLASS_ORDER, MODEL_LABELS, MODEL_ORDER, disagreementNote, pct } from "../format";

const BAR_COLORS = {
  None: "#8FBC8F",
  Insomnia: "#E26D48",
  "Sleep Apnea": "#8FB8D4",
};

const FALLBACK_OPTIONS = {
  gender: ["Female", "Male"],
  occupation: [
    "Accountant",
    "Doctor",
    "Engineer",
    "Lawyer",
    "Manager",
    "Nurse",
    "Sales Representative",
    "Salesperson",
    "Scientist",
    "Software Engineer",
    "Teacher",
  ],
  bmi_category: ["Normal", "Overweight", "Obese"],
};

function SliderField({ label, icon, value, display, min, max, step, onChange }) {
  return (
    <div className="p-3.5 rounded-2xl bg-black/20 border border-white/5">
      <div className="flex items-center justify-between mb-2 gap-3">
        <label className="text-[11px] font-mono uppercase text-cream/80 flex items-center gap-2">
          {icon}
          <span>{label}</span>
        </label>
        <span className="font-mono text-xs font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full"
      />
    </div>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <label className="block p-3.5 rounded-2xl bg-black/20 border border-white/5">
      <span className="block text-[11px] font-mono uppercase text-cream/80 mb-2">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-charcoal text-cream text-sm rounded-lg border border-white/10 px-3 py-2 outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function PredictConsole({
  inputs,
  onChange,
  presets,
  options,
  onPreset,
  prediction,
  error,
  isLoading,
  onSubmit,
}) {
  const choices = options || FALLBACK_OPTIONS;
  const probabilities = prediction?.probabilities || {};

  return (
    <div className="glass-card-dark rounded-3rem p-6 sm:p-8 md:p-10 border border-white/15">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-clay" />
            <span>Sleep profile</span>
          </h3>
          <p className="text-xs text-cream/60 mt-1">
            Same fields the three models were trained on. Presets are real rows from the dataset.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-mono text-cream/40 uppercase">Presets:</span>
          {CLASS_ORDER.map((className) => (
            <button
              key={className}
              onClick={() => presets?.[className] && onPreset(presets[className])}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 text-[11px] font-mono text-cream/80 border border-white/10 transition-colors"
            >
              {className}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField label="Gender" value={inputs.gender} options={choices.gender} onChange={(value) => onChange("gender", value)} />
        <SelectField label="Occupation" value={inputs.occupation} options={choices.occupation} onChange={(value) => onChange("occupation", value)} />
        <SelectField label="BMI category" value={inputs.bmi_category} options={choices.bmi_category} onChange={(value) => onChange("bmi_category", value)} />
        <SliderField label="Age" value={inputs.age} display={`${inputs.age}`} min={27} max={65} step={1} onChange={(value) => onChange("age", parseInt(value, 10))} />
        <SliderField label="Sleep duration" icon={<Moon className="w-3.5 h-3.5 text-emerald-300" />} value={inputs.sleep_duration} display={`${Number(inputs.sleep_duration).toFixed(1)} h`} min={4} max={10} step={0.1} onChange={(value) => onChange("sleep_duration", parseFloat(value))} />
        <SliderField label="Sleep quality" value={inputs.quality_of_sleep} display={`${inputs.quality_of_sleep} / 10`} min={1} max={10} step={1} onChange={(value) => onChange("quality_of_sleep", parseInt(value, 10))} />
        <SliderField label="Activity" icon={<Activity className="w-3.5 h-3.5 text-clay" />} value={inputs.physical_activity} display={`${inputs.physical_activity} min`} min={0} max={120} step={1} onChange={(value) => onChange("physical_activity", parseInt(value, 10))} />
        <SliderField label="Stress" value={inputs.stress_level} display={`${inputs.stress_level} / 10`} min={1} max={10} step={1} onChange={(value) => onChange("stress_level", parseInt(value, 10))} />
        <SliderField label="Heart rate" icon={<Heart className="w-3.5 h-3.5 text-red-300" />} value={inputs.heart_rate} display={`${inputs.heart_rate} bpm`} min={50} max={110} step={1} onChange={(value) => onChange("heart_rate", parseInt(value, 10))} />
        <SliderField label="Daily steps" value={inputs.daily_steps} display={Number(inputs.daily_steps).toLocaleString()} min={1000} max={12000} step={100} onChange={(value) => onChange("daily_steps", parseInt(value, 10))} />
        <SliderField label="Systolic" value={inputs.systolic} display={`${inputs.systolic}`} min={90} max={180} step={1} onChange={(value) => onChange("systolic", parseInt(value, 10))} />
        <SliderField label="Diastolic" value={inputs.diastolic} display={`${inputs.diastolic}`} min={50} max={120} step={1} onChange={(value) => onChange("diastolic", parseInt(value, 10))} />
      </div>

      <div className="mt-8">
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-2xl bg-clay hover:bg-clay-hover text-white font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-luxury hover:shadow-glow-clay flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Classifying...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              <span>Classify sleep disorder</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-8 pt-8 border-t border-white/15">
        {error && (
          <p className="text-sm text-clay leading-relaxed">
            {error} Start the API with <span className="font-mono">python -m uvicorn server:app --host 127.0.0.1 --port 8000</span>. The charts below still load from the saved study file.
          </p>
        )}

        {prediction && !error && (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-cream/50">
                {MODEL_LABELS[prediction.winner] || prediction.winner} prediction
              </span>
              <div className="mt-2 text-3xl font-bold text-white">{prediction.predicted_class}</div>
              <p className="mt-2 text-sm text-cream/70 leading-relaxed">{disagreementNote(prediction)}</p>
            </div>

            <div className="space-y-3">
              {CLASS_ORDER.map((className) => {
                const probability = probabilities[className] || 0;
                return (
                  <div key={className}>
                    <div className="flex justify-between text-xs font-mono text-cream/80 mb-1">
                      <span>{className}</span>
                      <span>{pct(probability)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(probability * 100, 0)}%`, background: BAR_COLORS[className] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {MODEL_ORDER.map((key) => {
                const call = prediction.models?.[key];
                if (!call) return null;
                const isWinner = key === prediction.winner;
                return (
                  <div key={key} className={`rounded-2xl border p-3 ${isWinner ? "border-clay/60 bg-clay/10" : "border-white/10 bg-black/20"}`}>
                    <div className="text-[10px] font-mono uppercase text-cream/50">{MODEL_LABELS[key]}</div>
                    <div className="text-sm font-semibold text-white mt-1">{call.predicted_class}</div>
                    <div className="text-[11px] font-mono text-cream/60 mt-1">{pct(call.probabilities?.[call.predicted_class])}</div>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-cream/45 leading-relaxed">
              This matches lifestyle patterns in 374 public records. It is not a diagnosis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
