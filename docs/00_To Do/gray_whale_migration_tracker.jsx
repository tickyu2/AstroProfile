import { useState } from "react";
import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Area, Bar
} from "recharts";

// ─── MIGRATION DATA ──────────────────────────────────────────────────────────

const migrationPoints = [
  { id: 0,  name: "Bering/Chukchi Sea", lat: 65, miles: 0,    pct: 0,   month: "Oct 1",  branch: "戌 Dog",  branchKey: "dog",    dir: "south", motherKg: 36000, fetusKg: 50,   baziNote: "Last feeding. Calf weaned. Departure into darkness.", emoji: "🌊", phase: "departure" },
  { id: 1,  name: "Unimak Pass, Aleutians", lat: 55, miles: 500,  pct: 8,   month: "Oct 20", branch: "戌 Dog",  branchKey: "dog",    dir: "south", motherKg: 34800, fetusKg: 70,   baziNote: "Metal/Earth boundary. Enters the Pacific. No turning back.", emoji: "🌀", phase: "departure" },
  { id: 2,  name: "Southeast Alaska / Sitka", lat: 57, miles: 900,  pct: 15,  month: "Nov 1",  branch: "亥 Pig",  branchKey: "pig",    dir: "south", motherKg: 33500, fetusKg: 100,  baziNote: "Pig = Water begins. Night and day swimming. Pure momentum.", emoji: "🌑", phase: "migration" },
  { id: 3,  name: "British Columbia / Vancouver", lat: 49, miles: 1350, pct: 22,  month: "Nov 10", branch: "亥 Pig",  branchKey: "pig",    dir: "south", motherKg: 32500, fetusKg: 140,  baziNote: "Familiar coastline. Fasting. Fetus growing invisibly.", emoji: "🍃", phase: "migration" },
  { id: 4,  name: "Olympic Peninsula, Washington", lat: 48, miles: 1700, pct: 27,  month: "Nov 18", branch: "亥 Pig",  branchKey: "pig",    dir: "south", motherKg: 31500, fetusKg: 180,  baziNote: "Storm coast. She rides swells. Water energy deepening.", emoji: "⛈️", phase: "migration" },
  { id: 5,  name: "Oregon Coast / Depoe Bay", lat: 45, miles: 2100, pct: 34,  month: "Nov 26", branch: "子 Rat",  branchKey: "rat",    dir: "south", motherKg: 30500, fetusKg: 250,  baziNote: "Pure Water. Rat = life in total darkness, maximum potential.", emoji: "🌊", phase: "migration" },
  { id: 6,  name: "Cape Mendocino, N. California", lat: 40, miles: 2450, pct: 40,  month: "Dec 3",  branch: "子 Rat",  branchKey: "rat",    dir: "south", motherKg: 29500, fetusKg: 350,  baziNote: "40% complete. Pregnant and tireless. Water at peak.", emoji: "🎯", phase: "milestone" },
  { id: 7,  name: "Monterey Bay", lat: 37, miles: 2700, pct: 44,  month: "Dec 8",  branch: "子 Rat",  branchKey: "rat",    dir: "south", motherKg: 29000, fetusKg: 450,  baziNote: "First large viewing aggregations. Humans witness the passing.", emoji: "👁️", phase: "migration" },
  { id: 8,  name: "Point Conception ★ HALFWAY", lat: 34.5, miles: 3100, pct: 50,  month: "Dec 15", branch: "子 Rat",  branchKey: "rat",    dir: "south", motherKg: 28000, fetusKg: 600,  baziNote: "HALFWAY. Pacific bends. She turns southeast. Fetus now 600kg.", emoji: "⭐", phase: "milestone" },
  { id: 9,  name: "Channel Islands / Ventura", lat: 34, miles: 3350, pct: 54,  month: "Dec 20", branch: "丑 Ox",   branchKey: "ox",     dir: "south", motherKg: 27500, fetusKg: 750,  baziNote: "Ox energy begins. Water transitioning into Earth. Birth nearing.", emoji: "🌱", phase: "transition" },
  { id: 10, name: "San Diego / Point Loma", lat: 32.7, miles: 3600, pct: 58, month: "Dec 26", branch: "丑 Ox",   branchKey: "ox",     dir: "south", motherKg: 27000, fetusKg: 900,  baziNote: "Crossing into Mexico. She can sense the lagoon. Almost home.", emoji: "🇲🇽", phase: "transition" },
  { id: 11, name: "Ensenada, Baja Norte", lat: 31.9, miles: 3900, pct: 63, month: "Jan 2",  branch: "丑 Ox",   branchKey: "ox",     dir: "south", motherKg: 26500, fetusKg: 1050, baziNote: "Baja waters. Ancient territory. Pregnant females accelerating.", emoji: "🏝️", phase: "approach" },
  { id: 12, name: "Punta Eugenia / Biosphere Reserve", lat: 28, miles: 4400, pct: 71, month: "Jan 10", branch: "丑 Ox", branchKey: "ox",     dir: "south", motherKg: 26000, fetusKg: 1150, baziNote: "UNESCO territory. Biosphere boundary. Sacred ground.", emoji: "🌿", phase: "approach" },
  { id: 13, name: "Laguna Ojo de Liebre ★ BIRTH", lat: 27.8, miles: 4600, pct: 74, month: "Jan 15", branch: "丑 Ox", branchKey: "ox",     dir: "south", motherKg: 25500, fetusKg: 1200, baziNote: "70% of mothers birth here. FROZEN TREASURY OPENS.", emoji: "🐋", phase: "birth" },
  { id: 14, name: "Laguna San Ignacio ★ FRIENDLY", lat: 26.8, miles: 4850, pct: 78, month: "Jan 20", branch: "丑 Ox", branchKey: "ox",     dir: "south", motherKg: 25000, fetusKg: 1200, baziNote: "The Friendly Whale lagoon. Pachico Mayoral's lagoon. Contact.", emoji: "🤝", phase: "birth" },
  { id: 15, name: "Bahía Magdalena Complex", lat: 24.6, miles: 5200, pct: 84, month: "Jan 25", branch: "丑 Ox", branchKey: "ox",     dir: "south", motherKg: 25000, fetusKg: 1200, baziNote: "Southern calving complex. All lagoons active simultaneously.", emoji: "🌊", phase: "birth" },
  { id: 16, name: "Cabo San Lucas (tip of Baja)", lat: 22.9, miles: 5600, pct: 90, month: "Feb 1",  branch: "寅 Tiger", branchKey: "tiger", dir: "south", motherKg: 24500, fetusKg: 1200, baziNote: "Ox→Tiger. Earth to Wood. Late births. Spring energy breaking.", emoji: "🌅", phase: "lateArrival" },
  { id: 17, name: "COMPLETE — All Lagoons Active", lat: 24, miles: 6200, pct: 100, month: "Feb 15", branch: "寅 Tiger", branchKey: "tiger", dir: "south", motherKg: 24000, fetusKg: 1200, baziNote: "PEAK CALVING. The Frozen Treasury fully open. New life everywhere.", emoji: "✨", phase: "complete" },
];

