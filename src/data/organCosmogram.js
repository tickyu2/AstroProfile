/**
 * Organ Cosmogram — The 36-Row Macro-Architecture
 *
 * The bird's-eye view of the entire Zodiac Body Atlas.
 * Groups 36 organ-rows into 6 macro-systems, 12 functional arcs,
 * and 36 directional currents.
 *
 * This is the "map of maps" — the cathedral dome above the cathedral.
 */

// ============================================================================
// THE SIX MACRO-SYSTEMS
// ============================================================================

export const MACRO_SYSTEMS = [
  {
    id: 'flow',
    name: 'The Flow System',
    rows: [0, 1, 2, 3, 4, 5],
    theme: 'The subconscious ocean beneath all later systems',
    governs: ['emotional tides', 'instinctive flow', 'micro-movement', 'subtle readiness', 'pre-decision intelligence'],
    color: '#3b82f6', // blue
    metaphor: 'Where Module 1 is feeling, the ocean from which all systems rise.',
    arc: 'feeling → readiness',
    summary: 'Establishes emotional climate, basic movement, potential energy, containment, grounding, and orientation.',
  },
  {
    id: 'force',
    name: 'The Force System',
    rows: [6, 7, 8, 9, 10, 11],
    theme: 'The living pump of the cosmogram — the first true engine',
    governs: ['force', 'vitality', 'circulation', 'oxygenation', 'metabolic push', 'immune activation'],
    color: '#ef4444', // red
    metaphor: 'Where Module 2 is power — the pump, the forge, the river, the sentinel.',
    arc: 'readiness → power',
    summary: 'Establishes rhythm, power, renewal, micro-transformation, circulation, and vigilance.',
  },
  {
    id: 'fire',
    name: 'The Fire System',
    rows: [12, 13, 14, 15, 16, 17],
    theme: 'The metabolic forge — where raw experience becomes direction',
    governs: ['metabolic fire', 'discernment', 'precision', 'meaning-processing', 'activation', 'ignition'],
    color: '#f59e0b', // amber
    metaphor: 'Where Module 3 is transformation — the blade, the forge, the arrow, the meaning-engine.',
    arc: 'power → transformation',
    summary: 'Establishes emotional boundaries, central vitality, action-instinct, precision, meaning-metabolism, and activation.',
  },
  {
    id: 'breath',
    name: 'The Breath System',
    rows: [18, 19, 20, 21, 22, 23],
    theme: 'The respiratory-circulatory intelligence — where the organism breathes meaning',
    governs: ['trust', 'perception', 'purification', 'flow-state', 'identity-genesis', 'transmission'],
    color: '#22d3ee', // cyan
    metaphor: 'Where Module 4 is perception — inner guidance, emotional patterning, purification, flow, genesis, transmission.',
    arc: 'transformation → perception',
    summary: 'Establishes trust, emotional patterning, purification, emotional flow, identity-origin, and luminous awareness.',
  },
  {
    id: 'structure',
    name: 'The Structure System',
    rows: [24, 25, 26, 27, 28, 29],
    theme: 'The architectural intelligence — where the organism holds its shape',
    governs: ['interface', 'continuity', 'glide', 'protection', 'anchoring', 'hidden boundaries'],
    color: '#a78bfa', // purple
    metaphor: 'Where Module 5 is architecture — the veil, the web, the film, the shield, the compass, the hidden wall.',
    arc: 'perception → structure',
    summary: 'Establishes contact, structural continuity, frictionless movement, warm protection, deep anchoring, and hidden boundaries.',
  },
  {
    id: 'signal',
    name: 'The Signal System',
    rows: [30, 31, 32, 33, 34, 35],
    theme: 'The cognitive-immune crown — where the organism knows itself',
    governs: ['ignition', 'essence', 'release', 'heart-shielding', 'emotional truth', 'discernment'],
    color: '#34d399', // emerald
    metaphor: 'Where Module 6 is consciousness — the spark, the well, the gate, the heart-shield, the flame, the sieve.',
    arc: 'structure → consciousness',
    summary: 'Establishes activation, essence preservation, controlled release, emotional buffering, radiant truth, and precise sorting.',
  },
];

