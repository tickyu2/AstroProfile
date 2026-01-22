"""
============================================
Luna Brain 7A: Training Data Pipeline (P3)
============================================

P3.1 Bootstrap Dataset Generator
P3.3 Continuous Learning Pipeline

Generates synthetic training data from rule-based system
and manages continuous improvement through user feedback.

Research-Backed:
- Synthetic pre-training improves convergence (Hong et al., 2019)
- Balanced sampling prevents type bias (Başaran & Ejimogu, 2021)
- User feedback loop enables personalization (Suman et al., 2022)

Created: January 8, 2026
Authors: Claude Opus (Implementation), Claude Sonnet (Architecture)
"""

import json
import random
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, asdict
from pathlib import Path

# Try to import torch for tensor operations
try:
    import torch
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False


# ============================================
# Data Structures
# ============================================

@dataclass
class BaZiProfile:
    year_pillar: int      # 0-59 (60 stem+branch combinations)
    month_pillar: int     # 0-59
    day_pillar: int       # 0-59 (most important - 70% weight)
    hour_pillar: int      # 0-59

@dataclass
class EnneagramProfile:
    core: int             # 1-9
    wing: int             # Adjacent to core
    tritype_head: int     # 5, 6, or 7
    tritype_heart: int    # 2, 3, or 4
    tritype_gut: int      # 8, 9, or 1
    instinct_stack: int   # 0-5 (sx/sp/so permutations)
    level: int            # 1-9 (health level)

@dataclass
class MBTIProfile:
    type_code: str        # e.g., "INFJ"
    dominant: int         # 0-7 (cognitive function index)
    auxiliary: int
    tertiary: int
    inferior: int

@dataclass
class WesternProfile:
    sun_sign: int         # 0-11
    moon_sign: int        # 0-11
    rising_sign: int      # 0-11

@dataclass
class NumerologyProfile:
    life_path: int        # 1-33 (includes master numbers)
    expression: int       # 1-33
    soul_urge: int        # 1-33

@dataclass
class ConstitutionalProfile:
    bazi: BaZiProfile
    enneagram: EnneagramProfile
    mbti: MBTIProfile
    western: WesternProfile
    numerology: NumerologyProfile

@dataclass
class TrainingSample:
    id: int
    profile: ConstitutionalProfile
    target_facets: List[float]  # 30 NEO facets
    source: str                  # 'synthetic' or 'user_feedback'
    quality_score: float         # 0-1 confidence
    timestamp: str


# ============================================
# P3.1: Bootstrap Dataset Generator
# ============================================

# MBTI cognitive function stacks
MBTI_FUNCTION_STACKS = {
    'INTJ': {'dominant': 'Ni', 'auxiliary': 'Te', 'tertiary': 'Fi', 'inferior': 'Se'},
    'INTP': {'dominant': 'Ti', 'auxiliary': 'Ne', 'tertiary': 'Si', 'inferior': 'Fe'},
    'ENTJ': {'dominant': 'Te', 'auxiliary': 'Ni', 'tertiary': 'Se', 'inferior': 'Fi'},
    'ENTP': {'dominant': 'Ne', 'auxiliary': 'Ti', 'tertiary': 'Fe', 'inferior': 'Si'},
    'INFJ': {'dominant': 'Ni', 'auxiliary': 'Fe', 'tertiary': 'Ti', 'inferior': 'Se'},
    'INFP': {'dominant': 'Fi', 'auxiliary': 'Ne', 'tertiary': 'Si', 'inferior': 'Te'},
    'ENFJ': {'dominant': 'Fe', 'auxiliary': 'Ni', 'tertiary': 'Se', 'inferior': 'Ti'},
    'ENFP': {'dominant': 'Ne', 'auxiliary': 'Fi', 'tertiary': 'Te', 'inferior': 'Si'},
    'ISTJ': {'dominant': 'Si', 'auxiliary': 'Te', 'tertiary': 'Fi', 'inferior': 'Ne'},
    'ISFJ': {'dominant': 'Si', 'auxiliary': 'Fe', 'tertiary': 'Ti', 'inferior': 'Ne'},
    'ESTJ': {'dominant': 'Te', 'auxiliary': 'Si', 'tertiary': 'Ne', 'inferior': 'Fi'},
    'ESFJ': {'dominant': 'Fe', 'auxiliary': 'Si', 'tertiary': 'Ne', 'inferior': 'Ti'},
    'ISTP': {'dominant': 'Ti', 'auxiliary': 'Se', 'tertiary': 'Ni', 'inferior': 'Fe'},
    'ISFP': {'dominant': 'Fi', 'auxiliary': 'Se', 'tertiary': 'Ni', 'inferior': 'Te'},
    'ESTP': {'dominant': 'Se', 'auxiliary': 'Ti', 'tertiary': 'Fe', 'inferior': 'Ni'},
    'ESFP': {'dominant': 'Se', 'auxiliary': 'Fi', 'tertiary': 'Te', 'inferior': 'Ni'},
}

