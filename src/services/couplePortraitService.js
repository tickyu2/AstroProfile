/**
 * Couple Portrait Service
 * Generates romantic couple portraits using Baby Nano (Gemini)
 *
 * Takes Physical Layer Assessment responses and builds
 * detailed prompts for image generation
 *
 * Enhanced with BaZi-informed lighting presets and
 * Unified Soul Passport export capabilities
 */

import { getFunctions, httpsCallable } from 'firebase/functions';

/**
 * BaZi Day Master to Portrait Lighting/Color Grading Map
 * Maps the five elements to appropriate portrait aesthetics
 */
export const BAZI_LIGHTING_PRESETS = {
  // Wood (甲乙) - Growth, creativity, vitality
  wood: {
    element: 'Wood',
    yinYang: { yang: '甲 (Jia)', yin: '乙 (Yi)' },
    colorPalette: ['fresh green', 'spring tones', 'natural verdant'],
    lighting: 'soft natural morning light filtering through leaves',
    mood: 'fresh, vibrant, growth-oriented',
    style: 'natural forest lighting, fresh spring colors, verdant backdrop'
  },
  // Fire (丙丁) - Passion, warmth, radiance
  fire: {
    element: 'Fire',
    yinYang: { yang: '丙 (Bing)', yin: '丁 (Ding)' },
    colorPalette: ['warm gold', 'sunset orange', 'passionate red'],
    lighting: 'warm golden hour sunlight with sun flares',
    mood: 'passionate, radiant, dynamic',
    style: 'golden hour photography, warm romantic glow, sun-kissed skin'
  },
  // Earth (戊己) - Stability, nurturing, grounded
  earth: {
    element: 'Earth',
    yinYang: { yang: '戊 (Wu)', yin: '己 (Ji)' },
    colorPalette: ['amber', 'ochre', 'warm terracotta', 'earth tones'],
    lighting: 'soft diffused afternoon light with warm earth tones',
    mood: 'grounded, stable, nurturing',
    style: 'warm amber tones, cozy atmosphere, earthy elegance'
  },
  // Metal (庚辛) - Precision, elegance, refinement
  metal: {
    element: 'Metal',
    yinYang: { yang: '庚 (Geng)', yin: '辛 (Xin)' },
    colorPalette: ['silver', 'platinum', 'cool grey', 'white gold'],
    lighting: 'crisp clean studio lighting with silver reflections',
    mood: 'refined, elegant, precise',
    style: 'high contrast, clean lines, sophisticated metallic accents'
  },
  // Water (壬癸) - Wisdom, depth, mystery
  water: {
    element: 'Water',
    yinYang: { yang: '壬 (Ren)', yin: '癸 (Gui)' },
    colorPalette: ['deep blue', 'teal', 'midnight', 'aquamarine'],
    lighting: 'cool blue hour twilight with mysterious depth',
    mood: 'mysterious, deep, contemplative',
    style: 'cool teal and blue tones, cinematic depth, twilight ambiance'
  }
};

/**
 * Get BaZi lighting preset from Day Master element
 * @param {string} dayMaster - Day Master stem (e.g., '甲', 'Jia Wood', 'wood')
 * @returns {Object} Lighting preset configuration
 */
export function getBaziLightingPreset(dayMaster) {
  if (!dayMaster) return BAZI_LIGHTING_PRESETS.earth; // Default to Earth

  const dm = dayMaster.toLowerCase();

  // Check for element keywords
  if (dm.includes('wood') || dm.includes('甲') || dm.includes('乙') || dm.includes('jia') || dm.includes('yi')) {
    return BAZI_LIGHTING_PRESETS.wood;
  }
  if (dm.includes('fire') || dm.includes('丙') || dm.includes('丁') || dm.includes('bing') || dm.includes('ding')) {
    return BAZI_LIGHTING_PRESETS.fire;
  }
  if (dm.includes('earth') || dm.includes('戊') || dm.includes('己') || dm.includes('wu') || dm.includes('ji')) {
    return BAZI_LIGHTING_PRESETS.earth;
  }
  if (dm.includes('metal') || dm.includes('庚') || dm.includes('辛') || dm.includes('geng') || dm.includes('xin')) {
    return BAZI_LIGHTING_PRESETS.metal;
  }
  if (dm.includes('water') || dm.includes('壬') || dm.includes('癸') || dm.includes('ren') || dm.includes('gui')) {
    return BAZI_LIGHTING_PRESETS.water;
  }

  return BAZI_LIGHTING_PRESETS.earth; // Default
}

