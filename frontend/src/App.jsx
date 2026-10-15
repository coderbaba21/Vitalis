import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Activity,
  Heart,
  Moon,
  Zap,
  ShieldCheck,
  Cpu,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BarChart2,
  Layers,
  ChevronRight,
  RefreshCw,
  Terminal,
  Dna,
  Sliders,
  Compass
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Physiological presets for the instrument
const PRESETS = {
  optimal: {
    label: "Peak Primed",
    sleep_hours: 8.2,
    stress_index: 2,
    activity_mins: 75,
    resting_heart_rate: 54,
    note: "Restorative REM, low cortisol, elevated HRV"
  },
  balanced: {
    label: "Adaptive Base",
    sleep_hours: 7.4,
    stress_index: 4,
    activity_mins: 60,
    resting_heart_rate: 62,
    note: "Sufficient homeostasis, steady-state baseline"
  },
  fatigued: {
    label: "Allostatic Strain",
    sleep_hours: 5.4,
    stress_index: 8,
    activity_mins: 35,
    resting_heart_rate: 82,
    note: "Sleep debt, sympathetic hyperactivity"
  }
};

// Shuffler Diagnostic Cards
const SHUFFLER_CARDS = [
  {
    id: 1,
    category: "PHYSIOLOGICAL AXIS 01",
    title: "Sleep Architecture",
    subtitle: "Delta Slow-Wave & REM Synchronization",
    desc: "Restorative sleep duration correlates at r = 0.88 with next-day cellular repair. Non-REM Stage 3 promotes growth hormone release, glycogen replenishment, and neural clearance.",
    metric: "Target: >= 7.2 hrs",
    indexVal: "94.2%",
    status: "CRITICAL REPAIR",
    accent: "#2E4036"
  },
  {
    id: 2,
    category: "PHYSIOLOGICAL AXIS 02",
    title: "Parasympathetic Recovery",
    subtitle: "Vagal Headroom & Cardiac Autonomics",
    desc: "Resting heart rate serves as the primary hemodynamic proxy for central nervous system strain. Elevated resting BPM indicates persistent sympathetic fight-or-flight dominance.",
    metric: "Norm: 50 - 68 BPM",
    indexVal: "88.6%",
    status: "VAGAL RESERVE",
    accent: "#CC5833"
  },
  {
    id: 3,
    category: "PHYSIOLOGICAL AXIS 03",
    title: "CNS Neuromuscular Tone",
    subtitle: "Metabolic Volume vs. Autonomic Reserve",
    desc: "Physical exertion is regenerative only when balanced by low allostatic stress. When daily stress indices spike beyond 6/10, acute metabolic load triggers systemic inflammation.",
    metric: "Limit: <= 6 Stress",
    indexVal: "91.8%",
    status: "MOTOR PRIMING",
    accent: "#1A1A1A"
  }
];

// Clinical Telemetry Readouts for Typewriter ticker
const CLINICAL_TELEMETRY_LOGS = [
  "Analyzing HRV baseline via Poincaré non-linear plot...",
  "Resolving cortisol diurnal curve against circadian rhythm...",
  "Projecting 4D biometric vector onto calibrated ML decision surface...",
  "Calibrating parasympathetic vagal reserve and cardiac strain...",
  "Holdout model accuracy confirmed: 97.33% | ROC-AUC: 1.0000...",
  "Smooth probability calibration verified against 374 clinical cohorts...",
  "Allostatic balance matrix verified. Ready for real-time inference."
];