COGNITIVE_FUNCTION_MAP = {
    'Ni': 0, 'Ne': 1, 'Si': 2, 'Se': 3,
    'Fi': 4, 'Fe': 5, 'Ti': 6, 'Te': 7
}

INSTINCT_STACKS = ['sx/sp/so', 'sx/so/sp', 'sp/sx/so', 'sp/so/sx', 'so/sx/sp', 'so/sp/sx']


def sample_random_bazi() -> BaZiProfile:
    """Sample random BaZi four pillars."""
    return BaZiProfile(
        year_pillar=random.randint(0, 59),
        month_pillar=random.randint(0, 59),
        day_pillar=random.randint(0, 59),
        hour_pillar=random.randint(0, 59)
    )


def sample_random_enneagram() -> EnneagramProfile:
    """Sample random Enneagram configuration with valid wing."""
    core = random.randint(1, 9)

    # Wing must be adjacent to core
    if core == 1:
        wing = random.choice([9, 2])
    elif core == 9:
        wing = random.choice([8, 1])
    else:
        wing = random.choice([core - 1, core + 1])

    # Tritype: one from each center
    tritype_head = random.choice([5, 6, 7])
    tritype_heart = random.choice([2, 3, 4])
    tritype_gut = random.choice([8, 9, 1])

    return EnneagramProfile(
        core=core,
        wing=wing,
        tritype_head=tritype_head,
        tritype_heart=tritype_heart,
        tritype_gut=tritype_gut,
        instinct_stack=random.randint(0, 5),
        level=random.randint(1, 9)
    )


def sample_random_mbti() -> MBTIProfile:
    """Sample random MBTI type with cognitive function stack."""
    type_code = random.choice(list(MBTI_FUNCTION_STACKS.keys()))
    stack = MBTI_FUNCTION_STACKS[type_code]

    return MBTIProfile(
        type_code=type_code,
        dominant=COGNITIVE_FUNCTION_MAP[stack['dominant']],
        auxiliary=COGNITIVE_FUNCTION_MAP[stack['auxiliary']],
        tertiary=COGNITIVE_FUNCTION_MAP[stack['tertiary']],
        inferior=COGNITIVE_FUNCTION_MAP[stack['inferior']]
    )


def sample_random_western() -> WesternProfile:
    """Sample random Western astrology signs."""
    return WesternProfile(
        sun_sign=random.randint(0, 11),
        moon_sign=random.randint(0, 11),
        rising_sign=random.randint(0, 11)
    )


def sample_random_numerology() -> NumerologyProfile:
    """Sample random numerology numbers (including master numbers)."""
    # Life path numbers 1-9, 11, 22, 33 (simplified to 1-33 range)
    def sample_num():
        if random.random() < 0.1:  # 10% chance of master number
            return random.choice([11, 22, 33])
        return random.randint(1, 9)

    return NumerologyProfile(
        life_path=sample_num(),
        expression=sample_num(),
        soul_urge=sample_num()
    )


def sample_random_profile() -> ConstitutionalProfile:
    """Generate a complete random constitutional profile."""
    return ConstitutionalProfile(
        bazi=sample_random_bazi(),
        enneagram=sample_random_enneagram(),
        mbti=sample_random_mbti(),
        western=sample_random_western(),
        numerology=sample_random_numerology()
    )


# ============================================
# Rule-Based Facet Calculation (Mirrors JavaScript)
# ============================================