/**
 * Build unified Soul Passport for a person
 * Combines Physical Layer + BaZi + Western + Big Five
 */
export function buildSoulPassport(physicalData, profileData = {}) {
  const passport = {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    type: 'soul_passport',

    // Identity
    identity: {
      name: profileData.displayName || profileData.name || 'Unknown',
      gender: physicalData?.gender,
      ethnicity: physicalData?.ethnicity,
      birthDate: profileData.birthDate,
      era: profileData.era || 'Contemporary'
    },

    // Physical Layer
    physicalLayer: {
      height: physicalData?.height,
      build: physicalData?.build,
      muscleDefinition: physicalData?.muscleDefinition,
      proportions: physicalData?.proportions,
      skinTone: physicalData?.skinTone,
      skinFinish: physicalData?.skinFinish,
      hairColor: physicalData?.hairColor,
      hairTexture: physicalData?.hairTexture,
      hairLength: physicalData?.hairLength,
      hairstyle: physicalData?.hairstyle,
      eyeColor: physicalData?.eyeColor,
      eyeExpression: physicalData?.eyeExpression,
      faceShape: physicalData?.faceShape,
      jawline: physicalData?.jawline,
      cheekbones: physicalData?.cheekbones
    },

    // Style & Expression
    styleExpression: {
      expressionVibe: physicalData?.expressionVibe,
      posture: physicalData?.posture,
      smileType: physicalData?.smileType,
      vibeTags: physicalData?.vibeTags,
      socialBattery: physicalData?.socialBattery,
      riskTolerance: physicalData?.riskTolerance,
      styleFashion: physicalData?.styleFashion
    },

    // BaZi Astrology (from profile)
    baziAstrology: profileData.baziChart ? {
      dayMaster: profileData.baziChart.dayMaster,
      dayMasterElement: profileData.baziChart.dayMasterElement,
      fourPillars: profileData.baziChart.fourPillars,
      usefulGod: profileData.baziChart.usefulGod,
      elementalBalance: profileData.baziChart.elementalBalance
    } : null,

    // Western Astrology (from profile)
    westernAstrology: profileData.westernChart ? {
      sunSign: profileData.westernChart.sunSign,
      moonSign: profileData.westernChart.moonSign,
      risingSign: profileData.westernChart.ascendant,
      dominantElement: profileData.westernChart.dominantElement
    } : null,

    // Big Five / OCEAN (from assessments)
    personality: profileData.bigFive ? {
      openness: profileData.bigFive.openness,
      conscientiousness: profileData.bigFive.conscientiousness,
      extraversion: profileData.bigFive.extraversion,
      agreeableness: profileData.bigFive.agreeableness,
      neuroticism: profileData.bigFive.neuroticism
    } : null,

    // Portrait Preferences
    portraitPreferences: {
      attire: physicalData?.portraitAttire,
      accessories: physicalData?.accessories,
      customDetails: physicalData?.customDetails
    },

    // Derived: BaZi-informed lighting
    recommendedLighting: profileData.baziChart?.dayMasterElement
      ? getBaziLightingPreset(profileData.baziChart.dayMasterElement)
      : null
  };

  return passport;
}

/**
 * Convert Soul Passport to Markdown format
 */
