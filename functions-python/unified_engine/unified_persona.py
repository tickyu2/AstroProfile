"""
unified_engine/unified_persona.py

UnifiedPersonaModeler - Derives persona labels and archetypes from unified vectors.

Translates the 90-dimensional unified vector into human-readable persona descriptions:
1. Dominant archetype traits (from Western 16-axis)
2. Element temperament (from both systems)
3. Ten God functional style (from BaZi)
4. Pattern signature (from aspect patterns)
5. Overall persona synthesis

The persona model bridges the mathematical vector space to
meaningful personality descriptions for users.
"""

from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass, field
from enum import Enum

from .unified_expression import (
    UnifiedExpressionVector,
    WESTERN_ARCHETYPE_AXES,
    WESTERN_PATTERNS,
    WESTERN_ELEMENTS,
    BAZI_ELEMENTS,
)
from .bazi_normalization import TEN_GOD_GROUPS


# =============================================================================
# CONSTANTS
# =============================================================================

# Archetype axis interpretations (for high values)
ARCHETYPE_TRAITS = {
    "Initiator": ("Pioneer", "Takes action, starts things"),
    "Stabilizer": ("Anchor", "Provides stability and consistency"),
    "Relational": ("Connector", "Builds bridges between people"),
    "MindCentered": ("Analyst", "Approaches life through thought"),
    "Intuitive": ("Visionary", "Sees beyond the obvious"),
    "Concrete": ("Pragmatist", "Deals with tangible reality"),
    "Expressive": ("Communicator", "Shares ideas and feelings openly"),
    "Transpersonal": ("Mystic", "Connects to larger patterns"),
    "RiskSeeking": ("Adventurer", "Embraces uncertainty and change"),
    "OrderOriented": ("Organizer", "Creates structure and systems"),
    "FluidIdentity": ("Chameleon", "Adapts easily to contexts"),
    "Warm": ("Nurturer", "Radiates emotional warmth"),
    "Direct": ("Asserter", "Communicates straightforwardly"),
    "DepthOriented": ("Investigator", "Seeks underlying truths"),
    "Sustainer": ("Maintainer", "Preserves and protects resources"),
    "BoundaryAware": ("Guardian", "Maintains healthy boundaries"),
}

# Pattern interpretations
PATTERN_PERSONAS = {
    "grand_trine": ("Flow Master", "Natural grace and ease in life"),
    "t_square": ("Tension Alchemist", "Transforms friction into growth"),
    "stellium": ("Focused Specialist", "Concentrated energy in one domain"),
    "yod": ("Destiny Walker", "Called to a specific mission"),
    "kite": ("Directed Flyer", "Flow with purpose and direction"),
    "opposition_chain": ("Paradox Navigator", "Holds opposites together"),
}

# Ten God Group personas
TEN_GOD_PERSONAS = {
    "Performance": ("Identity Champion", "Strong sense of self"),
    "Output": ("Creative Generator", "Produces and expresses"),
    "Wealth": ("Resource Manager", "Attracts and handles wealth"),
    "Authority": ("Status Navigator", "Relates to power structures"),
    "Resource": ("Support Receiver", "Draws on backing and wisdom"),
}

# Element temperament combinations
ELEMENT_TEMPERAMENTS = {
    # Western dominant
    "Fire": ("Passionate", "Dynamic, enthusiastic, inspiring"),
    "Earth": ("Grounded", "Practical, stable, reliable"),
    "Air": ("Intellectual", "Communicative, curious, social"),
    "Water": ("Emotional", "Intuitive, sensitive, deep"),
    # BaZi dominant
    "Wood": ("Growing", "Expansive, creative, benevolent"),
    "Metal": ("Refined", "Precise, principled, discerning"),
}


# =============================================================================
# DATA STRUCTURES
# =============================================================================

@dataclass
class DominantTrait:
    """A dominant personality trait from the unified vector."""
    axis: str
    value: float
    label: str
    description: str
    source: str  # "western" or "bazi"


@dataclass
class ElementProfile:
    """Element temperament profile from both systems."""
    western_dominant: str
    western_value: float
    bazi_dominant: str
    bazi_value: float
    combined_temperament: str
    description: str


@dataclass
class FunctionalStyle:
    """Ten God functional style profile."""
    dominant_group: str
    secondary_group: str
    label: str
    description: str


@dataclass
class PatternProfile:
    """Aspect pattern persona profile."""
    dominant_patterns: List[str]
    signature: str
    description: str


