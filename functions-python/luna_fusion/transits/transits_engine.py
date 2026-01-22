"""
P5 Transits Engine
Current sky positions → temporary personality influences

Calculates real-time transits from outer planets (Jupiter, Saturn, Uranus,
Neptune, Pluto) to natal positions, generating temporary 30-facet modifiers.
"""

import numpy as np
from typing import Dict, List, Optional, Tuple
from datetime import datetime

from ..core.constants import (
    DIMENSIONS_30, OUTER_PLANETS, PERSONAL_PLANETS, PLANETS,
    ASPECT_TYPES, ASPECT_ORBS
)
from ..core.vector_utils import (
    create_zero_vector, clip_vector, apply_domain_modifiers,
    apply_facet_modifiers, calculate_orb_weight
)
from ..core.swiss_ephemeris import (
    datetime_to_jd, get_all_planet_positions, calculate_aspects,
    birth_data_to_jd, get_current_julian_day, calculate_angle_difference,
    identify_aspect
)


# Transit planets (outer planets have longer, more significant transits)
TRANSIT_PLANETS = ['Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']

# Natal planets that receive transits
NATAL_RECEIVERS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn']


# ============================================
# TRANSIT IMPACT VECTORS (30-facet)
# ============================================
# How each transiting planet affects personality temporarily

TRANSIT_PLANET_IMPACT = {
    'Jupiter': {
        'description': 'Expansion, optimism, opportunity',
        'base_mods': {
            'E_mod': 0.08,       # More outgoing
            'O_mod': 0.10,       # More open to experiences
            'N_mod': -0.05       # Less anxious
        },
        'facets': {
            'E6': 0.12,          # Positive Emotions boost
            'O4': 0.10,          # Actions - more adventurous
            'A1': 0.08           # Trust increase
        },
        'duration_factor': 1.0   # ~1 year per sign
    },
    'Saturn': {
        'description': 'Structure, discipline, restriction',
        'base_mods': {
            'C_mod': 0.12,       # More disciplined
            'N_mod': 0.08,       # More cautious/anxious
            'E_mod': -0.05       # Less spontaneous
        },
        'facets': {
            'C5': 0.15,          # Self-Discipline
            'C3': 0.10,          # Dutifulness
            'N1': 0.08,          # Anxiety
            'E5': -0.08          # Less excitement seeking
        },
        'duration_factor': 1.2   # ~2.5 years per sign
    },
    'Uranus': {
        'description': 'Change, awakening, disruption',
        'base_mods': {
            'O_mod': 0.15,       # Much more open to change
            'N_mod': 0.10,       # Restlessness
            'A_mod': -0.05       # Less compliant
        },
        'facets': {
            'O5': 0.15,          # Ideas - unconventional
            'O4': 0.12,          # Actions - unexpected
            'E5': 0.10,          # Excitement Seeking
            'A4': -0.10          # Less Compliant
        },
        'duration_factor': 1.5   # ~7 years per sign
    },
    'Neptune': {
        'description': 'Dissolution, spirituality, confusion',
        'base_mods': {
            'O_mod': 0.12,       # More imaginative
            'C_mod': -0.08,      # Less structured
            'N_mod': 0.08        # More sensitive/confused
        },
        'facets': {
            'O1': 0.18,          # Fantasy increase
            'O3': 0.12,          # Feelings - more sensitive
            'C5': -0.10,         # Self-Discipline decrease
            'N6': 0.10           # Vulnerability
        },
        'duration_factor': 1.8   # ~14 years per sign
    },
    'Pluto': {
        'description': 'Transformation, power, intensity',
        'base_mods': {
            'O_mod': 0.10,       # Depth of experience
            'N_mod': 0.12,       # Intensity/obsession
            'C_mod': 0.08        # Will to transform
        },
        'facets': {
            'O3': 0.15,          # Feelings - deeper
            'N3': 0.10,          # Depression risk
            'C4': 0.12,          # Achievement - compulsive
            'N6': 0.08           # Vulnerability to power
        },
        'duration_factor': 2.0   # ~20+ years per sign
    }
}


