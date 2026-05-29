"""72-zone compatibility scoring.

Each sign is divided into 6 zones of 5° each (0-5, 5-10, ..., 25-30).
72 total zones across the zodiac.  Zones sharing the same element or
modality resonate more strongly.
"""

SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
]

ELEMENT = {
    "Aries": "Fire", "Leo": "Fire", "Sagittarius": "Fire",
    "Taurus": "Earth", "Virgo": "Earth", "Capricorn": "Earth",
    "Gemini": "Air", "Libra": "Air", "Aquarius": "Air",
    "Cancer": "Water", "Scorpio": "Water", "Pisces": "Water",
}

MODALITY = {
    "Aries": "Cardinal", "Cancer": "Cardinal", "Libra": "Cardinal", "Capricorn": "Cardinal",
    "Taurus": "Fixed", "Leo": "Fixed", "Scorpio": "Fixed", "Aquarius": "Fixed",
    "Gemini": "Mutable", "Virgo": "Mutable", "Sagittarius": "Mutable", "Pisces": "Mutable",
}


def get_zone_for_placement(sign: str, degree_in_sign: float) -> int:
    """Return 1-based zone number (1..72) for a sign + degree."""
    sign_idx = SIGNS.index(sign) if sign in SIGNS else 0
    zone_in_sign = min(int(degree_in_sign // 5), 5)  # 0..5
    return sign_idx * 6 + zone_in_sign + 1


def _zone_distance(z1: int, z2: int) -> int:
    """Circular distance between two zones (1..72)."""
    d = abs(z1 - z2) % 72
    return min(d, 72 - d)


def _placement_zone_score(sign_a: str, deg_a: float, sign_b: str, deg_b: float) -> float:
    """Score how well two placements align by zone, element, and modality."""
    za = get_zone_for_placement(sign_a, deg_a)
    zb = get_zone_for_placement(sign_b, deg_b)
    dist = _zone_distance(za, zb)

    # Same zone = 1.0, adjacent = 0.85, then linear decay
    if dist == 0:
        score = 1.0
    elif dist == 1:
        score = 0.85
    elif dist <= 6:
        score = 0.7 - (dist - 2) * 0.05
    else:
        score = max(0.2, 0.45 - (dist - 6) * 0.007)

    # Element bonus
    if ELEMENT.get(sign_a) == ELEMENT.get(sign_b):
        score = min(1.0, score + 0.12)

    # Modality bonus
    if MODALITY.get(sign_a) == MODALITY.get(sign_b):
        score = min(1.0, score + 0.06)

    return score


def compute_zone_compatibility_score(
    user_signs: dict,
    user_degrees: dict,
    cand_signs: dict,
    cand_degrees: dict,
) -> float:
    """Compute zone compatibility across all shared placements.

    Args:
        user_signs:   {placement: sign_name} e.g. {"sun": "Aries", "moon": "Cancer"}
        user_degrees: {placement: degree_in_sign} e.g. {"sun": 12.5, "moon": 8.3}
        cand_signs:   same shape for candidate
        cand_degrees: same shape for candidate

    Returns:
        float 0..1 composite zone compatibility score.
    """
    weights = {
        "sun": 1.5, "moon": 1.4, "asc": 1.2,
        "venus": 1.1, "mars": 1.0,
        "mercury": 0.9, "jupiter": 0.7, "saturn": 0.7,
    }
    total_w = 0.0
    total_s = 0.0
    for key in user_signs:
        if key not in cand_signs:
            continue
        w = weights.get(key, 0.8)
        s = _placement_zone_score(
            user_signs[key], float(user_degrees.get(key, 15.0)),
            cand_signs[key], float(cand_degrees.get(key, 15.0)),
        )
        total_w += w
        total_s += w * s

    return total_s / total_w if total_w > 0 else 0.5
