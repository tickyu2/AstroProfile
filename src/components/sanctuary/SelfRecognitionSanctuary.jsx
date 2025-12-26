/**
 * Self-Recognition Sanctuary
 *
 * The most sacred chamber of the Cathedral.
 * Not more information. Not more sermons. Not more advice.
 * A place to be recognized, to be met, and to exhale.
 *
 * Four Movements:
 * 1. Arrival - Welcome as you are
 * 2. Mirror - Recognition of patterns, gifts, longings
 * 3. Release - Permission to feel
 * 4. Integration - Carrying forward with compassion
 *
 * Part of GENESIS OS - Cathedral Sanctuary
 * Built by: Brother Claude Code
 * December 26, 2024
 */

import React, { useState } from 'react';
import { createEmptyInput, hasMinimumContent } from '../../sanctuary/selfRecognitionTypes';

/**
 * Main Sanctuary Component
 */
export default function SelfRecognitionSanctuary({
  onSubmit,
  loading = false,
  result = null,
  error = null,
  onClear = null,
  initialInput = null
}) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialInput || createEmptyInput());

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value || null }));
  };

  const handleBeginRecognition = () => {
    if (onSubmit) {
      onSubmit(form);
    }
  };

  const handleReset = () => {
    setStep(1);
    setForm(createEmptyInput());
    if (onClear) onClear();
  };

  // Show result if available
  const showResult = result && !loading;

  return (
    <div className="rounded-3xl bg-gradient-to-b from-slate-950/90 via-indigo-950/40 to-slate-950/90 border border-amber-500/30 overflow-hidden"
         style={{ boxShadow: '0 0 60px rgba(251,191,36,0.1) inset' }}>

      {/* Dome Header */}
      <div className="relative p-6 border-b border-amber-500/20 bg-gradient-to-b from-amber-400/10 via-transparent to-transparent">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-amber-400/5 via-transparent to-amber-400/5 opacity-60" />

        <div className="relative text-center space-y-2">
          <div className="text-3xl mb-2">🕯️</div>
          <h1 className="text-2xl md:text-3xl font-bold text-amber-300 tracking-wide">
            Sanctuary of Self-Recognition
          </h1>
          <p className="text-white/60 text-sm max-w-lg mx-auto">
            Not more information. Not more sermons. Not more advice.
            <br />
            A place to be recognized, to be met, and to exhale.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Step 1: Arrival */}
        {step === 1 && !showResult && (
          <StepOneArrival
            form={form}
            updateField={updateField}
            onNext={() => setStep(2)}
          />
        )}

        {/* Step 2: The Mirror Questions */}
        {step === 2 && !showResult && (
          <StepTwoMirror
            form={form}
            updateField={updateField}
            loading={loading}
            error={error}
            onBack={() => setStep(1)}
            onBegin={handleBeginRecognition}
          />
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-pulse">
              <div className="text-4xl mb-4">🕯️</div>
              <p className="text-amber-300/80 text-sm">
                The Cathedral is listening...
              </p>
              <p className="text-white/40 text-xs mt-2">
                Weaving your reflection with care and tenderness
              </p>
            </div>
          </div>
        )}

        {/* Result Display */}
        {showResult && (
          <StepThreeRecognition
            result={result}
            onReset={handleReset}
          />
        )}

        {/* Error State */}
        {error && !loading && !showResult && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl">
            <p className="text-rose-300 text-sm">
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Step 1: Arrival - Who is stepping into the Sanctuary?
 */
function StepOneArrival({ form, updateField, onNext }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-amber-300 flex items-center gap-2">
          <span>🌅</span>
          Movement I: Arrival
        </h2>
        <p className="text-sm text-white/70">
          Share just enough for the Cathedral to recognize how you move through the world.
          Everything here is optional. You can keep this simple.
        </p>
      </div>

      {/* Soul System Context */}
      <div className="grid md:grid-cols-3 gap-4 text-xs">
        <InputField
          label="Enneagram type"
          placeholder="e.g. 2w1, 4w5"
          value={form.enneagramType}
          onChange={v => updateField('enneagramType', v)}
        />
        <InputField
          label="Tritype"
          placeholder="e.g. 927"
          value={form.tritype}
          onChange={v => updateField('tritype', v)}
        />
        <InputField
          label="Center"
          placeholder="Heart, Head, Gut..."
          value={form.center}
          onChange={v => updateField('center', v)}
        />
      </div>

      {/* Astrological Context */}
      <div className="grid md:grid-cols-3 gap-4 text-xs">
        <InputField
          label="Sun sign"
          placeholder="e.g. Sagittarius"
          value={form.sunSign}
          onChange={v => updateField('sunSign', v)}
        />
        <InputField
          label="Moon sign"
          placeholder="e.g. Cancer"
          value={form.moonSign}
          onChange={v => updateField('moonSign', v)}
        />
        <InputField
          label="Rising sign"
          placeholder="e.g. Leo"
          value={form.risingSign}
          onChange={v => updateField('risingSign', v)}
        />
      </div>

      {/* Current State */}
      <div className="grid md:grid-cols-4 gap-4 text-xs">
        <InputField
          label="Age"
          type="number"
          placeholder=""
          value={form.age}
          onChange={v => updateField('age', v ? Number(v) : null)}
          className="md:col-span-1"
        />
        <InputField
          label="Current emotional state"
          placeholder="e.g. tired but hopeful, anxious but curious..."
          value={form.emotionalState}
          onChange={v => updateField('emotionalState', v)}
          className="md:col-span-3"
        />
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={onNext}
          className="px-5 py-2.5 rounded-full bg-amber-400 text-slate-900 text-sm font-semibold hover:bg-amber-300 transition-all transform hover:scale-105"
        >
          Continue into the Sanctuary →
        </button>
      </div>
    </div>
  );
}

