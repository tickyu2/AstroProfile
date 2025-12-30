# Phase 4 Dashboard - Setup Guide

## Installation (5 minutes)

### 1. Install Dependencies
```bash
npm install chart.js react-chartjs-2 ws
```

### 2. Copy Dashboard Files
```bash
# Copy all dashboard components
cp -r dashboard-files/src/components/dashboard src/components/

# Copy backend routes
cp dashboard-files/backend/routes/dashboardRoutes.js backend/routes/

# Copy WebSocket handler
cp dashboard-files/backend/websocket/dashboardSocket.js backend/websocket/
```

### 3. Update Server

Add to `backend/server.js`:
```javascript
import dashboardRoutes from './routes/dashboardRoutes.js';
import { setupDashboardWebSocket } from './websocket/dashboardSocket.js';

// Add routes
app.use('/api/dashboard', dashboardRoutes);

// Setup WebSocket
const { broadcast } = setupDashboardWebSocket(server);
```

### 4. Update Frontend

Create or modify `src/App.jsx` to include the Dashboard component (see example below).

## Usage

### Start Backend
```bash
cd backend
npm start
# Server running on http://localhost:3000
# WebSocket at ws://localhost:3000/api/dashboard/stream
```

### Start Frontend
```bash
cd frontend
npm run dev
# Dashboard at http://localhost:5173
```

### Access Dashboard

Open browser to `http://localhost:5173`

You should see:
- Live message feed (left panel)
- Archetype timeline chart (center)
- Congruence distribution (center)
- Pattern heatmap (center)
- Conversation stats (right)
- Signal radar (right)

## Features

### Time Windows
- Last 1 Minute
- Last 5 Minutes
- Last 15 Minutes
- Last Hour
- All Time

### Archetype Filtering
Filter messages by specific archetype

### Real-time Updates
Live indicator shows when WebSocket is connected

### Pattern Detection
- Basic patterns (6) shown in orange
- Advanced patterns (15) shown in pink
- High-severity patterns highlighted in red
- Priority patterns flagged with warning indicator
- Crisis patterns flagged with alert indicator

## API Endpoints
```
POST   /api/dashboard/message          # Process new message
GET    /api/dashboard/session/:id      # Get session history
GET    /api/dashboard/sessions         # List all sessions
DELETE /api/dashboard/session/:id      # Clear session
GET    /api/dashboard/stats            # Aggregate statistics
GET    /api/dashboard/health           # Health check
WS     /api/dashboard/stream           # WebSocket stream
```

## Testing
```bash
# Test with curl
curl -X POST http://localhost:3000/api/dashboard/message \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I am fine",
    "voiceEmotion": {"emotion": "sad", "confidence": 0.8},
    "sessionId": "test-session"
  }'

# View session
curl http://localhost:3000/api/dashboard/session/test-session
```

## Customization

### Change Colors

Edit archetype colors in `ArchetypeTimeline.jsx`:
```javascript
const archetypeColors = {
  'Seed': '#10b981',       // Green
  'Mirror': '#3b82f6',     // Blue
  'Mender': '#ec4899',     // Pink
  'Librarian': '#8b5cf6',  // Purple
  'Conductor': '#f59e0b',  // Amber
  'Companion': '#06b6d4',  // Cyan
  'Guardian': '#ef4444',   // Red
  'Flamebearer': '#f97316', // Orange
  'Guide': '#6366f1'       // Indigo
};
```

### Adjust Time Windows

Edit in `Dashboard.jsx`:
```javascript
const windowMs = {
  '30sec': 30 * 1000,        // Add 30 seconds
  '1min': 60 * 1000,
  '5min': 5 * 60 * 1000,
  '15min': 15 * 60 * 1000,
  '1hour': 60 * 60 * 1000,
  '6hour': 6 * 60 * 60 * 1000 // Add 6 hours
};
```

### Change Pattern Grid Layout