export function soulPassportToMarkdown(passport, title = 'Soul Passport') {
  let md = `# ${title}\n\n`;
  md += `**Exported:** ${new Date().toLocaleString()}\n`;
  md += `**Version:** ${passport.version}\n\n`;
  md += `---\n\n`;

  // Identity
  md += `## 🆔 Identity\n\n`;
  if (passport.identity.name) md += `- **Name:** ${passport.identity.name}\n`;
  if (passport.identity.gender) md += `- **Gender:** ${passport.identity.gender}\n`;
  if (passport.identity.ethnicity) md += `- **Ethnicity:** ${passport.identity.ethnicity}\n`;
  if (passport.identity.birthDate) md += `- **Birth Date:** ${passport.identity.birthDate}\n`;
  if (passport.identity.era) md += `- **Era:** ${passport.identity.era}\n`;
  md += `\n`;

  // Physical Layer
  md += `## 🏋️ Physical Layer\n\n`;
  const physical = passport.physicalLayer;
  if (physical.height?.display) md += `- **Height:** ${physical.height.display}\n`;
  if (physical.build) md += `- **Build:** ${physical.build}\n`;
  if (physical.skinTone) md += `- **Skin Tone:** ${physical.skinTone}\n`;
  if (physical.skinFinish) md += `- **Skin Finish:** ${physical.skinFinish}\n`;
  if (physical.hairColor) md += `- **Hair Color:** ${physical.hairColor}\n`;
  if (physical.hairstyle) md += `- **Hairstyle:** ${physical.hairstyle}\n`;
  if (physical.eyeColor) md += `- **Eye Color:** ${physical.eyeColor}\n`;
  if (physical.eyeExpression) md += `- **Eye Expression:** ${physical.eyeExpression}\n`;
  if (physical.faceShape) md += `- **Face Shape:** ${physical.faceShape}\n`;
  if (physical.jawline) md += `- **Jawline:** ${physical.jawline}\n`;
  md += `\n`;

  // Style & Expression
  md += `## ✨ Style & Expression\n\n`;
  const style = passport.styleExpression;
  if (style.expressionVibe) md += `- **Expression/Vibe:** ${style.expressionVibe}\n`;
  if (style.posture) md += `- **Posture:** ${style.posture}\n`;
  if (style.smileType) md += `- **Smile Type:** ${style.smileType}\n`;
  if (style.vibeTags && Array.isArray(style.vibeTags)) md += `- **Vibe Tags:** ${style.vibeTags.join(', ')}\n`;
  if (style.socialBattery) md += `- **Social Battery:** ${style.socialBattery}%\n`;
  if (style.riskTolerance) md += `- **Risk Tolerance:** ${style.riskTolerance}\n`;
  md += `\n`;

  // BaZi Astrology
  if (passport.baziAstrology) {
    md += `## 🔮 BaZi Astrology\n\n`;
    const bazi = passport.baziAstrology;
    if (bazi.dayMaster) md += `- **Day Master:** ${bazi.dayMaster}\n`;
    if (bazi.dayMasterElement) md += `- **Day Master Element:** ${bazi.dayMasterElement}\n`;
    if (bazi.usefulGod) md += `- **Useful God (用神):** ${bazi.usefulGod}\n`;
    if (bazi.elementalBalance) md += `- **Elemental Balance:** ${JSON.stringify(bazi.elementalBalance)}\n`;
    md += `\n`;
  }

  // Western Astrology
  if (passport.westernAstrology) {
    md += `## ⭐ Western Astrology\n\n`;
    const western = passport.westernAstrology;
    if (western.sunSign) md += `- **Sun Sign:** ${western.sunSign}\n`;
    if (western.moonSign) md += `- **Moon Sign:** ${western.moonSign}\n`;
    if (western.risingSign) md += `- **Rising Sign:** ${western.risingSign}\n`;
    if (western.dominantElement) md += `- **Dominant Element:** ${western.dominantElement}\n`;
    md += `\n`;
  }

  // Personality (Big Five)
  if (passport.personality) {
    md += `## 🧠 Personality (OCEAN)\n\n`;
    const p = passport.personality;
    if (p.openness !== undefined) md += `- **Openness:** ${p.openness}\n`;
    if (p.conscientiousness !== undefined) md += `- **Conscientiousness:** ${p.conscientiousness}\n`;
    if (p.extraversion !== undefined) md += `- **Extraversion:** ${p.extraversion}\n`;
    if (p.agreeableness !== undefined) md += `- **Agreeableness:** ${p.agreeableness}\n`;
    if (p.neuroticism !== undefined) md += `- **Neuroticism:** ${p.neuroticism}\n`;
    md += `\n`;
  }

  // Recommended Lighting
  if (passport.recommendedLighting) {
    md += `## 🎬 Recommended Portrait Lighting\n\n`;
    const light = passport.recommendedLighting;
    md += `- **Element:** ${light.element}\n`;
    md += `- **Color Palette:** ${light.colorPalette.join(', ')}\n`;
    md += `- **Lighting Style:** ${light.lighting}\n`;
    md += `- **Mood:** ${light.mood}\n`;
    md += `\n`;
  }

  // Portrait Preferences
  md += `## 🎨 Portrait Preferences\n\n`;
  const prefs = passport.portraitPreferences;
  if (prefs.attire) md += `- **Attire:** ${prefs.attire}\n`;
  if (prefs.accessories && Array.isArray(prefs.accessories)) md += `- **Accessories:** ${prefs.accessories.join(', ')}\n`;
  if (prefs.customDetails) md += `- **Custom Details:** ${prefs.customDetails}\n`;
  md += `\n`;

  return md;
}

