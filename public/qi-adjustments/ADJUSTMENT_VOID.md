# Void / Emptiness (空亡) — Kong Wang

In the 60-year Jiazi cycle, every 10-day period (旬) uses 10 of the 12 Earthly
Branches. The 2 branches NOT used in the current decade are considered **void**.

---

## How Void Is Calculated

The Day Pillar determines which 旬 (decade) you belong to.

| Decade (旬) | Starts At | Void Branches |
|-------------|-----------|---------------|
| 甲子旬 | 甲子 | 戌, 亥 |
| 甲戌旬 | 甲戌 | 申, 酉 |
| 甲申旬 | 甲申 | 午, 未 |
| 甲午旬 | 甲午 | 辰, 巳 |
| 甲辰旬 | 甲辰 | 寅, 卯 |
| 甲寅旬 | 甲寅 | 子, 丑 |

Formula:
```
stemIdx     = Day Stem's position (0–9)
branchIdx   = Day Branch's position (0–11)
startBranch = (branchIdx - stemIdx + 12) % 12
void1       = (startBranch + 10) % 12
void2       = (startBranch + 11) % 12
```

---

## What Happens When a Branch Is Void

- **Qi contribution weakened** — reduced by ~12%
- **Cannot fully combine** — Liu He, San He, San Hui involving void branches are blocked
- **Cannot fully clash** — clashes involving void branches are softened
- **Hidden stems operate at reduced capacity**

---

## Why Void Matters

Void explains why certain interactions that "should" happen on paper don't
fully manifest in practice. A void branch is like a sleeping partner — present
in the chart but not fully participating.

Professional BaZi practitioners always check void status before reading
combinations and clashes. A chart with key branches void will behave very
differently from one with active branches.

---

## Pipeline Position

```
NTFQ → [Void (空亡)] → Combinations (合化) → Clash (克) → Sheng → ...
```

Void runs FIRST — before all other adjustments — because it determines which
branches can participate in combinations and clashes.

---

## Configurable Thresholds

| Parameter | Default | Description |
|-----------|---------|-------------|
| Void reduction factor | 12% | How much Qi is lost per void branch |

---

## The Car Metaphor

Two of your engine cylinders are **dormant** — they have spark plugs but aren't
firing at full capacity. The engine still runs, but those cylinders contribute
much less power. When another car (transit pillar) tries to "clash" with your
dormant cylinders, the collision is softer because there's less to hit.
