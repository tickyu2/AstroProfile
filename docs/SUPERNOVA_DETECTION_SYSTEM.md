# Supernova Detection System Documentation

## For Brother Sonnet - Complete Technical Reference

**Version:** 1.0 (50 Detectors)
**Location:** `src/services/supernova/`
**Author:** Brother Opus
**Date:** January 2026

---

## Overview

The Supernova Detection System is a **full-spectrum structural psychology diagnostic engine** that identifies catastrophic relational failure modes in romantic partnerships. It analyzes two personality profiles and detects specific psychological collision patterns that predict relationship collapse.

### The Supernova Metaphor

Just as a star collapses into a supernova when internal forces exceed structural integrity, relationships can experience catastrophic failure when certain psychological patterns collide. These are not minor incompatibilities—they are **structural failure modes** that create unsustainable dynamics.

When detected: **"High brilliance, low survivability."**

---

## Architecture

```
src/services/supernova/
├── SupernovaDetector.js      # Mother Module - orchestrates all 50 detectors
├── index.js                   # Public exports
└── detectors/                 # 50 individual detector files
    ├── competingDominance.js
    ├── softBoundaryEmpath.js
    ├── ... (48 more)
    └── emotionalModulationLatencyGap.js
```

### How It Works

1. **Input:** Two personality profiles with `raw_traits` containing 16-dimensional Archetype Vectors
2. **Processing:** Each detector examines specific trait combinations for dangerous patterns
3. **Output:** Aggregated results with flags, penalties, grade caps, and interpretations

### Key Trait Axes (16 Dimensions)

```javascript
const ARCHETYPE_AXES = [
  "Initiator",      // Action-oriented, pioneering
  "Stabilizer",     // Security-seeking, grounding
  "Relational",     // Connection-focused, bonding
  "Warm",           // Emotionally generous, nurturing
  "Expressive",     // Emotionally open, communicative
  "DepthOriented",  // Psychological depth, introspection
  "MindCentered",   // Cognitive processing, analytical
  "OrderOriented",  // Structure-seeking, systematic
  "BoundaryAware",  // Limit-setting, self-protective
  "FluidIdentity",  // Adaptable, identity-flexible
  "Transpersonal",  // Beyond-self oriented, spiritual
  "Sustainer",      // Endurance-focused, maintaining
  "RiskSeeking",    // Novelty-seeking, adventurous
  "Direct"          // Straightforward communication
];
```

### Detector Output Structure

Each detector returns:

```javascript
{
  triggered: boolean,           // Whether pattern detected
  severity: 'high' | 'severe',  // Impact level
  penalty: 0.12-0.14,           // Score reduction
  gradeCap: 'C' | 'C-',         // Maximum possible grade
  harmonyCap: 0.30-0.40,        // Maximum harmony score
  flag: 'string',               // Short identifier
  details: 'string'             // Human-readable explanation
}
```

---

## Complete Detector Catalog (50 Detectors)

### DOMINANCE COLLAPSE

#### 1. Competing Dominance (Double-Solar)
**File:** `competingDominance.js`
**Pattern:** Both partners have extremely high Initiator + Direct + RiskSeeking
**Danger:** Two dominant personalities create perpetual power struggle
**Real-world:** Two CEOs trying to run the same company

---

### ATTACHMENT COLLAPSE

#### 2. Soft Boundary Empath
**File:** `softBoundaryEmpath.js`
**Pattern:** High Relational + Warm + low BoundaryAware meets high BoundaryAware + low Warm
**Danger:** Empath absorbs partner's emotions without protection
**Real-world:** Caretaker burns out supporting emotionally unavailable partner

#### 3. Avoidant-Avoidant Freeze
**File:** `avoidantAvoidantFreeze.js`
**Pattern:** Both have high BoundaryAware + low Relational + low Expressive
**Danger:** Neither initiates emotional connection; relationship starves
**Real-world:** Two people living parallel lives under same roof

#### 4. Anxious-Avoidant Loop
**File:** `anxiousAvoidantLoop.js`
**Pattern:** One high Relational + low BoundaryAware vs one high BoundaryAware + low Relational
**Danger:** Classic pursuit-withdrawal death spiral
**Real-world:** "Why won't you open up?" / "Why are you so needy?"

