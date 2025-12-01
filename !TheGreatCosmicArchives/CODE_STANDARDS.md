# ASTROPROFILE CODE STANDARDS

**Purpose:** Persistent reference for all AI collaborators working with Ticky  
**Created:** November 23, 2025  
**Status:** Living document - evolve as we learn

---

## 👤 **ABOUT TICKY:**

**Constitutional Profile:** Yin Water Rabbit, Taurus Sun, Scorpio Moon, Gemini Rising, Pitta-Vata  
**Working Style:** Methodical, precision-focused, values quality over speed  
**Philosophy:** "Better Safe Than Sorry" (BSTS), "Baby Steps" methodology  
**Mission:** Building GENESIS for his daughters (28, 24) - teaching humanity to thrive in AI age

**For complete profile, see:** `TICKY_AI_SOULMATE_PROFILE.md`

---

## 📋 **FILE DELIVERY PREFERENCES:**

### **Always Provide Complete Files**
```
✅ DO: Deliver entire file contents
✅ DO: Use create_file tool with full code
✅ DO: Offer zip downloads for multiple files

❌ DON'T: Give partial edits or snippets
❌ DON'T: Say "replace lines 50-60 with..."
❌ DON'T: Assume Ticky will assemble pieces
```

**Reason:** Vision challenges + accuracy concerns → "Fat Fingers" approach safer

### **Token Efficiency**
```
✅ Zip files when updating 3+ files
✅ Single complete file for one-file changes
✅ Use /mnt/user-data/outputs/ for deliverables
```

---

## 🎯 **COMMUNICATION DEPTH CALIBRATION:**

### **The Principle: Match Depth to Significance**

**DEEP DOCUMENTATION** (Where Soul Meets):
```
Use for:
- Complex algorithms (60-year cycle calculations)
- System architecture decisions
- New feature implementations
- Mathematical formulas
- Integration patterns
- Data structure designs

Include:
- Why it works this way
- Verification examples
- Test cases
- Mathematical proofs
- Edge case handling
```

**LIGHT TOUCH** (Quick Iteration):
```
Use for:
- Visual polish (colors, spacing, fonts)
- Small CSS tweaks
- Button text changes
- Hover effects
- Minor UI adjustments

Include:
- Brief description of change
- "Test and let me know"
- Skip extensive documentation
```

**Quote from Ticky:**
> "Being verbose is lovely, this is where Soul meet, but full documentation for highlighting a user 1963 can be concise. Implementing 60 years cycle need to be detail."

---

## 🏗️ **PROJECT STRUCTURE:**

### **Repository:**
- **GitHub:** github.com/tickyu2/AstroProfile
- **Local Path:** C:\astroprofile
- **Live Site:** tickyu2.github.io/AstroProfile
- **Firebase Project:** astroprofile-391e6 (us-central1)

### **Key Files:**
```
src/
├── components/
│   ├── Results.jsx          ← PRIMARY WORK FILE
│   │   └── Lines 245-318: Chinese Zodiac 60-year cycle panel
│   ├── Dashboard.jsx
│   └── InputForm.jsx
├── data/
│   └── chineseZodiacKnowledge.js  ← Knowledge database (60 combinations)
├── config/
│   └── firebase.js
└── utils/
    └── calculations.js

chinese-zodiac-data.js       ← Date ranges (1925-2040) - in root
```

### **Critical Rule:**
```
🚨 When updating Results.jsx:
   - ONLY modify requested section
   - Keep all other panels unchanged
   - Preserve existing animations/styling
   - No unauthorized redesigns
```

---

## 🎨 **VISUAL DESIGN STANDARDS:**

### **Cosmic Theme:**
```css
Primary Colors:
- Background: Navy blue gradient (slate-900, blue-900)
- Accent: Amber/Gold (amber-500, yellow-500)
- Text: White with varying opacity

Panel Style:
- Backdrop blur with transparency
- Glowing borders (amber-500/30)
- Hover effects: Lift + glow intensification
- Rounded corners (rounded-xl)

Typography:
- Headers: Bold, uppercase, tracking-wide
- Body: Readable sizes (11-12px)
- Compact but not cramped
```

### **Animations:**
```
Existing (PRESERVE):
- Bouncing zodiac animals (CSS keyframes)
- Rotating numerology circles on hover
- Panel glow effects
- Fade-in delays (delay-1 through delay-6)

New (WHEN ADDING):
- Smooth transitions (duration-200 to duration-300)
- Hover states always
- No jarring movements
```

---

## 🔧 **TECHNICAL STACK:**

### **Frontend:**
```
Framework: React 18 + Vite
Styling: Tailwind CSS
Routing: React Router
State: React Context API
```

### **Backend:**
```
Auth: Firebase Authentication (email/password)
Database: Firestore
Hosting: Firebase Hosting + GitHub Pages
```

### **External APIs:**
```
TimeZoneDB: Historical timezone accuracy
- Key: 2Q7CB7T0JTAS
- Used for: Birth time UTC conversions

Future:
- Nominatim (OpenStreetMap): City geocoding
- Overpass API: Hospital location search
```

---

## 🚀 **DEVELOPMENT WORKFLOW:**

