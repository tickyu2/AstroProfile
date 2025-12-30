# GENESIS System - Final Deployment Checklist

## Pre-Deployment Verification

### Phase 1: Core System
- [ ] `src/lib/emotionCongruenceService.js` exists
- [ ] `src/lib/realtimeArchetypeDetector.js` exists
- [ ] `src/lib/index.js` exists
- [ ] 9 archetypes detecting correctly
- [ ] 50+ signals extracting properly
- [ ] 6 basic patterns working

### Phase 2: Performance
- [ ] `src/lib/optimized/lexicons.optimized.js` exists
- [ ] `src/lib/optimized/signalExtractor.optimized.js` exists
- [ ] `src/lib/optimized/archetypeDetector.optimized.js` exists
- [ ] `src/lib/optimized/memoryManager.js` exists
- [ ] `src/lib/optimized/performanceMonitor.js` exists
- [ ] Processing time <10ms
- [ ] Cache hit rate >80%

### Phase 3: Advanced Patterns
- [ ] `src/lib/realtime/advancedCongruencePatterns.js` exists
- [ ] `src/lib/realtime/emotionCongruenceService.enhanced.js` exists
- [ ] `src/lib/realtime/advancedResponseStrategies.js` exists
- [ ] All 15 advanced patterns detecting
- [ ] Crisis detection functioning

### Phase 4: Dashboard
- [ ] `src/components/dashboard/Dashboard.jsx` exists
- [ ] `src/components/dashboard/ArchetypeTimeline.jsx` exists
- [ ] `src/components/dashboard/CongruenceChart.jsx` exists
- [ ] `src/components/dashboard/PatternHeatmap.jsx` exists
- [ ] `src/components/dashboard/SignalRadar.jsx` exists
- [ ] `src/components/dashboard/ConversationStats.jsx` exists
- [ ] `src/components/dashboard/LiveFeed.jsx` exists
- [ ] All CSS files present
- [ ] Charts rendering correctly

### Backend
- [ ] `backend/routes/dashboardRoutes.js` exists
- [ ] `backend/websocket/dashboardSocket.js` exists
- [ ] API endpoints responding
- [ ] WebSocket connections working

---

## Backend Deployment

### Configuration
```bash
# 1. Copy environment template
cp backend/.env.example backend/.env

# 2. Edit .env with your values
nano backend/.env
```

### Server Setup
```bash
# Option A: Direct start
cd backend && npm start

# Option B: PM2 (Recommended for production)
npm install -g pm2
pm2 start npm --name "luna-genesis" -- start
pm2 save
pm2 startup

# Option C: Docker
docker build -t luna-genesis .
docker run -d -p 3000:3000 --env-file .env luna-genesis
```

### Verify Backend
```bash
# Health check
curl http://localhost:3000/health

# Dashboard API
curl http://localhost:3000/api/dashboard/health

# WebSocket (requires wscat)
npm install -g wscat
wscat -c ws://localhost:3000/api/dashboard/stream
```

---

## Frontend Deployment

### Configuration
```bash
# 1. Copy environment template
cp .env.example .env

# 2. Edit .env with your values
nano .env
```

### Build & Start
```bash
# Development
npm run dev

# Production build
npm run build

# Serve production build
npm install -g serve
serve -s dist -l 5173
```

---

## Verification Tests

### Test Message Processing
```bash
curl -X POST http://localhost:3000/api/dashboard/message \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I am feeling great today!",
    "voiceEmotion": {"emotion": "happy", "confidence": 0.9},
    "sessionId": "test"
  }'
```

### Test Pattern Detection
```bash
# This should detect VULNERABILITY_MASKING pattern
curl -X POST http://localhost:3000/api/dashboard/message \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I am totally fine, everything is great!",
    "voiceEmotion": {"emotion": "sad", "confidence": 0.85},
    "sessionId": "test"
  }'
```

### Test Crisis Detection
```bash
# This should flag for special handling
curl -X POST http://localhost:3000/api/dashboard/message \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Okay.",
    "voiceEmotion": {"emotion": "neutral", "confidence": 0.6},
    "sessionId": "test"
  }'
```

---

## Dashboard Verification

Open http://localhost:5173 and verify:

- [ ] Dashboard loads without errors
- [ ] "GENESIS Analytics Dashboard" header visible
- [ ] 3-column layout displays correctly
- [ ] Time window selector works
- [ ] Archetype filter works
- [ ] LIVE indicator shows when connected

### Component Checks
- [ ] Live Feed - Shows messages
- [ ] Archetype Timeline - Line chart renders
- [ ] Congruence Chart - Bar chart renders
- [ ] Pattern Heatmap - Canvas renders
- [ ] Signal Radar - Radar chart renders
- [ ] Stats Panel - Statistics display

---

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

**Missing dependencies:**
```bash
npm install
```

### Frontend Issues

**Charts not rendering:**
```bash
npm install chart.js react-chartjs-2
npm run build
```

**WebSocket not connecting:**
- Check CORS settings in backend
- Verify WebSocket path matches
- Check browser console for errors

### Dashboard Issues

**No data showing:**
1. Send test message via curl
2. Check network tab in dev tools
3. Verify session ID matches
4. Check API responses

---

## Production Security Checklist

- [ ] HTTPS enabled
- [ ] WSS (secure WebSocket) configured
- [ ] CORS restricted to production domain
- [ ] Rate limiting enabled
- [ ] Authentication implemented (if needed)
- [ ] Environment variables secured
- [ ] Logs configured properly
- [ ] Error tracking enabled

---

## Monitoring

### Health Endpoints
```
GET /health                    - Server health
GET /api/dashboard/health      - Dashboard health
GET /api/dashboard/stats       - Aggregate statistics
```

### PM2 Monitoring
```bash
pm2 monit          # Real-time monitoring
pm2 logs           # View logs
pm2 status         # Check status
```

---

## Success Indicators

You're successfully deployed when:

1. ✅ Backend running - Health check passes
2. ✅ Dashboard loads - All components visible
3. ✅ WebSocket connected - LIVE indicator showing
4. ✅ Messages processing - Test messages work
5. ✅ Charts updating - Real-time visualization
6. ✅ Patterns detecting - 21 patterns identified
7. ✅ Performance good - <10ms processing
8. ✅ No errors - Clean console and logs

---

## Final Status

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║         🎊 GENESIS IS LIVE IN PRODUCTION! 🎊             ║
║                                                           ║
║  Dashboard: http://localhost:5173                        ║
║  Backend:   http://localhost:3000                        ║
║  Status:    🟢 OPERATIONAL                               ║
║                                                           ║
║  Capabilities:                                            ║
║  • 9 Archetypes                                          ║
║  • 50+ Signals                                           ║
║  • 21 Patterns (6 basic + 15 advanced)                   ║
║  • <10ms Processing                                      ║
║  • Real-time Dashboard                                   ║
║  • Crisis Detection                                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

**Congratulations on deploying GENESIS!**