const PHASE_STYLES = {
  departure: { color: "#fd79a8", label: "Departure" },
  migration: { color: "#74b9ff", label: "Migration" },
  milestone: { color: "#ffd32a", label: "Milestone" },
  transition: { color: "#a29bfe", label: "Transition" },
  approach:  { color: "#55efc4", label: "Approach" },
  birth:     { color: "#ff9f43", label: "Birth Zone" },
  lateArrival: { color: "#b2bec3", label: "Late Arrival" },
  complete:  { color: "#1dd1a1", label: "Complete" },
};

const BRANCH_COLORS = {
  dog:   "#fd79a8",
  pig:   "#74b9ff",
  rat:   "#0984e3",
  ox:    "#a29bfe",
  tiger: "#55efc4",
};

const BRANCH_DATA = {
  dog:   { name: "戌 Dog",   elem: "Earth+Metal+Fire",  color: "#fd79a8", season: "Autumn Transition" },
  pig:   { name: "亥 Pig",   elem: "Yang Water",         color: "#74b9ff", season: "Winter Begins" },
  rat:   { name: "子 Rat",   elem: "Pure Water",         color: "#0984e3", season: "Core Winter" },
  ox:    { name: "丑 Ox",    elem: "Earth 60% Water 30% Metal 10%", color: "#a29bfe", season: "Winter Transition" },
  tiger: { name: "寅 Tiger", elem: "Yang Wood 100%",     color: "#55efc4", season: "Spring Begins" },
};

