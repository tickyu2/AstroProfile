"""
western_engine/pattern_interpretation.py

Mythic and psychological interpretation layer for aspect pattern strengths.

Translates raw PatternStrengths (0.0-1.0 floats) into archetypal meaning.
This is the L2 explainability layer - the bridge between computation and wisdom.
"""

from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple
from .models import PatternStrengths


# =============================================================================
# PATTERN INTERPRETATION THRESHOLDS
# =============================================================================

STRENGTH_THRESHOLDS = {
    'dominant': 0.70,   # Pattern dominates the chart
    'strong': 0.50,     # Clear presence with influence
    'moderate': 0.30,   # Notable but not central
    'subtle': 0.15,     # Present as undertone
    'absent': 0.0,      # Not present
}


def strength_level(value: float) -> str:
    """Classify strength into qualitative level."""
    if value >= STRENGTH_THRESHOLDS['dominant']:
        return 'dominant'
    elif value >= STRENGTH_THRESHOLDS['strong']:
        return 'strong'
    elif value >= STRENGTH_THRESHOLDS['moderate']:
        return 'moderate'
    elif value >= STRENGTH_THRESHOLDS['subtle']:
        return 'subtle'
    return 'absent'


# =============================================================================
# PATTERN ARCHETYPES
# =============================================================================

PATTERN_ARCHETYPES = {
    'grand_trine': {
        'name': 'The Hidden River',
        'symbol': 'A triangle of flow',
        'gift': 'natural coherence, channels that just work',
        'shadow': 'complacency, taking gifts for granted',
        'dominant': (
            "Life gives channels where things flow effortlessly in the native element. "
            "Not a lottery win - a well-built irrigation system. Once the gate opens, "
            "the water knows where to go. Native talent for coherence - ideas, people, "
            "and projects fall into pattern when commitment is made."
        ),
        'strong': (
            "A built-in current, a river that remembers its path even when the map is forgotten. "
            "Talents flow naturally in certain domains, creating ease where others struggle."
        ),
        'moderate': (
            "Occasional moments of effortless flow - glimpses of the hidden river. "
            "The talent is there but must be consciously cultivated."
        ),
        'subtle': (
            "A faint echo of natural harmony - rare moments when everything clicks. "
            "The river exists but runs underground."
        ),
        'mythic': (
            "The cathedral's water system - ancient channels carved into stone "
            "that still carry life-giving flow to every corner."
        ),
    },

    't_square': {
        'name': 'The Sacred Friction',
        'symbol': 'The anvil and hammer',
        'gift': 'drive, refinement, mastery through challenge',
        'shadow': 'restlessness, inability to rest in completion',
        'dominant': (
            "Certain axes never fully relax - they keep the soul moving, refining, iterating. "
            "The part that can't just enjoy ease; it wants to test the structure, push edges. "
            "Mastery comes from engineering around the permanent tension."
        ),
        'strong': (
            "The cathedral is not built on flat land - there's a slope and a crack. "
            "This is where mastery comes from: the constant creative response to challenge."
        ),
        'moderate': (
            "Enough friction to prevent stagnation without overwhelming. "
            "A productive tension that generates forward motion."
        ),
        'subtle': (
            "Occasional sharp edges that demand attention - reminders that "
            "growth requires some resistance."
        ),
        'mythic': (
            "The blacksmith's forge within the cathedral - where raw material "
            "meets fire and becomes form through sacred pressure."
        ),
    },

    'stellium': {
        'name': 'The Chamber of Echoes',
        'symbol': 'Many voices singing one note',
        'gift': 'concentrated power, singular focus, vocational intensity',
        'shadow': 'obsession, inability to diversify, blind spots',
        'dominant': (
            "One chamber of life is over-lit. Work, craft, or service becomes "
            "a central altar - not just doing things, but consecrating them. "
            "A core theme reappears in different costumes: teaching, building, guiding."
        ),
        'strong': (
            "Many organs playing the same key - different pipes, same note. "
            "The concentrated energy creates an unmistakable signature in life's work."
        ),
        'moderate': (
            "A clear theme emerges when looking at life's pattern - "
            "one area that draws unusual attention and energy."
        ),
        'subtle': (
            "A faint concentration of energy - hints of a life theme "
            "that has not yet fully declared itself."
        ),
        'mythic': (
            "One hall of the cathedral has multiple organs, all tuned to the same frequency. "
            "When they play together, the walls themselves vibrate with the message."
        ),
    },

    'yod': {
        'name': 'The Finger of God',
        'symbol': 'A beam of light on one stone',
        'gift': 'sense of destiny, course corrections, called purpose',
        'shadow': 'feeling fated, unable to choose freely',
        'dominant': (
            "Life feels directed by an invisible hand. Choices that seem free "
            "reveal themselves as part of a larger pattern. The summons is undeniable."
        ),
        'strong': (
            "Sharp course corrections that can't be ignored - moments where life says "
            "'No, not that corridor - this one.' The pointing is clear."
        ),
        'moderate': (
            "Occasional redirections that feel significant in retrospect - "
            "as if something knows the way even when consciousness doesn't."
        ),
        'subtle': (
            "A quiet but undeniable summons that appears in rare moments. "
            "Somewhere high in the vault, a single beam sometimes lands on a specific stone."
        ),
        'mythic': (
            "The cathedral's clerestory window - angled so precisely that once a year, "
            "at one moment, sunlight illuminates a single inscription on the altar."
        ),
    },

    'kite': {
        'name': 'The Banner That Catches Wind',
        'symbol': 'The trine that learned to fly',
        'gift': 'directed talent, mission, visible purpose',
        'shadow': 'pressure to perform, inability to just be',
        'dominant': (
            "Natural flow is pierced by opposition, giving it direction. "
            "The difference between talent and mission - the opposition acts as a tail "
            "that lets the pattern catch wind. Not just good at things; pulled to aim them."
        ),
        'strong': (
            "The river doesn't just meander - at certain bends it lifts into the air "
            "and becomes a banner. People can see it from far away."
        ),
        'moderate': (
            "Talents occasionally find their target, creating moments "
            "where ease transforms into visible achievement."
        ),
        'subtle': (
            "Glimpses of what the gifts might be for - rare alignments "
            "between natural ability and calling."
        ),
        'mythic': (
            "The cathedral's highest spire catches wind that the lower structures miss, "
            "transforming invisible current into visible movement."
        ),
    },

    'opposition_chain': {
        'name': 'The Corridor of Mirrors',
        'symbol': 'Facing the other face',
        'gift': 'empathy for paradox, holding both/and, translation',
        'shadow': 'paralysis, split identity, endless reflection',
        'dominant': (
            "Pulled perpetually between poles - life is experienced as paradox. "
            "The gift is becoming a translator between worlds, holding what others split."
        ),
        'strong': (
            "Significant experience of opposing forces - security vs risk, "
            "self vs other. Learning to dance rather than choose."
        ),
        'moderate': (
            "A hall of mirrors exists but is a side chamber, not the nave. "
            "Walk it when perspective is needed, not as a prison."
        ),
        'subtle': (
            "Enough experience of polarity to understand paradox without being defined by it. "
            "Can hold 'this and that' without collapsing into 'either/or'."
        ),
        'mythic': (
            "The cathedral's baptistry - where one self is laid down and another rises, "
            "the perpetual practice of dying and being reborn."
        ),
    },
}


