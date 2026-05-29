/**
 * ============================================================================
 * NATAL PIPELINE — Sequential TFQ Processing
 * ============================================================================
 *
 * Orchestrates the full natal Qi pipeline in the correct metaphysical order.
 * Each stage takes a 5-element Qi vector and returns a new one, plus metadata
 * for the UI to show before/after bar charts and explanations.
 *
 * Input:  TFQ (post-Seasonality, post-Polarity)
 * Output: NTFQ (Normalized Total Functional Qi) + stage trace
 *
 * Pipeline order:
 *   1. Combinations (合)     — alliances before violence
 *   2. Clashes (冲)          — violent branch collisions
 *   3. Harms (害)            — subtle erosion
 *   4. Punishments (刑)      — self-inflicted contradiction
 *   5. Control Cycle (克)    — suppressing cycle pressure
 *   6. Overcrowding (旺极)   — dominant element bleed-off
 *   7. Collapse (崩)         — structural failure detection
 *   8. Transformations (化)  — extreme-ratio alchemy
 *   9. Structure (格局)      — natal pattern classification
 *  10. Ten Gods (十神)       — relational analysis
 *  11. Yong Shen (用神)      — medicine element selection
 *
 * Only natal Qi goes through this pipeline.
 * DaYun, Year, Month are external climate — they do NOT pass through here.
 *
 * Created: March 2026
 * ============================================================================
 */

// ============================================================================
// TYPES
// ============================================================================

export type ElementName = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';

export interface QiVector {
  Wood: number;
  Fire: number;
  Earth: number;
  Metal: number;
  Water: number;
}

/** One stage in the pipeline — carries before/after Qi and metadata */
export interface PipelineStage {
  key: string;
  label: string;
  chinese: string;
  beforeQi: QiVector;
  afterQi: QiVector;
  delta: QiVector;
  details: string[];           // human-readable step details
  events?: any[];              // structured events (clashes, combos, etc.)
  metadata?: Record<string, any>; // stage-specific data (collapse mode, yong shen, etc.)
  description: string;         // one-line explanation
  metaphysical: {              // 5W+H+Emotion for the UI tooltip
    what: string;
    why: string;
    when: string;
    where: string;
    who: string;
    how: string;
    emotion: string;
  };
}

/** Full pipeline result */
export interface NatalPipelineResult {
  inputQi: QiVector;           // TFQ going in (post-Season, post-Polarity)
  outputQi: QiVector;          // NTFQ coming out
  stages: PipelineStage[];     // every stage with before/after
  collapseInfo?: any;          // from collapse detection
  yongShen?: any;              // from Yong Shen analysis
  structureInfo?: any;         // from structure classification
}

