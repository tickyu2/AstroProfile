/**
 * PlaybackControls.jsx
 *
 * Cassette-tape style transport controls for LAB birth time animation.
 * Pre-computes positions via batch API, then animates the wheel client-side.
 */

import { useState, useRef, useCallback, useEffect } from 'react'
import { batchChartPositions } from '../../services/pythonFunctionsService'


// ─── Convert batch frame → labSovereign shape ────────────────────────────────
function frameToSovereign(frame) {
  return {
    sun: frame.planets.sun || null,
    moon: frame.planets.moon || null,
    ascendant: {
      sign: frame.ascendant.sign,
      degree: frame.ascendant.degree,
      longitude: frame.ascendant.longitude,
    },
    midheaven: {
      sign: frame.midheaven.sign,
      degree: frame.midheaven.degree,
      longitude: frame.midheaven.longitude,
    },
    rising: {
      sign: frame.ascendant.sign,
      degree: frame.ascendant.degree,
      degreeInSign: frame.ascendant.degree,
      longitude: frame.ascendant.longitude,
    },
    planets: frame.planets,
    houses: frame.cusps,       // array format — normalizeHouses handles it
    aspects: [],               // omitted during playback
    arabicParts: null,
    _playbackFrame: true,
  }
}


// ─── Find closest index in sorted array ──────────────────────────────────────
function findClosestIndex(sortedKeys, target) {
  let best = 0
  let bestDist = Math.abs(sortedKeys[0] - target)
  for (let i = 1; i < sortedKeys.length; i++) {
    const dist = Math.abs(sortedKeys[i] - target)
    if (dist < bestDist) {
      best = i
      bestDist = dist
    }
  }
  return best
}


// ─── Time formatter ──────────────────────────────────────────────────────────
function fmtTime(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}


