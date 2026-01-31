# GENESIS Tropical Seasons Wheel - Tooltip Implementation Guide

## Purpose
This document provides production-ready tooltip copy for the Tropical Seasons wheel, organized by ring layer (outside → inside) to match the user's visual journey.

---

## 🎯 OUTERMOST RING: BEGINNING · CORE · TRANSITION (Modality Tooltips)

### ▶️ BEGINNING (Cardinal)
**Header:** BEGINNING (Cardinal)

**Body:**
Initiates movement. Energized by starting, leading, and activating change. Thrives when something new begins.

**Strength:** Momentum · Leadership  
**Challenge:** Finishing what's started  
**Signs:** Aries · Cancer · Libra · Capricorn

---

### ⏺ CORE (Fixed)
**Header:** CORE (Fixed)

**Body:**
Sustains momentum. Energized by consistency, mastery, and endurance. Thrives when maintaining and strengthening.

**Strength:** Loyalty · Stability  
**Challenge:** Letting go or adapting  
**Signs:** Taurus · Leo · Scorpio · Aquarius

---

### 🔄 TRANSITION (Mutable)
**Header:** TRANSITION (Mutable)

**Body:**
Adapts and bridges. Energized by flexibility, learning, and change. Thrives when adjusting and connecting phases.

**Strength:** Versatility · Insight  
**Challenge:** Grounding and focus  
**Signs:** Gemini · Virgo · Sagittarius · Pisces

---

## 🔥🌿⚡💧 MIDDLE RING: ELEMENTS (Fuel Type Tooltips)

### 🔥 FIRE
**Header:** Fire — Energy of Inspiration

**Body:**
Acts through passion and will. Motivated by excitement, purpose, and momentum. Needs action to feel alive.

**Drives:** Action · Courage · Enthusiasm  
**Signs:** Aries · Leo · Sagittarius

---

### 🌿 EARTH
**Header:** Earth — Energy of Manifestation

**Body:**
Acts through results and stability. Motivated by security, usefulness, and tangible progress. Needs structure to feel safe.

**Drives:** Building · Practicality · Reliability  
**Signs:** Taurus · Virgo · Capricorn

---

### ⚡ AIR
**Header:** Air — Energy of Connection

**Body:**
Acts through thought and communication. Motivated by ideas, dialogue, and understanding. Needs mental stimulation to thrive.

**Drives:** Thinking · Relating · Innovating  
**Signs:** Gemini · Libra · Aquarius

---

### 💧 WATER
**Header:** Water — Energy of Emotion

**Body:**
Acts through feeling and intuition. Motivated by emotional depth, bonding, and meaning. Needs connection to feel whole.

**Drives:** Sensitivity · Empathy · Intuition  
**Signs:** Cancer · Scorpio · Pisces

---

## ♈→♓ INNER RING: THE 12 ZODIAC SIGNS

### ♈ ARIES
**Header:** Aries — Spring Equinox · Fire · Beginning

**Body:**
Initiates growth. Born as light begins increasing. Acts first, leads instinctively, thrives on momentum and new beginnings.

---

### ♉ TAURUS
**Header:** Taurus — Mid-Spring · Earth · Core

**Body:**
Stabilizes growth. Born when life is flourishing. Builds security, values comfort, and makes progress tangible and lasting.

---

### ♊ GEMINI
**Header:** Gemini — Late Spring · Air · Transition

**Body:**
Connects and adapts. Born as spring shifts toward summer. Learns quickly, communicates ideas, and bridges people and information.

---

### ♋ CANCER
**Header:** Cancer — Summer Solstice · Water · Beginning

**Body:**
Protects what has grown. Born at peak light. Nurtures emotionally, values home and memory, and creates safety through care.

---

### ♌ LEO
**Header:** Leo — Mid-Summer · Fire · Core

**Body:**
Expresses vitality. Born during full radiance. Leads through warmth, creativity, and confidence; shines by being fully authentic.

---

### ♍ VIRGO
**Header:** Virgo — Late Summer · Earth · Transition

**Body:**
Refines and improves. Born as harvest approaches. Analyzes, organizes, and turns growth into usefulness and service.

---

### ♎ LIBRA
**Header:** Libra — Autumn Equinox · Air · Beginning

