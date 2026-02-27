# Hour Pillar Button — Implementation Plan

## Goal
Add an "Hour Pillar" button to the Branch Wheel page that shows date + 2-hour time windows in the black gap ring area (e.g., "Mar 7" / "1:00–3:00 AM"), with arrow navigation cycling ±2 hours.

## Changes Required (3 files)

### 1. `src/utils/branchWheelData.ts` — Hour pillar data functions

**New constants:**
- `HOUR_STEM_BASE = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8]` — Five Rats Rule (五鼠遁): maps day stem index → Rat hour's starting stem index
- `HOUR_RANGES` — Array mapping branch index → `{ startHour, endHour, label }` (e.g., branch 2 Tiger → `{ start: 3, end: 5, label: "3:00–5:00 AM" }`)

**New exported functions:**
- `hourToBranchIndex(hour: number): number` — Convert 0-23 hour → branch index (e.g., hour 1 → branch 1 Ox)
- `getHourStemIndex(dayStemIndex: number, branchIndex: number): number` — Get hour stem from day stem + branch
- `hourToStemOffset(date: Date): number` — Stem offset for hour mode (Tiger hour's stem for the day)
- `hourPillarLabel(dayStemIndex, branchIndex)` — Returns `{ ganZhi, english, stemChar, ... }`
- `buildHourGapLabels(referenceDate: Date)` — Returns 12 labels, each with `{ displayPos, branchIndex, dateLabel, timeLabel, isNow }`

**Hour-to-branch mapping:**
| Branch | Animal | Hours | Label |
|--------|--------|-------|-------|
| 0 Rat | 23:00–1:00 | 11:00 PM–1:00 AM |
| 1 Ox | 1:00–3:00 | 1:00–3:00 AM |
| 2 Tiger | 3:00–5:00 | 3:00–5:00 AM |
| ... | ... | ... |
| 11 Pig | 21:00–23:00 | 9:00–11:00 PM |

### 2. `src/pages/BaZiBranchWheelPage.tsx` — State management + button

- **PillarMode type:** `'off' | 'year' | 'month' | 'day' | 'hour'`
- **`handlePillarModeToggle` type:** Widen to accept `'year' | 'month' | 'day' | 'hour'`
- **`stemOffset` useMemo:** Add `if (pillarMode === 'hour') return hourToStemOffset(currentDate);`
- **`hourLabels` useMemo:** Compute via `buildHourGapLabels(currentDate)` when `pillarMode === 'hour'`
- **`handleStemNavigate`:** Add `if (pillarMode === 'hour')` → shift `currentDate` by ±2 hours
- **`lockedBranchYear`:** Add hour mode case for locked branch detail
- **Hour Pillar button:** Rose/pink theme (`#f472b6`), same pattern as existing buttons
- **Pass `hourLabels` to `<BaZiBranchWheel />`**

### 3. `src/components/bazi/BaZiBranchWheel.tsx` — Gap ring rendering

- **Props:** Add `hourLabels?: { displayPos, branchIndex, dateLabel, timeLabel, isNow }[] | null`
- **Gap rendering:** New `if (pillarMode === 'hour' && hourLabels)` block showing:
  - Line 1 (y - 4): Date label (e.g., "Mar 7") — 10px, weight 600
  - Line 2 (y + 5): Time window (e.g., "1:00–3:00 AM") — 8px, weight 700
  - "NOW" micro-label below current hour (same pattern as "TODAY" in day mode)
  - Hover tooltip showing full date + time range
- **Arrow rotation:** 30° per step (same as day mode)

### Button color: Rose/pink
- Active bg: `rgba(244,114,182,0.18)`
- Active border: `rgba(244,114,182,0.5)`
- Active text: `#f472b6`
- Highlight color for "NOW": `#f472b6`
