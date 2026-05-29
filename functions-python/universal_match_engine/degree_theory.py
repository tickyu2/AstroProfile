from typing import Dict

# Minimal degree-theory helper (pluggable to your internal degree rules)
# You can replace CRITICAL_DEGREES with your own doctrine.
CRITICAL_DEGREES = {0, 13, 26, 29}


def degree_bucket(deg: float) -> int:
    # 0..29 -> bucket index
    d = int(deg) % 30
    return d


def decan_index(deg: float) -> int:
    # 0,1,2 for each 10-degree segment
    d = int(deg) % 30
    return d // 10


def is_critical_degree(deg: float) -> bool:
    d = int(round(deg)) % 30
    return d in CRITICAL_DEGREES


def degree_features_for_lon(prefix: str, lon: float) -> Dict[str, float]:
    deg = lon % 30.0
    return {
        f"{prefix}_deg": float(deg),
        f"{prefix}_decan": float(decan_index(deg)),
        f"{prefix}_critical": 1.0 if is_critical_degree(deg) else 0.0,
        f"{prefix}_deg_bucket": float(degree_bucket(deg)),
    }


def pair_degree_resonance(user_deg: float, cand_deg: float) -> float:
    # Simple resonance: same/near degree stronger
    d = abs((user_deg - cand_deg) % 30.0)
    d = min(d, 30.0 - d)
    # 0deg => 1.0 ; 15deg => 0.0
    return max(0.0, 1.0 - (d / 15.0))
