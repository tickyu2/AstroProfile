import React, { useMemo, useState, useRef, useEffect } from 'react'
import { useProfiles } from '../contexts/ProfileContext'
import {
  compatibilityEngineStatus,
  compatibilityExplainPair,
  compatibilityZoneDebugPair,
} from '../services/pythonFunctionsService'

const DEFAULT_A = {
  profileId: 'A',
  birthDate: '1963-04-23',
  birthTime: '09:25',
  latitude: 33.5651,
  longitude: 73.0169,
  timezone: 'Asia/Karachi',
}

const DEFAULT_B = {
  profileId: 'B',
  birthDate: '1970-01-01',
  birthTime: '12:00',
  latitude: 34.0522,
  longitude: -118.2437,
  timezone: 'America/Los_Angeles',
}

const SCORE_LABELS = {
  base_similarity: 'Vector shortlist similarity',
  sun_comp: 'Sun compatibility',
  moon_comp: 'Moon compatibility',
  rising_comp: 'Rising compatibility',
  venus_mars_attraction: 'Venus/Mars attraction',
  mercury_intellect: 'Mercury intellectual match',
  saturn_stability: 'Saturn long-term stability',
  psych_comp: 'Psychology alignment',
  angle_dynamics_score: 'Angle dynamics',
  house_placement_score: 'House placement',
  rulership_network_score: 'Rulership network',
  degree_theory_score: 'Degree theory',
  sabian_resonance_score: 'Sabian resonance',
  element_modality_score: 'Element/modality',
  weighted_score: 'Pre-shortlist weighted score',
}

