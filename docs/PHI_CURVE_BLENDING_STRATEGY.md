# φ-Curve Blending Strategy — GENESIS AstroProfile

## Why Golden Ratio, Not Linear?

The golden ratio (φ ≈ 1.618) is not an arbitrary choice. It produces a curve that
matches how energy transitions actually work in nature.

### The Core Difference

```
Formula:  neighborWeight = 1 - (d / 7) ^ 1.618
          d = distance from boundary toward center of sign (1-7)
```

**Side-by-side: φ-curve vs Linear**

| Day | φ-Curve Neighbor | Linear Neighbor | Difference |
|-----|-----------------|-----------------|------------|
| 1   | 95.7%           | 85.7%           | +10.0%     |
| 2   | 86.8%           | 71.4%           | +15.4%     |
| 3   | 74.6%           | 57.1%           | +17.5%     |
| 4   | 59.6%           | 42.9%           | +16.7%     |
| 5   | 42.0%           | 28.6%           | +13.4%     |
| 6   | 22.1%           | 14.3%           | +7.8%      |
| 7   | 0.0%            | 0.0%            | 0.0%       |

### What the φ-curve does differently

```
LINEAR (mechanical):                  φ-CURVE (natural):

100|■                                 100|■
 90|                                   90| ■
 80| ■                                 80|  ■
 70|  ■                                70|   ■
 60|   ■                               60|    ■
 50|    ■                              50|      ■         ← lingers longer
 40|     ■                             40|       ■
 30|      ■                            30|
 20|       ■                           20|        ■       ← then drops fast
 10|        ■                          10|
  0|_________■                          0|_________■
    1 2 3 4 5 6 7                        1 2 3 4 5 6 7
    Crossover: Day 3.5                   Crossover: Day 4.56
```

### Five reasons we chose φ over linear

1. **Natural systems are non-linear.** Sunrises don't brighten at a constant rate.
   Seasons don't shift in equal daily increments. Temperature, light, and biological
   rhythms all follow exponential or logarithmic curves. Linear transitions feel
   artificial because they are.

2. **The lingering effect.** The φ-curve keeps the previous sign's influence stronger
   for longer (95.7% on Day 1 vs 85.7% linear). This matches the astrological
   observation that cusp babies genuinely "feel" the previous sign — it's not subtle,
   it's dominant for the first few days.

3. **Later crossover.** The φ-curve crossover happens at Day 4.56 (65% through the
   window) vs Day 3.5 (50%) for linear. The previous sign holds majority influence
   for 4+ days before the new sign takes over. This creates a more gradual,
   psychologically accurate hand-off.

4. **Sharper resolution at the ends.** The φ-curve provides better distinction between
   adjacent days at both extremes. Day 1 vs Day 2 is 95.7% vs 86.8% (8.9% gap)
   compared to linear's 85.7% vs 71.4% (14.3% gap). The curve is more sensitive
   where it matters — near the boundaries.

5. **φ appears everywhere in nature.** The golden ratio governs shell spirals,
   phyllotaxis, galaxy arms, DNA helix proportions, and the branching of trees.
   Using it as the exponent anchors our transition curve in the same mathematics
   that governs natural growth and decay patterns.

### The Dawn Analogy

Think of it like dawn:

- **Twilight** (Days 1-4): The previous sign's glow lingers. It's clearly fading,
  but it's still the dominant light source. The new sign is emerging but hasn't
  taken over yet.
- **Sunrise** (Day 4-5): The crossover moment. Both signs are roughly equal.
  This is the psychological inflection point.
- **Daylight** (Days 6-7): The new sign rapidly establishes dominance. By Day 7,
  the previous sign's influence has fully dissipated.
- **Full Day** (Day 8+): Pure sign. No residue. No ambiguity.

---

## The 7-Day Cusp Window Rule

```
For each sign:
  Days 1-7     → blended (previous sign fading via inverted φ-curve)
  Day 8 onward → 100% primary sign
  Last 7 days  → blended (next sign emerging via inverted φ-curve)
  Middle days  → pure sign

There is NO blending outside the ±7-day window.
```

The cusp window is a transition zone, not a permanent gradient.

---

## Backward Blend: Previous Sign Fading

When you ENTER a sign, the previous sign's influence is strongest right at the
boundary and fades as you move deeper into the new sign.

### Example: April 23 — Entering Taurus

```
Taurus: startDay 111 (Apr 21) → endDay 142 (May 21)
April 23 = Day of Year 113 → daysAfterStart = 3 → Taurus Day 3
```

