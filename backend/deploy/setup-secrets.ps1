# ═══════════════════════════════════════════════════════════════════════════════
# LUNA VOICE - GCP Secret Manager Setup (Windows PowerShell)
# ═══════════════════════════════════════════════════════════════════════════════
#
# Run this script to set up secrets in Google Cloud Secret Manager.
# Make sure you have gcloud CLI installed and authenticated.
#
# Usage: .\setup-secrets.ps1
# ═══════════════════════════════════════════════════════════════════════════════

$ErrorActionPreference = "Stop"

Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  LUNA VOICE - Secret Manager Setup" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor Cyan

# Get current project
$PROJECT = gcloud config get-value project 2>$null
if ([string]::IsNullOrEmpty($PROJECT) -or $PROJECT -eq "(unset)") {
    Write-Host "Error: No GCP project set." -ForegroundColor Red
    Write-Host "Run: gcloud config set project YOUR_PROJECT" -ForegroundColor Yellow
    exit 1
}

Write-Host "Project: $PROJECT" -ForegroundColor Green
Write-Host ""

# Enable Secret Manager API
Write-Host "[1/4] Enabling Secret Manager API..." -ForegroundColor Yellow
gcloud services enable secretmanager.googleapis.com --quiet

# Get service account
Write-Host ""
Write-Host "[2/4] Getting service account..." -ForegroundColor Yellow
$PROJECT_NUMBER = gcloud projects describe $PROJECT --format="value(projectNumber)"
$SERVICE_ACCOUNT = "${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
Write-Host "Service Account: $SERVICE_ACCOUNT" -ForegroundColor Green

# Function to create or update secret
function Set-Secret {
    param (
        [string]$Name,
        [string]$Prompt
    )

    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host "Secret: $Name" -ForegroundColor White
    Write-Host $Prompt -ForegroundColor Gray
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

    # Check if secret exists
    $exists = gcloud secrets describe $Name 2>$null
    if ($exists) {
        Write-Host "Secret already exists. Enter new value to update, or press Enter to skip:" -ForegroundColor Yellow
    } else {
        Write-Host "Enter the secret value:" -ForegroundColor Yellow
    }

    $SecureValue = Read-Host -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureValue)
    $Value = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

    if ([string]::IsNullOrEmpty($Value)) {
        Write-Host "Skipping $Name" -ForegroundColor Gray
        return
    }

    # Create or update secret
    if ($exists) {
        $Value | gcloud secrets versions add $Name --data-file=-
        Write-Host "Updated $Name" -ForegroundColor Green
    } else {
        $Value | gcloud secrets create $Name --data-file=-
        Write-Host "Created $Name" -ForegroundColor Green
    }
}

# Create secrets
Write-Host ""
Write-Host "[3/4] Setting up secrets..." -ForegroundColor Yellow

Set-Secret -Name "GROQ_API_KEY" -Prompt "Get your key at: https://console.groq.com (required for STT/LLM)"
Set-Secret -Name "ELEVENLABS_API_KEY" -Prompt "Get your key at: https://elevenlabs.io (required for TTS)"
Set-Secret -Name "OPENAI_API_KEY" -Prompt "Get your key at: https://platform.openai.com (optional)"

# Grant access to secrets
Write-Host ""
Write-Host "[4/4] Granting Cloud Run access to secrets..." -ForegroundColor Yellow

foreach ($SECRET in @("GROQ_API_KEY", "ELEVENLABS_API_KEY", "OPENAI_API_KEY")) {
    $exists = gcloud secrets describe $SECRET 2>$null
    if ($exists) {
        gcloud secrets add-iam-policy-binding $SECRET `
            --member="serviceAccount:$SERVICE_ACCOUNT" `
            --role="roles/secretmanager.secretAccessor" `
            --quiet 2>$null
        Write-Host "Granted access to $SECRET" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. cd backend" -ForegroundColor White
Write-Host "  2. gcloud builds submit --config=deploy/cloudbuild.yaml" -ForegroundColor White
Write-Host ""
