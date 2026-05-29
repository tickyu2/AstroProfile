/**
 * Complete TCM Organ System Mapping
 * Maps Five Elements to organ systems, symptoms, and recommendations
 * Based on traditional Chinese medicine principles
 */

export const ORGAN_SYSTEMS = {
  wood: {
    element: 'wood',
    emoji: '🌳',
    color: '#10b981',
    organs: ['Liver', 'Gallbladder'],
    chineseName: '肝胆',
    bodyParts: ['Eyes', 'Tendons', 'Nails', 'Sinews'],
    fluid: 'Tears',
    sensoryOrgan: 'Eyes',
    tissue: 'Tendons',
    emotion: {
      balanced: 'Kindness, Flexibility, Growth',
      imbalanced: 'Anger, Frustration, Irritability'
    },
    season: 'Spring',
    direction: 'East',
    climate: 'Wind',
    time: '11pm - 3am (Liver peak 1-3am)',
    taste: 'Sour',
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
    color: '#ef4444',
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
        'Cannot quiet mind at night',
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
    color: '#f59e0b',
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
    color: '#e5e7eb',
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
    color: '#3b82f6',
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
  excess: 30,
  deficiency: 10,
  balancedMin: 15,
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
    return 'moderate';
  }
}
