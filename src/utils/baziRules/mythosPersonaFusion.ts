/**
 * ============================================
 * MYTHOS-PERSONA FUSION LAYER
 * Where mythic archetypes merge with Luna's persona voice
 *
 * This is the mythic intelligence engine that produces
 * archetypal guidance by fusing:
 * - Ancestral archetypes (mythic patterns)
 * - Luna's persona messages (living voice)
 * - Pilgrim context (current position)
 *
 * The result is deeply personalized mythic wisdom.
 * ============================================
 */

import { AncestralArchetype } from './mythosLayer';
import { AncestralPersonaMessage, AncestralVoiceType } from './ancestralPersona';
import { PilgrimPosition } from './journeyWithGenerations';

// ==================== DATA MODEL ====================

export interface MythosPersonaFusion {
  archetypeId: string;
  archetypeName: string;
  archetypeNameZh: string;
  personaVoice: string;
  personaVoiceZh: string;
  mythicVoice: string;
  mythicVoiceZh: string;
  fusedMessage: string;
  fusedMessageZh: string;
  resonanceThemes: string[];
  intensity: 'whisper' | 'normal' | 'strong' | 'profound';
}

export interface FusionLayer {
  fusions: MythosPersonaFusion[];
  pilgrimAddress: string;
  pilgrimAddressZh: string;
  overallMythicTone: string;
  overallMythicToneZh: string;
  dominantArchetype?: MythosPersonaFusion;
  shadowArchetype?: MythosPersonaFusion;
}

export interface FusionOptions {
  includeShadow?: boolean;
  prioritizeInherited?: boolean;
  voiceFilter?: AncestralVoiceType;
  maxFusions?: number;
}

// ==================== MYTHIC VOICE TEMPLATES ====================

const MYTHIC_VOICE_TEMPLATES = {
  carrier: {
    en: (name: string) => `You carry the archetype of the "${name}". Its light and shadow continue through you.`,
    zh: (name: string) => `你承载着「${name}」的原型。它的光与影，都在你身上继续。`
  },
  awakening: {
    en: (name: string) => `The "${name}" awakens within you. Listen to its ancient call.`,
    zh: (name: string) => `「${name}」在你内在觉醒。聆听它古老的呼唤。`
  },
  gift: {
    en: (name: string, gifts: string[]) => `The "${name}" offers you these gifts: ${gifts.join(', ')}. Receive them with intention.`,
    zh: (name: string, gifts: string[]) => `「${name}」给予你这些礼物：${gifts.join('、')}。以意愿接收它们。`
  },
  shadow: {
    en: (name: string, shadows: string[]) => `The shadow of the "${name}" whispers: ${shadows.join(', ')}. Know it, but do not be ruled by it.`,
    zh: (name: string, shadows: string[]) => `「${name}」的阴影低语：${shadows.join('、')}。认识它，但不要被它统治。`
  },
  integration: {
    en: (name: string) => `As you integrate the "${name}", its wisdom becomes your wisdom.`,
    zh: (name: string) => `当你整合「${name}」，它的智慧成为你的智慧。`
  }
};

const PILGRIM_ADDRESS_TEMPLATES = {
  inherited: {
    en: 'Child of the lineage, you carry what your ancestors could not complete.',
    zh: '血脉之子，你承载着祖先未能完成的。'
  },
  breaker: {
    en: 'Pattern-breaker, you stand at the threshold of transformation.',
    zh: '模式打破者，你站在转化的门槛。'
  },
  founder: {
    en: 'Seed-planter, you begin what future generations will harvest.',
    zh: '播种者，你开始了后代将收获的。'
  },
  witness: {
    en: 'Witness of the lineage, you see what others could not see.',
    zh: '血脉的见证者，你看见他人看不见的。'
  }
};

// ==================== FUSION ENGINE ====================

/**
 * Fuse archetypes with persona messages
 */
