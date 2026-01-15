/**
 * ============================================================================
 * SHEN SHA DEFINITIONS (神煞)
 * ============================================================================
 *
 * The complete Joey-Yap-aligned Shen Sha (Symbolic Stars) library.
 *
 * These are NOT fortune-telling charms. They are pattern markers that
 * highlight tendencies, opportunities, sensitivities, and relational dynamics.
 *
 * Categories:
 * - Relationship & Attraction Stars (桃花类)
 * - Intelligence & Talent Stars (学术类)
 * - Nobleman & Support Stars (贵人类)
 * - Travel & Movement Stars (驿马类)
 * - Wealth & Opportunity Stars (财禄类)
 * - Challenge & Sensitivity Stars (煞神类)
 * - Spiritual & Intuitive Stars (神煞类)
 *
 * Created: January 2026
 * Based on: Joey Yap's classical, non-superstitious Shen Sha methodology
 * ============================================================================
 */

// ============================================================================
// TYPES
// ============================================================================

export type ShenShaCategory =
  | 'relationship'     // 桃花类 - Attraction, romance, social
  | 'intelligence'     // 学术类 - Learning, creativity, talent
  | 'nobleman'         // 贵人类 - Benefactors, protection, support
  | 'movement'         // 驿马类 - Travel, change, relocation
  | 'wealth'           // 财禄类 - Prosperity, opportunity, resources
  | 'challenge'        // 煞神类 - Obstacles, sensitivities, warnings
  | 'spiritual';       // 神煞类 - Intuition, healing, virtue

export type ShenShaPolarity = 'auspicious' | 'inauspicious' | 'neutral';

export interface ShenShaDefinition {
  key: string;
  han: string;
  label: string;
  pinyin: string;
  category: ShenShaCategory;
  polarity: ShenShaPolarity;
  description: string;
  keywords: string[];
  classicalMeaning: string;
  modernInterpretation: string;
  inRelationships: string;
  inCareer: string;
}

// ============================================================================
// RELATIONSHIP & ATTRACTION STARS (桃花类)
// ============================================================================