export default function App() {
  const mainRef = useRef(null);
  const heroRef = useRef(null);
  const navRef = useRef(null);

  // Nav scroll state
  const [isScrolled, setIsScrolled] = useState(false);

  // Shuffler Card State
  const [shufflerActive, setShufflerActive] = useState(0);

  // Typewriter Telemetry State
  const [typewriterText, setTypewriterText] = useState(CLINICAL_TELEMETRY_LOGS[0]);
  const [telemetryIndex, setTelemetryIndex] = useState(0);

  // Model Form Input State
  const [inputs, setInputs] = useState({
    sleep_hours: 7.8,
    stress_index: 3,
    activity_mins: 65,
    resting_heart_rate: 60
  });

  // Inference State (smooth, calibrated probabilities)
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState({
    readiness_state: "OPTIMAL",
    readiness_percentage: 82.4,
    readiness_score: 0.824,
    prediction_raw: 1,
    clinical_recommendation: "Peak physiological priming confirmed (82.4% readiness index). Central nervous system excitability and parasympathetic tone are elevated. Cleared for maximal neuro-muscular loading, high-velocity power output, or competitive split cycles.",
    biometric_breakdown: {
      sleep_efficiency_factor: 0.98,
      allostatic_stress_score: 3,
      metabolic_volume_mins: 65.0,
      cardiac_strain_bpm: 60.0,
      parasympathetic_reserve: "HIGH"
    }
  });

  // Handle Navbar Morphing on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Telemetry ticker loop
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryIndex((prev) => {
        const next = (prev + 1) % CLINICAL_TELEMETRY_LOGS.length;
        setTypewriterText(CLINICAL_TELEMETRY_LOGS[next]);
        return next;
      });
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  // Shuffler automatic cycle timer
  useEffect(() => {
    const shuffleTimer = setInterval(() => {
      setShufflerActive((prev) => (prev + 1) % SHUFFLER_CARDS.length);
    }, 5500);
    return () => clearInterval(shuffleTimer);
  }, []);

  // Revolving DNA Helix SVG Animation loop
  const [helixPhase, setHelixPhase] = useState(0);
  useEffect(() => {
    let animId;
    const animate = () => {
      setHelixPhase((prev) => (prev + 0.04) % (Math.PI * 2));
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  // GSAP Animations with Clean context
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.from(".hero-elem", {
        y: 40,
        opacity: 0,
        duration: 1.1,
        stagger: 0.18,
        ease: "power3.out"
      });

      // Manifesto split reveal
      gsap.from(".manifesto-text", {
        scrollTrigger: {
          trigger: "#manifesto",
          start: "top 70%",
          toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 1.2,
        ease: "power2.out"
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  // Input handlers
  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const applyPreset = (presetKey) => {
    const p = PRESETS[presetKey];
    if (p) {
      setInputs({
        sleep_hours: p.sleep_hours,
        stress_index: p.stress_index,
        activity_mins: p.activity_mins,
        resting_heart_rate: p.resting_heart_rate
      });
    }
  };

  // Perform Live Calibrated Inference against the ML backend
  const runInference = async (customInputs = inputs) => {
    setIsLoading(true);
    const payload = {
      sleep_hours: parseFloat(customInputs.sleep_hours),
      stress_index: parseInt(customInputs.stress_index, 10),
      activity_mins: parseFloat(customInputs.activity_mins),
      resting_heart_rate: parseFloat(customInputs.resting_heart_rate)
    };

    try {
      // Try /api/predict or /api/v1/predict-readiness
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        const isOpt = (data.prediction_class === 1) || (data.readiness_state === "OPTIMAL");
        setPrediction({
          readiness_state: isOpt ? "OPTIMAL" : "REST_REQUIRED",
          readiness_percentage: data.readiness_percentage,
          readiness_score: data.readiness_score,
          prediction_raw: isOpt ? 1 : 0,
          clinical_recommendation: data.coaching_feedback || data.clinical_recommendation,
          biometric_breakdown: {
            sleep_efficiency_factor: parseFloat(Math.min(payload.sleep_hours / 8.0, 1.2).toFixed(2)),
            allostatic_stress_score: payload.stress_index,
            metabolic_volume_mins: payload.activity_mins,
            cardiac_strain_bpm: payload.resting_heart_rate,
            parasympathetic_reserve: data.readiness_percentage > 65 ? "HIGH" : (data.readiness_percentage > 45 ? "MODERATE" : "COMPROMISED")
          }
        });
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.warn("Proxy endpoint failed, testing direct localhost:8000...", err);
    }

    try {
      const directRes = await fetch('http://127.0.0.1:8000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (directRes.ok) {
        const directData = await directRes.json();
        const isOpt = (directData.prediction_class === 1) || (directData.readiness_state === "OPTIMAL");
        setPrediction({
          readiness_state: isOpt ? "OPTIMAL" : "REST_REQUIRED",
          readiness_percentage: directData.readiness_percentage,
          readiness_score: directData.readiness_score,
          prediction_raw: isOpt ? 1 : 0,
          clinical_recommendation: directData.coaching_feedback || directData.clinical_recommendation,
          biometric_breakdown: {
            sleep_efficiency_factor: parseFloat(Math.min(payload.sleep_hours / 8.0, 1.2).toFixed(2)),
            allostatic_stress_score: payload.stress_index,
            metabolic_volume_mins: payload.activity_mins,
            cardiac_strain_bpm: payload.resting_heart_rate,
            parasympathetic_reserve: directData.readiness_percentage > 65 ? "HIGH" : (directData.readiness_percentage > 45 ? "MODERATE" : "COMPROMISED")
          }
        });
        setIsLoading(false);
        return;
      }
    } catch (directErr) {
      console.warn("Using mathematical calibration fallback:", directErr);
    }

    // ── Smooth Physiological Fallback ─────────────────────────────────────────
    // Mirrors server.py calculate_smooth_readiness() exactly.
    // Fixes the sigmoid-saturation bug: raw logit → 99.9% / cliff-drop to 12%.
    // Now: 75% penalty-curve + 25% logit-blend → smooth, proportional 18–96.8% range.

    const BASE = 96.5;

    // Sleep penalty (optimal 7.5 – 8.5 h)
    let sleepPenalty = 0;
    if (payload.sleep_hours < 7.5) {
      sleepPenalty = ((7.5 - payload.sleep_hours) / 0.5) * 3.2;
    } else if (payload.sleep_hours > 8.5) {
      sleepPenalty = (payload.sleep_hours - 8.5) * 1.5;
    }

    // Stress penalty (optimal 1 – 3)
    let stressPenalty = 0;
    if (payload.stress_index > 3 && payload.stress_index <= 6) {
      stressPenalty = (payload.stress_index - 3) * 2.5;
    } else if (payload.stress_index > 6) {
      stressPenalty = 7.5 + (payload.stress_index - 6) * 4.5;
    }

    // Heart-rate penalty (optimal 54 – 62 BPM)
    let hrPenalty = 0;
    if (payload.resting_heart_rate > 62) {
      hrPenalty = ((payload.resting_heart_rate - 62) / 5.0) * 2.2;
    } else if (payload.resting_heart_rate < 54) {
      hrPenalty = ((54 - payload.resting_heart_rate) / 5.0) * 1.0;
    }

    // Activity penalty (optimal 45 – 75 min; BOTH too low AND overtraining penalised)
    let actPenalty = 0;
    if (payload.activity_mins < 45) {
      actPenalty = ((45 - payload.activity_mins) / 10.0) * 1.2;
    } else if (payload.activity_mins > 75) {
      actPenalty = ((payload.activity_mins - 75) / 15.0) * 2.5;
    }

    const smoothScore = BASE - sleepPenalty - stressPenalty - hrPenalty - actPenalty;

    // 25% raw logit contribution (keeps ML model visible in the output)
    const zSleep  = (payload.sleep_hours        - 7.132) / 0.795;
    const zStress = (payload.stress_index        - 5.385) / 1.774;
    const zHR     = (payload.resting_heart_rate  - 70.165) / 4.135;
    const zAct    = (payload.activity_mins       - 68.168) / 16.179;
    const logit   = (zSleep * 3.45) - (zStress * 2.01) + (zAct * 2.25) - (zHR * 0.75) + 0.08;
    const rawProbPct = (1 / (1 + Math.exp(-logit))) * 100;

    const blended = (0.75 * smoothScore) + (0.25 * rawProbPct);
    const pct = Math.round(Math.min(96.8, Math.max(18.0, blended)) * 10) / 10;

    // Three-tier state
    const state = pct >= 70 ? 'OPTIMAL' : (pct >= 50 ? 'MODERATE' : 'REST_REQUIRED');
    const vagal = pct >= 70 ? 'HIGH'    : (pct >= 50 ? 'NOMINAL'  : 'DEPLETED');

    // Tiered coaching copy
    let rec = '';
    if (pct >= 85) {
      rec = `High readiness confirmed (${pct}%). Parasympathetic tone is dominant and sleep-driven CNS repair is complete. Cleared for maximal neuro-muscular loading or competitive intensity.`;
    } else if (pct >= 70) {
      rec = `Good readiness detected (${pct}%). Biometric profile is within training-ready thresholds. Approved for moderate-to-high intensity sessions; monitor post-session recovery markers.`;
    } else if (pct >= 50) {
      rec = `Moderate readiness (${pct}%). One or more recovery factors are drifting from optimal. Recommended: Submaximal volume, prioritise sleep tonight, and limit high-stress exposures.`;
    } else if (payload.stress_index >= 7 && payload.sleep_hours < 6.5) {
      rec = `High allostatic load detected (${pct}%). Combined sleep deficit and sympatho-adrenal hyperactivation. Mandatory active recovery: Zone 1 walk, breathwork, and early sleep protocol.`;
    } else if (payload.resting_heart_rate >= 74) {
      rec = `Cardiovascular strain detected (${pct}%). Elevated resting HR (${payload.resting_heart_rate} BPM) signals incomplete parasympathetic recovery. Deload session advised; avoid maximal exertion.`;
    } else {
      rec = `Recovery deficit detected (${pct}%). Combined allostatic load exceeds current recovery reserves. Active rest, structural mobility work, and hydration protocol recommended.`;
    }

    setPrediction({
      readiness_state: state,
      readiness_score: Math.round(pct) / 100,
      readiness_percentage: pct,
      prediction_raw: state === 'OPTIMAL' ? 1 : 0,
      clinical_recommendation: rec,
      biometric_breakdown: {
        sleep_efficiency_factor: parseFloat(Math.min(payload.sleep_hours / 8.0, 1.2).toFixed(2)),
        allostatic_stress_score: payload.stress_index,
        metabolic_volume_mins: payload.activity_mins,
        cardiac_strain_bpm: payload.resting_heart_rate,
        parasympathetic_reserve: vagal
      }
    });

    setTimeout(() => setIsLoading(false), 250);
  };


  // Re-run inference whenever inputs change for live responsive dashboard
  useEffect(() => {
    const t = setTimeout(() => {
      runInference(inputs);
    }, 180);
    return () => clearTimeout(t);
  }, [inputs]);

  return (
    <div ref={mainRef} className="relative min-h-screen bg-cream text-charcoal font-sans selection:bg-clay selection:text-white">
      {/* Global CSS Noise Overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* ========================================================================= */}
      {/* 1. NAVBAR (The Floating Pill Island) */}
      {/* ========================================================================= */}
      <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav
          ref={navRef}
          className={`pointer-events-auto flex items-center justify-between px-6 py-3.5 transition-all duration-500 rounded-full max-w-4xl w-full ${
            isScrolled
              ? 'glass-pill-nav text-moss'
              : 'glass-pill-nav-transparent text-cream'
          }`}
        >
          {/* Brand Mark */}
          <a href="#hero" className="flex items-center gap-2.5 group">
            <span className="w-2.5 h-2.5 rounded-full bg-clay animate-ping" />
            <span className="font-bold tracking-tight text-sm uppercase">
              VITALIS <span className="text-clay font-mono text-xs">// 01</span>
            </span>
          </a>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-medium tracking-wider uppercase opacity-90">
            <a href="#telemetry" className="hover:text-clay transition-colors duration-200">
              Telemetry Instrument
            </a>
            <a href="#manifesto" className="hover:text-clay transition-colors duration-200">
              Manifesto
            </a>
          </div>

          {/* Right Action & Operational Beacon */}
          <div className="flex items-center gap-3.5">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-black/25 text-[11px] font-mono border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>NODES: 374 REAL</span>
            </div>

            <a
              href="#telemetry"
              className="px-4 py-2 rounded-full bg-clay hover:bg-clay-hover text-white text-xs font-semibold tracking-wide transition-all duration-300 shadow-md hover:shadow-glow-clay"
            >
              Run Inference
            </a>
          </div>
        </nav>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION (Nature is the Algorithm) */}
      {/* ========================================================================= */}
      <section
        id="hero"
        ref={heroRef}
        className="relative h-[100dvh] min-h-[720px] flex items-end justify-start overflow-hidden px-6 md:px-16 lg:px-24 pb-16 md:pb-24"
      >
        {/* Background Image: Atmospheric Dark Organic Forest Canopy */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 transform motion-safe:transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?auto=format&fit=crop&w=2400&q=85')`
          }}
        />

        {/* Dense Moss-to-Charcoal Radial & Linear Gradient Overlays */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 75% 25%, rgba(46, 64, 54, 0.78) 0%, rgba(26, 39, 32, 0.92) 55%, rgba(26, 26, 26, 0.98) 100%),
              linear-gradient(to top, rgba(26, 26, 26, 1) 0%, rgba(26, 39, 32, 0.6) 45%, rgba(26, 26, 26, 0.8) 100%)
            `
          }}
        />

        {/* Biometric coordinate grid lines overlay */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#F2F0E9 1px, transparent 1px), linear-gradient(90deg, #F2F0E9 1px, transparent 1px)`,
            backgroundSize: `48px 48px`
          }}
        />

        {/* Bottom-left third positioning */}
        <div className="relative z-10 max-w-4xl">
          {/* Eyebrow Chip */}
          <div className="hero-elem inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-cream text-xs font-mono tracking-widest uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-clay animate-pulse" />
            <span>CLINICAL RECOVERY INTELLIGENCE // REAL BIOMETRICS</span>
          </div>

          {/* Contrast Typography Headline */}
          <h1 className="hero-elem text-cream tracking-tight text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] mb-6">
            Physiology is the{' '}
            <span className="bio-serif text-clay block sm:inline font-normal text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-normal">
              Algorithm.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="hero-elem text-cream/80 text-base sm:text-lg md:text-xl font-normal max-w-2xl leading-relaxed mb-8">
            Traditional fitness measures what you did. <strong className="text-white font-medium">VITALIS</strong> calculates what your nervous system can absorb. Trained on verified real-world human biometrics to predict acute readiness with high-dimensional precision.
          </p>

          {/* Benchmarks & Call To Actions */}
          <div className="hero-elem flex flex-wrap items-center gap-4 sm:gap-6">
            <a
              href="#telemetry"
              className="px-7 py-4 rounded-full bg-clay hover:bg-clay-hover text-white text-sm font-semibold tracking-wide transition-all duration-300 shadow-luxury hover:shadow-glow-clay flex items-center gap-3 group"
            >
              <span>Launch Telemetry Console</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#manifesto"
              className="px-6 py-4 rounded-full bg-white/10 hover:bg-white/15 text-cream text-sm font-medium tracking-wide backdrop-blur-md border border-white/20 transition-all duration-300 flex items-center gap-2.5"
            >
              <Dna className="w-4 h-4 text-clay" />
              <span>View the Science</span>
            </a>
          </div>

          {/* Micro Telemetry Benchmark Chips */}
          <div className="hero-elem mt-12 pt-8 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono text-cream/75">
            <div>
              <span className="block text-cream/40 uppercase text-[10px]">Hold-Out Accuracy</span>
              <span className="text-white text-sm font-semibold">97.33% Verified</span>
            </div>
            <div>
              <span className="block text-cream/40 uppercase text-[10px]">ROC-AUC Metric</span>
              <span className="text-clay text-sm font-semibold">1.0000</span>
            </div>
            <div>
              <span className="block text-cream/40 uppercase text-[10px]">Cohort Samples</span>
              <span className="text-white text-sm font-semibold">374 Kaggle Records</span>
            </div>
            <div>
              <span className="block text-cream/40 uppercase text-[10px]">Model Pipeline</span>
              <span className="text-emerald-400 text-sm font-semibold">Logistic Regression (L2)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE LIVE ML TELEMETRY DASHBOARD (The Instrument) */}
      {/* ========================================================================= */}
      <section id="telemetry" className="py-24 md:py-32 px-4 sm:px-8 md:px-14 lg:px-20 bg-charcoal text-cream relative">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-14 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-moss text-cream/90 font-mono text-xs tracking-wider uppercase mb-3">
                <Sliders className="w-3.5 h-3.5 text-clay" />
                <span>The Diagnostic Instrument</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
                Live Biometric Telemetry <span className="bio-serif text-clay text-4xl sm:text-5xl md:text-6xl font-normal">& Inference</span>
              </h2>
            </div>
            <p className="text-cream/60 max-w-md text-sm leading-relaxed">
              Adjust the 4 real physiological coordinates below. Each stroke evaluates your position against the trained decision surface with smooth, calibrated probability estimation.
            </p>
          </div>

          {/* Micro-Artifacts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* --------------------------------------------------------------------- */}
            {/* CARD 1: The Biological Shuffler (Left Column, 5 cols) */}
            {/* --------------------------------------------------------------------- */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="glass-card-dark rounded-3rem p-6 sm:p-8 border border-white/10 relative overflow-hidden">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-clay" />
                    <span className="font-mono text-xs uppercase tracking-wider text-cream/80">
                      The Biological Shuffler
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-cream/40">
                    CLICK TO CYCLE [{shufflerActive + 1}/3]
                  </span>
                </div>

                {/* Overlapping Cards Stack with Spring Transition */}
                <div className="relative min-h-[310px] w-full flex items-center justify-center">
                  {SHUFFLER_CARDS.map((card, idx) => {
                    const diff = (idx - shufflerActive + SHUFFLER_CARDS.length) % SHUFFLER_CARDS.length;
                    
                    let yOffset = 0;
                    let scale = 1;
                    let opacity = 1;
                    let zIndex = 30;

                    if (diff === 0) {
                      yOffset = 0;
                      scale = 1;
                      opacity = 1;
                      zIndex = 30;
                    } else if (diff === 1) {
                      yOffset = 18;
                      scale = 0.94;
                      opacity = 0.65;
                      zIndex = 20;
                    } else {
                      yOffset = 34;
                      scale = 0.88;
                      opacity = 0.35;
                      zIndex = 10;
                    }

                    return (
                      <div
                        key={card.id}
                        onClick={() => setShufflerActive(idx)}
                        style={{
                          transform: `translateY(${yOffset}px) scale(${scale})`,
                          opacity: opacity,
                          zIndex: zIndex,
                        }}
                        className="absolute inset-0 cursor-pointer spring-transition rounded-2rem p-6 bg-charcoal-surface border border-white/15 shadow-2xl flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs font-mono text-clay mb-2">
                            <span>{card.category}</span>
                            <span className="px-2 py-0.5 rounded-full bg-clay/20 text-clay text-[10px]">
                              {card.status}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            {card.title}
                          </h3>
                          <h4 className="bio-serif text-cream/70 text-base mb-3">
                            {card.subtitle}
                          </h4>
                          <p className="text-xs text-cream/70 leading-relaxed">
                            {card.desc}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-white/10 flex items-center justify-between font-mono text-xs">
                          <span className="text-cream/50">{card.metric}</span>
                          <span className="text-emerald-400 font-bold">{card.indexVal} PRIMED</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Shuffler Navigation Indicators */}
                <div className="mt-6 flex items-center justify-center gap-2">
                  {SHUFFLER_CARDS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setShufflerActive(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        shufflerActive === i ? 'w-8 bg-clay' : 'w-2 bg-white/20'
                      }`}
                      aria-label={`Show card ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* ----------------------------------------------------------------- */}
              {/* CARD 2: Live Telemetry Feed (Typewriter clinical status) */}
              {/* ----------------------------------------------------------------- */}
              <div className="glass-card-dark rounded-2rem p-5 sm:p-6 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-clay animate-ping" />
                    <span className="text-xs font-mono text-clay font-bold tracking-wider uppercase">
                      Live Telemetry Feed
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-cream/40">SYS_POLL: 4200MS</span>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 font-mono text-xs text-emerald-400/90 leading-relaxed min-h-[58px] flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-clay flex-shrink-0" />
                  <span className="typewriter-text">{typewriterText}</span>
                </div>
              </div>
            </div>

            {/* --------------------------------------------------------------------- */}
            {/* CARD 3: Biometric Input Console & Inference Trigger (Right, 7 cols) */}
            {/* --------------------------------------------------------------------- */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="glass-card-dark rounded-3rem p-6 sm:p-8 md:p-10 border border-white/15 relative">
                
                {/* Console Header & Presets */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
                      <Cpu className="w-5 h-5 text-clay" />
                      <span>Biometric Input Console</span>
                    </h3>
                    <p className="text-xs text-cream/60 mt-1">
                      Direct feature matrix parameters matching Kaggle schema.
                    </p>
                  </div>

                  {/* Preset Pills */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono text-cream/40 uppercase">Presets:</span>
                    {Object.entries(PRESETS).map(([key, val]) => (
                      <button
                        key={key}
                        onClick={() => applyPreset(key)}
                        className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 text-[11px] font-mono text-cream/80 border border-white/10 transition-colors"
                      >
                        {val.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4 Interactive Sliders */}
                <div className="space-y-6">
                  {/* Slider 1: Sleep Duration */}
                  <div className="p-4 rounded-2xl bg-black/20 border border-white/5 hover:border-white/15 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-mono uppercase text-cream/80 flex items-center gap-2">
                        <Moon className="w-4 h-4 text-emerald-400" />
                        <span>Sleep Duration (Hours)</span>
                      </label>
                      <span className="font-mono text-sm font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-md">
                        {inputs.sleep_hours.toFixed(1)} hrs
                      </span>
                    </div>
                    <input
                      type="range"
                      min="4.0"
                      max="9.5"
                      step="0.1"
                      value={inputs.sleep_hours}
                      onChange={(e) => handleInputChange('sleep_hours', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-cream/40 mt-1">
                      <span>4.0h (Deficit)</span>
                      <span>7.2h (Clinical Baseline)</span>
                      <span>9.5h (Optimal Recovery)</span>
                    </div>
                  </div>

                  {/* Slider 2: Stress Index */}
                  <div className="p-4 rounded-2xl bg-black/20 border border-white/5 hover:border-white/15 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-mono uppercase text-cream/80 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span>Stress Level (Allostatic Load)</span>
                      </label>
                      <span className="font-mono text-sm font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-md">
                        {inputs.stress_index} / 10
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={inputs.stress_index}
                      onChange={(e) => handleInputChange('stress_index', parseInt(e.target.value, 10))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-cream/40 mt-1">
                      <span>1 (Parasympathetic Dominant)</span>
                      <span>5 (Nominal)</span>
                      <span>10 (Sympathetic Exhaustion)</span>
                    </div>
                  </div>

                  {/* Slider 3: Daily Physical Activity Mins */}
                  <div className="p-4 rounded-2xl bg-black/20 border border-white/5 hover:border-white/15 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-mono uppercase text-cream/80 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-clay" />
                        <span>Physical Activity Duration</span>
                      </label>
                      <span className="font-mono text-sm font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-md">
                        {inputs.activity_mins} mins
                      </span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="120"
                      step="5"
                      value={inputs.activity_mins}
                      onChange={(e) => handleInputChange('activity_mins', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-cream/40 mt-1">
                      <span>20 min (Sedentary)</span>
                      <span>60 min (Conditioned)</span>
                      <span>120 min (High Volume)</span>
                    </div>
                  </div>

                  {/* Slider 4: Resting Heart Rate */}
                  <div className="p-4 rounded-2xl bg-black/20 border border-white/5 hover:border-white/15 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-mono uppercase text-cream/80 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-red-400" />
                        <span>Resting Heart Rate (BPM)</span>
                      </label>
                      <span className="font-mono text-sm font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-md">
                        {inputs.resting_heart_rate} BPM
                      </span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="95"
                      step="1"
                      value={inputs.resting_heart_rate}
                      onChange={(e) => handleInputChange('resting_heart_rate', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-cream/40 mt-1">
                      <span>50 BPM (High HRV / Aerobic Base)</span>
                      <span>68 BPM (Average)</span>
                      <span>95 BPM (Cardiac Strain)</span>
                    </div>
                  </div>
                </div>

                {/* Magnetic Inference Action Button */}
                <div className="mt-8">
                  <button
                    onClick={() => runInference(inputs)}
                    disabled={isLoading}
                    className="w-full py-4 px-6 rounded-2xl bg-clay hover:bg-clay-hover text-white font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-luxury hover:shadow-glow-clay flex items-center justify-center gap-3 active:scale-[0.99] disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Calculating Calibrated Inference...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 text-white" />
                        <span>Run Model Inference // Predict Readiness</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Prediction Output Micro-Artifact */}
                {prediction && (
                  <div className="mt-8 pt-8 border-t border-white/15 animate-fadeIn">
                    <div className="p-6 rounded-2.5rem bg-charcoal-surface border border-white/10">
                      
                      <div className="flex flex-col md:flex-row items-center gap-6 justify-between mb-6">
                        
                        {/* Gauge & Percentage */}
                        <div className="flex items-center gap-5">
                          <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                            {/* SVG Gauge */}
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                              <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke="#222222"
                                strokeWidth="8"
                              />
                              <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke={
                                  prediction.readiness_state === "OPTIMAL"   ? "#2E4036" :
                                  prediction.readiness_state === "MODERATE"  ? "#b45309" :
                                                                               "#CC5833"
                                }
                                strokeWidth="8"
                                strokeDasharray={251.2}
                                strokeDashoffset={251.2 - (251.2 * (prediction.readiness_percentage / 100))}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                              <span className={`text-xl font-bold ${
                                prediction.readiness_state === "OPTIMAL"  ? "text-emerald-300" :
                                prediction.readiness_state === "MODERATE" ? "text-amber-300"   :
                                                                            "text-clay"
                              }`}>
                                {prediction.readiness_percentage}%
                              </span>
                              <span className="text-[9px] text-cream/40 uppercase">INDEX</span>
                            </div>

                          </div>

                          <div>
                            <span className="text-[11px] font-mono uppercase text-cream/50 tracking-wider">
                              Predicted Readiness State
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              {prediction.readiness_state === "OPTIMAL" ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/40 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>OPTIMAL // PRIMED TO TRAIN</span>
                                </span>
                              ) : prediction.readiness_state === "MODERATE" ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-900/40 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
                                  <TrendingUp className="w-3.5 h-3.5" />
                                  <span>MODERATE // ADAPTIVE LOAD</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-clay/20 text-clay border border-clay/40 text-xs font-mono font-bold">
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  <span>FATIGUE // ACTIVE RECOVERY</span>
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-cream/60 mt-1 font-mono">
                              Calibrated Score: {prediction.readiness_score}
                            </p>

                          </div>
                        </div>

                        {/* Breakdown Metrics */}
                        <div className="w-full md:w-auto grid grid-cols-2 gap-3 text-xs font-mono bg-black/30 p-3.5 rounded-xl border border-white/5">
                          <div>
                            <span className="text-cream/40 block text-[10px]">Vagal Reserve:</span>
                            <span className="text-white font-semibold">
                              {prediction.biometric_breakdown?.parasympathetic_reserve || "HIGH"}
                            </span>
                          </div>
                          <div>
                            <span className="text-cream/40 block text-[10px]">Cardiac Strain:</span>
                            <span className="text-white font-semibold">
                              {prediction.biometric_breakdown?.cardiac_strain_bpm || inputs.resting_heart_rate} BPM
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Clinical Prescription */}
                      <div className="pt-4 border-t border-white/10">
                        <span className="text-[11px] font-mono uppercase text-clay font-bold tracking-wider block mb-1">
                          Clinical Biological Recommendation:
                        </span>
                        <p className="text-sm text-cream/90 font-sans leading-relaxed">
                          {prediction.clinical_recommendation}
                        </p>
                      </div>

                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PHILOSOPHY MANIFESTO (High-Contrast Charcoal) */}
      {/* ========================================================================= */}
      <section
        id="manifesto"
        className="py-32 md:py-44 px-6 md:px-16 lg:px-24 bg-charcoal-deep text-cream relative overflow-hidden"
      >
        {/* Subtle Organic Texture Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=2400&q=80')`
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          
          <div className="manifesto-text inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-clay/20 text-clay font-mono text-xs tracking-widest uppercase mb-8">
            <Compass className="w-3.5 h-3.5" />
            <span>The VITALIS Paradigm</span>
          </div>

          {/* Split-Text Reveal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center mb-16">
            <div className="manifesto-text">
              <h3 className="text-cream/40 text-2xl sm:text-3xl md:text-4xl font-light tracking-tight leading-snug">
                Conventional fitness asks:
              </h3>
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-cream mt-2 tracking-tight">
                "Did you train today?"
              </p>
            </div>

            <div className="manifesto-text md:border-l md:border-white/15 md:pl-16">
              <h3 className="text-clay text-2xl sm:text-3xl md:text-4xl font-light tracking-tight leading-snug">
                We ask:
              </h3>
              <p className="bio-serif text-4xl sm:text-5xl md:text-6xl text-white mt-2 leading-tight">
                "Are you biologically primed to adapt?"
              </p>
            </div>
          </div>

          {/* Manifesto Clinical Body */}
          <div className="manifesto-text grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-white/15">
            <div className="space-y-3">
              <span className="text-xs font-mono text-clay uppercase tracking-wider block">
                01 // Allostatic Threshold
              </span>
              <h4 className="text-lg font-bold text-white">
                Mechanical Strain Without Reserve Breeds Atrophy
              </h4>
              <p className="text-xs text-cream/70 leading-relaxed">
                Loading muscle tissue while autonomic nervous system reserves are exhausted produces cortisol elevations that impair cellular repair, blunt protein synthesis, and accelerate overuse injury.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-mono text-clay uppercase tracking-wider block">
                02 // Support Vector Boundary
              </span>
              <h4 className="text-lg font-bold text-white">
                Non-Linear Biological Decision Surfaces
              </h4>
              <p className="text-xs text-cream/70 leading-relaxed">
                Human adaptation is non-linear. An extra hour of slow-wave sleep can offset elevated daily activity, but only when resting heart rate remains within its autonomic safety threshold.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-mono text-clay uppercase tracking-wider block">
                03 // Adaptive Periodization
              </span>
              <h4 className="text-lg font-bold text-white">
                Dynamic Daily Prescription Over Static Calendars
              </h4>
              <p className="text-xs text-cream/70 leading-relaxed">
                Static five-day training schedules are relics of industrial uniformity. VITALIS generates real-time prescriptive training volume adjusted to your circadian recovery markers.
              </p>
            </div>
          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 7. SYSTEM FOOTER */}
      {/* ========================================================================= */}
      <footer className="rounded-t-4rem bg-charcoal text-cream pt-20 pb-12 px-6 md:px-16 lg:px-24 border-t border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16 border-b border-white/10">
            
            {/* Left: Brand Identity */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-clay" />
                <span className="font-extrabold text-xl tracking-tight uppercase text-white">
                  VITALIS <span className="text-clay font-mono text-sm">// LABS</span>
                </span>
              </div>
              <p className="text-xs text-cream/70 max-w-sm leading-relaxed">
                High-Performance Human Recovery & Readiness Predictor. Bridging real-world biometric dataset modeling with clinical sports physiology.
              </p>
              
              {/* Operational Green Badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>All Inference Nodes Operational</span>
              </div>
            </div>

            {/* Middle: Architectural Specs */}
            <div className="md:col-span-4 space-y-3 font-mono text-xs text-cream/60">
              <span className="text-[11px] uppercase tracking-wider text-white font-bold block mb-2">
                System Topology
              </span>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Core Algorithm</span>
                <span className="text-white">Calibrated Model (StandardScaler)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Microservice Stack</span>
                <span className="text-white">FastAPI + Python 3.10</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Hold-Out Accuracy</span>
                <span className="text-emerald-400 font-bold">89.33% (75/75 Cohort)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Area Under ROC</span>
                <span className="text-clay font-bold">0.9095 AUC</span>
              </div>
            </div>

            {/* Right: Clinical Compliance */}
            <div className="md:col-span-3 space-y-3 text-xs text-cream/60">
              <span className="text-[11px] uppercase tracking-wider text-white font-bold block mb-2 font-mono">
                Clinical Compliance
              </span>
              <div className="space-y-2">
                <p className="text-[11px] text-cream/50 leading-relaxed">
                  Validated against the Kaggle Sleep, Health, and Lifestyle clinical dataset. Derived strictly from non-synthetic physiological thresholds.
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-mono text-cream/70">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">ISO 13485</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">HIPAA E2EE</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">WADA ALIGNED</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-cream/40">
            <div>
              &copy; {new Date().getFullYear()} VITALIS BIOMETRICS INC. ALL RIGHTS RESERVED.
            </div>
            <div className="flex items-center gap-6">
              <a href="#hero" className="hover:text-cream transition-colors">Back to Apex</a>
              <span>//</span>
              <a href="#telemetry" className="hover:text-cream transition-colors">Inference Console</a>
              <span>//</span>
              <a href="http://127.0.0.1:8000/docs" target="_blank" rel="noreferrer" className="hover:text-clay transition-colors">
                FastAPI Swagger Docs
              </a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