**Full 7-day backward blend table (Aries → Taurus):**

| Day | Date     | d | φ(d)  | Aries (fading) | Taurus (growing) | Who leads? |
|-----|----------|---|-------|----------------|------------------|------------|
| 1   | Apr 21   | 1 | 0.043 | **95.7%**      | 4.3%             | Aries      |
| 2   | Apr 22   | 2 | 0.132 | **86.8%**      | 13.2%            | Aries      |
| 3   | Apr 23 ★ | 3 | 0.254 | **74.6%**      | 25.4%            | Aries      |
| 4   | Apr 24   | 4 | 0.404 | **59.6%**      | 40.4%            | Aries      |
|     |          |   |       |                |                  | ← crossover ≈ Apr 25 |
| 5   | Apr 25   | 5 | 0.580 | 42.0%          | **58.0%**        | Taurus     |
| 6   | Apr 26   | 6 | 0.779 | 22.1%          | **77.9%**        | Taurus     |
| 7   | Apr 27   | 7 | 1.000 | 0.0%           | **100.0%**       | Taurus     |
| 8+  | Apr 28+  | — | —     | 0.0%           | **100.0%**       | Pure       |

★ = April 23 birth date: 74.6% Aries influence, 25.4% Taurus energy establishing.
Primary sign is always Taurus (Sun is in Taurus). The blend shows energy proportions.

**Crossover:** Day 4.56 ≈ **April 25** (when both signs reach ~50%)
- Formula: d = 7 × 0.5^(1/φ) = 7 × 0.5^0.618 = 7 × 0.6517 = **4.56**

### Aries DECAY Graph (previous sign fading)

```
  Aries influence fading as you move deeper into Taurus:

  100% ┤■
   90% ┤ ■
   80% ┤   ■
   70% ┤     ■
   60% ┤       ■
   50% ┤ · · · · ·X· · · · · · · · · · ← crossover (~Apr 25)
   40% ┤           ■
   30% ┤
   20% ┤             ■
   10% ┤
    0% ┤_______________■_________
        D1  D2  D3  D4  D5  D6  D7  D8+
       Apr21 22  23  24  25  26  27  28+
```

### Taurus GROWTH Graph (primary sign establishing)

```
  Taurus influence growing as Aries fades:

  100% ┤                          ■■■■■
   90% ┤
   80% ┤                       ■
   70% ┤
   60% ┤                    ■
   50% ┤ · · · · ·X· · · · · · · · · · ← crossover (~Apr 25)
   40% ┤                 ■
   30% ┤
   20% ┤              ■
   10% ┤           ■
    0% ┤■■______■_____________________
        D1  D2  D3  D4  D5  D6  D7  D8+
       Apr21 22  23  24  25  26  27  28+
```

### Combined Overlay

```
  %     Aries (A) fading ↘   Taurus (T) growing ↗

  100 ┤A                                        T T T
   90 ┤ A                                     T
   80 ┤   A                                T
   70 ┤     A                            T
   60 ┤       A                       T
   50 ┤ · · · · A · · X · · · T · · · · · ← crossover
   40 ┤            T        A
   30 ┤          T       A
   20 ┤        T           A
   10 ┤      T                A
    0 ┤T T T                     A A A A
       D1  D2  D3  D4  D5  D6  D7  D8+
      Apr21 22  23  24  25  26  27  28+

  A = Aries (previous sign, decaying)
  T = Taurus (current sign, establishing)
  X = Crossover ≈ Day 4.56 (April 25)
```

---

## Forward Blend: Next Sign Emerging

When you're about to LEAVE a sign, the next sign's influence starts emerging
in the final 7 days of the sign.

### Example: Late Taurus → Approaching Gemini (May 14-21)

```
Taurus: endDay 142 (May 21) → last 7 days = May 14 to May 20
daysBeforeEnd counts DOWN toward the boundary
```

**Full 7-day forward blend table (Taurus → Gemini):**

