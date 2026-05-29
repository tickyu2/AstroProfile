"""Notification dispatcher worker for pending match_notifications.

Channels:
- telegram (real send via Telegram Bot API when TELEGRAM_BOT_TOKEN is set)
- in_app (stub)
- email (stub)
"""
import json
import os
from typing import Optional

import requests
from sqlalchemy import create_engine, text
from universal_match_engine import EngineConfig

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
TELEGRAM_API = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage" if TELEGRAM_BOT_TOKEN else None


def _resolve_telegram_chat_id(owner_user_id: str, payload: dict) -> Optional[str]:
    # Priority: payload.telegramChatId, payload.chatId, owner_user_id if numeric
    for k in ("telegramChatId", "chatId"):
        v = payload.get(k)
        if v:
            return str(v)

    # If owner_user_id already looks numeric (common in Telegram integrations), use it
    if str(owner_user_id).isdigit():
        return str(owner_user_id)

    return None


def send_telegram(owner_user_id: str, payload: dict):
    if not TELEGRAM_API:
        raise RuntimeError("TELEGRAM_BOT_TOKEN not configured")

    chat_id = _resolve_telegram_chat_id(owner_user_id, payload)
    if not chat_id:
        raise RuntimeError("No telegram chat id found (payload.telegramChatId/payload.chatId/owner_user_id)")

    text_msg = payload.get("text", "New compatibility match")
    body = {
        "chat_id": chat_id,
        "text": text_msg,
        "disable_web_page_preview": True,
    }
    r = requests.post(TELEGRAM_API, json=body, timeout=12)
    if r.status_code >= 300:
        raise RuntimeError(f"Telegram send failed {r.status_code}: {r.text[:400]}")


def send_in_app(owner_user_id: str, payload: dict):
    # TODO: integrate with in-app notification collection/service
    print(f"[in_app] to={owner_user_id} {payload.get('text')}")


def send_email(owner_user_id: str, payload: dict):
    # TODO: integrate with email provider
    print(f"[email] to={owner_user_id} {payload.get('text')}")


def run_once(limit=100):
    cfg = EngineConfig()
    db = create_engine(cfg.pg_dsn, future=True)

    with db.begin() as conn:
        rows = conn.execute(text("""
            SELECT id, owner_user_id, profile_id, candidate_profile_id, channel, payload
            FROM match_notifications
            WHERE status='pending' AND next_attempt_at <= now()
            ORDER BY created_at ASC
            LIMIT :lim
            FOR UPDATE SKIP LOCKED
        """), {"lim": limit}).fetchall()

        for r in rows:
            nid, owner, _, _, channel, payload = r
            payload = payload if isinstance(payload, dict) else json.loads(payload)
            try:
                if channel == 'telegram':
                    send_telegram(owner, payload)
                elif channel == 'in_app':
                    send_in_app(owner, payload)
                elif channel == 'email':
                    send_email(owner, payload)

                conn.execute(text("UPDATE match_notifications SET status='sent', sent_at=now(), error=NULL WHERE id=:id"), {"id": nid})
            except Exception as ex:
                conn.execute(text("""
                    UPDATE match_notifications
                    SET status='failed', error=:err, next_attempt_at = now() + interval '10 minutes'
                    WHERE id=:id
                """), {"id": nid, "err": str(ex)[:1000]})


if __name__ == "__main__":
    run_once()