export function fuseMythosAndPersona(
  archetypes: AncestralArchetype[],
  personaMessages: AncestralPersonaMessage[],
  options: FusionOptions = {}
): MythosPersonaFusion[] {
  const { includeShadow = true, prioritizeInherited = true, voiceFilter, maxFusions } = options;
  const fusions: MythosPersonaFusion[] = [];

  // Filter persona messages if voice filter is specified
  const filteredMessages = voiceFilter
    ? personaMessages.filter(p => p.voice === voiceFilter)
    : personaMessages;

  archetypes.forEach(arch => {
    // Find persona messages that resonate with this archetype's themes
    const relatedPersona = filteredMessages.filter(p =>
      arch.themes.some(theme =>
        theme.toLowerCase().includes(p.theme.toLowerCase()) ||
        p.theme.toLowerCase().includes(theme.toLowerCase())
      )
    );

    // Build persona voice (combined messages)
    const personaVoiceEn = relatedPersona
      .map(p => p.message)
      .join(' ');

    const personaVoiceZh = relatedPersona
      .map(p => p.messageZh || p.message)
      .join(' ');

    // Build mythic voice
    const mythicVoiceEn = MYTHIC_VOICE_TEMPLATES.carrier.en(arch.name);
    const mythicVoiceZh = MYTHIC_VOICE_TEMPLATES.carrier.zh(arch.nameZh);

    // Fuse the voices
    const fusedEn = [
      mythicVoiceEn,
      personaVoiceEn.length > 0 ? personaVoiceEn : ''
    ].filter(Boolean).join(' ');

    const fusedZh = [
      mythicVoiceZh,
      personaVoiceZh.length > 0 ? personaVoiceZh : ''
    ].filter(Boolean).join(' ');

    // Calculate intensity based on resonance
    const resonanceCount = relatedPersona.length;
    const intensity: MythosPersonaFusion['intensity'] =
      resonanceCount === 0 ? 'whisper' :
      resonanceCount <= 2 ? 'normal' :
      resonanceCount <= 4 ? 'strong' : 'profound';

    fusions.push({
      archetypeId: arch.id,
      archetypeName: arch.name,
      archetypeNameZh: arch.nameZh,
      personaVoice: personaVoiceEn,
      personaVoiceZh: personaVoiceZh,
      mythicVoice: mythicVoiceEn,
      mythicVoiceZh: mythicVoiceZh,
      fusedMessage: fusedEn.trim(),
      fusedMessageZh: fusedZh.trim(),
      resonanceThemes: relatedPersona.map(p => p.theme),
      intensity
    });
  });

  // Sort by intensity (strongest first)
  const intensityOrder = { profound: 0, strong: 1, normal: 2, whisper: 3 };
  fusions.sort((a, b) => intensityOrder[a.intensity] - intensityOrder[b.intensity]);

  // Limit if maxFusions specified
  return maxFusions ? fusions.slice(0, maxFusions) : fusions;
}

/**
 * Build complete fusion layer
 */
export function buildFusionLayer(
  archetypes: AncestralArchetype[],
  personaMessages: AncestralPersonaMessage[],
  position?: PilgrimPosition,
  options: FusionOptions = {}
): FusionLayer {
  const fusions = fuseMythosAndPersona(archetypes, personaMessages, options);

  // Determine pilgrim address based on position
  let pilgrimAddress = PILGRIM_ADDRESS_TEMPLATES.witness.en;
  let pilgrimAddressZh = PILGRIM_ADDRESS_TEMPLATES.witness.zh;

  if (position) {
    if (position.brokenPatterns.length > 0) {
      pilgrimAddress = PILGRIM_ADDRESS_TEMPLATES.breaker.en;
      pilgrimAddressZh = PILGRIM_ADDRESS_TEMPLATES.breaker.zh;
    } else if (position.newPatterns.length > 0) {
      pilgrimAddress = PILGRIM_ADDRESS_TEMPLATES.founder.en;
      pilgrimAddressZh = PILGRIM_ADDRESS_TEMPLATES.founder.zh;
    } else if (position.inheritedThemes.length > 0) {
      pilgrimAddress = PILGRIM_ADDRESS_TEMPLATES.inherited.en;
      pilgrimAddressZh = PILGRIM_ADDRESS_TEMPLATES.inherited.zh;
    }
  }

  // Identify dominant and shadow archetypes
  const dominant = fusions.find(f => f.intensity === 'profound' || f.intensity === 'strong');
  const shadow = options.includeShadow !== false
    ? fusions.find(f => f.intensity === 'whisper')
    : undefined;

  // Build overall mythic tone
  const dominantArchetypeName = dominant?.archetypeName || 'the Unknown';
  const overallToneEn = `Your lineage speaks through the voice of ${dominantArchetypeName}. The ancient patterns continue in you.`;
  const overallToneZh = `你的血脉通过「${dominant?.archetypeNameZh || '未知'}」的声音说话。古老的模式在你身上继续。`;

  return {
    fusions,
    pilgrimAddress,
    pilgrimAddressZh,
    overallMythicTone: overallToneEn,
    overallMythicToneZh: overallToneZh,
    dominantArchetype: dominant,
    shadowArchetype: shadow
  };
}

