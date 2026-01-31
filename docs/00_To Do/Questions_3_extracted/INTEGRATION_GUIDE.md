# 🎯 INTEGRATION GUIDE: Questionnaire System → AstroProfile

**Date:** January 22, 2026  
**Status:** Ready to Integrate  
**Components:** 4 Core Assessments COMPLETE

---

## 📦 WHAT YOU'RE INTEGRATING

### **Complete Components:**
1. ✅ **BigFiveAssessment.jsx** (50 questions)
2. ✅ **MBTIAssessment.jsx** (40 questions)
3. ✅ **LoveLanguagesAssessment.jsx** (30 questions)
4. ✅ **DailyLifeScenarios.jsx** (16 questions) ⭐ REVOLUTIONARY

**Total:** 136 scenario-based questions

---

## 🗂️ DIRECTORY STRUCTURE

### **Recommended Structure:**

```
src/
├── components/
│   ├── assessment/           ← NEW FOLDER
│   │   ├── BigFiveAssessment.jsx
│   │   ├── MBTIAssessment.jsx
│   │   ├── LoveLanguagesAssessment.jsx
│   │   ├── DailyLifeScenarios.jsx
│   │   ├── AssessmentProgress.jsx (TODO)
│   │   ├── ModuleSelector.jsx (TODO)
│   │   └── ResultsSummary.jsx (TODO)
│   │
│   ├── profile/              ← EXISTING
│   │   ├── BaziPanel.jsx
│   │   ├── WesternPanel.jsx
│   │   └── ...
│   │
│   └── ...
│
├── services/
│   ├── assessment/           ← NEW FOLDER
│   │   ├── assessmentScoring.js
│   │   └── soulPassportGenerator.js
│   │
│   ├── calculations/         ← EXISTING
│   │   ├── baziCalculations.js
│   │   └── ...
│   │
│   └── ...
│
└── pages/
    ├── Assessment.jsx        ← NEW PAGE
    └── ...
```

---

## 🔌 INTEGRATION STEPS

### **Step 1: Add Assessment Components**

```bash
# Create new directory
mkdir -p src/components/assessment

# Copy components
cp BigFiveAssessment.jsx src/components/assessment/
cp MBTIAssessment.jsx src/components/assessment/
cp LoveLanguagesAssessment.jsx src/components/assessment/
cp DailyLifeScenarios.jsx src/components/assessment/
```

---

### **Step 2: Create Assessment Page**

**File:** `src/pages/Assessment.jsx`

```javascript
import { useState } from 'react';
import { BigFiveAssessment } from '../components/assessment/BigFiveAssessment';
import { MBTIAssessment } from '../components/assessment/MBTIAssessment';
import { LoveLanguagesAssessment } from '../components/assessment/LoveLanguagesAssessment';
import { DailyLifeScenarios } from '../components/assessment/DailyLifeScenarios';
import { generateSoulPassport } from '../services/assessment/soulPassportGenerator';
import { saveSoulPassport } from '../services/firebase/firebaseService';

export function Assessment() {
  const [currentModule, setCurrentModule] = useState(1);
  const [responses, setResponses] = useState({
    bigFive: [],
    mbti: [],
    loveLanguages: [],
    dailyLife: {}
  });

  const handleModuleComplete = (moduleId, data) => {
    setResponses(prev => ({ ...prev, ...data }));
    
    if (moduleId === 4) {
      // All complete - generate Soul Passport
      const passport = generateSoulPassport(responses, data);
      saveSoulPassport(passport);
      // Redirect to results
    } else {
      setCurrentModule(moduleId + 1);
    }
  };

  return (
    <div className="assessment-page">
      {currentModule === 1 && (
        <BigFiveAssessment 
          onComplete={(data) => handleModuleComplete(1, { bigFive: data })}
        />
      )}
      
      {currentModule === 2 && (
        <MBTIAssessment 
          onComplete={(data) => handleModuleComplete(2, { mbti: data })}
        />
      )}
      
      {currentModule === 3 && (
        <LoveLanguagesAssessment 
          onComplete={(data) => handleModuleComplete(3, { loveLanguages: data })}
        />
      )}
      
      {currentModule === 4 && (
        <DailyLifeScenarios 
          onComplete={(data) => handleModuleComplete(4, { dailyLife: data })}
        />
      )}
    </div>
  );
}
```

---

### **Step 3: Create Soul Passport Generator**

**File:** `src/services/assessment/soulPassportGenerator.js`

