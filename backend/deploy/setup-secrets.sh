#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# LUNA VOICE - GCP Secret Manager Setup
# ═══════════════════════════════════════════════════════════════════════════════
#
# Run this script to set up secrets in Google Cloud Secret Manager.
# Make sure you have gcloud CLI installed and authenticated.
#
# Usage: ./setup-secrets.sh
# ═══════════════════════════════════════════════════════════════════════════════

set -e

echo "═══════════════════════════════════════════════════════════════════"
echo "  LUNA VOICE - Secret Manager Setup"
echo "═══════════════════════════════════════════════════════════════════"

# Get current project
PROJECT=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT" ] || [ "$PROJECT" == "(unset)" ]; then
    echo "Error: No GCP project set. Run: gcloud config set project YOUR_PROJECT"
    exit 1
fi

echo "Project: $PROJECT"
echo ""

# Enable Secret Manager API
echo "[1/4] Enabling Secret Manager API..."
gcloud services enable secretmanager.googleapis.com --quiet

# Function to create or update secret
create_secret() {
    local NAME=$1
    local PROMPT=$2

    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Secret: $NAME"
    echo "$PROMPT"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Check if secret exists
    if gcloud secrets describe "$NAME" &>/dev/null; then
        echo "Secret already exists. Enter new value to update, or press Enter to skip:"
    else
        echo "Enter the secret value:"
    fi

    read -s -p "> " VALUE
    echo ""

    if [ -z "$VALUE" ]; then
        echo "Skipping $NAME"
        return
    fi

    # Create or update secret
    if gcloud secrets describe "$NAME" &>/dev/null; then
        echo -n "$VALUE" | gcloud secrets versions add "$NAME" --data-file=-
        echo "Updated $NAME"
    else
        echo -n "$VALUE" | gcloud secrets create "$NAME" --data-file=-
        echo "Created $NAME"
    fi
}

# Get Compute Engine default service account
echo ""
echo "[2/4] Getting service account..."
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT" --format="value(projectNumber)")
SERVICE_ACCOUNT="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
echo "Service Account: $SERVICE_ACCOUNT"

# Create secrets
echo ""
echo "[3/4] Setting up secrets..."

create_secret "GROQ_API_KEY" "Get your key at: https://console.groq.com (required for STT/LLM)"
create_secret "ELEVENLABS_API_KEY" "Get your key at: https://elevenlabs.io (required for TTS)"
create_secret "OPENAI_API_KEY" "Get your key at: https://platform.openai.com (optional)"

# Grant access to secrets
echo ""
echo "[4/4] Granting Cloud Run access to secrets..."

for SECRET in GROQ_API_KEY ELEVENLABS_API_KEY OPENAI_API_KEY; do
    if gcloud secrets describe "$SECRET" &>/dev/null; then
        gcloud secrets add-iam-policy-binding "$SECRET" \
            --member="serviceAccount:$SERVICE_ACCOUNT" \
            --role="roles/secretmanager.secretAccessor" \
            --quiet 2>/dev/null || true
        echo "Granted access to $SECRET"
    fi
done

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "  Setup Complete!"
echo "═══════════════════════════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo "  1. cd backend"
echo "  2. gcloud builds submit --config=deploy/cloudbuild.yaml"
echo ""