/**
 * Build scene/background export object
 */
export function buildSceneExport(sceneKey, customDetails, baziLighting) {
  const scene = SCENE_PRESETS[sceneKey] || null;

  return {
    exportedAt: new Date().toISOString(),
    type: 'portrait_scene',
    sceneKey: sceneKey || 'custom',
    sceneName: scene?.name || 'Custom Scene',
    sceneIcon: scene?.icon || '🎨',
    scenePrompt: scene?.prompt || customDetails || 'romantic setting',
    sceneStyle: scene?.style || 'cinematic romantic',
    baziLighting: baziLighting,
    customDetails: customDetails
  };
}

/**
 * Build full prompt export object (what gets sent to Baby Nano)
 */
export function buildFullPromptExport(physicalLayer, sceneKey, customPrompt, profileData = {}, proMode = false) {
  const prompt = customPrompt || (sceneKey
    ? buildPromptWithScene(physicalLayer, sceneKey)
    : buildCouplePortraitPrompt(physicalLayer));

  const baziLighting = profileData.baziChart?.dayMasterElement
    ? getBaziLightingPreset(profileData.baziChart.dayMasterElement)
    : null;

  return {
    exportedAt: new Date().toISOString(),
    type: 'full_portrait_prompt',
    proMode: proMode,
    model: proMode ? 'gemini-3-pro-image-preview' : 'gemini-2.0-flash-exp',
    prompt: prompt,
    promptLength: prompt?.length || 0,

    // Components
    person1: buildSoulPassport(physicalLayer?.me, profileData),
    person2: buildSoulPassport(physicalLayer?.idealType, {}),
    scene: buildSceneExport(sceneKey, physicalLayer?.me?.customDetails, baziLighting),

    // BaZi Enhancement
    baziEnhancement: baziLighting ? {
      applied: true,
      element: baziLighting.element,
      lightingStyle: baziLighting.lighting,
      colorPalette: baziLighting.colorPalette
    } : { applied: false }
  };
}

/**
 * Build image prompt from Physical Layer responses
 * @param {Object} physicalLayer - Physical layer responses with { me, idealType }
 * @returns {string} Detailed image generation prompt
 */
