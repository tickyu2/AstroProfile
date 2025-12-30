import React, { useRef, useEffect } from 'react';
import './LiveFeed.css';

export function LiveFeed({ data, isLive }) {
  const feedRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom when new data arrives
    if (feedRef.current && isLive && data.length > 0) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [data, isLive]);

  if (!data || data.length === 0) {
    return (
      <div className="live-feed">
        <h3>Live Message Feed</h3>
        <div className="no-data">No messages yet</div>
      </div>
    );
  }

  // Show last 20 messages
  const displayData = data.slice(-20);

  return (
    <div className="live-feed">
      <div className="feed-header">
        <h3>Live Message Feed</h3>
        <span className="message-count">{data.length} messages</span>
      </div>

      <div className="feed-items" ref={feedRef}>
        {displayData.map((item, index) => (
          <FeedItem
            key={item.timestamp || index}
            item={item}
            isLatest={isLive && index === displayData.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function FeedItem({ item, isLatest }) {
  const hasAdvancedPatterns = item.congruence?.advancedPatterns?.length > 0;

  return (
    <div className={`feed-item ${isLatest ? 'pulse' : ''}`}>
      <div className="feed-timestamp">
        {new Date(item.timestamp).toLocaleTimeString()}
      </div>

      <div className="feed-content">
        <div className="feed-text">{item.text || 'No text'}</div>

        <div className="feed-analysis">
          <span className={`archetype-badge ${item.archetype?.type?.toLowerCase()}`}>
            {item.archetype?.type || 'Unknown'}
          </span>

          <span className={`congruence-badge ${item.congruence?.level?.toLowerCase()}`}>
            {item.congruence?.level || 'UNKNOWN'}
          </span>

          {item.congruence?.totalPatternsDetected > 0 && (
            <span className="pattern-count">
              {item.congruence.totalPatternsDetected} pattern{item.congruence.totalPatternsDetected > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Show basic patterns */}
        {item.congruence?.patterns && item.congruence.patterns.length > 0 && (
          <div className="feed-patterns">
            {item.congruence.patterns.map((pattern, pi) => (
              <span key={pi} className="pattern-tag basic">{pattern}</span>
            ))}
          </div>
        )}

        {/* Show advanced patterns */}
        {hasAdvancedPatterns && (
          <div className="feed-patterns">
            {item.congruence.advancedPatterns.map((ap, api) => (
              <span
                key={api}
                className={`pattern-tag advanced ${ap.severity?.toLowerCase()}`}
                title={ap.description}
              >
                {ap.pattern}
              </span>
            ))}
          </div>
        )}

        {/* Show priority pattern if flagged */}
        {item.congruence?.priorityPattern && (
          <div className="priority-indicator">
            <span className="priority-icon">Warning</span>
            Priority: {item.congruence.priorityPattern.pattern}
          </div>
        )}

        {/* Show crisis flag */}
        {item.congruence?.requiresSpecialHandling && (
          <div className="crisis-indicator">
            <span className="crisis-icon">Alert</span>
            Requires special handling
          </div>
        )}
      </div>
    </div>
  );
}
