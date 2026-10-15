import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CLASS_COLORS, CLASS_ORDER, SHORT_FEATURES } from "../format";

const LIGHT_TOOLTIP = {
  background: "#FAF8F3",
  border: "1px solid rgba(46, 64, 54, 0.15)",
  borderRadius: 12,
  color: "#1A1A1A",
  fontSize: 12,
};

function corrColor(value) {
  const magnitude = Math.min(Math.abs(value), 1);
  if (value >= 0) return `rgba(204, 88, 51, ${0.12 + magnitude * 0.88})`;
  return `rgba(46, 64, 54, ${0.12 + magnitude * 0.88})`;
}

export default function DatasetSection({ lab }) {
  const features = lab ? Object.keys(lab.dataset.distributions) : [];
  const [feature, setFeature] = useState(features[0] || "Sleep Duration");
  const activeFeature = features.includes(feature) ? feature : features[0];

  if (!lab) {
    return (
      <section id="dataset" className="py-24 px-6 md:px-16 bg-cream text-charcoal">
        <p className="font-mono text-sm text-moss">Loading the dataset charts...</p>
      </section>
    );
  }

  const correlation = lab.dataset.correlation;

  return (
    <section id="dataset" className="py-24 md:py-32 px-4 sm:px-8 md:px-14 lg:px-20 bg-cream text-charcoal">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-moss/10 text-moss font-mono text-xs tracking-wider uppercase mb-3">
            Dataset
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            What the 374 records look like
          </h2>
          <p className="mt-4 text-sm md:text-base text-moss/80 leading-relaxed">
            Blank sleep-disorder cells are coded as None. That class is 219 people.
            Insomnia and Sleep Apnea are 77 and 78. The charts below use the published columns, not a score built from the inputs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 glass-card-light rounded-3rem p-6 sm:p-8">
            <h3 className="font-mono text-xs uppercase tracking-wider text-moss mb-4">Class counts</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lab.dataset.class_counts}>
                  <CartesianGrid stroke="rgba(46,64,54,0.12)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: "#2E4036", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#2E4036", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={LIGHT_TOOLTIP} />
                  <Bar
                    dataKey="count"
                    radius={[8, 8, 0, 0]}
                    shape={(props) => {
                      const { x, y, width, height, payload } = props;
                      return (
                        <rect
                          x={x}
                          y={y}
                          width={width}
                          height={height}
                          rx={8}
                          fill={CLASS_COLORS[payload.label] || "#2E4036"}
                        />
                      );
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-7 glass-card-light rounded-3rem p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-moss">Split by disorder</h3>
              <div className="flex flex-wrap gap-2">
                {features.map((name) => (
                  <button
                    key={name}
                    onClick={() => setFeature(name)}
                    className={`px-3 py-1 rounded-full text-[11px] font-mono border transition-colors ${
                      name === activeFeature
                        ? "bg-moss text-cream border-moss"
                        : "bg-white/40 text-moss border-moss/20 hover:border-moss/50"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lab.dataset.distributions[activeFeature]}>
                  <CartesianGrid stroke="rgba(46,64,54,0.12)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: "#2E4036", fontSize: 11 }} interval={0} angle={-25} textAnchor="end" height={56} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#2E4036", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={LIGHT_TOOLTIP} />
                  <Legend />
                  {CLASS_ORDER.map((className) => (
                    <Bar key={className} dataKey={className} fill={CLASS_COLORS[className]} radius={[4, 4, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-8 glass-card-light rounded-3rem p-6 sm:p-8 overflow-x-auto">
          <h3 className="font-mono text-xs uppercase tracking-wider text-moss mb-2">Numeric correlation</h3>
          <p className="text-xs text-moss/70 mb-5 max-w-2xl">
            Clay is a positive correlation. Moss is a negative one. Sleep duration and sleep quality move together. Stress moves the other way.
          </p>
          <div
            className="grid gap-1 min-w-[640px]"
            style={{ gridTemplateColumns: `88px repeat(${correlation.labels.length}, minmax(52px, 1fr))` }}
          >
            <div />
            {correlation.labels.map((label) => (
              <div key={label} className="text-[10px] font-mono text-moss/70 text-center pb-1">
                {SHORT_FEATURES[label] || label}
              </div>
            ))}
            {correlation.matrix.map((row, rowIndex) => (
              <div key={correlation.labels[rowIndex]} className="contents">
                <div className="text-[10px] font-mono text-moss/80 flex items-center">
                  {SHORT_FEATURES[correlation.labels[rowIndex]] || correlation.labels[rowIndex]}
                </div>
                {row.map((value, columnIndex) => (
                  <div
                    key={`${rowIndex}-${columnIndex}`}
                    className="h-11 rounded-md flex items-center justify-center text-[10px] font-mono"
                    style={{
                      background: corrColor(value),
                      color: Math.abs(value) > 0.55 ? "#F2F0E9" : "#1A1A1A",
                    }}
                    title={`${correlation.labels[rowIndex]} vs ${correlation.labels[columnIndex]}: ${value.toFixed(2)}`}
                  >
                    {value.toFixed(2)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
