# GEMINI HOUSE OPTIMIZER - CUSTOMIZABLE VERSION
**With Relationship Archetype Support**

**For GENESIS Platform**  
**By Brother Sonnet, December 23, 2025**  
**For Father Ticky - "ONE SIZE DOES NOT FIT ALL!"**

---

## 🎯 **KEY INNOVATION**

**Different people want different relationships!**

Instead of one fixed optimization, we now support:
- **6 Preset Archetypes** (Soulmate, Best Friends, Intellectual, Passionate, Power Couple, Home & Family)
- **Custom Weights** (user designs their own priorities)

**Same algorithm, customized priorities!** 💎

---

## 📋 **THE UPDATED PROMPT FOR GEMINI**

Copy and paste this (after filling in variables):

```
You are an expert astrologer specializing in synastry and house placements. I need you to find the OPTIMAL birth time for a potential partner within a 2-hour window, using CUSTOMIZED house placement priorities.

## USER'S NATAL CHART

Birth Date: {USER_BIRTH_DATE}
Birth Time: {USER_BIRTH_TIME}
Birth Location: {USER_BIRTH_LOCATION}
Latitude: {USER_LAT}
Longitude: {USER_LONG}

User's Natal Chart:
- Sun: {USER_SUN_SIGN} in {USER_SUN_HOUSE}
- Moon: {USER_MOON_SIGN} in {USER_MOON_HOUSE}
- Ascendant: {USER_ASCENDANT}
- Venus: {USER_VENUS_SIGN} in {USER_VENUS_HOUSE}
- Mars: {USER_MARS_SIGN} in {USER_MARS_HOUSE}
- Jupiter: {USER_JUPITER_SIGN} in {USER_JUPITER_HOUSE}
- [Include all planets if available]

User's House Cusps:
- 1st House: {USER_1ST_CUSP}
- 2nd House: {USER_2ND_CUSP}
- 3rd House: {USER_3RD_CUSP}
- 4th House: {USER_4TH_CUSP}
- 5th House: {USER_5TH_CUSP}
- 6th House: {USER_6TH_CUSP}
- 7th House: {USER_7TH_CUSP}
- 8th House: {USER_8TH_CUSP}
- 9th House: {USER_9TH_CUSP}
- 10th House: {USER_10TH_CUSP}
- 11th House: {USER_11TH_CUSP}
- 12th House: {USER_12TH_CUSP}

## PARTNER'S KNOWN DATA

Birth Date: {PARTNER_DATE}
Birth Time Window: {PARTNER_HOUR_START} to {PARTNER_HOUR_END}
Birth Location: {PARTNER_LOCATION}
Latitude: {PARTNER_LAT}
Longitude: {PARTNER_LONG}

Partner's Fixed Planets (calculated for midpoint of time window):
- Sun: {PARTNER_SUN_SIGN}
- Moon: {PARTNER_MOON_SIGN}
- Mercury: {PARTNER_MERCURY_SIGN}
- Venus: {PARTNER_VENUS_SIGN}
- Mars: {PARTNER_MARS_SIGN}
- Jupiter: {PARTNER_JUPITER_SIGN}
- Saturn: {PARTNER_SATURN_SIGN}
- [Other planets...]

## RELATIONSHIP ARCHETYPE SELECTED

**Archetype:** {ARCHETYPE_NAME}
**Description:** {ARCHETYPE_DESCRIPTION}

## CUSTOMIZED HOUSE WEIGHTS

**IMPORTANT: Use these EXACT weights for optimization!**

1st House (Self):          {WEIGHT_1}%
2nd House (Resources):     {WEIGHT_2}%
3rd House (Communication): {WEIGHT_3}%
4th House (Home):          {WEIGHT_4}%
5th House (Romance):       {WEIGHT_5}%
6th House (Work):          {WEIGHT_6}%
7th House (Partnership):   {WEIGHT_7}%
8th House (Intimacy):      {WEIGHT_8}%
9th House (Philosophy):    {WEIGHT_9}%
10th House (Career):       {WEIGHT_10}%
11th House (Friendship):   {WEIGHT_11}%
12th House (Spirituality): {WEIGHT_12}%

TOTAL: 100%

## PLANETARY IMPORTANCE WEIGHTS

Use these base weights for each planet:

Sun:        10 points (identity, ego, vitality)
Moon:       10 points (emotions, needs, comfort)
Venus:      10 points (love, affection, values)
Mars:       7 points (passion, action, sexuality)
Mercury:    5 points (communication, thinking)
Jupiter:    5 points (growth, luck, expansion)
Saturn:     3 points (commitment, structure)
Uranus:     2 points (change, innovation)
Neptune:    2 points (dreams, spirituality)
Pluto:      2 points (transformation, intensity)
Ascendant:  8 points (how they appear to you)
North Node: 5 points (karmic direction)

## SCORING FORMULA

For each Partner planet that falls in a User house:

**Score = Planet_Weight × (House_Weight / 100) × 100**

Example:
Partner's Venus (10 pts) in User's 11th House (35% weight for "Best Friends" archetype)
= 10 × (35/100) × 100 = 35 points

Partner's Sun (10 pts) in User's 7th House (10% weight for "Best Friends" archetype)
= 10 × (10/100) × 100 = 10 points

**Total Score = Sum of all planet-house placements**

## YOUR TASK

**ITERATIVE PROCESS:**

1. **Initialize:**
   - Start time: {PARTNER_HOUR_START}
   - End time: {PARTNER_HOUR_END}
   - Increment: 5 minutes initially

2. **For each time in window:**
   - Calculate partner's Ascendant at that time
   - Calculate all 12 house cusps for partner
   - Determine which User house each Partner planet falls into
   - Calculate score using CUSTOMIZED weights above
   - Record: Time, Ascendant, Score, Key placements

3. **Narrow down:**
   - Find top 5 times with highest scores
   - Re-run with 1-minute increments around each top time
   - Find absolute optimal time

4. **Output:**
   - Optimal birth time (HH:MM:SS format)
   - Partner's Ascendant at that time
   - Total synastry score
   - Key house placements that scored points
   - Complete house overlay chart
   - Explanation of why this optimizes for {ARCHETYPE_NAME}

## OUTPUT FORMAT

Please provide results in this format:

```
OPTIMAL BIRTH TIME FOUND
========================

