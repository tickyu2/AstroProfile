# Quick Security & Configuration Audit — GENESIS (astroprofile)

Summary of high-priority findings (short):

- Committed secrets: `./.env` and `./functions/.env` contain plaintext API keys and client secrets.
- Service account JSON present at repository root: `astroprofile-391e6-e3277f82db70.json` (contains private key).
- Many Cloud Functions expect secrets via `process.env` and Firebase Secrets (there are scripts to set them), but plaintext values are committed.
- Firestore rules are strict and well-structured; functions use `admin.auth().verifyIdToken()` and `HttpsError` patterns.
- `functions-python/venv` and `node_modules/` directories exist in the workspace (ensure not committed to git; they are in `.gitignore`).

Immediate remediation (do these now):

1) Remove sensitive files from repo and stop tracking them:

```bash
# remove from git tracking
git rm --cached .env functions/.env astroprofile-391e6-e3277f82db70.json
git commit -m "chore: remove committed secrets"
git push
```

2) Purge secrets from git history (recommended):

- Use BFG or `git filter-repo` to remove the files from history, then force-push to your remote. Example (BFG):

```bash
# backup first
git clone --mirror <repo-url> repo-mirror.git
cd repo-mirror.git
bfg --delete-files .env
bfg --delete-files "astroprofile-*.json"
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push --force
```

3) Rotate all exposed credentials immediately (invalidate keys and create new ones):

- Google service account: revoke the leaked key and create a new service account key in GCP.
- Any API keys found in `.env` and `functions/.env` (GROQ, Tavily, Neo4j secret, Google AI key, Groq, etc.) — rotate them at provider consoles.

4) Move secrets into secure storage and remove plaintext from repo:

- Use Firebase Functions secrets or GCP Secret Manager for production. The repo includes `scripts/setup-secrets.sh` — use it after adding secrets via `firebase functions:secrets:set`.
- Keep only placeholders in `.env.example`.

Further recommended steps:

- Add secret scanning and a pre-commit hook (`git-secrets`, `detect-secrets`) and CI checks to fail builds if secrets are present.
- Audit `functions/` code paths for any accidental direct string usage of keys and replace with `process.env` or secrets lookup.
- Review access logs and rotate any tokens that may have been used since leakage.

Files to address immediately:

- `./.env` (contains Neo4j client secret and other placeholders)
- `./functions/.env` (contains GROQ, GOOGLE_AI_API_KEY, TAVILY_API_KEY, etc.)
- `astroprofile-391e6-e3277f82db70.json` (service account)

Commands to set secrets in Firebase (example):

```bash
# set secrets in project (run from workspace root)
firebase functions:secrets:set OPENAI_API_KEY --project astroprofile-391e6
firebase functions:secrets:set ANTHROPIC_API_KEY --project astroprofile-391e6
firebase functions:secrets:set NEO4J_PASSWORD --project astroprofile-391e6
```

If you want, I can:
- prepare the exact `git filter-repo` or BFG commands for your repo and run them locally (I can't force-push on your behalf), or
- create a small script to automate removal + create an updated `.env.example` and commit that change.

Next immediate ask: confirm whether you want me to generate the BFG/filter-repo command set and an updated `.env.example` file.

Detected sensitive items (found in repository):

- `./.env` — contains `VITE_NEO4J_CLIENT_ID` and `VITE_NEO4J_CLIENT_SECRET` (Neo4j credentials).
- `./functions/.env` — contains `GOOGLE_AI_API_KEY` (starts with `AIza`), `GROQ_API_KEY` (starts with `gsk_`), `TAVILY_API_KEY`, `PG`/DB credentials, and other provider keys.
- `astroprofile-391e6-e3277f82db70.json` — service account JSON with `private_key`.
- `scripts/setup-secrets.sh` — prescriptive list of secrets that should be set in Secret Manager (useful for remediation).
- References across `functions/` and `functions-python/` for environment secret usage (calls to `process.env` and `SecretParam`), and `scripts/setup_rag_complete.sh` and other helper scripts with secret examples.

Where else to search (already scanned):

- `functions/` code uses `process.env.*` and Firebase Secret declarations (many `routes/*` files reference `secrets: [...]`).
- Frontend uses `import.meta.env.VITE_*` for configurable endpoints and keys; ensure no secret values are checked into frontend files.

Detailed remediation checklist (actionable):

1) Immediately rotate credentials listed above:
	- Revoke and delete the leaked service account key in GCP IAM & Admin, then create a new service account key and update your deployment secrets.
	- Revoke/rotate API keys at provider consoles for GROQ, Tavily, Google, Neo4j, Grok, ElevenLabs, etc.

2) Remove sensitive files from git history and working tree:
	- Locally remove tracked files, commit, push:

```bash
git rm --cached .env functions/.env astroprofile-391e6-e3277f82db70.json
git commit -m "chore(secrets): remove leaked env and service account"
git push origin main
```

	- Use BFG or `git filter-repo` to cleanse history (recommended). Example using BFG:

```bash
# clone a mirror
git clone --mirror git@github.com:YOUR_ORG/YOUR_REPO.git repo-mirror.git
cd repo-mirror.git
# remove files by name
bfg --delete-files .env
bfg --delete-files functions/.env
bfg --delete-files "astroprofile-*.json"
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

3) Move secrets into secure stores and update deploy processes:
	- For Cloud Functions, use Firebase Secrets (`firebase functions:secrets:set <NAME>`), then reference via Secret Manager bindings in `functions/index.js` or runtime config as implemented in this repo.
	- For frontend-only keys (non-secret), keep `VITE_` placeholders in `.env.example` and load via CI or hosting environment variables.

4) Create safe placeholders and CI guard rails:
	- Add or update `.env.example` replacing values with placeholders and commit that file.
	- Add secret-detection to GitHub Actions/CI (e.g., `trufflesecurity/detect-secrets-action` or `github/secret-scanning` rules) and a pre-commit hook (`git-secrets` or `detect-secrets`).

5) Verify and re-deploy safely:
	- After rotating keys and pushing history-clean changes, re-deploy Cloud Functions using secrets from Secret Manager rather than plaintext files.
	- Run `firebase deploy --only functions` after verifying environment is secure.

6) Audit access and logs:
	- Check GCP IAM logs, Google Cloud Console, and provider dashboards for suspicious activity and revoke any tokens that may have been used.

Automatable remediation I can prepare for you (pick one):

- A BFG command script tailored to remove the three detected files and instructions to safely force-push the cleaned mirror.
- A small helper script to generate `./.env.example` from the current `.env`/`functions/.env` (stripping values to placeholders), commit it, and add `.env` entries to `.gitignore` if missing.

Progress: next I can prepare the BFG/filter-repo commands and create a `c:\astroprofile\.env.example` file — which do you want first?