# ============================================
# TRANSIT ASPECT TYPE MODIFIERS
# ============================================
# How different transit aspects modify the impact

TRANSIT_ASPECT_MODIFIERS = {
    'Conjunction': {
        'intensity': 1.0,
        'quality': 'fusion',
        'description': 'Direct activation - strongest impact',
        'modifier': 1.0
    },
    'Opposition': {
        'intensity': 0.9,
        'quality': 'challenging',
        'description': 'External pressure, confrontation',
        'modifier': 0.9,
        'extra_mods': {'N_mod': 0.05}
    },
    'Square': {
        'intensity': 0.85,
        'quality': 'challenging',
        'description': 'Friction, forced growth',
        'modifier': 0.85,
        'extra_mods': {'N_mod': 0.08, 'C_mod': 0.05}
    },
    'Trine': {
        'intensity': 0.7,
        'quality': 'harmonious',
        'description': 'Easy flow, natural support',
        'modifier': 0.7,
        'extra_mods': {'N_mod': -0.05}
    },
    'Sextile': {
        'intensity': 0.5,
        'quality': 'harmonious',
        'description': 'Opportunity requiring action',
        'modifier': 0.5,
        'extra_mods': {'O_mod': 0.03}
    }
}


# ============================================
# NATAL RECEIVER SENSITIVITY
# ============================================
# How sensitive each natal planet is to transits

NATAL_RECEIVER_WEIGHTS = {
    'Sun': 1.0,      # Core identity - highest sensitivity
    'Moon': 0.95,    # Emotions - very sensitive
    'Mercury': 0.6,  # Mind - moderate
    'Venus': 0.65,   # Relationships - moderate
    'Mars': 0.7,     # Action - moderate-high
    'Jupiter': 0.4,  # Already expansive - lower
    'Saturn': 0.5    # Structure - moderate
}


# ============================================
# MAIN FUNCTIONS
# ============================================

def calculate_current_positions(transit_planets: List[str] = None) -> Dict[str, Dict]:
    """
    Get current planetary positions.

    Args:
        transit_planets: Which planets to calculate (defaults to outer planets)

    Returns:
        Dict of planet positions
    """
    if transit_planets is None:
        transit_planets = TRANSIT_PLANETS

    jd = get_current_julian_day()
    return get_all_planet_positions(jd, transit_planets)


def calculate_transit_aspects(natal_positions: Dict[str, Dict],
                              transit_positions: Dict[str, Dict] = None,
                              orb_multiplier: float = 1.0) -> List[Dict]:
    """
    Calculate aspects from transiting planets to natal positions.

    Args:
        natal_positions: Natal planet positions
        transit_positions: Current planet positions (calculated if not provided)
        orb_multiplier: Adjust orbs (tighter = more precise timing)

    Returns:
        List of transit aspect dictionaries
    """
    if transit_positions is None:
        transit_positions = calculate_current_positions()

    transit_aspects = []

    for transit_planet in transit_positions:
        transit_pos = transit_positions[transit_planet]

        for natal_planet in natal_positions:
            if natal_planet not in NATAL_RECEIVERS:
                continue

            natal_pos = natal_positions[natal_planet]

            # Calculate angular difference
            angle = calculate_angle_difference(
                transit_pos['longitude'],
                natal_pos['longitude']
            )

            # Check for aspect
            aspect = identify_aspect(angle, orb_multiplier)

            if aspect:
                aspect['transit_planet'] = {
                    'name': transit_planet,
                    'longitude': transit_pos['longitude'],
                    'sign': transit_pos['sign'],
                    'speed': transit_pos.get('speed', 0)
                }
                aspect['natal_planet'] = {
                    'name': natal_planet,
                    'longitude': natal_pos['longitude'],
                    'sign': natal_pos['sign']
                }
                aspect['type'] = 'transit'

                transit_aspects.append(aspect)

    return transit_aspects