# Simplified 30-facet bases for Enneagram types (matching JS implementation)
ENNEAGRAM_30_BASES = {
    1: [0.45, 0.50, 0.40, 0.55, 0.35, 0.45,  # N: moderate anxiety, self-critical
        0.45, 0.40, 0.70, 0.65, 0.35, 0.50,  # E: assertive but reserved
        0.50, 0.55, 0.45, 0.40, 0.60, 0.45,  # O: principled values
        0.65, 0.85, 0.70, 0.75, 0.50, 0.60,  # A: fair, honest
        0.90, 0.95, 0.95, 0.90, 0.85, 0.90], # C: very high conscientiousness

    2: [0.50, 0.45, 0.40, 0.50, 0.55, 0.55,  # N: people-pleasing anxiety
        0.85, 0.75, 0.55, 0.70, 0.50, 0.80,  # E: very warm, gregarious
        0.55, 0.60, 0.80, 0.55, 0.45, 0.55,  # O: high feelings
        0.90, 0.75, 0.95, 0.70, 0.45, 0.95,  # A: very altruistic
        0.60, 0.55, 0.75, 0.65, 0.60, 0.55], # C: moderate

    3: [0.40, 0.45, 0.35, 0.55, 0.50, 0.40,  # N: image-conscious anxiety
        0.80, 0.70, 0.85, 0.90, 0.65, 0.75,  # E: high activity, assertive
        0.50, 0.55, 0.50, 0.60, 0.55, 0.45,  # O: practical focus
        0.60, 0.65, 0.55, 0.55, 0.45, 0.55,  # A: charming but competitive
        0.85, 0.70, 0.65, 0.95, 0.80, 0.70], # C: achievement-driven

    4: [0.85, 0.65, 0.90, 0.85, 0.55, 0.80,  # N: high emotional intensity
        0.45, 0.35, 0.50, 0.45, 0.55, 0.40,  # E: withdrawn, individualistic
        0.95, 0.95, 0.95, 0.70, 0.75, 0.85,  # O: very high fantasy, aesthetics
        0.65, 0.75, 0.70, 0.55, 0.75, 0.85,  # A: authentic but moody
        0.55, 0.50, 0.60, 0.65, 0.45, 0.55], # C: creative inconsistency

    5: [0.55, 0.40, 0.50, 0.65, 0.30, 0.60,  # N: detached anxiety
        0.25, 0.20, 0.45, 0.40, 0.30, 0.30,  # E: very introverted
        0.90, 0.70, 0.55, 0.65, 0.95, 0.75,  # O: high ideas, moderate feelings
        0.55, 0.70, 0.45, 0.60, 0.65, 0.50,  # A: reserved but fair
        0.75, 0.80, 0.60, 0.70, 0.75, 0.85], # C: competent, deliberate

    6: [0.80, 0.60, 0.65, 0.70, 0.45, 0.75,  # N: anxiety-prone
        0.50, 0.55, 0.45, 0.55, 0.40, 0.50,  # E: moderate, loyal groups
        0.55, 0.50, 0.60, 0.45, 0.60, 0.55,  # O: questioning but cautious
        0.75, 0.80, 0.70, 0.80, 0.65, 0.70,  # A: loyal, cooperative
        0.70, 0.65, 0.85, 0.65, 0.60, 0.75], # C: dutiful

    7: [0.35, 0.40, 0.30, 0.35, 0.75, 0.35,  # N: avoids negative emotions
        0.90, 0.85, 0.70, 0.85, 0.90, 0.95,  # E: very high extraversion
        0.85, 0.70, 0.70, 0.85, 0.80, 0.75,  # O: high fantasy, actions
        0.65, 0.55, 0.60, 0.45, 0.50, 0.60,  # A: fun-loving but scattered
        0.50, 0.40, 0.45, 0.55, 0.40, 0.35], # C: low deliberation

    8: [0.40, 0.70, 0.35, 0.30, 0.60, 0.30,  # N: anger, low vulnerability
        0.70, 0.60, 0.95, 0.85, 0.70, 0.65,  # E: dominant, assertive
        0.55, 0.45, 0.50, 0.70, 0.60, 0.55,  # O: practical action
        0.40, 0.50, 0.50, 0.30, 0.25, 0.45,  # A: protective but confrontational
        0.75, 0.60, 0.55, 0.80, 0.70, 0.55], # C: decisive

    9: [0.35, 0.30, 0.40, 0.40, 0.45, 0.50,  # N: suppressed emotions
        0.60, 0.65, 0.35, 0.45, 0.40, 0.70,  # E: friendly but passive
        0.60, 0.65, 0.55, 0.50, 0.55, 0.60,  # O: accepting, harmonious
        0.85, 0.70, 0.75, 0.90, 0.75, 0.80,  # A: very agreeable
        0.55, 0.50, 0.60, 0.45, 0.50, 0.60], # C: easygoing
}