// ============================================================================
// THE 36 DIRECTIONAL CURRENTS
// ============================================================================

export const COSMOGRAM_ROWS = [
  // Flow System (0-5)
  { row: 0, organ: 'Smooth Muscle', mythicName: 'The Ocean-Pulse', current: 'inward → outward → inward', system: 'flow', role: 'Primordial water — baseline emotional climate from which all systems rise' },
  { row: 1, organ: 'Skeletal Muscle', mythicName: 'The Warrior-Core', current: 'outward', system: 'flow', role: 'First emergence of will from the ocean — the first spark of "I move"' },
  { row: 2, organ: 'Tendons', mythicName: 'The Bowstring', current: 'coiling → storing → releasing', system: 'flow', role: 'The drawn bow — pre-decision tension that precedes movement' },
  { row: 3, organ: 'Rib Cage', mythicName: 'The Gate of Breath', current: 'expansion ↔ containment', system: 'flow', role: 'First architecture — the container that gives shape to ocean and warrior' },
  { row: 4, organ: 'Femur', mythicName: 'The Earth-Root', current: 'downward', system: 'flow', role: 'Gravity anchor — the foundation stone of the cosmogram' },
  { row: 5, organ: 'Spinal Ribs', mythicName: 'The Gyre-Axis', current: 'rotation', system: 'flow', role: 'First directional intelligence — the pivot point, the first hinge' },

  // Force System (6-11) — Atlas-true mythic overlay
  { row: 6, organ: 'Peripheral Nerves', mythicName: 'The Heart-Pulse of the Edges', current: 'branching → sensing', system: 'force', role: 'Edge-awareness and micro-activation; the spark-net at the organism\'s perimeter, the first pulse of vigilance and vitality' },
  { row: 7, organ: 'Synapses', mythicName: 'The Spark-Forge', current: 'micro-inward → micro-outward', system: 'force', role: 'Neural switching and micro-decisions; the switchboard where activation becomes choice and force becomes intention' },
  { row: 8, organ: 'Vagus Nerve', mythicName: 'The Reined-Wind', current: 'downward → calming', system: 'force', role: 'Parasympathetic regulation and fear-alchemy; the reins that keep the organism from burning itself out, the quiet intelligence beneath activation' },
  { row: 9, organ: 'SA Node', mythicName: 'The True Heart-Pulse', current: 'rhythmic outward waves', system: 'force', role: 'The metronome of life; tempo, pacing, and activation cycles — the true ignition point of the Force System' },
  { row: 10, organ: 'Left Ventricle', mythicName: 'The Forge-Heart', current: 'forceful outward push', system: 'force', role: 'Courage, propulsion, and decisive action; the hammer of the heart where rhythm becomes power' },
  { row: 11, organ: 'Right Ventricle', mythicName: 'The Wind-Heart', current: 'outward → upward', system: 'force', role: 'Renewal, oxygenation force, and recovery cycles; the breath-linked half of the heart, the chamber that lifts the organism back into life' },

  // Fire System (12-17)
  { row: 12, organ: 'Hepatic Portal', mythicName: 'The Gate', current: 'filtering inward', system: 'fire', role: 'Emotional boundaries — filtration, discernment, subtle safety' },
  { row: 13, organ: 'Liver Core', mythicName: 'The Inner Sun', current: 'radiating outward', system: 'fire', role: 'Metabolic sovereign — the forge of purpose, righteous heat, direction' },
  { row: 14, organ: 'Bile Ducts', mythicName: 'The Arrow', current: 'forward thrust', system: 'fire', role: 'Willpower in motion — action-instinct, momentum, pressure-release' },
  { row: 15, organ: 'Stomach', mythicName: 'The Blade', current: 'precise cutting', system: 'fire', role: 'Precision organ — tactical decision-making, micro-courage, emotional sharpness' },
  { row: 16, organ: 'Small Intestine', mythicName: 'The Meaning-Engine', current: 'sorting inward', system: 'fire', role: 'Existential nutrition — purpose-metabolism, meaning from experience' },
  { row: 17, organ: 'Large Intestine', mythicName: 'The Ignition', current: 'explosive outward', system: 'fire', role: 'Activation engine — mobilization, survival clarity, threshold-crossing' },

  // Breath System (18-23) — Atlas-true mythic overlay
  { row: 18, organ: 'Bronchioles', mythicName: 'The Branching Breathways', current: 'inward branching', system: 'breath', role: 'Distributes inhaled air through fine branching passages, preparing it for deep exchange.' },
  { row: 19, organ: 'Lung Lobes', mythicName: 'The Air Provinces', current: 'expanding and resting', system: 'breath', role: 'Holds broad fields of breath that inflate and settle, shaping the volume of respiration.' },
  { row: 20, organ: 'Alveoli', mythicName: 'The Ember Chambers', current: 'micro exchange', system: 'breath', role: 'Exchanges gases at a microscopic scale, where breath becomes blood-borne vitality.' },
  { row: 21, organ: 'Plasma', mythicName: 'The River of Carriage', current: 'circulating', system: 'breath', role: 'Carries heat, hormones, and dissolved breath through the body as a flowing medium.' },
  { row: 22, organ: 'Red Blood Cells', mythicName: 'The Oxygen Riders', current: 'outward to tissues', system: 'breath', role: 'Delivers oxygen to distant tissues, turning circulation into usable energy and action.' },
  { row: 23, organ: 'White Blood Cells', mythicName: 'The Immune Watch', current: 'patrolling', system: 'breath', role: 'Patrols the inner terrain, recognizing and responding to threats that breach the body.' },

  // Structure System (24-29) — Atlas-true mythic overlay
  { row: 24, organ: 'Lower Diaphragm', mythicName: 'The Breath Root', current: 'downward press', system: 'structure', role: 'Anchors the breath by pressing downward, stabilizing the core and grounding inhalation.' },
  { row: 25, organ: 'Diaphragm Core', mythicName: 'The Central Bellows', current: 'rhythmic rise and fall', system: 'structure', role: 'Drives the main rhythm of breathing, translating muscular motion into pressure waves.' },
  { row: 26, organ: 'Upper Diaphragm', mythicName: 'The Chest Canopy', current: 'upward lift', system: 'structure', role: 'Lifts and domes the upper chest, opening space for the lungs to fully expand.' },
  { row: 27, organ: 'Lumbar Spine', mythicName: 'The Grounded Column', current: 'upward from pelvis', system: 'structure', role: 'Bears weight from below, transmitting force from the pelvis into upright posture.' },
  { row: 28, organ: 'Thoracic Spine', mythicName: 'The Heart Hinge', current: 'arching and opening', system: 'structure', role: 'Forms the flexible hinge behind the heart and ribs, allowing the chest to open or close.' },
  { row: 29, organ: 'Cervical Spine', mythicName: 'The Horizon Tower', current: 'upward and forward', system: 'structure', role: 'Supports and angles the head, setting the line of sight and direction of attention.' },

  // Signal System (30-35) — Atlas-true mythic overlay
  { row: 30, organ: 'Prefrontal Cortex', mythicName: "The Planner's Flame", current: 'forward focusing', system: 'signal', role: 'Holds plans, priorities, and restraint, focusing the mind toward chosen futures.' },
  { row: 31, organ: 'Neocortex', mythicName: 'The Pattern Field', current: 'outward mapping', system: 'signal', role: 'Builds maps of the world through patterns and concepts, supporting complex understanding.' },
  { row: 32, organ: 'Default Mode Network', mythicName: 'The Inner Storyfield', current: 'inward drifting', system: 'signal', role: 'Weaves self-referential stories and reflections, shaping the sense of an inner life.' },
  { row: 33, organ: 'Lymph Nodes', mythicName: 'The Filtered Gates', current: 'inward screening', system: 'signal', role: 'Screens lymph for threats, concentrating immune attention where it is most needed.' },
  { row: 34, organ: 'Lymph Fluid', mythicName: 'The Clear Stream', current: 'slow circulation', system: 'signal', role: 'Moves quietly through tissues, carrying waste and signals in a subtle cleansing flow.' },
  { row: 35, organ: 'Immune Signaling', mythicName: 'The Alarm Network', current: 'pulses outward and inward', system: 'signal', role: 'Broadcasts danger and coordination signals, synchronizing immune responses across the body.' },
];

