/**
 * TuningLabPanel.jsx
 *
 * Birth Time Tuning Lab panel for the Natal Wheel LAB page.
 * Calls the Python backend to sweep a range of birth times,
 * score each minute across 9 astrological dimensions, and
 * display results as a sparkline + candidate chips.
 *
 * Supports three sweep presets: Discovery, Narrowing, Precision.
 */

import { useState, useMemo, useCallback } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceArea, ReferenceLine
} from 'recharts'
import { runBirthTimeTuningLab } from '../../services/pythonFunctionsService'


// ─── Sweep Presets ──────────────────────────────────────────────────────────
const SWEEP_PRESETS = {
  discovery: {
    label: 'Discovery',
    desc: '24h @ 15 min',
    sweepMinutes: 720,
    stepSeconds: 900,
  },
  narrowing: {
    label: 'Narrowing',
    desc: '±1h @ 5 min',
    sweepMinutes: 60,
    stepSeconds: 300,
  },
  precision: {
    label: 'Precision',
    desc: '±30m @ 1 min',
    sweepMinutes: 30,
    stepSeconds: 60,
  },
}

// ─── Reason Code Labels ─────────────────────────────────────────────────────
const REASON_STYLE = {
  ASC_STABLE:         { label: 'ASC Stable',       cls: 'text-green-400 border-green-500/30 bg-green-500/10' },
  CHART_RULER_STRONG: { label: 'Ruler Strong',     cls: 'text-purple-300 border-purple-500/30 bg-purple-500/10' },
  PATTERN_COHERENT:   { label: 'Coherent',         cls: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10' },
  LUMINARY_STRONG:    { label: 'Luminaries Strong', cls: 'text-amber-300 border-amber-500/30 bg-amber-500/10' },
  LUMINARY_STRESSED:  { label: 'Luminaries Stressed', cls: 'text-red-400 border-red-500/30 bg-red-500/10' },
  ANGLE_SUPPORT_HIGH: { label: 'Angle Support',    cls: 'text-blue-300 border-blue-500/30 bg-blue-500/10' },
  HOUSE_FLIP_RISK:    { label: 'House Flip Risk',  cls: 'text-orange-400 border-orange-500/30 bg-orange-500/10' },
  VOLATILE_ZONE:      { label: 'Volatile Zone',    cls: 'text-red-400 border-red-500/30 bg-red-500/10' },
  EVENT_FIT_HIGH:     { label: 'Event Fit',        cls: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10' },
}

// ─── Dimension labels for heatmap ────────────────────────────────────────────
const DIMENSION_LABELS = {
  identityStability:        'Identity',
  chartCoherence:           'Coherence',
  planetConditionComposite: 'Planets',
  luminaryQuality:          'Luminaries',
  angularDynamics:          'Angular',
  aspectArchitecture:       'Aspects',
  lifeAreaEmphasis:         'Life Areas',
  eventBacktesting:         'Events',
  interpretationRobustness: 'Robustness',
}

// Score → hsl color (red 0 → amber 60 → green 120)
function scoreColor(score) {
  const h = Math.round((Math.max(0, Math.min(100, score)) / 100) * 120)
  return `hsl(${h}, 60%, 28%)`
}


// ─── Custom Tooltip ──────────────────────────────────────────────────────────
function SparklineTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-slate-900/95 border border-white/10 rounded-lg px-3 py-2 text-[10px] shadow-xl">
      <div className="font-mono font-bold text-amber-300 text-sm">{d.timeLabel}</div>
      <div className="text-white/70 mt-1">
        Score: <span className="text-white font-bold">{d.totalScore.toFixed(1)}</span>
      </div>
      <div className="text-white/50">
        Confidence: {d.confidence.toFixed(1)} · Stability: {d.stability.toFixed(1)}
      </div>
      <div className="text-white/40 mt-0.5">
        ASC {d.ascSign} {d.ascDegree.toFixed(0)}° · MC {d.mcSign}
      </div>
    </div>
  )
}