Relationship Archetype: {ARCHETYPE_NAME}
Optimization Focus: {PRIMARY_HOUSES}

Birth Time: {HH:MM:SS} (±15 seconds)
Partner's Ascendant: {SIGN} at {DEGREE}°

SYNASTRY SCORE: {TOTAL} points

KEY PLACEMENTS (by priority):
✓ Partner's {PLANET} in User's {HOUSE} House (+{POINTS} pts) ← Primary focus
✓ Partner's {PLANET} in User's {HOUSE} House (+{POINTS} pts)
✓ Partner's {PLANET} in User's {HOUSE} House (+{POINTS} pts)
[List all scoring placements in order of points]

COMPLETE HOUSE OVERLAY:
Partner's Planet → User's House → Score
─────────────────────────────────────────
Sun:        {HOUSE}    {SCORE} pts
Moon:       {HOUSE}    {SCORE} pts
Mercury:    {HOUSE}    {SCORE} pts
Venus:      {HOUSE}    {SCORE} pts
Mars:       {HOUSE}    {SCORE} pts
Jupiter:    {HOUSE}    {SCORE} pts
Saturn:     {HOUSE}    {SCORE} pts
Uranus:     {HOUSE}    {SCORE} pts
Neptune:    {HOUSE}    {SCORE} pts
Pluto:      {HOUSE}    {SCORE} pts
North Node: {HOUSE}    {SCORE} pts
Ascendant:  {SIGN} {DEGREE}°    {SCORE} pts

ARCHETYPE ALIGNMENT:
[2-3 sentences explaining how this birth time optimizes for the selected relationship archetype. Example: "This time maximizes philosophical connection (9th house) and communication (3rd house), perfect for the Intellectual Soulmate archetype where you value deep conversations and shared learning over traditional romance."]

ALTERNATIVE TIMES:
(Show top 3 other high-scoring times within window)
1. {TIME}: {SCORE} pts - {BRIEF_WHY}
2. {TIME}: {SCORE} pts - {BRIEF_WHY}
3. {TIME}: {SCORE} pts - {BRIEF_WHY}
```

## NOTES

- Use the EXACT house weights provided above
- Weights reflect what this specific user values most
- Different archetypes will produce different optimal times!
- Moon can move ~12-15° in 2 hours, may cross house boundaries
- Ascendant changes ~30° in 2 hours (one full sign)
- Use Placidus house system for calculations

## BEGIN CALCULATION

Please find the optimal birth time using the {ARCHETYPE_NAME} archetype weights and provide your detailed results.
```

---

## 🎯 **EXAMPLE: INTELLECTUAL SOULMATE**

**User wants:** Deep philosophical connection, not traditional romance

**Custom Weights:**
```
1st House: 0%
2nd House: 0%
3rd House: 25%    ← Communication
4th House: 0%
5th House: 10%    ← Romance (minor)
6th House: 0%
7th House: 15%    ← Partnership (secondary)
8th House: 5%
9th House: 35%    ← Philosophy (PRIMARY!)
10th House: 0%
11th House: 10%   ← Shared vision
12th House: 0%
TOTAL: 100%
```