export function buildCouplePortraitPrompt(physicalLayer) {
  const { me, idealType } = physicalLayer;

  if (!me || !idealType) {
    return null;
  }

  // Helper to get label from value
  const getLabel = (value) => {
    if (!value) return null;
    if (typeof value === 'string') return value.replace(/-/g, ' ');
    if (value.display) return value.display;
    return null;
  };

  // Build person description
  const buildPersonDescription = (person, role) => {
    const parts = [];

    // Gender
    if (person.gender && person.gender !== 'no-preference') {
      parts.push(getLabel(person.gender));
    }

    // Ethnicity (important for accurate portraits)
    if (person.ethnicity && person.ethnicity !== 'no-preference') {
      const ethnicityMap = {
        'east-asian': 'East Asian',
        'chinese': 'Chinese',
        'southeast-asian': 'Southeast Asian',
        'south-asian': 'South Asian',
        'middle-eastern': 'Middle Eastern',
        'european': 'European',
        'scandinavian': 'Scandinavian',
        'eastern-european': 'Eastern European',
        'latino': 'Latino',
        'pacific-islander': 'Pacific Islander',
        'caucasian': 'Caucasian',
        'african': 'African',
        'mixed': 'mixed ethnicity',
        'other': ''
      };
      const ethnicLabel = ethnicityMap[person.ethnicity] || getLabel(person.ethnicity);
      if (ethnicLabel) {
        parts.push(ethnicLabel);
      }
    }

    // Build/body type
    if (person.build && person.build !== 'no-preference') {
      parts.push(getLabel(person.build) + ' build');
    }

    // Height
    if (person.height && person.height.display) {
      parts.push(person.height.display + ' tall');
    }

    // Skin tone
    if (person.skinTone && person.skinTone !== 'no-preference') {
      parts.push(getLabel(person.skinTone) + ' skin');
    }

    // Skin finish (for accurate texture)
    if (person.skinFinish && person.skinFinish !== 'no-preference') {
      const skinFinishMap = {
        'matte': 'matte',
        'natural': 'natural',
        'dewy-glowing': 'dewy glowing',
        'oily-shiny': 'shiny',
        'weathered': 'weathered rugged'
      };
      const finishLabel = skinFinishMap[person.skinFinish] || getLabel(person.skinFinish);
      if (finishLabel) {
        parts.push(finishLabel + ' skin finish');
      }
    }

    // Hair (with specific hairstyle)
    const hairParts = [];
    if (person.hairColor && person.hairColor !== 'no-preference') {
      hairParts.push(getLabel(person.hairColor));
    }
    if (person.hairTexture && person.hairTexture !== 'no-preference') {
      hairParts.push(getLabel(person.hairTexture));
    }
    if (person.hairLength && person.hairLength !== 'no-preference') {
      hairParts.push(getLabel(person.hairLength));
    }
    if (hairParts.length > 0) {
      parts.push(hairParts.join(' ') + ' hair');
    }

    // Specific hairstyle
    if (person.hairstyle && person.hairstyle !== 'no-preference') {
      const hairstyleMap = {
        'natural-free': 'natural free-flowing',
        'side-part': 'side parted',
        'middle-part': 'middle parted',
        'slicked-back': 'slicked back',
        'undercut': 'undercut style',
        'pompadour': 'pompadour',
        'fade': 'fade haircut',
        'layered': 'layered',
        'curtain-bangs': 'curtain bangs',
        'bob': 'bob cut',
        'pixie': 'pixie cut',
        'braids': 'braided',
        'locs': 'dreadlocks',
        'ponytail': 'ponytail',
        'man-bun': 'man bun',
        'afro': 'afro',
        'buzz-crew': 'buzz cut'
      };
      const styleLabel = hairstyleMap[person.hairstyle] || getLabel(person.hairstyle);
      if (styleLabel) {
        parts.push('styled in ' + styleLabel);
      }
    }

    // Eyes
    if (person.eyeColor && person.eyeColor !== 'no-preference') {
      parts.push(getLabel(person.eyeColor) + ' eyes');
    }

    // Eye expression (for accurate gaze/look)
    if (person.eyeExpression && person.eyeExpression !== 'no-preference') {
      const eyeExprMap = {
        'intense-piercing': 'intense piercing gaze',
        'soft-warm': 'soft warm eyes',
        'dreamy-distant': 'dreamy distant look',
        'playful-sparkling': 'playful sparkling eyes',
        'mysterious-deep': 'mysterious deep eyes',
        'kind-gentle': 'kind gentle eyes',
        'confident-direct': 'confident direct gaze',
        'sleepy-relaxed': 'relaxed sleepy eyes'
      };
      const eyeLabel = eyeExprMap[person.eyeExpression] || getLabel(person.eyeExpression);
      if (eyeLabel) {
        parts.push('with ' + eyeLabel);
      }
    }

    // Face shape
    if (person.faceShape && person.faceShape !== 'no-preference') {
      parts.push(getLabel(person.faceShape) + ' face');
    }

    // Facial hair (if applicable)
    if (person.facialHair && person.facialHair !== 'no-preference' && person.facialHair !== 'not-applicable' && person.facialHair !== 'clean-shaven') {
      parts.push('with ' + getLabel(person.facialHair));
    }

    // Glasses
    if (person.glasses && person.glasses !== 'no-preference' && person.glasses !== 'none' && person.glasses !== 'contacts') {
      parts.push('wearing glasses');
    }

    // Special features
    if (person.dimples && person.dimples !== 'no-preference' && person.dimples !== 'none') {
      parts.push('with dimples');
    }

    // Tattoos
    if (person.tattoos && person.tattoos !== 'no-preference' && person.tattoos !== 'none') {
      parts.push('with ' + getLabel(person.tattoos) + ' tattoos');
    }

    // Expression/Vibe (overall presence)
    if (person.expressionVibe && person.expressionVibe !== 'no-preference') {
      const vibeMap = {
        'confident-bold': 'confident bold presence',
        'mysterious-reserved': 'mysterious reserved aura',
        'warm-approachable': 'warm approachable demeanor',
        'playful-mischievous': 'playful mischievous energy',
        'serious-intense': 'serious intense presence',
        'relaxed-easygoing': 'relaxed easygoing vibe',
        'elegant-refined': 'elegant refined manner',
        'energetic-outgoing': 'energetic outgoing energy',
        'intellectual-thoughtful': 'intellectual thoughtful look'
      };
      const vibeLabel = vibeMap[person.expressionVibe] || getLabel(person.expressionVibe);
      if (vibeLabel) {
        parts.push('with ' + vibeLabel);
      }
    }

    // Posture
    if (person.posture && person.posture !== 'no-preference') {
      const postureMap = {
        'confident-upright': 'confident upright posture',
        'relaxed-casual': 'relaxed casual stance',
        'athletic-dynamic': 'athletic dynamic pose',
        'graceful-elegant': 'graceful elegant posture',
        'powerful-commanding': 'powerful commanding stance',
        'shy-reserved': 'shy reserved posture',
        'lean-in-engaged': 'leaning in engaged posture'
      };
      const postureLabel = postureMap[person.posture] || getLabel(person.posture);
      if (postureLabel) {
        parts.push(postureLabel);
      }
    }

    // Smile type
    if (person.smileType && person.smileType !== 'no-preference') {
      const smileMap = {
        'subtle-closed': 'subtle closed-lip smile',
        'warm-slight': 'warm slight smile',
        'big-teeth': 'big smile showing teeth',
        'grin-wide': 'wide grin',
        'smirk': 'playful smirk',
        'neutral-serious': 'neutral serious expression',
        'laugh': 'laughing joyfully'
      };
      const smileLabel = smileMap[person.smileType] || getLabel(person.smileType);
      if (smileLabel) {
        parts.push(smileLabel);
      }
    }

    return parts.join(', ');
  };

  // Build attire description
  const buildAttireDescription = (person) => {
    const attire = person.portraitAttire;
    if (!attire || attire === 'no-preference') {
      return 'casual elegant attire';
    }

    const attireMap = {
      'casual': 'casual everyday wear',
      'business': 'professional business attire',
      'sporty': 'athletic sporty wear',
      'swimwear': 'elegant swimwear on the beach',
      'western': 'western style with jeans and boots',
      'traditional-chinese': 'beautiful traditional Chinese attire',
      'formal-gown': 'elegant formal evening wear',
      'wedding': 'stunning wedding attire',
      'ethnic': 'beautiful ethnic cultural attire',
      'costume': 'creative fantasy costume'
    };

    return attireMap[attire] || 'elegant attire';
  };

  // Build accessories description
  const buildAccessoriesDescription = (person) => {
    const accessories = person.accessories;
    if (!accessories || !Array.isArray(accessories) || accessories.length === 0) {
      return '';
    }

    const filtered = accessories.filter(a => a !== 'no-preference' && a !== 'none');
    if (filtered.length === 0) return '';

    const accessoryLabels = filtered.map(a => {
      const map = {
        'watch': 'elegant watch',
        'jewelry-necklace': 'necklace',
        'jewelry-bracelet': 'bracelet',
        'jewelry-rings': 'rings',
        'jewelry-earrings': 'earrings',
        'hat': 'stylish hat',
        'sunglasses': 'sunglasses',
        'scarf': 'scarf',
        'bag': 'designer bag',
        'belt': 'belt',
        'tie': 'tie',
        'gloves': 'gloves',
        'headband': 'headband'
      };
      return map[a] || a;
    });

    return 'wearing ' + accessoryLabels.join(', ');
  };

  // Build the full prompt
  const person1Desc = buildPersonDescription(me, 'person 1');
  const person2Desc = buildPersonDescription(idealType, 'person 2');
  const person1Attire = buildAttireDescription(me);
  const person2Attire = buildAttireDescription(idealType);
  const person1Accessories = buildAccessoriesDescription(me);
  const person2Accessories = buildAccessoriesDescription(idealType);

  // Scene/custom details
  let sceneDescription = 'romantic setting with soft golden lighting';
  if (me.customDetails || idealType.customDetails) {
    sceneDescription = me.customDetails || idealType.customDetails;
  }

  // Calculate height difference for realistic proportions
  let heightNote = '';
  if (me.height && idealType.height) {
    const heightDiff = idealType.height.cm - me.height.cm;
    if (Math.abs(heightDiff) > 5) {
      heightNote = heightDiff > 0
        ? ', the second person is noticeably taller'
        : ', the first person is noticeably taller';
    }
  }

  const prompt = `A beautiful romantic couple portrait.

First person: ${person1Desc}, dressed in ${person1Attire}${person1Accessories ? ', ' + person1Accessories : ''}.

Second person: ${person2Desc}, dressed in ${person2Attire}${person2Accessories ? ', ' + person2Accessories : ''}${heightNote}.

Scene: ${sceneDescription}.

Style: Cinematic, soft romantic lighting, professional portrait photography, 8K quality, hyperrealistic, emotional connection between the couple, warm and loving atmosphere.`;

  return prompt;
}