export const RELATIONSHIP_STARS: Record<string, ShenShaDefinition> = {
  peach_blossom: {
    key: 'peach_blossom',
    han: '桃花',
    label: 'Peach Blossom',
    pinyin: 'Táo Huā',
    category: 'relationship',
    polarity: 'neutral',
    description: 'The star of attraction, charm, and social magnetism.',
    keywords: ['attraction', 'charm', 'romance', 'social skills', 'popularity'],
    classicalMeaning: 'Like a peach tree in full bloom, this star attracts attention and admiration. It indicates natural charisma and romantic appeal.',
    modernInterpretation: 'Strong social presence, natural networking ability, can attract opportunities through personal charm. In excess, may indicate scattered romantic energy.',
    inRelationships: 'Attracts romantic interest easily. Must be mindful of boundaries. Can indicate multiple admirers or relationship opportunities.',
    inCareer: 'Excellent for public-facing roles, sales, entertainment, hospitality, or any field requiring interpersonal charm.'
  },

  red_matchmaker: {
    key: 'red_matchmaker',
    han: '红鸾',
    label: 'Red Matchmaker',
    pinyin: 'Hóng Luán',
    category: 'relationship',
    polarity: 'auspicious',
    description: 'The star of romantic activation and relationship formation.',
    keywords: ['marriage', 'partnership', 'romantic timing', 'commitment'],
    classicalMeaning: 'When Red Matchmaker appears, romantic opportunities become active. It\'s traditionally the marriage indicator star.',
    modernInterpretation: 'Indicates timing for relationship milestones. When activated, relationships move toward commitment or significant development.',
    inRelationships: 'Strong indicator for marriage potential or relationship deepening. Good timing for meeting life partners.',
    inCareer: 'Can indicate beneficial business partnerships. Good for collaborative ventures and joint enterprises.'
  },

  sky_happiness: {
    key: 'sky_happiness',
    han: '天喜',
    label: 'Sky Happiness',
    pinyin: 'Tiān Xǐ',
    category: 'relationship',
    polarity: 'auspicious',
    description: 'The star of joy, celebration, and happy unions.',
    keywords: ['joy', 'celebration', 'weddings', 'happy events', 'fertility'],
    classicalMeaning: 'Sky Happiness brings festive energy. It\'s associated with weddings, births, and joyful gatherings.',
    modernInterpretation: 'Indicates periods of happiness and celebration. Often activated during life milestones like weddings, births, or achievements.',
    inRelationships: 'Brings lightness and joy to relationships. Good for celebrations and happy couple activities.',
    inCareer: 'Favorable for events, celebrations, hospitality industries. Can indicate recognition or awards.'
  },

  salty_pool: {
    key: 'salty_pool',
    han: '咸池',
    label: 'Salty Pool',
    pinyin: 'Xián Chí',
    category: 'relationship',
    polarity: 'neutral',
    description: 'The star of sensuality and physical attraction.',
    keywords: ['sensuality', 'physical attraction', 'intimacy', 'desire'],
    classicalMeaning: 'Named after the bathing pool of celestial maidens, this star indicates strong physical magnetism and sensual nature.',
    modernInterpretation: 'Heightened physical presence and attraction. Can indicate artistic sensibility related to beauty and form. Requires awareness around boundaries.',
    inRelationships: 'Strong physical chemistry and intimacy. Must balance physical attraction with emotional depth.',
    inCareer: 'Good for beauty, fashion, arts, or any field involving physical aesthetics and appeal.'
  },

  solitary_star: {
    key: 'solitary_star',
    han: '孤辰',
    label: 'Solitary Star',
    pinyin: 'Gū Chén',
    category: 'relationship',
    polarity: 'inauspicious',
    description: 'The star of independence that can indicate isolation in relationships.',
    keywords: ['independence', 'solitude', 'self-reliance', 'delayed marriage'],
    classicalMeaning: 'The Solitary Star indicates a naturally independent nature that may delay or complicate partnerships.',
    modernInterpretation: 'Not necessarily negative - indicates strong self-reliance. May prefer independence or face challenges in conventional relationships.',
    inRelationships: 'May marry later or prefer unconventional relationship structures. Benefits from partners who respect independence.',
    inCareer: 'Excellent for solo entrepreneurship, independent consulting, or roles requiring autonomous work.'
  },

  widow_star: {
    key: 'widow_star',
    han: '寡宿',
    label: 'Widow Star',
    pinyin: 'Guǎ Sù',
    category: 'relationship',
    polarity: 'inauspicious',
    description: 'The star of emotional distance and relationship challenges.',
    keywords: ['emotional distance', 'relationship challenges', 'independence', 'late marriage'],
    classicalMeaning: 'Widow Star suggests emotional reserve or difficulty in finding lasting partnership.',
    modernInterpretation: 'Indicates need for emotional independence within relationships. May benefit from later marriage or unconventional arrangements.',
    inRelationships: 'Requires partners who understand need for space. May thrive in long-distance or independent arrangements.',
    inCareer: 'Good for roles requiring emotional detachment: research, analysis, judicial positions.'
  }
};

// ============================================================================
// INTELLIGENCE & TALENT STARS (学术类)
// ============================================================================

