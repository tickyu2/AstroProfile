/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PROACTIVE NOTIFICATIONS - Luna's Outreach Display
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Displays notifications when Luna wants to proactively reach out:
 * - Reminders that have triggered
 * - Check-ins after absence
 * - Astrological events
 * - Birthday wishes
 * - Pattern-based insights
 *
 * @module ProactiveNotifications
 */

import React, { useState, useEffect } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useAuth } from '../../contexts/AuthContext';

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATION TYPE ICONS
// ═══════════════════════════════════════════════════════════════════════════════

const NOTIFICATION_ICONS = {
  reminder: '🔔',
  absence: '💭',
  lunar_event: '🌙',
  birthday: '🎂',
  important_date: '📅',
  pattern_checkin: '💜'
};

const NOTIFICATION_COLORS = {
  reminder: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
  absence: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  lunar_event: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30',
  birthday: 'from-pink-500/20 to-rose-500/20 border-pink-500/30',
  important_date: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
  pattern_checkin: 'from-violet-500/20 to-purple-500/20 border-violet-500/30'
};

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATION CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const NotificationCard = ({ notification, onDismiss, onRespond }) => {
  const icon = NOTIFICATION_ICONS[notification.type] || '💬';
  const colorClass = NOTIFICATION_COLORS[notification.type] || 'from-slate-500/20 to-slate-600/20 border-slate-500/30';

  return (
    <div
      className={`bg-gradient-to-r ${colorClass} border rounded-xl p-4 animate-fadeIn`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-white/90 text-sm leading-relaxed">
            {notification.message}
          </p>
          <p className="text-white/40 text-xs mt-2">
            {formatTimeAgo(notification.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onRespond(notification)}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs text-white/80 transition-colors"
          >
            Reply
          </button>
          <button
            onClick={() => onDismiss(notification.id)}
            className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white/60 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const ProactiveNotifications = ({ profileId, onOpenChat }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const functions = getFunctions();

  // Fetch notifications on mount
  useEffect(() => {
    if (!currentUser) return;

    const fetchNotifications = async () => {
      try {
        const getPendingNotifications = httpsCallable(functions, 'getPendingNotifications');
        const result = await getPendingNotifications({ profileId, limit: 5 });
        setNotifications(result.data.notifications || []);
      } catch (err) {
        console.error('[ProactiveNotifications] Error fetching:', err);
        setError('Could not load notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Poll for new notifications every 5 minutes
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [currentUser, profileId, functions]);

  // Dismiss a notification
  const handleDismiss = async (notificationId) => {
    try {
      const dismissNotification = httpsCallable(functions, 'dismissNotification');
      await dismissNotification({ notificationId, action: 'dismissed' });

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (err) {
      console.error('[ProactiveNotifications] Error dismissing:', err);
    }
  };

  // Respond to a notification (opens chat)
  const handleRespond = async (notification) => {
    try {
      // Mark as acted on
      const dismissNotification = httpsCallable(functions, 'dismissNotification');
      await dismissNotification({ notificationId: notification.id, action: 'acted_on' });

      // Remove from list
      setNotifications(prev => prev.filter(n => n.id !== notification.id));

      // Open chat with context
      if (onOpenChat) {
        onOpenChat({
          initialMessage: notification.message,
          context: notification.trigger
        });
      }
    } catch (err) {
      console.error('[ProactiveNotifications] Error responding:', err);
    }
  };

  // Don't render if no notifications
  if (loading || notifications.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mb-4">
      <div className="flex items-center gap-2 text-white/60 text-sm">
        <span className="text-purple-400">✨</span>
        <span>Luna has something to share...</span>
      </div>

      {notifications.map(notification => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onDismiss={handleDismiss}
          onRespond={handleRespond}
        />
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function formatTimeAgo(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATION BADGE (for header/nav)
// ═══════════════════════════════════════════════════════════════════════════════

export const NotificationBadge = ({ count }) => {
  if (!count || count === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
      {count > 9 ? '9+' : count}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATION BELL BUTTON
// ═══════════════════════════════════════════════════════════════════════════════

export const NotificationBell = ({ onClick, count = 0 }) => {
  return (
    <button
      onClick={onClick}
      className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
    >
      <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      <NotificationBadge count={count} />
    </button>
  );
};

export default ProactiveNotifications;
