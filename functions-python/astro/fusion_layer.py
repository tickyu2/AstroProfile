"""
Western-Vedic Fusion Layer

Fuses Western astrology calculations with Vedic astrology to create:
- Composite Temperament (element + guna blending)
- Composite Polarity (yin/yang + vedic balance)
- Unified personality profile
"""

from typing import Dict, List, Optional

# =============================================================================
# TEMPERAMENT FUSION CONSTANTS
# =============================================================================

# Element-Guna correspondence weights
ELEMENT_GUNA_AFFINITY = {
    # Fire elements align with Rajas (action, passion)
    ("Fire", "Rajas"): 0.9,
    ("Fire", "Sattva"): 0.5,
    ("Fire", "Tamas"): 0.2,
    # Earth elements align with Tamas (stability, inertia)
    ("Earth", "Tamas"): 0.8,
    ("Earth", "Rajas"): 0.4,
    ("Earth", "Sattva"): 0.3,
    # Air elements align with Sattva (intellect, purity)
    ("Air", "Sattva"): 0.85,
    ("Air", "Rajas"): 0.5,
    ("Air", "Tamas"): 0.2,
    # Water elements align with both Sattva and Tamas
    ("Water", "Sattva"): 0.7,
    ("Water", "Tamas"): 0.6,
    ("Water", "Rajas"): 0.3,
}

# Element-Dosha correspondence weights
ELEMENT_DOSHA_AFFINITY = {
    # Fire -> Pitta (heat, transformation)
    ("Fire", "Pitta"): 0.95,
    ("Fire", "Vata"): 0.3,
    ("Fire", "Kapha"): 0.1,
    # Earth -> Kapha (stability, structure)
    ("Earth", "Kapha"): 0.9,
    ("Earth", "Vata"): 0.2,
    ("Earth", "Pitta"): 0.2,
    # Air -> Vata (movement, change)
    ("Air", "Vata"): 0.95,
    ("Air", "Pitta"): 0.3,
    ("Air", "Kapha"): 0.1,
    # Water -> Kapha (with some Pitta)
    ("Water", "Kapha"): 0.7,
    ("Water", "Pitta"): 0.5,
    ("Water", "Vata"): 0.2,
}

# Modality-Guna correspondence
MODALITY_GUNA_AFFINITY = {
    ("Cardinal", "Rajas"): 0.9,
    ("Cardinal", "Sattva"): 0.4,
    ("Cardinal", "Tamas"): 0.2,
    ("Fixed", "Tamas"): 0.8,
    ("Fixed", "Sattva"): 0.4,
    ("Fixed", "Rajas"): 0.3,
    ("Mutable", "Sattva"): 0.7,
    ("Mutable", "Rajas"): 0.5,
    ("Mutable", "Tamas"): 0.3,
}

# Composite temperament archetypes
TEMPERAMENT_ARCHETYPES = {
    ("Fire", "Rajas"): {
        "name": "The Warrior",
        "description": "Dynamic action, passionate leadership, competitive drive",
        "keywords": ["action", "passion", "leadership", "courage", "initiative"]
    },
    ("Fire", "Sattva"): {
        "name": "The Visionary",
        "description": "Inspired action, spiritual leadership, enlightened will",
        "keywords": ["vision", "inspiration", "purpose", "guidance", "light"]
    },
    ("Fire", "Tamas"): {
        "name": "The Smoldering Ember",
        "description": "Suppressed passion, controlled intensity, hidden fire",
        "keywords": ["control", "restraint", "hidden power", "patience"]
    },
    ("Earth", "Tamas"): {
        "name": "The Mountain",
        "description": "Immovable stability, patient endurance, material mastery",
        "keywords": ["stability", "endurance", "patience", "material", "foundation"]
    },
    ("Earth", "Rajas"): {
        "name": "The Builder",
        "description": "Productive action, material creation, practical ambition",
        "keywords": ["building", "creation", "ambition", "productivity", "results"]
    },
    ("Earth", "Sattva"): {
        "name": "The Gardener",
        "description": "Nurturing growth, patient cultivation, harmonious manifestation",
        "keywords": ["nurturing", "growth", "cultivation", "harmony", "stewardship"]
    },
    ("Air", "Sattva"): {
        "name": "The Philosopher",
        "description": "Pure intellect, wisdom seeking, elevated thought",
        "keywords": ["wisdom", "intellect", "clarity", "truth", "understanding"]
    },
    ("Air", "Rajas"): {
        "name": "The Communicator",
        "description": "Active mind, social engagement, intellectual pursuit",
        "keywords": ["communication", "networking", "learning", "debate", "exchange"]
    },
    ("Air", "Tamas"): {
        "name": "The Dreamer",
        "description": "Detached thought, fantasy, mental wandering",
        "keywords": ["fantasy", "detachment", "abstraction", "distance", "observation"]
    },
    ("Water", "Sattva"): {
        "name": "The Mystic",
        "description": "Deep intuition, spiritual emotion, compassionate wisdom",
        "keywords": ["intuition", "spirituality", "compassion", "depth", "healing"]
    },
    ("Water", "Tamas"): {
        "name": "The Depths",
        "description": "Emotional inertia, deep feeling, absorbing nature",
        "keywords": ["absorption", "depth", "feeling", "memory", "holding"]
    },
    ("Water", "Rajas"): {
        "name": "The Healer",
        "description": "Active emotion, nurturing action, protective care",
        "keywords": ["healing", "nurturing", "protection", "care", "emotion"]
    },
}


