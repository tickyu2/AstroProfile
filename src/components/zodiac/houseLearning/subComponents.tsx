// ============================================================================
// HOUSE LEARNING PANEL — Sub-Components
// CollapsibleSection, FiveWGrid, ExampleBox, SignCard, PlanetCard,
// Tab0Content, TabSignsContent, TabZonesContent, TabHouseContent,
// ZonePatternCard, SignZoneDetailCard, ordinal helper
// ============================================================================

import React, { useState } from 'react';
import type { SignZoneData } from './types';
import { SIGN_RULERS, ZODIAC_SIGNS, SIGN_ZONE_DETAILS } from './zodiacContent';
import { HOUSE_DATA, PLANETS_IN_HOUSE_1 } from './houseContent';

// Helper: ordinal numbers
export const ordinal = (n: number): string => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

// Collapsible section component
export const CollapsibleSection: React.FC<{
  title: string;
  icon?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}> = ({ title, icon, defaultOpen = false, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 bg-slate-800 hover:bg-slate-750 flex items-center justify-between text-left transition-colors"
      >
        <span className="flex items-center gap-2 text-lg font-semibold text-cyan-400">
          {icon && <span>{icon}</span>}
          {title}
        </span>
        <span className="text-slate-400 text-xl">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="p-4 bg-slate-900/50 border-t border-slate-700">
          {children}
        </div>
      )}
    </div>
  );
};

// 5W+H+Emotion grid component
export const FiveWGrid: React.FC<{
  who?: string;
  what?: string;
  when?: string;
  where?: string;
  why?: string;
  how?: string;
  emotion?: string;
}> = (props) => (
  <div className="grid grid-cols-2 gap-3 text-sm">
    {props.who && <div><span className="text-purple-400 font-medium">Who:</span> <span className="text-slate-300">{props.who}</span></div>}
    {props.what && <div><span className="text-purple-400 font-medium">What:</span> <span className="text-slate-300">{props.what}</span></div>}
    {props.when && <div><span className="text-purple-400 font-medium">When:</span> <span className="text-slate-300">{props.when}</span></div>}
    {props.where && <div><span className="text-purple-400 font-medium">Where:</span> <span className="text-slate-300">{props.where}</span></div>}
    {props.why && <div><span className="text-purple-400 font-medium">Why:</span> <span className="text-slate-300">{props.why}</span></div>}
    {props.how && <div><span className="text-purple-400 font-medium">How:</span> <span className="text-slate-300">{props.how}</span></div>}
    {props.emotion && <div className="col-span-2"><span className="text-amber-400 font-medium">Emotion:</span> <span className="text-slate-300">{props.emotion}</span></div>}
  </div>
);

// Example box component
export const ExampleBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mt-3">
    <div className="text-amber-400 text-xs uppercase tracking-wider mb-2">Example</div>
    <div className="text-slate-200 text-sm">{children}</div>
  </div>
);

