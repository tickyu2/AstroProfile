# ═══════════════════════════════════════════════════════════════════════════════
# LUNA VOICE BACKEND - Production Dockerfile
# ═══════════════════════════════════════════════════════════════════════════════
#
# Builds the WebSocket server for Cloud Run / Railway / Fly.io deployment.
#
# Build: docker build -t luna-voice-backend .
# Run:   docker run -p 8080:8080 --env-file .env luna-voice-backend
#
# Created: December 27, 2024
# Part of: GENESIS Voice Mode - Production Deployment
# ═══════════════════════════════════════════════════════════════════════════════

FROM node:20-alpine

# Install ffmpeg for audio processing
RUN apk add --no-cache ffmpeg

# Set working directory
WORKDIR /app

# Copy package files first (better layer caching)
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy source code
COPY . .

# Create temp directories
RUN mkdir -p /app/audio/temp

# Set environment
ENV NODE_ENV=production
ENV PORT=8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Expose port
EXPOSE 8080

# Start Cloud Run server (HTTP + WebSocket with health checks)
CMD ["node", "server-cloudrun.js"]
