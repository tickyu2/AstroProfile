"""
Composite Transit Engine
========================

Calculates transits from outer planets to the composite (midpoint) chart,
mapping each transit hit to a relationship chamber with impact scores.

Pipeline:
  Composite longitudes (midpoints) + Swiss Ephemeris positions
    → aspect detection across 12-month scan (biweekly samples)
    → chamber impact mapping (transit planet × composite point → chamber deltas)
    → TransitEvent dicts → StoryBeat dicts → SeasonalChapter dicts

Returns data matching the frontend TypeScript interfaces:
  - TransitEvent: { date, label, impact }
  - StoryBeat:    { date, label, chamber, direction, narrative }
  - SeasonalChapter: { season, theme, summary, events }

GENESIS AstroProfile - February 2026
"""

from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
import math

from ..core.swiss_ephemeris import (
    get_all_planet_positions,
    get_current_julian_day,
    datetime_to_jd,
    jd_to_datetime,
    calculate_angle_difference,
    identify_aspect,
)


# =============================================================================
# CONSTANTS
# =============================================================================

# Outer planets whose transits to composite chart are tracked
TRANSIT_PLANETS = ['Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']

# Composite points that can receive transits
COMPOSITE_RECEIVERS = [
    'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
    'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
]

# Composite point → primary relationship chamber (+ optional secondary)
POINT_TO_CHAMBER = {
    'Sun':     {'primary': 'core'},
    'Moon':    {'primary': 'core', 'secondary': 'passion'},
    'Mercury': {'primary': 'communication'},
    'Venus':   {'primary': 'passion'},
    'Mars':    {'primary': 'passion', 'secondary': 'communication'},
    'Jupiter': {'primary': 'growth'},
    'Saturn':  {'primary': 'growth', 'secondary': 'transformation'},
    'Uranus':  {'primary': 'transformation'},
    'Neptune': {'primary': 'transformation', 'secondary': 'core'},
    'Pluto':   {'primary': 'transformation'},
}

# Transit planet base weight (outer = stronger impact)
TRANSIT_WEIGHT = {
    'Jupiter': 8,
    'Saturn':  12,
    'Uranus':  14,
    'Neptune': 13,
    'Pluto':   15,
}

# Aspect sign: positive (opens chamber) vs negative (tests chamber)
ASPECT_SIGN = {
    'Conjunction': 1,    # intensifying — opens
    'Trine':       1,    # harmonious — opens
    'Sextile':     1,    # opportunity — opens
    'Square':      -1,   # friction — tests
    'Opposition':  -1,   # tension — tests
    'Quincunx':    -1,   # adjustment — tests (minor)
}

# Chamber human-readable names (for narrative generation)
CHAMBER_NAMES = {
    'core': 'identity',
    'passion': 'desire',
    'communication': 'dialogue',
    'growth': 'growth',
    'transformation': 'transformation',
}


# =============================================================================
# IMPACT BUILDER
# =============================================================================

def _build_impact(transit_planet: str,
                  composite_point: str,
                  aspect_name: str) -> Dict[str, int]:
    """
    Build chamber impact deltas from a transit-to-composite aspect.

    Returns dict like { 'core': 12, 'passion': 5 }
    """
    mapping = POINT_TO_CHAMBER.get(composite_point)
    if not mapping:
        return {}

    weight = TRANSIT_WEIGHT.get(transit_planet, 10)
    sign = ASPECT_SIGN.get(aspect_name, 0)
    delta = sign * weight

    impact = {mapping['primary']: delta}

    secondary = mapping.get('secondary')
    if secondary:
        impact[secondary] = round(delta * 0.4)

    return impact


# =============================================================================
# STORY BEAT GENERATOR (mirrors frontend storyEvent.ts)
# =============================================================================

