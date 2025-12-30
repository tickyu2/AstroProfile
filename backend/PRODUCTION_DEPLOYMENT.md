# LUNA Voice Backend - Production Deployment Guide

**Last Updated:** December 28, 2024
**Status:** Deployed

**Related Documentation:**
- [GENESIS Architecture](../docs/GENESIS_ARCHITECTURE.md) - Complete system overview
- [Modality Isolation](../docs/SIMULTANEOUS_TEXT_VOICE_ARCHITECTURE.md) - Text/voice separation

## Current Deployment

| Service | Endpoint |
|---------|----------|
| **WebSocket** | `wss://luna-voice-backend-sjpjwnbsmq-uc.a.run.app` |
| **Health Check** | `https://luna-voice-backend-sjpjwnbsmq-uc.a.run.app/health` |

## Overview

This guide covers deploying the Luna Voice WebSocket server to production.

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   React App     │────▶│  Cloud Run       │────▶│  External APIs  │
│   (Frontend)    │◀────│  (WebSocket)     │◀────│  Groq/ElevenLabs│
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                       │
        │                       │
        ▼                       ▼
┌─────────────────┐     ┌──────────────────┐
│  Firebase       │     │  Secret Manager  │
│  (Auth/DB)      │     │  (API Keys)      │
└─────────────────┘     └──────────────────┘
```

## Prerequisites

1. **Google Cloud Project** with billing enabled
2. **APIs enabled**:
   - Cloud Run API
   - Cloud Build API
   - Secret Manager API
   - Container Registry API

3. **API Keys** (stored in Secret Manager):
   - `GROQ_API_KEY` - Required for STT (Whisper) and LLM
   - `ELEVENLABS_API_KEY` - Required for TTS
   - `OPENAI_API_KEY` - Optional for OpenAI Realtime

## Step 1: Set Up Secrets

```bash
# Enable Secret Manager
gcloud services enable secretmanager.googleapis.com

# Create secrets
echo -n "gsk_your_groq_key" | gcloud secrets create GROQ_API_KEY --data-file=-
echo -n "your_elevenlabs_key" | gcloud secrets create ELEVENLABS_API_KEY --data-file=-
echo -n "sk-your_openai_key" | gcloud secrets create OPENAI_API_KEY --data-file=-

# Grant Cloud Run access to secrets
gcloud secrets add-iam-policy-binding GROQ_API_KEY \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Repeat for other secrets...
```

## Step 2: Deploy to Cloud Run

### Option A: Using Cloud Build (Recommended)

```bash
cd backend
gcloud builds submit --config=deploy/cloudbuild.yaml
```

### Option B: Manual Docker Deploy

```bash
# Build image
cd backend
docker build -t gcr.io/YOUR_PROJECT/luna-voice-backend:latest -f deploy/Dockerfile .

# Push to Container Registry
docker push gcr.io/YOUR_PROJECT/luna-voice-backend:latest

# Deploy to Cloud Run
gcloud run deploy luna-voice-backend \
  --image gcr.io/YOUR_PROJECT/luna-voice-backend:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --set-secrets "GROQ_API_KEY=GROQ_API_KEY:latest,ELEVENLABS_API_KEY=ELEVENLABS_API_KEY:latest" \
  --session-affinity
```

## Step 3: Update Frontend Configuration

Update your frontend to use the Cloud Run URL:

```javascript
// src/config/voiceConfig.js
export const VOICE_WS_URL = process.env.NODE_ENV === 'production'
  ? 'wss://luna-voice-backend-HASH-uc.a.run.app'
  : 'ws://localhost:8080';
```

## Step 4: Configure Custom Domain (Optional)

```bash
# Map custom domain
gcloud run domain-mappings create \
  --service luna-voice-backend \
  --domain voice.yourdomain.com \
  --region us-central1
```

## Rate Limiting

The server includes built-in rate limiting:

| Limit | Window | Value |
|-------|--------|-------|
| Connections per IP | 1 minute | 5 |
| Turns per session | 1 minute | 60 |
| STT calls per session | 1 hour | 120 |
| TTS calls per session | 1 hour | 120 |
| Audio data per session | 1 hour | 50 MB |

## Audio Quality Presets

Users can choose between presets:

| Preset | Latency | Use Case |
|--------|---------|----------|
| `fast` | 400-800ms | Quick conversations, mobile |
| `balanced` | 600-1200ms | Default, most users |
| `quality` | 900-2000ms | Deep conversations |

## Monitoring

### Health Check Endpoint

```bash
curl https://luna-voice-backend-HASH-uc.a.run.app/health
```

### View Logs

```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=luna-voice-backend" --limit 50
```

### Metrics

Monitor in Cloud Console:
- Request latency
- Instance count
- Memory usage
- WebSocket connections

## Troubleshooting

### WebSocket Connection Fails

1. Check Cloud Run has `--session-affinity` enabled
2. Ensure port 8080 is exposed
3. Verify secrets are accessible

### High Latency

1. Check region is close to users
2. Consider `fast` audio preset
3. Review Groq/ElevenLabs quotas

### Rate Limit Errors

1. Reduce request frequency
2. Implement client-side queuing
3. Upgrade rate limits if needed

## Security Checklist

- [ ] API keys in Secret Manager (not env files)
- [ ] HTTPS/WSS only (Cloud Run enforces this)
- [ ] Rate limiting enabled
- [ ] No unauthenticated access in production (optional)
- [ ] Regular key rotation scheduled
- [ ] Audit logging enabled

## Cost Estimates

| Service | Free Tier | Paid |
|---------|-----------|------|
| Cloud Run | 2M requests/month | $0.00002400/request |
| Groq STT | 10 hrs/day | $0.06/hr after |
| ElevenLabs | 10K chars/month | $5/100K chars |

## Support

For issues, check:
1. Cloud Run logs
2. Secret Manager access
3. API quota dashboards
