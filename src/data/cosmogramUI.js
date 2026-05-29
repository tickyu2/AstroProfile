// Display-layer metadata for the 36-Row Cosmogram macro-systems.
// Kept separate from organCosmogram.js so the data layer stays Tailwind-agnostic.
// Keyed by MACRO_SYSTEMS.id from organCosmogram.js.
export const COSMOGRAM_SYSTEM_UI = {
  flow:      { module: 1, card: 'bg-blue-500/10 border-blue-500/15',      dot: 'bg-blue-500/50',    label: 'text-blue-300',    rowTag: 'text-blue-300/80',    tagline: 'The subconscious ocean beneath all later systems. Feeling → readiness.' },
  force:     { module: 2, card: 'bg-red-500/10 border-red-500/15',        dot: 'bg-red-500/50',     label: 'text-red-300',     rowTag: 'text-red-300/80',     tagline: 'The living pump — the first true engine. Readiness → power.' },
  fire:      { module: 3, card: 'bg-amber-500/10 border-amber-500/15',    dot: 'bg-amber-500/50',   label: 'text-amber-300',   rowTag: 'text-amber-300/80',   tagline: 'The metabolic forge — where raw experience becomes direction. Power → transformation.' },
  breath:    { module: 4, card: 'bg-cyan-500/10 border-cyan-500/15',      dot: 'bg-cyan-500/50',    label: 'text-cyan-300',    rowTag: 'text-cyan-300/80',    tagline: 'The respiratory-circulatory intelligence. Transformation → perception.' },
  structure: { module: 5, card: 'bg-purple-500/10 border-purple-500/15',  dot: 'bg-purple-500/50',  label: 'text-purple-300',  rowTag: 'text-purple-300/80',  tagline: 'The architectural intelligence — where the organism holds its shape. Perception → structure.' },
  signal:    { module: 6, card: 'bg-emerald-500/10 border-emerald-500/15', dot: 'bg-emerald-500/50', label: 'text-emerald-300', rowTag: 'text-emerald-300/80', tagline: 'The cognitive-immune crown — where the organism knows itself. Structure → consciousness.' },
};
