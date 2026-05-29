import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { qiPipelineSteps } from "../data/qiAdjustmentFlow";

// ============================================================================
// Story helpers — standalone components that don't depend on page-level state
// ============================================================================

const ELEM_COLORS: Record<string, string> = {
  Wood: "#22c55e", Fire: "#ef4444", Earth: "#f59e0b", Metal: "#a1a1aa", Water: "#3b82f6",
};

const ELEMENTS = ["Wood", "Fire", "Earth", "Metal", "Water"];

/** Lightweight Qi bar — element-colored segments */
function QiBar({ qi }: { qi: Record<string, number> }) {
  const total = ELEMENTS.reduce((s, el) => s + (qi[el] || 0), 0);
  if (total <= 0) return null;
  return (
    <div className="flex h-5 rounded overflow-hidden border border-white/10">
      {ELEMENTS.map(el => {
        const pct = ((qi[el] || 0) / total) * 100;
        if (pct < 0.5) return null;
        return (
          <div
            key={el}
            style={{ width: `${pct}%`, background: ELEM_COLORS[el] }}
            className="flex items-center justify-center text-[9px] font-bold text-black/60"
          >
            {pct > 8 ? `${el[0]}` : ""}
          </div>
        );
      })}
    </div>
  );
}

/** Pipeline step card */
function PipelineStepCard({ step }: { step: typeof qiPipelineSteps[0] }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white/10 bg-white/5">
      <span className="text-xl">{step.icon}</span>
      <div className="flex-1">
        <div className="text-sm font-semibold" style={{ color: step.color }}>{step.label}</div>
        <div className="text-xs text-gray-400">{step.description}</div>
      </div>
    </div>
  );
}

/** Full pipeline visualization */
function PipelineVisualization() {
  return (
    <div className="space-y-2 max-w-md mx-auto p-6 bg-slate-950 rounded-xl">
      <h2 className="text-lg font-bold text-white mb-4">Qi Adjustment Pipeline</h2>
      {qiPipelineSteps.map((step, i) => (
        <React.Fragment key={step.id}>
          <PipelineStepCard step={step} />
          {i < qiPipelineSteps.length - 1 && (
            <div className="flex justify-center">
              <span className="text-gray-600 text-lg">↓</span>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/** Educational level toggle */
function EducationToggle() {
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");

  const content: Record<string, { title: string; body: string }> = {
    beginner: {
      title: "Beginner — Garden Metaphor",
      body: "Think of your Qi like a garden. Clashes are storms knocking over plants. Sheng is sunshine helping flowers bloom. Damping is natural wear. Transformation is a rare, dramatic shift — like ice melting into water.",
    },
    intermediate: {
      title: "Intermediate — Pipeline Mechanics",
      body: "Each month, your blended NTFQ (60% natal + 40% transit) passes through: Clashes (attacker suppresses victim, -10%/-2%), Sheng (parent feeds child, +3% capped at 20%), Damping (all ×0.98), and Transformation (>3:1 ratio → 30% transmute to child element).",
    },
    advanced: {
      title: "Advanced — Classical BaZi Theory",
      body: "Three-pass clash system (本命內克, 運歲內克, 運克命) separates natal internal tensions, transit internal turbulence, and directional transit→natal pressure. Sheng operates post-克 on the settled landscape. Transformation fires only after 克→生→耗 if extreme imbalance persists. Products follow victim's productive cycle child (金生水, 木生火, etc.).",
    },
  };

  const levels = [
    { key: "beginner" as const,     label: "Beginner",     bg: "bg-green-600" },
    { key: "intermediate" as const, label: "Intermediate", bg: "bg-blue-600" },
    { key: "advanced" as const,     label: "Advanced",     bg: "bg-purple-600" },
  ];

  return (
    <div className="max-w-lg mx-auto p-6 bg-slate-950 rounded-xl space-y-4">
      <h2 className="text-lg font-bold text-white">Educational Mode</h2>
      <div className="flex gap-2">
        {levels.map(l => (
          <button
            key={l.key}
            onClick={() => setLevel(l.key)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              level === l.key ? `${l.bg} text-white` : "bg-slate-700 text-gray-400 hover:bg-slate-600"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>
      <div className="rounded-lg bg-slate-900/60 border border-slate-700 p-4">
        <h3 className="text-sm font-semibold text-gray-200 mb-2">{content[level].title}</h3>
        <p className="text-xs text-gray-400 leading-relaxed">{content[level].body}</p>
      </div>
    </div>
  );
}

/** Sample Qi data for stories */
const sampleQi = { Wood: 2.5, Fire: 1.8, Earth: 3.2, Metal: 1.0, Water: 2.1 };

// ============================================================================
// Storybook Meta
// ============================================================================

const meta: Meta = {
  title: "Qi Bracelet/Adjustment Pipeline",
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
    docs: {
      description: {
        component: "Qi Adjustment Pipeline — educational components showing how monthly Qi is refined through clash, sheng, damping, and transformation.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

// ============================================================================
// Stories
// ============================================================================

export const Pipeline: StoryObj = {
  name: "Full Pipeline",
  render: () => <PipelineVisualization />,
};

export const Education: StoryObj = {
  name: "Education Toggle",
  render: () => <EducationToggle />,
};

export const SingleStep: StoryObj = {
  name: "Single Pipeline Step",
  render: () => (
    <div className="p-6 bg-slate-950 rounded-xl max-w-md">
      <PipelineStepCard step={qiPipelineSteps[2]} />
    </div>
  ),
};

export const ElementBar: StoryObj = {
  name: "Qi Bar",
  render: () => (
    <div className="p-6 bg-slate-950 rounded-xl max-w-md space-y-3">
      <div className="text-sm text-gray-300 font-semibold">Sample Qi Distribution</div>
      <QiBar qi={sampleQi} />
      <div className="text-[10px] font-mono text-gray-500">
        {ELEMENTS.map(el => `${el}: ${sampleQi[el]}`).join(" | ")}
      </div>
    </div>
  ),
};