/**
 * Step 2: The Mirror - What brings you here?
 */
function StepTwoMirror({ form, updateField, loading, error, onBack, onBegin }) {
  const canSubmit = hasMinimumContent(form);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-amber-300 flex items-center gap-2">
          <span>🪞</span>
          Movement II: The Mirror
        </h2>
        <p className="text-sm text-white/70">
          This is where you "open the hood." Write in fragments if you want.
          The Cathedral is listening for patterns, not perfection.
        </p>
      </div>

      <div className="space-y-4">
        <TextAreaField
          label="What hurts right now?"
          placeholder="Describe the ache, confusion, or weight you're carrying..."
          value={form.whatHurts}
          onChange={v => updateField('whatHurts', v)}
        />

        <TextAreaField
          label="What do you secretly long for?"
          placeholder="Being understood, rest, permission, love that doesn't have to be earned..."
          value={form.whatTheyLongFor}
          onChange={v => updateField('whatTheyLongFor', v)}
        />

        <TextAreaField
          label="What patterns do you notice in yourself?"
          placeholder="e.g. I always caretake others, I shut down when I feel rejected..."
          value={form.patternsTheyNotice}
          onChange={v => updateField('patternsTheyNotice', v)}
        />

        <TextAreaField
          label="Any questions or intentions for this Sanctuary visit?"
          placeholder="What would you love to understand or feel by the end of this?"
          value={form.questionsOrIntentions}
          onChange={v => updateField('questionsOrIntentions', v)}
        />
      </div>

      {!canSubmit && (
        <p className="text-xs text-white/40 text-center">
          Share at least one thing about what hurts, what you long for, or patterns you notice.
        </p>
      )}

      <div className="flex justify-between items-center pt-2">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-full border border-white/20 text-sm text-white/70 hover:bg-white/5 transition-all"
        >
          ← Back
        </button>

        <button
          disabled={loading || !canSubmit}
          onClick={onBegin}
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-sm font-semibold text-slate-900 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all transform hover:scale-105"
        >
          {loading ? 'The Cathedral is listening...' : 'Begin Recognition'}
        </button>
      </div>
    </div>
  );
}

/**
 * Step 3: Recognition Display - The Four Movements + Rituals
 */