// Tab 0 Content - "What Are Houses?"
export const Tab0Content: React.FC = () => (
  <div className="space-y-6">
    {/* Opening Hook */}
    <CollapsibleSection title="What Are Houses?" icon="🏠" defaultOpen={true}>
      <p className="text-lg text-slate-200 mb-4">
        <strong className="text-cyan-400">Houses are WHERE things happen in your life.</strong>
      </p>
      <p className="text-slate-300 mb-4">
        If the planets are the actors and the signs are their costumes, then houses are the stages
        where the drama unfolds. Each of the 12 houses represents a different area of life experience.
      </p>
      <FiveWGrid
        who="You, in different life contexts"
        what="12 life arenas where planetary energies express"
        when="Determined by your exact birth time"
        where="The 12 sections of the chart wheel"
        why="To understand WHERE energies manifest in your life"
        how="Calculated from your Ascendant (rising sign)"
        emotion="Houses give planets a HOME — a place to belong"
      />
    </CollapsibleSection>

    {/* Key Distinction */}
    <CollapsibleSection title="Planets vs Houses — The Key Distinction" icon="🎭">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/30">
          <h4 className="text-purple-400 font-bold mb-2">Planets = WHAT</h4>
          <p className="text-sm text-slate-300">The energy, the actor, the verb</p>
          <p className="text-sm text-slate-400 mt-2">Mars = action, drive, aggression</p>
        </div>
        <div className="bg-cyan-500/10 p-4 rounded-lg border border-cyan-500/30">
          <h4 className="text-cyan-400 font-bold mb-2">Houses = WHERE</h4>
          <p className="text-sm text-slate-300">The life area, the stage, the setting</p>
          <p className="text-sm text-slate-400 mt-2">10th House = career, public life</p>
        </div>
      </div>
      <ExampleBox>
        <strong>Mars in the 10th House:</strong> Your drive and ambition (Mars) expresses
        through your career and public reputation (10th House). You're likely assertive
        in professional settings and may have a competitive career.
      </ExampleBox>
    </CollapsibleSection>

    {/* How Houses Are Calculated */}
    <CollapsibleSection title="How Houses Are Calculated — The Ascendant" icon="⬆️">
      <p className="text-slate-300 mb-4">
        Your <strong className="text-cyan-400">Ascendant (Rising Sign)</strong> is the zodiac sign
        that was rising on the eastern horizon at your exact moment of birth. This becomes the
        starting point — the cusp of your 1st House.
      </p>
      <div className="bg-slate-800 p-4 rounded-lg mb-4">
        <p className="text-sm text-slate-400 mb-2">The wheel then divides into 12 sections:</p>
        <ul className="text-sm text-slate-300 space-y-1">
          <li>• <span className="text-cyan-400">House 1 cusp</span> = Ascendant (ASC)</li>
          <li>• <span className="text-cyan-400">House 4 cusp</span> = Imum Coeli (IC) — bottom of chart</li>
          <li>• <span className="text-cyan-400">House 7 cusp</span> = Descendant (DSC) — opposite ASC</li>
          <li>• <span className="text-cyan-400">House 10 cusp</span> = Midheaven (MC) — top of chart</li>
        </ul>
      </div>
      <p className="text-amber-400 text-sm">
        This is why accurate birth time is crucial — even a few minutes can shift house placements!
      </p>
    </CollapsibleSection>

    {/* The Four Angles */}
    <CollapsibleSection title="The Four Angles — Power Points" icon="✦">
      <p className="text-slate-300 mb-4">
        The four angles are the most powerful points in any chart. They're like the cardinal
        directions of your personal cosmic compass.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-red-500/10 p-3 rounded border border-red-500/30">
          <div className="text-red-400 font-bold">ASC (1st House)</div>
          <div className="text-xs text-slate-400">EAST — Rising</div>
          <div className="text-sm text-slate-300 mt-1">Self, identity, first impressions</div>
        </div>
        <div className="bg-blue-500/10 p-3 rounded border border-blue-500/30">
          <div className="text-blue-400 font-bold">IC (4th House)</div>
          <div className="text-xs text-slate-400">NADIR — Bottom</div>
          <div className="text-sm text-slate-300 mt-1">Home, roots, private self</div>
        </div>
        <div className="bg-green-500/10 p-3 rounded border border-green-500/30">
          <div className="text-green-400 font-bold">DSC (7th House)</div>
          <div className="text-xs text-slate-400">WEST — Setting</div>
          <div className="text-sm text-slate-300 mt-1">Partnerships, others, projection</div>
        </div>
        <div className="bg-amber-500/10 p-3 rounded border border-amber-500/30">
          <div className="text-amber-400 font-bold">MC (10th House)</div>
          <div className="text-xs text-slate-400">ZENITH — Top</div>
          <div className="text-sm text-slate-300 mt-1">Career, public image, legacy</div>
        </div>
      </div>
    </CollapsibleSection>

    {/* House Flow */}
    <CollapsibleSection title="House Flow — Counterclockwise Journey" icon="🔄">
      <p className="text-slate-300 mb-4">
        Houses flow <strong className="text-cyan-400">counterclockwise</strong> from the Ascendant,
        representing life's journey from self (1st) to transcendence (12th).
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-purple-400 font-bold">Quadrant 1: Personal (H1-3)</div>
          <p className="text-xs text-slate-400">Self-discovery, identity, early environment</p>
        </div>
        <div className="space-y-2">
          <div className="text-cyan-400 font-bold">Quadrant 2: Private (H4-6)</div>
          <p className="text-xs text-slate-400">Home, creativity, service</p>
        </div>
        <div className="space-y-2">
          <div className="text-green-400 font-bold">Quadrant 3: Social (H7-9)</div>
          <p className="text-xs text-slate-400">Partnerships, transformation, philosophy</p>
        </div>
        <div className="space-y-2">
          <div className="text-amber-400 font-bold">Quadrant 4: Universal (H10-12)</div>
          <p className="text-xs text-slate-400">Career, community, transcendence</p>
        </div>
      </div>
    </CollapsibleSection>

    {/* Why Different Sizes */}
    <CollapsibleSection title="Why Are Houses Different Sizes?" icon="📐">
      <p className="text-slate-300 mb-4">
        In the Placidus house system (most common in Western astrology), houses are
        <strong className="text-cyan-400"> unequal in size</strong> based on your birth latitude
        and time.
      </p>
      <ul className="text-sm text-slate-300 space-y-2">
        <li>• <span className="text-amber-400">Small houses</span> don't mean "less important"</li>
        <li>• <span className="text-amber-400">Large houses</span> don't mean "more emphasis"</li>
        <li>• Size reflects astronomical reality, not life significance</li>
        <li>• What matters is what's IN the house (planets) and WHO RULES it</li>
      </ul>
      <ExampleBox>
        A tiny 5th house packed with 3 planets is far more creatively active than
        a large, empty 5th house. The ruler's condition also matters!
      </ExampleBox>
    </CollapsibleSection>

    {/* House Rulers */}
    <CollapsibleSection title="House Rulers — The Power Source" icon="👑">
      <p className="text-slate-300 mb-4">
        Every house has a <strong className="text-cyan-400">ruler</strong> — the planet that rules
        the zodiac sign on that house's cusp. The ruler's condition (sign, house, aspects) tells
        you HOW that life area operates.
      </p>
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-4">
        <p className="text-sm text-purple-300">
          <strong>Power Flow:</strong> House Cusp Sign → Sign's Ruler → Ruler's House
        </p>
        <p className="text-xs text-slate-400 mt-2">
          This "power flow" connects different life areas, showing how energies transfer.
        </p>
      </div>
      <ExampleBox>
        <strong>If Taurus is on your 7th House cusp:</strong><br/>
        • Venus rules Taurus, so Venus rules your 7th House<br/>
        • If Venus is in your 10th House: partnerships connect to career<br/>
        • You may meet partners through work, or business becomes partnership-focused
      </ExampleBox>
    </CollapsibleSection>

    {/* Sign Rulers Table */}
    <CollapsibleSection title="Sign Rulers Reference" icon="📊">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left p-2 text-cyan-400">Sign</th>
              <th className="text-left p-2 text-cyan-400">Symbol</th>
              <th className="text-left p-2 text-cyan-400">Ruler</th>
              <th className="text-left p-2 text-cyan-400">Element</th>
              <th className="text-left p-2 text-cyan-400">Mode</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(SIGN_RULERS).map(([sign, data]) => (
              <tr key={sign} className="border-b border-slate-800">
                <td className="p-2 text-slate-200">{sign}</td>
                <td className="p-2 text-xl">{data.symbol}</td>
                <td className="p-2 text-purple-400">{data.ruler}</td>
                <td className="p-2 text-slate-400">{data.element}</td>
                <td className="p-2 text-slate-400">{data.modality}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CollapsibleSection>

    {/* Complete Picture */}
    <CollapsibleSection title="The Complete Picture — Baking a Cake" icon="🎂">
      <p className="text-slate-300 mb-4">
        Think of reading a house like baking a cake:
      </p>
      <ul className="text-sm space-y-2">
        <li className="text-slate-300">
          <span className="text-cyan-400 font-bold">House</span> = The type of cake (birthday, wedding, etc.)
        </li>
        <li className="text-slate-300">
          <span className="text-purple-400 font-bold">Sign on cusp</span> = The flavor (chocolate, vanilla)
        </li>
        <li className="text-slate-300">
          <span className="text-amber-400 font-bold">Planets inside</span> = The toppings and decorations
        </li>
        <li className="text-slate-300">
          <span className="text-green-400 font-bold">Ruler's condition</span> = The baker's skill and kitchen quality
        </li>
      </ul>
      <ExampleBox>
        <strong>Empty houses</strong> aren't inactive — they're managed by their ruler.
        An empty 7th house doesn't mean "no relationships" — look to where the ruler lives!
      </ExampleBox>
    </CollapsibleSection>

    {/* Next Steps */}
    <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg p-6 border border-cyan-500/30">
      <h3 className="text-xl font-bold text-cyan-400 mb-3">Ready to Explore?</h3>
      <p className="text-slate-300 mb-4">
        Click on any house tab above to learn about that specific life area, or click
        directly on a house in the wheel to jump to its content.
      </p>
      <div className="flex flex-wrap gap-2">
        {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => (
          <span key={n} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">
            H{n}: {HOUSE_DATA[n]?.keyword}
          </span>
        ))}
      </div>
    </div>
  </div>
);

// ============================================================================
// TAB 0.1: ZODIAC SIGNS FOUNDATION
// ============================================================================

// Sign Card Component - Expandable zodiac sign education
export const SignCard: React.FC<{ signKey: string }> = ({ signKey }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const content = ZODIAC_SIGNS[signKey];
  if (!content) return null;

  const elementColors: Record<string, string> = {
    Fire: 'text-red-400 bg-red-500/10 border-red-500/20',
    Earth: 'text-green-400 bg-green-500/10 border-green-500/20',
    Air: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    Water: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  };

  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-800/20">
      {/* Clickable Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{content.symbol}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold text-lg">{content.name}</span>
              <span className="text-slate-500">—</span>
              <span className="text-amber-400 italic">"{content.archetype}"</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span>{content.dates}</span>
              <span>•</span>
              <span className={`px-1.5 py-0.5 rounded ${elementColors[content.element]}`}>{content.element}</span>
              <span className={`px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400`}>{content.modality}</span>
            </div>
          </div>
        </div>
        <span className="text-slate-400 text-xl">{isExpanded ? '▲' : '▼'}</span>
      </button>

      {/* Keyword - Always Visible */}
      <div className="px-4 pb-3 text-slate-300 text-sm border-t border-slate-700/50 pt-3">
        <span className="text-purple-400 font-bold">{content.keyword}</span>
        <span className="text-slate-400 mx-2">•</span>
        <span>Ruled by {content.ruler} {content.rulerSymbol}</span>
        <span className="text-slate-400 mx-2">•</span>
        <span>Natural ruler of House {content.naturalHouse}</span>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-slate-700 p-4 space-y-5 bg-slate-900/30">

          {/* Core Significance - 5W+H+Emotion */}
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
            <h4 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
              <span>🔮</span> Core Significance
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div><span className="text-yellow-400 font-medium">WHO:</span> <span className="text-slate-300">{content.coreSignificance.who}</span></div>
              <div><span className="text-yellow-400 font-medium">WHAT:</span> <span className="text-slate-300">{content.coreSignificance.what}</span></div>
              <div><span className="text-yellow-400 font-medium">WHEN:</span> <span className="text-slate-300">{content.coreSignificance.when}</span></div>
              <div><span className="text-yellow-400 font-medium">WHERE:</span> <span className="text-slate-300">{content.coreSignificance.where}</span></div>
              <div className="md:col-span-2"><span className="text-yellow-400 font-medium">WHY:</span> <span className="text-slate-300">{content.coreSignificance.why}</span></div>
              <div className="md:col-span-2"><span className="text-yellow-400 font-medium">HOW:</span> <span className="text-slate-300">{content.coreSignificance.how}</span></div>
              <div className="md:col-span-2"><span className="text-amber-400 font-medium">EMOTION:</span> <span className="text-amber-300 italic">{content.coreSignificance.emotion}</span></div>
            </div>
          </div>

          {/* Positive Traits */}
          <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
            <h4 className="text-green-400 font-bold mb-3 flex items-center gap-2">
              <span>✓</span> SUN IN {content.name.toUpperCase()}: Positive Traits
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm">
              {content.positiveTraits.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Challenges */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
            <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2">
              <span>⚠</span> Challenges
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm">
              {content.challenges.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Life Lesson */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
            <h4 className="text-amber-400 font-bold mb-3 flex items-center gap-2">
              <span>💡</span> Life Lesson
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">{content.lifeLesson}</p>
          </div>

          {/* Career Strengths */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
              <span>💼</span> Career Strengths
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">{content.careerStrengths}</p>
          </div>

          {/* This Sign Elsewhere */}
          <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
            <h4 className="text-purple-400 font-bold mb-3 flex items-center gap-2">
              <span>🪐</span> {content.name} Elsewhere in Your Chart
            </h4>
            <div className="space-y-3 text-sm">
              <div className="bg-slate-800/50 p-3 rounded">
                <div className="text-purple-300 font-medium mb-1">☽ Moon in {content.name}</div>
                <p className="text-slate-400">{content.moonIn}</p>
              </div>
              <div className="bg-slate-800/50 p-3 rounded">
                <div className="text-purple-300 font-medium mb-1">↑ Ascendant in {content.name}</div>
                <p className="text-slate-400">{content.ascendantIn}</p>
              </div>
              <div className="bg-slate-800/50 p-3 rounded">
                <div className="text-purple-300 font-medium mb-1">♀ Venus in {content.name}</div>
                <p className="text-slate-400">{content.venusIn}</p>
              </div>
              <div className="bg-slate-800/50 p-3 rounded">
                <div className="text-purple-300 font-medium mb-1">♂ Mars in {content.name}</div>
                <p className="text-slate-400">{content.marsIn}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Tab 0.1 Content - "The 12 Zodiac Signs"
export const TabSignsContent: React.FC = () => (
  <div className="space-y-6">
    {/* What Are Zodiac Signs? */}
    <CollapsibleSection title="What Are Zodiac Signs?" icon="🌟" defaultOpen={true}>
      <p className="text-lg text-slate-200 mb-4">
        <strong className="text-cyan-400">Imagine the sky as a giant clock marking the passage of one year.</strong>
      </p>
      <p className="text-slate-300 mb-4">
        As Earth orbits the Sun, the Sun appears to move through 12 different "sections" of the sky—like numbers on a clock face.
        These 12 sections are the <strong className="text-cyan-400">zodiac signs</strong>, each occupying exactly 30° of the 360° circle.
      </p>
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-4">
        <p className="text-purple-300 font-medium mb-2">The Key Insight:</p>
        <p className="text-slate-300 text-sm">
          <strong>EVERY planet in your chart is in a zodiac sign</strong>, not just the Sun! Your "Sun sign" is just one piece—
          you have a Moon sign, Mercury sign, Venus sign, and more. The zodiac signs are the <strong className="text-amber-400">FLAVORS</strong>,
          the planets are the <strong className="text-cyan-400">WHAT</strong>, and the houses are the <strong className="text-green-400">WHERE</strong>.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-slate-800/50 p-2 rounded">
          <span className="text-yellow-400">☉ Sun</span> = Core identity flavor
        </div>
        <div className="bg-slate-800/50 p-2 rounded">
          <span className="text-slate-300">☽ Moon</span> = Emotional flavor
        </div>
        <div className="bg-slate-800/50 p-2 rounded">
          <span className="text-cyan-400">☿ Mercury</span> = Communication flavor
        </div>
        <div className="bg-slate-800/50 p-2 rounded">
          <span className="text-pink-400">♀ Venus</span> = Love/values flavor
        </div>
        <div className="bg-slate-800/50 p-2 rounded">
          <span className="text-red-400">♂ Mars</span> = Action/drive flavor
        </div>
        <div className="bg-slate-800/50 p-2 rounded">
          <span className="text-orange-400">♃ Jupiter</span> = Growth/luck flavor
        </div>
      </div>
    </CollapsibleSection>

    {/* The Four Elements */}
    <CollapsibleSection title="The Four Elements (How Energy Flows)" icon="🔥">
      <p className="text-slate-300 mb-4">
        Each sign belongs to one of four elements. Elements show the <strong className="text-cyan-400">fundamental nature</strong> of the sign's energy.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
          <h4 className="text-red-400 font-bold mb-2">🔥 FIRE</h4>
          <p className="text-xs text-slate-400 mb-2">Aries, Leo, Sagittarius</p>
          <p className="text-sm text-slate-300">
            Passionate, creative, action-oriented. Fire signs <strong>INITIATE</strong>—they ignite, inspire, and create movement.
          </p>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
          <h4 className="text-green-400 font-bold mb-2">🌍 EARTH</h4>
          <p className="text-xs text-slate-400 mb-2">Taurus, Virgo, Capricorn</p>
          <p className="text-sm text-slate-300">
            Practical, grounded, stable. Earth signs <strong>BUILD</strong>—they manifest, stabilize, and create lasting form.
          </p>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 p-4 rounded-lg">
          <h4 className="text-cyan-400 font-bold mb-2">💨 AIR</h4>
          <p className="text-xs text-slate-400 mb-2">Gemini, Libra, Aquarius</p>
          <p className="text-sm text-slate-300">
            Intellectual, social, communicative. Air signs <strong>CONNECT</strong>—they spread ideas, link people, and conceptualize.
          </p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
          <h4 className="text-blue-400 font-bold mb-2">💧 WATER</h4>
          <p className="text-xs text-slate-400 mb-2">Cancer, Scorpio, Pisces</p>
          <p className="text-sm text-slate-300">
            Emotional, intuitive, empathetic. Water signs <strong>FEEL</strong>—they process emotions, merge, and dissolve boundaries.
          </p>
        </div>
      </div>
    </CollapsibleSection>

    {/* The Three Modalities */}
    <CollapsibleSection title="The Three Modalities (When Energy Acts)" icon="🌀">
      <p className="text-slate-300 mb-4">
        Each sign belongs to one of three modalities. Modalities show the <strong className="text-cyan-400">timing and style</strong> of expression.
      </p>
      <div className="space-y-3">
        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg">
          <h4 className="text-amber-400 font-bold mb-2">🌟 CARDINAL — Start of Season</h4>
          <p className="text-xs text-slate-400 mb-2">Aries, Cancer, Libra, Capricorn</p>
          <p className="text-sm text-slate-300">
            Initiating, leading, beginning. Cardinal signs <strong>START things</strong>—natural leaders who create change.
            But they may struggle to finish what they start.
          </p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-lg">
          <h4 className="text-purple-400 font-bold mb-2">💎 FIXED — Middle of Season</h4>
          <p className="text-xs text-slate-400 mb-2">Taurus, Leo, Scorpio, Aquarius</p>
          <p className="text-sm text-slate-300">
            Stabilizing, maintaining, persisting. Fixed signs <strong>MAINTAIN things</strong>—determined and reliable.
            But they can be stubborn and resistant to change.
          </p>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 p-4 rounded-lg">
          <h4 className="text-cyan-400 font-bold mb-2">🌀 MUTABLE — End of Season</h4>
          <p className="text-xs text-slate-400 mb-2">Gemini, Virgo, Sagittarius, Pisces</p>
          <p className="text-sm text-slate-300">
            Adapting, transitioning, flexible. Mutable signs <strong>COMPLETE things</strong>—wise adapters who prepare for change.
            But they can be scattered and lack focus.
          </p>
        </div>
      </div>
    </CollapsibleSection>

    {/* The Hero's Journey */}
    <CollapsibleSection title="The Complete Cycle: Hero's Journey" icon="🌍">
      <p className="text-slate-300 mb-4">
        The zodiac is a <strong className="text-cyan-400">complete life story</strong>—from birth to transcendence and rebirth:
      </p>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-green-500/10 border border-green-500/30 p-3 rounded">
          <div className="text-green-400 font-bold mb-1">🌱 SPRING: Personal Development</div>
          <div className="text-slate-400">Aries → Taurus → Gemini</div>
          <div className="text-xs text-slate-500 mt-1">Birth, growth, curiosity</div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded">
          <div className="text-yellow-400 font-bold mb-1">☀️ SUMMER: Personal Expression</div>
          <div className="text-slate-400">Cancer → Leo → Virgo</div>
          <div className="text-xs text-slate-500 mt-1">Feeling, creating, refining</div>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/30 p-3 rounded">
          <div className="text-orange-400 font-bold mb-1">🍂 AUTUMN: Relationship</div>
          <div className="text-slate-400">Libra → Scorpio → Sagittarius</div>
          <div className="text-xs text-slate-500 mt-1">Partnership, transformation, wisdom</div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded">
          <div className="text-blue-400 font-bold mb-1">❄️ WINTER: Collective</div>
          <div className="text-slate-400">Capricorn → Aquarius → Pisces</div>
          <div className="text-xs text-slate-500 mt-1">Achievement, innovation, transcendence</div>
        </div>
      </div>
      <p className="text-amber-400 text-sm mt-4">
        After Pisces dissolves back to source, <strong>Aries is born again</strong>—the eternal cycle continues!
      </p>
    </CollapsibleSection>

    {/* The 12 Signs */}
    <CollapsibleSection title="The 12 Zodiac Signs" icon="♈" defaultOpen={true}>
      <p className="text-slate-300 mb-4">
        Click any sign below to expand and learn the full educational content including traits, challenges, and how this sign expresses through different planets.
      </p>
      <div className="space-y-3">
        {/* Spring Signs */}
        <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">🌱 Spring Signs (Personal Development)</div>
        <SignCard signKey="aries" />
        <SignCard signKey="taurus" />
        <SignCard signKey="gemini" />

        {/* Summer Signs */}
        <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 mt-6">☀️ Summer Signs (Personal Expression)</div>
        <SignCard signKey="cancer" />
        <SignCard signKey="leo" />
        <SignCard signKey="virgo" />

        {/* Autumn Signs */}
        <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 mt-6">🍂 Autumn Signs (Relationship Development)</div>
        <SignCard signKey="libra" />
        <SignCard signKey="scorpio" />
        <SignCard signKey="sagittarius" />

        {/* Winter Signs */}
        <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 mt-6">❄️ Winter Signs (Collective Contribution)</div>
        <SignCard signKey="capricorn" />
        <SignCard signKey="aquarius" />
        <SignCard signKey="pisces" />
      </div>
    </CollapsibleSection>

    {/* How to Read Signs */}
    <CollapsibleSection title="How to Read Signs in Your Chart" icon="📖">
      <ol className="space-y-3 text-sm">
        <li className="flex gap-3">
          <span className="text-cyan-400 font-bold">1.</span>
          <span className="text-slate-300"><strong>Find your "Big Three":</strong> Sun sign (identity), Moon sign (emotions), Ascendant/Rising (appearance)</span>
        </li>
        <li className="flex gap-3">
          <span className="text-cyan-400 font-bold">2.</span>
          <span className="text-slate-300"><strong>Look at personal planets:</strong> Mercury (communication), Venus (love), Mars (action)</span>
        </li>
        <li className="flex gap-3">
          <span className="text-cyan-400 font-bold">3.</span>
          <span className="text-slate-300"><strong>Notice dominant elements:</strong> Count planets in Fire/Earth/Air/Water—this shows your primary nature</span>
        </li>
        <li className="flex gap-3">
          <span className="text-cyan-400 font-bold">4.</span>
          <span className="text-slate-300"><strong>Notice dominant modality:</strong> Count Cardinal/Fixed/Mutable—this shows your action style</span>
        </li>
        <li className="flex gap-3">
          <span className="text-cyan-400 font-bold">5.</span>
          <span className="text-slate-300"><strong>Synthesize:</strong> Combine WHAT (planets) + HOW (signs) + WHERE (houses) for the complete picture</span>
        </li>
      </ol>
      <ExampleBox>
        <strong>Example:</strong> Sun in Gemini (curious identity) + Moon in Cancer (nurturing emotions) + Leo Rising (confident appearance) =
        A curious communicator who feels deeply and presents confidently. You're ALL THREE, not just one!
      </ExampleBox>
    </CollapsibleSection>

    {/* Next Steps */}
    <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg p-6 border border-cyan-500/30">
      <h3 className="text-xl font-bold text-cyan-400 mb-3">Foundation Complete!</h3>
      <p className="text-slate-300 mb-4">
        You now understand the 12 zodiac signs—the FLAVORS that color planetary energies.
        Next, explore the <strong className="text-amber-400">Houses</strong> to learn WHERE these energies express in your life.
      </p>
      <div className="flex flex-wrap gap-2">
        <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">Tab 0: What Are Houses?</span>
        <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">Tabs 1-12: House Details</span>
      </div>
    </div>
  </div>
);

// ============================================================================
// Tab 0.5 Content - "The Fractal Zone System"
// Understanding degrees within signs - the precision layer
// ============================================================================

export const TabZonesContent: React.FC = () => (
  <div className="space-y-6">
    {/* What Are Zones? */}
    <CollapsibleSection title="What Are Zones?" icon="🔬" defaultOpen={true}>
      <p className="text-lg text-slate-200 mb-4">
        <strong className="text-amber-400">Each 30° sign contains internal structure — a fractal pattern that reveals precision.</strong>
      </p>
      <p className="text-slate-300 mb-4">
        You already know each zodiac sign occupies 30° of the circle. But those 30° are NOT uniform.
        <strong className="text-amber-400"> Aries at 2° feels different than Aries at 28°</strong> — both are Aries, but at different stages of the Aries journey.
      </p>
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-4">
        <p className="text-amber-300 font-medium mb-2">The 6-Zone System:</p>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="bg-slate-800/50 p-2 rounded text-center">
            <div className="text-green-400 font-bold">Zone 1-2</div>
            <div className="text-slate-400 text-xs">0° - 10°</div>
            <div className="text-green-300 text-xs">Beginning</div>
          </div>
          <div className="bg-slate-800/50 p-2 rounded text-center">
            <div className="text-cyan-400 font-bold">Zone 3-4</div>
            <div className="text-slate-400 text-xs">10° - 20°</div>
            <div className="text-cyan-300 text-xs">Core</div>
          </div>
          <div className="bg-slate-800/50 p-2 rounded text-center">
            <div className="text-purple-400 font-bold">Zone 5-6</div>
            <div className="text-slate-400 text-xs">20° - 30°</div>
            <div className="text-purple-300 text-xs">Transition</div>
          </div>
        </div>
      </div>
      <p className="text-slate-400 text-sm">
        <strong>Why 5° zones?</strong> Small enough for meaningful precision, large enough to avoid overwhelming complexity.
        Each 5° zone groups into 3 meta-phases (2 zones each), creating a natural journey through each sign.
      </p>
    </CollapsibleSection>

    {/* The Three Meta-Phases */}
    <CollapsibleSection title="The Three Meta-Phases" icon="🌀">
      <p className="text-slate-300 mb-4">
        Every sign follows the same internal journey: <strong className="text-amber-400">Beginning → Core → Transition</strong>
      </p>

      {/* Beginning Meta-Phase */}
      <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg mb-4">
        <h4 className="text-green-400 font-bold mb-3 text-lg">🌱 BEGINNING (Zones 1-2, 0°-10°)</h4>
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-green-300 font-medium">Zone 1 (0°-5°): The Birth</p>
              <ul className="text-slate-400 text-xs space-y-1 mt-1">
                <li>• First contact with sign energy</li>
                <li>• Enthusiastic but awkward</li>
                <li>• Overcompensating, trying too hard</li>
                <li>• "Am I doing this right?"</li>
              </ul>
            </div>
            <div>
              <p className="text-green-300 font-medium">Zone 2 (5°-10°): The Student</p>
              <ul className="text-slate-400 text-xs space-y-1 mt-1">
                <li>• Growing confidence</li>
                <li>• Still learning but less awkward</li>
                <li>• Experimenting with expression</li>
                <li>• "I'm getting better at this"</li>
              </ul>
            </div>
          </div>
          <div className="bg-green-500/5 p-2 rounded mt-2">
            <p className="text-green-200 text-xs">
              <strong>Theme:</strong> INITIATION — Learning the sign's lessons. Fresh, enthusiastic, pure but unrefined.
            </p>
          </div>
        </div>
      </div>

      {/* Core Meta-Phase */}
      <div className="bg-cyan-500/10 border border-cyan-500/30 p-4 rounded-lg mb-4">
        <h4 className="text-cyan-400 font-bold mb-3 text-lg">💎 CORE (Zones 3-4, 10°-20°)</h4>
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-cyan-300 font-medium">Zone 3 (10°-15°): The Practitioner</p>
              <ul className="text-slate-400 text-xs space-y-1 mt-1">
                <li>• Natural expression emerging</li>
                <li>• Comfortable being this sign</li>
                <li>• Others recognize authenticity</li>
                <li>• "This is just who I am"</li>
              </ul>
            </div>
            <div>
              <p className="text-cyan-300 font-medium">Zone 4 (15°-20°): The Master</p>
              <ul className="text-slate-400 text-xs space-y-1 mt-1">
                <li>• MAXIMUM POWER of the sign</li>
                <li>• Textbook perfect expression</li>
                <li>• Natural authority and mastery</li>
                <li>• "I AM the archetype"</li>
              </ul>
            </div>
          </div>
          <div className="bg-cyan-500/5 p-2 rounded mt-2">
            <p className="text-cyan-200 text-xs">
              <strong>Theme:</strong> MASTERY — Peak expression. When astrology describes "Aries," they mean Aries Zone 3-4.
            </p>
          </div>
        </div>
      </div>

      {/* Transition Meta-Phase */}
      <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-lg">
        <h4 className="text-purple-400 font-bold mb-3 text-lg">🌉 TRANSITION (Zones 5-6, 20°-30°)</h4>
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-purple-300 font-medium">Zone 5 (20°-25°): The Teacher</p>
              <ul className="text-slate-400 text-xs space-y-1 mt-1">
                <li>• Mastered sign deeply</li>
                <li>• Beginning to question limits</li>
                <li>• Can teach others about this sign</li>
                <li>• "What lies beyond?"</li>
              </ul>
            </div>
            <div>
              <p className="text-purple-300 font-medium">Zone 6 (25°-30°): The Bridge</p>
              <ul className="text-slate-400 text-xs space-y-1 mt-1">
                <li>• Strong pull from NEXT sign</li>
                <li>• Bridging two energies</li>
                <li>• Complex expression</li>
                <li>• "I'm both/and now"</li>
              </ul>
            </div>
          </div>
          <div className="bg-purple-500/5 p-2 rounded mt-2">
            <p className="text-purple-200 text-xs">
              <strong>Theme:</strong> WISDOM — Preparing for transformation. Often the wisest placements, seeing beyond limits.
            </p>
          </div>
        </div>
      </div>
    </CollapsibleSection>

    {/* Why Precision Matters */}
    <CollapsibleSection title="Why Precision Matters" icon="🎯">
      <p className="text-slate-300 mb-4">
        Two people with "Sun in Aries" can express very differently based on their zone:
      </p>
      <div className="space-y-3">
        <div className="bg-green-500/10 border border-green-500/30 p-3 rounded">
          <div className="flex justify-between items-center mb-2">
            <span className="text-green-400 font-bold">Sun at 3° Aries (Zone 1)</span>
            <span className="text-xs text-slate-500">Beginning</span>
          </div>
          <p className="text-slate-400 text-sm">
            "I'm <strong>LEARNING</strong> to be bold!" — Tries hard to prove fearlessness. May overcompensate, be pushy.
            Still figuring out healthy assertion vs aggression.
          </p>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 p-3 rounded">
          <div className="flex justify-between items-center mb-2">
            <span className="text-cyan-400 font-bold">Sun at 15° Aries (Zone 4)</span>
            <span className="text-xs text-slate-500">Core</span>
          </div>
          <p className="text-slate-400 text-sm">
            "I <strong>AM</strong> courageous naturally." — Doesn't think about being brave, just acts.
            Balanced aggression, natural leader. Others see them as quintessential Aries.
          </p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/30 p-3 rounded">
          <div className="flex justify-between items-center mb-2">
            <span className="text-purple-400 font-bold">Sun at 27° Aries (Zone 6)</span>
            <span className="text-xs text-slate-500">Transition</span>
          </div>
          <p className="text-slate-400 text-sm">
            "I've <strong>MASTERED</strong> courage — now what about patience?" — Wise about when to fight, when to rest.
            Beginning to feel Taurus energy. Can teach others about healthy assertion.
          </p>
        </div>
      </div>
      <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
        <p className="text-amber-300 text-sm">
          <strong>This is why GENESIS is different:</strong> We don't just know WHAT sign you're in —
          we know WHERE in that sign's journey you are.
        </p>
      </div>
    </CollapsibleSection>

    {/* The Complete Pattern */}
    <CollapsibleSection title="The Complete Pattern: 72 Positions" icon="🌐">
      <p className="text-slate-300 mb-4">
        12 Signs × 6 Zones = <strong className="text-amber-400">72 Constitutional Positions</strong>
      </p>
      <div className="space-y-2">
        {[
          { sign: 'Aries', symbol: '♈', element: 'Fire', beginning: 'Raw warrior, learning courage', core: 'Natural leader, peak assertion', transition: 'Wise pioneer, sensing Taurus stability' },
          { sign: 'Taurus', symbol: '♉', element: 'Earth', beginning: 'Building security, acquiring aggressively', core: 'Stable foundation, peak reliability', transition: 'Secured comfort, sensing Gemini curiosity' },
          { sign: 'Gemini', symbol: '♊', element: 'Air', beginning: 'Scattered curiosity, learning communication', core: 'Master communicator, peak versatility', transition: 'Wise messenger, sensing Cancer emotions' },
          { sign: 'Cancer', symbol: '♋', element: 'Water', beginning: 'Raw emotions, learning to nurture', core: 'Natural mother, peak protection', transition: 'Wise nurturer, sensing Leo expression' },
          { sign: 'Leo', symbol: '♌', element: 'Fire', beginning: 'Trying to shine, learning performance', core: 'Natural star, peak creativity', transition: 'Confident creator, sensing Virgo refinement' },
          { sign: 'Virgo', symbol: '♍', element: 'Earth', beginning: 'Hypercritical, learning analysis', core: 'Master craftsperson, peak precision', transition: 'Wise servant, sensing Libra balance' },
          { sign: 'Libra', symbol: '♎', element: 'Air', beginning: 'People-pleasing, learning diplomacy', core: 'Natural mediator, peak harmony', transition: 'Wise partner, sensing Scorpio depth' },
          { sign: 'Scorpio', symbol: '♏', element: 'Water', beginning: 'Raw intensity, learning transformation', core: 'Phoenix master, peak power', transition: 'Wise alchemist, sensing Sagittarius wisdom' },
          { sign: 'Sagittarius', symbol: '♐', element: 'Fire', beginning: 'Reckless explorer, learning philosophy', core: 'Natural teacher, peak expansion', transition: 'Wise seeker, sensing Capricorn structure' },
          { sign: 'Capricorn', symbol: '♑', element: 'Earth', beginning: 'Ambitious climber, learning discipline', core: 'Master builder, peak achievement', transition: 'Wise elder, sensing Aquarius innovation' },
          { sign: 'Aquarius', symbol: '♒', element: 'Air', beginning: 'Rebellious outsider, learning innovation', core: 'Natural revolutionary, peak vision', transition: 'Wise visionary, sensing Pisces transcendence' },
          { sign: 'Pisces', symbol: '♓', element: 'Water', beginning: 'Lost in dreams, learning compassion', core: 'Natural mystic, peak spirituality', transition: 'Wise transcendent, sensing Aries rebirth' },
        ].map((item) => (
          <ZonePatternCard key={item.sign} {...item} />
        ))}
      </div>
      <p className="text-amber-400 text-sm mt-4 text-center">
        After Pisces Zone 6 dissolves back to source, <strong>Aries Zone 1 is born again</strong> — the eternal cycle continues!
      </p>
    </CollapsibleSection>

    {/* How to Find Your Zones */}
    <CollapsibleSection title="How to Find Your Zones" icon="🔍">
      <ol className="space-y-3 text-sm">
        <li className="flex gap-3">
          <span className="text-amber-400 font-bold">1.</span>
          <span className="text-slate-300">
            <strong>Look at the degree</strong> — Your placement shows degrees (e.g., "Sun at 15° Aries")
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-amber-400 font-bold">2.</span>
          <span className="text-slate-300">
            <strong>Determine the zone</strong> — Divide by 5: 0-5° = Zone 1, 5-10° = Zone 2, etc.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-amber-400 font-bold">3.</span>
          <span className="text-slate-300">
            <strong>Identify meta-phase</strong> — Zones 1-2 = Beginning, 3-4 = Core, 5-6 = Transition
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-amber-400 font-bold">4.</span>
          <span className="text-slate-300">
            <strong>Apply to all placements</strong> — Check Sun, Moon, Ascendant, Venus, Mars zones
          </span>
        </li>
      </ol>
      <div className="mt-4 bg-slate-800/50 p-4 rounded-lg">
        <p className="text-amber-400 font-medium mb-2">Quick Reference:</p>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="text-green-400">0°-5°</div>
            <div className="text-slate-500">Zone 1</div>
          </div>
          <div className="text-center">
            <div className="text-green-400">5°-10°</div>
            <div className="text-slate-500">Zone 2</div>
          </div>
          <div className="text-center">
            <div className="text-cyan-400">10°-15°</div>
            <div className="text-slate-500">Zone 3</div>
          </div>
          <div className="text-center">
            <div className="text-cyan-400">15°-20°</div>
            <div className="text-slate-500">Zone 4</div>
          </div>
          <div className="text-center">
            <div className="text-purple-400">20°-25°</div>
            <div className="text-slate-500">Zone 5</div>
          </div>
          <div className="text-center">
            <div className="text-purple-400">25°-30°</div>
            <div className="text-slate-500">Zone 6</div>
          </div>
        </div>
      </div>
    </CollapsibleSection>

    {/* Sign-Specific Zone Details - Autumn Signs */}
    <CollapsibleSection title="Autumn Signs: Detailed Zone Breakdown" icon="🍂">
      <p className="text-slate-300 mb-4">
        Deep dive into how zones modify each Autumn sign (Libra, Scorpio, Sagittarius).
        Click any sign to see all 6 zones with characteristics, planetary modifiers, and examples.
      </p>
      <div className="space-y-3">
        {['libra', 'scorpio', 'sagittarius'].map((signKey) => {
          const signData = SIGN_ZONE_DETAILS[signKey];
          if (!signData) return null;
          return <SignZoneDetailCard key={signKey} signData={signData} />;
        })}
      </div>
    </CollapsibleSection>

    {/* Sign-Specific Zone Details - Winter Signs */}
    <CollapsibleSection title="Winter Signs: Detailed Zone Breakdown" icon="❄️">
      <p className="text-slate-300 mb-4">
        Deep dive into how zones modify each Winter sign (Capricorn, Aquarius, Pisces).
        Click any sign to see all 6 zones with characteristics, planetary modifiers, and examples.
      </p>
      <div className="space-y-3">
        {['capricorn', 'aquarius', 'pisces'].map((signKey) => {
          const signData = SIGN_ZONE_DETAILS[signKey];
          if (!signData) return null;
          return <SignZoneDetailCard key={signKey} signData={signData} />;
        })}
      </div>
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mt-4">
        <div className="text-purple-300 font-medium mb-2">🌀 Special: 29° Pisces — The Final Degree</div>
        <p className="text-slate-400 text-sm">
          When any planet is at 29° Pisces, it holds the ENTIRE zodiac journey: all 12 signs integrated into one moment.
          Complete dissolution preparing for complete rebirth — the mystic who has mastered surrender, now ready to become the warrior.
          The ultimate ending that IS the beginning. Death and birth in the same breath.
        </p>
      </div>
      <p className="text-amber-400 text-sm mt-4 text-center">
        🌱 Spring & ☀️ Summer sign zones coming soon!
      </p>
    </CollapsibleSection>

    {/* The Fractal Principle */}
    <CollapsibleSection title="The Fractal Principle" icon="✨">
      <p className="text-slate-300 mb-4">
        The same pattern repeats at every level — this is <strong className="text-amber-400">fractal architecture</strong>:
      </p>
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded">
          <div className="text-amber-400 font-medium mb-1">MACRO LEVEL (Year)</div>
          <p className="text-slate-400 text-sm">12 signs = 12 months. Spring → Summer → Autumn → Winter.</p>
        </div>
        <div className="bg-slate-800/50 p-3 rounded">
          <div className="text-amber-400 font-medium mb-1">MESO LEVEL (Sign)</div>
          <p className="text-slate-400 text-sm">6 zones = internal phases. Beginning → Core → Transition within each sign.</p>
        </div>
        <div className="bg-slate-800/50 p-3 rounded">
          <div className="text-amber-400 font-medium mb-1">MICRO LEVEL (Degrees)</div>
          <p className="text-slate-400 text-sm">Each 5° zone has subtle beginning/middle/end. (Advanced study)</p>
        </div>
      </div>
      <p className="text-amber-300 text-sm mt-4 text-center">
        Think of a year having months, months having weeks, weeks having days — <strong>same pattern, different scales</strong>.
      </p>
    </CollapsibleSection>

    {/* Next Steps */}
    <div className="bg-gradient-to-r from-amber-500/20 to-purple-500/20 rounded-lg p-6 border border-amber-500/30">
      <h3 className="text-xl font-bold text-amber-400 mb-3">Precision Unlocked!</h3>
      <p className="text-slate-300 mb-4">
        You now understand the fractal zone system — how <strong className="text-cyan-400">72 constitutional positions</strong> emerge from 12 signs × 6 zones.
        This is the precision layer that makes GENESIS different.
      </p>
      <div className="flex flex-wrap gap-2">
        <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">Tab 0: Houses Foundation</span>
        <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">Tab 0.1: Zodiac Signs</span>
        <span className="px-2 py-1 bg-amber-500/30 rounded text-xs text-amber-300">✓ Tab 0.5: Zones</span>
        <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">Tabs 1-12: House Details</span>
      </div>
    </div>
  </div>
);

// Zone Pattern Card for the complete pattern section
export const ZonePatternCard: React.FC<{
  sign: string;
  symbol: string;
  element: string;
  beginning: string;
  core: string;
  transition: string;
}> = ({ sign, symbol, element, beginning, core, transition }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const elementColor = {
    Fire: 'red',
    Earth: 'green',
    Air: 'cyan',
    Water: 'blue'
  }[element] || 'slate';

  return (
    <div className={`bg-${elementColor}-500/5 border border-${elementColor}-500/20 rounded-lg overflow-hidden`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-2 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{symbol}</span>
          <span className={`text-${elementColor}-400 font-medium`}>{sign}</span>
          <span className="text-xs text-slate-500">({element})</span>
        </div>
        <span className="text-slate-500 text-xs">{isExpanded ? '▼' : '▶'}</span>
      </button>
      {isExpanded && (
        <div className="px-3 pb-3 space-y-1 text-xs">
          <div className="flex gap-2">
            <span className="text-green-400 w-20">Beginning:</span>
            <span className="text-slate-400">{beginning}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-cyan-400 w-20">Core:</span>
            <span className="text-slate-400">{core}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-purple-400 w-20">Transition:</span>
            <span className="text-slate-400">{transition}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Sign Zone Detail Card - Shows all 6 zones for a sign with full details
export const SignZoneDetailCard: React.FC<{ signData: SignZoneData }> = ({ signData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedZone, setSelectedZone] = useState<number | null>(null);

  const elementColor = {
    Fire: 'red',
    Earth: 'green',
    Air: 'cyan',
    Water: 'blue'
  }[signData.element] || 'slate';

  const getZoneColor = (zone: number) => {
    if (zone <= 2) return 'green';
    if (zone <= 4) return 'cyan';
    return 'purple';
  };

  return (
    <div className={`bg-${elementColor}-500/5 border border-${elementColor}-500/30 rounded-lg overflow-hidden`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{signData.symbol}</span>
          <div>
            <span className={`text-${elementColor}-400 font-bold`}>{signData.sign}</span>
            <span className="text-slate-500 text-xs ml-2">({signData.element} • {signData.modality})</span>
          </div>
        </div>
        <span className="text-slate-500">{isExpanded ? '▼' : '▶'}</span>
      </button>

      {isExpanded && (
        <div className="px-3 pb-3 space-y-3">
          <p className="text-slate-400 text-sm italic">{signData.essence}</p>

          {/* Zone Tabs */}
          <div className="flex gap-1 flex-wrap">
            {signData.zones.map((zone) => (
              <button
                key={zone.zone}
                onClick={() => setSelectedZone(selectedZone === zone.zone ? null : zone.zone)}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  selectedZone === zone.zone
                    ? `bg-${getZoneColor(zone.zone)}-500 text-white`
                    : `bg-slate-700 text-${getZoneColor(zone.zone)}-400 hover:bg-slate-600`
                }`}
              >
                Z{zone.zone} ({zone.degrees})
              </button>
            ))}
          </div>

          {/* Selected Zone Details */}
          {selectedZone && (
            <div className={`bg-${getZoneColor(selectedZone)}-500/10 border border-${getZoneColor(selectedZone)}-500/30 rounded-lg p-3 mt-2`}>
              {(() => {
                const zone = signData.zones.find(z => z.zone === selectedZone);
                if (!zone) return null;
                return (
                  <div className="space-y-3">
                    <div>
                      <div className={`text-${getZoneColor(selectedZone)}-400 font-bold`}>
                        Zone {zone.zone}: {zone.name}
                      </div>
                      <div className="text-amber-400 text-xs mt-1">{zone.coreQuality}</div>
                    </div>

                    <div>
                      <div className="text-slate-500 text-xs uppercase mb-1">Characteristics</div>
                      <ul className="space-y-1">
                        {zone.characteristics.map((c, i) => (
                          <li key={i} className="text-slate-300 text-xs">• {c}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 gap-2 text-xs">
                      <div className="bg-slate-800/50 p-2 rounded">
                        <span className="text-yellow-400">☉ Sun:</span>
                        <span className="text-slate-400 ml-1">{zone.sunModifier}</span>
                      </div>
                      <div className="bg-slate-800/50 p-2 rounded">
                        <span className="text-slate-300">☽ Moon:</span>
                        <span className="text-slate-400 ml-1">{zone.moonModifier}</span>
                      </div>
                      <div className="bg-slate-800/50 p-2 rounded">
                        <span className="text-purple-400">↑ ASC:</span>
                        <span className="text-slate-400 ml-1">{zone.ascendantModifier}</span>
                      </div>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 p-2 rounded">
                      <div className="text-amber-400 text-xs mb-1">Real-World Example:</div>
                      <p className="text-slate-300 text-xs italic">{zone.example}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {!selectedZone && (
            <p className="text-slate-500 text-xs text-center py-2">
              Click a zone button above to see detailed characteristics
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// House Tab Content (1-12)
export const TabHouseContent: React.FC<{ houseNum: number }> = ({ houseNum }) => {
  const data = HOUSE_DATA[houseNum];
  if (!data) return <div>House data not found</div>;

  const signData = SIGN_RULERS[data.naturalSign];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-700 pb-4">
        <h1 className="text-3xl font-bold text-cyan-400">{data.title}</h1>
        <p className="text-lg text-slate-400 mt-1">{data.subtitle}</p>
        <div className="flex gap-4 mt-3">
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
            {data.keyword}
          </span>
          <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm">
            Natural Sign: {signData.symbol} {data.naturalSign}
          </span>
          <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm">
            Natural Ruler: {signData.ruler}
          </span>
        </div>
      </div>

      {/* Life Areas */}
      <CollapsibleSection title="What This House Governs" icon="🎯" defaultOpen={true}>
        <ul className="grid grid-cols-2 gap-2">
          {data.lifeAreas.map((area, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-cyan-400">•</span>
              <span className="text-slate-300">{area}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-purple-400 font-medium mb-2">Questions This House Answers:</p>
          <div className="flex flex-wrap gap-2">
            {data.questions.map((q, i) => (
              <span key={i} className="px-3 py-1 bg-purple-500/10 text-purple-300 rounded text-sm">
                {q}
              </span>
            ))}
          </div>
        </div>
      </CollapsibleSection>

      {/* Who Can Rule This House */}
      <CollapsibleSection title="Who Can Rule This House?" icon="👑">
        <p className="text-slate-300 mb-4">
          Any sign can be on the {ordinal(houseNum)} house cusp — it depends on your Ascendant.
          Here's how each ruler changes the flavor:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(SIGN_RULERS).map(([sign, sr]) => (
            <div key={sign} className="flex items-center gap-2 p-2 bg-slate-800/50 rounded text-sm">
              <span className="text-lg">{sr.symbol}</span>
              <span className="text-slate-300">{sign}</span>
              <span className="text-slate-500">→</span>
              <span className="text-purple-400">{sr.ruler}</span>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Planets in This House */}
      <CollapsibleSection title="Planets in This House" icon="🪐" defaultOpen={houseNum === 1}>
        <p className="text-slate-300 mb-4">
          When planets occupy House {houseNum}, they bring their energy to {data.subtitle.toLowerCase()}:
        </p>
        {houseNum === 1 && (
          <p className="text-cyan-400 text-sm mb-4 bg-cyan-500/10 p-3 rounded-lg border border-cyan-500/20">
            💡 Click any planet below to expand and learn the full educational content including characteristics, challenges, gifts, and zone variations.
          </p>
        )}
        <div className="space-y-3">
          {/* Personal Planets */}
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 mt-4">Personal Planets</div>
          <PlanetCard planetKey="sun" houseNum={houseNum} />
          <PlanetCard planetKey="moon" houseNum={houseNum} />
          <PlanetCard planetKey="mercury" houseNum={houseNum} />
          <PlanetCard planetKey="venus" houseNum={houseNum} />
          <PlanetCard planetKey="mars" houseNum={houseNum} />

          {/* Social Planets */}
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 mt-6">Social Planets</div>
          <PlanetCard planetKey="jupiter" houseNum={houseNum} />
          <PlanetCard planetKey="saturn" houseNum={houseNum} />

          {/* Transpersonal Planets */}
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 mt-6">Transpersonal Planets</div>
          <PlanetCard planetKey="uranus" houseNum={houseNum} />
          <PlanetCard planetKey="neptune" houseNum={houseNum} />
          <PlanetCard planetKey="pluto" houseNum={houseNum} />

          {/* Lunar Nodes */}
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 mt-6">Lunar Nodes (Karmic Axis)</div>
          <PlanetCard planetKey="northNode" houseNum={houseNum} />
          <PlanetCard planetKey="southNode" houseNum={houseNum} />
        </div>
      </CollapsibleSection>

      {/* How to Read This House */}
      <CollapsibleSection title="How to Read This House" icon="📖">
        <ol className="space-y-3 text-sm">
          <li className="flex gap-3">
            <span className="text-cyan-400 font-bold">1.</span>
            <span className="text-slate-300">Check the sign on the {ordinal(houseNum)} house cusp — this is the FLAVOR</span>
          </li>
          <li className="flex gap-3">
            <span className="text-cyan-400 font-bold">2.</span>
            <span className="text-slate-300">Find that sign's ruler — this planet MANAGES House {houseNum}</span>
          </li>
          <li className="flex gap-3">
            <span className="text-cyan-400 font-bold">3.</span>
            <span className="text-slate-300">See which house the ruler occupies — this CONNECTS life areas</span>
          </li>
          <li className="flex gap-3">
            <span className="text-cyan-400 font-bold">4.</span>
            <span className="text-slate-300">Note any planets IN House {houseNum} — these ADD specific energies</span>
          </li>
          <li className="flex gap-3">
            <span className="text-cyan-400 font-bold">5.</span>
            <span className="text-slate-300">Check aspects to the ruler — these MODIFY how it operates</span>
          </li>
          <li className="flex gap-3">
            <span className="text-cyan-400 font-bold">6.</span>
            <span className="text-slate-300">Synthesize the story — WHAT (planets) + HOW (signs) + WHERE (houses)</span>
          </li>
        </ol>
      </CollapsibleSection>
    </div>
  );
};

// Planet Card Component - Expandable educational content
export const PlanetCard: React.FC<{ planetKey: string; houseNum: number }> = ({ planetKey, houseNum }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // For now, only House 1 has full content
  const content = houseNum === 1 ? PLANETS_IN_HOUSE_1[planetKey] : null;

  if (!content) {
    // Fallback for houses 2-12 (simple display until content is added)
    const basicPlanets: Record<string, { symbol: string; name: string }> = {
      sun: { symbol: '☉', name: 'Sun' },
      moon: { symbol: '☽', name: 'Moon' },
      mercury: { symbol: '☿', name: 'Mercury' },
      venus: { symbol: '♀', name: 'Venus' },
      mars: { symbol: '♂', name: 'Mars' },
      jupiter: { symbol: '♃', name: 'Jupiter' },
      saturn: { symbol: '♄', name: 'Saturn' },
      uranus: { symbol: '♅', name: 'Uranus' },
      neptune: { symbol: '♆', name: 'Neptune' },
      pluto: { symbol: '♇', name: 'Pluto' },
      northNode: { symbol: '☊', name: 'North Node' },
      southNode: { symbol: '☋', name: 'South Node' },
    };
    const basic = basicPlanets[planetKey];
    if (!basic) return null;

    return (
      <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700">
        <span className="text-2xl w-10 text-center">{basic.symbol}</span>
        <span className="text-purple-400 font-medium">{basic.name}</span>
        <span className="text-slate-400 text-sm">in House {houseNum}</span>
      </div>
    );
  }

  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-800/20">
      {/* Clickable Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{content.symbol}</span>
          <div>
            <span className="text-cyan-400 font-bold">{content.name} in House 1</span>
            <span className="text-slate-400 mx-2">—</span>
            <span className="text-amber-400 italic">"{content.archetype}"</span>
          </div>
        </div>
        <span className="text-slate-400 text-xl">{isExpanded ? '▲' : '▼'}</span>
      </button>

      {/* Quick Summary - Always Visible */}
      <div className="px-4 pb-3 text-slate-300 text-sm border-t border-slate-700/50 pt-3">
        {content.quickSummary}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-slate-700 p-4 space-y-5 bg-slate-900/30">

          {/* 5W+H+Emotion Framework */}
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
            <h4 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
              <span>📋</span> 5W+H+EMOTION Framework
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div><span className="text-yellow-400 font-medium">WHO:</span> <span className="text-slate-300">{content.fiveW.who}</span></div>
              <div><span className="text-yellow-400 font-medium">WHAT:</span> <span className="text-slate-300">{content.fiveW.what}</span></div>
              <div><span className="text-yellow-400 font-medium">WHEN:</span> <span className="text-slate-300">{content.fiveW.when}</span></div>
              <div><span className="text-yellow-400 font-medium">WHERE:</span> <span className="text-slate-300">{content.fiveW.where}</span></div>
              <div className="md:col-span-2"><span className="text-yellow-400 font-medium">WHY:</span> <span className="text-slate-300">{content.fiveW.why}</span></div>
              <div className="md:col-span-2"><span className="text-yellow-400 font-medium">HOW:</span> <span className="text-slate-300">{content.fiveW.how}</span></div>
              <div className="md:col-span-2"><span className="text-amber-400 font-medium">EMOTION:</span> <span className="text-amber-300 italic">{content.fiveW.emotion}</span></div>
            </div>
          </div>

          {/* Characteristics */}
          <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
            <h4 className="text-green-400 font-bold mb-3 flex items-center gap-2">
              <span>✓</span> CHARACTERISTICS
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm">
              {content.characteristics.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Challenges */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
            <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2">
              <span>⚠</span> CHALLENGES
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm">
              {content.challenges.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Gifts */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
            <h4 className="text-amber-400 font-bold mb-3 flex items-center gap-2">
              <span>⭐</span> GIFTS
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm">
              {content.gifts.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">•</span>
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Real-World Example */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
              <span>💡</span> REAL-WORLD EXAMPLE
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">{content.realWorldExample}</p>
          </div>

          {/* Zone Variations */}
          <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
            <h4 className="text-purple-400 font-bold mb-3 flex items-center gap-2">
              <span>🎯</span> ZONE VARIATIONS
            </h4>
            <div className="space-y-3 text-sm">
              <div className="bg-slate-800/50 p-3 rounded">
                <div className="text-purple-300 font-medium mb-1">{content.zoneVariations.beginning.title}</div>
                <p className="text-slate-400 mb-1">{content.zoneVariations.beginning.description}</p>
                <p className="text-purple-400 italic">{content.zoneVariations.beginning.emotion}</p>
              </div>
              <div className="bg-slate-800/50 p-3 rounded">
                <div className="text-purple-300 font-medium mb-1">{content.zoneVariations.core.title}</div>
                <p className="text-slate-400 mb-1">{content.zoneVariations.core.description}</p>
                <p className="text-purple-400 italic">{content.zoneVariations.core.emotion}</p>
              </div>
              <div className="bg-slate-800/50 p-3 rounded">
                <div className="text-purple-300 font-medium mb-1">{content.zoneVariations.transition.title}</div>
                <p className="text-slate-400 mb-1">{content.zoneVariations.transition.description}</p>
                <p className="text-purple-400 italic">{content.zoneVariations.transition.emotion}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