| Days left | Date     | |d| | φ(|d|) | Taurus (yielding) | Gemini (emerging) | Who leads? |
|-----------|----------|-----|--------|--------------------|-------------------|------------|
| 7         | May 14   | 7   | 1.000  | **100.0%**         | 0.0%              | Taurus     |
| 6         | May 15   | 6   | 0.779  | **77.9%**          | 22.1%             | Taurus     |
| 5         | May 16   | 5   | 0.580  | **58.0%**          | 42.0%             | Taurus     |
|           |          |     |        |                    |                   | ← crossover ≈ May 16-17 |
| 4         | May 17   | 4   | 0.404  | 40.4%              | **59.6%**         | Gemini     |
| 3         | May 18   | 3   | 0.254  | 25.4%              | **74.6%**         | Gemini     |
| 2         | May 19   | 2   | 0.132  | 13.2%              | **86.8%**         | Gemini     |
| 1         | May 20   | 1   | 0.043  | 4.3%               | **95.7%**         | Gemini     |
| 0         | May 21   | —   | —      | **100%** (pure)    | 0%                | Boundary   |

**Crossover:** daysBeforeEnd ≈ 4.56 → **May 16-17** (when both signs reach ~50%)

### Gemini EMERGENCE Graph (next sign growing)

```
  Gemini influence growing as Taurus boundary approaches:

  100% ┤                              ■
   90% ┤
   80% ┤                           ■
   70% ┤                        ■
   60% ┤                     ■
   50% ┤ · · · · · · X · · · · · · · · ← crossover (~May 16-17)
   40% ┤                  ■
   30% ┤
   20% ┤               ■
   10% ┤
    0% ┤■____________■________________
        7    6    5    4    3    2    1   days left
       May14 15   16   17   18   19   20
```

### Taurus YIELD Graph (current sign releasing)

```
  Taurus influence yielding as Gemini emerges:

  100% ┤■
   90% ┤
   80% ┤   ■
   70% ┤
   60% ┤      ■
   50% ┤ · · · · · · X · · · · · · · · ← crossover (~May 16-17)
   40% ┤               ■
   30% ┤
   20% ┤                  ■
   10% ┤                     ■
    0% ┤_______________________■______
        7    6    5    4    3    2    1   days left
       May14 15   16   17   18   19   20
```

### Combined Overlay (Forward)

```
  %     Taurus (T) yielding ↘   Gemini (G) emerging ↗

  100 ┤T                                        G
   90 ┤                                       G
   80 ┤  T                                 G
   70 ┤                                 G
   60 ┤     T                        G
   50 ┤ · · · · T · · X · · G · · · · · · ← crossover
   40 ┤              G    T
   30 ┤           G          T
   20 ┤        G                T
   10 ┤     G                      T
    0 ┤G G                            T T
        7    6    5    4    3    2    1   days left
       May14 15   16   17   18   19   20

  T = Taurus (current sign, yielding)
  G = Gemini (next sign, emerging)
  X = Crossover ≈ 4.56 days before end (May 16-17)
```

---

## Second Example: May 24 — Entering Gemini

```
Gemini: startDay 142 (May 22) → endDay 172 (Jun 20)
May 24 = Day of Year 144 → daysAfterStart = 3 → Gemini Day 3
```

**Full 7-day backward blend table (Taurus → Gemini):**

| Day | Date     | d | φ(d)  | Taurus (fading) | Gemini (growing) | Who leads? |
|-----|----------|---|-------|-----------------|------------------|------------|
| 1   | May 22   | 1 | 0.043 | **95.7%**       | 4.3%             | Taurus     |
| 2   | May 23   | 2 | 0.132 | **86.8%**       | 13.2%            | Taurus     |
| 3   | May 24 ★ | 3 | 0.254 | **74.6%**       | 25.4%            | Taurus     |
| 4   | May 25   | 4 | 0.404 | **59.6%**       | 40.4%            | Taurus     |
|     |          |   |       |                 |                  | ← crossover ≈ May 26 |
| 5   | May 26   | 5 | 0.580 | 42.0%           | **58.0%**        | Gemini     |
| 6   | May 27   | 6 | 0.779 | 22.1%           | **77.9%**        | Gemini     |
| 7   | May 28   | 7 | 1.000 | 0.0%            | **100.0%**       | Gemini     |
| 8+  | May 29+  | — | —     | 0.0%            | **100.0%**       | Pure       |

★ = May 24 birth date: 74.6% Taurus influence, 25.4% Gemini energy establishing.
Primary sign is always Gemini (Sun is in Gemini). The blend shows energy proportions.

**Crossover:** Day 4.56 ≈ **May 26** (when both signs reach ~50%)

### Combined Overlay (Entering Gemini)