export const INTELLIGENCE_STARS: Record<string, ShenShaDefinition> = {
  academic_star: {
    key: 'academic_star',
    han: '文昌',
    label: 'Academic Star',
    pinyin: 'Wén Chāng',
    category: 'intelligence',
    polarity: 'auspicious',
    description: 'The star of scholarly achievement, writing, and intellectual excellence.',
    keywords: ['academics', 'writing', 'exams', 'intellectual pursuits', 'education'],
    classicalMeaning: 'Wen Chang is the god of literature. This star indicates natural academic ability and success in examinations.',
    modernInterpretation: 'Strong intellectual capacity, good for studies, writing, research. Indicates ability to communicate complex ideas clearly.',
    inRelationships: 'Values intellectual connection. Attracted to educated, articulate partners.',
    inCareer: 'Excellent for education, writing, journalism, research, law, or any field requiring clear communication and analysis.'
  },

  literary_star: {
    key: 'literary_star',
    han: '文曲',
    label: 'Literary Star',
    pinyin: 'Wén Qǔ',
    category: 'intelligence',
    polarity: 'auspicious',
    description: 'The star of artistic talent, creativity, and expressive arts.',
    keywords: ['arts', 'music', 'creativity', 'expression', 'aesthetics'],
    classicalMeaning: 'Wen Qu represents artistic and musical talent. It indicates gifts in creative expression.',
    modernInterpretation: 'Natural artistic sensibility. Good for music, visual arts, design, creative writing, and performance.',
    inRelationships: 'Expressive and romantic. Appreciates beauty and artistic expression in partnerships.',
    inCareer: 'Ideal for creative industries: arts, music, design, entertainment, advertising, content creation.'
  },

  seal_of_authority: {
    key: 'seal_of_authority',
    han: '国印贵人',
    label: 'Seal of Authority',
    pinyin: 'Guó Yìn Guì Rén',
    category: 'intelligence',
    polarity: 'auspicious',
    description: 'The star of official recognition and legitimate authority.',
    keywords: ['authority', 'certification', 'credentials', 'official status'],
    classicalMeaning: 'The imperial seal represents legitimate power. This star indicates recognition by established institutions.',
    modernInterpretation: 'Favors gaining official credentials, certifications, and recognized authority. Good for professional licensing.',
    inRelationships: 'Values legitimacy and formal commitment. May prefer traditional relationship structures.',
    inCareer: 'Excellent for government, law, medicine, or any field requiring official certification and institutional backing.'
  }
};

// ============================================================================
// NOBLEMAN & SUPPORT STARS (贵人类)
// ============================================================================

export const NOBLEMAN_STARS: Record<string, ShenShaDefinition> = {
  heavenly_nobleman: {
    key: 'heavenly_nobleman',
    han: '天乙贵人',
    label: 'Heavenly Nobleman',
    pinyin: 'Tiān Yǐ Guì Rén',
    category: 'nobleman',
    polarity: 'auspicious',
    description: 'The most powerful benefactor star - help arrives in times of need.',
    keywords: ['benefactors', 'protection', 'help', 'rescue', 'guidance'],
    classicalMeaning: 'The Heavenly Nobleman is the most significant of all noblemen stars. When present, helpful people appear in times of need.',
    modernInterpretation: 'Indicates a life blessed with timely help and mentorship. Benefactors appear at crucial moments. Protected from major disasters.',
    inRelationships: 'Attracts supportive partners. Others naturally want to help and protect.',
    inCareer: 'Benefits from mentors and sponsors. Good connections open doors. Career advances through relationships.'
  },

  tai_ji_nobleman: {
    key: 'tai_ji_nobleman',
    han: '太极贵人',
    label: 'Tai Ji Nobleman',
    pinyin: 'Tài Jí Guì Rén',
    category: 'nobleman',
    polarity: 'auspicious',
    description: 'The star of spiritual wisdom and inner guidance.',
    keywords: ['wisdom', 'intuition', 'spirituality', 'inner knowing', 'metaphysics'],
    classicalMeaning: 'Tai Ji represents the primordial unity. This nobleman brings wisdom and spiritual insight.',
    modernInterpretation: 'Strong intuition and spiritual perception. Good for metaphysical studies, philosophy, psychology. Inner guidance is reliable.',
    inRelationships: 'Seeks deep, meaningful connections. Attracted to spiritual or philosophical partners.',
    inCareer: 'Excellent for counseling, psychology, philosophy, spiritual teaching, healing arts.'
  },

  heavenly_virtue: {
    key: 'heavenly_virtue',
    han: '天德',
    label: 'Heavenly Virtue',
    pinyin: 'Tiān Dé',
    category: 'nobleman',
    polarity: 'auspicious',
    description: 'The star of natural virtue and protection from harm.',
    keywords: ['virtue', 'protection', 'blessings', 'good character', 'safety'],
    classicalMeaning: 'Heavenly Virtue represents celestial blessing. Those with this star are protected and naturally virtuous.',
    modernInterpretation: 'Indicates good moral character and natural protection from serious harm. Life tends to work out despite challenges.',
    inRelationships: 'Trustworthy and ethical in partnerships. Attracts similar values.',
    inCareer: 'Good for positions of trust and responsibility. Ethics-based professions.'
  },

  moon_virtue: {
    key: 'moon_virtue',
    han: '月德',
    label: 'Moon Virtue',
    pinyin: 'Yuè Dé',
    category: 'nobleman',
    polarity: 'auspicious',
    description: 'The star of gentle virtue and monthly blessings.',
    keywords: ['gentleness', 'monthly cycles', 'nurturing', 'quiet virtue'],
    classicalMeaning: 'Moon Virtue brings gentle, nurturing protection that cycles with the moon.',
    modernInterpretation: 'Quiet, consistent blessings. Good for monthly planning and cyclical work. Nurturing nature.',
    inRelationships: 'Gentle, nurturing presence in relationships. Attentive to emotional cycles.',
    inCareer: 'Good for caregiving, healthcare, counseling, or cyclical industries.'
  }
};

