from typing import Dict, Tuple

# Lightweight Sabian mapping scaffold.
# Replace text_map with your canonical Sabian library if needed.

def sabian_key_from_lon(lon: float) -> int:
    # 1..360 symbolic key
    k = int(lon % 360) + 1
    if k < 1: k = 1
    if k > 360: k = 360
    return k


def sabian_theme(key: int) -> str:
    # Placeholder thematic clustering by modulo groups.
    groups = [
        "initiative", "stability", "communication", "care", "creativity",
        "service", "harmony", "transformation", "vision", "discipline"
    ]
    return groups[key % len(groups)]


def sabian_features_for_lon(prefix: str, lon: float) -> Dict[str, float]:
    key = sabian_key_from_lon(lon)
    # compact numeric representation
    return {
        f"{prefix}_sabian_key": float(key),
        f"{prefix}_sabian_cluster": float(key % 10),
    }


def sabian_resonance(user_key: int, cand_key: int) -> float:
    # Same cluster strong; nearby symbolic distance moderate.
    if (user_key % 10) == (cand_key % 10):
        return 0.9
    d = abs(user_key - cand_key)
    d = min(d, 360 - d)
    return max(0.2, 1.0 - (d / 180.0))