// ==================== SPECIALIZED FUSIONS ====================

/**
 * Generate gift-focused fusion
 */
export function generateGiftFusion(
  archetype: AncestralArchetype,
  personaMessages: AncestralPersonaMessage[]
): MythosPersonaFusion {
  const relatedPersona = personaMessages.filter(p =>
    archetype.themes.some(t => t.toLowerCase().includes(p.theme.toLowerCase()))
  );

  const mythicEn = MYTHIC_VOICE_TEMPLATES.gift.en(archetype.name, archetype.gifts);
  const mythicZh = MYTHIC_VOICE_TEMPLATES.gift.zh(archetype.nameZh, archetype.giftsZh || archetype.gifts);

  const personaVoiceEn = relatedPersona.map(p => p.message).join(' ');
  const personaVoiceZh = relatedPersona.map(p => p.messageZh || p.message).join(' ');

  return {
    archetypeId: archetype.id,
    archetypeName: archetype.name,
    archetypeNameZh: archetype.nameZh,
    personaVoice: personaVoiceEn,
    personaVoiceZh: personaVoiceZh,
    mythicVoice: mythicEn,
    mythicVoiceZh: mythicZh,
    fusedMessage: `${mythicEn} ${personaVoiceEn}`.trim(),
    fusedMessageZh: `${mythicZh} ${personaVoiceZh}`.trim(),
    resonanceThemes: relatedPersona.map(p => p.theme),
    intensity: 'strong'
  };
}

/**
 * Generate shadow-focused fusion
 */
export function generateShadowFusion(
  archetype: AncestralArchetype,
  personaMessages: AncestralPersonaMessage[]
): MythosPersonaFusion {
  const mythicEn = MYTHIC_VOICE_TEMPLATES.shadow.en(archetype.name, archetype.shadow);
  const mythicZh = MYTHIC_VOICE_TEMPLATES.shadow.zh(archetype.nameZh, archetype.shadowZh || archetype.shadow);

  const relatedPersona = personaMessages.filter(p =>
    archetype.shadow.some(s => s.toLowerCase().includes(p.theme.toLowerCase()))
  );

  const personaVoiceEn = relatedPersona.map(p => p.message).join(' ');
  const personaVoiceZh = relatedPersona.map(p => p.messageZh || p.message).join(' ');

  return {
    archetypeId: archetype.id,
    archetypeName: archetype.name,
    archetypeNameZh: archetype.nameZh,
    personaVoice: personaVoiceEn,
    personaVoiceZh: personaVoiceZh,
    mythicVoice: mythicEn,
    mythicVoiceZh: mythicZh,
    fusedMessage: `${mythicEn} ${personaVoiceEn}`.trim(),
    fusedMessageZh: `${mythicZh} ${personaVoiceZh}`.trim(),
    resonanceThemes: archetype.shadow,
    intensity: 'whisper'
  };
}

/**
 * Generate integration-focused fusion
 */