@dataclass
class UnifiedPersona:
    """
    Complete persona model derived from unified expression.

    Translates the vector into human-readable personality description.
    """
    # Core identity
    sign: str  # Western Sun sign
    day_master: str  # BaZi Day Master

    # Dominant traits (top 5)
    dominant_traits: List[DominantTrait]

    # Element temperament
    element_profile: ElementProfile

    # Ten God functional style
    functional_style: FunctionalStyle

    # Pattern signature
    pattern_profile: PatternProfile

    # Synthesized labels
    primary_label: str  # e.g., "Grounded Visionary"
    secondary_label: str  # e.g., "with Flow Master tendencies"

    # Full narrative
    narrative: str

    # Raw scores for reference
    archetype_scores: Dict[str, float]
    pattern_scores: Dict[str, float]
    ten_god_scores: Dict[str, float]

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return {
            "identity": {
                "sign": self.sign,
                "day_master": self.day_master,
                "primary_label": self.primary_label,
                "secondary_label": self.secondary_label,
            },
            "dominant_traits": [
                {
                    "axis": t.axis,
                    "value": round(t.value, 3),
                    "label": t.label,
                    "description": t.description,
                    "source": t.source,
                }
                for t in self.dominant_traits
            ],
            "element_profile": {
                "western_dominant": self.element_profile.western_dominant,
                "western_value": round(self.element_profile.western_value, 3),
                "bazi_dominant": self.element_profile.bazi_dominant,
                "bazi_value": round(self.element_profile.bazi_value, 3),
                "combined_temperament": self.element_profile.combined_temperament,
                "description": self.element_profile.description,
            },
            "functional_style": {
                "dominant_group": self.functional_style.dominant_group,
                "secondary_group": self.functional_style.secondary_group,
                "label": self.functional_style.label,
                "description": self.functional_style.description,
            },
            "pattern_profile": {
                "dominant_patterns": self.pattern_profile.dominant_patterns,
                "signature": self.pattern_profile.signature,
                "description": self.pattern_profile.description,
            },
            "narrative": self.narrative,
            "raw_scores": {
                "archetype": {k: round(v, 3) for k, v in self.archetype_scores.items()},
                "patterns": {k: round(v, 3) for k, v in self.pattern_scores.items()},
                "ten_gods": {k: round(v, 3) for k, v in self.ten_god_scores.items()},
            },
        }


# =============================================================================
# PERSONA MODELER
# =============================================================================