// ============================================================================
// TRAVEL & MOVEMENT STARS (驿马类)
// ============================================================================

export const MOVEMENT_STARS: Record<string, ShenShaDefinition> = {
  traveling_horse: {
    key: 'traveling_horse',
    han: '驿马',
    label: 'Traveling Horse',
    pinyin: 'Yì Mǎ',
    category: 'movement',
    polarity: 'neutral',
    description: 'The star of movement, travel, and change.',
    keywords: ['travel', 'movement', 'change', 'relocation', 'transportation'],
    classicalMeaning: 'The post horse represents swift movement. This star indicates a life involving travel and change.',
    modernInterpretation: 'Strong need for movement and change. Good for careers involving travel. May relocate multiple times.',
    inRelationships: 'May struggle with staying in one place. Long-distance relationships or travel-compatible partners work well.',
    inCareer: 'Excellent for travel industry, sales with travel, import/export, journalism, or any mobile profession.'
  },

  general_star: {
    key: 'general_star',
    han: '将星',
    label: 'General Star',
    pinyin: 'Jiàng Xīng',
    category: 'movement',
    polarity: 'auspicious',
    description: 'The star of leadership and commanding presence.',
    keywords: ['leadership', 'command', 'authority', 'strategy', 'military'],
    classicalMeaning: 'The General commands respect and leads troops. This star indicates natural leadership ability.',
    modernInterpretation: 'Natural leader and strategist. Good for management, military, or any role requiring command presence.',
    inRelationships: 'May take charge in relationships. Needs partners who respect leadership or are equally strong.',
    inCareer: 'Excellent for executive roles, military, politics, project management, or entrepreneurship.'
  },

  artistic_star: {
    key: 'artistic_star',
    han: '华盖',
    label: 'Artistic Star / Canopy',
    pinyin: 'Huá Gài',
    category: 'movement',
    polarity: 'neutral',
    description: 'The star of artistic sensitivity, solitude, and spiritual inclination.',
    keywords: ['arts', 'solitude', 'spirituality', 'creativity', 'unconventional'],
    classicalMeaning: 'The imperial canopy represents distinction and separation. This star indicates artistic gifts but also a tendency toward solitude.',
    modernInterpretation: 'Strong artistic and spiritual nature. May feel different from others. Benefits from creative solitude. Unconventional path.',
    inRelationships: 'Needs alone time. Partners must understand artistic temperament and need for space.',
    inCareer: 'Ideal for arts, spiritual work, research, or any field allowing creative independence.'
  }
};

// ============================================================================
// WEALTH & OPPORTUNITY STARS (财禄类)
// ============================================================================

