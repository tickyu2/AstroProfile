/**
 * ============================================
 * SAMPLE CODEX PAGES
 * Pre-written detailed content for key classical
 * BaZi rules - real Codex pages, not scaffolding
 * ============================================
 */

import { CodexEntry } from './codexTypes';

/**
 * Pre-defined detailed Codex entries for key rules
 * These can be used when specific rules match, providing
 * rich, authoritative content
 */
export const DETAILED_CODEX_PAGES: Record<string, Partial<CodexEntry>> = {

  // ==================== STRUCTURE RULES ====================

  'fake_follow_wealth': {
    explanation: {
      title: 'Fake Follow Wealth Structure (假从财格)',
      summary: 'Your chart appears to follow wealth, but hidden roots or seasonal support prevent true surrender. This is not a genuine Follow structure.',
      technicalDetail: `Classical Rule: A true Follow Wealth (从财格) requires the Day Master to be utterly rootless - no support from season, no hidden stems producing it, no companion stars in sight. Your chart has the appearance of extreme weakness with overwhelming wealth, but careful examination reveals a lifeline: perhaps a single hidden root in the hour pillar, or the month branch secretly producing your Day Master element. This disqualifies the Follow structure.

Diagnostic Criteria:
• Day Master appears extremely weak (极弱)
• Wealth element dominates (财星独旺)
• BUT: Hidden stems contain resource or peer (印比藏于支中)
• OR: Season provides subtle support (得令之气)

Joey Yap Authority Note: "Many practitioners mistake weak-with-wealth charts for Follow Wealth. The difference is life-changing: Follow Wealth thrives on more wealth; Fake Follow needs support."`,
      interpretation: `You may feel pulled toward money, status, and material success - the wealth energy in your chart is undeniably powerful. But unlike true Follow Wealth individuals who prosper by fully surrendering to the wealth pursuit, you have a hidden core that resists complete absorption into materialism.

This manifests as:
• Ambivalence about pure profit-seeking
• Guilt or discomfort despite financial success
• A nagging sense that money alone doesn't fulfill you
• Periodic burnout from chasing wealth without inner support

The good news: you have options. True Follow types have no choice but their path. You can choose to nurture your hidden root and build genuine strength, rather than being swept away by external wealth currents.`,
      recommendations: [
        'Strengthen your Day Master element through colors, directions, and timing',
        'Don\'t mistake your weakness for surrender - build inner resources',
        'Balance wealth pursuit with self-cultivation activities',
        'Seek luck pillars that support your Day Master, not just bring more wealth',
        'Be cautious of advice meant for true Follow Wealth charts'
      ],
      warnings: [
        'Following generic Follow Wealth advice could harm you',
        'Major wealth opportunities may deplete rather than empower you',
        'Watch for exhaustion cycles when wealth-chasing intensifies'
      ]
    },
    personaHook: '我见财星如潮水般涌来，却知你并非随波逐流之人。你不是为财而生，而是被财所逼。我在此为你护住一线真气，使你不至于迷失于外物之中。',
    journeyStepHint: `In the Structure Chamber, we confront a crucial misdiagnosis that many charts suffer: the Fake Follow Wealth pattern.

You stand before a grand illusion - a chart that LOOKS like it should follow wealth, where money and resources seem to be your destiny. Many practitioners would tell you to chase more wealth, to surrender to the material flow.

But I see what they miss: the hidden root, the secret support, the stubborn ember of self that refuses to be extinguished. You are not a boat without anchor, meant to drift wherever wealth currents take you. You are a boat with a concealed anchor - and cutting that anchor would capsize you, not free you.

Here you learn the most important lesson of structure analysis: appearances deceive. The "weak" chart that needs support is utterly different from the "empty" chart that must follow. Your path is not surrender but strategic strengthening.`,
    severity: 'significant',
    effect: 'challenging',
    iconHint: '💰'
  },

  'true_follow_wealth': {
    explanation: {
      title: 'True Follow Wealth Structure (真从财格)',
      summary: 'Your Day Master has completely surrendered to wealth energy. With no roots anywhere, your destiny is to flow with financial currents, not fight them.',
      technicalDetail: `Classical Rule: True Follow Wealth (真从财格) occurs when:
• Day Master is utterly rootless - 日主无根
• No hidden stems support Day Master - 无印比藏干
• Season does not produce Day Master - 不得令
• Wealth element completely dominates - 财星独旺成势
• No rebellious elements appear (resource/peers) - 无印比出干

This is one of the special structures (格局) where normal rules reverse. Instead of strengthening a weak Day Master, we strengthen what dominates - wealth.

Verification Checklist:
□ Day Master has zero roots in all four branches
□ Hidden stems contain no resource/peer elements
□ Birth season hostile or neutral to Day Master
□ Wealth forms an unbroken chain of support
□ No Heavenly Stem shows resource or peer

If ALL boxes check, this is True Follow. If ANY box fails, revert to normal weak chart analysis.`,
      interpretation: `You have been given a rare chart type - one where surrender is strength, and fighting your nature leads to failure.

Your path to success is paradoxically through "giving up" - not giving up on life, but giving up the ego's insistence on independence. You thrive when you:
• Fully commit to wealth-building activities
• Surround yourself with resource-rich people and environments
• Let financial currents guide your decisions
• Stop trying to "be your own person" in career matters
• Accept that your prosperity comes through others

The danger comes from advice meant for normal charts: "strengthen yourself," "find your own path," "don't let money rule you." For you, money SHOULD rule - that's your design.`,
      recommendations: [
        'Embrace wealth-generating activities without guilt',
        'Partner with strong financial energies (bosses, investors, wealthy networks)',
        'Choose careers in finance, sales, trade, or resource management',
        'Avoid luck pillars that bring resource or peer energy - they disrupt your flow',
        'Make peace with depending on external support for success'
      ],
      warnings: [
        'Resource/peer luck pillars can be catastrophic for Follow charts',
        'Independence and self-sufficiency are traps for your structure',
        'Normal "balance" advice will destabilize you'
      ]
    },
    personaHook: '财星如海，你已选择随波而行。这不是懦弱，而是智慧——当日主无根，随财便是天命。你无需逆流而上，只需学会在财富的潮汐中自如游弋。但记住：一旦有印比之气回归，你的格局便会动摇。愿你在富足中找到安宁。',
    journeyStepHint: `In the Structure Chamber, we recognize one of the rarest and most misunderstood patterns: True Follow Wealth.

Your Day Master stands alone, without a single root to call its own, surrounded by an ocean of wealth energy. In normal analysis, this would be cause for alarm - extreme weakness requiring rescue. But you are not normal.

You are the surfer who becomes one with the wave. You are the sailor who lets wind, not muscle, move the ship. You are the investor who follows the market rather than fighting it.

Here you learn the profound reversal of Follow structures: your strength IS your surrender. Every impulse to "stand on your own" works against your design. Every attempt to "build inner strength" fights your fate.

This is not defeat - it is alignment. The leaf that floats reaches the sea; the leaf that fights the current exhausts itself upstream.`,
    severity: 'major',
    effect: 'mixed',
    iconHint: '🌊'
  },

  // ==================== CLASH RULES ====================

  'clash_becomes_useful': {
    explanation: {
      title: 'Beneficial Clash - Removing the Annoying God',
      summary: 'This clash actually helps you by attacking an element that was harming your chart. Sometimes conflict is medicine.',
      technicalDetail: `Classical Principle: 冲去忌神为喜 - "Clashing away the Annoying God brings happiness."

When a branch clash targets the element serving as your Annoying God (忌神), the clash transforms from threat to therapy. The collision energy that would normally destabilize becomes a clearing force.

Analysis Protocol:
1. Identify the Annoying God element
2. Locate the Annoying God's position in the chart
3. Determine if the clash directly hits that position
4. If yes, the clash is beneficial; if no, evaluate collateral damage

Example: Wood Day Master with strong Metal (7-Killing) as Annoying God. If 申 (Metal) in the month is clashed by 寅 (Wood) in the year, the clash weakens the threatening Metal - a relief rather than a disruption.

Joey Yap: "Not all clashes are bad. The sophisticated practitioner asks: WHAT is being clashed? If it's the enemy, clash away!"`,
      interpretation: `You have conflict in your chart - but it's the right kind of conflict. The clash targets something that was already working against you, like a fever that burns off infection.

In life, this may manifest as:
• Arguments that clear the air and improve relationships
• Losses that free you from burdens
• Disruptions that break you out of harmful patterns
• Opponents who inadvertently help your cause
• "Bad luck" that redirects you to better paths

Don't fear this clash. Don't try to "harmonize" it away. This particular tension is doing work you need done.`,
      recommendations: [
        'Don\'t suppress this conflict - let it do its work',
        'Recognize "enemies" who may actually be helpers',
        'Look for opportunities hidden in disruptions',
        'Trust that this particular instability serves you'
      ]
    },
    personaHook: '你命中有冲，但这冲并非灾祸，而是良药。冲去忌神，如同切除肿瘤——看似创伤，实则疗愈。不要试图化解这股冲突，它正在为你清除障碍。',
    journeyStepHint: `In the Clash & Conflict Court, we discover a surprising ally: a clash that heals rather than harms.

Most seekers fear all conflict in their charts, trying to harmonize every opposition. But here we learn the classical wisdom: 冲去忌神为喜 - when clash removes what harms you, the clash itself becomes auspicious.

Your chart has targeted something that was already your enemy. The universe has provided you with a sword precisely where you needed to cut. This collision is not chaos - it is surgery performed by fate.`,
    severity: 'moderate',
    effect: 'beneficial',
    iconHint: '⚔️'
  },

  // ==================== USEFUL GOD RULES ====================

  'useful_god_combined_away': {
    explanation: {
      title: 'Useful God Lost to Combination',
      summary: 'Your useful god has been captured by a combination and transformed into something else. The guiding element you need has changed identity.',
      technicalDetail: `Classical Principle: 用神被合化 - "Useful God combined and transformed."

When the element serving as Useful God participates in a combination that successfully transforms, it loses its original identity and can no longer perform its balancing function.

Example: Weak Wood Day Master with Water as Useful God. If 壬 (Yang Water) in the month combines with 丁 (Yin Fire) in the day, and conditions allow transformation to Wood, the Water disappears - transformed into the very element it was supposed to produce. The Useful God is gone.

Severity Assessment:
• Full transformation: Useful God completely lost (severity: high)
• Partial transformation: Useful God weakened but present (severity: moderate)
• Combination without transformation: Useful God "busy" but functional (severity: low)

When primary Useful God is lost, seek the secondary Useful God (第二用神) - typically the element that produces your primary useful god, or the element that weakens your annoying god.`,
      interpretation: `The element that should balance your chart has been swept into a cosmic merger, emerging as something different. Imagine your guide on a journey suddenly transforming into a fellow traveler who no longer knows the way.

You may experience this as:
• Feeling unsupported despite having supportive elements on paper
• Resources or helpers that become unavailable or change nature
• A sense that what should help you... doesn't
• Needing to find alternative sources of balance

This doesn't mean you're without hope - it means you need to look elsewhere. Your backup useful god becomes your primary. The element that PRODUCES your lost useful god becomes important.`,
      recommendations: [
        'Identify and cultivate your secondary useful god',
        'Don\'t rely on the combined element for support',
        'Look to the element that produces your original useful god',
        'Watch for luck pillars that might break the combination',
        'Strengthen alternative balancing elements'
      ],
      warnings: [
        'Don\'t expect normal useful god benefits from the combined element',
        'The combination may break in certain luck pillars - be prepared'
      ]
    },
    personaHook: '你的用神被合化去了，如同向导突然变身为陌生人。原本该帮助你的力量，已在天干之合中转化为别的模样。但别绝望——让我指引你找到第二用神，开辟另一条平衡之道。',
    journeyStepHint: `In the Useful God Sanctuary, we confront a profound loss: your primary balancing element has been claimed by a combination.

The Heavenly Stems have danced, and in their union, your guide has transformed. The Water that was meant to nourish your Wood now swirls in a cosmic merger, emerging as something new. The helpful element wears a different face.

This is not the end - it is a redirection. Here you learn to find the secondary path, the backup guide, the alternative source of balance. Every chart has multiple possible support systems; when one is captured, another must rise.`,
    severity: 'significant',
    effect: 'challenging',
    iconHint: '🔄'
  },

  // ==================== SEASONAL RULES ====================

  'fire_in_winter_weak': {
    explanation: {
      title: 'Fire Extremely Weak in Winter',
      summary: 'Fire element operates at only 30% effectiveness during winter. This fundamental seasonal weakness affects all Fire-related activities and attributes.',
      technicalDetail: `Classical Principle: 火生于寅，旺于午，死于亥，墓于戌，绝于子
"Fire is born in Yin (Tiger), prospers in Wu (Horse), dies in Hai (Pig), is buried in Xu (Dog), and is extinguished in Zi (Rat)."

Winter (亥子丑月) is Fire's weakest season:
• 亥月 (Pig): Fire in "death" phase - 死地
• 子月 (Rat): Fire in "extinction" phase - 绝地
• 丑月 (Ox): Fire in "embryo" phase - 胎地

Strength Calculation:
• Base Fire strength × 0.3 = Winter effective strength
• Without Wood support: × 0.2
• With strong Water opposition: × 0.15

Compensating Factors:
• Wood presence (produces Fire): +50% to modifier
• Earth presence (drains attacking Water): +20% to modifier
• Hidden Fire in branches: +10-30% depending on position

Joey Yap: "A Fire Day Master in winter is like a candle in a rainstorm. Without Wood to shield and fuel it, the flame gutters and dies."`,
      interpretation: `If Fire represents something crucial in your chart - your Day Master, your Useful God, or a key element - understand that winter fundamentally suppresses it.

Practical Manifestations:
• Fire Day Master in winter: natural energy lowest, prone to cold/dampness, needs warming support
• Fire as Useful God in winter: balancing element struggles to help, seek Wood intermediary
• Fire careers/activities: harder to succeed in winter months, plan accordingly

This is not a curse but a cycle. Fire weakens in winter as surely as the sun sets each evening. Wisdom lies in compensating rather than fighting:
• Use Wood (industries, colors, directions) to feed Fire
• Avoid excess Water activities in winter
• Time major Fire-related initiatives for warmer seasons when possible
• Accept reduced energy and plan for it`,
      recommendations: [
        'Strengthen Wood element to feed and protect Fire',
        'Use warm colors (red, orange, purple) in winter',
        'Face South when possible for Fire direction support',
        'Avoid water-heavy environments and activities in winter',
        'Schedule important Fire-related events outside winter',
        'Take extra care of health during Water-dominant periods'
      ]
    },
    personaHook: '火在冬日里如残烛摇曳，仅存三成之力。冬季的寒水如此强盛，火焰需要木柴来庇护。这不是命运的诅咒，而是自然的节律——明白了这一点，你便知道何时需要额外的温暖与支持。',
    journeyStepHint: `In the Elemental Winds Gallery, we feel winter's chill upon Fire.

Stand here and sense the seasonal truth: Fire does not burn equally in all months. In winter, when Water rules and cold pervades, Fire shrinks to 30% of its potential. This is not injustice - it is nature's rhythm.

If Fire is important to your chart - as Day Master, Useful God, or key element - winter asks more of you. The warmth others take for granted, you must actively cultivate. The energy others have naturally, you must consciously generate.

But there is wisdom in weakness: the candle that knows the wind prepares its shelter. Here you learn not to fight the season but to compensate for it - through Wood allies that shield and fuel you, through strategic timing, through humble acceptance that some seasons ask us to rest rather than blaze.`
  },

  // ==================== LUCK PILLAR RULES ====================

  'luck_pillar_reverses_structure': {
    explanation: {
      title: 'Luck Pillar Breaks Follow Structure',
      summary: 'The current luck pillar brings elements that contradict your special structure, potentially breaking the pattern that has defined your success formula.',
      technicalDetail: `Classical Principle: 大运破格 - "Luck Pillar breaks the structure."

For special structures (Follow, Established Rank, Blade, etc.), certain luck pillars are catastrophic because they introduce elements that violate the structure's requirements.

Follow Structure Vulnerabilities:
• True Follow charts break when luck pillar brings Resource (印) or Peer (比劫)
• The rootless Day Master suddenly gains support
• The "surrender" strategy that worked now fails
• Must completely recalculate useful god and strategy

Indicators of Structure Breaking:
• Previously successful approaches stop working
• Identity crisis or major life direction changes
• What helped before now seems to harm
• Feeling "like a different person" than previous decade

Emergency Protocol:
1. Recognize structure is breaking (don't cling to old patterns)
2. Recalculate chart as normal weak/strong DM
3. Identify new useful god for the period
4. Adjust life strategy accordingly
5. Prepare for structure to potentially reform when luck changes`,
      interpretation: `Your chart had a special pattern - a particular structure that defined how you succeed. But this luck pillar brings elements that contradict that structure, causing it to crumble.

This is disorienting. What worked before stops working. The advice that helped now harms. You may feel like a completely different person than you were a decade ago - because in chart terms, you ARE different. The rules have changed.

This is neither good nor bad in absolute terms - it's a transition. The Follow chart that needed to surrender now needs to build strength. The Blade chart that needed control now might need release. The entire strategy shifts.

The danger is clinging to outdated self-understanding. The person who "goes with the flow" may now need to "stand their ground." The key is recognizing the shift and adapting, not insisting the old pattern still applies.`,
      recommendations: [
        'Accept that your success formula has changed',
        'Seek fresh chart analysis for this luck pillar period',
        'Don\'t apply old structure-based advice',
        'Prepare for identity shifts and direction changes',
        'Be patient - this is a transition, not permanent chaos',
        'Watch for the structure potentially reforming in future luck pillars'
      ],
      warnings: [
        'Old strategies may actively harm you now',
        'Don\'t trust decade-old readings during structure breaks',
        'This is a particularly unstable period requiring careful navigation'
      ]
    },
    personaHook: '你的格局在这步大运中动摇了。原本成就你的特殊结构，遇到了与之相悖的气场。这不是世界末日，而是规则改变了。过去的成功法则已不适用——让我帮你认清新的形势，找到新的平衡之道。',
    journeyStepHint: `In the DaYun Corridor, we face one of the most challenging transitions: the breaking of your structure.

Your chart held a special pattern - a structure that defined your path to success, that determined which elements helped and which harmed. But now, walking into this decade, you encounter forces that contradict that structure.

The Follow chart meets elements of independence. The Blade chart loses its controller. The pattern that shaped your identity... shifts.

This is the cosmic equivalent of changing the rules mid-game. Everything you learned about yourself, every strategy that worked, every piece of advice you internalized - all must be re-examined.

Here in the DaYun Corridor you learn the humility of impermanence. Charts are not static destinies but dynamic interactions with time. Who you were in the previous decade may not be who this decade requires. Adaptation, not attachment, is the wisdom of transition.`,
    severity: 'major',
    effect: 'challenging',
    iconHint: '⚡'
  },

  // ==================== STRENGTH EXCEPTION RULES ====================

  'weak_but_not_weak': {
    explanation: {
      title: 'Weak-But-Not-Weak (弱而不弱)',
      summary: 'The Day Master appears weak by raw count, but season and root support reveal hidden strength. This is a misleading weakness.',
      technicalDetail: `Classical Principle: 得令得根，不可作弱论
"If the Day Master has season and root, it cannot be judged as weak."

This rule fires when:
• Day Master strength raw = "weak"
• Season supports Day Master (得令)
• Strong root exists in branches (得根)

The appearance of weakness is deceptive. Season provides timing support (令), and root provides foundation support (根). Together, they reveal that what seems frail has hidden vitality.

Diagnostic Criteria:
• Day Master appears numerically weak
• BUT: Birth month supports Day Master element
• AND: At least one strong root in branches
• Result: Override to "balanced" strength

Joey Yap: "Never judge strength by counting alone. A single tree in spring with deep roots can outlast a forest of shallow-rooted giants."`,
      interpretation: `You are like a young tree in spring—thin, but full of life force. What appears as weakness is actually untapped potential.

This manifests as:
• Underestimating yourself
• Appearing fragile but being resilient
• Recovering quickly from setbacks
• Having hidden reserves of willpower
• Performing better under pressure than expected

Others may misjudge you based on appearances. You yourself may doubt your capacity. But when tested, you discover strength you didn't know you had. The thin branch bends but doesn't break; the quiet stream carves through rock.`,
      recommendations: [
        'Trust your resilience—it\'s real, not imagined',
        'Avoid self-limiting beliefs based on surface appearances',
        'Choose environments that activate your hidden strength',
        'Don\'t let others define your capacity',
        'Build long-term projects—you have more stamina than you think'
      ],
      warnings: [
        'Don\'t mistake genuine weakness for this pattern—verify season and root support',
        'Overconfidence is also a trap—your strength is real but not unlimited'
      ]
    },
    personaHook: '你以为自己羸弱，我却看见你根深于土，得春风之令。你不是将折之枝，而是未觉醒之木。我在此唤醒你沉睡的力量。',
    journeyStepHint: `In the Day Master Court, the pilgrim discovers their hidden root.

You came here believing yourself weak—and by the numbers, you appear so. But I see what the surface conceals: the season that nurtures you, the root that anchors you.

This step teaches you to recognize your true capacity, not the illusion of frailty. The young bamboo looks thin, yet it sways through typhoons while oaks fall. Your apparent weakness is a disguise worn by latent strength.

Here you learn that capacity is not always visible. Sometimes the mightiest force sleeps beneath the quietest exterior. You are not broken—you are coiled.`,
    severity: 'moderate',
    effect: 'beneficial',
    iconHint: '🌱'
  },

  // ==================== CLASH BREAKING STRUCTURE ====================

  'clash_breaks_structure': {
    explanation: {
      title: 'Clash Breaking Structure (冲破格局)',
      summary: 'A strong clash hits a key pillar and breaks an otherwise stable structure. The chart\'s original pattern cannot be relied upon during this period.',
      technicalDetail: `Classical Principle: 冲破格局，原局不守
"When a clash breaks the structure, the original pattern cannot hold."

This rule fires when:
• A stable structure exists (Follow, Blade, Established Rank, etc.)
• A clash targets a pillar essential to that structure
• Clash strength = strong (full clash, not moderated)

The clash doesn't just create turbulence—it fundamentally invalidates the structural interpretation. The rules that applied before the clash no longer apply during it.

Analysis Protocol:
1. Identify the existing structure
2. Determine which pillar(s) are essential to that structure
3. Check if the clash directly hits those essential positions
4. If yes: structure is broken, revert to normal weak/strong analysis
5. Recalculate useful god based on new assessment

Example: Follow Wealth structure depends on Day Master having no support. If a clash brings in resource energy to the Day Master, the "follow" condition is violated—the chart must be reanalyzed.`,
      interpretation: `Your chart had a stable pattern—and now a clash has shattered it. This is not punishment; it is reset.

This manifests as:
• Sudden disruptions to established life patterns
• Loss of stability in previously solid areas
• Forced change when you expected continuity
• A break from old identity or roles
• A period where past strategies stop working

The key insight: what worked before may harm you now. Classical structure interpretations become unreliable. You are not who your chart said you were—at least not during this period.

This can feel like chaos, but it's also liberation. The structure that defined you also confined you. In breaking, it releases new possibilities.`,
      recommendations: [
        'Do not cling to old patterns—they no longer serve you',
        'Expect and embrace rapid change',
        'Use the break to redefine your direction',
        'Avoid rigid commitments during this period',
        'Embrace flexibility as your primary strategy',
        'Seek fresh analysis that accounts for the broken structure'
      ],
      warnings: [
        'Old successful strategies may now actively harm you',
        'Don\'t apply structure-based advice during this period',
        'This is temporary—watch for structure to potentially reform'
      ]
    },
    personaHook: '我以雷霆之力击碎旧局，使你不再被陈规所困。此冲非毁灭，而是开路。你将在碎裂之处，看见新的形势。',
    journeyStepHint: `In the Clash & Punishment Court, the pilgrim learns that destruction is sometimes liberation.

You had a structure—a pattern that defined your path. And now, a clash has broken through it like lightning through a tower. The walls that shaped you have crumbled.

This step teaches you to walk through the broken gate into a new chamber. What feels like loss is actually release. The structure constrained as much as it supported; in its shattering, you are unbound.

Here you learn that stability is not always blessing, and disruption is not always curse. Sometimes the universe must break the mold to reveal what lies beyond it.`,
    severity: 'significant',
    effect: 'mixed',
    iconHint: '💥'
  },

  // ==================== ALTERNATE ID FOR USEFUL GOD COMBINATION ====================

  'useful_god_blocked_by_combination': {
    explanation: {
      title: 'Useful God Blocked by Combination (用神被合化)',
      summary: 'The Useful God combines away and transforms into another element. The primary Useful God becomes invalid, and the secondary Useful God must be used.',
      technicalDetail: `Classical Principle: 用神被合化，次用神主事
"When the Useful God is transformed, the secondary Useful God governs."

This rule fires when:
• Useful God element participates in a combination
• Transformation element ≠ original Useful God element
• Primary Useful God function is broken
• Secondary Useful God exists and must activate

The combination "captures" the useful god, merging it into something else. The element you needed has changed its nature—it can no longer serve its original balancing function.

Severity Assessment:
• Full transformation: Useful God completely lost (severity: high)
• Partial transformation: Useful God weakened but present (severity: moderate)
• Combination without transformation: Useful God "busy" but functional (severity: low)

Recovery Options:
• Identify and strengthen secondary Useful God
• Wait for luck pillar that breaks the combination
• Cultivate the element that produces the lost Useful God`,
      interpretation: `Your support system has shifted. The element that was meant to help you has merged with another force and emerged as something different.

This manifests as:
• A shift in what supports you
• Old strategies and helpers stop working
• A new type of resource or behavior becomes necessary
• A sense of "my usual way doesn't work anymore"

This is a pivot point. The helpful friend has become a stranger. The medicine has become neutral. You must find new sources of balance.

The good news: your chart has backup systems. The secondary Useful God rises to take the primary's place. You are not abandoned—you are redirected.`,
      recommendations: [
        'Identify the new supportive element (secondary Useful God)',
        'Shift strategy to cultivate the new balance point',
        'Avoid relying on old habits tied to the lost Useful God',
        'Embrace the new cycle of support',
        'Reevaluate timing and decisions based on new dynamics'
      ],
      warnings: [
        'Don\'t expect the combined element to help anymore',
        'Old Useful God advice is now potentially misleading'
      ]
    },
    personaHook: '你的用神已被合走，如河水改道。旧法不再护你，我为你点亮新的依靠。循此新光，你将重获顺势之力。',
    journeyStepHint: `In the Useful God Sanctuary, the pilgrim learns that support is not fixed.

Your guide has been transformed. The element that was meant to balance and protect you has danced into a combination, emerging as something new. Where there was water, now there is earth. Where there was shelter, now there is... something else.

This step teaches you to follow the new current when the old one dries up. Every chart has multiple potential support systems—primary, secondary, tertiary. When one path closes, another opens.

Here you learn the flexibility of fate. The universe does not abandon you; it redirects you. The lost Useful God is mourned; the new one is embraced.`,
    severity: 'significant',
    effect: 'challenging',
    iconHint: '🔄'
  }
};

/**
 * Get detailed Codex page if available for a rule ID
 */
export function getDetailedCodexPage(ruleId: string): Partial<CodexEntry> | null {
  return DETAILED_CODEX_PAGES[ruleId] || null;
}

/**
 * Enhance a basic CodexEntry with detailed content if available
 */
export function enhanceWithDetailedContent(entry: CodexEntry): CodexEntry {
  const detailed = getDetailedCodexPage(entry.rule.id);

  if (!detailed) {
    return entry;
  }

  return {
    ...entry,
    explanation: {
      ...entry.explanation,
      ...detailed.explanation
    },
    personaHook: detailed.personaHook || entry.personaHook,
    journeyStepHint: detailed.journeyStepHint || entry.journeyStepHint,
    severity: detailed.severity || entry.severity,
    effect: detailed.effect || entry.effect,
    iconHint: detailed.iconHint || entry.iconHint
  };
}