// ─── Main Component ──────────────────────────────────────────────────────────
export default function TuningLabPanel({
  birthData,
  timezone,
  currentLabMinutes,
  onSnapTime,
  labCalculating,
}) {
  // Internal state
  const [tuningResult, setTuningResult] = useState(null)
  const [tuningLoading, setTuningLoading] = useState(false)
  const [tuningError, setTuningError] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const [activePass, setActivePass] = useState(null)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [showDimensions, setShowDimensions] = useState(false)

  // ── Run a sweep ─────────────────────────────────────────────────────────
  const handleRunSweep = useCallback(async (passKey, overrideCenterTime) => {
    if (!birthData?.birthDate || birthData.latitude == null) return
    const preset = SWEEP_PRESETS[passKey]
    const centerTime = overrideCenterTime || birthData.birthTime || '12:00'

    setTuningLoading(true)
    setTuningError(null)
    setActivePass(passKey)

    try {
      const response = await runBirthTimeTuningLab({
        birthDate: birthData.birthDate,
        birthTime: centerTime,
        latitude: birthData.latitude,
        longitude: birthData.longitude,
        timezone: timezone || 'UTC',
        sweepMinutes: preset.sweepMinutes,
        stepSeconds: preset.stepSeconds,
        profile: 'defaultBalanced',
      })

      if (response.success) {
        setTuningResult(response.result)
        setExpanded(true)
        setSelectedCandidate(null)
      } else {
        setTuningError(response.error || 'Unknown error')
      }
    } catch (err) {
      setTuningError(err.message)
    } finally {
      setTuningLoading(false)
    }
  }, [birthData, timezone])

  // ── Click a candidate → snap the wheel ──────────────────────────────────
  const handleCandidateClick = useCallback((candidate) => {
    const [h, m] = candidate.timeLabel.split(':').map(Number)
    setSelectedCandidate(candidate)
    onSnapTime(h * 60 + m)
  }, [onSnapTime])

  // ── Sparkline data ──────────────────────────────────────────────────────
  const sparklineData = useMemo(() => {
    if (!tuningResult?.minuteScores) return []
    return tuningResult.minuteScores.map(ms => ({
      timeLabel: ms.timeLabel,
      offset: ms.offsetMinutes,
      totalScore: ms.totalScore,
      confidence: ms.confidenceScore,
      stability: ms.stabilityScore,
      ascSign: ms.ascSign,
      ascDegree: ms.ascDegree,
      mcSign: ms.mcSign,
    }))
  }, [tuningResult])

  // ── Stable window X labels for ReferenceArea ────────────────────────────
  const stableWindowLabels = useMemo(() => {
    if (!tuningResult?.bestStableWindow || !tuningResult?.minuteScores) return null
    const sw = tuningResult.bestStableWindow
    const scores = tuningResult.minuteScores
    const baseOffset = scores[0]?.offsetMinutes ?? 0
    const startIdx = sw.startOffset - baseOffset
    const endIdx = sw.endOffset - baseOffset
    return {
      x1: scores[startIdx]?.timeLabel,
      x2: scores[endIdx]?.timeLabel,
    }
  }, [tuningResult])

  // ── X-axis tick interval ────────────────────────────────────────────────
  const xInterval = useMemo(() => {
    const len = sparklineData.length
    if (len <= 15) return 0
    if (len <= 30) return 2
    if (len <= 65) return 4
    return Math.floor(len / 12)
  }, [sparklineData])

  // ── Sensitivity cliff time labels ───────────────────────────────────────
  const cliffLabels = useMemo(() => {
    if (!tuningResult?.sensitivityCliffs || !tuningResult?.minuteScores) return []
    const scores = tuningResult.minuteScores
    const baseOffset = scores[0]?.offsetMinutes ?? 0
    return tuningResult.sensitivityCliffs.map(c => {
      const idx = c.minuteOffset - baseOffset
      return { ...c, timeLabel: scores[idx]?.timeLabel }
    }).filter(c => c.timeLabel)
  }, [tuningResult])

  // ── Active candidate (selected or bestMinute) ──────────────────────────
  const displayCandidate = selectedCandidate || tuningResult?.bestMinute

  // ── Sparkline click handler ─────────────────────────────────────────────
  const handleChartClick = useCallback((e) => {
    if (!e?.activePayload?.length) return
    const d = e.activePayload[0].payload
    handleCandidateClick({ timeLabel: d.timeLabel, ascSign: d.ascSign, ascDegree: d.ascDegree })
  }, [handleCandidateClick])


  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="mt-4 mb-2">
      {/* ── Header (always visible) ─────────────────────────────────────── */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full bg-slate-800/50 rounded-xl border border-purple-500/20 p-3 flex items-center justify-between hover:border-purple-500/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-white/90 text-xs">{expanded ? '\u25BE' : '\u25B8'}</span>
          <span className="text-[10px] text-white/90 uppercase tracking-widest font-medium">
            Birth Time Tuning Lab
          </span>
        </div>
        <div className="flex items-center gap-2">
          {tuningLoading && (
            <span className="text-purple-400 text-[10px] animate-pulse">Sweeping...</span>
          )}
          {tuningResult && !tuningLoading && (
            <span className="px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded-full text-[9px] text-green-400">
              {tuningResult.totalMinutesEvaluated} pts &middot; {(tuningResult.computationTimeMs / 1000).toFixed(1)}s
            </span>
          )}
        </div>
      </button>

      {/* ── Expanded Content ────────────────────────────────────────────── */}
      {expanded && (
        <div className="bg-slate-800/50 rounded-b-xl border border-t-0 border-purple-500/20 p-4 -mt-1">

          {/* Sweep Preset Buttons */}
          <div className="flex justify-center gap-2 mb-4">
            {Object.entries(SWEEP_PRESETS).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => handleRunSweep(key)}
                disabled={tuningLoading}
                className={`px-3 py-1.5 rounded-full border text-[10px] transition-colors ${
                  activePass === key
                    ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                    : 'bg-slate-800/50 border-white/10 text-white/80 hover:text-white hover:border-white/20'
                } ${tuningLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {preset.label}
                <span className="ml-1 text-white/70">{preset.desc}</span>
              </button>
            ))}
          </div>

          {/* Narrow around best — shown after discovery/narrowing when result exists */}
          {tuningResult && activePass !== 'precision' && !tuningLoading && (
            <div className="flex justify-center mb-4">
              <button
                onClick={() => {
                  const nextPass = activePass === 'discovery' ? 'narrowing' : 'precision'
                  handleRunSweep(nextPass, tuningResult.bestMinute.timeLabel)
                }}
                className="px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-[10px] hover:bg-amber-500/20 transition-colors cursor-pointer"
              >
                Zoom into {tuningResult.bestMinute.timeLabel} &rarr; {activePass === 'discovery' ? 'Narrowing' : 'Precision'}
              </button>
            </div>
          )}

          {/* Error */}
          {tuningError && (
            <div className="text-red-400 text-xs text-center mb-3 bg-red-500/10 border border-red-500/20 rounded-lg p-2">
              {tuningError}
            </div>
          )}

          {/* Loading spinner */}
          {tuningLoading && (
            <div className="flex flex-col items-center py-8 gap-2">
              <div className="w-6 h-6 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
              <div className="text-[10px] text-white/30">
                Evaluating {SWEEP_PRESETS[activePass]?.desc || '...'} ...
              </div>
            </div>
          )}

          {/* ── Results ─────────────────────────────────────────────────── */}
          {tuningResult && !tuningLoading && (
            <>
              {/* Best Minute Badge */}
              <div className="text-center mb-3">
                <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Best Time</div>
                <button
                  onClick={() => handleCandidateClick(tuningResult.bestMinute)}
                  className="text-3xl font-bold text-amber-300 font-mono hover:text-amber-200 transition-colors cursor-pointer"
                >
                  {tuningResult.bestMinute.timeLabel}
                </button>
                <div className="text-xs text-white/50 mt-1">
                  Score: <span className="text-white font-semibold">{tuningResult.bestMinute.totalScore.toFixed(1)}</span>
                  {' '}&middot; Confidence: {tuningResult.bestMinute.confidenceScore.toFixed(1)}
                  {' '}&middot; ASC {tuningResult.bestMinute.ascSign} {tuningResult.bestMinute.ascDegree.toFixed(0)}&deg;
                </div>
              </div>

              {/* Score Sparkline */}
              {sparklineData.length > 1 && (
                <div className="mb-4">
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart
                      data={sparklineData}
                      margin={{ top: 8, right: 12, left: 8, bottom: 4 }}
                      onClick={handleChartClick}
                      style={{ cursor: 'pointer' }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis
                        dataKey="timeLabel"
                        tick={{ fill: '#94a3b8', fontSize: 9 }}
                        interval={xInterval}
                        tickLine={false}
                      />
                      <YAxis
                        domain={['dataMin - 5', 'dataMax + 5']}
                        tick={{ fill: '#94a3b8', fontSize: 9 }}
                        width={28}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip content={<SparklineTooltip />} />

                      {/* Stable window highlight */}
                      {stableWindowLabels && (
                        <ReferenceArea
                          x1={stableWindowLabels.x1}
                          x2={stableWindowLabels.x2}
                          fill="rgba(168,85,247,0.08)"
                          stroke="rgba(168,85,247,0.25)"
                          strokeDasharray="4 2"
                        />
                      )}

                      {/* Sensitivity cliff markers */}
                      {cliffLabels.map((c, i) => (
                        <ReferenceLine
                          key={i}
                          x={c.timeLabel}
                          stroke="#ef4444"
                          strokeDasharray="3 3"
                          strokeWidth={1}
                        />
                      ))}

                      {/* Total score line */}
                      <Line
                        type="monotone"
                        dataKey="totalScore"
                        stroke="#a855f7"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: '#fbbf24', stroke: '#a855f7', strokeWidth: 2 }}
                      />
                      {/* Confidence line (lighter overlay) */}
                      <Line
                        type="monotone"
                        dataKey="confidence"
                        stroke="#22c55e"
                        strokeWidth={1}
                        strokeDasharray="4 2"
                        dot={false}
                        activeDot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 text-[9px] text-white/30 mt-1">
                    <span><span className="inline-block w-3 h-0.5 bg-purple-500 mr-1 align-middle" />Score</span>
                    <span><span className="inline-block w-3 h-0.5 bg-green-500 mr-1 align-middle" style={{ borderTop: '1px dashed #22c55e' }} />Confidence</span>
                    {stableWindowLabels && <span><span className="inline-block w-3 h-2 bg-purple-500/20 border border-purple-500/30 mr-1 align-middle" />Stable Window</span>}
                    {cliffLabels.length > 0 && <span><span className="inline-block w-3 h-0.5 bg-red-500 mr-1 align-middle" style={{ borderTop: '1px dashed #ef4444' }} />Cliff</span>}
                  </div>
                </div>
              )}

              {/* Top 5 Candidates */}
              <div className="flex flex-wrap justify-center gap-2 mb-3">
                {(tuningResult.top5 || []).map((c, i) => (
                  <button
                    key={i}
                    onClick={() => handleCandidateClick(c)}
                    className={`px-3 py-1.5 rounded-full border text-[10px] transition-colors cursor-pointer ${
                      selectedCandidate?.timeLabel === c.timeLabel
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-slate-700/50 border-white/10 text-white/60 hover:text-white hover:border-purple-500/30'
                    }`}
                  >
                    <span className="font-mono font-bold">{c.timeLabel}</span>
                    <span className="ml-1.5 text-white/40">{c.totalScore.toFixed(1)}</span>
                    <span className="ml-1.5">{c.ascSign}</span>
                  </button>
                ))}
              </div>

              {/* Reason Codes for active candidate */}
              {displayCandidate?.reasonCodes?.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1.5 mb-3">
                  {displayCandidate.reasonCodes.map((code, i) => {
                    const style = REASON_STYLE[code] || { label: code, cls: 'text-white/50 border-white/10 bg-white/5' }
                    return (
                      <span key={i} className={`px-2 py-0.5 rounded-full border text-[9px] ${style.cls}`}>
                        {style.label}
                      </span>
                    )
                  })}
                </div>
              )}

              {/* Stable Window info */}
              {tuningResult.bestStableWindow && (
                <div className="text-[9px] text-white/30 text-center mb-3">
                  Stable window: {tuningResult.bestStableWindow.widthMinutes} min
                  (avg {tuningResult.bestStableWindow.avgScore.toFixed(1)},
                  range {tuningResult.bestStableWindow.minScore.toFixed(1)}&ndash;{tuningResult.bestStableWindow.maxScore.toFixed(1)})
                </div>
              )}

              {/* Dimension Heatmap Toggle */}
              <button
                onClick={() => setShowDimensions(d => !d)}
                className="w-full text-left text-[10px] text-white/40 hover:text-white/60 transition-colors py-1"
              >
                <span className="text-white/50">{showDimensions ? '\u25BE' : '\u25B8'}</span>
                {' '}Dimension Breakdown
              </button>

              {showDimensions && tuningResult.top5?.length > 0 && (
                <div className="overflow-x-auto mt-2 mb-3">
                  <table className="w-full text-[9px]">
                    <thead>
                      <tr>
                        <th className="text-left text-white/30 font-normal px-1 pb-1">Dimension</th>
                        {tuningResult.top5.map((c, i) => (
                          <th key={i} className="text-center text-white/40 font-mono font-normal px-1 pb-1">
                            {c.timeLabel}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(DIMENSION_LABELS).map(([key, label]) => (
                        <tr key={key}>
                          <td className="text-white/40 px-1 py-0.5 whitespace-nowrap">{label}</td>
                          {tuningResult.top5.map((c, i) => {
                            // Find the full minuteScore to get dimension details
                            const fullMs = tuningResult.minuteScores.find(
                              ms => ms.timeLabel === c.timeLabel
                            )
                            const dimScore = fullMs?.dimensions?.[key]?.rawScore ?? 0
                            return (
                              <td
                                key={i}
                                className="text-center text-white/60 font-mono px-1 py-0.5"
                                style={{ backgroundColor: scoreColor(dimScore) }}
                              >
                                {dimScore.toFixed(0)}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Sensitivity Cliffs */}
              {tuningResult.sensitivityCliffs?.length > 0 && (
                <div className="border-t border-white/5 pt-2 mt-2">
                  <div className="text-[9px] text-red-400/70 uppercase tracking-widest mb-1">Sensitivity Cliffs</div>
                  {tuningResult.sensitivityCliffs.map((cliff, i) => (
                    <div key={i} className="text-[10px] text-white/40 flex gap-2">
                      <span className="text-red-400/70 font-mono">
                        {tuningResult.minuteScores?.find(ms => ms.offsetMinutes === cliff.minuteOffset)?.timeLabel || `±${cliff.minuteOffset}`}
                      </span>
                      <span>&Delta; {cliff.delta.toFixed(1)}</span>
                      <span className="text-white/25">{cliff.likelyCause}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Engine info */}
              <div className="text-[8px] text-white/15 text-center mt-3">
                engine v{tuningResult.engineVersion} &middot; profile: {tuningResult.profileUsed}
              </div>
            </>
          )}

          {/* Empty state */}
          {!tuningResult && !tuningLoading && (
            <div className="text-center text-white/80 text-xs py-6">
              Select a sweep mode to begin birth time rectification.
              {birthData?.birthTime === '12:00' && (
                <div className="text-[10px] text-purple-400/90 mt-1">
                  Birth time unknown? Start with Discovery to scan the full 24 hours.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