def _generate_story_beat(event: Dict) -> Dict:
    """
    Convert a transit event into a mythic story beat.
    Matches the frontend StoryBeat interface.
    """
    impact = event.get('impact', {})
    entries = [(k, v) for k, v in impact.items() if v and v != 0]

    if not entries:
        return {
            'date': event['date'],
            'label': event['label'],
            'chamber': 'core',
            'direction': 'tests',
            'narrative': f"{event['label']} creates a subtle ripple across the relationship.",
        }

    # Find chamber with strongest absolute impact
    entries.sort(key=lambda x: abs(x[1]), reverse=True)
    chamber, delta = entries[0]
    direction = 'opens' if delta > 0 else 'tests'
    chamber_name = CHAMBER_NAMES.get(chamber, chamber)

    # Secondary chamber note
    secondary_note = ''
    if len(entries) > 1:
        sec_name = CHAMBER_NAMES.get(entries[1][0], entries[1][0])
        secondary_note = f', while echoing through {sec_name}'

    narrative = (
        f"{event['label']} {direction} the chamber of {chamber_name}{secondary_note}. "
    )
    if direction == 'opens':
        narrative += 'New possibilities emerge in this area of the bond.'
    else:
        narrative += 'This transit asks for conscious attention and deeper awareness.'

    return {
        'date': event['date'],
        'label': event['label'],
        'chamber': chamber,
        'direction': direction,
        'narrative': narrative,
    }


# =============================================================================
# SEASONAL CHAPTER BUILDER (mirrors frontend seasonalChapter.ts)
# =============================================================================

def _get_season_from_date(date_str: str) -> str:
    """Classify a YYYY-MM date string into a seasonal label."""
    parts = date_str.split('-')
    if len(parts) < 2:
        return f'Season ({date_str})'

    year = parts[0]
    month = int(parts[1])

    if month <= 2 or month == 12:
        return f'Winter {year}'
    elif month <= 5:
        return f'Spring {year}'
    elif month <= 8:
        return f'Summer {year}'
    else:
        return f'Autumn {year}'


def _classify_theme(events: List[Dict]) -> str:
    """Classify season theme from beats."""
    opens = sum(1 for e in events if e.get('direction') == 'opens')
    tests = sum(1 for e in events if e.get('direction') == 'tests')

    if opens > tests * 2:
        return 'A Season of Expansion'
    if tests > opens * 2:
        return 'A Season of Initiation'
    if opens > tests:
        return 'A Season of Growth'
    if tests > opens:
        return 'A Season of Deepening'
    return 'A Season of Integration'


def _build_seasonal_chapters(beats: List[Dict]) -> List[Dict]:
    """Group story beats into seasonal chapters."""
    if not beats:
        return []

    by_season: Dict[str, List[Dict]] = {}
    for beat in beats:
        season = _get_season_from_date(beat['date'])
        by_season.setdefault(season, []).append(beat)

    chapters = []
    for season, events in by_season.items():
        theme = _classify_theme(events)
        labels = ', '.join(e['label'] for e in events)
        summary = (
            f"This season carried {theme.lower().replace('a season of ', '')}. "
            f"Key transits: {labels}."
        )
        chapters.append({
            'season': season,
            'theme': theme,
            'summary': summary,
            'events': events,
        })

    return chapters


# =============================================================================
# MAIN SCAN ENGINE
# =============================================================================