class UnifiedPersonaModeler:
    """
    Modeler that derives persona descriptions from unified vectors.

    Usage:
        modeler = UnifiedPersonaModeler()
        persona = modeler.derive_persona(unified_expression)
    """

    def __init__(
        self,
        dominant_threshold: float = 0.65,
        pattern_threshold: float = 0.30,
    ):
        """
        Initialize the persona modeler.

        Args:
            dominant_threshold: Minimum value to consider a trait dominant
            pattern_threshold: Minimum value to consider a pattern present
        """
        self.dominant_threshold = dominant_threshold
        self.pattern_threshold = pattern_threshold

    def derive_persona(
        self,
        expr: UnifiedExpressionVector,
    ) -> UnifiedPersona:
        """
        Derive complete persona from unified expression.

        Args:
            expr: UnifiedExpressionVector

        Returns:
            UnifiedPersona with full breakdown
        """
        # Extract dominant traits
        dominant_traits = self._extract_dominant_traits(expr)

        # Element profile
        element_profile = self._derive_element_profile(expr)

        # Functional style
        functional_style = self._derive_functional_style(expr)

        # Pattern profile
        pattern_profile = self._derive_pattern_profile(expr)

        # Synthesize labels
        primary_label = self._synthesize_primary_label(
            dominant_traits, element_profile
        )
        secondary_label = self._synthesize_secondary_label(
            functional_style, pattern_profile
        )

        # Generate narrative
        narrative = self._generate_narrative(
            expr, dominant_traits, element_profile, functional_style, pattern_profile
        )

        # Raw scores
        archetype_scores = dict(zip(WESTERN_ARCHETYPE_AXES, expr.archetype))
        pattern_scores = dict(zip(WESTERN_PATTERNS, expr.patterns))
        ten_god_scores = dict(zip(TEN_GOD_GROUPS, expr.ten_god_groups))

        return UnifiedPersona(
            sign=expr.sign,
            day_master=expr.day_master,
            dominant_traits=dominant_traits,
            element_profile=element_profile,
            functional_style=functional_style,
            pattern_profile=pattern_profile,
            primary_label=primary_label,
            secondary_label=secondary_label,
            narrative=narrative,
            archetype_scores=archetype_scores,
            pattern_scores=pattern_scores,
            ten_god_scores=ten_god_scores,
        )

    def _extract_dominant_traits(
        self,
        expr: UnifiedExpressionVector,
    ) -> List[DominantTrait]:
        """Extract top dominant traits from archetype vector."""
        traits = []

        # Western archetype traits
        for i, axis in enumerate(WESTERN_ARCHETYPE_AXES):
            if i < len(expr.archetype):
                value = expr.archetype[i]
                if value >= self.dominant_threshold:
                    label, desc = ARCHETYPE_TRAITS.get(axis, (axis, ""))
                    traits.append(DominantTrait(
                        axis=axis,
                        value=value,
                        label=label,
                        description=desc,
                        source="western",
                    ))

        # Sort by value and take top 5
        traits.sort(key=lambda t: t.value, reverse=True)
        return traits[:5]

    def _derive_element_profile(
        self,
        expr: UnifiedExpressionVector,
    ) -> ElementProfile:
        """Derive element temperament profile from both systems."""
        # Western elements
        western_elements = dict(zip(WESTERN_ELEMENTS, expr.western_elements))
        western_dom = max(western_elements, key=western_elements.get)
        western_val = western_elements[western_dom]

        # BaZi elements
        bazi_elements = dict(zip(BAZI_ELEMENTS, expr.bazi_elements))
        bazi_dom = max(bazi_elements, key=bazi_elements.get)
        bazi_val = bazi_elements[bazi_dom]

        # Combine
        combined = self._combine_element_temperaments(western_dom, bazi_dom)

        # Get descriptions
        west_temp = ELEMENT_TEMPERAMENTS.get(western_dom, (western_dom, ""))
        bazi_temp = ELEMENT_TEMPERAMENTS.get(bazi_dom, (bazi_dom, ""))
        desc = f"{west_temp[1]}. {bazi_temp[1]}."

        return ElementProfile(
            western_dominant=western_dom,
            western_value=western_val,
            bazi_dominant=bazi_dom,
            bazi_value=bazi_val,
            combined_temperament=combined,
            description=desc,
        )

    def _combine_element_temperaments(
        self,
        western: str,
        bazi: str,
    ) -> str:
        """Combine Western and BaZi element dominants into temperament label."""
        # Element synergy combinations
        synergies = {
            ("Fire", "Fire"): "Blazing Passion",
            ("Fire", "Wood"): "Creative Flame",
            ("Fire", "Earth"): "Steady Fire",
            ("Fire", "Metal"): "Forged Will",
            ("Fire", "Water"): "Steam Power",
            ("Earth", "Earth"): "Solid Foundation",
            ("Earth", "Wood"): "Growing Stability",
            ("Earth", "Fire"): "Warm Ground",
            ("Earth", "Metal"): "Refined Structure",
            ("Earth", "Water"): "Fertile Depth",
            ("Air", "Wood"): "Idea Generator",
            ("Air", "Fire"): "Inspired Mind",
            ("Air", "Metal"): "Sharp Thinker",
            ("Air", "Water"): "Fluid Intelligence",
            ("Air", "Earth"): "Practical Mind",
            ("Water", "Water"): "Deep Current",
            ("Water", "Wood"): "Flowing Growth",
            ("Water", "Fire"): "Emotional Intensity",
            ("Water", "Metal"): "Clear Depth",
            ("Water", "Earth"): "Grounded Intuition",
        }

        return synergies.get((western, bazi), f"{western}-{bazi} Blend")

    def _derive_functional_style(
        self,
        expr: UnifiedExpressionVector,
    ) -> FunctionalStyle:
        """Derive Ten God functional style from BaZi components."""
        group_scores = dict(zip(TEN_GOD_GROUPS, expr.ten_god_groups))

        # Sort by score
        sorted_groups = sorted(group_scores.items(), key=lambda x: x[1], reverse=True)
        dominant = sorted_groups[0][0] if sorted_groups else "Performance"
        secondary = sorted_groups[1][0] if len(sorted_groups) > 1 else "Performance"

        label, desc = TEN_GOD_PERSONAS.get(dominant, (dominant, ""))

        return FunctionalStyle(
            dominant_group=dominant,
            secondary_group=secondary,
            label=label,
            description=desc,
        )

    def _derive_pattern_profile(
        self,
        expr: UnifiedExpressionVector,
    ) -> PatternProfile:
        """Derive pattern signature from aspect patterns."""
        pattern_scores = dict(zip(WESTERN_PATTERNS, expr.patterns))

        # Find dominant patterns
        dominant = [
            p for p, v in pattern_scores.items()
            if v >= self.pattern_threshold
        ]

        # Sort by strength
        dominant.sort(key=lambda p: pattern_scores.get(p, 0), reverse=True)
        dominant = dominant[:2]  # Top 2

        # Generate signature
        if dominant:
            labels = [PATTERN_PERSONAS.get(p, (p, ""))[0] for p in dominant]
            signature = " + ".join(labels)
            descriptions = [PATTERN_PERSONAS.get(p, (p, ""))[1] for p in dominant]
            desc = " | ".join(descriptions)
        else:
            signature = "Balanced Pattern"
            desc = "No dominant aspect patterns - balanced energy distribution"

        return PatternProfile(
            dominant_patterns=dominant,
            signature=signature,
            description=desc,
        )

    def _synthesize_primary_label(
        self,
        traits: List[DominantTrait],
        elements: ElementProfile,
    ) -> str:
        """Synthesize primary persona label from traits and elements."""
        if not traits:
            return elements.combined_temperament

        # Top trait label + element quality
        top_trait = traits[0].label if traits else "Explorer"
        element_adj = ELEMENT_TEMPERAMENTS.get(
            elements.western_dominant, (elements.western_dominant, "")
        )[0]

        return f"{element_adj} {top_trait}"

    def _synthesize_secondary_label(
        self,
        functional: FunctionalStyle,
        patterns: PatternProfile,
    ) -> str:
        """Synthesize secondary persona label from function and patterns."""
        parts = []

        if functional.label:
            parts.append(f"with {functional.label} function")

        if patterns.dominant_patterns:
            parts.append(f"and {patterns.signature} energy")

        return " ".join(parts) if parts else "with balanced expression"

    def _generate_narrative(
        self,
        expr: UnifiedExpressionVector,
        traits: List[DominantTrait],
        elements: ElementProfile,
        functional: FunctionalStyle,
        patterns: PatternProfile,
    ) -> str:
        """Generate full persona narrative."""
        parts = []

        # Opening with sign/day master
        if expr.sign and expr.day_master:
            parts.append(f"A {expr.sign} with {expr.day_master} Day Master.")
        elif expr.sign:
            parts.append(f"A {expr.sign}.")
        elif expr.day_master:
            parts.append(f"A {expr.day_master} Day Master.")

        # Element temperament
        parts.append(f"Core temperament: {elements.combined_temperament}.")
        parts.append(elements.description)

        # Dominant traits
        if traits:
            trait_labels = [t.label for t in traits[:3]]
            parts.append(f"Dominant expressions: {', '.join(trait_labels)}.")

        # Functional style
        parts.append(f"Functional style: {functional.label} - {functional.description}.")

        # Pattern signature
        if patterns.dominant_patterns:
            parts.append(f"Pattern signature: {patterns.signature}.")
            parts.append(patterns.description)

        return " ".join(parts)