// ============================================================================
// THE GRAND NARRATIVE — Row 0 → Row 35
// ============================================================================

export const GRAND_NARRATIVE = {
  title: 'The Grand Arc: From Ocean to Sieve',
  subtitle: 'The mythic story of the entire zodiac body',
  stages: [
    { system: 'flow', arc: 'From the subconscious tide (Ocean-Pulse) through the first spark of will (Warrior-Core), the drawn bow of readiness (Bowstring), the first walls of containment (Gate of Breath), the gravity anchor (Earth-Root), to the first pivot of direction (Gyre-Axis).' },
    { system: 'force', arc: 'From the metronome of vitality (Heart-Pulse) through the hammer of the heart (Forge-Pump), the renewal engine (Wind-Pump), the micro-forge where air becomes fire (Ember-Exchange), the river system (River-Carrier), to the guardian perimeter (Sentinel-Cells).' },
    { system: 'fire', arc: 'From emotional filtration (The Gate) through the solar sovereign (Inner Sun), momentum in motion (The Arrow), tactical precision (The Blade), existential nutrition (Meaning-Engine), to survival ignition (The Ignition).' },
    { system: 'breath', arc: 'From inner guidance and trust (Inner Guidance) through empathic patterning (Perception Engine), purification (Purification Engine), circulating intelligence (Flow Engine), identity genesis (Genesis Engine), to luminous transmission (Transmission Engine).' },
    { system: 'structure', arc: 'From the contact membrane (The Veil) through connective continuity (The Web), frictionless glide (The Film), warm protection (Protective Veil), deep anchoring (The Compass), to the hidden rear boundary (The Hidden Wall).' },
    { system: 'signal', arc: 'From mythic ignition (The Spark) through deep essence (The Well), controlled release (The Gate/Drain), heart-shielding (The Heart-Shield), radiant truth (The Core Flame), to the final sieve of discernment (The Sieve).' },
  ],
  conclusion: 'From flow to precision. From tension to truth. From muscle to mind. From the subconscious tide to fearless clarity. The zodiac as a living body — 36 organs, 1,296 panels, one breathing organism.',
};