def transits_to_30_facets(transit_aspects: List[Dict],
                          intensity_scale: float = 1.0) -> np.ndarray:
    """
    Convert transit aspects to 30-facet personality modifier vector.

    These are TEMPORARY modifiers that overlay the base personality.

    Args:
        transit_aspects: List of transit aspect dictionaries
        intensity_scale: Overall scaling factor (0.0 to 1.0)

    Returns:
        30-dimensional numpy array of facet modifiers
    """
    vector = create_zero_vector()

    for transit in transit_aspects:
        transit_planet = transit['transit_planet']['name']
        natal_planet = transit['natal_planet']['name']
        aspect_type = transit['aspect']
        orb = transit.get('orb', 0)
        max_orb = transit.get('max_orb', 8)

        # Get transit planet impact data
        planet_impact = TRANSIT_PLANET_IMPACT.get(transit_planet, {})
        if not planet_impact:
            continue

        # Get aspect type modifier
        aspect_mod = TRANSIT_ASPECT_MODIFIERS.get(aspect_type, {})
        aspect_intensity = aspect_mod.get('modifier', 0.5)

        # Get natal receiver weight
        receiver_weight = NATAL_RECEIVER_WEIGHTS.get(natal_planet, 0.5)

        # Calculate orb weight (tighter = stronger)
        orb_weight = calculate_orb_weight(orb, max_orb)

        # Combined weight
        combined_weight = (
            orb_weight *
            aspect_intensity *
            receiver_weight *
            intensity_scale *
            planet_impact.get('duration_factor', 1.0) * 0.5  # Duration dampening
        )

        # Apply base domain modifiers from transit planet
        base_mods = planet_impact.get('base_mods', {})
        scaled_mods = {k: v * combined_weight for k, v in base_mods.items()}
        vector = apply_domain_modifiers(vector, scaled_mods)

        # Apply aspect-type extra modifiers
        if 'extra_mods' in aspect_mod:
            extra_scaled = {k: v * combined_weight for k, v in aspect_mod['extra_mods'].items()}
            vector = apply_domain_modifiers(vector, extra_scaled)

        # Apply facet-specific modifiers from transit planet
        facets = planet_impact.get('facets', {})
        scaled_facets = {k: v * combined_weight for k, v in facets.items()}
        vector = apply_facet_modifiers(vector, scaled_facets)

    # Transits are temporary overlays - keep in reasonable range
    # Typically -0.2 to +0.2 per facet
    vector = np.clip(vector, -0.3, 0.3)

    return vector


def get_active_transits(natal_positions: Dict[str, Dict],
                        orb_multiplier: float = 1.0) -> Dict:
    """
    Get summary of currently active transits.

    Args:
        natal_positions: Natal planet positions
        orb_multiplier: Adjust orbs

    Returns:
        Summary dict with active transits and their meanings
    """
    transit_positions = calculate_current_positions()
    aspects = calculate_transit_aspects(natal_positions, transit_positions, orb_multiplier)

    # Group by transit planet
    by_planet = {}
    for asp in aspects:
        t_planet = asp['transit_planet']['name']
        if t_planet not in by_planet:
            by_planet[t_planet] = []
        by_planet[t_planet].append(asp)

    # Generate summary
    summary = {
        'timestamp': datetime.utcnow().isoformat(),
        'total_active': len(aspects),
        'by_planet': {},
        'major_transits': [],
        'challenging': [],
        'supportive': []
    }

    for planet, planet_aspects in by_planet.items():
        impact = TRANSIT_PLANET_IMPACT.get(planet, {})
        summary['by_planet'][planet] = {
            'count': len(planet_aspects),
            'description': impact.get('description', ''),
            'aspects': []
        }

        for asp in planet_aspects:
            aspect_info = {
                'natal_planet': asp['natal_planet']['name'],
                'aspect': asp['aspect'],
                'orb': round(asp['orb'], 2),
                'quality': TRANSIT_ASPECT_MODIFIERS.get(asp['aspect'], {}).get('quality', 'neutral')
            }
            summary['by_planet'][planet]['aspects'].append(aspect_info)

            # Classify as major/challenging/supportive
            if asp['aspect'] in ['Conjunction', 'Opposition', 'Square']:
                summary['major_transits'].append(f"{planet} {asp['aspect']} natal {asp['natal_planet']['name']}")

                if asp['aspect'] in ['Opposition', 'Square']:
                    summary['challenging'].append(aspect_info)
            elif asp['aspect'] in ['Trine', 'Sextile']:
                summary['supportive'].append(aspect_info)

    return summary