# =============================================================================
# TEMPERAMENT FUSION
# =============================================================================

def fuse_temperament(western_profile: Dict, vedic_profile: Dict) -> Dict:
    """
    Fuse Western element/modality with Vedic guna/dosha.

    Returns composite temperament with:
    - Blended element-guna type
    - Resonance score
    - Temperament archetype
    """
    # Extract Western data
    dominant_element = western_profile.get("dominantElement", "Fire")
    element_ratios = western_profile.get("elementRatios", {})
    dominant_modality = western_profile.get("dominantModality", "Cardinal")

    # Extract Vedic data
    dominant_guna = vedic_profile.get("dominantGuna", "Sattva")
    guna_scores = vedic_profile.get("gunaScores", {})
    dominant_dosha = vedic_profile.get("dominantDosha", "Vata")

    # Calculate element-guna resonance
    eg_key = (dominant_element, dominant_guna)
    element_guna_resonance = ELEMENT_GUNA_AFFINITY.get(eg_key, 0.5)

    # Calculate element-dosha resonance
    ed_key = (dominant_element, dominant_dosha)
    element_dosha_resonance = ELEMENT_DOSHA_AFFINITY.get(ed_key, 0.5)

    # Calculate modality-guna resonance
    mg_key = (dominant_modality, dominant_guna)
    modality_guna_resonance = MODALITY_GUNA_AFFINITY.get(mg_key, 0.5)

    # Combined resonance (weighted average)
    combined_resonance = (
        element_guna_resonance * 0.4 +
        element_dosha_resonance * 0.35 +
        modality_guna_resonance * 0.25
    )

    # Determine temperament archetype
    archetype_key = (dominant_element, dominant_guna)
    archetype = TEMPERAMENT_ARCHETYPES.get(archetype_key, {
        "name": "The Seeker",
        "description": "Balanced blend of multiple energies",
        "keywords": ["balance", "integration", "seeking", "growth"]
    })

    # Generate narrative
    if combined_resonance >= 0.75:
        harmony_level = "highly harmonious"
        harmony_desc = "Your Western and Vedic signatures resonate powerfully together."
    elif combined_resonance >= 0.5:
        harmony_level = "moderately aligned"
        harmony_desc = "Your Western and Vedic signatures complement each other with some creative tension."
    else:
        harmony_level = "creatively tensioned"
        harmony_desc = "Your Western and Vedic signatures create dynamic interplay requiring conscious integration."

    narrative = (
        f"Your {dominant_element} element nature blends with {dominant_guna} guna energy, "
        f"creating a {harmony_level} temperament. {harmony_desc} "
        f"As '{archetype['name']}', you express: {archetype['description']}."
    )

    return {
        "westernElement": dominant_element,
        "westernModality": dominant_modality,
        "vedicGuna": dominant_guna,
        "vedicDosha": dominant_dosha,
        "elementGunaResonance": round(element_guna_resonance, 3),
        "elementDoshaResonance": round(element_dosha_resonance, 3),
        "modalityGunaResonance": round(modality_guna_resonance, 3),
        "combinedResonance": round(combined_resonance, 3),
        "harmonyLevel": harmony_level,
        "archetype": archetype["name"],
        "archetypeDescription": archetype["description"],
        "archetypeKeywords": archetype["keywords"],
        "narrative": narrative
    }