Edit in `PatternHeatmap.jsx`:
```javascript
// Change from 7x3 to 5x4 grid
const cols = 5;
const rows = 4;
```

## Production Configuration

### Environment Variables

Create `.env`:
```bash
# Backend
DASHBOARD_PORT=3000
DASHBOARD_WS_PATH=/api/dashboard/stream
DASHBOARD_MAX_HISTORY=100
DASHBOARD_SESSION_TTL=3600000  # 1 hour

# Frontend
VITE_DASHBOARD_API=http://localhost:3000
VITE_DASHBOARD_WS=ws://localhost:3000/api/dashboard/stream
```

### Enable CORS for Production
```javascript
// backend/server.js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

### Use Database for Sessions

Replace in-memory storage with MongoDB/PostgreSQL:
```javascript
// backend/routes/dashboardRoutes.js
import { ConversationSession } from '../models/ConversationSession.js';

// Instead of Map
const session = await ConversationSession.findById(sessionId);
```

## Troubleshooting

### WebSocket not connecting

**Issue:** Dashboard shows "disconnected"

**Solution:**
1. Check backend is running: `curl http://localhost:3000/health`
2. Check WebSocket path: `ws://localhost:3000/api/dashboard/stream`
3. Check firewall/proxy settings
4. Check browser console for errors

### Charts not rendering

**Issue:** Blank spaces where charts should be

**Solution:**
1. Verify Chart.js installed: `npm list chart.js`
2. Check browser console for errors
3. Ensure data format is correct
4. Try clearing browser cache

### No data showing

**Issue:** Dashboard loads but shows "No data available"

**Solution:**
1. Send test message via curl (see Testing section)
2. Check session ID matches
3. Verify API endpoint returning data
4. Check network tab in browser dev tools

### High memory usage

**Issue:** Backend memory increasing over time

**Solution:**
1. Limit history size in dashboardRoutes.js
2. Implement session cleanup
3. Use database instead of in-memory storage
4. Set session TTL

## Performance Optimization

### Reduce Update Frequency
```javascript
// In App.jsx, debounce updates
const [buffer, setBuffer] = useState([]);

websocket.onmessage = (event) => {
  setBuffer(prev => [...prev, message.data]);
};

// Flush buffer every 500ms
useEffect(() => {
  const interval = setInterval(() => {
    if (buffer.length > 0) {
      setConversationData(prev => [...prev, ...buffer]);
      setBuffer([]);
    }
  }, 500);

  return () => clearInterval(interval);
}, [buffer]);
```

### Limit Chart Data Points
```javascript
// In ArchetypeTimeline.jsx
const maxDataPoints = 50;
const displayData = data.slice(-maxDataPoints);
```

## Security

### Add Authentication
```javascript
// backend/middleware/auth.js
export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Apply to dashboard routes
app.use('/api/dashboard', requireAuth, dashboardRoutes);
```

### Rate Limiting
```bash
npm install express-rate-limit
```
```javascript
import rateLimit from 'express-rate-limit';

const dashboardLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100 // 100 requests per minute
});

app.use('/api/dashboard', dashboardLimiter, dashboardRoutes);
```

## Monitoring

### Add Health Check
```javascript
// backend/routes/dashboardRoutes.js
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: Date.now(),
    sessions: conversationSessions.size,
    websocketClients: getClientCount(),
    uptime: process.uptime()
  });
});
```

## Deployment Checklist

- [ ] All dependencies installed
- [ ] Environment variables configured
- [ ] CORS configured for production domain
- [ ] WebSocket path accessible
- [ ] Database configured (if not using in-memory)
- [ ] Session cleanup enabled
- [ ] Rate limiting enabled
- [ ] Authentication enabled (if required)
- [ ] HTTPS enabled for WebSocket (WSS)
- [ ] Monitoring/logging configured
- [ ] Health check endpoint working
- [ ] Tested with production data
- [ ] Performance optimized
- [ ] Security reviewed

---

**Congratulations! Your GENESIS Dashboard is ready!**