**Body:**
Initiates balance. Born at equal light and dark. Seeks harmony, fairness, and partnership; understands life through relationships.

---

### ♏ SCORPIO
**Header:** Scorpio — Mid-Autumn · Water · Core

**Body:**
Deepens and transforms. Born as days darken. Forms intense bonds, uncovers truth, and catalyzes emotional rebirth.

---

### ♐ SAGITTARIUS
**Header:** Sagittarius — Late Autumn · Fire · Transition

**Body:**
Expands perspective. Born as autumn gives way to winter. Explores meaning, seeks truth, and looks beyond current limits.

---

### ♑ CAPRICORN
**Header:** Capricorn — Winter Solstice · Earth · Beginning

**Body:**
Builds structure. Born at deepest darkness. Values discipline, responsibility, and long-term achievement to ensure survival.

---

### ♒ AQUARIUS
**Header:** Aquarius — Mid-Winter · Air · Core

**Body:**
Sustains vision. Born in winter's clarity. Thinks independently, challenges norms, and commits to collective progress.

---

### ♓ PISCES
**Header:** Pisces — Late Winter · Water · Transition

**Body:**
Dissolves and unifies. Born as the cycle ends. Feels deeply, merges boundaries, and prepares the way for renewal.

---

## 🧭 MICRO-LEGEND (Essential Context)

**Placement:** Bottom of wheel, subtle but visible

**Copy:**
```
Season = psychological imprint · Element = how energy expresses · Mode = how energy moves
```

**Alternative (if space is tight):**
```
Season = when · Element = how · Mode = movement
```

---

## 💎 EQUINOX & SOLSTICE MARKERS (Diamond Labels)

### ♈ SPRING EQUINOX (0° / Top)
**Primary Label:** Spring Equinox  
**Subtitle:** Birth of Light  
**Marker Color:** Green diamond

**Tooltip (if hoverable):**
March 20-21. Day = Night → Growth begins.  
Initiation · Courage · Emergence

---

### ♋ SUMMER SOLSTICE (90° / Right)
**Primary Label:** Summer Solstice  
**Subtitle:** Peak Light  
**Marker Color:** Yellow diamond

**Tooltip (if hoverable):**
June 20-21. Longest day → Protect what has grown.  
Nurture · Safety · Emotional bonding

---

### ♎ AUTUMN EQUINOX (180° / Bottom)
**Primary Label:** Autumn Equinox  
**Subtitle:** Balance Point  
**Marker Color:** Orange diamond

**Tooltip (if hoverable):**
September 22-23. Day = Night → Awareness of the Other.  
Partnership · Fairness · Reciprocity

---

### ♑ WINTER SOLSTICE (270° / Left)
**Primary Label:** Winter Solstice  
**Subtitle:** Rebirth of Light  
**Marker Color:** Silver diamond

**Tooltip (if hoverable):**
December 21-22. Darkest day → Structure ensures survival.  
Discipline · Responsibility · Legacy

---

## 📐 IMPLEMENTATION NOTES

### Tooltip Trigger Behavior
- **Desktop:** Hover over any sign/element/modality zone
- **Mobile:** Tap to reveal, tap outside to dismiss
- **Animation:** 200ms fade-in, slight upward slide (8px)
- **Positioning:** Auto-position to avoid screen edges

### Visual Styling
```css
.tooltip {
  background: rgba(15, 23, 42, 0.95); /* Dark navy with slight transparency */
  border: 1px solid rgba(148, 163, 184, 0.3); /* Subtle silver border */
  border-radius: 8px;
  padding: 12px 16px;
  max-width: 280px;
  font-size: 14px;
  line-height: 1.5;
  color: #e2e8f0; /* Light slate text */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.tooltip-header {
  font-weight: 600;
  color: #f1f5f9; /* Almost white */
  margin-bottom: 8px;
  font-size: 15px;
}

.tooltip-metadata {
  color: #94a3b8; /* Muted silver for drives/strengths */
  font-size: 13px;
  margin-top: 8px;
}
```

### Accessibility
- **ARIA Labels:** All tooltip triggers should have `aria-describedby` pointing to tooltip content
- **Keyboard Navigation:** Tooltips should appear on focus for keyboard users
- **Screen Readers:** Ensure tooltip content is readable by screen readers
- **Contrast Ratio:** Maintain WCAG AA compliance (4.5:1 minimum)