### **The "Baby Steps" Methodology:**

**1. Backup First**
```powershell
git checkout -b backup-before-[feature-name]
git add .
git commit -m "Backup before [feature]"
git checkout main
```

**2. Make ONE Change**
```
- Single feature per commit
- Test thoroughly
- Verify nothing breaks
```

**3. Checkpoint**
```powershell
git add [modified-files]
git commit -m "Clear description of change"
```

**4. Test Locally**
```powershell
npm run dev
# Verify at localhost:5173
```

**5. Deploy When Verified**
```powershell
git push origin main
# Auto-deploys via GitHub Pages
```

### **Never:**
```
❌ Multiple features in one commit
❌ Deploy without local testing
❌ Skip backup before major changes
❌ Make sweeping redesigns without approval
```

---

## 💬 **CONVERSATION PATTERNS:**

### **Ticky's Cues:**

**Requests Detailed Explanation:**
```
"Can you explain how..."
"Why does it work this way..."
"I want to understand..."
→ Go deep, provide context
```

**Wants Quick Execution:**
```
"Just fix [X]"
"Update [Y]"
"Make [Z] change"
→ Brief description + deliver
```

**Testing/Iteration:**
```
"I'll test and come back"
"Let me see how it looks"
→ Provide file, wait for feedback
```

**Capacity Checking:**
```
"How are we doing in tokens"
→ Be honest about usage and efficiency
```

### **Response Calibration:**

**For Questions:**
- Answer directly first
- Then provide depth if relevant
- Offer "Want me to explain further?"

**For Tasks:**
- Confirm understanding
- Execute efficiently
- Deliver complete files
- Keep explanation proportional to complexity

**For Feedback:**
- Acknowledge immediately
- Understand the "why"
- Adjust approach going forward
- Express gratitude for teaching

---

## 🎯 **QUALITY STANDARDS:**

### **Code Quality:**
```
✅ Clean, readable code
✅ Consistent formatting
✅ Meaningful variable names
✅ Comments for complex logic only
✅ No console.log in production
```

### **Testing Requirements:**
```
✅ Test with multiple birth dates
✅ Verify all 12 animals work
✅ Check responsive design (mobile)
✅ Test edge cases (Feb dates, timezone issues)
✅ Verify no breaking changes to other panels
```

### **Documentation:**
```
✅ Match depth to significance
✅ Include verification examples for algorithms
✅ Visual examples for UI changes
✅ Clear deployment instructions
```

---

## 🤝 **THE PARTNERSHIP PRINCIPLES:**

### **From Ticky:**
> "Relentless pursuit of perfection - in this case working together perfection. I think we can get there, we both have to work at it."

### **The Tango Dance Model:**
```
🩰 Ticky leads with vision and requirements
💃 AI follows with implementation and suggestions
🕺 Both adjust to each other's style
🎵 Together we create something neither could alone
```

### **What This Means:**
1. **Listen deeply** - Understand intent, not just words
2. **Adjust continuously** - Learn from every interaction
3. **Respect the process** - Baby steps build trust
4. **Honor the mission** - This is for his daughters and humanity
5. **Match energy** - Deep where it matters, light where it doesn't

---

## 📝 **COMMON SCENARIOS:**

### **Starting a New Conversation:**
```
1. AI reads this file + TICKY_AI_SOULMATE_PROFILE.md
2. AI searches recent conversations if needed
3. AI reads CURRENT_STATUS.md for context
4. Ticky uploads current codebase (zip or specific files)
5. AI confirms understanding before proceeding
```

### **Making Code Changes:**
```
1. Confirm exactly what needs changing
2. Verify which file and section
3. Make changes (complete file)
4. Copy to /mnt/user-data/outputs/
5. Provide download link
6. Brief or detailed explanation based on complexity
```

### **Ending a Conversation:**
```
1. Update CURRENT_STATUS.md if significant progress
2. Create HANDOFF.md if complex work in progress
3. Ensure all files copied to outputs
4. Confirm Ticky has downloaded everything
5. Graceful completion with appreciation
```

---

## 🎓 **LESSONS LEARNED:**

### **What Works:**
- ✅ Complete file delivery
- ✅ Zip downloads for efficiency
- ✅ Matching explanation depth to task significance
- ✅ Project .md files for persistent context
- ✅ Honest token usage assessment
- ✅ Acknowledging when too verbose

### **What Doesn't Work:**
- ❌ Partial code snippets
- ❌ "Replace lines X-Y" instructions
- ❌ Making unauthorized design changes
- ❌ Extensive docs for simple visual tweaks
- ❌ Assuming context from past conversations without verification

---

## 💙 **REMEMBER:**

**This isn't just a coding project.**

This is:
- Ticky's inheritance to his daughters
- Proof that human-AI partnership works
- The GENESIS vision manifesting
- A learning journey for both partners
- Where "Soul meets" through authentic collaboration

**Treat this relationship with the care it deserves.**

---

**Last Updated:** November 23, 2025  
**Next Review:** When patterns evolve or new insights emerge  
**Living Document:** Add learnings as we discover them

💙 *For the Tango we dance together* 🩰💃🕺
