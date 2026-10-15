import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CLASS_ORDER, MODEL_COLORS, MODEL_LABELS, MODEL_ORDER, pct } from "../format";

const DARK_TOOLTIP = {
  background: "#1A1A1A",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 12,
  color: "#F2F0E9",
  fontSize: 12,
};

const AXIS = { fill: "rgba(242,240,233,0.7)", fontSize: 11 };

function ConfusionMatrix({ title, matrix, f1 }) {
  const max = Math.max(...matrix.flat(), 1);
  return (
    <div className="rounded-2rem border border-white/10 bg-black/20 p-4">
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <h4 className="text-sm font-semibold text-white">{title}</h4>
        <span className="font-mono text-[11px] text-clay">macro-F1 {pct(f1)}</span>
      </div>
      <p className="text-[10px] font-mono text-cream/40 mb-2">Rows are actual. Columns are predicted.</p>
      <div className="grid grid-cols-4 gap-1 text-[10px] font-mono">
        <div />
        {CLASS_ORDER.map((label) => (
          <div key={label} className="text-center text-cream/50 pb-1 leading-tight">
            {label === "Sleep Apnea" ? "Apnea" : label}
          </div>
        ))}
        {matrix.map((row, rowIndex) => (
          <div key={CLASS_ORDER[rowIndex]} className="contents">
            <div className="text-cream/60 flex items-center pr-1 leading-tight">
              {CLASS_ORDER[rowIndex] === "Sleep Apnea" ? "Apnea" : CLASS_ORDER[rowIndex]}
            </div>
            {row.map((count, columnIndex) => {
              const strength = count / max;
              return (
                <div
                  key={`${rowIndex}-${columnIndex}`}
                  className="h-12 rounded-md flex items-center justify-center text-sm"
                  style={{
                    background: `rgba(204, 88, 51, ${0.12 + strength * 0.88})`,
                    color: strength > 0.45 ? "#F2F0E9" : "#F2F0E9",
                  }}
                >
                  {count}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TrainingSection({ lab }) {
  if (!lab) {
    return (
      <section id="training" className="py-24 px-6 md:px-16 bg-charcoal text-cream">
        <p className="font-mono text-sm text-cream/70">Loading the training charts...</p>
      </section>
    );
  }

  const comparison = lab.comparison.map((item) => ({
    model: item.model,
    Accuracy: Math.round(item.accuracy * 1000) / 10,
    "Macro-F1": Math.round(item.macro_f1 * 1000) / 10,
    "CV macro-F1": Math.round(item.cv_macro_f1 * 1000) / 10,
  }));

  const learningRows = lab.learning_curves.train_sizes.map((size, index) => {
    const row = { size };
    MODEL_ORDER.forEach((key) => {
      const series = lab.learning_curves.series[key];
      row[`${key}_val`] = series.val_f1[index];
      row[`${key}_train`] = series.train_f1[index];
    });
    return row;
  });

  const winnerLabel = lab.models[lab.winner]?.label || lab.winner;

  return (
    <section id="training" className="py-24 md:py-32 px-4 sm:px-8 md:px-14 lg:px-20 bg-charcoal text-cream">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-clay font-mono text-xs tracking-wider uppercase mb-3">
            Training
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            How the three models were scored
          </h2>
          <p className="mt-4 text-sm md:text-base text-cream/70 leading-relaxed">
            Same stratified split: {lab.split.train_rows} train, {lab.split.test_rows} holdout, plus {lab.split.cv_folds}-fold cross-validation.
            The live prediction uses {winnerLabel} because it has the highest holdout macro-F1.
            These are not neural nets, so each chart is the curve that model actually has.
          </p>
        </div>

        <div className="glass-card-dark rounded-3rem p-6 sm:p-8 border border-white/10 mb-8">
          <h3 className="font-mono text-xs uppercase tracking-wider text-cream/70 mb-4">Holdout comparison</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparison}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="model" tick={AXIS} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={AXIS} axisLine={false} tickLine={false} unit="%" />
                <Tooltip contentStyle={DARK_TOOLTIP} />
                <Legend />
                <Bar dataKey="Accuracy" fill="#F2F0E9" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Macro-F1" fill="#CC5833" radius={[6, 6, 0, 0]} />
                <Bar dataKey="CV macro-F1" fill="#6FA184" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {MODEL_ORDER.map((key) => (
            <ConfusionMatrix
              key={key}
              title={MODEL_LABELS[key]}
              matrix={lab.confusion[key]}
              f1={lab.models[key].macro_f1}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="glass-card-dark rounded-3rem p-6 sm:p-8 border border-white/10">
            <h3 className="font-mono text-xs uppercase tracking-wider text-cream/70 mb-1">
              Logistic regression training log-loss
            </h3>
            <p className="text-xs text-cream/50 mb-4 leading-relaxed">{lab.notes.loss_curve}</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lab.loss_curve}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="epoch" tick={AXIS} axisLine={false} tickLine={false} />
                  <YAxis tick={AXIS} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={DARK_TOOLTIP} />
                  <Line type="monotone" dataKey="loss" name="Log-loss" stroke="#CC5833" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card-dark rounded-3rem p-6 sm:p-8 border border-white/10">
            <h3 className="font-mono text-xs uppercase tracking-wider text-cream/70 mb-1">
              Random forest out-of-bag error
            </h3>
            <p className="text-xs text-cream/50 mb-4 leading-relaxed">{lab.notes.oob_curve}</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lab.oob_curve}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="n_trees" tick={AXIS} axisLine={false} tickLine={false} />
                  <YAxis tick={AXIS} axisLine={false} tickLine={false} tickFormatter={(value) => pct(value, 0)} />
                  <Tooltip contentStyle={DARK_TOOLTIP} formatter={(value) => pct(value)} />
                  <Line type="monotone" dataKey="oob_error" name="OOB error" stroke="#6FA184" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 glass-card-dark rounded-3rem p-6 sm:p-8 border border-white/10">
            <h3 className="font-mono text-xs uppercase tracking-wider text-cream/70 mb-1">
              Learning curves
            </h3>
            <p className="text-xs text-cream/50 mb-4 leading-relaxed">
              Macro-F1 against training-set size. Solid lines are cross-validated scores. Dashed lines are the training scores.
              {` ${lab.notes.naive_bayes}`}
            </p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={learningRows}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="size" tick={AXIS} axisLine={false} tickLine={false} />
                  <YAxis domain={[0.6, 1]} tick={AXIS} axisLine={false} tickLine={false} tickFormatter={(value) => pct(value, 0)} />
                  <Tooltip contentStyle={DARK_TOOLTIP} formatter={(value) => pct(value)} />
                  <Legend />
                  {MODEL_ORDER.map((key) => (
                    <Line
                      key={`${key}_val`}
                      type="monotone"
                      dataKey={`${key}_val`}
                      name={`${MODEL_LABELS[key]} validation`}
                      stroke={MODEL_COLORS[key]}
                      strokeWidth={2.4}
                      dot={false}
                    />
                  ))}
                  {MODEL_ORDER.map((key) => (
                    <Line
                      key={`${key}_train`}
                      type="monotone"
                      dataKey={`${key}_train`}
                      name={`${MODEL_LABELS[key]} train`}
                      stroke={MODEL_COLORS[key]}
                      strokeWidth={1.4}
                      strokeDasharray="5 4"
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-5 glass-card-dark rounded-3rem p-6 sm:p-8 border border-white/10">
            <h3 className="font-mono text-xs uppercase tracking-wider text-cream/70 mb-1">
              Random forest feature importance
            </h3>
            <p className="text-xs text-cream/50 mb-4">Top fields after one-hot encoding. Blood pressure and sleep duration lead.</p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={lab.feature_importance.map((item) => ({
                      ...item,
                      feature: item.feature.replace(" Category", "").replaceAll("_", " "),
                    }))}
                    layout="vertical"
                    margin={{ left: 8 }}
                  >
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" horizontal={false} />
                  <XAxis type="number" tick={AXIS} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="feature" width={130} tick={{ fill: "rgba(242,240,233,0.75)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={DARK_TOOLTIP} />
                  <Bar dataKey="importance" name="Importance" fill="#CC5833" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