// ============================================================================
// QI FLOW GRAPH — Directed edges between the 36 organs.
// Within each system: sequential flow (row N → row N+1).
// Between systems: last row of system A → first row of system B.
// This forms a complete 36-node directed cycle representing the organism's
// continuous Qi circulation. The cycle follows the Grand Arc:
//   Flow(0→5) → Force(6→11) → Fire(12→17) → Breath(18→23) → Structure(24→29) → Signal(30→35) → Flow(0)
// ============================================================================

export const QI_FLOW_EDGES = (() => {
  const edges = [];
  for (let i = 0; i < 35; i++) {
    edges.push({ from: i, to: i + 1 });
  }
  edges.push({ from: 35, to: 0 }); // Signal → Flow (cycle closes)
  return edges;
})();

// Lookup helpers
export function getUpstream(row, depth = 35) {
  const path = [];
  let current = row;
  for (let i = 0; i < depth; i++) {
    current = current === 0 ? 35 : current - 1;
    path.push(current);
  }
  return path;
}

export function getDownstream(row, depth = 35) {
  const path = [];
  let current = row;
  for (let i = 0; i < depth; i++) {
    current = current === 35 ? 0 : current + 1;
    path.push(current);
  }
  return path;
}

// ============================================================================
// WU XIN (FIVE ELEMENT) ASSIGNMENT — Maps each of the 36 organs to a TCM element.
// Derived from the Zodiac Meridian Map:
//   Wood 木 = Liver, Gallbladder, Tendons, Eyes → Aries/Leo rows
//   Fire 火 = Heart, Small Intestine, Pericardium, Triple Burner → Cancer/Sagittarius rows
//   Earth 土 = Spleen, Stomach → Cancer/Leo-Virgo rows
//   Metal 金 = Lungs, Large Intestine → Libra/Virgo rows
//   Water 水 = Kidney, Bladder, Bones → Scorpio/Capricorn/Taurus rows
// ============================================================================

