"""
western_engine/chart_shape_detector.py

Chart shape detection using Marc Edmund Jones' classifications.

Chart Shapes:
- Bowl: All planets within 180 degrees
- Bucket: Bowl with one planet as "handle" opposite
- Locomotive: Planets span 2/3 of chart (240°), 1/3 empty
- Bundle: All planets within 120 degrees
- Splash: Planets distributed evenly
- Seesaw: Two groups of planets opposite each other
- Splay: Irregular distribution with stelliums
"""

from typing import List, Dict, Optional, Tuple
from statistics import variance, mean
from .models import PlanetPosition, ChartShapeResult


def normalize_degree(degree: float) -> float:
    """Normalize degree to 0-360 range."""
    return degree % 360


def calculate_gaps(longitudes: List[float]) -> List[float]:
    """
    Calculate gaps between consecutive planets.

    Args:
        longitudes: Sorted list of planet longitudes

    Returns:
        List of gaps (in degrees) going counterclockwise
    """
    n = len(longitudes)
    if n < 2:
        return [360.0]

    gaps = []
    for i in range(n):
        next_i = (i + 1) % n
        gap = (longitudes[next_i] - longitudes[i]) % 360
        if gap == 0:
            gap = 360  # Handle exact conjunction
        gaps.append(gap)

    return gaps


def detect_chart_shape(planets: List[PlanetPosition]) -> ChartShapeResult:
    """
    Detect Marc Edmund Jones chart shapes.

    Args:
        planets: List of planet positions

    Returns:
        ChartShapeResult with primary shape and scores
    """
    if len(planets) < 3:
        return ChartShapeResult(
            primary_shape="splash",
            scores={"splash": 1.0},
            span=0,
            max_gap=360,
            handle_planet=None
        )

    # Get sorted longitudes
    longitudes = sorted([p.longitude for p in planets])
    planet_by_long = {p.longitude: p.planet for p in planets}

    # Calculate gaps
    gaps = calculate_gaps(longitudes)
    max_gap = max(gaps)
    max_gap_idx = gaps.index(max_gap)

    # Calculate span (occupied arc)
    span = 360 - max_gap

    # Initialize scores
    scores = {
        "bowl": 0.0,
        "bucket": 0.0,
        "locomotive": 0.0,
        "bundle": 0.0,
        "splash": 0.0,
        "seesaw": 0.0,
        "splay": 0.0
    }

    # Handle planet for bucket detection
    handle_planet: Optional[str] = None

    # =================================================================
    # BUNDLE: All planets within 120 degrees
    # =================================================================
    if span <= 130:
        # Strong bundle
        bundle_score = 1.0 - (span / 130)
        scores["bundle"] = min(1.0, bundle_score * 1.2)

    # =================================================================
    # BOWL: All planets within 180 degrees
    # =================================================================
    if 150 <= span <= 200:
        # Bowl score peaks at 180
        bowl_score = 1.0 - abs(span - 180) / 50
        scores["bowl"] = max(0, bowl_score)

    # =================================================================
    # BUCKET: Bowl with one planet opposite as "handle"
    # =================================================================
    if 150 <= span <= 200:
        # Check if there's a single planet opposite the main group
        # The handle should be in the empty hemisphere
        handle_candidate = detect_bucket_handle(planets, longitudes, gaps, max_gap_idx)
        if handle_candidate:
            handle_planet = handle_candidate
            scores["bucket"] = scores["bowl"] * 1.1  # Bucket is more specific
            scores["bowl"] *= 0.5  # Reduce bowl score if bucket

    # =================================================================
    # LOCOMOTIVE: Span 210-280 degrees (2/3 of chart)
    # =================================================================
    if 200 <= span <= 290:
        # Locomotive score peaks at 240 (2/3 of 360)
        loco_score = 1.0 - abs(span - 240) / 60
        scores["locomotive"] = max(0, loco_score)

    # =================================================================
    # SPLASH: Relatively even distribution
    # =================================================================
    # Low gap variance indicates even distribution
    gap_variance = variance(gaps) if len(gaps) > 1 else 0
    if gap_variance < 600:
        splash_score = max(0, 1.0 - gap_variance / 600)
        scores["splash"] = splash_score * 0.8  # Cap at 0.8

    # =================================================================
    # SEESAW: Two groups with two large gaps
    # =================================================================
    sorted_gaps = sorted(gaps, reverse=True)
    if len(sorted_gaps) >= 2:
        if sorted_gaps[0] > 50 and sorted_gaps[1] > 50:
            # Two significant gaps
            other_gaps = sorted_gaps[2:] if len(sorted_gaps) > 2 else []
            if not other_gaps or max(other_gaps) < 45:
                # Remaining gaps are small - this is a seesaw
                seesaw_score = min(1.0, (sorted_gaps[0] + sorted_gaps[1]) / 240)
                scores["seesaw"] = seesaw_score

    # =================================================================
    # SPLAY: Irregular with stelliums
    # =================================================================
    # Check for stelliums (multiple planets close together)
    stellium_groups = detect_stellium_clusters(longitudes)
    if len(stellium_groups) >= 2 and max(len(g) for g in stellium_groups) >= 3:
        # Multiple groups with at least one stellium
        splay_score = 0.6 + len(stellium_groups) * 0.1
        scores["splay"] = min(1.0, splay_score)

    # =================================================================
    # DETERMINE PRIMARY SHAPE
    # =================================================================
    primary_shape = max(scores, key=scores.get)

    # If no clear winner, default to splash
    if scores[primary_shape] < 0.3:
        primary_shape = "splash"
        scores["splash"] = max(scores["splash"], 0.5)

    return ChartShapeResult(
        primary_shape=primary_shape,
        scores=scores,
        span=round(span, 2),
        max_gap=round(max_gap, 2),
        handle_planet=handle_planet
    )