# =============================================================================
# INTERPRETATION FUNCTIONS
# =============================================================================

@dataclass
class PatternInterpretation:
    """Full interpretation of a single pattern."""
    pattern_type: str
    strength: float
    level: str
    name: str
    symbol: str
    gift: str
    shadow: str
    description: str
    mythic: str


def interpret_pattern(pattern_type: str, strength: float) -> PatternInterpretation:
    """Generate full interpretation for a single pattern."""
    archetype = PATTERN_ARCHETYPES.get(pattern_type, {})
    level = strength_level(strength)

    # Get level-appropriate description, falling back to next higher level
    description = archetype.get(level)
    if not description:
        for fallback in ['dominant', 'strong', 'moderate', 'subtle']:
            if archetype.get(fallback):
                description = archetype.get(fallback)
                break

    return PatternInterpretation(
        pattern_type=pattern_type,
        strength=strength,
        level=level,
        name=archetype.get('name', pattern_type),
        symbol=archetype.get('symbol', ''),
        gift=archetype.get('gift', ''),
        shadow=archetype.get('shadow', ''),
        description=description or '',
        mythic=archetype.get('mythic', ''),
    )


def interpret_all_patterns(patterns: PatternStrengths) -> Dict[str, PatternInterpretation]:
    """Generate interpretations for all patterns."""
    return {
        'grand_trine': interpret_pattern('grand_trine', patterns.grand_trine),
        't_square': interpret_pattern('t_square', patterns.t_square),
        'stellium': interpret_pattern('stellium', patterns.stellium),
        'yod': interpret_pattern('yod', patterns.yod),
        'kite': interpret_pattern('kite', patterns.kite),
        'opposition_chain': interpret_pattern('opposition_chain', patterns.opposition_chain),
    }