export const WU_XIN_ELEMENTS = {
  wood:  { name: 'Wood',  chinese: '木', color: '#10b981', emoji: '🌳' },
  fire:  { name: 'Fire',  chinese: '火', color: '#ef4444', emoji: '🔥' },
  earth: { name: 'Earth', chinese: '土', color: '#f59e0b', emoji: '🏔️' },
  metal: { name: 'Metal', chinese: '金', color: '#e2e8f0', emoji: '⚔️' },
  water: { name: 'Water', chinese: '水', color: '#3b82f6', emoji: '🌊' },
};

// Row → Wu Xin element mapping. Each organ assigned by its TCM meridian affinity.
export const ROW_ELEMENT = {
  // Flow (0-5): muscles/bones — Wood (tendons), Water (bones), Earth (flesh)
  0:  'earth',  // Smooth Muscle — flesh, nurturing substrate
  1:  'wood',   // Skeletal Muscle — sinews, Wood governs tendons/muscles
  2:  'wood',   // Tendons — Wood's tissue
  3:  'metal',  // Rib Cage — Metal governs protective structures
  4:  'water',  // Femur — Water governs bones
  5:  'water',  // Spinal Ribs — bone/structure

  // Force (6-11): nerves/heart — Fire (heart), Wood (nerve/wind)
  6:  'wood',   // Peripheral Nerves — Wind/Wood governs nerve movement
  7:  'fire',   // Synapses — Fire/spark, Heart-mind connection
  8:  'earth',  // Vagus Nerve — Earth: grounding, regulation, digestion link
  9:  'fire',   // SA Node — Heart's pacemaker, pure Fire
  10: 'fire',   // Left Ventricle — Heart Fire
  11: 'fire',   // Right Ventricle — Heart Fire

  // Fire system (12-17): digestive — Wood (Liver), Earth (Stomach/Spleen), Metal (intestines)
  12: 'wood',   // Hepatic Portal — Liver system, Wood
  13: 'wood',   // Liver Core — pure Wood
  14: 'wood',   // Bile Ducts — Gallbladder/Liver, Wood
  15: 'earth',  // Stomach — pure Earth
  16: 'fire',   // Small Intestine — Fire (Heart-SI pair in TCM)
  17: 'metal',  // Large Intestine — Metal (Lung-LI pair in TCM)

  // Breath (18-23): lungs/blood — Metal (Lungs), Fire (blood/heart)
  18: 'metal',  // Bronchioles — Lung system, Metal
  19: 'metal',  // Lung Lobes — pure Metal
  20: 'metal',  // Alveoli — Lung micro-exchange, Metal
  21: 'water',  // Plasma — fluid, Water
  22: 'fire',   // Red Blood Cells — Heart/blood, Fire
  23: 'metal',  // White Blood Cells — defensive Qi, Metal/Lung Wei Qi

  // Structure (24-29): diaphragm/spine — Earth (diaphragm), Water (spine/bones)
  24: 'earth',  // Lower Diaphragm — Earth, Spleen/Stomach junction
  25: 'earth',  // Diaphragm Core — Earth, central post-heaven Qi
  26: 'earth',  // Upper Diaphragm — Earth, breath-nourishment bridge
  27: 'water',  // Lumbar Spine — Water, Kidney/bone axis
  28: 'fire',   // Thoracic Spine — Fire, Heart-level support
  29: 'wood',   // Cervical Spine — Wood, Gallbladder meridian runs through neck

  // Signal (30-35): brain/lymph/immune — Water (Kidney/brain), Fire (Shen/mind)
  30: 'water',  // Prefrontal Cortex — Water/Kidney essence nourishes brain (Sui)
  31: 'fire',   // Neocortex — Fire/Shen, conscious awareness
  32: 'water',  // Default Mode Network — Water, deep/still, Kidney-Jing reflection
  33: 'earth',  // Lymph Nodes — Earth, Spleen governs lymph/immunity
  34: 'water',  // Lymph Fluid — Water, fluid circulation
  35: 'metal',  // Immune Signaling — Metal, Wei Qi (defensive Qi), Lung system
};

