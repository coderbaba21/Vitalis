import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Compass,
  Cpu,
  Layers,
  Terminal,
} from "lucide-react";
import DatasetSection from "./components/DatasetSection";
import PredictConsole from "./components/PredictConsole";
import TrainingSection from "./components/TrainingSection";
import { MODEL_LABELS, MODEL_ORDER, pct, presetToInputs } from "./format";

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_INPUTS = {
  age: 35,
  gender: "Male",
  occupation: "Software Engineer",
  sleep_duration: 7.5,
  quality_of_sleep: 8,
  physical_activity: 60,
  stress_level: 5,
  bmi_category: "Normal",
  systolic: 120,
  diastolic: 80,
  heart_rate: 70,
  daily_steps: 8000,
};

const BASE_LOGS = [
  "Label source: the Sleep Disorder column. Blank cells are coded as None.",
  "Three classifiers share one stratified 80/20 split.",
  "Macro-F1 is the headline score. None is 219 of 374 rows.",
  "The descending curve is logistic log-loss from SGD, not a neural net.",
  "Naive Bayes has no epoch loss. It sits on the learning curve.",
  "Lifestyle screening on public records. Not a diagnosis.",
];

async function fetchLab() {
  const urls = ["/api/lab", "/vitalis_lab.json"];
  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (!response.ok) continue;
      const data = await response.json();
      if (data?.dataset && data?.models) return data;
    } catch (error) {
      console.warn(`Lab fetch failed for ${url}`, error);
    }
  }
  throw new Error("Study file is unavailable.");
}

async function fetchPrediction(inputs) {
  const payload = JSON.stringify(inputs);
  const urls = ["/api/predict", "http://127.0.0.1:8000/api/predict"];
  let lastError = null;
  for (const url of urls) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: payload,
      });
      if (!response.ok) {
        lastError = new Error(`Prediction failed (${response.status}).`);
        continue;
      }
      return response.json();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("Inference server is offline.");
}