def scan_composite_transits(composite_longitudes: Dict[str, float],
                            months: int = 12,
                            start_date: Optional[datetime] = None) -> List[Dict]:
    """
    Scan transits from outer planets to composite chart over a time period.

    Uses Swiss Ephemeris for precise planet positions (sub-arc-second accuracy).
    Samples biweekly (every 14 days) to catch all major aspects.
    De-duplicates: same transit_planet + composite_point + aspect = 1 event
    (keeps the tightest orb occurrence).

    Args:
        composite_longitudes: Dict mapping planet name → longitude (0-360).
                              e.g. {'Sun': 45.2, 'Moon': 123.5, ...}
        months: Number of months to scan ahead (default 12)
        start_date: Start of scan window (default now)

    Returns:
        List of TransitEvent dicts: [{ date, label, impact }, ...]
    """
    if not composite_longitudes:
        return []

    if start_date is None:
        start_date = datetime.utcnow()

    total_weeks = months * 4
    sample_interval = 14  # days

    # Track best (tightest orb) hit per unique transit
    best_hits: Dict[str, Dict] = {}

    for week in range(total_weeks):
        sample_date = start_date + timedelta(days=week * sample_interval)
        sample_jd = datetime_to_jd(sample_date)

        # Get precise positions for all transit planets at this date
        transit_positions = get_all_planet_positions(sample_jd, TRANSIT_PLANETS)

        for transit_planet, t_pos in transit_positions.items():
            transit_lon = t_pos['longitude']

            for point_name, point_lon in composite_longitudes.items():
                if point_name not in COMPOSITE_RECEIVERS:
                    continue

                angle = calculate_angle_difference(transit_lon, point_lon)
                aspect = identify_aspect(angle, orb_multiplier=1.0)

                if aspect is None:
                    continue

                aspect_name = aspect['aspect']
                # Only track major aspects for composite transits
                if aspect_name not in ASPECT_SIGN:
                    continue

                key = f"{transit_planet}-{point_name}-{aspect_name}"
                orb = aspect['orb']

                existing = best_hits.get(key)
                if existing is None or orb < existing['orb']:
                    best_hits[key] = {
                        'date': sample_date,
                        'transit_planet': transit_planet,
                        'composite_point': point_name,
                        'aspect_name': aspect_name,
                        'aspect_symbol': aspect.get('symbol', ''),
                        'aspect_quality': aspect.get('quality', ''),
                        'orb': orb,
                        'applying': aspect.get('applying', None),
                    }

    # Convert best hits to TransitEvent dicts
    events = []
    for hit in best_hits.values():
        date_str = hit['date'].strftime('%Y-%m')
        label = f"{hit['transit_planet']} {hit['aspect_name'].lower()} composite {hit['composite_point']}"
        impact = _build_impact(
            hit['transit_planet'],
            hit['composite_point'],
            hit['aspect_name'],
        )

        events.append({
            'date': date_str,
            'label': label,
            'impact': impact,
            # Extra metadata for richer frontend rendering
            'transitPlanet': hit['transit_planet'],
            'compositePoint': hit['composite_point'],
            'aspect': hit['aspect_name'],
            'aspectSymbol': hit['aspect_symbol'],
            'aspectQuality': hit['aspect_quality'],
            'orb': round(hit['orb'], 2),
            'applying': hit['applying'],
        })

    events.sort(key=lambda e: e['date'])
    return events


# =============================================================================
# FULL PIPELINE
# =============================================================================

def build_composite_transit_story(composite_longitudes: Dict[str, float],
                                  months: int = 12,
                                  start_date: Optional[datetime] = None) -> Dict:
    """
    Run the complete transit → story pipeline for a composite chart.

    Args:
        composite_longitudes: Dict mapping planet name → longitude (0-360)
        months: Scan window in months
        start_date: Start of scan (default now)

    Returns:
        {
            'events':           List[TransitEvent],
            'storyBeats':       List[StoryBeat],
            'seasonalChapters': List[SeasonalChapter],
            'summary': {
                'totalEvents':      int,
                'opensCount':       int,
                'testsCount':       int,
                'seasonCount':      int,
                'dominantChamber':  str | None,
            }
        }
    """
    events = scan_composite_transits(composite_longitudes, months, start_date)
    story_beats = [_generate_story_beat(e) for e in events]
    seasonal_chapters = _build_seasonal_chapters(story_beats)

    # Summary statistics
    opens_count = sum(1 for b in story_beats if b['direction'] == 'opens')
    tests_count = sum(1 for b in story_beats if b['direction'] == 'tests')

    # Find dominant chamber (most frequently impacted)
    chamber_counts: Dict[str, int] = {}
    for beat in story_beats:
        ch = beat.get('chamber', '')
        chamber_counts[ch] = chamber_counts.get(ch, 0) + 1
    dominant = max(chamber_counts, key=chamber_counts.get) if chamber_counts else None

    return {
        'events': events,
        'storyBeats': story_beats,
        'seasonalChapters': seasonal_chapters,
        'summary': {
            'totalEvents': len(events),
            'opensCount': opens_count,
            'testsCount': tests_count,
            'seasonCount': len(seasonal_chapters),
            'dominantChamber': dominant,
        },
    }