# =============================================================================
# POLARITY FUSION
# =============================================================================

def fuse_polarity(western_profile: Dict, vedic_profile: Dict) -> Dict:
    """
    Fuse Western yin/yang with Vedic balance indicators.

    Creates unified polarity assessment.
    """
    # Western yin/yang
    western_yinyang = western_profile.get("yinYangBalance", {})
    yin_pct = western_yinyang.get("yinPercent", 50)
    yang_pct = western_yinyang.get("yangPercent", 50)
    western_dominant = western_yinyang.get("dominant", "balanced")

    # Vedic indicators (guna provides polarity hints)
    vedic_guna = vedic_profile.get("dominantGuna", "Sattva")
    graha_dominance = vedic_profile.get("grahaDominance", {})

    # Map guna to yin/yang tendency
    guna_polarity = {
        "Sattva": {"yin": 0.5, "yang": 0.5},  # Balanced
        "Rajas": {"yin": 0.3, "yang": 0.7},   # Yang-leaning
        "Tamas": {"yin": 0.7, "yang": 0.3},   # Yin-leaning
    }

    vedic_tendency = guna_polarity.get(vedic_guna, {"yin": 0.5, "yang": 0.5})

    # Graha-based adjustments
    # Sun, Mars, Jupiter = Yang; Moon, Venus, Saturn = Yin
    yang_grahas = ["Sun", "Mars", "Jupiter"]
    yin_grahas = ["Moon", "Venus", "Saturn"]

    graha_yang_score = sum(
        graha_dominance.get(g, 0) for g in yang_grahas
    )
    graha_yin_score = sum(
        graha_dominance.get(g, 0) for g in yin_grahas
    )
    graha_total = graha_yang_score + graha_yin_score or 1

    graha_yang_pct = graha_yang_score / graha_total
    graha_yin_pct = graha_yin_score / graha_total

    # Fuse all polarity indicators
    # Western (50%) + Vedic guna (25%) + Graha (25%)
    fused_yang = (
        (yang_pct / 100) * 0.5 +
        vedic_tendency["yang"] * 0.25 +
        graha_yang_pct * 0.25
    )
    fused_yin = 1 - fused_yang

    # Determine fused dominant
    if abs(fused_yang - fused_yin) < 0.1:
        fused_dominant = "balanced"
    elif fused_yang > fused_yin:
        fused_dominant = "yang"
    else:
        fused_dominant = "yin"

    # Generate polarity profile
    polarity_intensity = abs(fused_yang - fused_yin)

    if polarity_intensity < 0.15:
        polarity_type = "Harmonized"
        polarity_desc = "Your energies are remarkably balanced between active and receptive modes."
    elif polarity_intensity < 0.3:
        polarity_type = "Leaning"
        polarity_desc = f"Your energy leans toward {'active, outward' if fused_dominant == 'yang' else 'receptive, inward'} expression."
    else:
        polarity_type = "Pronounced"
        polarity_desc = f"Your energy is strongly {'yang (active, initiating)' if fused_dominant == 'yang' else 'yin (receptive, containing)'}."

    narrative = (
        f"Fusing Western yin/yang ({yin_pct:.0f}%/{yang_pct:.0f}%) with Vedic indicators "
        f"({vedic_guna} guna), your composite polarity is {polarity_type.lower()}. "
        f"{polarity_desc}"
    )

    return {
        "westernYin": round(yin_pct, 1),
        "westernYang": round(yang_pct, 1),
        "vedicGuna": vedic_guna,
        "vedicGunaPolarity": vedic_tendency,
        "grahaYangScore": round(graha_yang_pct * 100, 1),
        "grahaYinScore": round(graha_yin_pct * 100, 1),
        "fusedYin": round(fused_yin * 100, 1),
        "fusedYang": round(fused_yang * 100, 1),
        "fusedDominant": fused_dominant,
        "polarityType": polarity_type,
        "polarityIntensity": round(polarity_intensity, 3),
        "narrative": narrative
    }


# =============================================================================
# COMPLETE FUSION
# =============================================================================