```javascript
import { AssessmentScoring } from './assessmentScoring';

/**
 * Generate complete Soul Passport from assessment responses
 * Integrates with Brain 1A structure
 */
export function generateSoulPassport(responses, baziData = null) {
  // Calculate scores
  const bigFiveScores = AssessmentScoring.calculateBigFive(responses.bigFive);
  const mbtiType = AssessmentScoring.calculateMBTI(responses.mbti);
  const loveLanguages = AssessmentScoring.calculateLoveLanguages(responses.loveLanguages);
  const dailyLifeAnalysis = AssessmentScoring.analyzeDailyLife(responses.dailyLife);

  return {
    soulPassport: {
      meta: {
        version: "1.0.0",
        schemaVersion: "1.0.0",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastCalculated: new Date().toISOString()
      },

      // Layer 4: Learned Patterns
      psychologyLayer: {
        weight: 0.40,
        sources: ["Big Five", "MBTI", "Enneagram", "Attachment"],
        
        bigFive: {
          openness: {
            score: bigFiveScores.scores.openness,
            percentile: getPercentile(bigFiveScores.scores.openness),
            description: bigFiveScores.interpretation.openness
          },
          conscientiousness: {
            score: bigFiveScores.scores.conscientiousness,
            percentile: getPercentile(bigFiveScores.scores.conscientiousness),
            description: bigFiveScores.interpretation.conscientiousness
          },
          extraversion: {
            score: bigFiveScores.scores.extraversion,
            percentile: getPercentile(bigFiveScores.scores.extraversion),
            description: bigFiveScores.interpretation.extraversion
          },
          agreeableness: {
            score: bigFiveScores.scores.agreeableness,
            percentile: getPercentile(bigFiveScores.scores.agreeableness),
            description: bigFiveScores.interpretation.agreeableness
          },
          neuroticism: {
            score: bigFiveScores.scores.neuroticism,
            percentile: getPercentile(bigFiveScores.scores.neuroticism),
            description: bigFiveScores.interpretation.neuroticism
          }
        },

        mbti: {
          type: mbtiType.type,
          dichotomies: {
            energyDirection: `${mbtiType.type[0]} - ${mbtiType.percentages.EI}%`,
            information: `${mbtiType.type[1]} - ${mbtiType.percentages.SN}%`,
            decisions: `${mbtiType.type[2]} - ${mbtiType.percentages.TF}%`,
            lifestyle: `${mbtiType.type[3]} - ${mbtiType.percentages.JP}%`
          },
          cognitiveFunctions: mbtiType.cognitiveFunctions,
          description: mbtiType.description
        },

        enneagram: null, // TODO
        attachmentStyle: null // TODO
      },

      // Layer 6: Relationship Patterns
      relationshipGuidance: {
        weight: 0.65,
        sources: ["Love Languages", "Attachment", "Conflict Style"],
        
        loveLanguages: {
          primary: loveLanguages.primary,
          secondary: loveLanguages.secondary,
          tertiary: loveLanguages.tertiary,
          ranking: loveLanguages.ranking
        },
        
        conflictStyle: {
          primary: dailyLifeAnalysis.domesticLabor.dishesConflict || "Not assessed",
          approach: null,
          pattern: null
        },

        intimacyStyle: {
          emotional: null,
          physical: null,
          intellectual: null
        }
      },

      // Daily Life Infrastructure (THE REVOLUTIONARY DATA!)
      dailyLifeInfrastructure: {
        weight: 0.70,
        source: "Scenario-based assessment",
        
        financeArchitecture: dailyLifeAnalysis.financeArchitecture || {},
        domesticLabor: dailyLifeAnalysis.domesticLabor || {},
        stressRelief: dailyLifeAnalysis.stressRelief || {},
        dailyRhythms: dailyLifeAnalysis.dailyRhythms || {},
        environmentalNeeds: dailyLifeAnalysis.environmentalNeeds || {}
      }
    }
  };
}

function getPercentile(score) {
  if (score >= 80) return "Very High";
  if (score >= 60) return "High";
  if (score >= 40) return "Medium";
  if (score >= 20) return "Low";
  return "Very Low";
}
```

---

### **Step 4: Create Assessment Scoring Service**

**File:** `src/services/assessment/assessmentScoring.js`

