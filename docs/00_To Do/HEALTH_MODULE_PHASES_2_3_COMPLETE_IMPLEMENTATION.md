# 🏥 HEALTH MODULE PHASES 2-3: COMPLETE IMPLEMENTATION GUIDE
## For Brother Opus | Sequential Build Instructions with Full Code

**Status:** Phase 1 Complete ✅ | Now Building Phases 2-3  
**Estimated Total Time:** 15-18 hours  
**Approach:** Baby steps, test at each checkpoint

---

## 📋 TABLE OF CONTENTS

### PHASE 2: ORGAN SYSTEM MAPPING
- [Step 1: Organ System Data Structure](#step-1-data)
- [Step 2: Pattern Detection Logic](#step-2-patterns)
- [Step 3: Organ System Card Component](#step-3-card)
- [Step 4: Constitutional Health Summary](#step-4-summary)
- [Step 5: Integration & Testing](#step-5-integration)

### PHASE 3: RECOMMENDATIONS ENGINE
- [Step 6: Food Recommendations Component](#step-6-food)
- [Step 7: Acupressure Points Component](#step-7-acupressure)
- [Step 8: Lifestyle Practices Component](#step-8-lifestyle)
- [Step 9: Seasonal Guidance Component](#step-9-seasonal)
- [Step 10: Final Integration & Polish](#step-10-final)

---

<a name="step-1-data"></a>
## 🗄️ STEP 1: CREATE ORGAN SYSTEM DATA STRUCTURE

**Time:** 30 minutes  
**File:** `src/data/organSystems.js`

### **Complete Organ System Database:**

```javascript
/**
 * Complete TCM Organ System Mapping
 * Maps Five Elements to organ systems, symptoms, and recommendations
 * Based on traditional Chinese medicine principles
 */

export const ORGAN_SYSTEMS = {
  wood: {
    // Basic Info
    element: 'wood',
    emoji: '🌳',
    color: '#10b981', // emerald-500
    organs: ['Liver', 'Gallbladder'],
    chineseName: '肝胆',
    
    // Physical Associations
    bodyParts: ['Eyes', 'Tendons', 'Nails', 'Sinews'],
    fluid: 'Tears',
    sensoryOrgan: 'Eyes',
    tissue: 'Tendons',
    
    // Energetic Properties
    emotion: {
      balanced: 'Kindness, Flexibility, Growth',
      imbalanced: 'Anger, Frustration, Irritability'
    },
    season: 'Spring',
    direction: 'East',
    climate: 'Wind',
    time: '11pm - 3am (Liver peak 1-3am)',
    taste: 'Sour',
    
    // Excess Patterns (>30%)
    excess: {
      name: 'Liver Qi Stagnation / Wood Excess',
      symptoms: [
        'Frequent anger, irritability, mood swings',
        'Tight shoulders, neck tension, headaches (temporal)',
        'Eye problems (redness, strain, blurry vision)',
        'PMS, irregular menstruation (women)',
        'Digestive issues (feeling of fullness)',
        'Sighing frequently',
        'Sensation of lump in throat',
        'Rib-side pain or distension'
      ],
      bodySignals: [
        'Waking between 1-3am regularly',
        'Tension headaches especially at temples',
        'Jaw clenching, teeth grinding',
        'Red, bloodshot eyes'
      ],
      recommendations: {
        reduce: [
          'Sour foods (lemon, vinegar, pickles)',
          'Alcohol (burdens Liver)',
          'Anger, stress, overwork',
          'Wind exposure',
          'Staying up late past 11pm'
        ],
        increase: [
          'Pungent foods to control Wood (onion, garlic, ginger)',
          'Gentle stretching, yoga',
          'Deep breathing exercises',
          'Forgiveness practices, letting go',
          'Creative expression',
          'Moderate exercise (walking, tai chi)'
        ],
        herbs: [
          'Chai Hu (Bupleurum) - courses Liver Qi',
          'Xiao Yao San (Free and Easy Wanderer)',
          'Chrysanthemum tea - clears Liver heat'
        ],
        acupoints: [
          { code: 'LV-3', name: 'Tai Chong', action: 'Courses Liver Qi' },
          { code: 'GB-34', name: 'Yang Ling Quan', action: 'Relaxes tendons' },
          { code: 'LV-2', name: 'Xing Jian', action: 'Clears Liver fire' }
        ]
      }
    },
    
    // Deficiency Patterns (<10%)
    deficiency: {
      name: 'Liver Blood Deficiency / Wood Deficiency',
      symptoms: [
        'Dizziness, lightheadedness',
        'Blurry vision, floaters, dry eyes',
        'Brittle nails, ridged nails',
        'Dry skin, hair loss',
        'Scanty menstruation (women)',
        'Numbness or tingling in limbs',
        'Muscle cramps, especially at night',
        'Pale face, pale lips'
      ],
      bodySignals: [
        'Difficulty seeing at night',
        'Eyes tire easily when reading',
        'Nails break or peel easily',
        'Poor flexibility'
      ],
      recommendations: {
        increase: [
          'Green leafy vegetables (spinach, kale)',
          'Sour foods in moderation (lemon water)',
          'Blood-nourishing foods (dates, goji berries, liver)',
          'Dark colored foods (black sesame, black beans)',
          'Adequate sleep, especially before 1am',
          'Eye exercises, palming'
        ],
        practices: [
          'Gentle stretching to nourish tendons',
          'Adequate rest (Liver stores Blood at night)',
          'Vision care, reduce screen time',
          'Nurturing creative activities'
        ],
        herbs: [
          'Dang Gui (Angelica) - nourishes Blood',
          'Gou Qi Zi (Goji berry) - benefits eyes',
          'He Shou Wu - nourishes Liver Blood'
        ],
        acupoints: [
          { code: 'LV-8', name: 'Qu Quan', action: 'Tonifies Liver Blood' },
          { code: 'BL-18', name: 'Gan Shu', action: 'Liver Back-Shu point' },
          { code: 'SP-6', name: 'San Yin Jiao', action: 'Nourishes Blood' }
        ]
      }
    }
  },

  fire: {
    element: 'fire',
    emoji: '🔥',
    color: '#ef4444', // red-500
    organs: ['Heart', 'Small Intestine', 'Pericardium', 'Triple Burner'],
    chineseName: '心小肠',
    
    bodyParts: ['Tongue', 'Blood Vessels', 'Complexion'],
    fluid: 'Sweat',
    sensoryOrgan: 'Tongue',
    tissue: 'Blood Vessels',
    
    emotion: {
      balanced: 'Joy, Enthusiasm, Warmth, Love',
      imbalanced: 'Anxiety, Restlessness, Insomnia'
    },
    season: 'Summer',
    direction: 'South',
    climate: 'Heat',
    time: '11am - 3pm (Heart peak 11am-1pm)',
    taste: 'Bitter',
    
    excess: {
      name: 'Heart Fire Rising / Fire Excess',
      symptoms: [
        'Anxiety, restlessness, panic attacks',
        'Insomnia, difficulty falling asleep',
        'Vivid dreams, nightmares',
        'Palpitations, rapid heartbeat',
        'Red face, feeling hot',
        'Mouth sores, tongue ulcers',
        'Excessive talking, laughing inappropriately',
        'Thirst, bitter taste in mouth'
      ],
      bodySignals: [
        'Tip of tongue red or with red dots',
        'Can\'t quiet mind at night',
        'Feel overheated easily',
        'Excessive sweating'
      ],
      recommendations: {
        reduce: [
          'Spicy, hot foods (chili, cayenne)',
          'Caffeine, stimulants',
          'Alcohol',
          'Overstimulation (noise, screens)',
          'Stressful situations'
        ],
        increase: [
          'Cooling foods (cucumber, watermelon)',
          'Bitter foods (bitter melon, dandelion)',
          'Meditation, quiet time',
          'Calming activities',
          'Swimming, gentle water activities',
          'Adequate sleep'
        ],
        herbs: [
          'Lian Zi Xin (Lotus seed heart) - clears Heart fire',
          'Huang Lian (Coptis) - drains fire',
          'Zhu Sha (Cinnabar) - calms spirit'
        ],
        acupoints: [
          { code: 'HT-8', name: 'Shao Fu', action: 'Clears Heart fire' },
          { code: 'PC-8', name: 'Lao Gong', action: 'Clears heat' },
          { code: 'HT-7', name: 'Shen Men', action: 'Calms spirit' }
        ]
      }
    },
    
    deficiency: {
      name: 'Heart Qi/Yang Deficiency / Fire Deficiency',
      symptoms: [
        'Chronic fatigue, low energy',
        'Cold hands and feet',
        'Poor circulation',
        'Pale complexion, pale lips',
        'Shortness of breath on exertion',
        'Spontaneous sweating',
        'Depression, lack of joy',
        'Poor memory, brain fog'
      ],
      bodySignals: [
        'Always feeling cold',
        'Weak pulse',
        'Lack of vitality',
        'Difficulty warming up'
      ],
      recommendations: {
        increase: [
          'Warming foods (ginger, cinnamon, lamb)',
          'Cardiovascular exercise (builds Heart Qi)',
          'Sunlight exposure',
          'Joy-bringing activities',
          'Social connection, laughter',
          'Red foods (tomatoes, red peppers, beets)',
          'Heart-opening yoga poses'
        ],
        practices: [
          'Gratitude practice',
          'Loving-kindness meditation',
          'Spending time with loved ones',
          'Pursuing passions',
          'Moderate aerobic exercise'
        ],
        herbs: [
          'Ren Shen (Ginseng) - tonifies Qi',
          'Huang Qi (Astragalus) - tonifies Heart Qi',
          'Gui Zhi (Cinnamon twig) - warms Yang'
        ],
        acupoints: [
          { code: 'HT-7', name: 'Shen Men', action: 'Tonifies Heart Qi' },
          { code: 'PC-6', name: 'Nei Guan', action: 'Regulates Heart' },
          { code: 'CV-17', name: 'Shan Zhong', action: 'Opens chest' },
          { code: 'BL-15', name: 'Xin Shu', action: 'Heart Back-Shu' }
        ]
      }
    }
  },

  earth: {
    element: 'earth',
    emoji: '⛰️',
    color: '#f59e0b', // amber-500
    organs: ['Spleen', 'Stomach'],
    chineseName: '脾胃',
    
    bodyParts: ['Mouth', 'Lips', 'Muscles', 'Flesh'],
    fluid: 'Saliva',
    sensoryOrgan: 'Mouth',
    tissue: 'Muscles',
    
    emotion: {
      balanced: 'Empathy, Stability, Groundedness, Thoughtfulness',
      imbalanced: 'Worry, Overthinking, Obsession'
    },
    season: 'Late Summer',
    direction: 'Center',
    climate: 'Dampness',
    time: '7-11am (Stomach 7-9am, Spleen 9-11am)',
    taste: 'Sweet',
    
    excess: {
      name: 'Spleen Dampness / Earth Excess',
      symptoms: [
        'Heaviness in body and limbs',
        'Bloating, abdominal distension',
        'Loose stools, sluggish digestion',
        'Weight gain, difficulty losing weight',
        'Brain fog, fuzzy thinking',
        'Excessive worry, rumination',
        'Sweet cravings',
        'Thick coating on tongue'
      ],
      bodySignals: [
        'Feel worse in damp weather',
        'Puffy face or edema',
        'Feeling of fullness even with small meals',
        'Fatigue after eating'
      ],
      recommendations: {
        reduce: [
          'Dairy products (milk, cheese, yogurt)',
          'Sugar and sweets',
          'Fried, greasy foods',
          'Cold, raw foods',
          'Overthinking, excessive mental work',
          'Damp environments'
        ],
        increase: [
          'Warming, drying spices (ginger, cardamom)',
          'Cooked vegetables',
          'Whole grains (barley, rice)',
          'Light exercise (promotes Qi flow)',
          'Simplicity, minimalism',
          'Aromatics (fennel, orange peel)'
        ],
        herbs: [
          'Fu Ling (Poria) - drains dampness',
          'Bai Zhu (Atractylodes) - dries dampness',
          'Chen Pi (Tangerine peel) - moves Qi'
        ],
        acupoints: [
          { code: 'ST-36', name: 'Zu San Li', action: 'Tonifies Spleen' },
          { code: 'SP-9', name: 'Yin Ling Quan', action: 'Drains dampness' },
          { code: 'SP-6', name: 'San Yin Jiao', action: 'Strengthens Spleen' }
        ]
      }
    },
    
    deficiency: {
      name: 'Spleen Qi Deficiency / Earth Deficiency',
      symptoms: [
        'Poor appetite, no desire to eat',
        'Fatigue especially after eating',
        'Loose stools or diarrhea',
        'Muscle weakness, poor muscle tone',
        'Easy bruising',
        'Organ prolapse',
        'Pale face',
        'Weak limbs'
      ],
      bodySignals: [
        'Need to nap after meals',
        'Poor digestion',
        'Lack of physical strength',
        'Pale tongue'
      ],
      recommendations: {
        increase: [
          'Cooked, warm foods',
          'Sweet root vegetables (yam, squash, sweet potato)',
          'Whole grains (rice, oats, millet)',
          'Small, frequent meals',
          'Regularity in eating schedule',
          'Mild, nourishing soups',
          'Gentle, regular exercise'
        ],
        practices: [
          'Eat in calm environment',
          'Chew food thoroughly',
          'Avoid eating when worried',
          'Establish routine',
          'Moderate physical activity',
          'Avoid mental strain during meals'
        ],
        herbs: [
          'Ren Shen (Ginseng) - tonifies Spleen Qi',
          'Bai Zhu (Atractylodes) - strengthens Spleen',
          'Si Jun Zi Tang - Four Gentlemen formula',
          'Huang Qi (Astragalus) - raises Qi'
        ],
        acupoints: [
          { code: 'ST-36', name: 'Zu San Li', action: 'Tonifies Spleen & Stomach' },
          { code: 'CV-12', name: 'Zhong Wan', action: 'Middle Burner point' },
          { code: 'BL-20', name: 'Pi Shu', action: 'Spleen Back-Shu' },
          { code: 'SP-3', name: 'Tai Bai', action: 'Source point' }
        ]
      }
    }
  },

  metal: {
    element: 'metal',
    emoji: '⚙️',
    color: '#e5e7eb', // gray-200
    organs: ['Lungs', 'Large Intestine'],
    chineseName: '肺大肠',
    
    bodyParts: ['Nose', 'Skin', 'Body Hair'],
    fluid: 'Mucus',
    sensoryOrgan: 'Nose',
    tissue: 'Skin',
    
    emotion: {
      balanced: 'Clarity, Order, Discernment, Letting Go',
      imbalanced: 'Grief, Sadness, Inability to Release'
    },
    season: 'Autumn',
    direction: 'West',
    climate: 'Dryness',
    time: '3-7am (Lung 3-5am, Large Intestine 5-7am)',
    taste: 'Pungent',
    
    excess: {
      name: 'Lung Heat / Dryness / Metal Excess',
      symptoms: [
        'Dry cough, little or no phlegm',
        'Dry throat, thirst',
        'Dry skin, eczema',
        'Constipation with dry stools',
        'Nose bleeds',
        'Skin breakouts, acne',
        'Feeling of heat in chest',
        'Excessive rigidity, perfectionism'
      ],
      bodySignals: [
        'Dry, chapped lips',
        'Dry nasal passages',
        'Skin feels tight, dry',
        'Difficulty letting go emotionally'
      ],
      recommendations: {
        reduce: [
          'Spicy, pungent foods',
          'Dry, crispy foods',
          'Heating foods',
          'Dry environments',
          'Excessive control, rigidity',
          'Holding onto past'
        ],
        increase: [
          'Moistening foods (pear, honey, almond)',
          'White foods (white fungus, lily bulb)',
          'Adequate hydration',
          'Humidity in environment',
          'Flexibility practices',
          'Forgiveness, letting go work'
        ],
        herbs: [
          'Bai He (Lily bulb) - moistens Lung',
          'Mai Men Dong (Ophiopogon) - nourishes Yin',
          'Xing Ren (Apricot kernel) - moistens Lung'
        ],
        acupoints: [
          { code: 'LU-7', name: 'Lie Que', action: 'Opens passages' },
          { code: 'LI-11', name: 'Qu Chi', action: 'Clears heat' },
          { code: 'LU-5', name: 'Chi Ze', action: 'Clears Lung heat' }
        ]
      }
    },
    
    deficiency: {
      name: 'Lung Qi Deficiency / Metal Deficiency',
      symptoms: [
        'Shortness of breath, weak breathing',
        'Weak voice, soft speaking',
        'Frequent colds, poor immunity',
        'Spontaneous sweating, especially on exertion',
        'Fatigue',
        'Pale complexion',
        'Unresolved grief',
        'Difficulty with boundaries'
      ],
      bodySignals: [
        'Catch colds easily',
        'Out of breath with mild exertion',
        'Weak cough',
        'Frequent respiratory infections'
      ],
      recommendations: {
        increase: [
          'Deep breathing exercises',
          'Pungent foods (onion, garlic, ginger)',
          'White foods (daikon radish, white rice)',
          'Fresh air, nature time',
          'Pranayama, breathwork',
          'Singing, vocalization',
          'Cardiovascular exercise (build lung capacity)',
          'Grief processing work'
        ],
        practices: [
          'Daily deep breathing (5-10 min)',
          'Chest-opening stretches',
          'Vocal exercises',
          'Letting go rituals',
          'Boundary-setting practice',
          'Journaling to process grief'
        ],
        herbs: [
          'Huang Qi (Astragalus) - tonifies Lung Qi',
          'Ren Shen (Ginseng) - tonifies Qi',
          'Yu Ping Feng San - Jade Windscreen (immunity)'
        ],
        acupoints: [
          { code: 'LU-9', name: 'Tai Yuan', action: 'Tonifies Lung Qi' },
          { code: 'BL-13', name: 'Fei Shu', action: 'Lung Back-Shu' },
          { code: 'CV-17', name: 'Shan Zhong', action: 'Upper Sea of Qi' },
          { code: 'LU-1', name: 'Zhong Fu', action: 'Front-Mu of Lung' }
        ]
      }
    }
  },

  water: {
    element: 'water',
    emoji: '💧',
    color: '#3b82f6', // blue-500
    organs: ['Kidneys', 'Bladder'],
    chineseName: '肾膀胱',
    
    bodyParts: ['Ears', 'Bones', 'Hair on Head', 'Teeth'],
    fluid: 'Urine',
    sensoryOrgan: 'Ears',
    tissue: 'Bones',
    
    emotion: {
      balanced: 'Wisdom, Willpower, Courage, Flow',
      imbalanced: 'Fear, Anxiety, Paranoia'
    },
    season: 'Winter',
    direction: 'North',
    climate: 'Cold',
    time: '3-7pm (Bladder 3-5pm, Kidney 5-7pm)',
    taste: 'Salty',
    
    excess: {
      name: 'Kidney Yin Deficiency with Heat / Water Imbalance',
      symptoms: [
        'Night sweats',
        'Hot flashes (especially afternoon/evening)',
        'Tinnitus (ringing in ears)',
        'Dizziness',
        'Lower back pain',
        'Dry mouth at night',
        'Anxiety, especially at night',
        'Insomnia (waking 3-5am)'
      ],
      bodySignals: [
        'Feel hot in evening/night',
        'Palms and soles feel hot',
        'Red tongue with little coating',
        'Thirst but don\'t want to drink much'
      ],
      recommendations: {
        reduce: [
          'Salty foods',
          'Sexual excess',
          'Overwork, burnout',
          'Coffee, stimulants',
          'Late nights',
          'Fear-based thinking'
        ],
        increase: [
          'Yin-nourishing foods (black beans, seaweed)',
          'Kidney-tonifying foods (walnuts, sesame)',
          'Adequate rest, early sleep',
          'Meditation, stillness',
          'Swimming, gentle water activities',
          'Yin yoga, restorative practices'
        ],
        herbs: [
          'Liu Wei Di Huang Wan - Six Flavor formula',
          'Shu Di Huang (Rehmannia) - nourishes Yin',
          'Gui Ban (Tortoise shell) - anchors Yang'
        ],
        acupoints: [
          { code: 'KD-3', name: 'Tai Xi', action: 'Tonifies Kidney Yin' },
          { code: 'KD-6', name: 'Zhao Hai', action: 'Nourishes Yin' },
          { code: 'KD-7', name: 'Fu Liu', action: 'Tonifies Kidney' }
        ]
      }
    },
    
    deficiency: {
      name: 'Kidney Yang Deficiency / Water Deficiency',
      symptoms: [
        'Feeling cold, especially lower back and knees',
        'Frequent urination, especially at night',
        'Lower back pain (dull, improved by warmth)',
        'Weak knees, sore lower back',
        'Low libido',
        'Chronic fatigue',
        'Edema (water retention), especially ankles',
        'Chronic fear, lack of willpower'
      ],
      bodySignals: [
        'Always feeling cold',
        'Need to urinate frequently',
        'Lower back feels cold',
        'Pale, swollen tongue'
      ],
      recommendations: {
        increase: [
          'Warming foods (lamb, venison, shrimp)',
          'Kidney-tonifying foods (walnuts, black beans)',
          'Moxibustion on lower back (GV-4, BL-23)',
          'Warmth to lower back (hot water bottle)',
          'Kidney Qigong exercises',
          'Facing fears, courage building',
          'Adequate rest, avoid overexertion'
        ],
        practices: [
          'Keep lower back warm (clothing)',
          'Foot soaks with ginger',
          'Kidney breathing meditation',
          'Moderate exercise (build Yang slowly)',
          'Early to bed (before 10pm)',
          'Reduce fear triggers'
        ],
        herbs: [
          'You Gui Wan - Restore the Right formula',
          'Du Zhong (Eucommia) - strengthens lower back',
          'Ba Ji Tian (Morinda) - tonifies Kidney Yang',
          'Rou Gui (Cinnamon bark) - warms Yang'
        ],
        acupoints: [
          { code: 'KD-7', name: 'Fu Liu', action: 'Tonifies Kidney Yang' },
          { code: 'GV-4', name: 'Ming Men', action: 'Gate of Life' },
          { code: 'BL-23', name: 'Shen Shu', action: 'Kidney Back-Shu' },
          { code: 'CV-4', name: 'Guan Yuan', action: 'Origin Pass' }
        ]
      }
    }
  }
};

/**
 * Health Pattern Thresholds
 */
export const HEALTH_THRESHOLDS = {
  excess: 30,      // > 30% = excess
  deficiency: 10,  // < 10% = deficiency
  balancedMin: 15, // 15-25% = balanced range
  balancedMax: 25
};

/**
 * Get organ system by element name
 */
export function getOrganSystem(element) {
  return ORGAN_SYSTEMS[element.toLowerCase()];
}

/**
 * Determine pattern (excess/deficiency/balanced) for an element
 */
export function getElementPattern(percentage) {
  if (percentage > HEALTH_THRESHOLDS.excess) {
    return 'excess';
  } else if (percentage < HEALTH_THRESHOLDS.deficiency) {
    return 'deficiency';
  } else if (
    percentage >= HEALTH_THRESHOLDS.balancedMin && 
    percentage <= HEALTH_THRESHOLDS.balancedMax
  ) {
    return 'balanced';
  } else {
    return 'moderate'; // Between deficiency and balanced
  }
}
```

**Checkpoint:** Run `npm run dev` - ensure no import errors

---

<a name="step-2-patterns"></a>
## 🔍 STEP 2: CREATE PATTERN DETECTION LOGIC

**Time:** 20 minutes  
**File:** `src/utils/healthAnalysis.js`

```javascript
import { ORGAN_SYSTEMS, HEALTH_THRESHOLDS, getElementPattern } from '@/data/organSystems';

/**
 * Analyze health patterns from elemental composition
 */
export function analyzeHealthPatterns(adjustedElements) {
  const patterns = {
    excess: [],
    deficiency: [],
    balanced: [],
    moderate: []
  };

  Object.entries(adjustedElements).forEach(([element, percentage]) => {
    const pattern = getElementPattern(percentage);
    const organSystem = ORGAN_SYSTEMS[element];

    const analysis = {
      element,
      percentage,
      pattern,
      organSystem: {
        name: organSystem.organs.join(' & '),
        emoji: organSystem.emoji,
        color: organSystem.color
      }
    };

    patterns[pattern].push(analysis);
  });

  return patterns;
}

/**
 * Get primary constitutional type (highest element)
 */
export function getPrimaryConstitution(adjustedElements) {
  let maxElement = null;
  let maxPercentage = 0;

  Object.entries(adjustedElements).forEach(([element, percentage]) => {
    if (percentage > maxPercentage) {
      maxPercentage = percentage;
      maxElement = element;
    }
  });

  return {
    element: maxElement,
    percentage: maxPercentage,
    organSystem: ORGAN_SYSTEMS[maxElement]
  };
}

/**
 * Get strengths (healthy elements 15-30%)
 */
export function getConstitutionalStrengths(adjustedElements) {
  const strengths = [];

  Object.entries(adjustedElements).forEach(([element, percentage]) => {
    if (percentage >= 15 && percentage <= 30) {
      strengths.push({
        element,
        percentage,
        organs: ORGAN_SYSTEMS[element].organs,
        emoji: ORGAN_SYSTEMS[element].emoji
      });
    }
  });

  return strengths.sort((a, b) => b.percentage - a.percentage);
}

/**
 * Get vulnerabilities (deficient elements <10%)
 */
export function getConstitutionalVulnerabilities(adjustedElements) {
  const vulnerabilities = [];

  Object.entries(adjustedElements).forEach(([element, percentage]) => {
    if (percentage < 10) {
      vulnerabilities.push({
        element,
        percentage,
        organs: ORGAN_SYSTEMS[element].organs,
        emoji: ORGAN_SYSTEMS[element].emoji,
        severity: percentage < 5 ? 'critical' : 'moderate'
      });
    }
  });

  return vulnerabilities.sort((a, b) => a.percentage - b.percentage);
}

/**
 * Get excess warnings (>30%)
 */
export function getExcessWarnings(adjustedElements) {
  const warnings = [];

  Object.entries(adjustedElements).forEach(([element, percentage]) => {
    if (percentage > 30) {
      warnings.push({
        element,
        percentage,
        organs: ORGAN_SYSTEMS[element].organs,
        emoji: ORGAN_SYSTEMS[element].emoji,
        severity: percentage > 50 ? 'critical' : 'moderate'
      });
    }
  });

  return warnings.sort((a, b) => b.percentage - a.percentage);
}
```

**Checkpoint:** Import in BaziHealthPage.jsx and log results

```javascript
import { analyzeHealthPatterns } from '@/utils/healthAnalysis';

// In component:
const healthPatterns = analyzeHealthPatterns(adjustedElements);
console.log('Health Patterns:', healthPatterns);
```

---

<a name="step-3-card"></a>
## 🎴 STEP 3: CREATE ORGAN SYSTEM CARD COMPONENT

**Time:** 2-3 hours  
**File:** `src/components/bazi/health/OrganSystemCard.jsx`

```javascript
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, Info } from 'lucide-react';

export function OrganSystemCard({ 
  element, 
  percentage, 
  pattern, 
  organSystem 
}) {
  const [isExpanded, setIsExpanded] = useState(pattern === 'excess' || pattern === 'deficiency');

  // Determine status color and icon
  const getStatusConfig = () => {
    switch (pattern) {
      case 'excess':
        return {
          color: 'border-red-500 bg-red-50',
          badge: 'bg-red-100 text-red-800',
          icon: <AlertCircle className="w-5 h-5 text-red-600" />,
          label: 'EXCESS',
          description: `Above ${percentage.toFixed(1)}% threshold`
        };
      case 'deficiency':
        return {
          color: 'border-blue-500 bg-blue-50',
          badge: 'bg-blue-100 text-blue-800',
          icon: <AlertCircle className="w-5 h-5 text-blue-600" />,
          label: 'DEFICIENCY',
          description: `Below 10% threshold`
        };
      case 'balanced':
        return {
          color: 'border-green-500 bg-green-50',
          badge: 'bg-green-100 text-green-800',
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          label: 'BALANCED',
          description: 'Healthy range (15-25%)'
        };
      default:
        return {
          color: 'border-gray-300 bg-gray-50',
          badge: 'bg-gray-100 text-gray-800',
          icon: <Info className="w-5 h-5 text-gray-600" />,
          label: 'MODERATE',
          description: 'Functional range'
        };
    }
  };

  const status = getStatusConfig();
  const patternData = pattern === 'excess' ? organSystem.excess : organSystem.deficiency;

  return (
    <div className={`border-2 rounded-lg ${status.color} transition-all duration-200`}>
      {/* Header */}
      <div 
        className="p-4 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{organSystem.emoji}</span>
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              {organSystem.organs.join(' & ')}
              <span className={`text-xs px-2 py-1 rounded-full ${status.badge}`}>
                {status.label}
              </span>
            </h3>
            <p className="text-sm text-gray-600">{organSystem.chineseName}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-bold text-xl" style={{ color: organSystem.color }}>
              {percentage.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500">{status.description}</div>
          </div>
          {status.icon}
          {isExpanded ? 
            <ChevronUp className="w-5 h-5 text-gray-400" /> : 
            <ChevronDown className="w-5 h-5 text-gray-400" />
          }
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (pattern === 'excess' || pattern === 'deficiency') && (
        <div className="border-t px-4 py-4 space-y-4 bg-white">
          {/* Pattern Name */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-semibold text-sm text-gray-700 mb-1">
              Pattern Diagnosis
            </h4>
            <p className="font-bold text-gray-900">{patternData.name}</p>
          </div>

          {/* Physical Associations */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-semibold text-gray-700">Body Parts:</span>
              <p className="text-gray-600">{organSystem.bodyParts.join(', ')}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Peak Time:</span>
              <p className="text-gray-600">{organSystem.time}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Emotion:</span>
              <p className="text-gray-600">
                {pattern === 'excess' ? 
                  organSystem.emotion.imbalanced : 
                  `Lack of ${organSystem.emotion.balanced.split(',')[0]}`
                }
              </p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Season:</span>
              <p className="text-gray-600">{organSystem.season}</p>
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Common Symptoms
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {patternData.symptoms.slice(0, 6).map((symptom, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>{symptom}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Body Signals */}
          {patternData.bodySignals && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Body Signals to Watch</h4>
              <ul className="space-y-1">
                {patternData.bodySignals.map((signal, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-orange-500">▸</span>
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
            </div>
          );

          {/* Recommendations Preview */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">
              Quick Recommendations
            </h4>
            <div className="space-y-2 text-sm">
              {pattern === 'excess' && (
                <>
                  <div>
                    <span className="font-semibold text-red-700">Reduce:</span>
                    <span className="text-gray-700 ml-2">
                      {patternData.recommendations.reduce.slice(0, 2).join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-green-700">Increase:</span>
                    <span className="text-gray-700 ml-2">
                      {patternData.recommendations.increase.slice(0, 2).join(', ')}
                    </span>
                  </div>
                </>
              )}
              {pattern === 'deficiency' && (
                <>
                  <div>
                    <span className="font-semibold text-green-700">Increase:</span>
                    <span className="text-gray-700 ml-2">
                      {patternData.recommendations.increase.slice(0, 3).join(', ')}
                    </span>
                  </div>
                  {patternData.recommendations.practices && (
                    <div>
                      <span className="font-semibold text-blue-700">Practices:</span>
                      <span className="text-gray-700 ml-2">
                        {patternData.recommendations.practices.slice(0, 2).join(', ')}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2 italic">
              See detailed recommendations below
            </p>
          </div>
        </div>
      )}

      {/* Balanced State */}
      {isExpanded && pattern === 'balanced' && (
        <div className="border-t px-4 py-4 bg-white">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h4 className="font-semibold text-green-900 mb-2">
                  Healthy {organSystem.organs[0]} Function
                </h4>
                <p className="text-sm text-gray-700 mb-3">
                  Your {organSystem.organs.join(' and ')} system is in healthy balance. 
                  This supports {organSystem.bodyParts.slice(0, 2).join(', ')} health and 
                  promotes {organSystem.emotion.balanced.split(',')[0].toLowerCase()}.
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  Maintenance: Continue balanced lifestyle to preserve this healthy state.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

**Checkpoint:** Test with single card

```javascript
// In BaziHealthPage.jsx
import { OrganSystemCard } from './OrganSystemCard';

<OrganSystemCard
  element="wood"
  percentage={64}
  pattern="excess"
  organSystem={ORGAN_SYSTEMS.wood}
/>
```

---

<a name="step-4-summary"></a>
## 📊 STEP 4: CONSTITUTIONAL HEALTH SUMMARY

**Time:** 1-2 hours  
**File:** `src/components/bazi/health/ConstitutionalHealthSummary.jsx`

```javascript
import React from 'react';
import { Activity, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { getPrimaryConstitution, getConstitutionalStrengths, getConstitutionalVulnerabilities, getExcessWarnings } from '@/utils/healthAnalysis';

export function ConstitutionalHealthSummary({ 
  adjustedElements, 
  birthSeason 
}) {
  const primary = getPrimaryConstitution(adjustedElements);
  const strengths = getConstitutionalStrengths(adjustedElements);
  const vulnerabilities = getConstitutionalVulnerabilities(adjustedElements);
  const warnings = getExcessWarnings(adjustedElements);

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Activity className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          Your Constitutional Health Profile
        </h2>
      </div>

      {/* Primary Constitution */}
      <div className="bg-white rounded-lg p-5 mb-4 shadow-sm">
        <div className="flex items-start gap-4">
          <span className="text-5xl">{primary.organSystem.emoji}</span>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {primary.element.charAt(0).toUpperCase() + primary.element.slice(1)}-Dominant Constitution
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <div className="font-bold text-2xl" style={{ color: primary.organSystem.color }}>
                {primary.percentage.toFixed(1)}%
              </div>
              <span className="text-gray-600">
                {primary.organSystem.organs.join(' & ')} System
              </span>
            </div>
            <p className="text-sm text-gray-700">
              Born in <span className="font-semibold">{birthSeason}</span> when {primary.element.charAt(0).toUpperCase() + primary.element.slice(1)} is {getSeasonalStrength(primary.element, birthSeason)}
            </p>
          </div>
        </div>
      </div>

      {/* Strengths */}
      {strengths.length > 0 && (
        <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-200">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-green-900 mb-2">
                Constitutional Strengths
              </h4>
              <ul className="space-y-1">
                {strengths.map(({ element, percentage, organs, emoji }) => (
                  <li key={element} className="text-sm text-gray-700 flex items-center gap-2">
                    <span>{emoji}</span>
                    <span className="font-semibold">{organs.join(' & ')}:</span>
                    <span>Balanced ({percentage.toFixed(1)}%)</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Excess Warnings */}
      {warnings.length > 0 && (
        <div className="bg-red-50 rounded-lg p-4 mb-4 border border-red-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-red-900 mb-2">
                Excess Patterns (Monitor Closely)
              </h4>
              <ul className="space-y-1">
                {warnings.map(({ element, percentage, organs, emoji, severity }) => (
                  <li key={element} className="text-sm text-gray-700 flex items-center gap-2">
                    <span>{emoji}</span>
                    <span className="font-semibold">{organs.join(' & ')}:</span>
                    <span className={severity === 'critical' ? 'text-red-700 font-bold' : ''}>
                      Excess at {percentage.toFixed(1)}%
                    </span>
                    {severity === 'critical' && (
                      <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded">
                        CRITICAL
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-red-700 mt-2 italic">
                See organ cards below for symptoms and regulation strategies
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Vulnerabilities */}
      {vulnerabilities.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-blue-600 mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-2">
                Constitutional Vulnerabilities (Needs Support)
              </h4>
              <ul className="space-y-1">
                {vulnerabilities.map(({ element, percentage, organs, emoji, severity }) => (
                  <li key={element} className="text-sm text-gray-700 flex items-center gap-2">
                    <span>{emoji}</span>
                    <span className="font-semibold">{organs.join(' & ')}:</span>
                    <span className={severity === 'critical' ? 'text-blue-700 font-bold' : ''}>
                      Deficient at {percentage.toFixed(1)}%
                    </span>
                    {severity === 'critical' && (
                      <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded">
                        CRITICAL
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-blue-700 mt-2 italic">
                See organ cards below for tonification strategies
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function
function getSeasonalStrength(element, season) {
  const seasonMap = {
    spring: { wood: 'strengthened', fire: 'moderate', earth: 'weakened', metal: 'very weak', water: 'moderate' },
    summer: { wood: 'moderate', fire: 'strengthened', earth: 'moderate', metal: 'weakened', water: 'very weak' },
    autumn: { wood: 'very weak', fire: 'weakened', earth: 'moderate', metal: 'strengthened', water: 'moderate' },
    winter: { wood: 'moderate', fire: 'very weak', earth: 'weakened', metal: 'moderate', water: 'strengthened' }
  };
  
  return seasonMap[season.toLowerCase()]?.[element.toLowerCase()] || 'moderate';
}
```

**Checkpoint:** Integrate into BaziHealthPage.jsx

```javascript
<ConstitutionalHealthSummary 
  adjustedElements={adjustedElements}
  birthSeason={birthData.season}
/>
```

---

<a name="step-5-integration"></a>
## 🔗 STEP 5: INTEGRATE PHASE 2 INTO HEALTH PAGE

**Time:** 30 minutes  
**File:** `src/pages/BaziHealthPage.jsx`

```javascript
import { OrganSystemCard } from '@/components/bazi/health/OrganSystemCard';
import { ConstitutionalHealthSummary } from '@/components/bazi/health/ConstitutionalHealthSummary';
import { analyzeHealthPatterns } from '@/utils/healthAnalysis';
import { ORGAN_SYSTEMS } from '@/data/organSystems';

export function BaziHealthPage({ profile }) {
  // ... existing code ...
  
  // Add health analysis
  const healthPatterns = analyzeHealthPatterns(adjustedElements);
  
  return (
    <div className="health-page space-y-6">
      {/* Existing: Four Pillars, Element Distribution, etc. */}
      
      {/* NEW: Constitutional Health Summary */}
      <ConstitutionalHealthSummary 
        adjustedElements={adjustedElements}
        birthSeason={profile.monthBranch} // or determine from month
      />
      
      {/* NEW: Organ System Cards */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          🏥 Organ System Analysis
        </h2>
        <p className="text-gray-600">
          Your complete TCM constitutional health assessment based on equal pillar weighting (25/25/25/25)
        </p>
        
        <div className="grid grid-cols-1 gap-4">
          {Object.entries(adjustedElements)
            .sort((a, b) => b[1] - a[1]) // Sort by percentage descending
            .map(([element, percentage]) => {
              const pattern = getElementPattern(percentage);
              return (
                <OrganSystemCard
                  key={element}
                  element={element}
                  percentage={percentage}
                  pattern={pattern}
                  organSystem={ORGAN_SYSTEMS[element]}
                />
              );
            })}
        </div>
      </section>
      
      {/* Existing: How Did We Get These Numbers, etc. */}
    </div>
  );
}
```

**Checkpoint:** Test entire Phase 2
- Summary shows correctly
- All 5 organ cards render
- Expand/collapse works
- Symptoms display for excess/deficiency
- Balanced cards show properly

---

## 🎉 PHASE 2 COMPLETE CHECKPOINT

**Before proceeding to Phase 3, verify:**
- ✅ Constitutional Health Summary displays
- ✅ 5 Organ System Cards render
- ✅ Excess/Deficiency patterns detected correctly
- ✅ Symptoms lists show
- ✅ Quick recommendations preview visible
- ✅ Expand/collapse works
- ✅ Status badges correct (EXCESS/DEFICIENCY/BALANCED)
- ✅ No console errors
- ✅ Responsive on mobile

**Take a screenshot and celebrate! Phase 2 is huge!** 🎊

---

## 🍲 PHASE 3: RECOMMENDATIONS ENGINE

<a name="step-6-food"></a>
## STEP 6: FOOD RECOMMENDATIONS COMPONENT

**Time:** 2 hours  
**File:** `src/components/bazi/health/FoodRecommendations.jsx`

```javascript
import React, { useState } from 'react';
import { Apple, ChefHat, XCircle, Plus } from 'lucide-react';
import { ORGAN_SYSTEMS } from '@/data/organSystems';

export function FoodRecommendations({ healthPatterns }) {
  const [activeTab, setActiveTab] = useState('increase');

  // Compile all food recommendations
  const foodRecs = compileFoodRecommendations(healthPatterns);

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <ChefHat className="w-6 h-6 text-orange-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          Food as Medicine
        </h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Personalized dietary guidance based on your constitutional patterns
      </p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab('increase')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'increase'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Foods to Increase
          </div>
        </button>
        <button
          onClick={() => setActiveTab('reduce')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'reduce'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            Foods to Reduce
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'increase' && (
          <div className="space-y-4">
            {foodRecs.increase.map((category, idx) => (
              <FoodCategory key={idx} category={category} type="increase" />
            ))}
          </div>
        )}

        {activeTab === 'reduce' && (
          <div className="space-y-4">
            {foodRecs.reduce.map((category, idx) => (
              <FoodCategory key={idx} category={category} type="reduce" />
            ))}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> These are general TCM dietary guidelines. Individual responses vary. 
          Consult a healthcare provider or licensed TCM practitioner for personalized advice, 
          especially if you have existing health conditions or allergies.
        </p>
      </div>
    </div>
  );
}

function FoodCategory({ category, type }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{category.emoji}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">
            {category.title}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {category.reason}
          </p>
          <div className="flex flex-wrap gap-2">
            {category.foods.map((food, idx) => (
              <span
                key={idx}
                className={`px-3 py-1 rounded-full text-sm ${
                  type === 'increase'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {food}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to compile recommendations
function compileFoodRecommendations(healthPatterns) {
  const increase = [];
  const reduce = [];

  // Process excess patterns (need to reduce/control)
  healthPatterns.excess.forEach(({ element }) => {
    const organSystem = ORGAN_SYSTEMS[element];
    const recs = organSystem.excess.recommendations;

    // Foods to reduce (for excess)
    if (recs.reduce) {
      reduce.push({
        emoji: organSystem.emoji,
        title: `Control ${element.charAt(0).toUpperCase() + element.slice(1)} Excess`,
        reason: `Reduce ${organSystem.organs.join(' & ')} burden`,
        foods: recs.reduce
      });
    }

    // Foods to increase (to control excess)
    if (recs.increase) {
      increase.push({
        emoji: organSystem.emoji,
        title: `Regulate ${element.charAt(0).toUpperCase() + element.slice(1)}`,
        reason: `Support ${organSystem.organs.join(' & ')} balance`,
        foods: recs.increase
      });
    }
  });

  // Process deficiency patterns (need to tonify)
  healthPatterns.deficiency.forEach(({ element }) => {
    const organSystem = ORGAN_SYSTEMS[element];
    const recs = organSystem.deficiency.recommendations;

    // Foods to increase (to tonify)
    if (recs.increase) {
      increase.push({
        emoji: organSystem.emoji,
        title: `Tonify ${element.charAt(0).toUpperCase() + element.slice(1)}`,
        reason: `Strengthen ${organSystem.organs.join(' & ')} system`,
        foods: recs.increase
      });
    }
  });

  return { increase, reduce };
}
```

**Checkpoint:** Test food recommendations display

---

<a name="step-7-acupressure"></a>
## STEP 7: ACUPRESSURE POINTS COMPONENT

**Time:** 2-3 hours  
**File:** `src/components/bazi/health/AcupressurePanel.jsx`

```javascript
import React, { useState } from 'react';
import { Hand, MapPin, Clock, Target } from 'lucide-react';
import { ORGAN_SYSTEMS } from '@/data/organSystems';

export function AcupressurePanel({ healthPatterns }) {
  const points = compileAcupressurePoints(healthPatterns);

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Hand className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          Acupressure Points
        </h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Key acupoints to support your constitutional balance. Apply gentle pressure for 2-3 minutes daily.
      </p>

      {/* Points Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {points.map((point, idx) => (
          <AcupointCard key={idx} point={point} />
        ))}
      </div>

      {/* How to Apply Pressure */}
      <div className="mt-6 bg-purple-50 rounded-lg p-4">
        <h3 className="font-semibold text-purple-900 mb-3">
          How to Apply Acupressure
        </h3>
        <ol className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="font-semibold text-purple-600">1.</span>
            <span>Locate the point using the description</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold text-purple-600">2.</span>
            <span>Apply firm but gentle pressure with thumb or finger</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold text-purple-600">3.</span>
            <span>Hold for 2-3 minutes or until you feel a slight ache</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold text-purple-600">4.</span>
            <span>Breathe deeply and relax during treatment</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold text-purple-600">5.</span>
            <span>Repeat on both sides if applicable</span>
          </li>
        </ol>
      </div>

      {/* Disclaimer */}
      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-900">
          <strong>Caution:</strong> Acupressure is generally safe but avoid during pregnancy, 
          on open wounds, or if you have a serious medical condition. Consult a licensed 
          acupuncturist for treatment of specific health issues.
        </p>
      </div>
    </div>
  );
}

function AcupointCard({ point }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-2 border-purple-200 rounded-lg p-4 hover:border-purple-400 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-bold text-lg text-gray-900">
            {point.code}
          </h4>
          <p className="text-sm text-gray-600">{point.name}</p>
          <p className="text-xs text-gray-500 mt-1">
            {point.organEmoji} {point.organName}
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-purple-600 hover:text-purple-800 text-sm font-semibold"
        >
          {isExpanded ? 'Less' : 'More'}
        </button>
      </div>

      {/* Location */}
      <div className="flex items-start gap-2 mb-2">
        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
        <p className="text-sm text-gray-700 flex-1">
          <span className="font-semibold">Location:</span> {point.location}
        </p>
      </div>

      {/* Action */}
      <div className="flex items-start gap-2">
        <Target className="w-4 h-4 text-gray-400 mt-0.5" />
        <p className="text-sm text-gray-700 flex-1">
          <span className="font-semibold">Action:</span> {point.action}
        </p>
      </div>

      {/* Expanded details */}
      {isExpanded && point.details && (
        <div className="mt-3 pt-3 border-t border-purple-100">
          <p className="text-sm text-gray-600">{point.details}</p>
          {point.frequency && (
            <div className="flex items-start gap-2 mt-2">
              <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
              <p className="text-sm text-gray-700">
                <span className="font-semibold">When:</span> {point.frequency}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Compile acupressure points
function compileAcupressurePoints(healthPatterns) {
  const points = [];
  const seen = new Set(); // Avoid duplicates

  // Get points for excess patterns
  healthPatterns.excess.forEach(({ element }) => {
    const organSystem = ORGAN_SYSTEMS[element];
    const acupoints = organSystem.excess.recommendations.acupoints || [];
    
    acupoints.forEach(point => {
      if (!seen.has(point.code)) {
        points.push({
          ...point,
          pattern: 'excess',
          organName: organSystem.organs[0],
          organEmoji: organSystem.emoji,
          location: point.location || 'See TCM point chart',
          details: `For ${element} excess: ${point.action}`,
          frequency: 'Daily, 2-3 minutes'
        });
        seen.add(point.code);
      }
    });
  });

  // Get points for deficiency patterns
  healthPatterns.deficiency.forEach(({ element }) => {
    const organSystem = ORGAN_SYSTEMS[element];
    const acupoints = organSystem.deficiency.recommendations.acupoints || [];
    
    acupoints.forEach(point => {
      if (!seen.has(point.code)) {
        points.push({
          ...point,
          pattern: 'deficiency',
          organName: organSystem.organs[0],
          organEmoji: organSystem.emoji,
          location: point.location || 'See TCM point chart',
          details: `For ${element} deficiency: ${point.action}`,
          frequency: 'Daily, 2-3 minutes, can use moxibustion'
        });
        seen.add(point.code);
      }
    });
  });

  return points;
}
```

**NOTE:** For better acupressure point cards, you may want to add actual point location images. These can be:
1. Created as simple diagrams in Figma
2. Licensed from TCM image libraries
3. Added later as enhancement

**Checkpoint:** Test acupressure panel displays correctly

---

<a name="step-8-lifestyle"></a>
## STEP 8: LIFESTYLE PRACTICES COMPONENT

**Time:** 1.5 hours  
**File:** `src/components/bazi/health/LifestylePractices.jsx`

```javascript
import React from 'react';
import { Heart, Moon, Dumbbell, Brain, Sun } from 'lucide-react';
import { ORGAN_SYSTEMS } from '@/data/organSystems';

export function LifestylePractices({ healthPatterns, primaryElement }) {
  const practices = compileLifestylePractices(healthPatterns, primaryElement);

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Heart className="w-6 h-6 text-pink-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          Lifestyle & Qi Practices
        </h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Daily practices to support your constitutional balance and overall wellness
      </p>

      {/* Practices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Exercise */}
        {practices.exercise && (
          <PracticeCard
            icon={<Dumbbell className="w-5 h-5" />}
            title="Exercise & Movement"
            color="bg-green-50 border-green-200 text-green-700"
            items={practices.exercise}
          />
        )}

        {/* Sleep */}
        {practices.sleep && (
          <PracticeCard
            icon={<Moon className="w-5 h-5" />}
            title="Sleep & Rest"
            color="bg-indigo-50 border-indigo-200 text-indigo-700"
            items={practices.sleep}
          />
        )}

        {/* Mind/Spirit */}
        {practices.mindSpirit && (
          <PracticeCard
            icon={<Brain className="w-5 h-5" />}
            title="Mind & Spirit"
            color="bg-purple-50 border-purple-200 text-purple-700"
            items={practices.mindSpirit}
          />
        )}

        {/* Environment */}
        {practices.environment && (
          <PracticeCard
            icon={<Sun className="w-5 h-5" />}
            title="Environment"
            color="bg-yellow-50 border-yellow-200 text-yellow-700"
            items={practices.environment}
          />
        )}
      </div>

      {/* General Practices (always show) */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-5">
        <h3 className="font-semibold text-gray-900 mb-3">
          Universal TCM Wellness Principles
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Eat regular meals at consistent times</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Chew food thoroughly, eat mindfully</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Avoid extreme temperatures in food/drink</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Balance work and rest throughout day</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Spend time in nature regularly</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Cultivate social connections</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function PracticeCard({ icon, title, color, items }) {
  return (
    <div className={`border-2 rounded-lg p-4 ${color}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="text-sm flex items-start gap-2">
            <span className="mt-1">▸</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Compile lifestyle practices
function compileLifestylePractices(healthPatterns, primaryElement) {
  const practices = {
    exercise: [],
    sleep: [],
    mindSpirit: [],
    environment: []
  };

  // Exercise recommendations
  healthPatterns.deficiency.forEach(({ element }) => {
    const organSystem = ORGAN_SYSTEMS[element];
    const recs = organSystem.deficiency.recommendations.practices || [];
    recs.forEach(practice => {
      if (practice.toLowerCase().includes('exercise') || 
          practice.toLowerCase().includes('yoga') ||
          practice.toLowerCase().includes('stretch')) {
        practices.exercise.push(practice);
      }
    });
  });

  // Sleep recommendations
  practices.sleep.push(
    `Sleep before 11pm (Liver regenerates 1-3am)`,
    `Avoid screens 1 hour before bed`,
    `Keep bedroom cool and dark`
  );

  healthPatterns.deficiency.forEach(({ element }) => {
    if (element === 'wood') {
      practices.sleep.push('Aim for 7-8 hours to nourish Liver Blood');
    }
    if (element === 'water') {
      practices.sleep.push('Rest deeply to rebuild Kidney essence');
    }
  });

  // Mind/Spirit practices
  healthPatterns.excess.forEach(({ element }) => {
    const organSystem = ORGAN_SYSTEMS[element];
    if (element === 'wood') {
      practices.mindSpirit.push(
        'Practice forgiveness and letting go',
        'Creative expression (art, music, writing)',
        'Anger management techniques'
      );
    }
    if (element === 'fire') {
      practices.mindSpirit.push(
        'Meditation for calming the mind',
        'Reduce overstimulation',
        'Cultivate stillness and quiet'
      );
    }
    if (element === 'earth') {
      practices.mindSpirit.push(
        'Limit overthinking and worry',
        'Simplify daily routine',
        'Practice decision-making'
      );
    }
  });

  healthPatterns.deficiency.forEach(({ element }) => {
    if (element === 'fire') {
      practices.mindSpirit.push(
        'Gratitude journaling',
        'Loving-kindness meditation',
        'Pursue joyful activities'
      );
    }
    if (element === 'metal') {
      practices.mindSpirit.push(
        'Grief processing work',
        'Boundary-setting practice',
        'Letting go rituals'
      );
    }
  });

  // Environment practices
  const primaryOrgan = ORGAN_SYSTEMS[primaryElement];
  if (primaryOrgan.climate) {
    practices.environment.push(
      `Protect from excess ${primaryOrgan.climate.toLowerCase()}`,
      `Optimal temperature: moderate, avoid extremes`
    );
  }

  practices.environment.push(
    'Fresh air circulation',
    'Natural light exposure daily',
    'Minimize EMF exposure before sleep'
  );

  return practices;
}
```

**Checkpoint:** Test lifestyle practices panel

---

<a name="step-9-seasonal"></a>
## STEP 9: SEASONAL GUIDANCE COMPONENT

**Time:** 2 hours  
**File:** `src/components/bazi/health/SeasonalGuidance.jsx`

```javascript
import React, { useState } from 'react';
import { Sun, Cloud, Leaf, Snowflake } from 'lucide-react';

export function SeasonalGuidance({ 
  birthSeason, 
  primaryElement, 
  vulnerabilities 
}) {
  const [activeSeason, setActiveSeason] = useState(getCurrentSeason());

  const seasons = [
    { name: 'spring', icon: <Leaf />, color: 'green' },
    { name: 'summer', icon: <Sun />, color: 'orange' },
    { name: 'autumn', icon: <Cloud />, color: 'amber' },
    { name: 'winter', icon: <Snowflake />, color: 'blue' }
  ];

  const guidance = getSeasonalGuidance(
    activeSeason,
    birthSeason,
    primaryElement,
    vulnerabilities
  );

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Snowflake className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          Seasonal Qi Adjustment Guide
        </h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Adapt your practices throughout the year to maintain balance
      </p>

      {/* Season Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {seasons.map(({ name, icon, color }) => (
          <button
            key={name}
            onClick={() => setActiveSeason(name)}
            className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
              activeSeason === name
                ? `bg-${color}-100 text-${color}-800 border-2 border-${color}-400`
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {icon}
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </button>
        ))}
      </div>

      {/* Seasonal Content */}
      <div className="space-y-4">
        {/* Status */}
        <div className={`p-4 rounded-lg ${guidance.statusColor}`}>
          <div className="flex items-start gap-3">
            {guidance.statusIcon}
            <div>
              <h3 className="font-bold text-lg mb-1">{guidance.status}</h3>
              <p className="text-sm">{guidance.description}</p>
            </div>
          </div>
        </div>

        {/* Adjustment Level */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">
            Adjustment Intensity
          </h4>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${guidance.intensityColor}`}
                style={{ width: `${guidance.intensityLevel}%` }}
              />
            </div>
            <span className="font-bold text-gray-700">
              {guidance.intensityLevel}%
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {guidance.intensityNote}
          </p>
        </div>

        {/* Daily Protocol */}
        <div className="border-2 border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">
            Daily Protocol for {activeSeason.charAt(0).toUpperCase() + activeSeason.slice(1)}
          </h4>
          <ul className="space-y-2">
            {guidance.protocol.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <span className="text-blue-600 mt-1">✓</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Foods for Season */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <h5 className="font-semibold text-green-900 text-sm mb-2">
              Eat More
            </h5>
            <ul className="space-y-1">
              {guidance.foods.increase.map((food, idx) => (
                <li key={idx} className="text-xs text-gray-700">• {food}</li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <h5 className="font-semibold text-red-900 text-sm mb-2">
              Reduce
            </h5>
            <ul className="space-y-1">
              {guidance.foods.reduce.map((food, idx) => (
                <li key={idx} className="text-xs text-gray-700">• {food}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Get current season
function getCurrentSeason() {
  const month = new Date().getMonth(); // 0-11
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

// Generate seasonal guidance
function getSeasonalGuidance(season, birthSeason, primaryElement, vulnerabilities) {
  const isBirthSeason = season === birthSeason.toLowerCase();
  const fireDeficient = vulnerabilities.some(v => v.element === 'fire');
  const waterDeficient = vulnerabilities.some(v => v.element === 'water');

  const baseGuidance = {
    spring: {
      status: isBirthSeason ? '🌱 Natural Strength Season' : 'Spring Transition',
      description: 'Wood element thrives. Time for growth and new beginnings.',
      statusColor: 'bg-green-50 border border-green-200',
      statusIcon: <Leaf className="w-6 h-6 text-green-600" />,
      protocol: [
        'Light, upward energy - start new projects',
        'Increase green vegetables, sprouts',
        'Gentle stretching, tai chi',
        'Wake earlier with sunrise'
      ],
      foods: {
        increase: ['Leafy greens', 'Sprouts', 'Light proteins', 'Sour flavors'],
        reduce: ['Heavy foods', 'Excessive dairy', 'Late dinners']
      }
    },
    summer: {
      status: isBirthSeason ? '☀️ Natural Strength Season' : 'Summer Peak',
      description: 'Fire element at maximum. Time for joy and activity.',
      statusColor: 'bg-orange-50 border border-orange-200',
      statusIcon: <Sun className="w-6 h-6 text-orange-600" />,
      protocol: [
        'Peak activity and social time',
        'Stay hydrated, eat cooling foods',
        'Cardiovascular exercise',
        'Protect Heart from excess heat'
      ],
      foods: {
        increase: ['Watermelon', 'Cucumber', 'Bitter greens', 'Cooling herbs'],
        reduce: ['Excessive spicy foods', 'Alcohol', 'Heavy meats']
      }
    },
    autumn: {
      status: isBirthSeason ? '🍂 Natural Strength Season' : 'Autumn Harvest',
      description: 'Metal element dominant. Time for organization and release.',
      statusColor: 'bg-amber-50 border border-amber-200',
      statusIcon: <Cloud className="w-6 h-6 text-amber-600" />,
      protocol: [
        'Lung care - deep breathing exercises',
        'Process grief, let go of old',
        'Moistening foods for dryness',
        'Prepare for winter storage'
      ],
      foods: {
        increase: ['Pears', 'White foods', 'Root vegetables', 'Warming spices'],
        reduce: ['Iced drinks', 'Raw foods', 'Excess dryness']
      }
    },
    winter: {
      status: isBirthSeason ? '❄️ Natural Strength Season' : 'Winter Storage',
      description: 'Water element peak. Time for rest and restoration.',
      statusColor: 'bg-blue-50 border border-blue-200',
      statusIcon: <Snowflake className="w-6 h-6 text-blue-600" />,
      protocol: [
        'Maximum rest and sleep (before 10pm)',
        'Kidney tonification practices',
        'Keep lower back and feet warm',
        'Conserve energy, reduce activity'
      ],
      foods: {
        increase: ['Warming soups', 'Root vegetables', 'Black beans', 'Bone broth'],
        reduce: ['Cold foods', 'Raw vegetables', 'Iced drinks']
      }
    }
  };

  const guidance = baseGuidance[season];

  // Adjust for Fire deficiency
  if (fireDeficient) {
    if (season === 'winter') {
      guidance.intensityLevel = 100;
      guidance.intensityColor = 'bg-red-500';
      guidance.intensityNote = 'CRITICAL: Winter severely weakens Fire. Maximum support needed.';
      guidance.protocol.unshift(
        '🔥 PRIORITY: Warm all foods, use warming spices daily',
        '🔥 Moxibustion 2-3x/week on GV-4, HT-7'
      );
    } else if (season === 'summer') {
      guidance.intensityLevel = 30;
      guidance.intensityColor = 'bg-green-500';
      guidance.intensityNote = 'Summer naturally supports Fire. Minimal adjustment needed.';
    } else {
      guidance.intensityLevel = 70;
      guidance.intensityColor = 'bg-yellow-500';
      guidance.intensityNote = 'Moderate Fire support recommended.';
    }
  } else {
    // Default intensity
    guidance.intensityLevel = isBirthSeason ? 50 : 70;
    guidance.intensityColor = 'bg-blue-500';
    guidance.intensityNote = 'Standard seasonal adjustment protocol.';
  }

  return guidance;
}
```

**Checkpoint:** Test seasonal guidance with different seasons

---

<a name="step-10-final"></a>
## STEP 10: FINAL INTEGRATION & POLISH

**Time:** 2-3 hours

### **Final BaziHealthPage.jsx Integration:**

```javascript
import { FoodRecommendations } from '@/components/bazi/health/FoodRecommendations';
import { AcupressurePanel } from '@/components/bazi/health/AcupressurePanel';
import { LifestylePractices } from '@/components/bazi/health/LifestylePractices';
import { SeasonalGuidance } from '@/components/bazi/health/SeasonalGuidance';

export function BaziHealthPage({ profile }) {
  // ... existing calculations ...
  
  const healthPatterns = analyzeHealthPatterns(adjustedElements);
  const primaryConstitution = getPrimaryConstitution(adjustedElements);
  const vulnerabilities = getConstitutionalVulnerabilities(adjustedElements);
  
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          🏥 Constitutional Health Analysis
        </h1>
        <p className="text-lg text-gray-600">
          Complete TCM health assessment with equal pillar weighting (25/25/25/25)
        </p>
      </div>

      {/* Constitutional Health Summary */}
      <ConstitutionalHealthSummary 
        adjustedElements={adjustedElements}
        birthSeason={profile.birthSeason}
      />

      {/* Four Pillars (existing) */}
      {/* ... */}

      {/* Element Distribution (existing) */}
      {/* ... */}

      {/* Organ System Cards */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Organ System Analysis
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {Object.entries(adjustedElements)
            .sort((a, b) => b[1] - a[1])
            .map(([element, percentage]) => (
              <OrganSystemCard
                key={element}
                element={element}
                percentage={percentage}
                pattern={getElementPattern(percentage)}
                organSystem={ORGAN_SYSTEMS[element]}
              />
            ))}
        </div>
      </section>

      {/* Recommendations */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FoodRecommendations healthPatterns={healthPatterns} />
        <AcupressurePanel healthPatterns={healthPatterns} />
      </section>

      {/* Lifestyle & Seasonal */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LifestylePractices 
          healthPatterns={healthPatterns}
          primaryElement={primaryConstitution.element}
        />
        <SeasonalGuidance 
          birthSeason={profile.birthSeason}
          primaryElement={primaryConstitution.element}
          vulnerabilities={vulnerabilities}
        />
      </section>

      {/* Existing: Calculation Details, etc. */}
      {/* ... */}
    </div>
  );
}
```

---

## ✅ FINAL TESTING CHECKLIST

**Test the complete health module:**

- [ ] Constitutional Health Summary displays correctly
- [ ] All 5 Organ System Cards render
- [ ] Excess/Deficiency/Balanced patterns detected
- [ ] Symptoms lists show for problematic patterns
- [ ] Food Recommendations compile correctly
- [ ] Increase/Reduce tabs work
- [ ] Acupressure Points display with details
- [ ] Expand/collapse on point cards works
- [ ] Lifestyle Practices show for patterns
- [ ] Seasonal Guidance tabs switch properly
- [ ] Current season auto-selected
- [ ] Intensity bars display correctly
- [ ] Mobile responsive (test on phone)
- [ ] No console errors
- [ ] Loading states handled
- [ ] Edge cases (all balanced, all deficient, etc.)

---

## 🎉 COMPLETION CRITERIA

**The Health Module is COMPLETE when:**

1. ✅ All Phase 2 components render
2. ✅ All Phase 3 components render
3. ✅ Data flows correctly through all components
4. ✅ User can navigate entire health analysis
5. ✅ Recommendations are personalized to patterns
6. ✅ Seasonal guidance adapts to user's birth season
7. ✅ Mobile responsive design works
8. ✅ No JavaScript errors in console
9. ✅ Performance is acceptable (no lag)
10. ✅ Educational content is clear and accurate

---

## 📸 FINAL DELIVERABLE

**When complete, the user sees:**

1. **Summary** - Quick constitutional overview
2. **Organ Cards** - 5 detailed organ system analyses
3. **Food Guide** - Personalized dietary recommendations
4. **Acupressure** - Specific points to use daily
5. **Lifestyle** - Exercise, sleep, mind/spirit practices
6. **Seasonal** - Year-round adjustment protocol

**This transforms raw elemental data into actionable health wisdom!** 🏥✨

---

*Implementation guide complete. Ready for Brother Opus to execute!*

**Estimated Total Time: 15-18 hours spread over 2-3 weeks** 🚀
