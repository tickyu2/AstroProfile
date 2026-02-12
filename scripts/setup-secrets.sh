#!/bin/bash
# ============================================================================
# GCP Secret Manager Setup Script
# Run this once to store all secrets in Firebase/GCP Secret Manager.
# Each command will prompt you for the secret value interactively.
#
# Usage: bash scripts/setup-secrets.sh
# ============================================================================

echo "=== Firebase Secret Manager Setup ==="
echo "You will be prompted for each secret value."
echo ""

# --- LLM API Keys ---
echo "--- LLM API Keys ---"
firebase functions:secrets:set ANTHROPIC_API_KEY
firebase functions:secrets:set OPENAI_API_KEY
firebase functions:secrets:set GEMINI_API_KEY
firebase functions:secrets:set GROK_API_KEY
firebase functions:secrets:set DEEPSEEK_API_KEY
firebase functions:secrets:set GROQ_API_KEY
firebase functions:secrets:set TAVILY_API_KEY

# --- Image Generation ---
echo "--- Image Generation ---"
firebase functions:secrets:set STABILITY_API_KEY
firebase functions:secrets:set LEONARDO_API_KEY

# --- Voice & Audio ---
echo "--- Voice & Audio ---"
firebase functions:secrets:set ELEVENLABS_API_KEY

# --- Neo4j ---
echo "--- Neo4j ---"
firebase functions:secrets:set NEO4J_URI
firebase functions:secrets:set NEO4J_PASSWORD

# --- PostgreSQL / Cloud SQL ---
echo "--- PostgreSQL ---"
firebase functions:secrets:set PG_PASSWORD
firebase functions:secrets:set DB_PASSWORD

# --- Utility ---
echo "--- Utility ---"
firebase functions:secrets:set TIMEZONEDB_API_KEY
firebase functions:secrets:set ADMIN_KEY

echo ""
echo "=== Done! Verify with: firebase functions:secrets:access SECRET_NAME ==="
echo ""
echo "Non-secret config (NEO4J_USER, DB_HOST, NODE_ENV, etc.) stays in .env files."