/**
 * Scene presets with full prompt templates
 */
export const SCENE_PRESETS = {
  beach: {
    name: 'Beach Sunset',
    icon: '🏖️',
    prompt: 'Walking hand in hand on a pristine beach at golden hour sunset, waves gently lapping at their feet, warm orange and pink sky reflected on the water, barefoot in the sand',
    style: 'golden hour photography, romantic beach vibes, sun flares'
  },
  garden: {
    name: 'Rose Garden',
    icon: '🌹',
    prompt: 'Standing together in a beautiful rose garden with morning dew, surrounded by blooming roses in soft pink and red, elegant and romantic atmosphere',
    style: 'soft morning light, dreamy romantic, floral elegance'
  },
  cafe: {
    name: 'Cozy Cafe',
    icon: '☕',
    prompt: 'Sitting close together at a cozy European cafe, intimate coffee date moment, warm ambient lighting, looking into each others eyes',
    style: 'warm indoor lighting, intimate atmosphere, candid romantic'
  },
  adventure: {
    name: 'Mountain Adventure',
    icon: '⛰️',
    prompt: 'Standing together at a scenic mountain overlook, breathtaking vista behind them, adventure couple vibes, natural beauty',
    style: 'epic landscape, adventure photography, natural lighting'
  },
  city: {
    name: 'City Lights',
    icon: '🌃',
    prompt: 'Romantic evening in the city, surrounded by twinkling city lights, elegant urban setting, sophisticated couple',
    style: 'night photography, bokeh city lights, urban romance'
  },
  autumn: {
    name: 'Autumn Romance',
    icon: '🍂',
    prompt: 'Walking through a beautiful autumn forest, golden and red leaves falling around them, cozy sweater weather, warm earth tones',
    style: 'warm autumn colors, golden light filtering through trees, cozy romantic'
  },
  paris: {
    name: 'Parisian Dream',
    icon: '🗼',
    prompt: 'Romantic moment with the Eiffel Tower softly lit in the background, classic Parisian elegance, timeless romance',
    style: 'classic romantic, soft evening glow, Parisian elegance'
  },
  winter: {
    name: 'Winter Wonderland',
    icon: '❄️',
    prompt: 'Embracing in a magical winter wonderland, soft snowflakes falling around them, cozy winter fashion, warm despite the cold',
    style: 'soft winter light, snowflakes, warm and cozy despite the cold'
  }
};