def synthesize_archetype(patterns: PatternStrengths, name: str = "the soul") -> str:
    """
    Synthesize an overall archetypal narrative from pattern combination.

    This is the highest level of interpretation - weaving individual
    patterns into a coherent story.
    """
    interps = interpret_all_patterns(patterns)

    # Find dominant and notable patterns
    dominant = [k for k, v in interps.items() if v.level == 'dominant']
    strong = [k for k, v in interps.items() if v.level == 'strong']
    moderate = [k for k, v in interps.items() if v.level == 'moderate']

    lines = []

    # Opening
    if dominant:
        lines.append(f"In {name}'s chart, the {interps[dominant[0]].name} dominates -")
        lines.append(interps[dominant[0]].description)
        lines.append("")

    # Flow patterns (grand trine, kite)
    flow_patterns = [p for p in ['grand_trine', 'kite'] if patterns.to_dict()[p] > 0.3]
    if flow_patterns:
        lines.append("**The Architecture of Flow:**")
        for p in flow_patterns:
            if interps[p].level != 'absent':
                lines.append(f"- {interps[p].name} ({interps[p].level}): {interps[p].gift}")
        lines.append("")

    # Tension patterns (t_square, opposition_chain)
    tension_patterns = [p for p in ['t_square', 'opposition_chain'] if patterns.to_dict()[p] > 0.15]
    if tension_patterns:
        lines.append("**The Sacred Friction:**")
        for p in tension_patterns:
            if interps[p].level != 'absent':
                lines.append(f"- {interps[p].name} ({interps[p].level}): {interps[p].gift}")
        lines.append("")

    # Concentration patterns (stellium)
    if patterns.stellium > 0.3:
        lines.append("**The Concentrated Fire:**")
        lines.append(f"- {interps['stellium'].name} ({interps['stellium'].level}): {interps['stellium'].gift}")
        lines.append("")

    # Destiny patterns (yod)
    if patterns.yod > 0.1:
        lines.append("**The Pointing:**")
        lines.append(f"- {interps['yod'].name} ({interps['yod'].level}): {interps['yod'].description}")
        lines.append("")

    # Mythic synthesis
    lines.append("**In mythic terms:**")

    # Build synthesis based on pattern combination
    if patterns.grand_trine > 0.5 and patterns.kite > 0.3:
        lines.append(f"{name} is a cathedral engineer of flow - ")
        lines.append("born with rivers already carved into stone,")

    if patterns.stellium > 0.5:
        lines.append("a tower of planets singing one theme,")

    if patterns.kite > 0.4:
        lines.append("a banner that sometimes catches the wind of destiny,")

    if patterns.t_square > 0.2 and patterns.t_square < 0.6:
        lines.append("and just enough sacred friction to keep the whole structure alive and growing.")
    elif patterns.t_square >= 0.6:
        lines.append("with the forge fire always lit, always shaping, never quite finished.")

    return "\n".join(lines)


def generate_pattern_reading(
    patterns: PatternStrengths,
    name: str = "This chart",
    include_mythic: bool = True
) -> str:
    """
    Generate a full pattern reading suitable for display.

    This is the main entry point for interpretive text generation.
    """
    lines = [
        "=" * 60,
        f"  ASPECT PATTERN READING: {name}",
        "=" * 60,
        "",
    ]

    interps = interpret_all_patterns(patterns)

    # Sort by strength
    sorted_patterns = sorted(
        interps.items(),
        key=lambda x: x[1].strength,
        reverse=True
    )

    for pattern_type, interp in sorted_patterns:
        if interp.level == 'absent':
            continue

        strength_bar = "█" * int(interp.strength * 10) + "░" * (10 - int(interp.strength * 10))

        lines.append(f"▸ {interp.name.upper()} ({interp.level})")
        lines.append(f"  Strength: [{strength_bar}] {interp.strength:.2f}")
        lines.append(f"  Symbol: {interp.symbol}")
        lines.append(f"  Gift: {interp.gift}")
        lines.append(f"  Shadow: {interp.shadow}")
        lines.append(f"  ")
        lines.append(f"  {interp.description}")

        if include_mythic:
            lines.append(f"  ")
            lines.append(f"  Mythic: {interp.mythic}")

        lines.append("")
        lines.append("-" * 60)
        lines.append("")

    # Add synthesis
    lines.append("")
    lines.append("SYNTHESIS:")
    lines.append("")
    lines.append(synthesize_archetype(patterns, name))
    lines.append("")
    lines.append("=" * 60)

    return "\n".join(lines)