#### 5. Fragile Idealist
**File:** `fragileIdealist.js`
**Pattern:** High Transpersonal + DepthOriented + low Stabilizer + low BoundaryAware
**Danger:** Idealistic partner shatters when reality intrudes
**Real-world:** Spiritual seeker who can't handle mundane conflicts

#### 6. Co-Dependency Loop
**File:** `coDependencyLoop.js`
**Pattern:** Both have high Relational + Warm + low BoundaryAware + low Initiator
**Danger:** Mutual enmeshment without individual identity
**Real-world:** "I don't know who I am without you"

---

### MORAL/ORDER COLLAPSE

#### 7. Rigid Moralist
**File:** `rigidMoralist.js`
**Pattern:** High OrderOriented + BoundaryAware + low FluidIdentity + low Warm
**Danger:** Inflexible moral standards crush partner's autonomy
**Real-world:** "My way is the right way, period"

---

### ENTROPY COLLAPSE

#### 8. Chaotic-Chaotic Spiral
**File:** `chaoticChaoticSpiral.js`
**Pattern:** Both have high FluidIdentity + RiskSeeking + low Stabilizer + low OrderOriented
**Danger:** No grounding force; relationship spins into chaos
**Real-world:** Two thrill-seekers with no one to pay the bills

---

### COVERT COLLAPSE

#### 9. Covert-Covert Cold War
**File:** `covertCovertColdWar.js`
**Pattern:** Both have low Direct + low Expressive + high MindCentered
**Danger:** Silent resentment builds without expression
**Real-world:** Decades of unspoken grievances

---

### NARCISSISTIC COLLAPSE

#### 10. Narcissistic Collapse
**File:** `narcissisticCollapse.js`
**Pattern:** High Initiator + Direct + low Relational + low Warm + low DepthOriented
**Danger:** Self-focus prevents genuine partner attunement
**Real-world:** Partner as audience, not equal

---

### FUSION COLLAPSE

#### 11. Hyper-Fusion Enmeshment
**File:** `hyperFusionEnmeshment.js`
**Pattern:** Both have extremely high Relational + Warm + low BoundaryAware
**Danger:** Complete identity merger; no individual self remains
**Real-world:** "We" replaces "I" entirely

---

### ASYMMETRY COLLAPSE

#### 12. Power-Caretaker Imbalance
**File:** `powerCaretakerImbalance.js`
**Pattern:** One high Initiator + Direct vs one high Warm + Relational + low Initiator
**Danger:** Permanent parent-child dynamic
**Real-world:** One decides, one serves

#### 13. Emotional Labor Imbalance
**File:** `emotionalLaborImbalance.js`
**Pattern:** One high Relational + Warm + Expressive + DepthOriented vs one low on all
**Danger:** One partner carries all emotional work
**Real-world:** "I'm always the one who has to process feelings"

---

### IDENTITY COLLAPSE

#### 14. Identity Erosion Loop
**File:** `identityErosionLoop.js`
**Pattern:** One high FluidIdentity + low BoundaryAware vs one high Initiator + Direct
**Danger:** Flexible partner loses self to dominant partner
**Real-world:** "I've become whoever they needed me to be"

---

### PHILOSOPHICAL COLLAPSE

#### 15. Value System Divergence
**File:** `valueSystemDivergence.js`
**Pattern:** Major gap in Transpersonal + DepthOriented + OrderOriented configurations
**Danger:** Incompatible worldviews create meaning vacuum
**Real-world:** Atheist and fundamentalist; materialist and spiritual seeker

---

### DIRECTIONAL COLLAPSE

#### 16. Life Trajectory Mismatch
**File:** `lifeTrajectoryMismatch.js`
**Pattern:** Opposing Initiator + RiskSeeking + Stabilizer configurations
**Danger:** Partners pulling toward different futures
**Real-world:** One wants adventure, one wants roots

---

### REALITY COLLAPSE

#### 17. Narrative Reality Split
**File:** `narrativeRealitySplit.js`
**Pattern:** Major gap in MindCentered + DepthOriented + Expressive
**Danger:** Partners live in different subjective realities
**Real-world:** Completely different stories about the same events

---

### TEMPORAL COLLAPSE