/**
 * Build prompt with scene preset
 */
export function buildPromptWithScene(physicalLayer, sceneKey) {
  const basePrompt = buildCouplePortraitPrompt(physicalLayer);
  if (!basePrompt) return null;

  const scene = SCENE_PRESETS[sceneKey];
  if (!scene) return basePrompt;

  // Replace scene description in prompt
  return basePrompt.replace(
    /Scene:.*Style:/s,
    `Scene: ${scene.prompt}.\n\nStyle: ${scene.style},`
  );
}

/**
 * Generate couple portrait via Cloud Function
 * @param {Object} physicalLayer - Physical layer responses
 * @param {string} sceneKey - Scene preset key (optional)
 * @param {string} customPrompt - Custom prompt override (optional)
 * @param {boolean} proMode - Use Pro 4K mode for higher quality (optional)
 * @returns {Promise<Object>} - { success, imageUrl, prompt, error, proMode }
 */
export async function generateCouplePortrait(physicalLayer, sceneKey = null, customPrompt = null, proMode = false) {
  try {
    const functions = getFunctions();
    const generatePortrait = httpsCallable(functions, 'generateCouplePortrait');

    // Build prompt
    let prompt;
    if (customPrompt) {
      prompt = customPrompt;
    } else if (sceneKey) {
      prompt = buildPromptWithScene(physicalLayer, sceneKey);
    } else {
      prompt = buildCouplePortraitPrompt(physicalLayer);
    }

    if (!prompt) {
      return { success: false, error: 'Could not build prompt from physical layer data' };
    }

    const modeLabel = proMode ? 'PRO 4K' : 'standard';
    console.log(`🎨 Generating couple portrait (${modeLabel}) with prompt:`, prompt.slice(0, 200) + '...');

    const result = await generatePortrait({ prompt, proMode });

    return {
      success: result.data.success,
      imageData: result.data.image,
      imageUrl: result.data.imageUrl,
      prompt: prompt,
      model: result.data.model,
      proMode: result.data.proMode,
      error: result.data.error
    };
  } catch (error) {
    console.error('Error generating couple portrait:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Save portrait to Firebase Storage
 * @param {string} imageData - Base64 image data
 * @param {string} profileId - Profile ID
 * @param {string} filename - Filename to save as
 * @returns {Promise<string>} - Download URL
 */
export async function savePortraitToStorage(imageData, profileId, filename = null) {
  try {
    const functions = getFunctions();
    const savePortrait = httpsCallable(functions, 'saveCouplePortrait');

    const result = await savePortrait({
      imageData,
      profileId,
      filename: filename || `couple-portrait-${Date.now()}.png`
    });

    return result.data.downloadUrl;
  } catch (error) {
    console.error('Error saving portrait:', error);
    throw error;
  }
}

/**
 * Get saved portraits for a profile
 * @param {string} profileId - Profile ID
 * @returns {Promise<Array>} - Array of portrait metadata
 */
export async function getProfilePortraits(profileId) {
  try {
    const functions = getFunctions();
    const getPortraits = httpsCallable(functions, 'getProfilePortraits');

    const result = await getPortraits({ profileId });
    return result.data.portraits || [];
  } catch (error) {
    console.error('Error fetching portraits:', error);
    return [];
  }
}