// ============================================================================
// SHENG (生) CREATION CYCLE — the nourishment flow between elements.
// Water → Wood → Fire → Earth → Metal → Water
// Each element's organs feed into the next element's organs.
// ============================================================================

export const SHENG_CYCLE = ['water', 'wood', 'fire', 'earth', 'metal'];

// Get the parent (nourishing) element
export function shengParent(element) {
  const idx = SHENG_CYCLE.indexOf(element);
  return SHENG_CYCLE[(idx - 1 + 5) % 5];
}

// Get the child (nourished) element
export function shengChild(element) {
  const idx = SHENG_CYCLE.indexOf(element);
  return SHENG_CYCLE[(idx + 1) % 5];
}

// ============================================================================
// KE (克) CONTROL CYCLE — the restraint flow between elements.
// Water → Fire → Metal → Wood → Earth → Water
// Each element controls/restrains the one two steps ahead in Sheng.
// ============================================================================

export const KE_CYCLE = ['water', 'fire', 'metal', 'wood', 'earth'];

export function keTarget(element) {
  const idx = SHENG_CYCLE.indexOf(element);
  return SHENG_CYCLE[(idx + 2) % 5];
}

export function keSource(element) {
  const idx = SHENG_CYCLE.indexOf(element);
  return SHENG_CYCLE[(idx - 2 + 5) % 5];
}

// ============================================================================
// TCM QI FLOW EDGES — directed edges following the Sheng creation cycle.
// Organs of element N flow into organs of element N+1 (parent → child).
// Within same element, flow follows row order.
// ============================================================================

export function getTcmFlowEdges() {
  const byElement = {};
  for (const [rowStr, el] of Object.entries(ROW_ELEMENT)) {
    const row = Number(rowStr);
    (byElement[el] ||= []).push(row);
  }
  for (const el of Object.keys(byElement)) {
    byElement[el].sort((a, b) => a - b);
  }

  const edges = [];

  // Intra-element sequential flow
  for (const el of SHENG_CYCLE) {
    const rows = byElement[el];
    for (let i = 0; i < rows.length - 1; i++) {
      edges.push({ from: rows[i], to: rows[i + 1], type: 'intra', element: el });
    }
  }

  // Inter-element Sheng bridges: last organ of parent → first organ of child
  for (let i = 0; i < SHENG_CYCLE.length; i++) {
    const parent = SHENG_CYCLE[i];
    const child = SHENG_CYCLE[(i + 1) % 5];
    const parentRows = byElement[parent];
    const childRows = byElement[child];
    edges.push({
      from: parentRows[parentRows.length - 1],
      to: childRows[0],
      type: 'sheng',
      element: child,
    });
  }

  return edges;
}