def get_transit_forecast(natal_positions: Dict[str, Dict],
                         days_ahead: int = 30) -> List[Dict]:
    """
    Generate transit forecast for upcoming period.

    Args:
        natal_positions: Natal planet positions
        days_ahead: How many days to forecast

    Returns:
        List of upcoming transit events
    """
    from ..core.swiss_ephemeris import datetime_to_jd, jd_to_datetime

    base_jd = get_current_julian_day()
    forecast = []

    # Sample each day
    for day_offset in range(days_ahead):
        future_jd = base_jd + day_offset
        future_date = jd_to_datetime(future_jd)

        # Get positions for that day
        future_positions = get_all_planet_positions(future_jd, TRANSIT_PLANETS)

        # Calculate aspects
        for transit_planet in future_positions:
            t_pos = future_positions[transit_planet]

            for natal_planet in natal_positions:
                if natal_planet not in NATAL_RECEIVERS:
                    continue

                n_pos = natal_positions[natal_planet]
                angle = calculate_angle_difference(t_pos['longitude'], n_pos['longitude'])

                # Check for exact or very close aspects
                aspect = identify_aspect(angle, orb_multiplier=0.5)  # Tighter orbs for forecast

                if aspect and aspect['orb'] < 1.0:  # Within 1 degree
                    forecast.append({
                        'date': future_date.strftime('%Y-%m-%d'),
                        'transit_planet': transit_planet,
                        'natal_planet': natal_planet,
                        'aspect': aspect['aspect'],
                        'orb': round(aspect['orb'], 2),
                        'description': TRANSIT_PLANET_IMPACT.get(transit_planet, {}).get('description', '')
                    })

    # Remove duplicates and sort by date
    seen = set()
    unique_forecast = []
    for event in forecast:
        key = (event['date'], event['transit_planet'], event['natal_planet'], event['aspect'])
        if key not in seen:
            seen.add(key)
            unique_forecast.append(event)

    return sorted(unique_forecast, key=lambda x: x['date'])


def calculate_transit_intensity(transit_aspects: List[Dict]) -> Dict[str, float]:
    """
    Calculate overall transit intensity by domain.

    Args:
        transit_aspects: List of transit aspects

    Returns:
        Dict with intensity scores by domain
    """
    intensities = {'N': 0, 'E': 0, 'O': 0, 'A': 0, 'C': 0}

    for transit in transit_aspects:
        transit_planet = transit['transit_planet']['name']
        aspect_type = transit['aspect']
        orb = transit.get('orb', 0)
        max_orb = transit.get('max_orb', 8)

        planet_impact = TRANSIT_PLANET_IMPACT.get(transit_planet, {})
        base_mods = planet_impact.get('base_mods', {})

        orb_weight = calculate_orb_weight(orb, max_orb)
        aspect_mod = TRANSIT_ASPECT_MODIFIERS.get(aspect_type, {}).get('modifier', 0.5)

        weight = orb_weight * aspect_mod

        for mod_key, mod_value in base_mods.items():
            domain = mod_key.replace('_mod', '')
            if domain in intensities:
                intensities[domain] += abs(mod_value) * weight

    return intensities