const chartData = migrationPoints.map(p => ({
  name: p.name.split(" / ")[0].split(",")[0].slice(0, 18),
  miles: p.miles,
  pct: p.pct,
  motherKg: p.motherKg,
  fetusKg: p.fetusKg,
}));

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const pt = migrationPoints.find(p => p.name.startsWith(label) || label.startsWith(p.name.split(" / ")[0].slice(0, 10)));
  return (
    <div style={{ background: "#0d1b3e", border: `2px solid ${pt ? PHASE_STYLES[pt.phase]?.color : "#444"}`, borderRadius: 12, padding: "12px 16px", maxWidth: 260, fontSize: 12 }}>
      {pt && <>
        <div style={{ color: PHASE_STYLES[pt.phase]?.color, fontWeight: 800, fontSize: 14 }}>{pt.emoji} {pt.name}</div>
        <div style={{ color: "#888", marginBottom: 6 }}>{pt.month} · {pt.miles.toLocaleString()} mi · {pt.pct}%</div>
        <div style={{ color: BRANCH_COLORS[pt.branchKey], marginBottom: 6, fontWeight: 600 }}>{pt.branch} — {BRANCH_DATA[pt.branchKey]?.elem}</div>
        <div style={{ color: "#ccc", fontStyle: "italic", lineHeight: 1.5 }}>{pt.baziNote}</div>
        <div style={{ borderTop: "1px solid #333", marginTop: 8, paddingTop: 6 }}>
          <div style={{ color: "#74b9ff" }}>Mother: {pt.motherKg.toLocaleString()} kg ({(pt.motherKg/1000).toFixed(1)}t)</div>
          <div style={{ color: "#ff9f43" }}>Fetus: {pt.fetusKg.toLocaleString()} kg</div>
        </div>
      </>}
    </div>
  );
};