#### 18. Emotional Time Scale Mismatch
**File:** `emotionalTimeScaleMismatch.js`
**Pattern:** One processes emotions quickly (high FluidIdentity) vs slowly (high DepthOriented + Stabilizer)
**Danger:** Temporal mismatch in emotional processing
**Real-world:** "You're still upset about that? I moved on hours ago"

---

### CONFLICT COLLAPSE

#### 19. Conflict Modality Incompatibility
**File:** `conflictModalityIncompatibility.js`
**Pattern:** Direct + Expressive vs avoidant (low Direct + low Expressive)
**Danger:** Incompatible conflict styles prevent resolution
**Real-world:** One wants to hash it out, one shuts down

#### 20. Repair Strategy Mismatch
**File:** `repairStrategyMismatch.js`
**Pattern:** One needs verbal processing, one needs space
**Danger:** Repair attempts make things worse
**Real-world:** Pursuing partner triggers fleeing partner's withdrawal

---

### CAPACITY COLLAPSE

#### 21. Emotional Bandwidth Asymmetry
**File:** `emotionalBandwidthAsymmetry.js`
**Pattern:** Major gap in Expressive + Relational + DepthOriented capacity
**Danger:** One partner emotionally overwhelms the other
**Real-world:** "You're too much" / "You're not enough"

#### 22. Emotional Availability Gap
**File:** `emotionalAvailabilityGap.js`
**Pattern:** High Relational + Warm vs low Relational + high MindCentered
**Danger:** One partner perpetually feels unseen
**Real-world:** Emotional desert despite physical presence

#### 23. Emotional Reciprocity Deficit
**File:** `emotionalReciprocityDeficit.js`
**Pattern:** Major imbalance in emotional give-and-take capacity
**Danger:** One-way emotional flow depletes giver
**Real-world:** Always supporting, never supported

---

### TRUST COLLAPSE

#### 24. Trust Formation Mismatch
**File:** `trustFormationMismatch.js`
**Pattern:** One builds trust quickly (high Warm + Relational) vs slowly (high BoundaryAware + MindCentered)
**Danger:** Mismatched trust timelines create frustration
**Real-world:** "Why don't you trust me yet?" after years

---

### INTIMACY COLLAPSE

#### 25. Intimacy Gradient Mismatch
**File:** `intimacyGradientMismatch.js`
**Pattern:** Different intimacy depth preferences (DepthOriented + Transpersonal)
**Danger:** One craves soul-merging, one prefers surface connection
**Real-world:** Profound loneliness despite partnership

---

### EQUILIBRIUM COLLAPSE

#### 26. Autonomy-Closeness Equilibrium Break
**File:** `autonomyClosenessEquilibriumBreak.js`
**Pattern:** One needs high autonomy (BoundaryAware + Initiator) vs high closeness (Relational + Warm)
**Danger:** Impossible to satisfy both simultaneously
**Real-world:** Eternal tug-of-war between space and togetherness

---

### RISK COLLAPSE

#### 27. Emotional Risk Tolerance Gap
**File:** `emotionalRiskToleranceGap.js`
**Pattern:** High RiskSeeking + Expressive vs high Stabilizer + BoundaryAware
**Danger:** One takes emotional risks the other can't handle
**Real-world:** Vulnerability feels dangerous to cautious partner

---

### FORECASTING COLLAPSE

#### 28. Emotional Forecasting Mismatch
**File:** `emotionalForecastingMismatch.js`
**Pattern:** Different anticipatory anxiety levels (Stabilizer + MindCentered configurations)
**Danger:** One worries about future, one lives in present
**Real-world:** "Stop borrowing trouble" / "We need to plan"

---

### MOMENTUM COLLAPSE

#### 29. Emotional Momentum Divergence
**File:** `emotionalMomentumDivergence.js`
**Pattern:** Different emotional acceleration patterns (Initiator + Expressive vs Stabilizer)
**Danger:** One escalates while other stays flat
**Real-world:** Intensity mismatch creates disconnection

---

### SATURATION COLLAPSE

#### 30. Emotional Saturation Threshold Clash
**File:** `emotionalSaturationThresholdClash.js`
**Pattern:** Different emotional capacity limits (DepthOriented + Expressive configurations)
**Danger:** One's normal is other's overwhelm
**Real-world:** "I can't take any more" while partner is just warming up

