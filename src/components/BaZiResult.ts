// src/components/BaZiResult.tsx
import { calculateBaZi } from "../lib/bazi";

interface Props {
  date: string;
  time: string;
  gender: string;
}

export default function BaZiResult({ date, time, gender }: Props) {
  if (!date || !time) return null;

  const result = calculateBaZi(date, time, gender as "male" | "female");

  return (
    <div className="max-w-6xl mx-auto mt-12 space-y-12">
      {/* Four Pillars */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Hour 時柱", value: result.hourPillar },
          { label: "Day 日柱 (You)", value: result.dayPillar, highlight: true },
          { label: "Month 月柱", value: result.monthPillar },
          { label: "Year 年柱", value: result.yearPillar },
        ].map((p) => (
          <div
            key={p.label}
            className={`bg-white/20 backdrop-blur-lg rounded-3xl p-8 text-center transition-all ${
              p.highlight ? "ring-4 ring-yellow-400 scale-110 shadow-2xl" : ""
            }`}
          >
            <div className="text-lg opacity-80">{p.label}</div>
            <div className="text-6xl font-bold mt-4">{p.value}</div>
          </div>
        ))}
      </div>

      {/* Day Master */}
      <div className="text-center bg-black/40 rounded-3xl py-12 px-8">
        <h2 className="text-5xl font-bold mb-4">Your Day Master</h2>
        <p className="text-9xl font-bold text-yellow-300">{result.dayMaster} {result.dayMasterElement}</p>
        <p className="text-3xl mt-6">Born in {result.animal} Year</p>
      </div>

      {/* 10 Gods */}
      <div className="bg-white/10 rounded-3xl p-8">
        <h3 className="text-3xl font-bold text-center mb-6">Ten Gods 十神</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {Object.entries(result.tenGods).map(([key, value]) => (
            <div key={key} className="text-center bg-black/30 rounded-2xl py-6">
              <div className="text-4xl font-bold">{value.split(" ")[0]}</div>
              <div className="text-lg opacity-80 capitalize">{key}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Luck Pillars */}
      <div className="bg-gradient-to-r from-purple-800 to-blue-800 rounded-3xl p-8">
        <h3 className="text-4xl font-bold text-center mb-8">Luck Pillars 大運 (10-Year Cycles)</h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {result.luckPillars.map((pillar, i) => (
            <div key={i} className="bg-white/20 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold">{pillar}</div>
              <div className="text-sm mt-2 opacity-80">{(i + 1) * 10}–{(i + 2) * 10}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}