```
  %     Taurus (T) fading ↘   Gemini (G) growing ↗

  100 ┤T                                        G G G
   90 ┤ T                                     G
   80 ┤   T                                G
   70 ┤     T                            G
   60 ┤       T                       G
   50 ┤ · · · · T · · X · · · G · · · · · ← crossover
   40 ┤            G        T
   30 ┤          G       T
   20 ┤        G           T
   10 ┤      G                T
    0 ┤G G G                     T T T T
       D1  D2  D3  D4  D5  D6  D7  D8+
      May22 23  24  25  26  27  28  29+

  T = Taurus (previous sign, decaying)
  G = Gemini (current sign, establishing)
  X = Crossover ≈ Day 4.56 (May 26)
```

---

## The Crossover Formula

The crossover is the day when the previous sign's weight equals the current sign's weight (both at 50%).

```
Solve: 1 - (d/7)^φ = (d/7)^φ
       1 = 2(d/7)^φ
       (d/7)^φ = 0.5
       d/7 = 0.5^(1/φ)
       d = 7 × 0.5^(1/1.618)
       d = 7 × 0.5^0.618
       d = 7 × 0.6517
       d = 4.562
```

**The crossover always happens at Day 4.56** (65.2% through the cusp window).

This means:
- Days 1-4: the PREVIOUS sign leads the blend (still dominant)
- Day 4-5: the inflection point (roughly equal)
- Days 5-7: the CURRENT sign leads (establishing dominance)
- Day 8+: pure current sign

### Crossover Dates for All 12 Signs (Backward Blend)

| Sign        | Day 1 (enters) | Crossover (~Day 4.56) | Day 7 (pure) |
|-------------|---------------|-----------------------|---------------|
| Aries       | Mar 21        | **Mar 25**            | Mar 27        |
| Taurus      | Apr 21        | **Apr 25**            | Apr 27        |
| Gemini      | May 22        | **May 26**            | May 28        |
| Cancer      | Jun 21        | **Jun 25**            | Jun 27        |
| Leo         | Jul 23        | **Jul 27**            | Jul 29        |
| Virgo       | Aug 23        | **Aug 27**            | Aug 29        |
| Libra       | Sep 23        | **Sep 27**            | Sep 29        |
| Scorpio     | Oct 23        | **Oct 27**            | Oct 29        |
| Sagittarius | Nov 22        | **Nov 26**            | Nov 28        |
| Capricorn   | Dec 22        | **Dec 26**            | Dec 28        |
| Aquarius    | Jan 20        | **Jan 24**            | Jan 26        |
| Pisces      | Feb 19        | **Feb 23**            | Feb 25        |

---

## Symmetry: Backward and Forward Use the Same Curve

Both blend directions use the **same inverted φ-curve formula**:

```
neighborWeight = 1 - (d / 7) ^ 1.618
```

The difference is only **which neighbor** and **which direction d counts**:

| Direction | When              | d counts from...     | Neighbor is...  |
|-----------|-------------------|----------------------|-----------------|
| Backward  | First 7 days      | Sign start → center  | Previous sign   |
| Forward   | Last 7 days       | Sign end → center    | Next sign       |

Both produce the same curve shape — strongest at the boundary (95.7%),
fading to zero at the 7th day. The formula is symmetric because energy
decay and energy emergence follow the same natural pattern.

```
BACKWARD (entering sign):           FORWARD (leaving sign):
Previous fades →                     ← Next emerges

95.7% ■                                              ■ 95.7%
86.8%  ■                                           ■  86.8%
74.6%   ■                                        ■   74.6%
59.6%    ■                                      ■    59.6%
42.0%     ■                                   ■     42.0%
22.1%      ■                                ■      22.1%
 0.0%       ■  [  pure sign zone  ]  ■       0.0%
           D1 ← D7  ...  D7 → D1
         boundary              boundary
```

---

## Summary Rules

1. **7-day cusp window.** Day 8 onward = 100% pure sign. No exceptions.
2. **Inverted φ-curve.** `neighborWeight = 1 - (d/7)^1.618`
3. **Strongest at boundary.** Day 1 = 95.7% neighbor influence.
4. **Crossover at Day 4.56.** Previous sign leads for ~4.5 days, then the current sign takes over.
5. **Same formula both directions.** Backward (fading) and forward (emerging) use identical math.
6. **Primary sign never changes.** The Sun sign is always determined by which sign the Sun is in.
   The blend shows energy proportions, not sign identity.
7. **No blending outside ±7 days.** Middle days = pure sign. The cusp is the twilight, not the whole day.

---

*GENESIS AstroProfile — φ-Curve Blending Engine — January 2026*