export const WEALTH_STARS: Record<string, ShenShaDefinition> = {
  prosperity_star: {
    key: 'prosperity_star',
    han: '禄神',
    label: 'Prosperity Star',
    pinyin: 'Lù Shén',
    category: 'wealth',
    polarity: 'auspicious',
    description: 'The star of income, salary, and steady prosperity.',
    keywords: ['income', 'salary', 'prosperity', 'steady wealth', 'resources'],
    classicalMeaning: 'Lu represents official salary and income. This star indicates reliable financial resources.',
    modernInterpretation: 'Good earning capacity. Steady income from work. Resources tend to be available when needed.',
    inRelationships: 'Financially supportive in relationships. Values material comfort.',
    inCareer: 'Indicates good salary potential. Professional positions with steady income.'
  },

  heavenly_kitchen: {
    key: 'heavenly_kitchen',
    han: '天厨',
    label: 'Heavenly Kitchen',
    pinyin: 'Tiān Chú',
    category: 'wealth',
    polarity: 'auspicious',
    description: 'The star of abundance, particularly in food and nourishment.',
    keywords: ['abundance', 'food', 'nourishment', 'hospitality', 'never hungry'],
    classicalMeaning: 'The Heavenly Kitchen ensures one never goes hungry. Resources for sustenance are always available.',
    modernInterpretation: 'Never lacking in basic needs. Good for hospitality, food industry, or any nurturing profession.',
    inRelationships: 'Nurturing and providing. Creates comfortable, well-fed home environments.',
    inCareer: 'Excellent for culinary arts, hospitality, food industry, nutrition, or caregiving.'
  },

  lucky_star: {
    key: 'lucky_star',
    han: '福星',
    label: 'Lucky Star',
    pinyin: 'Fú Xīng',
    category: 'wealth',
    polarity: 'auspicious',
    description: 'The star of good fortune and blessings.',
    keywords: ['luck', 'fortune', 'blessings', 'happiness', 'good outcomes'],
    classicalMeaning: 'Fu Xing is the god of good fortune. This star brings general blessings and fortunate outcomes.',
    modernInterpretation: 'Things tend to work out favorably. Lucky breaks and opportunities appear. Generally blessed life.',
    inRelationships: 'Brings luck to partnerships. Happy, fortunate relationships.',
    inCareer: 'Good timing for opportunities. Projects tend to succeed. Favorable outcomes in business.'
  }
};

// ============================================================================
// CHALLENGE & SENSITIVITY STARS (煞神类)
// ============================================================================