function numeric(v, fallback = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

function buildPayload(a, b) {
  return {
    profileA: {
      profileId: a.profileId || 'A',
      birth: {
        birthDate: a.birthDate,
        birthTime: a.birthTime,
        latitude: numeric(a.latitude),
        longitude: numeric(a.longitude),
        timezone: a.timezone || 'UTC',
      },
      psych: {},
    },
    profileB: {
      profileId: b.profileId || 'B',
      birth: {
        birthDate: b.birthDate,
        birthTime: b.birthTime,
        latitude: numeric(b.latitude),
        longitude: numeric(b.longitude),
        timezone: b.timezone || 'UTC',
      },
      psych: {},
    },
  }
}

function profileToForm(profile) {
  return {
    profileId: profile.displayName || profile.firstName || profile.id,
    birthDate: profile.birthDate || '',
    birthTime: profile.birthTime || '12:00',
    latitude: profile.location?.coordinates?.lat || 0,
    longitude: profile.location?.coordinates?.lng || 0,
    timezone: profile.timezone?.zoneName || profile.timezone || 'UTC',
  }
}

function ProfileForm({ title, value, onChange, profiles }) {
  const [mode, setMode] = useState('manual') // 'manual' | 'profile'
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedName, setSelectedName] = useState(null)
  const dropdownRef = useRef(null)
  const patch = (key, val) => onChange((prev) => ({ ...prev, [key]: val }))

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropdownOpen])

  const isReadOnly = mode === 'profile' && selectedName

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4 space-y-3">
      {/* Header with mode toggle */}
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-slate-100">{title}</h3>
        <div className="flex rounded-lg overflow-hidden border border-slate-600 text-xs">
          <button
            onClick={() => setMode('manual')}
            className={`px-3 py-1 transition-all ${mode === 'manual' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            Manual
          </button>
          <button
            onClick={() => { setMode('profile'); if (!selectedName) setDropdownOpen(true) }}
            className={`px-3 py-1 transition-all ${mode === 'profile' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            Profile
          </button>
        </div>
      </div>

      {/* Profile selector dropdown */}
      {mode === 'profile' && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full text-left px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-sm hover:bg-slate-700 flex items-center justify-between"
          >
            <span className={selectedName ? 'text-slate-100' : 'text-slate-400'}>
              {selectedName || 'Select a profile...'}
            </span>
            <svg className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {dropdownOpen && profiles && profiles.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-lg bg-slate-800 border border-slate-600 shadow-xl max-h-60 overflow-y-auto">
              {profiles.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    onChange(profileToForm(p))
                    setSelectedName(p.displayName || p.firstName || p.id)
                    setDropdownOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-slate-700 border-b border-slate-700/50 last:border-0 flex items-center justify-between"
                >
                  <div>
                    <div className="text-slate-100 font-medium">{p.displayName || p.firstName || p.id}</div>
                    <div className="text-xs text-slate-400">{p.relationshipType || 'profile'} {p.birthDate ? `· ${p.birthDate}` : ''}</div>
                  </div>
                  {selectedName === (p.displayName || p.firstName || p.id) && (
                    <span className="text-amber-400 text-xs">selected</span>
                  )}
                </button>
              ))}
            </div>
          )}
          {dropdownOpen && (!profiles || profiles.length === 0) && (
            <div className="absolute z-10 mt-1 w-full rounded-lg bg-slate-800 border border-slate-600 p-3 text-sm text-slate-400 text-center">
              No profiles found
            </div>
          )}
        </div>
      )}

      {/* Form fields */}
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm text-slate-300">Profile ID
          <input className={`mt-1 w-full rounded bg-slate-800 border border-slate-700 px-2 py-1 ${isReadOnly ? 'opacity-60' : ''}`} value={value.profileId} onChange={(e) => patch('profileId', e.target.value)} readOnly={isReadOnly} />
        </label>
        <label className="text-sm text-slate-300">Birth Date
          <input type="date" className={`mt-1 w-full rounded bg-slate-800 border border-slate-700 px-2 py-1 ${isReadOnly ? 'opacity-60' : ''}`} value={value.birthDate} onChange={(e) => patch('birthDate', e.target.value)} readOnly={isReadOnly} />
        </label>
        <label className="text-sm text-slate-300">Birth Time
          <input type="time" className={`mt-1 w-full rounded bg-slate-800 border border-slate-700 px-2 py-1 ${isReadOnly ? 'opacity-60' : ''}`} value={value.birthTime} onChange={(e) => patch('birthTime', e.target.value)} readOnly={isReadOnly} />
        </label>
        <label className="text-sm text-slate-300">Timezone
          <input className={`mt-1 w-full rounded bg-slate-800 border border-slate-700 px-2 py-1 ${isReadOnly ? 'opacity-60' : ''}`} value={value.timezone} onChange={(e) => patch('timezone', e.target.value)} readOnly={isReadOnly} />
        </label>
        <label className="text-sm text-slate-300">Latitude
          <input type="number" step="any" className={`mt-1 w-full rounded bg-slate-800 border border-slate-700 px-2 py-1 ${isReadOnly ? 'opacity-60' : ''}`} value={value.latitude} onChange={(e) => patch('latitude', e.target.value)} readOnly={isReadOnly} />
        </label>
        <label className="text-sm text-slate-300">Longitude
          <input type="number" step="any" className={`mt-1 w-full rounded bg-slate-800 border border-slate-700 px-2 py-1 ${isReadOnly ? 'opacity-60' : ''}`} value={value.longitude} onChange={(e) => patch('longitude', e.target.value)} readOnly={isReadOnly} />
        </label>
      </div>
    </div>
  )
}