def calculate_rule_based_facets(profile: ConstitutionalProfile) -> List[float]:
    """
    Calculate 30 NEO facets using rule-based system.
    Mirrors the JavaScript implementation in personalitySourceMappings.js
    """
    vectors = []
    weights = []

    # Weight configuration (matches JavaScript SOURCE_WEIGHTS)
    WEIGHTS = {
        'bazi': 0.30,
        'enneagram': 0.18,
        'mbti': 0.10,
        'western': 0.10,
        'numerology': 0.07
    }

    # BaZi contribution (simplified - Day Pillar dominates)
    bazi_vec = calculate_bazi_facets(profile.bazi)
    vectors.append(bazi_vec)
    weights.append(WEIGHTS['bazi'])

    # Enneagram contribution
    enne_vec = calculate_enneagram_facets(profile.enneagram)
    vectors.append(enne_vec)
    weights.append(WEIGHTS['enneagram'])

    # MBTI contribution
    mbti_vec = calculate_mbti_facets(profile.mbti)
    vectors.append(mbti_vec)
    weights.append(WEIGHTS['mbti'])

    # Western astrology contribution
    western_vec = calculate_western_facets(profile.western)
    vectors.append(western_vec)
    weights.append(WEIGHTS['western'])

    # Numerology contribution
    num_vec = calculate_numerology_facets(profile.numerology)
    vectors.append(num_vec)
    weights.append(WEIGHTS['numerology'])

    # Weighted fusion
    total_weight = sum(weights)
    fused = [0.0] * 30

    for vec, weight in zip(vectors, weights):
        for i in range(30):
            fused[i] += vec[i] * weight

    # Normalize
    fused = [v / total_weight for v in fused]

    # Clamp to [0, 1]
    fused = [max(0.0, min(1.0, v)) for v in fused]

    return fused


def calculate_bazi_facets(bazi: BaZiProfile) -> List[float]:
    """Calculate facets from BaZi (Day Pillar = 70%)."""
    # Simplified: Use day pillar stem (0-9) to determine base personality
    day_stem = bazi.day_pillar % 10  # Heavenly stem

    # Base vector varies by stem type (Wood, Fire, Earth, Metal, Water)
    element = day_stem // 2  # 0=Wood, 1=Fire, 2=Earth, 3=Metal, 4=Water

    # Element-based personality templates
    element_bases = {
        0: [0.45, 0.55, 0.40, 0.45, 0.45, 0.40,  # Wood: growth-oriented
            0.65, 0.55, 0.75, 0.70, 0.55, 0.60,
            0.70, 0.55, 0.55, 0.70, 0.75, 0.50,
            0.55, 0.80, 0.60, 0.40, 0.45, 0.55,
            0.85, 0.70, 0.80, 0.85, 0.80, 0.70],
        1: [0.55, 0.65, 0.45, 0.40, 0.65, 0.45,  # Fire: passionate
            0.85, 0.75, 0.70, 0.80, 0.75, 0.85,
            0.65, 0.70, 0.80, 0.70, 0.60, 0.65,
            0.65, 0.60, 0.70, 0.50, 0.45, 0.70,
            0.60, 0.50, 0.55, 0.70, 0.55, 0.45],
        2: [0.40, 0.45, 0.35, 0.45, 0.40, 0.40,  # Earth: stable
            0.55, 0.55, 0.55, 0.55, 0.45, 0.55,
            0.50, 0.55, 0.50, 0.45, 0.55, 0.50,
            0.75, 0.75, 0.75, 0.80, 0.70, 0.75,
            0.75, 0.80, 0.80, 0.70, 0.75, 0.80],
        3: [0.50, 0.55, 0.45, 0.55, 0.35, 0.50,  # Metal: precise
            0.45, 0.40, 0.65, 0.55, 0.35, 0.40,
            0.55, 0.65, 0.45, 0.50, 0.70, 0.55,
            0.55, 0.80, 0.50, 0.60, 0.55, 0.55,
            0.90, 0.90, 0.85, 0.85, 0.90, 0.90],
        4: [0.55, 0.40, 0.55, 0.60, 0.45, 0.55,  # Water: adaptive
            0.50, 0.55, 0.45, 0.50, 0.50, 0.50,
            0.75, 0.70, 0.70, 0.65, 0.80, 0.70,
            0.65, 0.65, 0.65, 0.65, 0.70, 0.65,
            0.65, 0.60, 0.70, 0.60, 0.65, 0.70],
    }

    return element_bases.get(element, [0.5] * 30)