export function generateIntegrationFusion(
  archetype: AncestralArchetype,
  personaMessages: AncestralPersonaMessage[]
): MythosPersonaFusion {
  const mythicEn = MYTHIC_VOICE_TEMPLATES.integration.en(archetype.name);
  const mythicZh = MYTHIC_VOICE_TEMPLATES.integration.zh(archetype.nameZh);

  const relatedPersona = personaMessages.filter(p =>
    archetype.themes.some(t => t.toLowerCase().includes(p.theme.toLowerCase()))
  );

  const personaVoiceEn = relatedPersona.map(p => p.message).join(' ');
  const personaVoiceZh = relatedPersona.map(p => p.messageZh || p.message).join(' ');

  return {
    archetypeId: archetype.id,
    archetypeName: archetype.name,
    archetypeNameZh: archetype.nameZh,
    personaVoice: personaVoiceEn,
    personaVoiceZh: personaVoiceZh,
    mythicVoice: mythicEn,
    mythicVoiceZh: mythicZh,
    fusedMessage: `${mythicEn} ${personaVoiceEn}`.trim(),
    fusedMessageZh: `${mythicZh} ${personaVoiceZh}`.trim(),
    resonanceThemes: archetype.themes,
    intensity: 'profound'
  };
}

// ==================== FORMATTING ====================

/**
 * Format fusion for display
 */
export function formatFusionForDisplay(
  fusion: MythosPersonaFusion,
  lang: 'en' | 'zh' = 'en'
): string {
  const lines: string[] = [];

  const name = lang === 'zh' ? fusion.archetypeNameZh : fusion.archetypeName;
  const message = lang === 'zh' ? fusion.fusedMessageZh : fusion.fusedMessage;

  lines.push(`【原型 / Archetype: ${name}】`);
  lines.push(message);
  lines.push('');
  lines.push(`Intensity: ${fusion.intensity}`);

  if (fusion.resonanceThemes.length > 0) {
    lines.push(`Resonance: ${fusion.resonanceThemes.join(', ')}`);
  }

  return lines.join('\n');
}

/**
 * Format fusion layer for voice output
 */
export function formatFusionLayerForVoice(
  layer: FusionLayer,
  lang: 'en' | 'zh' = 'en'
): string[] {
  const lines: string[] = [];

  // Pilgrim address
  lines.push(lang === 'zh' ? layer.pilgrimAddressZh : layer.pilgrimAddress);
  lines.push(''); // pause

  // Overall tone
  lines.push(lang === 'zh' ? layer.overallMythicToneZh : layer.overallMythicTone);
  lines.push(''); // pause

  // Dominant archetype (if present)
  if (layer.dominantArchetype) {
    const message = lang === 'zh'
      ? layer.dominantArchetype.fusedMessageZh
      : layer.dominantArchetype.fusedMessage;
    lines.push(message);
    lines.push(''); // pause
  }

  // Other strong fusions
  layer.fusions
    .filter(f => f.intensity === 'strong' && f !== layer.dominantArchetype)
    .slice(0, 2)
    .forEach(f => {
      const message = lang === 'zh' ? f.fusedMessageZh : f.fusedMessage;
      lines.push(message);
      lines.push(''); // pause
    });

  return lines;
}

/**
 * Get fusions by intensity
 */
export function getFusionsByIntensity(
  layer: FusionLayer,
  intensity: MythosPersonaFusion['intensity']
): MythosPersonaFusion[] {
  return layer.fusions.filter(f => f.intensity === intensity);
}

/**
 * Get fusion by archetype ID
 */
export function getFusionByArchetype(
  layer: FusionLayer,
  archetypeId: string
): MythosPersonaFusion | null {
  return layer.fusions.find(f => f.archetypeId === archetypeId) || null;
}

// ==================== EXPORTS ====================

export {
  fuseMythosAndPersona,
  buildFusionLayer,
  generateGiftFusion,
  generateShadowFusion,
  generateIntegrationFusion,
  formatFusionForDisplay,
  formatFusionLayerForVoice,
  getFusionsByIntensity,
  getFusionByArchetype
};