export const CHALLENGE_STARS: Record<string, ShenShaDefinition> = {
  robbery_sha: {
    key: 'robbery_sha',
    han: '劫煞',
    label: 'Robbery Sha',
    pinyin: 'Jié Shà',
    category: 'challenge',
    polarity: 'inauspicious',
    description: 'The star of potential loss through external forces or competition.',
    keywords: ['loss', 'theft', 'competition', 'challenge', 'awareness needed'],
    classicalMeaning: 'Robbery Sha warns of potential loss through theft or external interference.',
    modernInterpretation: 'Be mindful of security and protecting what is yours. Competition may be fierce. Need for strategic defense.',
    inRelationships: 'May experience rivalry or interference from outside the relationship. Guard boundaries.',
    inCareer: 'Need for competitive awareness. Protect intellectual property. Be strategic about information sharing.'
  },

  calamity_sha: {
    key: 'calamity_sha',
    han: '灾煞',
    label: 'Calamity Sha',
    pinyin: 'Zāi Shà',
    category: 'challenge',
    polarity: 'inauspicious',
    description: 'The star of potential accidents or sudden difficulties.',
    keywords: ['accidents', 'sudden problems', 'caution needed', 'awareness'],
    classicalMeaning: 'Calamity Sha indicates potential for sudden difficulties or accidents.',
    modernInterpretation: 'Take precautions in physical activities. Be mindful of safety. This is awareness, not destiny.',
    inRelationships: 'May experience sudden relationship disruptions. Build stability consciously.',
    inCareer: 'Take normal safety precautions. Good insurance is wise. Prepare contingency plans.'
  },

  lost_spirit: {
    key: 'lost_spirit',
    han: '亡神',
    label: 'Lost Spirit',
    pinyin: 'Wáng Shén',
    category: 'challenge',
    polarity: 'inauspicious',
    description: 'The star of confusion, misdirection, and needing to find one\'s way.',
    keywords: ['confusion', 'misdirection', 'seeking', 'uncertainty'],
    classicalMeaning: 'Lost Spirit indicates potential for losing direction or being misled.',
    modernInterpretation: 'Take time for clarity before major decisions. Verify information carefully. Trust but verify.',
    inRelationships: 'May experience confusion about relationship direction. Seek clarity before commitment.',
    inCareer: 'Double-check directions and instructions. Verify sources. Take time before major commitments.'
  },

  heavenly_net: {
    key: 'heavenly_net',
    han: '天罗地网',
    label: 'Heavenly Net',
    pinyin: 'Tiān Luó Dì Wǎng',
    category: 'challenge',
    polarity: 'inauspicious',
    description: 'The star of feeling trapped or restricted.',
    keywords: ['restrictions', 'feeling trapped', 'obstacles', 'limitations'],
    classicalMeaning: 'The Heavenly Net represents inescapable restrictions or limitations.',
    modernInterpretation: 'May face structural limitations or bureaucratic obstacles. Learn to work within systems or find exits.',
    inRelationships: 'May feel trapped in relationships. Important to establish healthy boundaries.',
    inCareer: 'May face institutional barriers. Learn system navigation or entrepreneurial alternatives.'
  },

  monthly_sha: {
    key: 'monthly_sha',
    han: '月煞',
    label: 'Monthly Sha',
    pinyin: 'Yuè Shà',
    category: 'challenge',
    polarity: 'inauspicious',
    description: 'The star of monthly sensitivity or cyclical challenges.',
    keywords: ['monthly cycles', 'periodic challenges', 'timing sensitivity'],
    classicalMeaning: 'Monthly Sha indicates sensitivity to monthly cycles and timing.',
    modernInterpretation: 'Some months may be more challenging. Pay attention to timing. Plan around sensitive periods.',
    inRelationships: 'Be aware of cyclical patterns in relationship dynamics.',
    inCareer: 'Some months favor progress, others consolidation. Learn personal cycles.'
  },

  yearly_sha: {
    key: 'yearly_sha',
    han: '年煞',
    label: 'Yearly Sha',
    pinyin: 'Nián Shà',
    category: 'challenge',
    polarity: 'inauspicious',
    description: 'The star of yearly sensitivity or annual challenges.',
    keywords: ['yearly cycles', 'annual challenges', 'timing awareness'],
    classicalMeaning: 'Yearly Sha indicates sensitivity to yearly cycles and certain years.',
    modernInterpretation: 'Some years may be more challenging than others. Strategic planning for challenging years is wise.',
    inRelationships: 'Be aware of relationship cycles that follow yearly patterns.',
    inCareer: 'Some years favor expansion, others consolidation. Plan strategically.'
  },

  yin_sha: {
    key: 'yin_sha',
    han: '阴煞',
    label: 'Yin Sha',
    pinyin: 'Yīn Shà',
    category: 'challenge',
    polarity: 'inauspicious',
    description: 'The star of hidden problems or subtle difficulties.',
    keywords: ['hidden issues', 'subtle problems', 'unseen challenges'],
    classicalMeaning: 'Yin Sha represents hidden, subtle challenges that aren\'t immediately visible.',
    modernInterpretation: 'Look beneath the surface. Hidden issues may need attention. Intuition is important.',
    inRelationships: 'Pay attention to unspoken dynamics. Address hidden issues before they grow.',
    inCareer: 'Be aware of office politics or hidden agendas. Develop political awareness.'
  }
};

// ============================================================================
// SPIRITUAL & INTUITIVE STARS (神煞类)
// ============================================================================

export const SPIRITUAL_STARS: Record<string, ShenShaDefinition> = {
  heavenly_doctor: {
    key: 'heavenly_doctor',
    han: '天医',
    label: 'Heavenly Doctor',
    pinyin: 'Tiān Yī',
    category: 'spiritual',
    polarity: 'auspicious',
    description: 'The star of healing ability and health recovery.',
    keywords: ['healing', 'health', 'recovery', 'medicine', 'helping others'],
    classicalMeaning: 'The Heavenly Doctor indicates natural healing ability and quick recovery from illness.',
    modernInterpretation: 'Natural healing gifts. Recovers well from setbacks. Good for healthcare or healing professions.',
    inRelationships: 'Nurturing and healing presence. Helps partners through difficulties.',
    inCareer: 'Excellent for medicine, healthcare, therapy, counseling, or any healing profession.'
  },

  sky_noble: {
    key: 'sky_noble',
    han: '天贵',
    label: 'Sky Noble',
    pinyin: 'Tiān Guì',
    category: 'spiritual',
    polarity: 'auspicious',
    description: 'The star of natural nobility and refined character.',
    keywords: ['nobility', 'refinement', 'dignity', 'natural class'],
    classicalMeaning: 'Sky Noble indicates natural aristocratic bearing and refined character.',
    modernInterpretation: 'Natural dignity and refinement. Commands respect without demanding it. Graceful presence.',
    inRelationships: 'Brings dignity to relationships. Attracts refined partners.',
    inCareer: 'Good for positions requiring dignity: diplomacy, executive roles, hospitality.'
  },

  three_wonders: {
    key: 'three_wonders',
    han: '三奇',
    label: 'Three Wonders',
    pinyin: 'Sān Qí',
    category: 'spiritual',
    polarity: 'auspicious',
    description: 'The star of unusual talents and special abilities.',
    keywords: ['special talents', 'unusual abilities', 'creativity', 'uniqueness'],
    classicalMeaning: 'Three Wonders represents exceptional, unusual talents that set one apart.',
    modernInterpretation: 'Unique abilities that distinguish from the crowd. Creative genius or special gifts.',
    inRelationships: 'May attract unusual or creative partners. Unconventional relationship dynamics.',
    inCareer: 'Ideal for roles requiring unique skills or creative problem-solving.'
  }
};