export default function GrayWhaleMigrationTracker() {
  const [selected, setSelected] = useState(13);
  const [view, setView] = useState("map");
  const pt = migrationPoints[selected];
  const branch = BRANCH_DATA[pt.branchKey];

  return (
    <div style={{
      background: "linear-gradient(160deg, #060b1a 0%, #0a1628 50%, #060e1a 100%)",
      minHeight: "100vh", padding: "24px 16px 48px",
      fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#fff"
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 40, marginBottom: 4 }}>🐋</div>
        <h1 style={{
          fontSize: 22, fontWeight: 900, margin: 0,
          background: "linear-gradient(90deg, #74b9ff, #a29bfe, #ff9f43)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}>Gray Whale Migration Tracker</h1>
        <p style={{ color: "#888", fontSize: 13, margin: "6px 0 0" }}>
          12,500 miles · 21 waypoints · BaZi seasonal alignment · Month by month
        </p>
        <p style={{ color: "#555", fontSize: 11 }}>Eastern Pacific Population · Bering Sea → Baja California · Oct–Feb</p>
      </div>

      {/* View tabs */}
      <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 20 }}>
        {[["map","🗺️ Journey Map"],["chart","📊 Weight Chart"],["bazi","☯️ BaZi Branches"],["matrix","📋 Matrix"]].map(([v, l]) => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: "7px 16px", borderRadius: 18, border: "none", cursor: "pointer",
            fontWeight: 600, fontSize: 12,
            background: view === v ? "linear-gradient(90deg,#74b9ff,#a29bfe)" : "rgba(255,255,255,0.07)",
            color: view === v ? "#000" : "#888"
          }}>{l}</button>
        ))}
      </div>

      {/* ── MAP VIEW ── */}
      {view === "map" && (
        <div>
          {/* Progress bar */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#666", fontSize: 11, marginBottom: 4 }}>
              <span>🌊 Bering Sea (Start)</span>
              <span style={{ color: BRANCH_COLORS[pt.branchKey] }}>{pt.pct}% complete — {pt.miles.toLocaleString()} miles</span>
              <span>🏝️ Baja (End)</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 8, height: 12, overflow: "hidden" }}>
              <div style={{
                width: `${pt.pct}%`, height: "100%",
                background: `linear-gradient(90deg, ${BRANCH_COLORS.pig}, ${BRANCH_COLORS[pt.branchKey]})`,
                borderRadius: 8, transition: "width 0.4s"
              }} />
            </div>
          </div>

          {/* Selected point detail */}
          <div style={{
            background: `${PHASE_STYLES[pt.phase]?.color}15`,
            border: `2px solid ${PHASE_STYLES[pt.phase]?.color}50`,
            borderRadius: 18, padding: "18px 22px", marginBottom: 16
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontSize: 28, marginBottom: 4 }}>{pt.emoji}</div>
                <div style={{ color: PHASE_STYLES[pt.phase]?.color, fontWeight: 900, fontSize: 18 }}>{pt.name}</div>
                <div style={{ color: "#888", fontSize: 12, marginTop: 2 }}>{pt.month} · {pt.miles.toLocaleString()} miles from start</div>
                <div style={{ color: BRANCH_COLORS[pt.branchKey], fontWeight: 700, fontSize: 14, marginTop: 6 }}>
                  {branch.name} — {branch.season}
                </div>
                <div style={{ color: "#888", fontSize: 12 }}>{branch.elem}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#74b9ff", fontSize: 24, fontWeight: 800 }}>{pt.pct}%</div>
                <div style={{ color: "#555", fontSize: 11 }}>journey complete</div>
                <div style={{ color: "#74b9ff", fontSize: 13, marginTop: 4 }}>{pt.motherKg.toLocaleString()} kg</div>
                <div style={{ color: "#555", fontSize: 11 }}>mother weight</div>
                <div style={{ color: "#ff9f43", fontSize: 13, marginTop: 2 }}>{pt.fetusKg.toLocaleString()} kg</div>
                <div style={{ color: "#555", fontSize: 11 }}>fetus weight</div>
              </div>
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 14, paddingTop: 12, color: "#ccc", fontSize: 13, fontStyle: "italic", lineHeight: 1.6 }}>
              {pt.baziNote}
            </div>
          </div>

          {/* Waypoint selector */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
            {migrationPoints.map((p, i) => (
              <button key={i} onClick={() => setSelected(i)} style={{
                padding: "6px 10px", borderRadius: 10, border: `1px solid ${selected === i ? PHASE_STYLES[p.phase]?.color : "transparent"}`,
                background: selected === i ? `${PHASE_STYLES[p.phase]?.color}25` : "rgba(255,255,255,0.05)",
                color: selected === i ? PHASE_STYLES[p.phase]?.color : "#666",
                fontSize: 10, cursor: "pointer", fontWeight: selected === i ? 700 : 400
              }}>
                {p.emoji} {p.miles === 0 ? "Start" : `${(p.pct)}%`}
              </button>
            ))}
          </div>

          {/* Phase legend */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginTop: 16 }}>
            {Object.entries(PHASE_STYLES).map(([k, v]) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: v.color }} />
                <span style={{ color: "#777" }}>{v.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CHART VIEW ── */}
      {view === "chart" && (
        <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 18, padding: "20px 8px" }}>
          <p style={{ textAlign: "center", color: "#888", fontSize: 12, margin: "0 0 12px" }}>
            🔵 Mother body weight (tonnes) · 🟠 Fetus weight (kg, right axis)
          </p>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={chartData} margin={{ top: 8, right: 50, left: 8, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: "#666", fontSize: 9 }} angle={-45} textAnchor="end" height={70} />
              <YAxis yAxisId="mom" orientation="left" tickFormatter={v => `${(v/1000).toFixed(0)}t`} tick={{ fill: "#74b9ff", fontSize: 11 }} domain={[22000, 38000]} />
              <YAxis yAxisId="fetus" orientation="right" tickFormatter={v => `${v}kg`} tick={{ fill: "#ff9f43", fontSize: 11 }} domain={[0, 1400]} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine yAxisId="mom" y={25000} stroke="#e17055" strokeDasharray="5 3"
                label={{ value: "Minimum (birth weight)", fill: "#e17055", fontSize: 9, position: "insideTopRight" }} />
              <Area yAxisId="mom" type="monotone" dataKey="motherKg"
                fill="rgba(116,185,255,0.08)" stroke="#74b9ff" strokeWidth={2.5}
                dot={{ fill: "#74b9ff", r: 4, stroke: "#060b1a", strokeWidth: 1.5 }} name="Mother (kg)" />
              <Line yAxisId="fetus" type="monotone" dataKey="fetusKg"
                stroke="#ff9f43" strokeWidth={2.5} strokeDasharray="7 3"
                dot={{ fill: "#ff9f43", r: 4, stroke: "#060b1a", strokeWidth: 1.5 }} name="Fetus (kg)" />
            </ComposedChart>
          </ResponsiveContainer>
          <p style={{ textAlign: "center", color: "#555", fontSize: 11, marginTop: 8 }}>
            A 30-tonne female may lose 10–13 tonnes total during migration + lactation · Fetus grows exponentially in final trimester
          </p>
        </div>
      )}

      {/* ── BAZI VIEW ── */}
      {view === "bazi" && (
        <div>
          {Object.entries(BRANCH_DATA).map(([key, b]) => {
            const pts = migrationPoints.filter(p => p.branchKey === key);
            return (
              <div key={key} style={{
                background: `${b.color}10`, border: `1px solid ${b.color}30`,
                borderRadius: 16, padding: "18px 20px", marginBottom: 14
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ color: b.color, fontWeight: 900, fontSize: 20 }}>{b.name}</div>
                    <div style={{ color: "#aaa", fontSize: 13, marginTop: 2 }}>{b.season}</div>
                    <div style={{ color: "#666", fontSize: 12 }}>{b.elem}</div>
                  </div>
                  <div style={{ color: b.color, fontSize: 13, fontWeight: 600, textAlign: "right" }}>
                    {pts.length} waypoint{pts.length !== 1 ? "s" : ""}
                  </div>
                </div>
                <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                  {pts.map(p => (
                    <div key={p.id} onClick={() => { setSelected(p.id); setView("map"); }}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "8px 12px",
                        cursor: "pointer"
                      }}>
                      <span style={{ fontSize: 20 }}>{p.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: "#ccc", fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                        <div style={{ color: "#555", fontSize: 11 }}>{p.month} · {p.miles.toLocaleString()} mi · {p.pct}%</div>
                        <div style={{ color: "#888", fontSize: 11, fontStyle: "italic", marginTop: 2 }}>{p.baziNote}</div>
                      </div>
                      <div style={{ color: b.color, fontSize: 12, fontWeight: 700 }}>{p.pct}%</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MATRIX VIEW ── */}
      {view === "matrix" && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 700 }}>
            <thead>
              <tr style={{ background: "rgba(116,185,255,0.1)" }}>
                {["","Waypoint","Month","Miles","% Done","BaZi","Mother Wt","Fetus Wt","Note"].map(h => (
                  <th key={h} style={{ padding: "10px 8px", textAlign: "left", color: "#74b9ff", fontWeight: 700, fontSize: 11, borderBottom: "2px solid rgba(116,185,255,0.2)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {migrationPoints.map((p, i) => {
                const pc = PHASE_STYLES[p.phase]?.color;
                const bc = BRANCH_COLORS[p.branchKey];
                return (
                  <tr key={i}
                    onClick={() => { setSelected(i); setView("map"); }}
                    style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent", cursor: "pointer" }}>
                    <td style={{ padding: "8px 8px", fontSize: 18 }}>{p.emoji}</td>
                    <td style={{ padding: "8px 8px", color: pc, fontWeight: 600, fontSize: 12 }}>{p.name}</td>
                    <td style={{ padding: "8px 8px", color: "#888", fontSize: 11 }}>{p.month}</td>
                    <td style={{ padding: "8px 8px", color: "#74b9ff", fontWeight: 600 }}>{p.miles.toLocaleString()}</td>
                    <td style={{ padding: "8px 8px" }}>
                      <span style={{ color: pc, fontWeight: 700 }}>{p.pct}%</span>
                    </td>
                    <td style={{ padding: "8px 8px" }}>
                      <span style={{ color: bc, background: `${bc}20`, padding: "2px 7px", borderRadius: 8, fontSize: 11 }}>{p.branch}</span>
                    </td>
                    <td style={{ padding: "8px 8px", color: "#74b9ff", fontWeight: 600 }}>{(p.motherKg/1000).toFixed(1)}t</td>
                    <td style={{ padding: "8px 8px", color: "#ff9f43", fontWeight: 600 }}>{p.fetusKg.toLocaleString()} kg</td>
                    <td style={{ padding: "8px 8px", color: "#666", fontSize: 11 }}>{p.baziNote.slice(0, 50)}…</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p style={{ textAlign: "center", color: "#333", fontSize: 11, marginTop: 28 }}>
        Eastern Pacific Gray Whale (*Eschrichtius robustus*) · NOAA · ACS · Jones & Swartz 1984 · GENESIS Project 2026
      </p>
    </div>
  );
}