// TCM upstream/downstream traversal following Sheng cycle order
export function getTcmPath(startRow, depth, direction) {
  const edges = getTcmFlowEdges();
  const fwd = {};
  const bwd = {};
  edges.forEach((e) => {
    (fwd[e.from] ||= []).push(e.to);
    (bwd[e.to] ||= []).push(e.from);
  });

  const visited = new Set();
  const path = [];
  let frontier = [startRow];
  visited.add(startRow);

  for (let d = 0; d < depth && frontier.length > 0; d++) {
    const nextFrontier = [];
    for (const node of frontier) {
      const neighbors = direction === 'down' ? (fwd[node] || []) : (bwd[node] || []);
      for (const n of neighbors) {
        if (!visited.has(n)) {
          visited.add(n);
          path.push({ row: n, depth: d + 1 });
          nextFrontier.push(n);
        }
      }
    }
    frontier = nextFrontier;
  }
  return path;
}

// ============================================================================
// KE (克) CONTROL EDGES — directed edges where one element restrains another.
// Water→Fire→Metal→Wood→Earth→Water
// Each organ of the controller element has edges to organs of the controlled.
// ============================================================================

export function getKeFlowEdges() {
  const byElement = {};
  for (const [rowStr, el] of Object.entries(ROW_ELEMENT)) {
    (byElement[el] ||= []).push(Number(rowStr));
  }
  for (const el of Object.keys(byElement)) byElement[el].sort((a, b) => a - b);

  const edges = [];
  for (const [rowStr, el] of Object.entries(ROW_ELEMENT)) {
    const row = Number(rowStr);
    const target = keTarget(el);
    const targetRows = byElement[target] || [];
    for (const t of targetRows) {
      edges.push({ from: row, to: t, controller: el, controlled: target });
    }
  }
  return edges;
}

// Get Ke relationships for a specific organ
export function getKeRelationships(row) {
  const el = ROW_ELEMENT[row];
  if (!el) return { controls: [], controlledBy: [], element: el };
  const target = keTarget(el);
  const source = keSource(el);
  const controls = [];
  const controlledBy = [];
  for (const [r, e] of Object.entries(ROW_ELEMENT)) {
    if (e === target) controls.push(Number(r));
    if (e === source) controlledBy.push(Number(r));
  }
  return { element: el, controls: controls.sort((a, b) => a - b), controlledBy: controlledBy.sort((a, b) => a - b), targetElement: target, sourceElement: source };
}

// ============================================================================
// SYSTEM TRANSITIONS — How each system hands off to the next
// ============================================================================

export const SYSTEM_TRANSITIONS = [
  { from: 'flow', to: 'force', bridge: 'The Flow System establishes emotional climate and readiness. The Force System takes that readiness and turns it into power, rhythm, and circulation.' },
  { from: 'force', to: 'fire', bridge: 'The Force System establishes vitality and circulation. The Fire System takes that vitality and transforms it into metabolic fire, precision, and meaning.' },
  { from: 'fire', to: 'breath', bridge: 'The Fire System establishes transformation and meaning. The Breath System takes that meaning and breathes it into trust, perception, purification, and identity.' },
  { from: 'breath', to: 'structure', bridge: 'The Breath System establishes perception and identity. The Structure System takes that identity and gives it architecture — contact, continuity, protection, and orientation.' },
  { from: 'structure', to: 'signal', bridge: 'The Structure System establishes architecture and orientation. The Signal System takes that architecture and crowns it with consciousness — ignition, essence, release, truth, and discernment.' },
  { from: 'signal', to: 'flow', bridge: 'The Signal System establishes consciousness and discernment. The cycle returns to Flow — the sieve feeds back into the ocean, and the organism begins again.' },
];