/** Chart context needed by combination engine and conflict detection */
export interface NatalPipelineContext {
  chartPillars: any[];         // 4 natal pillars from calculateBaZi()
  yearPillar: { stem: string; branch: string };
  monthPillar: { stem: string; branch: string };
  currentMonthBranch: string;
  dayMasterElement: string;
  dayMasterPolarity: string;
  natalBranches: Record<string, string>; // { year: '午', month: '寅', ... }
  yearBranch: string;
  monthBranch: string;
  daYunBranch?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const ELEMENT_KEYS: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

// ============================================================================
// HELPERS
// ============================================================================

function cloneQi(q: QiVector): QiVector {
  return { Wood: q.Wood, Fire: q.Fire, Earth: q.Earth, Metal: q.Metal, Water: q.Water };
}

function emptyQi(): QiVector {
  return { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
}

function computeDelta(before: QiVector, after: QiVector): QiVector {
  const d = emptyQi();
  for (const k of ELEMENT_KEYS) d[k] = after[k] - before[k];
  return d;
}

function totalQi(q: QiVector): number {
  return ELEMENT_KEYS.reduce((s, k) => s + (q[k] || 0), 0);
}

// ============================================================================
// METAPHYSICAL DESCRIPTIONS (5W+H+Emotion)
// ============================================================================

const METAPHYSICS: Record<string, PipelineStage['metaphysical']> = {
  combinations: {
    what: 'Elements that resonate merge into a new configuration.',
    why: 'To show alliances and hidden support before conflict begins.',
    when: 'After season and polarity shape the raw body.',
    where: 'Inside the natal structure itself.',
    who: 'Stems/branches that meet combination rules.',
    how: 'Qi is partially re-routed into combined forms.',
    emotion: 'Who has my back when the storm starts?',
  },
  clashes: {
    what: 'Direct collisions between opposing branches.',
    why: 'To reveal where life brings shock, disruption, and forced change.',
    when: 'After alliances are formed.',
    where: 'Between pillars that stand opposite each other.',
    who: 'Branches in 6-clash pairs.',
    how: 'Both sides lose Qi; stability is shaken.',
    emotion: 'Where does life slam into me like a car crash?',
  },
  harms: {
    what: 'Subtle, corrosive interactions that erode over time.',
    why: 'To show long-term drains and emotional bruises.',
    when: 'After the big collisions are accounted for.',
    where: 'Between specific branch pairs.',
    who: 'Charts with harm relationships.',
    how: 'Slow Qi leakage between paired branches.',
    emotion: 'Where do I get hurt quietly, without noticing at first?',
  },
  punishments: {
    what: 'Self-inflicted contradictions and internal tension.',
    why: 'To reveal where the chart fights itself.',
    when: 'After external harms are mapped.',
    where: 'Within or between certain branches.',
    who: 'Charts with punishment patterns.',
    how: 'Qi is wasted in internal conflict.',
    emotion: 'Where do I keep tripping over my own feet?',
  },
  control: {
    what: 'The natural suppressing cycle (Wood\u2192Earth, Earth\u2192Water, etc.).',
    why: 'To show how the body self-regulates and where suppression becomes excessive.',
    when: 'After clashes/harms/punishments expose vulnerabilities.',
    where: 'Across the five elements.',
    who: 'Every chart \u2014 this cycle is universal.',
    how: 'Strong elements reduce those they control.',
    emotion: 'Where do I feel held down or over-managed?',
  },
  overcrowding: {
    what: 'When one element becomes overwhelmingly strong.',
    why: 'To show where "too much of a good thing" becomes a problem.',
    when: 'After control is applied and imbalances are clearer.',
    where: 'Any element exceeding a defined threshold.',
    who: 'Charts with extreme emphasis.',
    how: 'Diminishing returns; excess bleeds into Sheng child.',
    emotion: 'Where does my strength become my liability?',
  },
  collapse: {
    what: 'When an element drops below survival level.',
    why: 'To identify true structural weakness \u2014 the places that cannot carry load.',
    when: 'After all draining forces are applied.',
    where: 'Elements under critical thresholds.',
    who: 'Charts with starvation or severe depletion.',
    how: 'Qi is flagged as non-functional; structural mode is classified.',
    emotion: 'Where am I running on fumes?',
  },
  transformations: {
    what: 'True alchemy \u2014 one element becoming another under strict conditions.',
    why: 'To show deep, irreversible shifts in how Qi behaves.',
    when: 'After combinations + strength conditions are met.',
    where: 'Specific combo patterns where attacker overwhelms victim.',
    who: 'Charts that meet classical transformation rules (ratio > 3:1).',
    how: '30% of victim converts to the product element.',
    emotion: 'Where do I become something else entirely?',
  },
  structure: {
    what: 'The overall pattern \u2014 what kind of "body" this chart is.',
    why: 'To frame the entire natal system: what it\u2019s built to do.',
    when: 'After the dust of violence settles.',
    where: 'Across all pillars and elements.',
    who: 'Every chart.',
    how: 'Classification; may influence interpretation emphasis.',
    emotion: 'What kind of creature am I, underneath it all?',
  },
  tenGods: {
    what: 'Relationship roles between Day Master and other stems.',
    why: 'To describe psychology, behavior, and relational patterns.',
    when: 'After structure is known.',
    where: 'Stem-to-stem relationships.',
    who: 'Every chart.',
    how: 'Interpretive layer; Qi stays numerically the same.',
    emotion: 'How do I relate to power, love, work, self?',
  },
  yongShen: {
    what: 'The chosen "medicine" element.',
    why: 'To identify what stabilizes and heals the natal body.',
    when: 'After structure + Ten Gods are clear.',
    where: 'Among the five elements.',
    who: 'Every chart, but with different answers.',
    how: 'Selected based on what the body lacks or needs moderated.',
    emotion: 'What actually helps me survive this hurricane?',
  },
};

// ============================================================================
// MAIN PIPELINE
// ============================================================================

/**
 * Process natal TFQ through the full metaphysical pipeline.
 *
 * @param tfq        The TFQ vector (already post-Seasonality, post-Polarity)
 * @param ctx        Chart context for combinations, clash detection, etc.
 * @param imports    External functions injected to avoid circular dependencies
 */
export function processNatalPipeline(
  tfq: QiVector,
  ctx: NatalPipelineContext,
  imports: {
    applyCombinationEngine: (qi: any, ctx: any) => any;
    buildCombinationContext: (...args: any[]) => any;
    detectInteractions: (natalBranches: any, yearBranch: string, monthBranch: string, daYunBranch?: string) => any[];
    applyClashDamage: (qi: any, interactions: any[]) => { qi: any; steps: string[] };
    applyControlPressure: (qi: any) => { qi: any; steps: string[] };
    applyOvercrowding: (qi: any) => { result: any; details: any[] };
    applyTransformations: (qi: any) => { result: any; details: string[] };
    analyzeStructuralCollapse: (qi: any) => any;
  }
): NatalPipelineResult {
  const stages: PipelineStage[] = [];
  let currentQi = cloneQi(tfq);

  // Detect all interactions once — clashes, harms, punishments all come from branch pairs
  const allInteractions = imports.detectInteractions(
    ctx.natalBranches,
    ctx.yearBranch,
    ctx.monthBranch,
    ctx.daYunBranch
  );

  // ── Stage 1: Combinations (合) ──────────────────────────────────────────
  {
    const before = cloneQi(currentQi);
    const comboCtx = imports.buildCombinationContext(
      ctx.chartPillars,
      ctx.yearPillar,
      ctx.monthPillar,
      ctx.currentMonthBranch
    );
    const comboResult = imports.applyCombinationEngine(currentQi, comboCtx);
    currentQi = cloneQi(comboResult.postQi);

    const details: string[] = [
      '── Rules ──',
      'Void (空亡): Day pillar determines 2 empty branches → Qi reduced by 50%.',
      'Stem Combos (天干合): 甲己→Earth, 乙庚→Metal, 丙辛→Water, 丁壬→Wood, 戊癸→Fire.',
      'Branch 6-Combos (六合): pairs merge → element transform if season supports.',
      'Three Harmony (三合局): branch triads → strong elemental surge.',
      'Three Meetings (三会局): seasonal triads → massive dominance.',
      'Combined branches are protected from clashes (合能解冲).',
      '',
      '── This chart ──',
    ];
    if (comboResult.voidEvents?.length > 0) {
      details.push(`Void branches: ${comboResult.voidEvents.map((v: any) => `${v.branch} (${v.animal}) — ${v.pillarLabel}, ${v.element} reduced by ${v.qiReduction.toFixed(3)}`).join('; ')}`);
    } else {
      details.push('No natal branches fall in the void positions.');
    }
    for (const ev of (comboResult.events || [])) {
      const participants = ev.participants?.map((p: any) => `${p.char}(${p.pillarLabel})`).join(' + ') || '';
      details.push(`${ev.type}: ${participants} → ${ev.resultElement}${ev.transformed ? ' (TRANSFORMED — season supports)' : ' (held — season does not support transformation)'}${ev.voidBlocked ? ' [BLOCKED by void]' : ''}`);
      if (ev.qiDelta) {
        const deltaStr = ELEMENT_KEYS.filter(k => Math.abs(ev.qiDelta[k] || 0) > 0.001).map(k => `${k}: ${ev.qiDelta[k] > 0 ? '+' : ''}${ev.qiDelta[k].toFixed(3)}`).join(', ');
        if (deltaStr) details.push(`  Qi change: ${deltaStr}`);
      }
    }
    if ((comboResult.events || []).length === 0) {
      details.push('No active stem or branch combinations detected.');
    }
    if (comboResult.protectedBranches?.size > 0) {
      details.push(`Protected from future clashes: ${Array.from(comboResult.protectedBranches).join(', ')}`);
    }

    stages.push({
      key: 'combinations',
      label: 'Combinations',
      chinese: '合',
      beforeQi: before,
      afterQi: cloneQi(currentQi),
      delta: computeDelta(before, currentQi),
      details,
      events: comboResult.events,
      metadata: {
        voidBranches: comboResult.voidBranches,
        voidEvents: comboResult.voidEvents,
        protectedBranches: Array.from(comboResult.protectedBranches || []),
      },
      description: 'Compatible elements merge before any conflict begins.',
      metaphysical: METAPHYSICS.combinations,
    });
  }

  // ── Stage 2: Clashes (冲) ───────────────────────────────────────────────
  {
    const before = cloneQi(currentQi);
    const clashInteractions = allInteractions.filter((h: any) => h.type === 'clash');
    const clashResult = imports.applyClashDamage(currentQi, clashInteractions);
    currentQi = cloneQi(clashResult.qi);

    const details: string[] = [
      '── Rules ──',
      'Six Clashes (六冲): 子↔午, 丑↔未, 寅↔申, 卯↔酉, 辰↔戌, 巳↔亥.',
      'When two branches clash, BOTH elements are reduced to 70% (×0.70 multiplier).',
      'Branches protected by combinations are immune.',
      '',
      '── This chart ──',
      ...clashResult.steps,
    ];

    stages.push({
      key: 'clashes',
      label: 'Clashes',
      chinese: '冲',
      beforeQi: before,
      afterQi: cloneQi(currentQi),
      delta: computeDelta(before, currentQi),
      details,
      events: clashInteractions,
      description: 'Violent collisions between opposing branches.',
      metaphysical: METAPHYSICS.clashes,
    });
  }

  // ── Stage 3: Harms (害) ─────────────────────────────────────────────────
  {
    const before = cloneQi(currentQi);
    const harmInteractions = allInteractions.filter((h: any) => h.type === 'harm');
    const harmResult = imports.applyClashDamage(currentQi, harmInteractions);
    currentQi = cloneQi(harmResult.qi);

    const details: string[] = [
      '── Rules ──',
      'Six Harms (六害): 子↔未, 丑↔午, 寅↔巳, 卯↔辰, 申↔亥, 酉↔戌.',
      'Harm is subtle corrosion — both elements reduced to 85% (×0.85 multiplier).',
      'Less violent than clashes, but represents lingering emotional/health damage.',
      '',
      '── This chart ──',
      ...harmResult.steps,
    ];

    stages.push({
      key: 'harms',
      label: 'Harms',
      chinese: '害',
      beforeQi: before,
      afterQi: cloneQi(currentQi),
      delta: computeDelta(before, currentQi),
      details,
      events: harmInteractions,
      description: 'Subtle, lingering damage that leaks Qi over time.',
      metaphysical: METAPHYSICS.harms,
    });
  }

  // ── Stage 4: Punishments (刑) ───────────────────────────────────────────
  {
    const before = cloneQi(currentQi);
    const punishmentInteractions = allInteractions.filter((h: any) => h.type === 'punishment');
    const punResult = imports.applyClashDamage(currentQi, punishmentInteractions);
    currentQi = cloneQi(punResult.qi);

    const details: string[] = [
      '── Rules ──',
      'Ungrateful Punishment (恩中之刑): 寅↔巳↔申 — Tiger, Snake, Monkey.',
      'Bullying Punishment (勢中之刑): 丑↔戌↔未 — Ox, Dog, Goat.',
      'Uncivilized Punishment (無禮之刑): 子↔卯 — Rat, Rabbit.',
      'Self-Punishment (自刑): 辰辰, 午午, 酉酉, 亥亥.',
      'Punished elements reduced to 80% (×0.80 multiplier).',
      '',
      '── This chart ──',
      ...punResult.steps,
    ];

    stages.push({
      key: 'punishments',
      label: 'Punishments',
      chinese: '刑',
      beforeQi: before,
      afterQi: cloneQi(currentQi),
      delta: computeDelta(before, currentQi),
      details,
      events: punishmentInteractions,
      description: 'Internal contradictions where Qi punishes itself.',
      metaphysical: METAPHYSICS.punishments,
    });
  }

  // ── Stage 5: Control Cycle (克) ─────────────────────────────────────────
  {
    const before = cloneQi(currentQi);
    const controlResult = imports.applyControlPressure(currentQi);
    currentQi = cloneQi(controlResult.qi);

    const details: string[] = [
      '── Rules ──',
      'The Five-Element Control Cycle (相克):',
      '  Wood → Earth (木克土)   Earth → Water (土克水)',
      '  Water → Fire (水克火)   Fire → Metal (火克金)',
      '  Metal → Wood (金克木)',
      'If controller > controlled × 1.5 → controlled element reduced by 15%.',
      'This models natural suppression — strong elements keep weaker ones in check.',
      '',
      '── This chart ──',
      ...controlResult.steps,
    ];

    stages.push({
      key: 'control',
      label: 'Control Cycle',
      chinese: '克',
      beforeQi: before,
      afterQi: cloneQi(currentQi),
      delta: computeDelta(before, currentQi),
      details,
      description: 'The natural suppressing cycle that keeps elements in check.',
      metaphysical: METAPHYSICS.control,
    });
  }

  // ── Stage 6: Overcrowding (旺极) ────────────────────────────────────────
  {
    const before = cloneQi(currentQi);
    const overcrowdResult = imports.applyOvercrowding(currentQi);
    currentQi = cloneQi(overcrowdResult.result);

    const t = totalQi(before);
    const avg = t / 5;
    const details: string[] = [
      '── Rules ──',
      `Total Qi pool: ${t.toFixed(3)} pts. Average per element: ${avg.toFixed(3)} pts.`,
      'Overcrowding triggers when an element holds >35% of total OR >2.0× average.',
      'Excess Qi above 2.0× average is bled at 10% rate into the Sheng (生) child.',
      'Sheng children: Wood→Fire, Fire→Earth, Earth→Metal, Metal→Water, Water→Wood.',
      'Max bleed per element: 0.500 pts.',
      '',
      '── This chart ──',
      ...overcrowdResult.details.map((d: any) => typeof d === 'string' ? d : d.label),
    ];
    if (overcrowdResult.details.length === 0) {
      details.push('No element exceeds the overcrowding threshold.');
    }

    stages.push({
      key: 'overcrowding',
      label: 'Overcrowding',
      chinese: '旺极',
      beforeQi: before,
      afterQi: cloneQi(currentQi),
      delta: computeDelta(before, currentQi),
      details,
      description: 'When one element becomes so strong it distorts the system.',
      metaphysical: METAPHYSICS.overcrowding,
    });
  }

  // ── Stage 7: Collapse (崩) ──────────────────────────────────────────────
  {
    const before = cloneQi(currentQi);
    const collapseInfo = imports.analyzeStructuralCollapse(currentQi);
    const t = totalQi(currentQi);

    const details: string[] = [
      '── Rules ──',
      'Collapse detection classifies the natal structure without changing Qi values.',
      `Total Qi: ${t.toFixed(3)} pts.`,
      'Single-Dominant (從旺): one element ≥60% with ≥25% gap to second → "Follow the Strong".',
      'Bi-Polar (兩神成象): top two elements ≥80% total → "Two Gods Form Image".',
      'Drained (虛弱): weakest element ≤2% → critical elemental deficiency.',
      'Inverted: bottom 3 elements combined > top 2 → unusual distribution.',
      'Balanced: none of the above → healthy distribution.',
      '',
      '── This chart ──',
      `Mode: ${collapseInfo.mode}`,
      ...(collapseInfo.notes || []),
    ];

    stages.push({
      key: 'collapse',
      label: 'Collapse',
      chinese: '崩',
      beforeQi: before,
      afterQi: cloneQi(currentQi),
      delta: computeDelta(before, currentQi),
      details,
      metadata: { collapseInfo },
      description: 'Structural pattern classification — what kind of body is this?',
      metaphysical: METAPHYSICS.collapse,
    });
  }

  // ── Stage 8: Transformations (化) ───────────────────────────────────────
  {
    const before = cloneQi(currentQi);
    const txResult = imports.applyTransformations(currentQi);
    currentQi = cloneQi(txResult.result);

    const details: string[] = [
      '── Rules ──',
      'Transformation occurs when attacker overwhelms victim:',
      '  Condition: attacker > 1.5 pts AND attacker/victim ratio > 3:1.',
      '  Effect: 30% of victim converts to product element.',
      'Transform rules:',
      '  Fire melts Metal → Water    Metal chops Wood → Fire',
      '  Water drowns Fire → Earth   Wood uproots Earth → Metal',
      '  Earth absorbs Water → Wood',
      '',
      '── This chart ──',
    ];
    // Show each pair's check
    const TX_RULES = [
      { a: 'Fire', v: 'Metal', p: 'Water' }, { a: 'Metal', v: 'Wood', p: 'Fire' },
      { a: 'Water', v: 'Fire', p: 'Earth' }, { a: 'Wood', v: 'Earth', p: 'Metal' },
      { a: 'Earth', v: 'Water', p: 'Wood' },
    ];
    for (const r of TX_RULES) {
      const aVal = before[r.a as ElementName] || 0;
      const vVal = before[r.v as ElementName] || 0;
      const ratio = vVal > 0 ? aVal / vVal : 0;
      const triggered = aVal > 1.5 && vVal > 0 && ratio > 3;
      details.push(`  ${r.a}(${aVal.toFixed(3)}) vs ${r.v}(${vVal.toFixed(3)}): ratio ${ratio.toFixed(1)}:1 → ${triggered ? 'TRIGGERED — 30% of ' + r.v + ' → ' + r.p : 'not triggered'}`);
    }
    if (txResult.details.length > 0) {
      details.push('', ...txResult.details);
    }

    stages.push({
      key: 'transformations',
      label: 'Transformations',
      chinese: '化',
      beforeQi: before,
      afterQi: cloneQi(currentQi),
      delta: computeDelta(before, currentQi),
      details,
      description: 'Under strict conditions, one element alchemically becomes another.',
      metaphysical: METAPHYSICS.transformations,
    });
  }

  // ── Stage 9: Structure (格局) ───────────────────────────────────────────
  {
    const before = cloneQi(currentQi);
    const t = totalQi(currentQi);
    const shares: Record<string, number> = {};
    for (const k of ELEMENT_KEYS) shares[k] = t > 0 ? (currentQi[k] / t * 100) : 20;

    const sorted = [...ELEMENT_KEYS].sort((a, b) => (currentQi[b] || 0) - (currentQi[a] || 0));
    const dominant = sorted[0];
    const weakest = sorted[4];

    const details: string[] = [
      '── Analysis ──',
      `Day Master: ${ctx.dayMasterElement} (${ctx.dayMasterPolarity})`,
      `Total Qi: ${t.toFixed(3)} pts`,
      '',
      '── Element Distribution ──',
      ...ELEMENT_KEYS.map(k => `  ${k}: ${currentQi[k].toFixed(3)} pts (${shares[k].toFixed(1)}%)`),
      '',
      `Dominant: ${dominant} (${shares[dominant].toFixed(1)}%)`,
      `Weakest: ${weakest} (${shares[weakest].toFixed(1)}%)`,
      '',
      'Structure is interpretive — Qi values unchanged.',
      'This classification informs Yong Shen selection.',
    ];

    stages.push({
      key: 'structure',
      label: 'Structure',
      chinese: '格局',
      beforeQi: before,
      afterQi: cloneQi(currentQi),
      delta: computeDelta(before, currentQi),
      details,
      metadata: { dominant, weakest, shares },
      description: 'The overall natal pattern: what kind of body this chart is.',
      metaphysical: METAPHYSICS.structure,
    });
  }

  // ── Stage 10: Ten Gods (十神) ───────────────────────────────────────────
  {
    const before = cloneQi(currentQi);
    const details = [
      '── Rules ──',
      `Day Master: ${ctx.dayMasterElement} (${ctx.dayMasterPolarity})`,
      'Ten Gods describe the relationship between Day Master and other stems:',
      '  Same element → Friend (比肩) / Rob Wealth (劫財)',
      '  DM produces → Eating God (食神) / Hurting Officer (傷官)',
      '  DM conquers → Indirect Wealth (偏財) / Direct Wealth (正財)',
      '  Conquers DM → 7 Killings (七殺) / Direct Officer (正官)',
      '  Produces DM → Indirect Resource (偏印) / Direct Resource (正印)',
      '',
      '── This chart ──',
      'Ten Gods are interpretive — Qi values unchanged.',
      'They determine which element serves as Yong Shen (medicine).',
    ];

    stages.push({
      key: 'tenGods',
      label: 'Ten Gods',
      chinese: '十神',
      beforeQi: before,
      afterQi: cloneQi(currentQi),
      delta: computeDelta(before, currentQi),
      details,
      description: 'Relational Qi: how the Day Master relates to everything else.',
      metaphysical: METAPHYSICS.tenGods,
    });
  }

  // ── Stage 11: Yong Shen (用神) ──────────────────────────────────────────
  {
    const before = cloneQi(currentQi);
    // Yong Shen is interpretive — identify the medicine element
    const t = totalQi(currentQi);
    const pcts: Record<string, number> = {};
    for (const k of ELEMENT_KEYS) pcts[k] = t > 0 ? (currentQi[k] / t * 100) : 20;

    // Simple Yong Shen: weakest element that supports DM
    const sorted = [...ELEMENT_KEYS].sort((a, b) => pcts[a] - pcts[b]);
    const candidate = sorted[0]; // weakest element as primary candidate

    const details: string[] = [
      '── Rules ──',
      'Yong Shen (用神) = the "useful god" — the element that stabilizes the natal body.',
      'Selection considers: DM strength, structural collapse mode, and elemental deficiency.',
      'In a normal structure: the weakest or most needed element becomes medicine.',
      'In Follow-the-Strong: the dominant element IS the medicine (do not oppose it).',
      '',
      '── This chart ──',
      `Day Master: ${ctx.dayMasterElement} (${ctx.dayMasterPolarity})`,
      '',
      '── Element shares after pipeline ──',
      ...ELEMENT_KEYS.map(k => `  ${k}: ${pcts[k].toFixed(1)}%`),
      '',
      `Weakest element: ${candidate} (${pcts[candidate].toFixed(1)}%)`,
      `Candidate Yong Shen: ${candidate}`,
      '',
      'Yong Shen is interpretive — Qi values unchanged.',
      'This element determines the Anchor Stone for the bracelet.',
    ];

    stages.push({
      key: 'yongShen',
      label: 'Yong Shen',
      chinese: '用神',
      beforeQi: before,
      afterQi: cloneQi(currentQi),
      delta: computeDelta(before, currentQi),
      details,
      metadata: { yongShenCandidate: candidate, percentages: pcts },
      description: 'The healing element chosen to stabilize the natal body.',
      metaphysical: METAPHYSICS.yongShen,
    });
  }

  return {
    inputQi: cloneQi(tfq),
    outputQi: cloneQi(currentQi),
    stages,
    collapseInfo: stages.find(s => s.key === 'collapse')?.metadata?.collapseInfo,
    yongShen: stages.find(s => s.key === 'yongShen')?.metadata,
    structureInfo: stages.find(s => s.key === 'structure')?.metadata,
  };
}
