"""
Batch precompute compatibility vectors for existing users.

Usage:
  python scripts/precompute_vectors_batch.py --collection profiles --limit 1000
"""

import argparse
from typing import Dict, Any

from firebase_admin import initialize_app, firestore

from universal_match_engine import EngineConfig, UniversalCompatibilityEngine, BirthInput


def _safe_birth(doc: Dict[str, Any]):
    # expected in profile doc: birthDate, birthTime, latitude, longitude, timezone
    b = doc.get("birth") or doc
    required = ["birthDate", "birthTime", "latitude", "longitude"]
    if not all(k in b for k in required):
        return None
    return BirthInput(
        birth_date=str(b["birthDate"]),
        birth_time=str(b["birthTime"]),
        latitude=float(b["latitude"]),
        longitude=float(b["longitude"]),
        timezone=str(b.get("timezone", "UTC")),
    )


def _safe_psych(doc: Dict[str, Any]) -> Dict[str, float]:
    p = doc.get("psych") or {}
    out = {}
    for k in ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"]:
        try:
            out[k] = float(p.get(k, 0.5))
        except Exception:
            out[k] = 0.5
    return out


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--collection", default="profiles", help="Firestore collection with user profiles")
    parser.add_argument("--limit", type=int, default=5000)
    args = parser.parse_args()

    initialize_app()
    db = firestore.client()

    engine = UniversalCompatibilityEngine(EngineConfig())
    engine.ensure_schema()

    docs = db.collection(args.collection).limit(args.limit).stream()

    ok = 0
    skipped = 0
    failed = 0

    for d in docs:
        user_id = d.id
        payload = d.to_dict() or {}
        birth = _safe_birth(payload)
        if not birth:
            skipped += 1
            continue

        psych = _safe_psych(payload)

        try:
            engine.upsert_user_profile(user_id=user_id, birth=birth, psych=psych)
            ok += 1
            if ok % 100 == 0:
                print(f"[progress] upserted={ok} skipped={skipped} failed={failed}")
        except Exception as ex:
            failed += 1
            print(f"[error] user={user_id} {ex}")

    print(f"DONE upserted={ok} skipped={skipped} failed={failed}")


if __name__ == "__main__":
    main()
