# Match Notification Worker - Telegram Wiring

## File
- `functions-python/scripts/match_notification_worker.py`

## Real Telegram send enabled
The worker now sends Telegram notifications through Bot API when env is set:
- `TELEGRAM_BOT_TOKEN`

It resolves chat id from payload in this order:
1. `payload.telegramChatId`
2. `payload.chatId`
3. `owner_user_id` (if numeric)

## Example payload for telegram channel
```json
{
  "text": "You have a new compatibility match (0.87)",
  "telegramChatId": "6861902233"
}
```

## Run
```bash
cd C:\astroprofile\functions-python
set TELEGRAM_BOT_TOKEN=123456:ABCDEF
python scripts\match_notification_worker.py
```

## Notes
- In-app/email handlers remain stubs for now.
- Failed sends are retried after 10 minutes.