// ============================================================================
// COMBINED LIBRARY
// ============================================================================

export const SHEN_SHA_LIBRARY: Record<string, ShenShaDefinition> = {
  ...RELATIONSHIP_STARS,
  ...INTELLIGENCE_STARS,
  ...NOBLEMAN_STARS,
  ...MOVEMENT_STARS,
  ...WEALTH_STARS,
  ...CHALLENGE_STARS,
  ...SPIRITUAL_STARS
};

// ============================================================================
// CATEGORY METADATA
// ============================================================================

export const CATEGORY_META: Record<ShenShaCategory, {
  han: string;
  label: string;
  description: string;
  icon: string;
}> = {
  relationship: {
    han: '桃花类',
    label: 'Relationship & Attraction',
    description: 'Stars affecting romance, attraction, and social dynamics.',
    icon: '💕'
  },
  intelligence: {
    han: '学术类',
    label: 'Intelligence & Talent',
    description: 'Stars affecting learning, creativity, and intellectual ability.',
    icon: '📚'
  },
  nobleman: {
    han: '贵人类',
    label: 'Nobleman & Support',
    description: 'Stars indicating benefactors, protection, and helpful people.',
    icon: '👤'
  },
  movement: {
    han: '驿马类',
    label: 'Travel & Movement',
    description: 'Stars affecting travel, change, and life movement.',
    icon: '🐎'
  },
  wealth: {
    han: '财禄类',
    label: 'Wealth & Opportunity',
    description: 'Stars affecting prosperity, resources, and opportunities.',
    icon: '💰'
  },
  challenge: {
    han: '煞神类',
    label: 'Challenges & Sensitivities',
    description: 'Stars indicating areas requiring awareness and caution.',
    icon: '⚠'
  },
  spiritual: {
    han: '神煞类',
    label: 'Spiritual & Intuitive',
    description: 'Stars affecting intuition, healing, and spiritual gifts.',
    icon: '✨'
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all stars by category
 */
export function getStarsByCategory(category: ShenShaCategory): ShenShaDefinition[] {
  return Object.values(SHEN_SHA_LIBRARY).filter(star => star.category === category);
}

/**
 * Get all auspicious stars
 */
export function getAuspiciousStars(): ShenShaDefinition[] {
  return Object.values(SHEN_SHA_LIBRARY).filter(star => star.polarity === 'auspicious');
}

/**
 * Get all inauspicious stars
 */
export function getInauspiciousStars(): ShenShaDefinition[] {
  return Object.values(SHEN_SHA_LIBRARY).filter(star => star.polarity === 'inauspicious');
}

/**
 * Get star definition by key
 */
export function getStarDefinition(key: string): ShenShaDefinition | null {
  return SHEN_SHA_LIBRARY[key] || null;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  SHEN_SHA_LIBRARY,
  CATEGORY_META,
  RELATIONSHIP_STARS,
  INTELLIGENCE_STARS,
  NOBLEMAN_STARS,
  MOVEMENT_STARS,
  WEALTH_STARS,
  CHALLENGE_STARS,
  SPIRITUAL_STARS,
  getStarsByCategory,
  getAuspiciousStars,
  getInauspiciousStars,
  getStarDefinition
};
