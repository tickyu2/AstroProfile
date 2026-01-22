/**
 * ============================================
 * COMPLETE CODEX PAGES LIBRARY
 * Full Knowledge Codex entries for all classical
 * BaZi edge case rules
 * ============================================
 */

import { CodexEntry } from './codexTypes';

/**
 * Complete library of detailed Codex entries
 */
export const COMPLETE_CODEX_LIBRARY: Record<string, Partial<CodexEntry>> = {

  // ══════════════════════════════════════════════════════════════════
  //                    STRUCTURE RULES (格局)
  // ══════════════════════════════════════════════════════════════════

  'fake_follow_wealth': {
    explanation: {
      title: 'Fake Follow Wealth (假从财格)',
      summary: 'Your chart appears to follow wealth, but hidden support prevents true surrender. You are overwhelmed by wealth, not aligned with it.',
      technicalDetail: `Classical: 假从财格 - Day Master appears extremely weak with dominant wealth, but hidden stems or seasonal support prevent true 从格.

Conditions:
• Day Master extremely weak (极弱)
• Wealth dominates (财星独旺)
• BUT: Hidden resource/peer exists OR season supports Day Master

Result: Treat as weak DM needing support, NOT as Follow structure.`,
      interpretation: 'You feel pressured by money and external demands. You chase wealth because you "must," not because it fits your nature. Burnout cycles occur when wealth-chasing intensifies.',
      recommendations: [
        'Build inner resources rather than chasing external wealth',
        'Strengthen Day Master through supportive elements',
        'Avoid all-in financial risks'
      ]
    },
    personaHook: '我见财星如潮水般涌来，却知你并非随波逐流之人。你不是为财而生，而是被财所逼。我在此为你护住一线真气，使你不至于迷失于外物之中。',
    journeyStepHint: 'In the Structure Chamber, we confront the illusion of Follow Wealth. Your hidden root prevents true surrender—your path is strengthening, not following.',
    severity: 'significant',
    effect: 'challenging',
    iconHint: '💰'
  },

  'pseudo_cong_officer': {
    explanation: {
      title: 'Pseudo Follow Officer (类从官格)',
      summary: 'You appear to follow authority/officer energy but retain a single hidden root. This is an unstable quasi-follow pattern.',
      technicalDetail: `Classical: 类从官格 - Almost a Follow Officer structure, but one hidden root remains.

Conditions:
• Day Master very weak (很弱)
• Officer/7-Killing dominates
• Single hidden root exists
• Season does NOT support Day Master

Result: Treat as weak with support need, not true Follow. Use resource as useful god.`,
      interpretation: 'You seem compliant to authority but internally resist full submission. Career success comes through skillful navigation of power structures, not blind obedience.',
      recommendations: [
        'Build quiet inner strength while appearing cooperative',
        'Seek resource (印) element support',
        'Don\'t fully surrender to authority figures'
      ]
    },
    personaHook: '你似乎想要追随官星，但根气未断，我知你并非真随。此格不稳，需要谨慎对待。在服从与自主之间，你必须找到平衡。',
    journeyStepHint: 'In the Structure Chamber, we see almost-surrender to authority. Your hidden root keeps you tethered to self—learn to balance compliance with autonomy.',
    severity: 'moderate',
    effect: 'mixed',
    iconHint: '👔'
  },

  'half_cong_resource': {
    explanation: {
      title: 'Half Follow Resource (半从印格)',
      summary: 'A partial follow structure toward resource/support energy. Unstable and may break during certain luck pillars.',
      technicalDetail: `Classical: 半从印格 - Halfway between normal and Follow structure.

Conditions:
• Day Master weak
• Resource (印) element dominates
• Partial root still exists
• Luck pillar may complete or break the pattern

Result: Unstable structure. May shift between Follow and normal during different luck periods.`,
      interpretation: 'You lean heavily on support systems—education, mentors, institutions. But you haven\'t fully surrendered independence. This creates flexibility but also instability.',
      recommendations: [
        'Prepare for structure shifts during luck pillar changes',
        'Don\'t over-rely on any single support system',
        'Maintain backup resources'
      ]
    },
    personaHook: '你站在从与不从之间，如秋叶半落枝头。这种格局易随大运而变，需时刻觉察。既不是完全依赖，也不是完全独立。',
    journeyStepHint: 'In the Structure Chamber, you stand at the threshold—neither fully yourself nor fully surrendered. This instability is both vulnerability and flexibility.',
    severity: 'moderate',
    effect: 'mixed',
    iconHint: '📚'
  },

  'true_follow_wealth': {
    explanation: {
      title: 'True Follow Wealth (真从财格)',
      summary: 'Your Day Master has completely surrendered to wealth energy. With no roots anywhere, your destiny is to flow with financial currents.',
      technicalDetail: `Classical: 真从财格 - Complete surrender to wealth.

ALL must be true:
• Day Master utterly rootless (日主无根)
• No hidden stems support DM (无印比藏干)
• Season does not produce DM (不得令)
• Wealth completely dominates (财星独旺成势)
• No resource/peer in Heavenly Stems

Result: Reverse normal rules. Strengthen wealth, avoid resource/peers.`,
      interpretation: 'Surrender IS your strength. You thrive through wealth pursuit, financial networks, and material flow. Independence and self-sufficiency are traps for your structure.',
      recommendations: [
        'Embrace wealth-generating activities fully',
        'Partner with resource-rich people and environments',
        'Avoid luck pillars bringing resource/peer energy'
      ]
    },
    personaHook: '财星如海，你已选择随波而行。这不是懦弱，而是智慧——当日主无根，随财便是天命。愿你在富足中找到安宁。',
    journeyStepHint: 'In the Structure Chamber, we recognize True Follow Wealth. Your strength IS your surrender. The leaf that floats reaches the sea.',
    severity: 'major',
    effect: 'mixed',
    iconHint: '🌊'
  },

  'true_follow_officer': {
    explanation: {
      title: 'True Follow Officer (真从官格)',
      summary: 'Complete surrender to authority and official power. Your path is through structure, hierarchy, and service.',
      technicalDetail: `Classical: 真从官格 - Complete surrender to officer/authority.

Conditions:
• Day Master utterly rootless
• Officer (官) or 7-Killing (杀) dominates
• No support for Day Master anywhere
• Season neutral or hostile to DM

Result: Thrive through authority structures. Avoid food/output that challenges officer.`,
      interpretation: 'You find fulfillment through service to larger structures—government, corporations, institutions. Fighting authority depletes you; aligning with it empowers you.',
      recommendations: [
        'Seek careers in structured environments',
        'Align with authority rather than challenging it',
        'Avoid rebellious or highly independent paths'
      ]
    },
    personaHook: '官星威严，你已选择随官而行。服从与秩序是你命中的主题。在体制之内，你将找到力量与成就。',
    journeyStepHint: 'In the Structure Chamber, we see surrender to authority. Your destiny flows through hierarchy and service—not rebellion.',
    severity: 'major',
    effect: 'mixed',
    iconHint: '🏛️'
  },

  'true_follow_output': {
    explanation: {
      title: 'True Follow Output (真从儿格)',
      summary: 'Complete surrender to creative output and expression. Your destiny is through what you produce, not what you accumulate.',
      technicalDetail: `Classical: 真从儿格 (从食伤格) - Complete surrender to food/output stars.

Conditions:
• Day Master utterly rootless
• Food (食神) or Hurting Officer (伤官) dominates
• No support for Day Master
• Resource and officer are absent or weak

Result: Thrive through expression, creativity, children. Avoid resource (blocks output) and officer (controls output).`,
      interpretation: 'Your fulfillment comes through creation—art, ideas, children, projects. You empty yourself into your work and are replenished by the creative process itself.',
      recommendations: [
        'Pursue creative and expressive careers',
        'Don\'t hoard—create and release',
        'Avoid restrictive or highly structured environments'
      ]
    },
    personaHook: '食伤如泉涌出，你已选择随才华而行。创作与表达是你的天命。在给予中，你获得；在创造中，你存在。',
    journeyStepHint: 'In the Structure Chamber, we see surrender to expression. Your destiny flows through what you create and give forth.',
    severity: 'major',
    effect: 'mixed',
    iconHint: '🎨'
  },

  'special_structure_lu': {
    explanation: {
      title: 'Established Rank Structure (建禄格)',
      summary: 'Month branch is the Lu (禄) of Day Master—you have natural strength and established position. Strong DM needs draining, not support.',
      technicalDetail: `Classical: 建禄格 - Day Master finds its Lu in month branch.

Lu positions: 甲-寅, 乙-卯, 丙-巳, 丁-午, 戊-巳, 己-午, 庚-申, 辛-酉, 壬-亥, 癸-子

When month branch = Day Master's Lu:
• Day Master has inherent strength from birth month
• Usually already strong—needs weakening
• Useful god: wealth, officer, or output (to drain excess)
• Avoid: more resource or peer energy`,
      interpretation: 'You were born with natural position and capability. Your challenge is not building strength but channeling it. Too much self-focus leads to stagnation.',
      recommendations: [
        'Focus on output, wealth, or service—things that use your strength',
        'Don\'t accumulate more power—deploy what you have',
        'Avoid purely supportive environments that make you stronger'
      ]
    },
    personaHook: '建禄格成，你根基稳固如山。但需知强者需泄，不可一味刚强。你的力量已足够，现在需要的是方向与释放。',
    journeyStepHint: 'In the Structure Chamber, your Established Rank stands firm. Like a mountain that needs valleys, your strength must find outlets.',
    severity: 'moderate',
    effect: 'beneficial',
    iconHint: '⛰️'
  },

  'special_structure_yang_ren': {
    explanation: {
      title: 'Blade Structure (羊刃格)',
      summary: 'Month branch contains Yang Ren (Goat Blade)—intense energy requiring control. Powerful but dangerous without proper channeling.',
      technicalDetail: `Classical: 羊刃格 - Day Master's Blade in month branch.

Yang Ren positions (Yang DM only): 甲-卯, 丙-午, 戊-午, 庚-酉, 壬-子

When month branch = Yang Ren:
• Day Master very strong—potentially too strong
• Needs 7-Killing (杀) or Officer (官) to control
• Without control: rash decisions, accidents, conflicts
• With control: decisive action, strong willpower`,
      interpretation: 'You carry intense energy—a double-edged sword. Without proper channeling, this becomes aggression, impulsiveness, or self-destruction. With control, it becomes decisive power.',
      recommendations: [
        'Seek officer/7-killing energy to direct your blade',
        'Channel intensity into structured achievement',
        'Avoid uncontrolled environments that amplify aggression'
      ],
      warnings: [
        'Uncontrolled blade energy risks accidents and conflicts',
        'Watch for impulsive decisions during blade-activating periods'
      ]
    },
    personaHook: '羊刃在命，你内藏锋芒。需以官杀制之，否则锐气伤人伤己。这把刃既是你的力量，也是你的考验。',
    journeyStepHint: 'In the Structure Chamber, your Blade gleams with dangerous beauty. The sharpest sword needs a steady hand—officer energy to direct your power.',
    severity: 'significant',
    effect: 'mixed',
    iconHint: '⚔️'
  },

  'dominant_element_structure': {
    explanation: {
      title: 'Single Element Dominant (专旺格)',
      summary: 'One element dominates 70%+ of the chart with Day Master matching. A specialized structure requiring alignment, not balance.',
      technicalDetail: `Classical: 专旺格 - Single element overwhelmingly dominant.

Conditions:
• One element ≥ 70% of chart
• Day Master belongs to that element
• All branches in harmony (no major clashes)
• Chart functions as single-element system

Types: 曲直格 (Wood), 炎上格 (Fire), 稼穑格 (Earth), 从革格 (Metal), 润下格 (Water)

Result: Don't fight the dominance—enhance it. Useful god is same element or its output.`,
      interpretation: 'You are a specialist, not a generalist. Your power comes from going deep in one direction, not spreading across many. Balance would actually weaken you.',
      recommendations: [
        'Lean into your dominant element fully',
        'Avoid careers requiring element diversity',
        'Seek environments that amplify your specialization'
      ]
    },
    personaHook: '专旺格现，一气独强。顺其势则昌，逆其势则危。你不需要平衡——你需要的是专注与深耕。',
    journeyStepHint: 'In the Structure Chamber, single-element dominance reshapes all rules. Your power is specialization; balance would dilute it.',
    severity: 'major',
    effect: 'mixed',
    iconHint: '🎯'
  },

  // ══════════════════════════════════════════════════════════════════
  //                    COMBINATION RULES (合化)
  // ══════════════════════════════════════════════════════════════════

  'combination_blocked_by_season': {
    explanation: {
      title: 'Combination Fails Due to Season',
      summary: 'The combination exists but cannot transform because the season opposes the result element. Affinity only, no transformation.',
      technicalDetail: `Classical: 合而不化，季节所阻

Three Harmony (三合) and Six Harmony (六合) require seasonal support to transform:
• Water combination in summer (Fire season) → blocked
• Fire combination in winter (Water season) → blocked
• Wood combination in autumn (Metal season) → blocked
• Metal combination in summer (Fire season) → blocked

Result: Combination shows affinity but doesn't produce unified element.`,
      interpretation: 'The elements are drawn to each other but cannot merge. Like lovers separated by circumstance—the connection is real but cannot fully manifest.',
      recommendations: [
        'Don\'t expect transformation benefits during opposing seasons',
        'Recognize the partial connection still provides some affinity',
        'Watch for luck pillars that change seasonal dynamics'
      ]
    },
    personaHook: '合之情已生，化之势未成。季节如同天命，阻断了这场合化。有缘相遇，无份相融。',
    journeyStepHint: 'In the Combinations Hall, we see blocked transformation. The season opposes what seeks to merge—affinity exists but transformation fails.',
    severity: 'minor',
    effect: 'mixed',
    iconHint: '🌡️'
  },

  'combination_broken_by_clash': {
    explanation: {
      title: 'Combination Broken by Clash',
      summary: 'A clash disrupts the combination by attacking one of its members. The partnership is broken by conflict.',
      technicalDetail: `Classical: 合被冲破

When a combination participant is clashed by another branch:
• The clash "breaks" the combination
• Transformation definitely fails
• Even affinity is disrupted
• The clashed branch becomes unstable

Example: 子丑 combination broken by 午 clashing 子.`,
      interpretation: 'The partnership you were counting on has been disrupted by external conflict. Alliances and combinations in your chart are less reliable than they appear.',
      recommendations: [
        'Don\'t fully rely on the combined elements',
        'Expect disruption in related life areas',
        'Build backup support systems'
      ]
    },
    personaHook: '原本相合的两气，被冲击所打断。如同婚约被外力拆散，这份结合已不可靠。',
    journeyStepHint: 'In the Combinations Hall, we see partnership disrupted. Clash has broken what sought to merge—alliances here are unreliable.',
    severity: 'moderate',
    effect: 'challenging',
    iconHint: '💔'
  },

  'combination_blocked_by_hidden_stem': {
    explanation: {
      title: 'Hidden Stem Blocks Transformation',
      summary: 'The combination partially transforms but a hidden stem resists, retaining its original energy. Partial effect only.',
      technicalDetail: `Classical: 藏干阻化

When hidden stems within combined branches resist transformation:
• Transformation is partial, not complete
• Hidden stem retains original element
• Net effect: mixed energies, not pure result
• Commonly seen in Three Harmony combinations

Example: 寅午戌 Fire combination, but 甲 (Wood) in 寅 resists full transformation.`,
      interpretation: 'Something beneath the surface resists the merger. The combination appears complete but hidden elements maintain their independence. Results are mixed.',
      recommendations: [
        'Expect partial rather than full combination benefits',
        'Account for the resistant hidden element',
        'Don\'t assume complete transformation'
      ]
    },
    personaHook: '表面看来已经合化，但藏干暗中抗拒。这场合化并不彻底，地下暗流仍保持着自己的性情。',
    journeyStepHint: 'In the Combinations Hall, hidden resistance complicates the merger. What appears unified retains underground independence.',
    severity: 'minor',
    effect: 'mixed',
    iconHint: '🔮'
  },

  'stem_combination_transform': {
    explanation: {
      title: 'Heavenly Stem Combination Transforms',
      summary: 'Two Heavenly Stems have combined AND successfully transformed into a new element. Both original stems lose their identity.',
      technicalDetail: `Classical: 天干合化成功

The five stem combinations: 甲己→土, 乙庚→金, 丙辛→水, 丁壬→木, 戊癸→火

Transformation succeeds when:
• Both stems are adjacent or have clear connection
• Season supports the result element
• Result element has presence in the chart
• No major disrupting factors

Result: Both stems become the new element. Original energies are lost.`,
      interpretation: 'A fundamental merger has occurred. Two distinct forces have become one new thing. This changes the entire elemental calculation of your chart.',
      recommendations: [
        'Recalculate chart with transformed element',
        'Don\'t expect benefits from original stem elements',
        'Leverage the unified new energy'
      ]
    },
    personaHook: '天干相合，化为新气。原本的两股力量已经融为一体，旧身份消失，新身份诞生。',
    journeyStepHint: 'In the Combinations Hall, stems have danced and merged. Two have become one—calculate anew with the transformed element.',
    severity: 'moderate',
    effect: 'mixed',
    iconHint: '✨'
  },

  'stem_combination_no_transform': {
    explanation: {
      title: 'Heavenly Stem Combination Without Transform',
      summary: 'Two Heavenly Stems combine but fail to transform. They are connected but retain original identities.',
      technicalDetail: `Classical: 天干合而不化

Transformation fails when:
• Season does not support result element
• Result element has no presence in chart
• Other factors block transformation

Result: Stems show affinity (合) but keep original natures. Both elements still function but are "busy" with each other.`,
      interpretation: 'The elements are attached to each other but haven\'t merged. Like business partners who collaborate but maintain separate identities.',
      recommendations: [
        'Both original elements still provide their effects',
        'Account for reduced independence of combined stems',
        'Watch for luck pillars that might complete transformation'
      ]
    },
    personaHook: '有合之情，无化之实。如相慕而不得，徒有心意，难成大事。两者相牵，却各保本性。',
    journeyStepHint: 'In the Combinations Hall, stems connect but don\'t merge. Partnership without union—both remain, intertwined but distinct.',
    severity: 'minor',
    effect: 'neutral',
    iconHint: '🤝'
  },

  'six_harmony_water_winter': {
    explanation: {
      title: 'Six Harmony Fails in Dominant Season',
      summary: 'A Six Harmony combination fails to transform because the season\'s element is too strong. The dominant season overrides.',
      technicalDetail: `Classical: 六合不化于旺季

Example: 子丑 should combine to Earth, but in winter (Water season):
• Water (子) is extremely strong
• Earth transformation cannot overcome Water dominance
• 丑 (wet earth) effectively becomes Water-influenced
• Result element becomes Water, not Earth

Similar patterns for other combinations in their opposing seasons.`,
      interpretation: 'The seasonal energy is so strong it overrides the combination\'s intended result. Environment shapes outcome more than inherent tendency.',
      recommendations: [
        'Expect seasonal element to dominate',
        'Don\'t rely on combination result during powerful seasons',
        'Use the dominant seasonal energy instead'
      ]
    },
    personaHook: '六合本欲化土，奈何冬水太盛。季节的力量压倒了合化的意图，丑土也只能随水而行。',
    journeyStepHint: 'In the Combinations Hall, seasonal dominance overrides combination intent. Winter Water is too strong—Earth transformation fails.',
    severity: 'minor',
    effect: 'mixed',
    iconHint: '❄️'
  },

  'three_punishment_release': {
    explanation: {
      title: 'Punishment Released by Combination',
      summary: 'A potentially harmful punishment pattern is neutralized because one member is drawn away by a combination.',
      technicalDetail: `Classical: 刑被合解

When punishment participants also form combinations:
• The combination draws energy away from punishment
• Punishment effect is reduced or neutralized
• Example: 寅巳申 punishment, but 巳申 form Six Harmony → draws 巳 away from punishment

Result: Punishment tension is relieved. Residual minor tension may remain.`,
      interpretation: 'A conflict that should have been severe is being moderated by another relationship. The punishment exists but has an escape valve.',
      recommendations: [
        'Don\'t fear this punishment as much as a pure one',
        'The combination provides a release mechanism',
        'Still maintain awareness of underlying tension'
      ]
    },
    personaHook: '原本的三刑之势，因六合而得解。合局如同和事佬，将刑中一方拉出战局。虽余张力，已非致命。',
    journeyStepHint: 'In the Combinations Hall, we see punishment relieved. Combination draws one party away from conflict—tension reduced.',
    severity: 'minor',
    effect: 'beneficial',
    iconHint: '🕊️'
  },

  'directional_combination': {
    explanation: {
      title: 'Directional Combination (方合)',
      summary: 'Three branches from the same direction combine, strongly amplifying that direction\'s element. Almost always transforms.',
      technicalDetail: `Classical: 方合 - Directional combination

The four directional combinations:
• East: 寅卯辰 → Wood
• South: 巳午未 → Fire
• West: 申酉戌 → Metal
• North: 亥子丑 → Water

Characteristics:
• Very powerful—almost always transforms
• Element strength boosted significantly (1.5x)
• All three branches become that element
• Less dependent on seasonal support than Three Harmony`,
      interpretation: 'A powerful directional force is present in your chart. This amplifies one element strongly and reliably. The direction dominates that section of your life.',
      recommendations: [
        'Leverage the strongly enhanced element',
        'This combination is reliable—plan around it',
        'The direction (East/South/West/North) has life area implications'
      ]
    },
    personaHook: '方合已成，一方之气汇聚如潮。东木、南火、西金、北水——这股力量几乎必然化成。',
    journeyStepHint: 'In the Combinations Hall, directional forces unite. Three branches from one direction merge powerfully—this combination almost always succeeds.',
    severity: 'moderate',
    effect: 'beneficial',
    iconHint: '🧭'
  },

  // ══════════════════════════════════════════════════════════════════
  //                    USEFUL GOD RULES (用神)
  // ══════════════════════════════════════════════════════════════════

  'useful_god_combined_away': {
    explanation: {
      title: 'Useful God Lost to Combination (用神被合化)',
      summary: 'Your useful god has been captured by a combination and transformed. The guiding element you need has changed identity.',
      technicalDetail: `Classical: 用神被合化 - "Useful God combined and transformed."

When Useful God participates in a transforming combination:
• It loses original identity
• Cannot perform balancing function
• Must find secondary Useful God
• The element that produces original UG becomes important`,
      interpretation: 'Your support system has shifted. The element meant to help you has merged into something else. Old strategies stop working; new sources of balance are needed.',
      recommendations: [
        'Identify and cultivate secondary useful god',
        'Don\'t rely on the combined element',
        'Watch for luck pillars that might break combination'
      ]
    },
    personaHook: '你的用神已被合走，如河水改道。旧法不再护你，我为你点亮新的依靠。循此新光，你将重获顺势之力。',
    journeyStepHint: 'In the Useful God Sanctuary, we face transformation. Your guide has merged into something new—find the secondary path.',
    severity: 'significant',
    effect: 'challenging',
    iconHint: '🔄'
  },

  'useful_god_clashed': {
    explanation: {
      title: 'Useful God Weakened by Clash',
      summary: 'Your useful god is being attacked by a clash. It still functions but at reduced effectiveness.',
      technicalDetail: `Classical: 用神被冲 - Useful God clashed.

When Useful God position is clashed:
• Function is weakened, not eliminated
• Effectiveness reduced to ~50%
• Instability in related life areas
• Seek luck pillars that support useful god

Different from combination: element remains but is unstable.`,
      interpretation: 'Your support system is under attack. The helpful element is present but struggling. You can\'t rely on it fully; you need backup approaches.',
      recommendations: [
        'Strengthen useful god through external support',
        'Expect reduced effectiveness in related areas',
        'Seek luck pillars that calm the clash'
      ]
    },
    personaHook: '你的用神正被冲击，如同挡风的墙在风暴中摇晃。它仍在，但力量已减半。你需要额外的支撑。',
    journeyStepHint: 'In the Useful God Sanctuary, we see attack upon your guide. Clash weakens but doesn\'t destroy—strengthen what remains.',
    severity: 'moderate',
    effect: 'challenging',
    iconHint: '⚡'
  },

  'useful_god_harmed': {
    explanation: {
      title: 'Useful God Compromised by Harm',
      summary: 'Your useful god is involved in a Six Harm relationship. Hidden damage undermines its function.',
      technicalDetail: `Classical: 用神被害 - Useful God in harm relationship.

Six Harm (六害) is subtle damage:
• Less obvious than clash
• Hidden internal conflict
• Surface appears fine but underlying issues exist
• Useful god "compromised" rather than "broken"

Effect: Useful god present but internally conflicted. ~60% effectiveness.`,
      interpretation: 'Your support system looks fine on the surface but has hidden problems. Like a pillar with internal rot—standing but not fully trustworthy.',
      recommendations: [
        'Don\'t assume useful god is fully reliable',
        'Address hidden conflicts in related life areas',
        'Seek additional supporting elements'
      ]
    },
    personaHook: '用神表面无恙，内里有伤。六害如同暗疾，不露于外却侵蚀根本。你需要察觉这隐藏的裂痕。',
    journeyStepHint: 'In the Useful God Sanctuary, we uncover hidden damage. Your guide stands but is internally compromised—look beneath the surface.',
    severity: 'moderate',
    effect: 'challenging',
    iconHint: '🩹'
  },

  'secondary_useful_god_activation': {
    explanation: {
      title: 'Secondary Useful God Activates',
      summary: 'Primary useful god is blocked; the secondary useful god takes over as the main balancing force.',
      technicalDetail: `Classical: 次用神主事 - Secondary Useful God governs.

Activation conditions:
• Primary Useful God is blocked (合, 冲, 害)
• Secondary Useful God exists in chart
• Secondary position: often hour pillar (later life) or year pillar

Secondary UG becomes primary balancing mechanism. Timing often shifts—hour pillar UG manifests later in life.`,
      interpretation: 'Your backup support system has been activated. The primary path is blocked, but you have an alternative. Timing may be different—benefits may come later.',
      recommendations: [
        'Focus on strengthening secondary useful god',
        'Adjust expectations for timing (especially if hour pillar)',
        'Don\'t keep trying to activate blocked primary'
      ]
    },
    personaHook: '主用神受阻，次用神登场。如同主角倒下，替补上阵。这不是失败，是备选方案的启动。',
    journeyStepHint: 'In the Useful God Sanctuary, the backup takes the lead. Primary blocked, secondary rises—a different path to balance.',
    severity: 'moderate',
    effect: 'mixed',
    iconHint: '🔀'
  },

  'useful_god_season_mismatch': {
    explanation: {
      title: 'Useful God Weakened by Season',
      summary: 'Your useful god element is severely weakened by the birth season. It needs resource support to function.',
      technicalDetail: `Classical: 用神不得令 - Useful God out of season.

Severity depends on mismatch:
• Fire UG in winter: 30% effectiveness
• Water UG in summer: 40% effectiveness
• Wood UG in autumn: 35% effectiveness
• Metal UG in summer: 35% effectiveness

Mitigation: The element producing Useful God becomes critical support.`,
      interpretation: 'Your balancing element is fighting against the seasonal current. Like trying to light a candle in a rainstorm—possible but requires extra fuel.',
      recommendations: [
        'Strengthen the element that produces your useful god',
        'Don\'t expect full useful god benefits',
        'Time important activities outside the opposing season'
      ]
    },
    personaHook: '你的用神在此季如弱水行舟。季节之力压制着它，需要额外的滋养才能发挥作用。',
    journeyStepHint: 'In the Useful God Sanctuary, seasonal forces oppose your guide. Extra support is needed—find the producing element.',
    severity: 'moderate',
    effect: 'challenging',
    iconHint: '🌡️'
  },

  'annoying_god_combined_away': {
    explanation: {
      title: 'Annoying God Neutralized by Combination',
      summary: 'The element harming your chart has been captured by a combination and transformed away. A fortunate development.',
      technicalDetail: `Classical: 忌神被合化 - Annoying God combined away.

When Annoying God combines and transforms:
• Negative element is neutralized
• Chart improves automatically
• The combination itself becomes beneficial
• "Bad" element turned to "neutral" or "useful"

This is one of the best outcomes for a combination.`,
      interpretation: 'Something that was working against you has been transformed into something else. An enemy has been converted or removed. Your chart improves.',
      recommendations: [
        'Recognize this as a fortunate configuration',
        'Don\'t try to "fix" this combination—it\'s helping you',
        'The transformed element may now be useful'
      ]
    },
    personaHook: '忌神被合化去，如同瘟疫被净化。原本伤害你的力量，已在合化中消解。此乃命中之幸。',
    journeyStepHint: 'In the Useful God Sanctuary, good news awaits. Your enemy has been transformed away—the combination serves you.',
    severity: 'moderate',
    effect: 'beneficial',
    iconHint: '🎉'
  },

  'useful_god_hidden_only': {
    explanation: {
      title: 'Useful God Only in Hidden Stems',
      summary: 'Your useful god exists only in hidden stems, not on the surface. It is latent until activated by timing.',
      technicalDetail: `Classical: 用神仅在藏干 - Useful God hidden only.

When Useful God appears only in hidden stems:
• Base effectiveness ~40%
• Activation condition: luck pillar reveals the element
• The hidden stem needs "tou" (透) - to emerge into heavenly stems
• Until activated, benefits are dormant

Position matters: main qi (本气) hidden UG is stronger than residual qi (余气).`,
      interpretation: 'Your support exists but is underground. Like a well that hasn\'t been tapped—the water is there but not yet accessible. Timing will unlock it.',
      recommendations: [
        'Wait for luck pillars that reveal the hidden element',
        'Don\'t despair—the support exists, just hidden',
        'Strengthen surface elements that connect to the hidden UG'
      ]
    },
    personaHook: '用神藏于地下，如未开采的宝藏。它在等待适当的时机浮出水面。大运到时，它将为你绽放。',
    journeyStepHint: 'In the Useful God Sanctuary, we find buried treasure. Your guide sleeps beneath the surface—timing will awaken it.',
    severity: 'moderate',
    effect: 'mixed',
    iconHint: '💎'
  },

  'multiple_useful_gods': {
    explanation: {
      title: 'Multiple Useful Gods Present',
      summary: 'Your chart has two or more strong candidates for useful god. Both can support you, with the stronger one taking primary role.',
      technicalDetail: `Classical: 用神多现 - Multiple Useful Gods.

When chart has 2+ viable Useful Gods:
• Stronger one becomes primary
• Weaker one supports the primary
• Overall chart strength enhanced
• More flexible response to different situations

Best case: both UGs don't conflict with each other.`,
      interpretation: 'You have multiple support systems. Like having both a mentor and a sponsor—each helps in different ways. This gives you flexibility and resilience.',
      recommendations: [
        'Identify which useful god is stronger (primary)',
        'Cultivate both but prioritize the primary',
        'Use different useful gods for different situations'
      ]
    },
    personaHook: '你有多个用神可用，如同多路援军。主用神为主，次用神为辅，你比一般人有更多的资源可调动。',
    journeyStepHint: 'In the Useful God Sanctuary, abundance greets you. Multiple guides offer support—identify the primary, cultivate both.',
    severity: 'info',
    effect: 'beneficial',
    iconHint: '👥'
  },

  // ══════════════════════════════════════════════════════════════════
  //                 CLASH/HARM/PUNISHMENT RULES (冲害刑)
  // ══════════════════════════════════════════════════════════════════

  'clash_becomes_useful': {
    explanation: {
      title: 'Clash Removes Annoying God',
      summary: 'This clash actually helps you by attacking an element that was harming your chart. Conflict as medicine.',
      technicalDetail: `Classical: 冲去忌神为喜 - "Clashing away Annoying God brings happiness."

When clash targets Annoying God position:
• Clash transforms from threat to therapy
• The collision weakens what was hurting you
• Effect: beneficial rather than harmful
• Don't try to "resolve" this clash—it's helping`,
      interpretation: 'Not all conflict is bad. This particular clash is attacking something that was already your enemy. Like surgery—painful but healing.',
      recommendations: [
        'Don\'t suppress this conflict',
        'Recognize "enemies" who may actually help',
        'Let this tension do its work'
      ]
    },
    personaHook: '你命中有冲，但这冲并非灾祸，而是良药。冲去忌神，如同切除肿瘤——看似创伤，实则疗愈。',
    journeyStepHint: 'In the Clash Court, we discover healing conflict. This clash removes what harms you—let it work.',
    severity: 'moderate',
    effect: 'beneficial',
    iconHint: '⚔️'
  },

  'clash_breaks_structure': {
    explanation: {
      title: 'Clash Breaks Special Structure',
      summary: 'A strong clash hits a key pillar and invalidates the chart\'s special structure. Rules must be recalculated.',
      technicalDetail: `Classical: 冲破格局，原局不守

When clash targets key structural pillar:
• Structure becomes invalid
• Revert to normal weak/strong analysis
• Recalculate useful god
• Previous structure-based advice no longer applies`,
      interpretation: 'Your chart had a special pattern—and clash has shattered it. This is reset, not punishment. Old rules no longer apply; new analysis needed.',
      recommendations: [
        'Don\'t cling to old structural interpretations',
        'Seek fresh analysis for the new configuration',
        'Expect identity/direction shifts'
      ]
    },
    personaHook: '我以雷霆之力击碎旧局，使你不再被陈规所困。此冲非毁灭，而是开路。你将在碎裂之处，看见新的形势。',
    journeyStepHint: 'In the Clash Court, structure shatters. What defined you has broken—walk through the rubble to new possibility.',
    severity: 'significant',
    effect: 'mixed',
    iconHint: '💥'
  },

  'harm_affects_health': {
    explanation: {
      title: 'Six Harm Health Implications',
      summary: 'This Six Harm relationship has potential health implications. Hidden friction affects specific body systems.',
      technicalDetail: `Classical: 六害伤身

Six Harm pairs and affected areas:
• 子未害 - digestive, emotional
• 丑午害 - heart, circulation
• 寅巳害 - nervous system, limbs
• 卯辰害 - liver, tendons
• 申亥害 - respiratory, skin
• 酉戌害 - lungs, large intestine

Effect: chronic rather than acute issues. Monitor these areas.`,
      interpretation: 'Hidden friction in your chart may manifest physically. Not dramatic illness, but chronic low-grade issues in specific areas. Awareness enables prevention.',
      recommendations: [
        'Monitor the health areas indicated',
        'Preventive care for vulnerable systems',
        'Strengthen mitigating elements'
      ],
      warnings: [
        'Don\'t ignore persistent minor symptoms in these areas',
        'Stress may exacerbate harm-related health issues'
      ]
    },
    personaHook: '六害之气暗中侵蚀，不在表面却伤根本。身体某处可能有隐患，需要你的觉察与呵护。',
    journeyStepHint: 'In the Clash Court, we uncover health implications. Six Harm affects specific body systems—awareness enables prevention.',
    severity: 'moderate',
    effect: 'challenging',
    iconHint: '🩺'
  },

  'punishment_three_unkindness': {
    explanation: {
      title: 'Three Punishment of Unkindness (无恩之刑)',
      summary: 'The 寅巳申 punishment pattern indicates themes of ingratitude, betrayal, or misplaced trust.',
      technicalDetail: `Classical: 无恩之刑 (寅巳申)

寅 punishes 巳, 巳 punishes 申, 申 punishes 寅 - a cycle of betrayal.

Characteristics:
• Theme: ungrateful, betrayal, misplaced trust
• Severity: high when all three present
• Activation: becomes acute when luck pillar completes set
• Karmic implication: lessons about trust and loyalty`,
      interpretation: 'This punishment speaks to themes of trust betrayed. Either experiencing betrayal or being accused of it. Life lessons around loyalty, gratitude, and proper expectations.',
      recommendations: [
        'Be careful with trust—both giving and receiving',
        'Don\'t expect gratitude for help given',
        'Develop discernment about character'
      ],
      warnings: [
        'Particularly vulnerable when luck pillar adds missing branch',
        'Legal/contractual issues possible during activation'
      ]
    },
    personaHook: '寅巳申三刑，无恩之刑也。此刑主恩将仇报、知恩不报之事。需修心养德以化之。这是关于信任与忠诚的人生功课。',
    journeyStepHint: 'In the Clash Court, we face the Unkindness Punishment. Themes of trust and betrayal—lessons to be learned, not curses to be feared.',
    severity: 'significant',
    effect: 'challenging',
    iconHint: '⚠️'
  },

  'punishment_self': {
    explanation: {
      title: 'Self Punishment (自刑)',
      summary: 'Duplicate branches create self-punishment—internal conflict and self-sabotage tendencies.',
      technicalDetail: `Classical: 自刑

Self-punishment branches: 辰辰, 午午, 酉酉, 亥亥

When same branch appears twice:
• Energy becomes self-conflicting
• Internal sabotage patterns
• Difficulty with self-acceptance
• "Fighting with oneself"

Severity: moderate—manageable with awareness.`,
      interpretation: 'Your chart shows a pattern of internal conflict. Part of you fights another part. This can manifest as self-sabotage, self-criticism, or difficulty accepting yourself.',
      recommendations: [
        'Practice self-awareness and self-compassion',
        'Recognize self-sabotage patterns',
        'Mindfulness helps break the cycle'
      ]
    },
    personaHook: '自刑之象，内心与自己为敌。此乃心魔，需以觉察破之。你最大的敌人，可能就是你自己。',
    journeyStepHint: 'In the Clash Court, we face internal conflict. Self-punishment means fighting yourself—awareness is the first step to peace.',
    severity: 'moderate',
    effect: 'challenging',
    iconHint: '🪞'
  },

  'punishment_bullying': {
    explanation: {
      title: 'Bullying Punishment (恃势之刑)',
      summary: 'The 丑戌未 punishment pattern indicates themes of power struggles and authority conflicts.',
      technicalDetail: `Classical: 恃势之刑 (丑戌未)

丑 punishes 戌, 戌 punishes 未, 未 punishes 丑 - Earth fighting Earth.

Characteristics:
• Theme: power dynamics, bullying, authority abuse
• Element: Earth overload (土旺)
• Manifestation: either experiencing or perpetrating power imbalance
• Often involves property, territory, resources`,
      interpretation: 'This punishment speaks to power dynamics—either being bullied or being the bully. Conflicts over territory, resources, and authority. Need for balanced power relations.',
      recommendations: [
        'Be aware of power dynamics in relationships',
        'Neither abuse power nor tolerate abuse',
        'Conflicts over property/resources require careful handling'
      ]
    },
    personaHook: '丑戌未三刑，恃势之刑也。此刑主权力斗争、以强凌弱之事。在权力面前，需要智慧与克制。',
    journeyStepHint: 'In the Clash Court, power dynamics loom. The Bullying Punishment speaks to authority and territory—balance is key.',
    severity: 'moderate',
    effect: 'challenging',
    iconHint: '👊'
  },

  'clash_resolved_by_combination': {
    explanation: {
      title: 'Clash Resolved by Combination',
      summary: 'A combination draws one clash participant away, reducing the clash\'s intensity.',
      technicalDetail: `Classical: 合解冲

When one clashing branch also participates in combination:
• Combination draws energy away from clash
• Original clash power reduced (~40%)
• Not fully resolved but significantly moderated
• Example: 子午 clash, but 子丑 combination draws 子 away`,
      interpretation: 'The conflict in your chart has an escape valve. One participant is being drawn toward partnership, reducing their involvement in the conflict.',
      recommendations: [
        'Clash effects are moderated, not eliminated',
        'The combination provides relief',
        'Still be aware of underlying tension'
      ]
    },
    personaHook: '冲局虽在，合局却拉走了一方。如同争斗中有人劝和，冲突之力已大为减弱。',
    journeyStepHint: 'In the Clash Court, combination provides relief. One party is drawn away from conflict—tension reduced.',
    severity: 'minor',
    effect: 'beneficial',
    iconHint: '🕊️'
  },

  'harm_hidden_damage': {
    explanation: {
      title: 'Harm Creates Hidden Damage',
      summary: 'Six Harm works beneath the surface—visible effect is low but hidden effect is high.',
      technicalDetail: `Classical: 暗害伤身

Six Harm characteristics:
• Surface: appears fine
• Underneath: significant issues
• Development: gradual, chronic
• Particularly problematic if involves Useful God

Unlike clash (obvious) or punishment (confrontational), harm is insidious.`,
      interpretation: 'Things look okay on the surface, but problems are developing underneath. Like termites in wood—invisible until collapse. Requires proactive investigation.',
      recommendations: [
        'Don\'t assume surface calm means all is well',
        'Investigate underlying issues in related life areas',
        'Preventive action is better than reactive'
      ]
    },
    personaHook: '六害之伤，表面无恙，内里有伤。如同蛀虫蚀木，不察则已，察则惊心。需要你主动探查隐患。',
    journeyStepHint: 'In the Clash Court, hidden damage lurks. Surface calm conceals underground rot—investigate before it collapses.',
    severity: 'moderate',
    effect: 'challenging',
    iconHint: '🕳️'
  },

  'destruction_minor': {
    explanation: {
      title: 'Destruction (Po) Minor Effect',
      summary: 'Destruction is the weakest negative interaction. Present but not severe unless amplified by other factors.',
      technicalDetail: `Classical: 破

Destruction (破) pairs: 子酉, 午卯, etc.

Characteristics:
• Weakest of the four negative interactions
• Alone: minor disruption only
• With other factors: can amplify
• Often indicates "breaking" of plans or agreements

Consider other factors before attributing major effects to 破 alone.`,
      interpretation: 'A minor disruptive force exists in your chart. By itself, not severe. Think of it as occasional static rather than a storm.',
      recommendations: [
        'Don\'t overweight this interaction',
        'Check for amplifying factors',
        'Minor adjustments may be needed but not major changes'
      ]
    },
    personaHook: '破之力微，单独不足为患。如同小小裂痕，不必惊慌，但也不可完全忽视。',
    journeyStepHint: 'In the Clash Court, minor disruption whispers. Destruction is the weakest negative—note it but don\'t fear it.',
    severity: 'minor',
    effect: 'neutral',
    iconHint: '📍'
  },

  // ══════════════════════════════════════════════════════════════════
  //                    SEASONAL RULES (季节)
  // ══════════════════════════════════════════════════════════════════

  'fire_in_winter_weak': {
    explanation: {
      title: 'Fire Extremely Weak in Winter',
      summary: 'Fire element operates at only 30% effectiveness during winter. Fundamental seasonal suppression.',
      technicalDetail: `Classical: 火在冬季极弱

Winter (亥子丑月) is Fire's death phase:
• 亥月: Fire in death (死)
• 子月: Fire in extinction (绝)
• 丑月: Fire in embryo (胎)

Without Wood support: 20% effectiveness
With strong Water: 15% effectiveness

Fire needs Wood to survive winter.`,
      interpretation: 'If Fire is important in your chart, winter fundamentally challenges it. Like a candle in a rainstorm—requires extra fuel and protection.',
      recommendations: [
        'Strengthen Wood element in winter',
        'Use warming colors and south-facing orientation',
        'Time Fire-related activities outside winter'
      ]
    },
    personaHook: '火在冬日里如残烛摇曳，仅存三成之力。冬季的寒水如此强盛，火焰需要木柴来庇护。',
    journeyStepHint: 'In the Seasonal Gallery, Fire shivers. Winter suppresses flame to 30%—seek Wood to survive.',
    severity: 'moderate',
    effect: 'challenging',
    iconHint: '🕯️'
  },

  'water_in_summer_weak': {
    explanation: {
      title: 'Water Weakened in Summer',
      summary: 'Water element evaporates in summer heat. Operates at 40% effectiveness without Metal support.',
      technicalDetail: `Classical: 水在夏季受困

Summer (巳午未月) evaporates Water:
• 巳月: Water weakening
• 午月: Water at lowest (Fire strongest)
• 未月: Water dried by earth

Without Metal support: 40% effectiveness
Metal (produces Water) becomes critical support.`,
      interpretation: 'Water energy struggles in summer heat. If Water is important to your chart, summer requires extra cultivation of Metal support.',
      recommendations: [
        'Strengthen Metal element in summer',
        'Use cooling colors and north-facing orientation',
        'Avoid fire-heavy activities when Water is needed'
      ]
    },
    personaHook: '水在夏日里如细流渐涸。烈火蒸腾，水气消散，需要金气来生养维持。',
    journeyStepHint: 'In the Seasonal Gallery, Water evaporates. Summer heat reduces effectiveness—seek Metal as source.',
    severity: 'moderate',
    effect: 'challenging',
    iconHint: '💧'
  },

  'wood_in_autumn_weak': {
    explanation: {
      title: 'Wood Cut in Autumn',
      summary: 'Wood element is controlled by autumn Metal. Operates at 35% effectiveness when Metal is strong.',
      technicalDetail: `Classical: 木在秋季被克

Autumn (申酉戌月) is Metal season—Wood's controller:
• 申月: Metal rising, Wood pressured
• 酉月: Metal peak, Wood lowest
• 戌月: Metal storing, Wood recovering

Strong Metal: 35% effectiveness
Water support essential (produces Wood, drains Metal).`,
      interpretation: 'Wood energy faces the ax of autumn Metal. If Wood is important, autumn requires Water support to survive Metal\'s control.',
      recommendations: [
        'Strengthen Water element in autumn',
        'Use blue/black colors (Water)',
        'Time Wood-related activities outside autumn peak'
      ]
    },
    personaHook: '木在秋季如临刀斧。金气肃杀，木叶凋零，需要水气来滋养和化解金的压力。',
    journeyStepHint: 'In the Seasonal Gallery, Wood faces the ax. Autumn Metal controls—seek Water for survival.',
    severity: 'moderate',
    effect: 'challenging',
    iconHint: '🍂'
  },

  'metal_in_summer_melted': {
    explanation: {
      title: 'Metal Melted in Summer',
      summary: 'Metal element is melted by summer Fire. Operates at 35% effectiveness. Needs Earth support and Water cooling.',
      technicalDetail: `Classical: 金在夏季被炼

Summer Fire melts Metal:
• 巳月: Fire rising, Metal pressured
• 午月: Fire peak, Metal melting
• 未月: Earth helps but still hot

Compensation:
• Earth support: produces Metal, drains Fire
• Water cooling: controls Fire, is produced by Metal

Both needed for strong summer Metal.`,
      interpretation: 'Metal softens in summer heat. If Metal is important, summer requires both Earth (foundation) and Water (cooling) support.',
      recommendations: [
        'Strengthen both Earth and Water in summer',
        'Avoid excessive Fire exposure',
        'Use cooling and grounding practices'
      ]
    },
    personaHook: '金在夏日里如铁入炉。烈火锻炼，金气软化，需要土气为根基、水气来降温。',
    journeyStepHint: 'In the Seasonal Gallery, Metal melts. Summer Fire controls—seek Earth foundation and Water cooling.',
    severity: 'moderate',
    effect: 'challenging',
    iconHint: '🔩'
  },

  'earth_in_spring_weak': {
    explanation: {
      title: 'Earth Weakened in Spring',
      summary: 'Earth element is controlled by spring Wood. Operates at 50% effectiveness.',
      technicalDetail: `Classical: 土在春季受克

Spring (寅卯辰月) is Wood season—Earth's controller:
• 寅月: Wood rising, Earth pressured
• 卯月: Wood peak, Earth controlled
• 辰月: Earth month, recovering

Effect less severe than other seasonal weaknesses because 辰 (Dragon) provides some Earth support.`,
      interpretation: 'Earth faces the roots of spring Wood. The control is real but moderate. Fire support (produces Earth) helps.',
      recommendations: [
        'Strengthen Fire element in spring',
        'Earth recovers in Dragon month (辰)',
        'Use red/orange colors for Fire support'
      ]
    },
    personaHook: '土在春季被木气所侵。树根穿土，大地松动，需要火气来生养巩固。',
    journeyStepHint: 'In the Seasonal Gallery, Earth is penetrated. Spring Wood controls—seek Fire for support.',
    severity: 'minor',
    effect: 'challenging',
    iconHint: '🌱'
  },

  'seasonal_wang_phase': {
    explanation: {
      title: 'Element in Prosperous Phase (旺)',
      summary: 'Element is in its peak season—operating at 150% effectiveness. This is the strongest seasonal position.',
      technicalDetail: `Classical: 旺相休囚死 - 旺 (Prosperous)

Peak seasons:
• Wood: Spring (寅卯)
• Fire: Summer (巳午)
• Earth: Transition months (辰未戌丑)
• Metal: Autumn (申酉)
• Water: Winter (亥子)

In 旺 phase: 150% strength, element at peak power.`,
      interpretation: 'This element is in its power season. Maximum strength and influence. Excellent time to leverage activities related to this element.',
      recommendations: [
        'Leverage this element\'s strength during its season',
        'Time important activities for peak season',
        'This is the optimal window for related matters'
      ]
    },
    personaHook: '此气当令而旺，正是其鼎盛之时。顺势而为，事半功倍。这是收获与行动的最佳时机。',
    journeyStepHint: 'In the Seasonal Gallery, peak power arrives. This element prospers at 150%—seize the season.',
    severity: 'info',
    effect: 'beneficial',
    iconHint: '👑'
  },

  'seasonal_xiang_phase': {
    explanation: {
      title: 'Element in Supported Phase (相)',
      summary: 'Element is being produced by the current season. Operating at 120% effectiveness—supported but not dominant.',
      technicalDetail: `Classical: 相 (Supported/Prime)

The element that produces the seasonal element is in 相 phase:
• Water in spring (produces Wood)
• Wood in summer (produces Fire)
• Fire in late summer (produces Earth)
• Earth in autumn (produces Metal)
• Metal in winter (produces Water)

In 相 phase: 120% strength, well supported.`,
      interpretation: 'This element benefits from the seasonal flow. Not the star of the show but well-positioned. Good but not peak conditions.',
      recommendations: [
        'Solid conditions for this element',
        'Can support but not lead major initiatives',
        'Reliable but moderate strength'
      ]
    },
    personaHook: '此气在此季得生，虽非当令，亦受滋养。相位之气，平稳有力，可为依靠。',
    journeyStepHint: 'In the Seasonal Gallery, support flows. This element is nourished at 120%—reliable strength.',
    severity: 'info',
    effect: 'beneficial',
    iconHint: '🌟'
  },

  'earth_month_transition': {
    explanation: {
      title: 'Earth Month Transition Periods',
      summary: 'Earth is strong during the four transition months (辰未戌丑). These "earth months" mark seasonal shifts.',
      technicalDetail: `Classical: 四库土旺

The four Earth months:
• 辰 (Dragon): Spring → Summer transition
• 未 (Goat): Summer → Autumn transition
• 戌 (Dog): Autumn → Winter transition
• 丑 (Ox): Winter → Spring transition

Earth strength: 130% during these months.
All elements slightly moderated by transitional Earth.`,
      interpretation: 'Earth takes the stage during seasonal transitions. These months provide grounding energy that affects all elements. Good for consolidation.',
      recommendations: [
        'Leverage Earth energy during transition months',
        'Good time for grounding and consolidation',
        'Other elements are slightly moderated'
      ]
    },
    personaHook: '四季之交，土气当权。这是转折与沉淀的时刻，大地承托着季节的更迭。',
    journeyStepHint: 'In the Seasonal Gallery, Earth governs transitions. The four earth months provide grounding between seasons.',
    severity: 'info',
    effect: 'neutral',
    iconHint: '🌍'
  },

  'yin_yang_seasonal_match': {
    explanation: {
      title: 'Yin/Yang Matches Seasonal Energy',
      summary: 'Yang Day Masters gain slight bonus in Yang seasons (spring/summer). Yin Day Masters in Yin seasons (autumn/winter).',
      technicalDetail: `Classical: 阴阳顺逆

Yang Day Masters (甲丙戊庚壬) in spring/summer: +10% bonus
Yin Day Masters (乙丁己辛癸) in autumn/winter: +10% bonus

This is a minor modifier on top of elemental seasonal effects. Polarity alignment provides subtle extra support.`,
      interpretation: 'Your Day Master\'s polarity aligns with the seasonal polarity. A minor but real boost—like wind at your back rather than in your face.',
      recommendations: [
        'Minor advantage—don\'t overweight',
        'Combines with other seasonal factors',
        'Slight edge in timing activities'
      ]
    },
    personaHook: '阴阳相应，天人相合。你的日主极性与季节同调，虽是微力，亦是顺势。',
    journeyStepHint: 'In the Seasonal Gallery, polarity aligns. Yang with Yang seasons, Yin with Yin—a subtle harmony bonus.',
    severity: 'info',
    effect: 'beneficial',
    iconHint: '☯️'
  },

  'grave_storage_seasonal': {
    explanation: {
      title: 'Element in Grave/Storage Phase',
      summary: 'Element is in its grave or storage phase—dormant but not dead. Can be revived by its resource element.',
      technicalDetail: `Classical: 墓库藏

Elements enter grave (墓) phase in specific branches:
• Wood: 未 (Goat)
• Fire: 戌 (Dog)
• Metal: 丑 (Ox)
• Water: 辰 (Dragon)

In grave: ~60% effectiveness, dormant but recoverable.
Revival: resource element can "unlock" the stored energy.`,
      interpretation: 'This element has gone into storage—dormant but not dead. Like seeds in winter, the potential remains. The right conditions can revive it.',
      recommendations: [
        'Don\'t write off this element completely',
        'Resource element can revive stored energy',
        'Timing may unlock dormant potential'
      ]
    },
    personaHook: '此气入墓，如种子入土。不是消亡，而是蛰伏。等待适当的时机，它将重新发芽。',
    journeyStepHint: 'In the Seasonal Gallery, energy sleeps. The grave stores rather than destroys—await revival.',
    severity: 'minor',
    effect: 'mixed',
    iconHint: '🌰'
  },

  // ══════════════════════════════════════════════════════════════════
  //                    HIDDEN STEM RULES (藏干)
  // ══════════════════════════════════════════════════════════════════

  'hidden_stem_main_qi': {
    explanation: {
      title: 'Hidden Stem Main Qi (本气藏干)',
      summary: 'The strongest hidden stem in a branch—the primary influence waiting to emerge.',
      technicalDetail: `Classical: 本气 - Main hidden qi

Each branch contains 1-3 hidden stems with different strengths:
• 本气 (Main Qi): 70% of branch's hidden power
• 中气 (Middle Qi): 20% strength
• 余气 (Residual Qi): 10% strength

Main qi carries the branch's dominant influence. When revealed (透出), it becomes fully active.`,
      interpretation: 'The dominant hidden force in this position. Like the primary mineral in an ore vein—the richest deposit waiting to be mined.',
      recommendations: [
        'Main qi is the primary hidden resource',
        'Look for luck pillars that reveal (透) this stem',
        'When calculating hidden strength, prioritize main qi'
      ]
    },
    personaHook: '本气藏于地下，是此宫位最强的隐藏力量。如矿脉主脉，等待开采。当大运透出此气，它将显现全部力量。',
    journeyStepHint: 'In the Hidden Roots Crypt, we find the main vein. This is the dominant hidden force—seek timing that reveals it.',
    severity: 'info',
    effect: 'neutral',
    iconHint: '💎'
  },

  'hidden_stem_revealed': {
    explanation: {
      title: 'Hidden Stem Revealed (透出)',
      summary: 'A hidden stem has emerged into the Heavenly Stems. The underground becomes visible; latent power activates.',
      technicalDetail: `Classical: 藏干透出

When the same element appears in:
• A branch's hidden stem AND
• A Heavenly Stem position

The hidden stem is considered "revealed" (透):
• Full activation of hidden element
• Power multiplied significantly
• Hidden influence becomes manifest

Example: 寅 contains 甲 (hidden), and 甲 appears in Year or Hour stem → 甲 is revealed.`,
      interpretation: 'What was underground has surfaced. A hidden influence is now actively shaping your destiny. The latent has become manifest.',
      recommendations: [
        'This hidden element is now fully active',
        'Consider it at full power in calculations',
        'Related life areas activate strongly'
      ]
    },
    personaHook: '藏干透出，暗转为明。地下的力量已经浮上台面，成为可见可用的能量。这是显化，是潜能的实现。',
    journeyStepHint: 'In the Hidden Roots Crypt, revelation occurs. The buried has surfaced—hidden power is now manifest and active.',
    severity: 'moderate',
    effect: 'beneficial',
    iconHint: '🌱'
  },

  'hidden_stem_clashed': {
    explanation: {
      title: 'Hidden Stem Damaged by Clash',
      summary: 'When a branch is clashed, its hidden stems are also damaged. Underground resources become unstable.',
      technicalDetail: `Classical: 藏干受冲

When a branch receives a clash:
• Main qi: reduced to 40%
• Middle qi: reduced to 20%
• Residual qi: reduced to 5%

The clash destabilizes the entire hidden structure.
Useful God in clashed hidden stem: significantly weakened.`,
      interpretation: 'The underground has been shaken. Hidden resources you were counting on have been destabilized. Don\'t assume they\'ll function normally.',
      recommendations: [
        'Hidden elements in clashed branches are unreliable',
        'Seek alternative sources for needed elements',
        'Stability returns when clash is resolved'
      ]
    },
    personaHook: '冲击波及地下，藏干动摇不稳。如同地震摇动矿脉，原本可靠的地下资源现在变得不确定。',
    journeyStepHint: 'In the Hidden Roots Crypt, earthquake trembles. Clash has destabilized hidden resources—seek stability elsewhere.',
    severity: 'moderate',
    effect: 'challenging',
    iconHint: '🌋'
  },

  'hidden_stem_useful_god': {
    explanation: {
      title: 'Useful God Found in Hidden Stems',
      summary: 'Your useful god exists only in hidden stems—latent support waiting for activation.',
      technicalDetail: `Classical: 用神藏于地支

When Useful God appears only as hidden stem:
• Base effectiveness: 40%
• Becomes 100% when revealed by luck pillar
• Position matters: main qi > middle qi > residual qi

Strategy:
• Identify which luck pillars reveal the hidden UG
• Plan major activities for those periods
• Meanwhile, seek secondary surface support`,
      interpretation: 'Your main support is underground, waiting. Like water in an aquifer—present but requires drilling to access. Timing will unlock it.',
      recommendations: [
        'Calculate when luck pillars reveal your useful god',
        'These periods will be significantly better',
        'Build surface support while waiting'
      ]
    },
    personaHook: '你的用神藏于地下深处，如同沙漠下的暗河。它在等待大运的召唤，届时将涌出地面，成为你的助力。',
    journeyStepHint: 'In the Hidden Roots Crypt, your guide waits underground. Useful God sleeps in hidden stems—luck pillars will awaken it.',
    severity: 'moderate',
    effect: 'mixed',
    iconHint: '🔮'
  },

  'hidden_stem_annoying_god': {
    explanation: {
      title: 'Annoying God Hidden Below',
      summary: 'Your annoying god is hidden rather than surface. The negative influence is muted but not absent.',
      technicalDetail: `Classical: 忌神藏而不露

When Annoying God is only in hidden stems:
• Negative effect reduced to 50%
• Becomes worse if revealed by luck pillar
• "Dormant threat" - present but not active

Advantage: hidden annoying god is better than revealed one.
Risk: luck pillar revealing it activates full negative effect.`,
      interpretation: 'Your enemy is underground, sleeping. Better than having it on the surface—but don\'t forget it\'s there. Avoid waking it.',
      recommendations: [
        'Avoid luck pillars that reveal hidden annoying god',
        'The threat is dormant, not eliminated',
        'Don\'t stir up the sleeping dragon'
      ]
    },
    personaHook: '忌神藏于地下，如同沉睡的猛兽。它的危害暂时被压制，但不要试图唤醒它。避开会透出它的时运。',
    journeyStepHint: 'In the Hidden Roots Crypt, a sleeping threat lurks. Annoying God is dormant—avoid luck pillars that wake it.',
    severity: 'minor',
    effect: 'beneficial',
    iconHint: '🐉'
  },

  'hidden_stem_combination_participant': {
    explanation: {
      title: 'Hidden Stem Participates in Combination',
      summary: 'A hidden stem is drawn into a combination with a surface stem. Partial engagement affects both.',
      technicalDetail: `Classical: 藏干与天干相合

When hidden stem combines with Heavenly Stem:
• Hidden stem is "drawn up" partially
• Surface stem is "drawn down" partially
• Both are engaged/occupied
• Combination may or may not transform

Effect: both participants have reduced availability for other functions.`,
      interpretation: 'An underground-surface connection has formed. Both elements are engaged with each other, reducing their availability for other purposes.',
      recommendations: [
        'Both combined elements are partially occupied',
        'Don\'t expect full function from either',
        'The connection itself may be meaningful'
      ]
    },
    personaHook: '天干与藏干相合，地上与地下之气交融。这种上下的牵连，让两者都有了羁绊，不再完全自由。',
    journeyStepHint: 'In the Hidden Roots Crypt, surface meets underground. Stem and hidden stem combine—both are now engaged.',
    severity: 'minor',
    effect: 'neutral',
    iconHint: '🔗'
  },

  'hidden_stem_strength_calculation': {
    explanation: {
      title: 'Hidden Stem Strength Distribution',
      summary: 'How hidden stem strength distributes: main qi 70%, middle qi 20%, residual qi 10%.',
      technicalDetail: `Classical: 藏干力量分配

Standard distribution:
• 本气 (Main Qi): 70% of position's hidden power
• 中气 (Middle Qi): 20% of position's hidden power
• 余气 (Residual Qi): 10% of position's hidden power

Example: 寅 branch (contains 甲甲甲)
• 甲 (Wood): 70% as main qi
• 丙 (Fire): 20% as middle qi
• 戊 (Earth): 10% as residual qi

Use these proportions when calculating element totals.`,
      interpretation: 'Hidden strength follows a 70-20-10 distribution. The main qi dominates; middle and residual are secondary but not negligible.',
      recommendations: [
        'Weight main qi heavily in calculations',
        'Don\'t ignore middle and residual qi',
        'Total hidden strength affects overall balance'
      ]
    },
    personaHook: '藏干力量按本气、中气、余气分配，七二一之比。主脉最强，支脉辅之，这是地下力量的结构。',
    journeyStepHint: 'In the Hidden Roots Crypt, we learn the distribution. Main qi dominates at 70%, with 20% middle and 10% residual.',
    severity: 'info',
    effect: 'neutral',
    iconHint: '📊'
  },

  'hidden_stem_seasonal_modification': {
    explanation: {
      title: 'Seasonal Modification of Hidden Stems',
      summary: 'Hidden stems are also affected by seasonal strength. A hidden Fire in winter is weaker than hidden Fire in summer.',
      technicalDetail: `Classical: 藏干受季节影响

Hidden stems receive the same seasonal modifiers as surface elements:
• Hidden Fire in winter: 30% effectiveness
• Hidden Water in summer: 40% effectiveness
• Hidden element in its peak season: 150% effectiveness

Calculate: Base hidden strength × Seasonal modifier = Effective hidden strength`,
      interpretation: 'Underground elements also feel the seasons. A hidden Fire in winter is doubly suppressed—hidden AND out of season.',
      recommendations: [
        'Apply seasonal modifiers to hidden elements',
        'Doubly weak: hidden + out of season',
        'Doubly strong: revealed + in season'
      ]
    },
    personaHook: '藏干虽在地下，也感四季之气。冬日的暗火更弱，夏日的暗火更强。地下与地上，同呼吸，共命运。',
    journeyStepHint: 'In the Hidden Roots Crypt, seasons reach below. Hidden elements feel seasonal modifiers—calculate accordingly.',
    severity: 'info',
    effect: 'neutral',
    iconHint: '🌡️'
  },

  'hidden_stem_grave_storage': {
    explanation: {
      title: 'Hidden Stems in Grave Branches',
      summary: 'The four grave branches (辰未戌丑) contain stored elements that can be "opened" or "closed" by timing.',
      technicalDetail: `Classical: 墓库开合

The four graves store elements:
• 辰 (Dragon): Water grave
• 未 (Goat): Wood grave
• 戌 (Dog): Fire grave
• 丑 (Ox): Metal grave

Opening conditions:
• Clash from opposite branch → opens grave
• Punishment involving grave → partially opens
• Combination → may seal grave

Opened grave releases stored element at full power.`,
      interpretation: 'These branches are storage vaults. The right key (clash, punishment) opens them to release stored power. The wrong key (combination) may seal them further.',
      recommendations: [
        'Know what element is stored in each grave',
        'Clash opens graves (can be good or bad)',
        'Timing determines when storage becomes accessible'
      ]
    },
    personaHook: '辰未戌丑四墓，藏着各自的宝藏与秘密。冲开则释放，合则封印。知道开合之机，便能调动这地下宝库。',
    journeyStepHint: 'In the Hidden Roots Crypt, we find the four vaults. Grave branches store elements—clash opens, combination seals.',
    severity: 'moderate',
    effect: 'mixed',
    iconHint: '🗝️'
  },

  // ══════════════════════════════════════════════════════════════════
  //                    LUCK PILLAR RULES (大运)
  // ══════════════════════════════════════════════════════════════════

  'luck_pillar_transforms_structure': {
    explanation: {
      title: 'Luck Pillar Transforms Chart Structure',
      summary: 'This luck pillar fundamentally changes your chart structure. Old rules give way to new.',
      technicalDetail: `Classical: 大运改格

Structure-transforming luck pillars:
• Complete a Follow structure that was partial
• Break a Follow structure that was complete
• Form new combinations that change element balance
• Introduce clash that invalidates special structure

During such pillars:
• Recalculate useful god
• Reassess life direction
• Major life changes often correspond`,
      interpretation: 'Your chart\'s fundamental structure is shifting during this period. Like tectonic plates moving—the landscape will look different after.',
      recommendations: [
        'Expect significant life direction changes',
        'Old strategies may stop working',
        'Be open to identity/career shifts'
      ],
      warnings: [
        'This is a major transition period',
        'What worked before may not work now'
      ]
    },
    personaHook: '大运如同地壳运动，正在改变你命盘的根本结构。旧格局瓦解，新格局诞生。这是命运的转折点。',
    journeyStepHint: 'In the Luck Pillar Corridor, transformation rumbles. This pillar reshapes your chart structure—prepare for fundamental change.',
    severity: 'major',
    effect: 'mixed',
    iconHint: '🌋'
  },

  'luck_pillar_reveals_useful_god': {
    explanation: {
      title: 'Luck Pillar Reveals Hidden Useful God',
      summary: 'This luck pillar brings your hidden useful god to the surface. A golden period begins.',
      technicalDetail: `Classical: 大运透用神

When luck pillar\'s stem matches hidden useful god:
• Hidden UG becomes revealed (透出)
• Effectiveness jumps from 40% to 100%
• Related life areas flourish
• Often marks peak career/success periods

Duration: full 10-year luck pillar, strongest in first 5 years.`,
      interpretation: 'Your buried treasure is being unearthed. The support system you\'ve been waiting for is now active. This is a time of opportunity.',
      recommendations: [
        'Maximize activity during this pillar',
        'Your useful god is at full power',
        'Make major moves while support is strong'
      ]
    },
    personaHook: '大运透出了藏于地下的用神，如旱地挖到甘泉。你等待已久的助力终于到来，这是行动和收获的时期。',
    journeyStepHint: 'In the Luck Pillar Corridor, treasure surfaces. Your hidden useful god emerges—seize this golden period.',
    severity: 'significant',
    effect: 'beneficial',
    iconHint: '⭐'
  },

  'luck_pillar_activates_annoying_god': {
    explanation: {
      title: 'Luck Pillar Activates Hidden Annoying God',
      summary: 'This luck pillar reveals a dormant threat. A challenging period requires extra caution.',
      technicalDetail: `Classical: 大运透忌神

When luck pillar\'s stem matches hidden annoying god:
• Dormant threat becomes active
• Negative effect at full power
• Related life areas face challenges
• Often corresponds to setbacks, obstacles

Strategy:
• Strengthen useful god during this period
• Avoid major risks in affected areas
• Focus on defense rather than expansion`,
      interpretation: 'A sleeping dragon has been awakened. Challenges you thought you\'d avoided are now active. This is a time for caution and defense.',
      recommendations: [
        'Minimize risk during this pillar',
        'Strengthen defensive elements',
        'This too shall pass—focus on survival'
      ],
      warnings: [
        'Major initiatives may face unexpected obstacles',
        'Health and relationships need extra attention'
      ]
    },
    personaHook: '大运唤醒了沉睡的忌神，如同打开了潘多拉的盒子。这是需要谨慎和防守的时期，不宜冒进。',
    journeyStepHint: 'In the Luck Pillar Corridor, a threat awakens. Hidden annoying god activates—focus on defense.',
    severity: 'significant',
    effect: 'challenging',
    iconHint: '⚠️'
  },

  'luck_pillar_completes_combination': {
    explanation: {
      title: 'Luck Pillar Completes Combination',
      summary: 'This luck pillar provides the missing piece for a combination. New energies merge and transform.',
      technicalDetail: `Classical: 大运凑合

When luck pillar completes a partial combination:
• Two-branch combinations become three (三合)
• Transformation now possible
• Element balance shifts significantly
• New opportunities in transformed element areas

Example: Chart has 寅午, luck pillar brings 戌 → 寅午戌 Fire 三合 completes.`,
      interpretation: 'The missing piece arrives. What was incomplete becomes whole. A new unified energy emerges that wasn\'t available before.',
      recommendations: [
        'Leverage the newly completed combination',
        'The transformed element is now strong',
        'Related life areas open up'
      ]
    },
    personaHook: '大运带来了合局的最后一块拼图。三合成局，新的能量诞生。这是整合与突破的时期。',
    journeyStepHint: 'In the Luck Pillar Corridor, completion arrives. Missing piece joins the combination—new unified energy emerges.',
    severity: 'moderate',
    effect: 'beneficial',
    iconHint: '🧩'
  },

  'luck_pillar_breaks_combination': {
    explanation: {
      title: 'Luck Pillar Breaks Existing Combination',
      summary: 'This luck pillar clashes with a combination member, breaking what was unified.',
      technicalDetail: `Classical: 大运冲散合局

When luck pillar clashes combination participant:
• Combination is disrupted
• Unified energy separates back to components
• Benefits of combination are lost
• Related life areas destabilize

Example: 寅午戌 Fire combination, luck pillar 申 clashes 寅 → combination breaks.`,
      interpretation: 'What was together is being pulled apart. A reliable combination in your chart is being disrupted. Expect changes in affected life areas.',
      recommendations: [
        'Don\'t rely on the combination during this pillar',
        'Build alternative support systems',
        'Stability returns after this pillar passes'
      ]
    },
    personaHook: '大运冲散了原本稳固的合局，如同风暴打散船队。原来整合的力量现在分崩离析，需要重新寻找平衡。',
    journeyStepHint: 'In the Luck Pillar Corridor, unity shatters. Clash breaks your combination—adapt to separated energies.',
    severity: 'moderate',
    effect: 'challenging',
    iconHint: '💔'
  },

  'luck_pillar_punishment_activation': {
    explanation: {
      title: 'Luck Pillar Activates Punishment',
      summary: 'This luck pillar completes a punishment pattern. A period of lessons and challenges.',
      technicalDetail: `Classical: 大运凑刑

When luck pillar completes punishment:
• 寅巳申 (Unkindness): trust/betrayal themes
• 丑戌未 (Bullying): power struggle themes
• Self-punishment intensified

Activation brings:
• Karmic lessons surface
• Related challenges manifest
• Growth through difficulty

Duration: most intense when luck branch directly participates.`,
      interpretation: 'A karmic pattern is being activated. This period brings lessons—often through challenges. The difficulty is purposeful, leading to growth.',
      recommendations: [
        'Expect challenges related to punishment theme',
        'Focus on learning rather than resisting',
        'Strengthen supportive elements'
      ],
      warnings: [
        'Legal/contractual issues possible with Unkindness',
        'Power struggles possible with Bullying punishment'
      ]
    },
    personaHook: '大运补齐了刑局，业力功课浮出水面。这是考验的时期，也是成长的契机。以智慧面对，以慈悲化解。',
    journeyStepHint: 'In the Luck Pillar Corridor, punishment completes. Karmic lessons activate—growth through difficulty.',
    severity: 'significant',
    effect: 'challenging',
    iconHint: '⚖️'
  },

  'luck_pillar_seasonal_alignment': {
    explanation: {
      title: 'Luck Pillar Aligns with Useful God Season',
      summary: 'This luck pillar\'s seasonal energy supports your useful god. A period of natural flow.',
      technicalDetail: `Classical: 大运助用神得令

When luck pillar\'s season supports useful god:
• Useful god operates at enhanced effectiveness
• Natural flow in related life areas
• Reduced need for compensating efforts
• Things "just work"

Example: Fire useful god + Summer luck pillar = enhanced support.`,
      interpretation: 'The seasonal winds are at your back. Your useful god gets natural support from the period\'s energy. Things flow more easily.',
      recommendations: [
        'Leverage the natural support',
        'Good time for useful-god-related activities',
        'Don\'t waste this favorable period'
      ]
    },
    personaHook: '大运的季节正好生助你的用神，如同顺风航行。这是天时相助的时期，事半功倍。',
    journeyStepHint: 'In the Luck Pillar Corridor, seasonal winds favor you. Useful god receives natural support—sail with the wind.',
    severity: 'moderate',
    effect: 'beneficial',
    iconHint: '🌊'
  },

  'luck_pillar_element_balance_shift': {
    explanation: {
      title: 'Luck Pillar Shifts Element Balance',
      summary: 'This luck pillar significantly changes your overall element distribution. Recalibration needed.',
      technicalDetail: `Classical: 大运改变五行平衡

When luck pillar adds strong element presence:
• Overall balance shifts
• Previously weak elements may become adequate
• Previously adequate elements may become excessive
• Useful god effectiveness changes

Recalculate element percentages with luck pillar included.`,
      interpretation: 'Your element recipe is being adjusted. What was lacking may now be sufficient; what was balanced may now be excessive. Adapt accordingly.',
      recommendations: [
        'Reassess element needs for this period',
        'Adjust compensating strategies',
        'Balance may need different calibration'
      ]
    },
    personaHook: '大运带来新的五行能量，整体平衡正在改变。如同调整配方，原来的比例不再适用。需要重新校准。',
    journeyStepHint: 'In the Luck Pillar Corridor, balance shifts. New elemental energy changes proportions—recalibrate.',
    severity: 'moderate',
    effect: 'mixed',
    iconHint: '⚗️'
  },

  'luck_pillar_stem_branch_conflict': {
    explanation: {
      title: 'Luck Pillar Internal Stem-Branch Conflict',
      summary: 'This luck pillar has internal conflict between its stem and branch. Mixed signals reduce overall benefit.',
      technicalDetail: `Classical: 大运天地相战

When luck pillar\'s stem and branch conflict:
• Stem may be helpful, branch harmful (or vice versa)
• Net effect is reduced
• First 5 years favor stem energy
• Second 5 years favor branch energy

Example: 壬寅 pillar - 壬 Water stem conflicts with 寅 Wood branch nature.`,
      interpretation: 'This luck pillar sends mixed signals. Part of it helps, part challenges. The period is neither fully good nor fully bad—complexity prevails.',
      recommendations: [
        'Expect mixed results during this pillar',
        'First half emphasizes stem, second half branch',
        'Navigate the complexity rather than expecting clarity'
      ]
    },
    personaHook: '这步大运天干与地支互相矛盾，如同左手打右手。前五年看天干，后五年看地支，整体效果复杂。',
    journeyStepHint: 'In the Luck Pillar Corridor, conflict within. Stem and branch oppose—first half and second half differ.',
    severity: 'moderate',
    effect: 'mixed',
    iconHint: '☯️'
  }
};

// Export helper to get any page
export function getCodexPage(ruleId: string): Partial<CodexEntry> | null {
  return COMPLETE_CODEX_LIBRARY[ruleId] || null;
}

// Export list of all available rule IDs
export const AVAILABLE_CODEX_PAGES = Object.keys(COMPLETE_CODEX_LIBRARY);