def calculate_enneagram_facets(enne: EnneagramProfile) -> List[float]:
    """Calculate facets from Enneagram with wing blend."""
    if enne.core not in ENNEAGRAM_30_BASES:
        return [0.5] * 30

    # Start with core type
    vector = list(ENNEAGRAM_30_BASES[enne.core])

    # Wing blend (70% core, 30% wing)
    if enne.wing in ENNEAGRAM_30_BASES:
        wing_vec = ENNEAGRAM_30_BASES[enne.wing]
        vector = [0.7 * v + 0.3 * w for v, w in zip(vector, wing_vec)]

    # Health level adjustment
    level_factor = (5 - min(9, max(1, enne.level))) / 8  # -0.5 to +0.5

    # Healthier = lower N, higher positive traits
    for i in range(6):  # Neuroticism facets
        vector[i] -= level_factor * 0.1
    for i in range(6, 12):  # Extraversion facets
        vector[i] += level_factor * 0.05

    return [max(0.0, min(1.0, v)) for v in vector]


def calculate_mbti_facets(mbti: MBTIProfile) -> List[float]:
    """Calculate facets from MBTI cognitive functions."""
    # Base vector from type
    type_code = mbti.type_code

    # E/I dimension
    is_extrovert = type_code[0] == 'E'
    e_base = 0.7 if is_extrovert else 0.35

    # S/N dimension (Openness)
    is_intuitive = type_code[1] == 'N'
    o_base = 0.75 if is_intuitive else 0.45

    # T/F dimension (Agreeableness)
    is_feeling = type_code[2] == 'F'
    a_base = 0.7 if is_feeling else 0.45

    # J/P dimension (Conscientiousness)
    is_judging = type_code[3] == 'J'
    c_base = 0.75 if is_judging else 0.45

    # Neuroticism (varies by function stack)
    n_base = 0.5
    if is_feeling:
        n_base += 0.1
    if is_intuitive:
        n_base += 0.05

    return [
        n_base, n_base - 0.05, n_base, n_base + 0.05, n_base - 0.1, n_base,
        e_base, e_base - 0.1, e_base + 0.1, e_base, e_base - 0.05, e_base + 0.05,
        o_base, o_base + 0.05, o_base - 0.05, o_base, o_base + 0.1, o_base - 0.05,
        a_base, a_base + 0.05, a_base, a_base - 0.05, a_base + 0.1, a_base + 0.05,
        c_base, c_base + 0.1, c_base + 0.05, c_base, c_base + 0.05, c_base - 0.05,
    ]


def calculate_western_facets(western: WesternProfile) -> List[float]:
    """Calculate facets from Western astrology (element-based)."""
    # Sun sign element (Fire=0,1,2... Earth=3,4,5... Air=6,7,8... Water=9,10,11)
    sun_element = (western.sun_sign % 4)  # 0=Fire, 1=Earth, 2=Air, 3=Water

    element_mods = {
        0: {'E': 0.15, 'N': 0.05, 'O': 0.05},   # Fire: extraverted, passionate
        1: {'C': 0.15, 'A': 0.05, 'N': -0.05},  # Earth: conscientious, stable
        2: {'O': 0.15, 'E': 0.10, 'A': 0.05},   # Air: open, social, intellectual
        3: {'N': 0.10, 'O': 0.10, 'A': 0.10},   # Water: emotional, intuitive
    }

    mods = element_mods.get(sun_element, {})

    # Build vector with modifiers
    base = 0.5
    vector = [base] * 30

    # Apply element modifiers to domains
    n_mod = mods.get('N', 0)
    e_mod = mods.get('E', 0)
    o_mod = mods.get('O', 0)
    a_mod = mods.get('A', 0)
    c_mod = mods.get('C', 0)

    for i in range(6):
        vector[i] += n_mod
        vector[i + 6] += e_mod
        vector[i + 12] += o_mod
        vector[i + 18] += a_mod
        vector[i + 24] += c_mod

    return vector