def detect_bucket_handle(
    planets: List[PlanetPosition],
    longitudes: List[float],
    gaps: List[float],
    max_gap_idx: int
) -> Optional[str]:
    """
    Detect if there's a bucket handle (single planet in empty hemisphere).

    The handle should be:
    1. A single planet (or tight conjunction)
    2. Located in the largest gap
    3. Roughly opposite the center of the occupied hemisphere
    """
    if len(planets) < 4:
        return None

    # Find the center of the empty area
    gap_start = longitudes[max_gap_idx]
    max_gap = gaps[max_gap_idx]
    gap_center = normalize_degree(gap_start + max_gap / 2)

    # Find planets near the gap center
    candidates = []
    for planet in planets:
        # Check if planet is in the gap
        dist_from_gap_start = (planet.longitude - gap_start) % 360
        if dist_from_gap_start < max_gap:
            # Check if roughly in the middle of the gap
            dist_from_center = abs(planet.longitude - gap_center)
            if dist_from_center > 180:
                dist_from_center = 360 - dist_from_center
            if dist_from_center < max_gap / 4:
                candidates.append((planet, dist_from_center))

    if len(candidates) == 1:
        return candidates[0][0].planet
    elif len(candidates) == 2:
        # Check if they're in tight conjunction (could be a double handle)
        p1, p2 = candidates[0][0], candidates[1][0]
        if abs(p1.longitude - p2.longitude) < 10:
            return f"{p1.planet}+{p2.planet}"

    return None


def detect_stellium_clusters(
    longitudes: List[float],
    orb: float = 15.0
) -> List[List[float]]:
    """
    Detect clusters of planets that might form stelliums.

    Args:
        longitudes: Sorted list of planet longitudes
        orb: Maximum degrees between planets in a cluster

    Returns:
        List of clusters (each cluster is a list of longitudes)
    """
    if len(longitudes) < 2:
        return []

    clusters = []
    current_cluster = [longitudes[0]]

    for i in range(1, len(longitudes)):
        gap = (longitudes[i] - longitudes[i-1]) % 360
        if gap <= orb:
            current_cluster.append(longitudes[i])
        else:
            if len(current_cluster) >= 2:
                clusters.append(current_cluster)
            current_cluster = [longitudes[i]]

    # Don't forget the last cluster
    if len(current_cluster) >= 2:
        clusters.append(current_cluster)

    # Check wrap-around (first and last planets)
    if len(clusters) >= 2:
        wrap_gap = (longitudes[0] + 360 - longitudes[-1]) % 360
        if wrap_gap <= orb:
            # Merge first and last clusters
            clusters[0] = clusters[-1] + clusters[0]
            clusters.pop()

    return clusters


def get_chart_shape_vector(shape_result: ChartShapeResult) -> Dict[str, float]:
    """
    Extract 6-dimensional chart shape vector.

    Returns normalized scores for each shape type.
    """
    return {
        "bowl": shape_result.scores.get("bowl", 0.0),
        "bucket": shape_result.scores.get("bucket", 0.0),
        "locomotive": shape_result.scores.get("locomotive", 0.0),
        "bundle": shape_result.scores.get("bundle", 0.0),
        "splash": shape_result.scores.get("splash", 0.0),
        "seesaw": shape_result.scores.get("seesaw", 0.0)
    }


def interpret_chart_shape(shape_result: ChartShapeResult) -> str:
    """
    Generate interpretation for chart shape.
    """
    interpretations = {
        "bowl": "Self-contained and focused. Driven by what's missing in life. "
                "Strong concentration of energy in one area.",
        "bucket": "Directed focus with all energy channeled through the handle planet. "
                  "Strong sense of purpose and mission.",
        "locomotive": "Self-driving and determined. Strong initiative and forward momentum. "
                      "Success through persistent effort.",
        "bundle": "Highly focused specialist. Concentrated energy in a narrow area. "
                  "May struggle with matters outside their focus.",
        "splash": "Versatile and universal awareness. Interests scattered across many areas. "
                  "Jack of all trades, master of none.",
        "seesaw": "Balances between two opposing forces. Diplomatic and sees both sides. "
                  "May experience life as a series of either/or choices.",
        "splay": "Individualistic and nonconformist. Strong focal points but irregular pattern. "
                 "Resists categorization."
    }

    shape = shape_result.primary_shape
    confidence = shape_result.scores.get(shape, 0)

    base_interp = interpretations.get(shape, "Mixed chart pattern.")

    if confidence >= 0.8:
        return f"Strong {shape.title()} pattern. {base_interp}"
    elif confidence >= 0.5:
        return f"{shape.title()} tendency. {base_interp}"
    else:
        return f"Mild {shape} influence. Chart shows mixed patterns."
