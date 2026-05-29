/**
 * BaZi Chat Input
 *
 * Text input with active domain badge, send button, and new topic button.
 */

import React, { useState, useRef, useCallback } from 'react';
import { DOMAIN_META, type DomainId } from './questionGenerator';

interface Props {
  activeDomain: DomainId | null;
  onSend: (message: string) => void;
  onNewTopic: () => void;
  disabled?: boolean;
  hasMessages?: boolean;
}

const BaZiChatInput: React.FC<Props> = ({ activeDomain, onSend, onNewTopic, disabled, hasMessages }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = '40px';
    }
  }, [text, disabled, onSend]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleInput = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = '40px';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }, []);

  const domainMeta = activeDomain ? DOMAIN_META[activeDomain] : null;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      padding: '8px 0 0',
      borderTop: '1px solid rgba(255,255,255,0.06)',
    }}>
      {/* Domain badge + New Topic */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {domainMeta && (
          <span style={{
            background: `${domainMeta.color}15`,
            border: `1px solid ${domainMeta.color}40`,
            borderRadius: '6px',
            padding: '2px 8px',
            color: domainMeta.color,
            fontSize: '10px',
            fontWeight: 600,
          }}>
            {domainMeta.icon} {domainMeta.label}
          </span>
        )}
        {hasMessages && (
          <button
            type="button"
            onClick={onNewTopic}
            style={{
              background: 'none',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              padding: '2px 8px',
              color: '#64748b',
              fontSize: '10px',
              cursor: 'pointer',
            }}
          >
            New Topic
          </button>
        )}
      </div>

      {/* Input row */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => { setText(e.target.value); handleInput(); }}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your BaZi chart..."
          disabled={disabled}
          rows={1}
          style={{
            flex: 1,
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#e2e8f0',
            fontSize: '12px',
            lineHeight: 1.5,
            resize: 'none',
            minHeight: '40px',
            maxHeight: '120px',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          style={{
            background: text.trim() && !disabled ? 'rgba(59, 130, 246, 0.2)' : 'rgba(30, 41, 59, 0.4)',
            border: `1px solid ${text.trim() && !disabled ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255,255,255,0.06)'}`,
            borderRadius: '10px',
            padding: '10px 16px',
            color: text.trim() && !disabled ? '#60a5fa' : '#475569',
            fontSize: '12px',
            fontWeight: 600,
            cursor: text.trim() && !disabled ? 'pointer' : 'default',
            transition: 'all 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default BaZiChatInput;