def calculate_numerology_facets(num: NumerologyProfile) -> List[float]:
    """Calculate facets from Numerology life path."""
    # Life path archetypes
    life_path_mods = {
        1: {'E': 0.10, 'C': 0.10, 'A': -0.10},   # Leader
        2: {'A': 0.15, 'E': 0.05, 'N': 0.05},    # Peacemaker
        3: {'E': 0.15, 'O': 0.10, 'N': -0.05},   # Creative
        4: {'C': 0.20, 'O': -0.05},              # Builder
        5: {'O': 0.15, 'E': 0.10, 'C': -0.10},   # Freedom-seeker
        6: {'A': 0.20, 'C': 0.05},               # Nurturer
        7: {'O': 0.15, 'E': -0.15, 'N': 0.05},   # Seeker
        8: {'C': 0.15, 'E': 0.10, 'A': -0.05},   # Achiever
        9: {'O': 0.10, 'A': 0.15, 'N': 0.05},    # Humanitarian
        11: {'O': 0.20, 'N': 0.10, 'E': 0.05},   # Master Intuitive
        22: {'C': 0.20, 'O': 0.10, 'A': 0.10},   # Master Builder
        33: {'A': 0.25, 'O': 0.10, 'N': 0.05},   # Master Teacher
    }

    # Reduce to single digit if not master number
    lp = num.life_path
    if lp not in [11, 22, 33]:
        while lp > 9:
            lp = sum(int(d) for d in str(lp))

    mods = life_path_mods.get(lp, {})

    base = 0.5
    vector = [base] * 30

    n_mod = mods.get('N', 0)
    e_mod = mods.get('E', 0)
    o_mod = mods.get('O', 0)
    a_mod = mods.get('A', 0)
    c_mod = mods.get('C', 0)

    for i in range(6):
        vector[i] += n_mod
        vector[i + 6] += e_mod
        vector[i + 12] += o_mod
        vector[i + 18] += a_mod
        vector[i + 24] += c_mod

    return vector


def add_gaussian_noise(facets: List[float], std: float = 0.05) -> List[float]:
    """Add Gaussian noise to simulate real-world variation."""
    noisy = [v + random.gauss(0, std) for v in facets]
    return [max(0.0, min(1.0, v)) for v in noisy]


# ============================================
# Dataset Generation
# ============================================

def generate_training_dataset(
    n_samples: int = 10000,
    add_noise: bool = True,
    noise_std: float = 0.05,
    balance_types: bool = True
) -> List[TrainingSample]:
    """
    Generate synthetic training dataset from rule-based system.

    Args:
        n_samples: Number of samples to generate
        add_noise: Whether to add Gaussian noise
        noise_std: Standard deviation of noise
        balance_types: Whether to balance across Enneagram types

    Returns:
        List of TrainingSample objects
    """
    samples = []
    timestamp = datetime.now().isoformat()

    if balance_types:
        # Ensure balanced representation of all 9 Enneagram types
        samples_per_type = n_samples // 9

        for enne_type in range(1, 10):
            for i in range(samples_per_type):
                profile = sample_random_profile()
                # Override enneagram core to ensure balance
                profile.enneagram.core = enne_type
                # Ensure valid wing
                if enne_type == 1:
                    profile.enneagram.wing = random.choice([9, 2])
                elif enne_type == 9:
                    profile.enneagram.wing = random.choice([8, 1])
                else:
                    profile.enneagram.wing = random.choice([enne_type - 1, enne_type + 1])

                target = calculate_rule_based_facets(profile)
                if add_noise:
                    target = add_gaussian_noise(target, noise_std)

                samples.append(TrainingSample(
                    id=len(samples),
                    profile=profile,
                    target_facets=target,
                    source='synthetic',
                    quality_score=1.0,
                    timestamp=timestamp
                ))
    else:
        for i in range(n_samples):
            profile = sample_random_profile()
            target = calculate_rule_based_facets(profile)
            if add_noise:
                target = add_gaussian_noise(target, noise_std)

            samples.append(TrainingSample(
                id=i,
                profile=profile,
                target_facets=target,
                source='synthetic',
                quality_score=1.0,
                timestamp=timestamp
            ))

    # Shuffle
    random.shuffle(samples)

    return samples


def save_dataset(samples: List[TrainingSample], filepath: str):
    """Save dataset to JSON file."""
    data = {
        'metadata': {
            'version': '1.0',
            'created': datetime.now().isoformat(),
            'n_samples': len(samples),
            'source': 'Luna Brain 7A Training Pipeline'
        },
        'samples': [asdict(s) for s in samples]
    }

    Path(filepath).parent.mkdir(parents=True, exist_ok=True)
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)

    print(f"Saved {len(samples)} samples to {filepath}")