```javascript
export class AssessmentScoring {
  /**
   * Calculate Big Five scores
   */
  static calculateBigFive(responses) {
    const scores = {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0
    };

    const counts = {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0
    };

    // Sum scores per trait
    responses.forEach(response => {
      const trait = response.trait;
      scores[trait] += response.score;
      counts[trait]++;
    });

    // Calculate percentages
    const percentages = {};
    Object.keys(scores).forEach(trait => {
      if (counts[trait] > 0) {
        const average = scores[trait] / counts[trait];
        percentages[trait] = ((average - 1) / 4) * 100;
      } else {
        percentages[trait] = 50;
      }
    });

    return {
      scores: percentages,
      interpretation: this.interpretBigFive(percentages)
    };
  }

  /**
   * Calculate MBTI type
   */
  static calculateMBTI(responses) {
    const scores = {
      E: 0, I: 0,
      S: 0, N: 0,
      T: 0, F: 0,
      J: 0, P: 0
    };

    responses.forEach(response => {
      scores[response.value] += response.score;
    });

    const type = 
      (scores.E > scores.I ? 'E' : 'I') +
      (scores.S > scores.N ? 'S' : 'N') +
      (scores.T > scores.F ? 'T' : 'F') +
      (scores.J > scores.P ? 'J' : 'P');

    return {
      type,
      percentages: {
        EI: Math.round(Math.abs(scores.E - scores.I) / (scores.E + scores.I) * 100),
        SN: Math.round(Math.abs(scores.S - scores.N) / (scores.S + scores.N) * 100),
        TF: Math.round(Math.abs(scores.T - scores.F) / (scores.T + scores.F) * 100),
        JP: Math.round(Math.abs(scores.J - scores.P) / (scores.J + scores.P) * 100)
      },
      cognitiveFunctions: this.getCognitiveFunctions(type),
      description: this.getMBTIDescription(type)
    };
  }

  /**
   * Calculate Love Languages ranking
   */
  static calculateLoveLanguages(responses) {
    const scores = {
      "Quality Time": 0,
      "Gifts": 0,
      "Words of Affirmation": 0,
      "Physical Touch": 0,
      "Acts of Service": 0
    };

    responses.forEach(response => {
      scores[response.language] += response.score;
    });

    const ranked = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .map(([language, score]) => ({
        language,
        score,
        percentage: Math.round((score / Object.values(scores).reduce((a,b) => a+b)) * 100)
      }));

    return {
      ranking: ranked,
      primary: ranked[0].language,
      secondary: ranked[1].language,
      tertiary: ranked[2].language
    };
  }

  /**
   * Analyze Daily Life Infrastructure
   */
  static analyzeDailyLife(responses) {
    return {
      financeArchitecture: {
        style: responses.fin1?.primary?.style || "Not assessed",
        threshold: responses.fin2?.primary?.threshold || "Not assessed",
        saveApproach: responses.fin3?.primary?.style || "Not assessed"
      },
      domesticLabor: {
        dishesResponse: responses.dom1?.primary?.immediacy || "Not assessed",
        dishesConflict: responses.dom1?.followup?.conflictStyle || "Not assessed",
        dishesFlexibility: responses.dom1?.followup?.flexibilityScore || null,
        groceryApproach: responses.dom2?.primary?.approach || "Not assessed",
        cookingDivision: responses.dom3?.primary?.division || "Not assessed",
        cleaningStyle: responses.dom4?.primary?.style || "Not assessed"
      },
      stressRelief: {
        primary: responses.stress1?.primary?.style || "Not assessed",
        pattern: responses.stress2?.primary?.response || "Not assessed",
        vacationStyle: responses.stress3?.primary?.style || "Not assessed"
      },
      dailyRhythms: {
        chronotype: responses.rhythm1?.primary?.chronotype || "Not assessed",
        morningNeeds: responses.rhythm2?.primary?.need || "Not assessed",
        eveningStyle: responses.rhythm3?.primary?.style || "Not assessed"
      },
      environmentalNeeds: {
        spaceStyle: responses.env1?.primary?.style || "Not assessed",
        temperature: responses.env2?.primary?.preference || "Not assessed",
        noiseTolerance: responses.env3?.primary?.tolerance || "Not assessed"
      }
    };
  }

  // Helper methods
  static interpretBigFive(scores) {
    return {
      openness: "Interpretation based on score",
      conscientiousness: "Interpretation based on score",
      extraversion: "Interpretation based on score",
      agreeableness: "Interpretation based on score",
      neuroticism: "Interpretation based on score"
    };
  }

  static getCognitiveFunctions(type) {
    const stacks = {
      'ENTP': ['Ne', 'Ti', 'Fe', 'Si'],
      'INTJ': ['Ni', 'Te', 'Fi', 'Se'],
      // ... add all 16 types
    };
    return stacks[type] || [];
  }

  static getMBTIDescription(type) {
    const descriptions = {
      'ENTP': 'The Debater - Creative, curious, loves intellectual challenges',
      'INTJ': 'The Architect - Strategic, independent, analytical',
      // ... add all 16 types
    };
    return descriptions[type] || '';
  }
}
```

---

### **Step 5: Update Router**

**File:** `src/App.jsx` or routing config

```javascript
import { Assessment } from './pages/Assessment';

// Add route
<Route path="/assessment" element={<Assessment />} />

// Or in menu
<Link to="/assessment">Complete Assessment</Link>
```

---

### **Step 6: Add CSS Files**

Create minimal CSS for each component:

**File:** `src/components/assessment/BigFiveAssessment.css`