export default function App() {
  const mainRef = useRef(null);
  const heroRef = useRef(null);
  const seeded = useRef(false);

  const [isScrolled, setIsScrolled] = useState(false);
  const [shufflerActive, setShufflerActive] = useState(0);
  const [telemetryIndex, setTelemetryIndex] = useState(0);
  const [lab, setLab] = useState(null);
  const [labError, setLabError] = useState("");
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const [prediction, setPrediction] = useState(null);
  const [predictError, setPredictError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const logs = lab
    ? [
        `Holdout winner: ${MODEL_LABELS[lab.winner]} at macro-F1 ${pct(lab.models[lab.winner].macro_f1)}.`,
        ...BASE_LOGS,
      ]
    : BASE_LOGS;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryIndex((prev) => (prev + 1) % logs.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [logs.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setShufflerActive((prev) => (prev + 1) % MODEL_ORDER.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-elem", {
        y: 40,
        opacity: 0,
        duration: 1.1,
        stagger: 0.18,
        ease: "power3.out",
      });
      gsap.from(".manifesto-text", {
        scrollTrigger: {
          trigger: "#manifesto",
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 1.2,
        ease: "power2.out",
      });
    }, mainRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchLab()
      .then((data) => {
        if (!cancelled) setLab(data);
      })
      .catch((error) => {
        if (!cancelled) setLabError(error.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (seeded.current || !lab?.dataset?.presets?.None) return;
    seeded.current = true;
    setInputs(presetToInputs(lab.dataset.presets.None));
  }, [lab]);

  const runInference = async (nextInputs = inputs) => {
    setIsLoading(true);
    try {
      const data = await fetchPrediction(nextInputs);
      setPrediction(data);
      setPredictError("");
    } catch (error) {
      setPredictError("The inference server is offline.");
      console.warn(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      runInference(inputs);
    }, 220);
    return () => clearTimeout(timer);
  }, [inputs]);

  const handleInputChange = (field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const winner = lab?.models?.[lab.winner];
  const modelCards = MODEL_ORDER.map((key, index) => {
    const metrics = lab?.models?.[key];
    return {
      key,
      category: `MODEL 0${index + 1}`,
      title: MODEL_LABELS[key],
      metric: metrics ? `Holdout macro-F1 ${pct(metrics.macro_f1)}` : "Score loads with the study file",
      detail: metrics
        ? `Accuracy ${pct(metrics.accuracy)} · 5-fold macro-F1 ${pct(metrics.cv_macro_f1)}`
        : "Waiting for vitalis_lab.json",
    };
  });

  return (
    <div ref={mainRef} className="relative min-h-screen bg-cream text-charcoal font-sans selection:bg-clay selection:text-white">
      <div className="noise-overlay" aria-hidden="true" />

      <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav
          className={`pointer-events-auto flex items-center justify-between px-6 py-3.5 transition-all duration-500 rounded-full max-w-4xl w-full ${
            isScrolled ? "glass-pill-nav text-moss" : "glass-pill-nav-transparent text-cream"
          }`}
        >
          <a href="#hero" className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-clay animate-ping" />
            <span className="font-bold tracking-tight text-sm uppercase">
              VITALIS <span className="text-clay font-mono text-xs">// 01</span>
            </span>
          </a>
          <div className="hidden md:flex items-center gap-6 text-xs font-medium tracking-wider uppercase opacity-90">
            <a href="#telemetry" className="hover:text-clay transition-colors">Predict</a>
            <a href="#dataset" className="hover:text-clay transition-colors">Dataset</a>
            <a href="#training" className="hover:text-clay transition-colors">Training</a>
            <a href="#manifesto" className="hover:text-clay transition-colors">Study</a>
          </div>
          <a
            href="#telemetry"
            className="px-4 py-2 rounded-full bg-clay hover:bg-clay-hover text-white text-xs font-semibold tracking-wide transition-all duration-300"
          >
            Classify
          </a>
        </nav>
      </header>

      <section
        id="hero"
        ref={heroRef}
        className="relative h-[100dvh] min-h-[720px] flex items-end justify-start overflow-hidden px-6 md:px-16 lg:px-24 pb-16 md:pb-24"
      >
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?auto=format&fit=crop&w=2400&q=85')",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 75% 25%, rgba(46, 64, 54, 0.78) 0%, rgba(26, 39, 32, 0.92) 55%, rgba(26, 26, 26, 0.98) 100%),
              linear-gradient(to top, rgba(26, 26, 26, 1) 0%, rgba(26, 39, 32, 0.6) 45%, rgba(26, 26, 26, 0.8) 100%)
            `,
          }}
        />
        <div className="relative z-10 max-w-4xl">
          <div className="hero-elem inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-cream text-xs font-mono tracking-widest uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-clay animate-pulse" />
            <span>Sleep disorder classification // 374 records</span>
          </div>
          <h1 className="hero-elem text-cream tracking-tight text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] mb-6">
            Three models.{" "}
            <span className="bio-serif text-clay block sm:inline font-normal text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-normal">
              One label.
            </span>
          </h1>
          <p className="hero-elem text-cream/80 text-base sm:text-lg md:text-xl font-normal max-w-2xl leading-relaxed mb-8">
            Logistic regression, naive Bayes, and a random forest predict None, Insomnia, or Sleep Apnea from the Kaggle Sleep Health dataset. Macro-F1 is the score that matters, because most people in the file have no disorder.
          </p>
          <div className="hero-elem flex flex-wrap items-center gap-4">
            <a href="#telemetry" className="px-7 py-4 rounded-full bg-clay hover:bg-clay-hover text-white text-sm font-semibold tracking-wide transition-all shadow-luxury hover:shadow-glow-clay flex items-center gap-3">
              <span>Open the classifier</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#training" className="px-6 py-4 rounded-full bg-white/10 hover:bg-white/15 text-cream text-sm font-medium tracking-wide backdrop-blur-md border border-white/20">
              See the training curves
            </a>
          </div>
          <div className="hero-elem mt-12 pt-8 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono text-cream/75">
            <div>
              <span className="block text-cream/40 uppercase text-[10px]">Holdout macro-F1</span>
              <span className="text-clay text-sm font-semibold">{winner ? pct(winner.macro_f1) : "—"}</span>
            </div>
            <div>
              <span className="block text-cream/40 uppercase text-[10px]">Holdout accuracy</span>
              <span className="text-white text-sm font-semibold">{winner ? pct(winner.accuracy) : "—"}</span>
            </div>
            <div>
              <span className="block text-cream/40 uppercase text-[10px]">Cohort</span>
              <span className="text-white text-sm font-semibold">374 Kaggle records</span>
            </div>
            <div>
              <span className="block text-cream/40 uppercase text-[10px]">Winning model</span>
              <span className="text-emerald-300 text-sm font-semibold">{lab ? MODEL_LABELS[lab.winner] : "—"}</span>
            </div>
          </div>
        </div>
      </section>

      <section id="telemetry" className="py-24 md:py-32 px-4 sm:px-8 md:px-14 lg:px-20 bg-charcoal text-cream">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-moss text-cream/90 font-mono text-xs tracking-wider uppercase mb-3">
                <Cpu className="w-3.5 h-3.5 text-clay" />
                <span>Live classification</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
                Ask all three models
              </h2>
            </div>
            <p className="text-cream/60 max-w-md text-sm leading-relaxed">
              The headline class is the holdout macro-F1 winner. The other two answers stay visible, including when they disagree.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="glass-card-dark rounded-3rem p-6 border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="w-4 h-4 text-clay" />
                  <span className="font-mono text-xs uppercase tracking-wider text-cream/80">The three classifiers</span>
                </div>
                <div className="space-y-3">
                  {modelCards.map((card, index) => (
                    <button
                      key={card.key}
                      onClick={() => setShufflerActive(index)}
                      className={`w-full text-left rounded-2xl border p-4 transition-colors ${
                        shufflerActive === index ? "border-clay/50 bg-clay/10" : "border-white/10 bg-black/20"
                      }`}
                    >
                      <div className="text-[10px] font-mono text-clay">{card.category}</div>
                      <div className="text-white font-semibold mt-1">{card.title}</div>
                      <div className="text-xs text-cream/70 mt-2">{card.metric}</div>
                      <div className="text-[11px] font-mono text-cream/45 mt-1">{card.detail}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-card-dark rounded-2rem p-5 border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-clay animate-ping" />
                  <span className="text-xs font-mono text-clay font-bold tracking-wider uppercase">Study notes</span>
                </div>
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 font-mono text-xs text-emerald-300/90 leading-relaxed min-h-[72px] flex items-start gap-2">
                  <Terminal className="w-4 h-4 text-clay flex-shrink-0 mt-0.5" />
                  <span>{logs[telemetryIndex % logs.length]}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <PredictConsole
                inputs={inputs}
                onChange={handleInputChange}
                presets={lab?.dataset?.presets}
                options={lab?.dataset?.options}
                onPreset={(preset) => setInputs(presetToInputs(preset))}
                prediction={prediction}
                error={predictError}
                isLoading={isLoading}
                onSubmit={() => runInference(inputs)}
              />
            </div>
          </div>
          {labError && (
            <p className="mt-6 text-sm text-clay">{labError}</p>
          )}
        </div>
      </section>

      <DatasetSection lab={lab} />
      <TrainingSection lab={lab} />

      <section id="manifesto" className="py-32 md:py-44 px-6 md:px-16 lg:px-24 bg-charcoal-deep text-cream relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="manifesto-text inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-clay/20 text-clay font-mono text-xs tracking-widest uppercase mb-8">
            <Compass className="w-3.5 h-3.5" />
            <span>What to say in the room</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center mb-16">
            <div className="manifesto-text">
              <h3 className="text-cream/40 text-2xl sm:text-3xl md:text-4xl font-light tracking-tight leading-snug">
                The label is not a formula.
              </h3>
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-cream mt-2 tracking-tight">
                It is the dataset&apos;s own disorder field.
              </p>
            </div>
            <div className="manifesto-text md:border-l md:border-white/15 md:pl-16">
              <h3 className="text-clay text-2xl sm:text-3xl font-light tracking-tight">Empty cells mean</h3>
              <p className="bio-serif text-4xl sm:text-5xl md:text-6xl text-white mt-2 leading-tight">None.</p>
            </div>
          </div>
          <div className="manifesto-text grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-white/15">
            <div className="space-y-3">
              <span className="text-xs font-mono text-clay uppercase tracking-wider block">01 // The split</span>
              <h4 className="text-lg font-bold text-white">75 people is a small holdout</h4>
              <p className="text-xs text-cream/70 leading-relaxed">
                The test set is about one fifth of 374 rows. The 5-fold macro-F1 sits next to the holdout number so one lucky split is not the whole story.
              </p>
            </div>
            <div className="space-y-3">
              <span className="text-xs font-mono text-clay uppercase tracking-wider block">02 // The score</span>
              <h4 className="text-lg font-bold text-white">Accuracy flatters the majority class</h4>
              <p className="text-xs text-cream/70 leading-relaxed">
                None is 219 rows. A model can look strong by saying &quot;no disorder&quot; often. Macro-F1 gives Insomnia and Sleep Apnea equal weight.
              </p>
            </div>
            <div className="space-y-3">
              <span className="text-xs font-mono text-clay uppercase tracking-wider block">03 // The limit</span>
              <h4 className="text-lg font-bold text-white">Disagreement is part of the demo</h4>
              <p className="text-xs text-cream/70 leading-relaxed">
                The three models will not always match. That is the comparison. This screens lifestyle patterns in a public file. It does not diagnose anyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="rounded-t-4rem bg-charcoal text-cream pt-20 pb-12 px-6 md:px-16 lg:px-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16 border-b border-white/10">
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-clay" />
                <span className="font-extrabold text-xl tracking-tight uppercase text-white">
                  VITALIS <span className="text-clay font-mono text-sm">// LABS</span>
                </span>
              </div>
              <p className="text-xs text-cream/70 max-w-sm leading-relaxed">
                A three-class sleep-disorder study on the Kaggle Sleep Health and Lifestyle dataset. Logistic regression, naive Bayes, and random forest, scored with macro-F1.
              </p>
            </div>
            <div className="md:col-span-4 space-y-3 font-mono text-xs text-cream/60">
              <span className="text-[11px] uppercase tracking-wider text-white font-bold block mb-2">Study</span>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Models</span>
                <span className="text-white">LR · NB · RF</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Holdout winner</span>
                <span className="text-white">{lab ? MODEL_LABELS[lab.winner] : "—"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Macro-F1</span>
                <span className="text-clay font-bold">{winner ? pct(winner.macro_f1) : "—"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Accuracy</span>
                <span className="text-emerald-300 font-bold">{winner ? pct(winner.accuracy) : "—"}</span>
              </div>
            </div>
            <div className="md:col-span-3 space-y-3 text-xs text-cream/60">
              <span className="text-[11px] uppercase tracking-wider text-white font-bold block mb-2 font-mono">Scope</span>
              <p className="text-[11px] text-cream/50 leading-relaxed">
                374 published records. Empty disorder cells are the None class. Not a medical device, and not a readiness score built from the same inputs.
              </p>
            </div>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-cream/40">
            <div>VITALIS sleep-disorder study</div>
            <div className="flex items-center gap-6">
              <a href="#dataset" className="hover:text-cream transition-colors">Dataset</a>
              <a href="#training" className="hover:text-cream transition-colors">Training</a>
              <a href="http://127.0.0.1:8000/docs" target="_blank" rel="noreferrer" className="hover:text-clay transition-colors">API docs</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