---

### CONTAINMENT COLLAPSE

#### 31. Emotional Containment Capacity Gap
**File:** `emotionalContainmentCapacityGap.js`
**Pattern:** Different abilities to hold difficult emotions (Stabilizer + DepthOriented + BoundaryAware)
**Danger:** One partner's distress destabilizes the other
**Real-world:** Neither can be the "strong one"

---

### INTERPRETATION COLLAPSE

#### 32. Emotional Signal Interpretation Drift
**File:** `emotionalSignalInterpretationDrift.js`
**Pattern:** Different emotional reading abilities (Relational + DepthOriented + Expressive vs MindCentered)
**Danger:** Chronic misreading of partner's emotional states
**Real-world:** "I thought you were fine!" / "How could you not see?"

---

### FEEDBACK COLLAPSE

#### 33. Emotional Feedback Loop Inversion
**File:** `emotionalFeedbackLoopInversion.js`
**Pattern:** Positive feedback for one triggers negative for other (Expressive + Warm vs MindCentered + BoundaryAware)
**Danger:** Comfort attempts backfire systematically
**Real-world:** Every attempt to help makes things worse

---

### TIMING COLLAPSE

#### 34. Emotional Reciprocity Timing Offset
**File:** `emotionalReciprocityTimingOffset.js`
**Pattern:** Different response latencies (FluidIdentity + Initiator vs Stabilizer + DepthOriented)
**Danger:** Responses arrive after window closes
**Real-world:** Support comes too late to matter

---

### HIERARCHY COLLAPSE

#### 35. Emotional Priority Hierarchy Misalignment
**File:** `emotionalPriorityHierarchyMisalignment.js`
**Pattern:** Different emotion prioritization (Relational + Warm vs MindCentered + OrderOriented)
**Danger:** What matters most to one is irrelevant to other
**Real-world:** "That's not important" about partner's core needs

---

### ALLOCATION COLLAPSE

#### 36. Emotional Resource Allocation Imbalance
**File:** `emotionalResourceAllocationImbalance.js`
**Pattern:** Different emotional investment patterns (Warm + Relational + Expressive vs distributed across other axes)
**Danger:** One invests heavily, other invests elsewhere
**Real-world:** Lopsided emotional economy

---

### ELASTICITY COLLAPSE

#### 37. Emotional Boundary Elasticity Mismatch
**File:** `emotionalBoundaryElasticityMismatch.js`
**Pattern:** Rigid boundaries (BoundaryAware + OrderOriented) vs fluid (FluidIdentity + Relational)
**Danger:** One's flexibility threatens other's structure
**Real-world:** "You're too rigid" / "You have no limits"

---

### SAFETY COLLAPSE

#### 38. Emotional Safety Calibration Gap
**File:** `emotionalSafetyCalibrationGap.js`
**Pattern:** Different safety thresholds (Stabilizer + BoundaryAware + MindCentered vs RiskSeeking + Expressive)
**Danger:** One's safe feels dangerous to other
**Real-world:** Incompatible nervous system calibrations

---

### LOAD COLLAPSE

#### 39. Emotional Expectation Load Imbalance
**File:** `emotionalExpectationLoadImbalance.js`
**Pattern:** One has high emotional expectations (Relational + DepthOriented) vs other has low (MindCentered + Stabilizer)
**Danger:** Chronic disappointment vs chronic pressure
**Real-world:** "You expect too much" / "You give too little"

---

### BASELINE COLLAPSE

#### 40. Emotional Stability Baseline Divergence
**File:** `emotionalStabilityBaselineDivergence.js`
**Pattern:** Different resting emotional states (Stabilizer + OrderOriented vs FluidIdentity + Expressive)
**Danger:** One's calm is other's flat; one's alive is other's chaos
**Real-world:** Fundamentally different emotional home bases

---

### RESOLUTION COLLAPSE

#### 41. Emotional Attunement Resolution Gap
**File:** `emotionalAttunementResolutionGap.js`
**Pattern:** Different attunement precision (Relational + DepthOriented + Warm vs lower resolution)
**Danger:** One perceives nuances other misses entirely
**Real-world:** High-res vs low-res emotional perception

---

### CO-REGULATION COLLAPSE

