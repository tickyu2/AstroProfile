/**
 * WebSocket Handler for Real-time Dashboard Updates
 */

import { WebSocketServer } from 'ws';

export function setupDashboardWebSocket(server) {
  const wss = new WebSocketServer({
    server,
    path: '/api/dashboard/stream'
  });

  const clients = new Set();

  wss.on('connection', (ws) => {
    console.log('[Dashboard] Client connected to WebSocket');
    clients.add(ws);

    ws.on('close', () => {
      console.log('[Dashboard] Client disconnected');
      clients.delete(ws);
    });

    ws.on('error', (error) => {
      console.error('[Dashboard] WebSocket error:', error);
      clients.delete(ws);
    });

    // Send initial connection message
    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to GENESIS Dashboard',
      timestamp: Date.now()
    }));
  });

  // Broadcast function
  function broadcast(data) {
    const message = JSON.stringify(data);
    clients.forEach(client => {
      if (client.readyState === 1) { // OPEN
        client.send(message);
      }
    });
  }

  return {
    broadcast,
    getClientCount: () => clients.size
  };
}

// Export for use in main server
export let dashboardBroadcast = null;

export function setDashboardBroadcast(broadcastFn) {
  dashboardBroadcast = broadcastFn;
}
