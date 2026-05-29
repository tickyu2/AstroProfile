/**
 * BaZi Chat Message List
 *
 * Displays conversation messages — user on right, assistant on left.
 * Auto-scrolls to latest message.
 */

import React, { useEffect, useRef } from 'react';
import type { ChatMessage } from '../../services/baziChatService';

interface Props {
  messages: ChatMessage[];
  isLoading?: boolean;
}

const BaZiChatMessageList: React.FC<Props> = ({ messages, isLoading }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isLoading]);

  if (messages.length === 0 && !isLoading) return null;

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '12px 0',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    }}>
      {messages.map((msg, i) => {
        const isUser = msg.role === 'user';
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: isUser ? 'flex-end' : 'flex-start',
            }}
          >
            <div style={{
              maxWidth: '80%',
              padding: '10px 14px',
              borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
              background: isUser
                ? 'rgba(59, 130, 246, 0.15)'
                : 'rgba(30, 41, 59, 0.7)',
              border: `1px solid ${isUser ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255,255,255,0.06)'}`,
              color: '#e2e8f0',
              fontSize: '12px',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {!isUser && (
                <div style={{ fontSize: '10px', color: '#facc15', fontWeight: 600, marginBottom: '4px' }}>
                  BaZi Advisor
                </div>
              )}
              {msg.content}
            </div>
          </div>
        );
      })}

      {/* Loading indicator */}
      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <div style={{
            padding: '10px 14px',
            borderRadius: '14px 14px 14px 4px',
            background: 'rgba(30, 41, 59, 0.7)',
            border: '1px solid rgba(255,255,255,0.06)',
            color: '#94a3b8',
            fontSize: '12px',
          }}>
            <span style={{ fontSize: '10px', color: '#facc15', fontWeight: 600 }}>BaZi Advisor</span>
            <div style={{ marginTop: '4px' }}>Analyzing your chart...</div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default BaZiChatMessageList;