def build_western_vedic_fusion(western_profile: Dict, vedic_profile: Dict) -> Dict:
    """
    Build complete Western-Vedic fusion package.

    Returns composite temperament, polarity, and unified narrative.
    """
    temperament = fuse_temperament(western_profile, vedic_profile)
    polarity = fuse_polarity(western_profile, vedic_profile)

    # Build unified profile
    archetype = temperament.get("archetype", "The Seeker")
    harmony = temperament.get("harmonyLevel", "balanced")
    polarity_type = polarity.get("polarityType", "Harmonized")

    # Overall integration score
    resonance = temperament.get("combinedResonance", 0.5)
    intensity = polarity.get("polarityIntensity", 0.5)

    # Higher resonance + lower intensity = more integrated
    integration_score = (resonance * 0.6 + (1 - intensity) * 0.4)

    if integration_score >= 0.7:
        integration_level = "Highly Integrated"
        integration_desc = "Your Western and Vedic signatures merge seamlessly."
    elif integration_score >= 0.5:
        integration_level = "Moderately Integrated"
        integration_desc = "Your signatures blend with creative complementarity."
    else:
        integration_level = "Dynamic Integration"
        integration_desc = "Your signatures create dynamic tension inviting conscious synthesis."

    overall_narrative = (
        f"As '{archetype}' with {polarity_type.lower()} polarity, your East-West synthesis is "
        f"{integration_level.lower()}. {integration_desc} "
        f"This fusion reveals a personality that blends {temperament.get('westernElement', 'elemental').lower()} "
        f"drive with {temperament.get('vedicGuna', 'gunic').lower()} consciousness."
    )

    return {
        "temperament": temperament,
        "polarity": polarity,
        "integrationScore": round(integration_score, 3),
        "integrationLevel": integration_level,
        "overallNarrative": overall_narrative,
        "fusionArchetype": archetype,
        "fusionKeywords": temperament.get("archetypeKeywords", [])
    }


# =============================================================================
# COUPLE FUSION
# =============================================================================

def build_couple_fusion(
    person_a_western: Dict,
    person_a_vedic: Dict,
    person_b_western: Dict,
    person_b_vedic: Dict
) -> Dict:
    """
    Build fusion profiles for a couple and compare.

    Returns individual fusions plus compatibility assessment.
    """
    fusion_a = build_western_vedic_fusion(person_a_western, person_a_vedic)
    fusion_b = build_western_vedic_fusion(person_b_western, person_b_vedic)

    # Compare archetypes
    archetype_a = fusion_a.get("fusionArchetype", "Unknown")
    archetype_b = fusion_b.get("fusionArchetype", "Unknown")

    # Compare polarities
    polarity_a = fusion_a.get("polarity", {}).get("fusedDominant", "balanced")
    polarity_b = fusion_b.get("polarity", {}).get("fusedDominant", "balanced")

    # Polarity complementarity
    if polarity_a != polarity_b and polarity_a != "balanced" and polarity_b != "balanced":
        polarity_dynamic = "complementary"
        polarity_desc = "Your polarities are opposite, creating magnetic attraction."
    elif polarity_a == polarity_b:
        polarity_dynamic = "similar"
        polarity_desc = "Your polarities align, creating easy understanding."
    else:
        polarity_dynamic = "asymmetric"
        polarity_desc = "One partner is more polarized, creating a dynamic interplay."

    # Integration comparison
    int_a = fusion_a.get("integrationScore", 0.5)
    int_b = fusion_b.get("integrationScore", 0.5)
    integration_gap = abs(int_a - int_b)

    if integration_gap < 0.15:
        integration_match = "matched"
        int_desc = "Both partners have similar East-West integration levels."
    elif integration_gap < 0.3:
        integration_match = "complementary"
        int_desc = "Partners have different but complementary integration styles."
    else:
        integration_match = "divergent"
        int_desc = "Partners have notably different integration approaches."

    couple_narrative = (
        f"Person A embodies '{archetype_a}' while Person B embodies '{archetype_b}'. "
        f"Their polarity dynamic is {polarity_dynamic}: {polarity_desc} "
        f"Their integration styles are {integration_match}: {int_desc}"
    )

    return {
        "personA": fusion_a,
        "personB": fusion_b,
        "archetypeA": archetype_a,
        "archetypeB": archetype_b,
        "polarityDynamic": polarity_dynamic,
        "polarityDescription": polarity_desc,
        "integrationMatch": integration_match,
        "integrationGap": round(integration_gap, 3),
        "coupleNarrative": couple_narrative
    }