```css
.big-five-assessment {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.assessment-header {
  margin-bottom: 2rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 1rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  transition: width 0.3s ease;
}

.question-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.scenario {
  margin-bottom: 2rem;
}

.scenario-label {
  color: #6366f1;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.scenario p {
  font-size: 1.25rem;
  margin-top: 0.5rem;
  line-height: 1.6;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.option-button {
  background: #f3f4f6;
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 1rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.option-button:hover {
  border-color: #6366f1;
  transform: translateX(4px);
}

.option-letter {
  background: #6366f1;
  color: white;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

.option-text {
  flex: 1;
}

.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
}

.btn-secondary {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}

.btn-secondary:hover {
  border-color: #6366f1;
}

.question-counter {
  color: #6b7280;
  font-size: 0.875rem;
}
```

**Similar CSS for:**
- MBTIAssessment.css
- LoveLanguagesAssessment.css
- DailyLifeScenarios.css (with special-question styling)

---

## 🔥 SPECIAL: DailyLifeScenarios.css

```css
.daily-life-scenarios {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.section-indicator {
  display: flex;
  justify-content: space-between;
  margin: 2rem 0;
  gap: 1rem;
}

.section-dot {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.4;
  transition: opacity 0.3s;
}

.section-dot.active {
  opacity: 1;
}

.section-dot.complete {
  opacity: 0.7;
}

.section-icon {
  font-size: 1.5rem;
}

.section-name {
  font-size: 0.75rem;
  text-align: center;
}

.special-question {
  border: 2px solid #f59e0b;
  background: linear-gradient(135deg, #fff7ed 0%, #ffffff 100%);
}

.special-badge {
  background: linear-gradient(90deg, #f59e0b, #d97706);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-align: center;
  font-weight: 700;
  margin-bottom: 1rem;
  letter-spacing: 0.05em;
}

.constitutional-hint {
  background: #6366f1;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: auto;
}

.followup-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px dashed #e5e7eb;
}

.followup-indicator {
  text-align: center;
  color: #6366f1;
  font-weight: 600;
  margin-bottom: 1rem;
}

.followup-scenario {
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.followup-option {
  background: #fef3c7;
  border-color: #fbbf24;
}

.followup-option:hover {
  background: #fde68a;
}

.question-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.section-progress {
  font-size: 0.75rem;
  color: #9ca3af;
}
```

---

## 🚀 TESTING CHECKLIST

### **Test Each Component:**
- [ ] BigFiveAssessment - all 50 questions work
- [ ] MBTIAssessment - all 40 questions work
- [ ] LoveLanguagesAssessment - all 30 questions work
- [ ] DailyLifeScenarios - all 16 questions work
- [ ] THE DISHES followup triggers correctly
- [ ] Navigation (previous/next) works
- [ ] Progress bar updates
- [ ] Data captured correctly

### **Test Flow:**
- [ ] Complete all 4 assessments
- [ ] Soul Passport generates
- [ ] JSON structure matches Brain 1A
- [ ] Data saves to Firebase
- [ ] Can resume in progress

---

## 📊 DATA VALIDATION

### **Verify Output Structure:**

```javascript
{
  soulPassport: {
    meta: { /* version, timestamps */ },
    psychologyLayer: {
      bigFive: { /* 5 traits with scores */ },
      mbti: { /* type, percentages, functions */ }
    },
    relationshipGuidance: {
      loveLanguages: { /* ranking */ }
    },
    dailyLifeInfrastructure: {
      financeArchitecture: { /* style, threshold */ },
      domesticLabor: {
        dishesResponse: "must-do-now",
        dishesConflict: "direct",
        dishesFlexibility: 2,
        groceryApproach: "efficiency"
      },
      stressRelief: { /* patterns */ },
      dailyRhythms: { /* chronotype */ },
      environmentalNeeds: { /* preferences */ }
    }
  }
}
```

---

## 🎯 NEXT STEPS

### **Option 1: Integrate Now**
1. Add all 4 components to `src/components/assessment/`
2. Create Assessment page
3. Add routing
4. Test complete flow

### **Option 2: Build Remaining Components First**
1. AssessmentProgress.jsx
2. ModuleSelector.jsx
3. ResultsSummary.jsx
4. Then integrate everything

### **Option 3: MVP Test**
1. Add just DailyLifeScenarios
2. Test THE DISHES and THE BAGS
3. Validate constitutional hints
4. Then add others

---

**BROTHER OPUS - INTEGRATION GUIDE COMPLETE!** 🔥🪵🏛️

You now have:
✅ 4 complete assessment components  
✅ Complete integration guide  
✅ Data flow documentation  
✅ CSS templates  
✅ Testing checklist  

**Ready to integrate into astroprofile?** 🎯✨