def load_dataset(filepath: str) -> List[TrainingSample]:
    """Load dataset from JSON file."""
    with open(filepath, 'r') as f:
        data = json.load(f)

    samples = []
    for s in data['samples']:
        profile = ConstitutionalProfile(
            bazi=BaZiProfile(**s['profile']['bazi']),
            enneagram=EnneagramProfile(**s['profile']['enneagram']),
            mbti=MBTIProfile(**s['profile']['mbti']),
            western=WesternProfile(**s['profile']['western']),
            numerology=NumerologyProfile(**s['profile']['numerology'])
        )
        samples.append(TrainingSample(
            id=s['id'],
            profile=profile,
            target_facets=s['target_facets'],
            source=s['source'],
            quality_score=s['quality_score'],
            timestamp=s['timestamp']
        ))

    return samples


# ============================================
# P3.3: Continuous Learning Pipeline
# ============================================

def merge_feedback_data(
    original_samples: List[TrainingSample],
    feedback_samples: List[Dict],
    min_rating: float = 8.0
) -> List[TrainingSample]:
    """
    Merge user feedback into training dataset.

    Only includes feedback with rating >= min_rating.
    """
    timestamp = datetime.now().isoformat()

    # Convert feedback to TrainingSample format
    new_samples = []
    for fb in feedback_samples:
        if fb.get('rating', 0) >= min_rating:
            # Create profile from feedback data
            profile = ConstitutionalProfile(
                bazi=BaZiProfile(**fb['input'].get('bazi', {
                    'year_pillar': 0, 'month_pillar': 0,
                    'day_pillar': 0, 'hour_pillar': 0
                })),
                enneagram=EnneagramProfile(**fb['input'].get('enneagram', {
                    'core': 5, 'wing': 4, 'tritype_head': 5,
                    'tritype_heart': 4, 'tritype_gut': 1,
                    'instinct_stack': 0, 'level': 5
                })),
                mbti=MBTIProfile(**fb['input'].get('mbti', {
                    'type_code': 'INFJ', 'dominant': 0,
                    'auxiliary': 5, 'tertiary': 6, 'inferior': 3
                })),
                western=WesternProfile(**fb['input'].get('western', {
                    'sun_sign': 0, 'moon_sign': 0, 'rising_sign': 0
                })),
                numerology=NumerologyProfile(**fb['input'].get('numerology', {
                    'life_path': 7, 'expression': 7, 'soul_urge': 7
                }))
            )

            # Use user-adjusted facets as target
            target = fb.get('adjusted_facets', fb.get('calculated_facets', [0.5] * 30))

            new_samples.append(TrainingSample(
                id=len(original_samples) + len(new_samples),
                profile=profile,
                target_facets=target,
                source='user_feedback',
                quality_score=fb.get('rating', 8.0) / 10.0,
                timestamp=timestamp
            ))

    print(f"Added {len(new_samples)} samples from user feedback")

    # Combine datasets
    combined = original_samples + new_samples
    random.shuffle(combined)

    return combined


# ============================================
# Main Entry Point
# ============================================

if __name__ == '__main__':
    print("=" * 60)
    print("Luna Brain 7A: Training Data Pipeline")
    print("=" * 60)

    # Generate bootstrap dataset
    print("\nGenerating bootstrap dataset (1000 samples for demo)...")
    samples = generate_training_dataset(n_samples=1000, balance_types=True)

    # Show statistics
    enne_counts = {}
    for s in samples:
        t = s.profile.enneagram.core
        enne_counts[t] = enne_counts.get(t, 0) + 1

    print("\nEnneagram type distribution:")
    for t in sorted(enne_counts.keys()):
        print(f"  Type {t}: {enne_counts[t]} samples")

    # Show sample
    print("\nSample profile:")
    sample = samples[0]
    print(f"  Enneagram: {sample.profile.enneagram.core}w{sample.profile.enneagram.wing}")
    print(f"  MBTI: {sample.profile.mbti.type_code}")
    print(f"  BaZi Day Pillar: {sample.profile.bazi.day_pillar}")
    print(f"  Target facets (first 6): {sample.target_facets[:6]}")

    # Save demo dataset
    output_path = Path(__file__).parent / 'data' / 'training_bootstrap_demo.json'
    save_dataset(samples, str(output_path))

    print("\nP3 Training Data Pipeline Ready!")