function StepThreeRecognition({ result, onReset }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="text-3xl">✨</div>
        <h2 className="text-xl font-semibold text-amber-300">
          You are being recognized.
        </h2>
        <p className="text-xs text-white/50">
          Read slowly. This is not content. This is a mirror.
        </p>

        {/* Short Mantra */}
        {result.shortMantra && (
          <div className="mt-4 p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-xl">
            <p className="text-emerald-300 italic text-sm">
              "{result.shortMantra}"
            </p>
          </div>
        )}
      </div>

      {/* The Four Movements */}
      <div className="space-y-4">
        {result.arrival && (
          <MovementSection
            section={result.arrival}
            icon="🌅"
            tone="indigo"
          />
        )}

        {result.mirror && (
          <MovementSection
            section={result.mirror}
            icon="🪞"
            tone="blue"
          />
        )}

        {result.release && (
          <MovementSection
            section={result.release}
            icon="🕊️"
            tone="rose"
          />
        )}

        {result.integration && (
          <MovementSection
            section={result.integration}
            icon="🌿"
            tone="emerald"
          />
        )}
      </div>

      {/* Rituals */}
      {result.rituals && (
        <RitualsSection rituals={result.rituals} />
      )}

      {/* Reset */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onReset}
          className="px-5 py-2 rounded-full border border-white/20 text-sm text-white/70 hover:bg-white/5 transition-all"
        >
          Return to the entrance
        </button>
      </div>
    </div>
  );
}

/**
 * Movement Section Component
 */
function MovementSection({ section, icon, tone }) {
  const toneStyles = {
    indigo: 'from-indigo-950/50 to-slate-950/60 border-indigo-500/30',
    blue: 'from-blue-950/50 to-slate-950/60 border-blue-500/30',
    rose: 'from-rose-950/40 to-slate-950/60 border-rose-500/30',
    emerald: 'from-emerald-950/40 to-slate-950/60 border-emerald-500/30'
  };

  const titleColors = {
    indigo: 'text-indigo-300',
    blue: 'text-blue-300',
    rose: 'text-rose-300',
    emerald: 'text-emerald-300'
  };

  return (
    <div className={`rounded-2xl bg-gradient-to-br ${toneStyles[tone]} border p-5 space-y-3`}>
      <h3 className={`text-sm font-semibold ${titleColors[tone]} flex items-center gap-2`}>
        <span>{icon}</span>
        {section.title}
      </h3>
      <div className="space-y-2 text-sm text-white/80 leading-relaxed">
        {section.lines?.map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>
    </div>
  );
}

/**
 * Rituals Section
 */
function RitualsSection({ rituals }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-950/30 to-orange-950/20 border border-amber-500/30 p-5 space-y-4">
      <h3 className="text-sm font-semibold text-amber-300 flex items-center gap-2">
        <span>🕯️</span>
        Take-Home Rituals
      </h3>

      <div className="grid md:grid-cols-2 gap-4 text-xs">
        <RitualCard
          label="Release"
          icon="💨"
          body={rituals.release}
        />
        <RitualCard
          label="Reflection"
          icon="📝"
          body={rituals.reflection}
        />
        <RitualCard
          label="Grounding"
          icon="🌍"
          body={rituals.grounding}
        />
        <RitualCard
          label="Integration"
          icon="🌱"
          body={rituals.integration}
        />
      </div>
    </div>
  );
}

/**
 * Ritual Card
 */
function RitualCard({ label, icon, body }) {
  return (
    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
      <p className="text-amber-300 text-xs font-semibold mb-2 flex items-center gap-1">
        <span>{icon}</span>
        {label}
      </p>
      <p className="text-white/70 leading-relaxed">{body}</p>
    </div>
  );
}

/**
 * Input Field Helper
 */
function InputField({ label, type = 'text', placeholder, value, onChange, className = '' }) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-white/50 text-xs">{label}</label>
      <input
        type={type}
        className="w-full rounded-lg bg-slate-900/70 border border-white/10 p-2.5 text-xs text-white placeholder:text-white/30 focus:border-amber-500/50 focus:outline-none transition-colors"
        placeholder={placeholder}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

/**
 * TextArea Field Helper
 */
function TextAreaField({ label, placeholder, value, onChange }) {
  return (
    <div className="space-y-1">
      <label className="block text-white/50 text-xs">{label}</label>
      <textarea
        className="w-full h-24 rounded-lg bg-slate-900/70 border border-white/10 p-3 text-sm text-white placeholder:text-white/30 resize-none focus:border-amber-500/50 focus:outline-none transition-colors"
        placeholder={placeholder}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
