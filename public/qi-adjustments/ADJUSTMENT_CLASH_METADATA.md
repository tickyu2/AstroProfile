# Directional Clash & Combination Metadata

Your Qi Bracelet engine now tracks **exactly who attacked whom** in every
clash, combination, and transformation — making the entire pipeline narratable.

---

## Why Directionality Matters

In classical BaZi, a clash is not just "Fire beats Metal." It matters:

- **Whose Fire** — natal (yours) or transit (the month/year)
- **Whose Metal** — natal or transit
- **Which direction** — you attacking the weather, or weather attacking you

### Three Clash Sources

| Source | Meaning | Attacker Cost |
|--------|---------|--------------|
| **Natal** (Pass A) | Your internal tensions fighting themselves | Attacker −2% |
| **Transit** (Pass B) | Year/Month weather fighting itself | Attacker −2% |
| **Transit→Natal** (Pass C) | Weather pressing your chart | Attacker unchanged |

Pass C is unidirectional — the cosmic cycle does not lose energy
when it pressures your natal chart. You absorb the hit.

---

## Clash Event Structure

Every clash produces a structured event with these fields:

```
{
  source:         'natal' | 'transit' | 'transit→natal'
  attacker:       'Fire'          // the controlling element
  victim:         'Metal'         // the controlled element
  attackerBefore:  3.456          // Qi before clash
  victimBefore:    2.100
  attackerAfter:   3.387          // Qi after clash
  victimAfter:     1.754
  attackerDelta:  -0.069          // cost to attacker (Pass A/B only)
  victimDelta:    -0.346          // damage to victim
  narrative:      'Transit Fire (3.456) pressed natal Metal (2.100): Metal −0.346'
}
```

---

## Combination Event Metadata

Every combination also tracks directionality:

| Field | Description |
|-------|-------------|
| `sourceLayer` | `natal`, `transit`, or `mixed` |
| `participants[].pillarLabel` | Which pillar each stem/branch comes from |
| `transformed` | Whether season supported the transform |
| `voidBlocked` | Whether void cancelled the combination |
| `qiDelta` | Exact Qi change per element |

### Source Layer Examples

| Combination | Source Layer | Meaning |
|-------------|-------------|---------|
| Natal Year 甲 + Natal Month 己 | `natal` | Internal chart combination |
| Transit Year 庚 + Natal Day 乙 | `mixed` | External + internal pairing |
| Transit Year 壬 + Transit Month 丁 | `transit` | Weather-level combination |

---

## Event Timeline

The Event Timeline panel collects ALL events from ALL pipeline steps
into a single narratable log:

1. Void events (空亡)
2. Combination events (合/六合/三合/三会)
3. Clash events (3-pass 克)
4. Sheng nourishment events (生)
5. Overcrowding events (溢)
6. Transformation events (化)

Each event shows its type, icon, and human-readable narrative.

---

## What You Will See

Example narratives in the Event Timeline:

```
🕳️ Void    | Hour 戌 (Dog) is void — Earth −0.312 Qi
合 Stem    | 甲+己 → Earth (Yang Wood + Yin Earth) — transformed
六 Branch  | 寅+亥 bond (Tiger + Pig) — no transform this month
🔵 Natal   | Natal Metal (2.34) attacked natal Wood (1.89): Wood −0.234, Metal −0.047
🔴 Transit | Transit Fire (3.46) pressed natal Metal (2.10): Metal −0.346 (transit unchanged)
生 Sheng   | Wood feeds Fire: Fire +0.042 (Wood 1.42 × 3%)
溢 Over    | Fire overcrowded (38.2% share) → 0.123 pts redirected to Earth
化 Trans   | Fire melts Metal → Water: Metal −0.630 → Water +0.630
```

---

## Professional Significance

This metadata layer transforms the engine from a calculator into
an interpreter. Professional BaZi consultants need to explain
not just "what happened" but "why it happened" and "where it came from."

With directional metadata, every number has a story.