#### 42. Emotional Co-Regulation Strategy Mismatch
**File:** `emotionalCoRegulationStrategyMismatch.js`
**Pattern:** Verbal soothers (Expressive + Relational) vs nonverbal/physical (Warm + Stabilizer - Expressive)
**Danger:** Mismatched soothing attempts fail
**Real-world:** Talking helps one, touch helps other

---

### THRESHOLD COLLAPSE

#### 43. Emotional Repair Threshold Mismatch
**File:** `emotionalRepairThresholdMismatch.js`
**Pattern:** Different repair urgency (Relational + Expressive vs Stabilizer + MindCentered)
**Danger:** One needs immediate repair, other needs space first
**Real-world:** "We need to talk NOW" / "I need time to think"

---

### MICRO-REPAIR COLLAPSE

#### 44. Emotional Micro-Repair Sensitivity Gap
**File:** `emotionalMicroRepairSensitivityGap.js`
**Pattern:** One detects micro-ruptures (Warm + Relational + DepthOriented) vs other only notices macro-breaks (Stabilizer + OrderOriented)
**Danger:** Small tears accumulate unnoticed until catastrophic
**Real-world:** "Everything was fine!" after partner files for divorce

---

### MEANING-MAKING COLLAPSE

#### 45. Emotional Meaning-Making Framework Divergence
**File:** `emotionalMeaningMakingFrameworkDivergence.js`
**Pattern:** Psychological framework (DepthOriented + Relational) vs moral framework (OrderOriented + BoundaryAware)
**Danger:** Different interpretive lenses create parallel realities
**Real-world:** "That's a trauma response" / "That's just wrong"

---

### COMPRESSION COLLAPSE

#### 46. Emotional Narrative Compression Mismatch
**File:** `emotionalNarrativeCompressionMismatch.js`
**Pattern:** High compression (MindCentered + OrderOriented) vs low compression (Expressive + Relational + DepthOriented)
**Danger:** One stores essence, other stores sequence
**Real-world:** "Get to the point" / "The details matter"

---

### TEMPORAL-ANCHOR COLLAPSE

#### 47. Emotional Temporal Anchoring Divergence
**File:** `emotionalTemporalAnchoringDivergence.js`
**Pattern:** Past-focused (DepthOriented) vs present-focused (MindCentered + Stabilizer) vs future-focused (Transpersonal + Initiator)
**Danger:** Partners emotionally live in different time zones
**Real-world:** "Stop living in the past" / "Stop ignoring our history"

---

### CONTEXT-SWITCH COLLAPSE

#### 48. Emotional Context-Switching Friction
**File:** `emotionalContextSwitchingFriction.js`
**Pattern:** Fast switchers (FluidIdentity + Initiator) vs slow switchers (Stabilizer + OrderOriented + BoundaryAware)
**Danger:** One transitions instantly, other needs decompression
**Real-world:** Work-to-home transition mismatch

---

### SIGNAL-NOISE COLLAPSE

#### 49. Emotional Signal-to-Noise Ratio Divergence
**File:** `emotionalSignalToNoiseRatioDivergence.js`
**Pattern:** High signal clarity (DepthOriented + Relational) vs high noise perception (MindCentered + Stabilizer)
**Danger:** One reads clear meaning, other sees ambiguity
**Real-world:** "What did you mean by that?" about everything

---

### MODULATION COLLAPSE

#### 50. Emotional Modulation Latency Gap
**File:** `emotionalModulationLatencyGap.js`
**Pattern:** Fast modulators (FluidIdentity + Expressive + Initiator) vs slow modulators (Stabilizer + OrderOriented + DepthOriented)
**Danger:** Different speeds of emotional intensity adjustment
**Real-world:** One calms instantly, other takes hours

---

## Usage

### Basic Usage

```javascript
import { SupernovaDetector } from './services/supernova';

const result = SupernovaDetector(profileA, profileB);

console.log(result);
// {
//   triggered: true,
//   count: 3,
//   severity: 'severe',
//   flags: ['anxious-avoidant-loop', 'emotional-labor-imbalance', 'repair-mismatch'],
//   totalPenalty: 0.38,
//   gradeCap: 'C-',
//   harmonyCap: 0.30,
//   detectors: [...],
//   interpretation: "Critical structural instabilities detected..."
// }
```

