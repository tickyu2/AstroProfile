"""Batch worker: consume Firestore match_queue, compute matches, write candidates + notifications."""
import json
from firebase_admin import initialize_app, firestore
from sqlalchemy import create_engine, text
from universal_match_engine import EngineConfig, UniversalCompatibilityEngine, BirthInput


def _birth_from_profile(p):
    b = p.get("birth") or p
    return BirthInput(
        birth_date=b["birthDate"],
        birth_time=b["birthTime"],
        latitude=float(b["latitude"]),
        longitude=float(b["longitude"]),
        timezone=b.get("timezone", "UTC"),
    )


def _resolve_telegram_chat_id(db, profile: dict) -> str | None:
    # 1) profile-level common keys
    candidates = [
        profile.get("telegramUserId"),
        profile.get("telegramChatId"),
        ((profile.get("telegram") or {}).get("userId") if isinstance(profile.get("telegram"), dict) else None),
        ((profile.get("telegram") or {}).get("chatId") if isinstance(profile.get("telegram"), dict) else None),
        ((profile.get("contact") or {}).get("telegramUserId") if isinstance(profile.get("contact"), dict) else None),
    ]
    for c in candidates:
        if c:
            return str(c)

    # 2) owner user doc fallback (users/{ownerUserId})
    owner = profile.get("ownerUserId")
    if owner:
        usnap = db.collection("users").document(str(owner)).get()
        if usnap.exists:
            u = usnap.to_dict() or {}
            user_candidates = [
                u.get("telegramUserId"),
                u.get("telegramChatId"),
                ((u.get("telegram") or {}).get("userId") if isinstance(u.get("telegram"), dict) else None),
                ((u.get("telegram") or {}).get("chatId") if isinstance(u.get("telegram"), dict) else None),
            ]
            for c in user_candidates:
                if c:
                    return str(c)

    return None


def run_once(limit=50):
    initialize_app()
    db = firestore.client()
    cfg = EngineConfig()
    eng = UniversalCompatibilityEngine(cfg)
    eng.ensure_schema()
    sql = create_engine(cfg.pg_dsn, future=True)

    qdocs = db.collection("match_queue").where("status", "==", "queued").limit(limit).stream()
    for d in qdocs:
        item = d.to_dict() or {}
        profile_id = item.get("profileId")
        try:
            d.reference.set({"status": "running", "startedAt": firestore.SERVER_TIMESTAMP}, merge=True)
            psnap = db.collection("profiles").document(profile_id).get()
            if not psnap.exists:
                raise Exception("profile not found")
            p = psnap.to_dict() or {}
            if not p.get("matchOptIn"):
                d.reference.set({"status": "done", "note": "opted_out"}, merge=True)
                continue

            birth = _birth_from_profile(p)
            psych = p.get("psych", {})
            matches = eng.match_user(profile_id, birth, psych)

            min_score = float((p.get("matchSettings", {}) or {}).get("minScoreToNotify", 0.82))
            mutual_only = bool((p.get("matchSettings", {}) or {}).get("mutualOnly", True))
            prefs = p.get("notificationPrefs", {}) or {}
            channels = [
                c for c, on in [
                    ("in_app", prefs.get("inApp", True)),
                    ("telegram", prefs.get("telegram", False)),
                    ("email", prefs.get("email", False)),
                ] if on
            ]

            telegram_chat_id = _resolve_telegram_chat_id(db, p)
            owner = p.get("ownerUserId")

            with sql.begin() as conn:
                for m in matches:
                    conn.execute(text("""
                        INSERT INTO match_candidates(profile_id,candidate_profile_id,score,score_breakdown,reasons,mutual_eligible)
                        VALUES (:p,:c,:s,:b::jsonb,:r::jsonb,:me)
                        ON CONFLICT (profile_id,candidate_profile_id)
                        DO UPDATE SET score=EXCLUDED.score, score_breakdown=EXCLUDED.score_breakdown, reasons=EXCLUDED.reasons, mutual_eligible=EXCLUDED.mutual_eligible, created_at=now()
                    """), {
                        "p": profile_id,
                        "c": m.candidate_id,
                        "s": m.total_score,
                        "b": json.dumps(m.explain),
                        "r": json.dumps(m.reasons),
                        "me": True,
                    })

                    if m.total_score >= min_score:
                        csnap = db.collection("profiles").document(m.candidate_id).get()
                        c = csnap.to_dict() if csnap.exists else {}
                        c_opt = bool(c.get("matchOptIn"))
                        if mutual_only and not c_opt:
                            continue

                        for ch in channels:
                            # Safety: skip telegram notifications if no chat id can be resolved
                            if ch == "telegram" and not telegram_chat_id:
                                continue

                            payload = {
                                "text": f"New match for {p.get('displayName','profile')}: score {m.total_score}",
                                "score": m.total_score,
                                "reasons": m.reasons,
                            }
                            if ch == "telegram":
                                payload["telegramChatId"] = telegram_chat_id

                            conn.execute(text("""
                                INSERT INTO match_notifications(owner_user_id,profile_id,candidate_profile_id,channel,payload,status)
                                VALUES (:o,:p,:c,:ch,:pl::jsonb,'pending')
                            """), {
                                "o": owner,
                                "p": profile_id,
                                "c": m.candidate_id,
                                "ch": ch,
                                "pl": json.dumps(payload),
                            })

            d.reference.set({"status": "done", "completedAt": firestore.SERVER_TIMESTAMP}, merge=True)
        except Exception as ex:
            d.reference.set({"status": "failed", "error": str(ex), "completedAt": firestore.SERVER_TIMESTAMP}, merge=True)


if __name__ == "__main__":
    run_once()