export default function PlaybackControls({
  labBirthData,
  timezone,
  labTimeMinutes,
  onSetSovereign,
  onSnapTime,          // full handleLabTimeChange (triggers API)
  onSnapTimeRaw,       // just setLabTimeMinutes (no API)
  labCalculating,
  disabled,
  onPlaybackStateChange,
}) {
  const [playbackState, setPlaybackState] = useState('idle')
  const [direction, setDirection] = useState(1)
  const [speed, setSpeed] = useState(1)            // 1 = normal (500ms), 2 = fast (250ms)
  const [stepMinutes, setStepMinutes] = useState(5)
  const [frameCache, setFrameCache] = useState(null)
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0)
  const [prepProgress, setPrepProgress] = useState(null)
  const [error, setError] = useState(null)

  const intervalRef = useRef(null)
  const frameCacheRef = useRef(null)
  const currentFrameIdxRef = useRef(0)
  const sortedKeysRef = useRef([])
  const directionRef = useRef(1)
  const speedRef = useRef(1)

  // Keep refs in sync
  useEffect(() => { directionRef.current = direction }, [direction])
  useEffect(() => { speedRef.current = speed }, [speed])

  // Notify parent of state changes
  useEffect(() => {
    onPlaybackStateChange?.(playbackState)
  }, [playbackState, onPlaybackStateChange])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  // Step size change → invalidate cache
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
    setFrameCache(null)
    frameCacheRef.current = null
    sortedKeysRef.current = []
    if (playbackState !== 'idle') setPlaybackState('idle')
  }, [stepMinutes]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Start the animation loop ──────────────────────────────────────────────
  const startLoop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)

    const tick = () => {
      const keys = sortedKeysRef.current
      const cache = frameCacheRef.current
      if (!cache || keys.length === 0) return

      const idx = currentFrameIdxRef.current
      const nextIdx = idx + directionRef.current

      if (nextIdx < 0 || nextIdx >= keys.length) {
        // Reached boundary — auto-pause
        clearInterval(intervalRef.current)
        intervalRef.current = null
        setPlaybackState('paused')
        // Fetch full chart at stopped position
        const mins = keys[idx]
        if (mins != null) onSnapTime(mins)
        return
      }

      currentFrameIdxRef.current = nextIdx
      setCurrentFrameIdx(nextIdx)

      const minuteKey = keys[nextIdx]
      const frame = cache.get(minuteKey)
      if (frame) {
        onSetSovereign(frameToSovereign(frame))
        onSnapTimeRaw(minuteKey)
      }
    }

    const ms = speedRef.current === 2 ? 250 : 500
    intervalRef.current = setInterval(tick, ms)
  }, [onSetSovereign, onSnapTimeRaw, onSnapTime])

  // Restart loop when speed or direction changes while playing
  useEffect(() => {
    if (playbackState === 'playing' && frameCacheRef.current) {
      startLoop()
    }
  }, [speed, direction, playbackState, startLoop])

  // ── Prepare (fetch batch) + play ─────────────────────────────────────────
  const handlePlay = useCallback(async () => {
    // Resume from pause — re-sync to current slider position
    if (playbackState === 'paused' && frameCacheRef.current) {
      const keys = sortedKeysRef.current
      if (keys.length > 0) {
        const resumeIdx = findClosestIndex(keys, labTimeMinutes)
        currentFrameIdxRef.current = resumeIdx
        setCurrentFrameIdx(resumeIdx)
      }
      setPlaybackState('playing')
      return  // useEffect above will call startLoop
    }

    // Fresh start
    setPlaybackState('preparing')
    setError(null)
    setPrepProgress({ loaded: 0, total: '...' })

    try {
      const resp = await batchChartPositions({
        birthDate: labBirthData.birthDate,
        latitude: labBirthData.latitude,
        longitude: labBirthData.longitude,
        timezone: timezone,
        startMinutes: 0,
        endMinutes: 1439,
        stepMinutes: stepMinutes,
      })

      if (!resp.success || !resp.result?.frames?.length) {
        throw new Error('No frames returned')
      }

      // Build Map for O(1) lookup
      const cache = new Map()
      for (const frame of resp.result.frames) {
        cache.set(frame.minutes, frame)
      }
      const keys = [...cache.keys()].sort((a, b) => a - b)

      frameCacheRef.current = cache
      sortedKeysRef.current = keys
      setFrameCache(cache)
      setPrepProgress({ loaded: resp.result.totalFrames, total: resp.result.totalFrames })

      // Find starting frame closest to current slider position
      const startIdx = findClosestIndex(keys, labTimeMinutes)
      currentFrameIdxRef.current = startIdx
      setCurrentFrameIdx(startIdx)

      setPlaybackState('playing')
    } catch (err) {
      console.error('[Playback] Preparation failed:', err)
      setError(err.message)
      setPlaybackState('idle')
    }
  }, [playbackState, labBirthData, timezone, stepMinutes, labTimeMinutes])

  // ── Pause ─────────────────────────────────────────────────────────────────
  const handlePause = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
    setPlaybackState('paused')
    // Fetch full chart with aspects at paused position
    const keys = sortedKeysRef.current
    const idx = currentFrameIdxRef.current
    if (keys[idx] != null) onSnapTime(keys[idx])
  }, [onSnapTime])

  // ── Stop ──────────────────────────────────────────────────────────────────
  const handleStop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
    setFrameCache(null)
    frameCacheRef.current = null
    sortedKeysRef.current = []
    setPlaybackState('idle')
    setError(null)
    setPrepProgress(null)
  }, [])

  // ── Transport button handlers ─────────────────────────────────────────────
  const handleRewind = useCallback(() => {
    setDirection(-1)
    setSpeed(2)
    if (playbackState === 'idle' || playbackState === 'paused') handlePlay()
  }, [playbackState, handlePlay])

  const handleBackward = useCallback(() => {
    setDirection(-1)
    setSpeed(1)
    if (playbackState === 'idle' || playbackState === 'paused') handlePlay()
  }, [playbackState, handlePlay])

  const handleForward = useCallback(() => {
    setDirection(1)
    setSpeed(1)
    if (playbackState === 'idle' || playbackState === 'paused') handlePlay()
  }, [playbackState, handlePlay])

  const handleFastForward = useCallback(() => {
    setDirection(1)
    setSpeed(2)
    if (playbackState === 'idle' || playbackState === 'paused') handlePlay()
  }, [playbackState, handlePlay])

  const handlePlayPause = useCallback(() => {
    if (playbackState === 'playing') {
      handlePause()
    } else {
      setDirection(1)
      setSpeed(1)
      handlePlay()
    }
  }, [playbackState, handlePause, handlePlay])

  // ── Current time display ──────────────────────────────────────────────────
  const keys = sortedKeysRef.current
  const currentMinutes = keys.length > 0 ? (keys[currentFrameIdx] ?? labTimeMinutes) : labTimeMinutes
  const isPlaying = playbackState === 'playing'
  const isPaused = playbackState === 'paused'
  const isPreparing = playbackState === 'preparing'

  // ── Button style helper ───────────────────────────────────────────────────
  const btnBase = 'w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all cursor-pointer select-none'
  const btnActive = (active) => active
    ? 'bg-amber-500/25 border border-amber-500/50 text-amber-300'
    : 'bg-slate-700/60 border border-white/10 text-white/60 hover:text-white hover:bg-slate-600/60'

  return (
    <div className="mt-3 bg-slate-800/50 rounded-xl border border-amber-500/15 px-4 py-3">

      {/* ── Row 1: Transport + controls ────────────────────────────────── */}
      <div className="flex items-center gap-2">
        {/* Transport buttons */}
        <button onClick={handleRewind} disabled={disabled || isPreparing}
          className={`${btnBase} ${btnActive(isPlaying && direction === -1 && speed === 2)}`}
          title="Rewind (2x)">
          ⏪
        </button>
        <button onClick={handleBackward} disabled={disabled || isPreparing}
          className={`${btnBase} ${btnActive(isPlaying && direction === -1 && speed === 1)}`}
          title="Play backward">
          ◀
        </button>
        <button onClick={handlePlayPause} disabled={disabled || isPreparing}
          className={`${btnBase} w-10 ${isPlaying ? 'bg-amber-500/30 border border-amber-500/50 text-amber-300' : isPaused ? 'bg-purple-500/25 border border-purple-500/50 text-purple-300' : 'bg-slate-700/60 border border-white/10 text-white/70 hover:text-white hover:bg-slate-600/60'}`}
          title={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button onClick={handleForward} disabled={disabled || isPreparing}
          className={`${btnBase} ${btnActive(isPlaying && direction === 1 && speed === 1)}`}
          title="Play forward">
          ▶
        </button>
        <button onClick={handleFastForward} disabled={disabled || isPreparing}
          className={`${btnBase} ${btnActive(isPlaying && direction === 1 && speed === 2)}`}
          title="Fast forward (2x)">
          ⏩
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* Step size selector */}
        <select
          value={stepMinutes}
          onChange={e => setStepMinutes(Number(e.target.value))}
          disabled={isPlaying || isPreparing}
          className="bg-slate-700/60 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white/80 cursor-pointer focus:outline-none focus:border-purple-500/40"
        >
          <option value={5}>5 min</option>
          <option value={1}>1 min</option>
        </select>

        {/* Stop button */}
        {(isPlaying || isPaused) && (
          <button onClick={handleStop}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-sm hover:bg-red-500/25 cursor-pointer"
            title="Stop">
            ⏹
          </button>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Time counter */}
        <div className="text-right">
          <span className="text-sm font-mono text-amber-300 font-medium">
            {fmtTime(currentMinutes)}
          </span>
          <span className="text-[9px] text-white/30 ml-1.5">
            / 23:59
          </span>
        </div>
      </div>

      {/* ── Row 2: Progress bar (preparing only) ──────────────────────── */}
      {isPreparing && (
        <div className="mt-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-slate-700/60 overflow-hidden">
              <div className="h-full bg-amber-500/60 rounded-full animate-pulse" style={{ width: '100%' }} />
            </div>
            <span className="text-[9px] text-amber-400/80">
              Preparing {prepProgress?.total || '...'} frames...
            </span>
          </div>
        </div>
      )}

      {/* ── Row 3: Status text ────────────────────────────────────────── */}
      <div className="mt-1.5 flex items-center gap-2">
        <span className="text-[9px] text-white/30">
          {playbackState === 'idle' && !error && 'Ready — click Play to animate the wheel through 24 hours'}
          {isPlaying && `Playing ${direction === 1 ? 'forward' : 'backward'} ${speed}x · ${stepMinutes}min steps`}
          {isPaused && `Paused at ${fmtTime(currentMinutes)}`}
          {isPreparing && 'Computing positions...'}
        </span>
        {error && (
          <span className="text-[9px] text-red-400">
            Error: {error}
          </span>
        )}
        {frameCache && (
          <span className="text-[9px] text-white/20 ml-auto">
            {frameCache.size} frames cached
          </span>
        )}
      </div>
    </div>
  )
}