# =============================================================================
# CONVENIENCE FUNCTIONS
# =============================================================================

def derive_persona(
    expr: UnifiedExpressionVector,
    dominant_threshold: float = 0.65,
) -> UnifiedPersona:
    """
    Convenience function to derive persona from unified expression.

    Args:
        expr: UnifiedExpressionVector
        dominant_threshold: Threshold for dominant trait detection

    Returns:
        UnifiedPersona
    """
    modeler = UnifiedPersonaModeler(dominant_threshold=dominant_threshold)
    return modeler.derive_persona(expr)


def quick_persona_label(expr: UnifiedExpressionVector) -> str:
    """
    Get quick persona label without full breakdown.

    Args:
        expr: UnifiedExpressionVector

    Returns:
        Combined primary + secondary label
    """
    persona = derive_persona(expr)
    return f"{persona.primary_label} {persona.secondary_label}"


# =============================================================================
# EXPORTS
# =============================================================================

__all__ = [
    # Main classes
    "UnifiedPersonaModeler",
    "UnifiedPersona",

    # Supporting types
    "DominantTrait",
    "ElementProfile",
    "FunctionalStyle",
    "PatternProfile",

    # Convenience functions
    "derive_persona",
    "quick_persona_label",

    # Constants
    "ARCHETYPE_TRAITS",
    "PATTERN_PERSONAS",
    "TEN_GOD_PERSONAS",
    "ELEMENT_TEMPERAMENTS",
]