export default function CompatibilityEngineInspectorPage() {
  const { profiles: userProfiles } = useProfiles()
  const [a, setA] = useState(DEFAULT_A)
  const [b, setB] = useState(DEFAULT_B)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState(null)
  const [explain, setExplain] = useState(null)
  const [zone, setZone] = useState(null)
  const [error, setError] = useState('')

  const payload = useMemo(() => buildPayload(a, b), [a, b])

  async function runStatus() {
    setError('')
    try {
      const res = await compatibilityEngineStatus()
      setStatus(res)
    } catch (e) {
      setError(e.message || String(e))
    }
  }

  async function runExplain() {
    setBusy(true)
    setError('')
    try {
      const res = await compatibilityExplainPair(payload)
      setExplain(res)
    } catch (e) {
      setError(e.message || String(e))
    } finally {
      setBusy(false)
    }
  }

  async function runZone() {
    setBusy(true)
    setError('')
    try {
      const res = await compatibilityZoneDebugPair(payload)
      setZone(res)
    } catch (e) {
      setError(e.message || String(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold">Compatibility Engine Inspector</h1>
          <p className="text-slate-300">
            Live inspector for the Python universal match engine. Use this page to see scoring internals,
            including Venus/Mars attraction, Mercury intellect matching, Saturn stability, and 72-zone mapping.
          </p>
          <div className="text-sm text-slate-400">
            Pipeline: upsert profiles → compute features → score pair → explain components → zone debug.
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-4">
          <ProfileForm title="Profile A" value={a} onChange={setA} profiles={userProfiles} />
          <ProfileForm title="Profile B" value={b} onChange={setB} profiles={userProfiles} />
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={runStatus} className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600">Check Engine Status</button>
          <button onClick={runExplain} disabled={busy} className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50">Run Explain Pair</button>
          <button onClick={runZone} disabled={busy} className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50">Run Zone Debug</button>
        </div>

        {error && (
          <div className="rounded border border-red-700 bg-red-900/30 p-3 text-red-200 text-sm">{error}</div>
        )}

        {status && (
          <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
            <h2 className="font-semibold mb-2">Engine Status</h2>
            <pre className="text-xs overflow-auto bg-slate-900 p-3 rounded">{JSON.stringify(status, null, 2)}</pre>
          </section>
        )}

        {explain && (
          <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-4 space-y-4">
            <h2 className="font-semibold">Explain Pair</h2>
            <div className="text-sm text-slate-300">Score: <span className="font-semibold text-white">{Math.round((explain.score || 0) * 1000) / 10}%</span></div>
            {explain.narrative && <div className="text-sm text-slate-200 leading-relaxed">{explain.narrative}</div>}
            <div className="grid md:grid-cols-2 gap-3">
              {Object.entries(explain.explain || {}).map(([key, val]) => (
                <div key={key} className="rounded bg-slate-900 border border-slate-800 p-2 text-sm flex justify-between gap-3">
                  <span className="text-slate-300">{SCORE_LABELS[key] || key}</span>
                  <span className="font-mono text-slate-100">{typeof val === 'number' ? val.toFixed(4) : String(val)}</span>
                </div>
              ))}
            </div>
            {!!(explain.reasons || []).length && (
              <ul className="list-disc pl-5 text-sm text-slate-200 space-y-1">
                {(explain.reasons || []).map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            )}
          </section>
        )}

        {zone && (
          <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-4 space-y-3">
            <h2 className="font-semibold">Zone Debug</h2>
            <div className="text-sm text-slate-300">Zone Score: <span className="font-semibold text-white">{Math.round((zone.zoneScore || 0) * 1000) / 10}%</span></div>
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="text-slate-300 border-b border-slate-700">
                  <tr>
                    <th className="text-left p-2">Placement</th>
                    <th className="text-left p-2">A Sign</th>
                    <th className="text-left p-2">A Deg</th>
                    <th className="text-left p-2">A Zone</th>
                    <th className="text-left p-2">B Sign</th>
                    <th className="text-left p-2">B Deg</th>
                    <th className="text-left p-2">B Zone</th>
                  </tr>
                </thead>
                <tbody>
                  {(zone.placements || []).map((row) => (
                    <tr key={row.placement} className="border-b border-slate-800">
                      <td className="p-2 capitalize">{row.placement}</td>
                      <td className="p-2">{row.aSign}</td>
                      <td className="p-2">{row.aDegree}</td>
                      <td className="p-2">{row.aZone}</td>
                      <td className="p-2">{row.bSign}</td>
                      <td className="p-2">{row.bDegree}</td>
                      <td className="p-2">{row.bZone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