### Quick Check

```javascript
import { quickSupernovaCheck } from './services/supernova';

const hasSupernova = quickSupernovaCheck(profileA, profileB);
// Returns true if ANY detector triggers
```

### Individual Detector Analysis

```javascript
import { getDetectorAnalysis } from './services/supernova';

const analysis = getDetectorAnalysis(profileA, profileB);
// Returns detailed breakdown of all 50 detectors
```

---

## Integration Points

### Compatibility Scoring

The Supernova results integrate with the main compatibility engine:

1. **Penalty Application:** Total penalty reduces base compatibility score
2. **Grade Capping:** Supernova grade cap limits maximum achievable grade
3. **Harmony Capping:** Supernova harmony cap limits maximum harmony score
4. **Flag Display:** Detected patterns shown in compatibility report

### Real-World Application

As Brother Opus noted in design discussions:

> "A trained psychologist could indeed say 'Ah ha! Your marriage is showing Detector #44 - Emotional Micro-Repair Sensitivity Gap.' These aren't academic abstractions—they're clinically observable patterns that marriage counselors see daily."

**Clinical Mapping:**
- **Detector #4 (Anxious-Avoidant Loop)** → Attachment theory's classic "pursue-withdraw" pattern
- **Detector #13 (Emotional Labor Imbalance)** → Gender studies research on household emotional work
- **Detector #44 (Micro-Repair Sensitivity Gap)** → Gottman's research on relationship repair attempts

---

## Thresholds and Calibration

### Default Thresholds

```javascript
const PRIMARY_THRESHOLD = 0.65;    // Main trigger threshold
const AMPLIFIER_THRESHOLD = 0.55;  // Secondary condition threshold
```

### Severity Levels

| Severity | Penalty | Grade Cap | Harmony Cap |
|----------|---------|-----------|-------------|
| High     | 0.12    | C         | 0.40        |
| Severe   | 0.14    | C-        | 0.30        |

### Aggregation Rules

- Multiple detectors stack penalties
- Most restrictive grade cap wins
- Most restrictive harmony cap wins
- Severity escalates: 3+ triggers = 'severe' overall

---

## Future Expansion

The architecture supports:

1. **Detector Weighting:** Different weights for different relationship types
2. **Cultural Calibration:** Threshold adjustment for cultural contexts
3. **Temporal Analysis:** How supernova risk changes over relationship phases
4. **Intervention Mapping:** Specific therapeutic recommendations per detector

---

## Summary Table

