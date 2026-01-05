/**
 * CHAT INPUT
 *
 * Message input with:
 * - Text input field
 * - Voice recording button
 * - Send button
 * - Disabled state during AI response
 */

import React, { useState, useRef } from 'react';

function ChatInput({ onSendMessage, onVoiceMessage, disabled, placeholder }) {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;

    onSendMessage(text);
    setText('');
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleVoiceRecord = () => {
    // TODO: Implement actual voice recording
    setIsRecording(!isRecording);
    console.log('Voice recording toggled');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 py-4">
      <div className="flex items-end space-x-2">
        {/* Voice button */}
        <button
          type="button"
          onClick={handleVoiceRecord}
          disabled={disabled}
          className={`
            flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all
            ${isRecording
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Text input */}
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            placeholder={placeholder}
            rows={1}
            className="
              w-full px-4 py-3 pr-12
              bg-white border border-gray-300 rounded-2xl
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              disabled:bg-gray-100 disabled:cursor-not-allowed
              resize-none
            "
            style={{ minHeight: '44px', maxHeight: '120px' }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
          />
        </div>

        {/* Send button */}
        <button
          type="submit"
          disabled={!text.trim() || disabled}
          className={`
            flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all
            ${!text.trim() || disabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
            }
          `}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>

      {/* Hints */}
      <div className="mt-2 text-xs text-gray-400 text-center">
        Press Enter to send, Shift+Enter for new line
      </div>
    </form>
  );
}

export default ChatInput;