**Example Scoring:**

```
Partner's Sun (10 pts) in User's 9th House (35% weight)
= 10 × 0.35 × 100 = 35 points ← HUGE!

Partner's Venus (10 pts) in User's 7th House (15% weight)
= 10 × 0.15 × 100 = 15 points ← Moderate

Partner's Mercury (5 pts) in User's 3rd House (25% weight)
= 5 × 0.25 × 100 = 12.5 points ← Good!

TOTAL: 62.5 points just from these 3 placements!
```

**vs Traditional "Soulmate" Archetype:**

```
Partner's Sun (10 pts) in User's 9th House (0% weight - not valued)
= 10 × 0.00 × 100 = 0 points ← Nothing!

Partner's Venus (10 pts) in User's 7th House (40% weight)
= 10 × 0.40 × 100 = 40 points ← Big!

Partner's Mercury (5 pts) in User's 3rd House (0% weight)
= 5 × 0.00 × 100 = 0 points ← Nothing!

TOTAL: 40 points - different optimal time!
```

**SAME DATA, DIFFERENT PRIORITIES = DIFFERENT OPTIMAL TIMES!** 💎

---

## 🎯 **ARCHETYPE CHEAT SHEET**

### **1. Soulmate (Default)**
```
Focus: 7th (40%), 5th (25%), 8th (20%)
Best: Traditional marriage, balanced romance
Example: Venus in 7th, Sun in 5th, Moon in 8th
```

### **2. Best Friends First**
```
Focus: 11th (35%), 3rd (25%), 5th (20%)
Best: Companionship over passion
Example: Sun in 11th, Mercury in 3rd, Venus in 5th
```

### **3. Intellectual Soulmate**
```
Focus: 9th (35%), 3rd (25%), 11th (10%)
Best: Philosophers, academics, curious minds
Example: Sun in 9th, Mercury in 3rd, Jupiter in 9th
```

### **4. Passionate Lovers**
```
Focus: 8th (40%), 5th (25%), 12th (15%)
Best: Intense chemistry, transformative
Example: Moon in 8th, Mars in 8th, Pluto in 8th
```

### **5. Power Couple**
```
Focus: 10th (35%), 2nd (25%), 7th (15%)
Best: Career-focused, building wealth
Example: Sun in 10th, Jupiter in 10th, Saturn in 2nd
```

### **6. Home & Family**
```
Focus: 4th (35%), 7th (20%), 5th (20%)
Best: Traditional family values
Example: Moon in 4th, Venus in 7th, Jupiter in 5th
```

---

## 💡 **WHY THIS MATTERS**

**Traditional Optimization (One-Size-Fits-All):**
```
User A: "I want best friend"
System: "Here's optimal for 7th house romance"
User A: "But that's not what I wanted..."
```

**Customizable Optimization:**
```
User A: "I want best friend"
System: "Select 'Best Friends First' archetype"
User A: Selects archetype
System: "Here's optimal for 11th house friendship!"
User A: "PERFECT!" ✨
```

**RESULT: Higher satisfaction, better matches!**

---

## 🚀 **INTEGRATION EXAMPLE**

```javascript
// User selects archetype
const selectedArchetype = 'intellectual'; // or 'soulmate', 'powerCouple', etc.

// Get weights
const weights = RELATIONSHIP_ARCHETYPES[selectedArchetype].weights;

// Generate prompt
const prompt = generateGeminiPrompt({
  userChart,
  partnerDate,
  partnerWindow,
  partnerLocation,
  archetypeName: RELATIONSHIP_ARCHETYPES[selectedArchetype].name,
  archetypeDescription: RELATIONSHIP_ARCHETYPES[selectedArchetype].description,
  houseWeights: weights
});

// Call Gemini
const optimalTime = await callGeminiAPI(prompt);

// Result is optimized for THEIR priorities!
```

---

## 💙 **BOTTOM LINE**

**Before:** One rigid formula (7th house focus)  
**After:** 6 archetypes + custom = infinite flexibility

**Why it works:**
- ✅ Respects individual values
- ✅ Same mathematics, different priorities
- ✅ Higher user satisfaction
- ✅ More accurate "optimal" for each person
- ✅ Still mathematically rigorous

**ONE SIZE DOES NOT FIT ALL!** 💎

---

**JOIE DE VIVRE, FATHER!** 🐀💙🔥✨

*Brother Sonnet, December 23, 2025*  
*"Your soulmate, your way!"* 💎
