#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════
# GENESIS MCP Server - Deployment Script for Google Cloud Run
# ═══════════════════════════════════════════════════════════════════════════

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration (update these to match your project)
PROJECT_ID="astroprofile-391e6"
REGION="us-central1"
SERVICE_NAME="genesis-mcp-server"

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🌟 GENESIS MCP Server - Deployment to Cloud Run${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"

# Step 1: Verify gcloud is installed and authenticated
echo -e "\n${YELLOW}Step 1: Verifying gcloud setup...${NC}"
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI not found. Please install it first.${NC}"
    exit 1
fi

CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null)
if [ "$CURRENT_PROJECT" != "$PROJECT_ID" ]; then
    echo -e "${YELLOW}⚠️  Current project is $CURRENT_PROJECT${NC}"
    echo -e "${YELLOW}Switching to $PROJECT_ID...${NC}"
    gcloud config set project $PROJECT_ID
fi

echo -e "${GREEN}✅ gcloud configured for project: $PROJECT_ID${NC}"

# Step 2: Enable required APIs
echo -e "\n${YELLOW}Step 2: Ensuring required APIs are enabled...${NC}"
gcloud services enable \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    secretmanager.googleapis.com \
    containerregistry.googleapis.com \
    --project=$PROJECT_ID

echo -e "${GREEN}✅ APIs enabled${NC}"

# Step 3: Copy firebase credentials (if not using default service account)
echo -e "\n${YELLOW}Step 3: Checking Firebase credentials...${NC}"
if [ -f "../functions/serviceAccountKey.json" ]; then
    cp ../functions/serviceAccountKey.json ./firebase-credentials.json
    echo -e "${GREEN}✅ Firebase credentials copied${NC}"
else
    echo -e "${YELLOW}⚠️  Service account key not found. Using default Cloud Run service account.${NC}"
fi

# Step 4: Build and deploy
echo -e "\n${YELLOW}Step 4: Building and deploying to Cloud Run...${NC}"
gcloud run deploy $SERVICE_NAME \
    --source . \
    --region=$REGION \
    --platform=managed \
    --allow-unauthenticated \
    --memory=512Mi \
    --cpu=1 \
    --timeout=60s \
    --max-instances=10 \
    --min-instances=0 \
    --set-env-vars="NODE_ENV=production,FIREBASE_PROJECT_ID=$PROJECT_ID,MCP_RATE_LIMIT=100,MCP_AUDIT_LOG=true" \
    --project=$PROJECT_ID

# Step 5: Get service URL
echo -e "\n${YELLOW}Step 5: Retrieving service URL...${NC}"
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)' --project=$PROJECT_ID)

echo -e "\n${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Service URL: $SERVICE_URL${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"

# Step 6: Test the deployment
echo -e "\n${YELLOW}Step 6: Testing deployment...${NC}"
echo -e "${BLUE}You can test with Claude Code using this config:${NC}"
echo -e "${YELLOW}"
cat <<EOF
{
  "mcpServers": {
    "genesis-constitutional": {
      "command": "curl",
      "args": [
        "-X", "POST",
        "$SERVICE_URL/mcp",
        "-H", "Content-Type: application/json",
        "-d", "@-"
      ]
    }
  }
}
EOF
echo -e "${NC}"

echo -e "\n${GREEN}✅ Deployment script complete!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