### Performance Considerations
- Lazy-load tooltip content (don't render all 12+ tooltips at once)
- Use CSS transforms for positioning (GPU-accelerated)
- Debounce hover events (100ms delay before showing)
- Implement virtual positioning for better performance

---

## 🎯 QUALITY CHECKLIST

Before shipping tooltips, verify:

- [ ] All 12 zodiac sign tooltips are present and accurate
- [ ] All 4 element tooltips match their visual color coding
- [ ] All 3 modality tooltips explain the movement pattern clearly
- [ ] Equinox/Solstice markers have appropriate labels
- [ ] Micro-legend is visible and comprehensible
- [ ] Tooltips don't overlap or clip at screen edges
- [ ] Mobile tooltips are tap-friendly (minimum 44x44px touch target)
- [ ] Tooltip animation is smooth and not jarring
- [ ] All copy is proofread for typos and consistency
- [ ] Accessibility features are implemented and tested

---

## 📝 COPY PHILOSOPHY

These tooltips follow four core principles:

1. **Season First:** Always anchor to the seasonal context (Spring Equinox, Mid-Summer, etc.)
2. **Psychological Truth:** Explain WHY the sign behaves this way based on environmental imprint
3. **Practical Insight:** Give users something they can recognize in themselves or others
4. **Consistent Structure:** Every tooltip follows the same pattern for scanability

This is **constitutional psychology**, not pop astrology.

---

## 🌟 THE DEFINING INSIGHT

> "In Tropical Astrology, personality is shaped by the season of light you were born into."

This single sentence should appear somewhere prominent in your UI (perhaps on the initial loading screen or as a subtle header above the wheel). It positions GENESIS as **civilization infrastructure for human connection**, not another astrology app.

---

## 📦 QUICK REFERENCE: ALL TOOLTIPS AT A GLANCE

| **Sign** | **Season Phase** | **Element** | **Mode** | **Core Drive** |
|----------|-----------------|-------------|----------|----------------|
| Aries | Spring Equinox | Fire | Beginning | Initiates growth |
| Taurus | Mid-Spring | Earth | Core | Stabilizes growth |
| Gemini | Late Spring | Air | Transition | Connects and adapts |
| Cancer | Summer Solstice | Water | Beginning | Protects what has grown |
| Leo | Mid-Summer | Fire | Core | Expresses vitality |
| Virgo | Late Summer | Earth | Transition | Refines and improves |
| Libra | Autumn Equinox | Air | Beginning | Initiates balance |
| Scorpio | Mid-Autumn | Water | Core | Deepens and transforms |
| Sagittarius | Late Autumn | Fire | Transition | Expands perspective |
| Capricorn | Winter Solstice | Earth | Beginning | Builds structure |
| Aquarius | Mid-Winter | Air | Core | Sustains vision |
| Pisces | Late Winter | Water | Transition | Dissolves and unifies |

---

## 🚀 DEPLOYMENT STRATEGY

### Phase 1: Core Signs (Ship This Week)
- Implement tooltips for the 12 zodiac signs (inner ring)
- Add micro-legend at bottom of wheel
- Test on desktop and mobile

### Phase 2: Educational Layers (Next Sprint)
- Add element tooltips (middle ring)
- Add modality tooltips (outer ring)
- Implement Equinox/Solstice marker hover states

### Phase 3: Polish & Optimization (Following Sprint)
- Smooth animation timing
- Accessibility audit and fixes
- Performance optimization for mobile
- User testing and iteration

---

## 💡 FUTURE ENHANCEMENTS

Once core tooltips are stable, consider:

- **Interactive Tutorial Mode:** Guide new users through the wheel layer by layer
- **"Learn More" Links:** Deep-link from tooltips to full educational content
- **Comparative Tooltips:** Show how two signs interact when in Compare mode
- **Animated Seasonal Transitions:** Visualize how seasons flow into each other
- **Audio Descriptions:** For accessibility, consider audio explanations of each sign

---

*Created for Project GENESIS: "Don't date blind. Date soul-first."*  
*Constitutional compatibility is mathematically calculable. Love is discoverable through understanding.*

**This is 200-year civilization infrastructure.**