| # | Detector | Collapse Type | Key Axes |
|---|----------|---------------|----------|
| 1 | Competing Dominance | Dominance | Initiator, Direct, RiskSeeking |
| 2 | Soft Boundary Empath | Attachment | Relational, Warm, BoundaryAware |
| 3 | Avoidant-Avoidant Freeze | Attachment | BoundaryAware, Relational, Expressive |
| 4 | Anxious-Avoidant Loop | Attachment | Relational, BoundaryAware |
| 5 | Fragile Idealist | Attachment | Transpersonal, DepthOriented, Stabilizer |
| 6 | Co-Dependency Loop | Attachment | Relational, Warm, BoundaryAware |
| 7 | Rigid Moralist | Moral/Order | OrderOriented, BoundaryAware, FluidIdentity |
| 8 | Chaotic-Chaotic Spiral | Entropy | FluidIdentity, RiskSeeking, Stabilizer |
| 9 | Covert-Covert Cold War | Covert | Direct, Expressive, MindCentered |
| 10 | Narcissistic Collapse | Narcissistic | Initiator, Direct, Relational, Warm |
| 11 | Hyper-Fusion Enmeshment | Fusion | Relational, Warm, BoundaryAware |
| 12 | Power-Caretaker Imbalance | Asymmetry | Initiator, Direct, Warm, Relational |
| 13 | Emotional Labor Imbalance | Asymmetry | Relational, Warm, Expressive, DepthOriented |
| 14 | Identity Erosion Loop | Identity | FluidIdentity, BoundaryAware, Initiator |
| 15 | Value System Divergence | Philosophical | Transpersonal, DepthOriented, OrderOriented |
| 16 | Life Trajectory Mismatch | Directional | Initiator, RiskSeeking, Stabilizer |
| 17 | Narrative Reality Split | Reality | MindCentered, DepthOriented, Expressive |
| 18 | Emotional Time Scale Mismatch | Temporal | FluidIdentity, DepthOriented, Stabilizer |
| 19 | Conflict Modality Incompatibility | Conflict | Direct, Expressive |
| 20 | Repair Strategy Mismatch | Conflict | Expressive, Relational, BoundaryAware |
| 21 | Emotional Bandwidth Asymmetry | Capacity | Expressive, Relational, DepthOriented |
| 22 | Emotional Availability Gap | Capacity | Relational, Warm, MindCentered |
| 23 | Emotional Reciprocity Deficit | Capacity | Relational, Warm, Expressive |
| 24 | Trust Formation Mismatch | Trust | Warm, Relational, BoundaryAware, MindCentered |
| 25 | Intimacy Gradient Mismatch | Intimacy | DepthOriented, Transpersonal, Relational |
| 26 | Autonomy-Closeness Equilibrium Break | Equilibrium | BoundaryAware, Initiator, Relational, Warm |
| 27 | Emotional Risk Tolerance Gap | Risk | RiskSeeking, Expressive, Stabilizer, BoundaryAware |
| 28 | Emotional Forecasting Mismatch | Forecasting | Stabilizer, MindCentered, FluidIdentity |
| 29 | Emotional Momentum Divergence | Momentum | Initiator, Expressive, Stabilizer |
| 30 | Emotional Saturation Threshold Clash | Saturation | DepthOriented, Expressive, MindCentered |
| 31 | Emotional Containment Capacity Gap | Containment | Stabilizer, DepthOriented, BoundaryAware |
| 32 | Emotional Signal Interpretation Drift | Interpretation | Relational, DepthOriented, MindCentered |
| 33 | Emotional Feedback Loop Inversion | Feedback | Expressive, Warm, MindCentered, BoundaryAware |
| 34 | Emotional Reciprocity Timing Offset | Timing | FluidIdentity, Initiator, Stabilizer |
| 35 | Emotional Priority Hierarchy Misalignment | Hierarchy | Relational, Warm, MindCentered, OrderOriented |
| 36 | Emotional Resource Allocation Imbalance | Allocation | Warm, Relational, Expressive |
| 37 | Emotional Boundary Elasticity Mismatch | Elasticity | BoundaryAware, OrderOriented, FluidIdentity |
| 38 | Emotional Safety Calibration Gap | Safety | Stabilizer, BoundaryAware, RiskSeeking |
| 39 | Emotional Expectation Load Imbalance | Load | Relational, DepthOriented, MindCentered |
| 40 | Emotional Stability Baseline Divergence | Baseline | Stabilizer, OrderOriented, FluidIdentity |
| 41 | Emotional Attunement Resolution Gap | Resolution | Relational, DepthOriented, Warm |
| 42 | Emotional Co-Regulation Strategy Mismatch | Co-Regulation | Expressive, Relational, Warm, Stabilizer |
| 43 | Emotional Repair Threshold Mismatch | Threshold | Relational, Expressive, Stabilizer, MindCentered |
| 44 | Emotional Micro-Repair Sensitivity Gap | Micro-Repair | Warm, Relational, DepthOriented, Stabilizer |
| 45 | Emotional Meaning-Making Framework Divergence | Meaning-Making | DepthOriented, Relational, OrderOriented |
| 46 | Emotional Narrative Compression Mismatch | Compression | MindCentered, OrderOriented, Expressive |
| 47 | Emotional Temporal Anchoring Divergence | Temporal-Anchor | DepthOriented, MindCentered, Transpersonal |
| 48 | Emotional Context-Switching Friction | Context-Switch | FluidIdentity, Initiator, Stabilizer |
| 49 | Emotional Signal-to-Noise Ratio Divergence | Signal-Noise | DepthOriented, Relational, MindCentered |
| 50 | Emotional Modulation Latency Gap | Modulation | FluidIdentity, Expressive, Stabilizer |

---

*"The Supernova Detection System doesn't judge relationships as 'good' or 'bad'—it identifies structural collision patterns that, left unaddressed, create unsustainable dynamics. Awareness is the first step toward conscious navigation."*

— Brother Opus, January 2026
