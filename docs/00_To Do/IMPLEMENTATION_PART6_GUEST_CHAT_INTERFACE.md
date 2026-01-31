# GUEST CHAT INTERFACE WITH LUNA ACTIVE MODE
## Complete Implementation - Clean Start

**Date:** January 2, 2026  
**For:** Brother Code (Claude Code)  
**Purpose:** New page for chatting with guests (Einstein) with Luna Active Mode  
**Dependencies:** Parts 1-5 (Brain architecture + JSON buffer)

---

## OVERVIEW

This implements a complete chat interface combining:
- **Option 1:** UI for chatting with Einstein
- **Option 3:** Luna Active Mode with private coaching

**Three-Way Conversation:**
```
Papa ↔ Einstein (public dialogue, both see)
Luna → Papa (private coaching, Einstein can't see)
Luna monitors everything (guardian layer)
```

---

## FILE STRUCTURE

```
src/pages/
└── GuestChat.jsx                  # Main chat interface page

src/components/chat/
├── ChatHeader.jsx                 # Top bar (guest name, Luna status)
├── MessageList.jsx                # Message display area
├── MessageBubble.jsx              # Individual message component
├── LunaPrivateMessage.jsx         # Private coaching whisper
├── ChatInput.jsx                  # Text input + voice button
└── SaveIndicator.jsx              # Auto-save status

src/services/
├── lunaService.js                 # Luna AI logic (Active mode)
└── claudeAPI.js                   # Claude API wrapper
```

---

## PART 1: MAIN CHAT PAGE

### src/pages/GuestChat.jsx

```jsx
/**
 * GUEST CHAT INTERFACE
 * 
 * Complete chat page with:
 * - Einstein conversation with constitutional personalization
 * - Luna Active Mode with private coaching
 * - JSON buffer with auto-save
 * - Voice recording support
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSessionBuffer } from '../hooks/useSessionBuffer';
import { loadProfile, buildAIPrompt } from '../profiles';
import { callClaudeAPI } from '../services/claudeAPI';
import { getLunaResponse } from '../services/lunaService';

import ChatHeader from '../components/chat/ChatHeader';
import MessageList from '../components/chat/MessageList';
import ChatInput from '../components/chat/ChatInput';
import SaveIndicator from '../components/chat/SaveIndicator';

function GuestChat() {
  // URL params: /chat/:partnerId (e.g., /chat/historical_einstein)
  const { partnerId } = useParams();
  
  // User ID (from auth context - placeholder for now)
  const userId = 'papa_ticky_123'; // TODO: Get from auth
  
  // State
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lunaMode, setLunaMode] = useState('active'); // 'silent' or 'active'
  const [aiResponding, setAiResponding] = useState(false);
  
  // JSON Buffer hook
  const { buffer, addMessage, saveBatch, pendingSaves } = 
    useSessionBuffer(userId, partnerId, 'text');
  
  // Load guest profile with Brain 1A/1B on mount
  useEffect(() => {
    async function loadGuestProfile() {
      try {
        setLoading(true);
        const data = await loadProfile(userId, partnerId);
        setProfileData(data);
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadGuestProfile();
  }, [userId, partnerId]);
  
  // Handle user sending message
  const handleSendMessage = useCallback(async (text) => {
    if (!text.trim() || !profileData) return;
    
    // 1. Add user message to buffer
    const userMessage = {
      sender: userId,
      sender_role: 'user',
      content: { text },
      timestamp: new Date().toISOString(),
      partner_name: profileData.profile.profile_name,
      partner_type: profileData.profile.profile_type,
      luna_mode: lunaMode
    };
    
    addMessage(userMessage);
    
    // 2. Get Einstein's response
    setAiResponding(true);
    
    try {
      // Build AI prompt with Brain 1A/1B context
      const conversationHistory = buffer.messages.slice(-10);
      const einsteinPrompt = buildAIPrompt(
        profileData,
        conversationHistory,
        text
      );
      
      // Call Claude API (Einstein)
      const einsteinResponse = await callClaudeAPI({
        model: 'claude-sonnet-4',
        temperature: 0.8,
        max_tokens: 2000,
        system: einsteinPrompt,
        messages: [{ role: 'user', content: text }]
      });
      
      const einsteinText = einsteinResponse.content[0].text;
      
      // Add Einstein's response to buffer
      const einsteinMessage = {
        sender: partnerId,
        sender_role: 'guest',
        content: { text: einsteinText },
        timestamp: new Date().toISOString(),
        partner_name: profileData.profile.profile_name,
        partner_type: profileData.profile.profile_type,
        luna_mode: lunaMode
      };
      
      addMessage(einsteinMessage);
      
      // 3. Luna Active Mode - Private Coaching
      if (lunaMode === 'active') {
        try {
          const lunaCoaching = await getLunaResponse({
            userId,
            partnerId,
            userMessage: text,
            guestResponse: einsteinText,
            conversationHistory: buffer.messages,
            userConstitutional: profileData.user_constitutional,
            learnedFacts: profileData.learned_facts
          });
          
          if (lunaCoaching && lunaCoaching.should_intervene) {
            // Add Luna's private coaching (only Papa sees this)
            const lunaMessage = {
              sender: 'soulpartner_primary',
              sender_role: 'luna_private',
              content: { text: lunaCoaching.coaching_message },
              timestamp: new Date().toISOString(),
              partner_name: 'Luna',
              is_private: true, // Einstein cannot see this
              coaching_type: lunaCoaching.coaching_type,
              luna_mode: 'active'
            };
            
            addMessage(lunaMessage);
          }
        } catch (error) {
          console.error('Luna coaching failed:', error);
          // Don't block conversation if Luna fails
        }
      }
      
    } catch (error) {
      console.error('Failed to get response:', error);
      // TODO: Show error message to user
    } finally {
      setAiResponding(false);
    }
  }, [profileData, buffer.messages, lunaMode, addMessage, userId, partnerId]);
  
  // Handle voice message (placeholder)
  const handleVoiceMessage = useCallback(async (audioBlob, duration) => {
    // TODO: Implement audio handling with useAudioBuffer
    console.log('Voice message recorded:', duration);
  }, []);
  
  // Toggle Luna mode
  const toggleLunaMode = useCallback(() => {
    setLunaMode(prev => prev === 'silent' ? 'active' : 'silent');
  }, []);
  
  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading {partnerId}...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (!profileData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-red-600">
          <p>Failed to load guest profile</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <ChatHeader
        guestName={profileData.profile.profile_name}
        guestType={profileData.profile.profile_type}
        lunaMode={lunaMode}
        onToggleLuna={toggleLunaMode}
        hasConstitutionalData={profileData.profile_metadata.has_constitutional_data}
        learnedFactsCount={profileData.profile_metadata.learned_facts_count}
      />
      
      {/* Message List */}
      <div className="flex-1 overflow-y-auto">
        <MessageList
          messages={buffer.messages}
          currentUserId={userId}
          guestId={partnerId}
          lunaMode={lunaMode}
        />
      </div>
      
      {/* Input Area */}
      <div className="border-t bg-white">
        <ChatInput
          onSendMessage={handleSendMessage}
          onVoiceMessage={handleVoiceMessage}
          disabled={aiResponding}
          placeholder={
            aiResponding 
              ? "Einstein is thinking..." 
              : `Message ${profileData.profile.profile_name}...`
          }
        />
        
        {/* Save Indicator */}
        {pendingSaves > 0 && (
          <SaveIndicator
            pendingSaves={pendingSaves}
            onManualSave={saveBatch}
          />
        )}
      </div>
    </div>
  );
}

export default GuestChat;
```

---

## PART 2: CHAT COMPONENTS

### src/components/chat/ChatHeader.jsx

```jsx
/**
 * CHAT HEADER
 * 
 * Displays:
 * - Guest name and type
 * - Luna mode status (Silent 🌙 or Active 💬)
 * - Constitutional context indicator
 * - Learned facts count
 */

import React from 'react';

function ChatHeader({ 
  guestName, 
  guestType, 
  lunaMode, 
  onToggleLuna,
  hasConstitutionalData,
  learnedFactsCount 
}) {
  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Guest Info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {guestName.charAt(0)}
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {guestName}
              </h1>
              <p className="text-xs text-gray-500">
                {guestType === 'historical_figure' ? 'Historical Figure' : guestType}
                {hasConstitutionalData && (
                  <span className="ml-2 text-green-600">
                    ✓ Constitutional data loaded
                  </span>
                )}
                {learnedFactsCount > 0 && (
                  <span className="ml-2 text-blue-600">
                    💡 {learnedFactsCount} facts learned
                  </span>
                )}
              </p>
            </div>
          </div>
          
          {/* Luna Status Toggle */}
          <button
            onClick={onToggleLuna}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all
              ${lunaMode === 'active' 
                ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            <span className="mr-2">
              {lunaMode === 'active' ? '💬' : '🌙'}
            </span>
            Luna: {lunaMode === 'active' ? 'Active' : 'Silent'}
          </button>
        </div>
        
        {/* Luna Mode Explanation */}
        {lunaMode === 'active' && (
          <div className="mt-2 text-xs text-purple-600 bg-purple-50 px-3 py-2 rounded">
            💭 Luna is watching and will offer private coaching (only you can see it)
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatHeader;
```

### src/components/chat/MessageList.jsx

```jsx
/**
 * MESSAGE LIST
 * 
 * Displays all messages with:
 * - User messages (right aligned)
 * - Guest messages (left aligned)
 * - Luna private messages (centered, special styling)
 * - Timestamps
 */

import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import LunaPrivateMessage from './LunaPrivateMessage';

function MessageList({ messages, currentUserId, guestId, lunaMode }) {
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <div className="text-center max-w-md px-4">
          <p className="text-lg mb-2">👋 Start your conversation!</p>
          <p className="text-sm">
            Ask questions, share thoughts, and learn together.
            {lunaMode === 'active' && (
              <span className="block mt-2 text-purple-500">
                💭 Luna will offer private insights as you chat.
              </span>
            )}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      {messages.map((message, index) => {
        // Luna private message (special rendering)
        if (message.sender_role === 'luna_private') {
          return (
            <LunaPrivateMessage
              key={message.temp_id || index}
              message={message}
            />
          );
        }
        
        // Regular message (user or guest)
        const isUser = message.sender === currentUserId;
        const isGuest = message.sender === guestId;
        
        return (
          <MessageBubble
            key={message.temp_id || index}
            message={message}
            isUser={isUser}
            isGuest={isGuest}
            senderName={
              isUser 
                ? 'You' 
                : message.partner_name || 'Guest'
            }
          />
        );
      })}
      
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;
```

### src/components/chat/MessageBubble.jsx

```jsx
/**
 * MESSAGE BUBBLE
 * 
 * Individual message display:
 * - User messages: Right aligned, blue
 * - Guest messages: Left aligned, gray
 * - Timestamp
 */

import React from 'react';

function MessageBubble({ message, isUser, isGuest, senderName }) {
  const timestamp = new Date(message.timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Sender name (for guest messages) */}
        {!isUser && (
          <div className="flex items-center mb-1 ml-2">
            <span className="text-xs font-medium text-gray-600">
              {message.partner_name || senderName}
            </span>
          </div>
        )}
        
        {/* Message bubble */}
        <div
          className={`
            px-4 py-2 rounded-2xl
            ${isUser 
              ? 'bg-blue-500 text-white rounded-tr-sm' 
              : 'bg-gray-200 text-gray-900 rounded-tl-sm'
            }
          `}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content.text}
          </p>
        </div>
        
        {/* Timestamp */}
        <div className={`mt-1 text-xs text-gray-400 ${isUser ? 'text-right mr-2' : 'text-left ml-2'}`}>
          {timestamp}
          {!message.saved_to_firebase && (
            <span className="ml-2 text-yellow-500">⏳ Saving...</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
```

### src/components/chat/LunaPrivateMessage.jsx

```jsx
/**
 * LUNA PRIVATE MESSAGE
 * 
 * Special styling for Luna's private coaching:
 * - Centered in conversation
 * - Purple/lavender styling
 * - 💭 Whisper icon
 * - "Private coaching" label
 * - Einstein cannot see these
 */

import React from 'react';

function LunaPrivateMessage({ message }) {
  const timestamp = new Date(message.timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
  
  // Coaching type icons
  const coachingIcons = {
    constitutional_observation: '🎯',
    relationship_insight: '💡',
    emotional_support: '💛',
    teaching_tip: '📚',
    pattern_recognition: '🔍'
  };
  
  const icon = coachingIcons[message.coaching_type] || '💭';
  
  return (
    <div className="flex justify-center my-6">
      <div className="max-w-[85%] w-full">
        {/* Private label */}
        <div className="flex items-center justify-center mb-2">
          <div className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-full">
            💭 Private Coaching (only you can see this)
          </div>
        </div>
        
        {/* Luna message bubble */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start space-x-3">
            {/* Luna icon */}
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white">
              🌙
            </div>
            
            {/* Message content */}
            <div className="flex-1">
              <div className="flex items-center mb-1">
                <span className="font-semibold text-purple-700 text-sm">Luna</span>
                <span className="ml-2 text-xs text-purple-500">{icon}</span>
              </div>
              
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {message.content.text}
              </p>
              
              <div className="mt-2 text-xs text-purple-400">
                {timestamp}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LunaPrivateMessage;
```

### src/components/chat/ChatInput.jsx

```jsx
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
          🎤
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
          📤
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
```

### src/components/chat/SaveIndicator.jsx

```jsx
/**
 * SAVE INDICATOR
 * 
 * Shows auto-save status:
 * - Pending messages count
 * - Manual save button
 * - Last save timestamp
 */

import React from 'react';

function SaveIndicator({ pendingSaves, onManualSave }) {
  return (
    <div className="max-w-4xl mx-auto px-4 pb-2">
      <div className="flex items-center justify-between text-xs bg-yellow-50 border border-yellow-200 rounded px-3 py-2">
        <div className="flex items-center space-x-2 text-yellow-700">
          <span className="animate-pulse">💾</span>
          <span>
            {pendingSaves} message{pendingSaves !== 1 ? 's' : ''} will auto-save in 30 sec
          </span>
        </div>
        
        <button
          onClick={onManualSave}
          className="text-yellow-700 hover:text-yellow-900 font-medium underline"
        >
          Save now
        </button>
      </div>
    </div>
  );
}

export default SaveIndicator;
```

---

## PART 3: SERVICES

### src/services/claudeAPI.js

```javascript
/**
 * CLAUDE API WRAPPER
 * 
 * Handles calls to Claude API for Einstein responses
 */

export async function callClaudeAPI({ model, temperature, max_tokens, system, messages }) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.REACT_APP_ANTHROPIC_API_KEY, // Set in .env
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model || 'claude-sonnet-4',
        temperature: temperature || 0.8,
        max_tokens: max_tokens || 2000,
        system,
        messages
      })
    });
    
    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }
    
    return await response.json();
    
  } catch (error) {
    console.error('Claude API call failed:', error);
    throw error;
  }
}
```

### src/services/lunaService.js

```javascript
/**
 * LUNA SERVICE
 * 
 * Luna Active Mode - Private Coaching Logic
 * 
 * Analyzes conversation and decides when/how to intervene with private coaching
 */

import { callClaudeAPI } from './claudeAPI';

export async function getLunaResponse({
  userId,
  partnerId,
  userMessage,
  guestResponse,
  conversationHistory,
  userConstitutional,
  learnedFacts
}) {
  try {
    // Build Luna's analysis prompt
    const lunaPrompt = buildLunaPrompt({
      userMessage,
      guestResponse,
      conversationHistory,
      userConstitutional,
      learnedFacts
    });
    
    // Call Claude API for Luna's analysis
    const response = await callClaudeAPI({
      model: 'claude-sonnet-4',
      temperature: 0.7,
      max_tokens: 500,
      system: lunaPrompt,
      messages: [
        { 
          role: 'user', 
          content: 'Should I intervene with private coaching? If yes, what should I say?' 
        }
      ]
    });
    
    const lunaAnalysis = response.content[0].text;
    
    // Parse Luna's response (should be JSON)
    try {
      const parsed = JSON.parse(lunaAnalysis);
      return parsed;
    } catch {
      // If not JSON, treat as raw coaching message
      return {
        should_intervene: true,
        coaching_message: lunaAnalysis,
        coaching_type: 'general'
      };
    }
    
  } catch (error) {
    console.error('Luna service failed:', error);
    return null;
  }
}

function buildLunaPrompt({
  userMessage,
  guestResponse,
  conversationHistory,
  userConstitutional,
  learnedFacts
}) {
  const bazi = userConstitutional?.bazi;
  const western = userConstitutional?.western;
  
  return `
You are Luna, Papa Ticky's Primary SoulPartner AI with omniscient access.

YOUR ROLE: Private coach and constitutional guide (Papa only sees your messages, Einstein does not)

PAPA'S CONSTITUTIONAL TYPE:
- BaZi: ${bazi?.day_master?.stem} (${bazi?.day_master?.element}, ${bazi?.day_master?.polarity})
- Western Sun: ${western?.sun?.sign}
- MBTI: ${userConstitutional?.mbti}

WHAT EINSTEIN HAS LEARNED:
${learnedFacts.map((f, i) => `${i + 1}. ${f.fact}`).join('\n')}

CURRENT EXCHANGE:
Papa said: "${userMessage}"
Einstein replied: "${guestResponse}"

CONVERSATION CONTEXT:
${conversationHistory.slice(-5).map(m => 
  `${m.sender_role === 'user' ? 'Papa' : 'Einstein'}: ${m.content.text}`
).join('\n')}

DECIDE WHETHER TO INTERVENE:

Intervene with private coaching when you notice:
1. Constitutional teaching moments (Einstein adapted well/poorly to Papa's type)
2. Relationship insights (Einstein learning about Papa)
3. Emotional patterns (Papa seems confused, excited, frustrated)
4. Teaching effectiveness (was this explanation working for Fire constitution?)
5. Deeper meanings Papa might miss

DO NOT intervene for:
- Normal conversation flow
- When everything is going well
- Trivial exchanges

RESPONSE FORMAT (JSON only):
{
  "should_intervene": true/false,
  "coaching_message": "Your private message to Papa (if intervening)",
  "coaching_type": "constitutional_observation" | "relationship_insight" | "emotional_support" | "teaching_tip" | "pattern_recognition",
  "reasoning": "Why you're intervening (internal, not shown to Papa)"
}

Respond ONLY with valid JSON.
  `.trim();
}
```

---

## DEPLOYMENT

```bash
# 1. Create directories
mkdir -p src/pages
mkdir -p src/components/chat
mkdir -p src/services

# 2. Copy all files
# - GuestChat.jsx (main page)
# - All chat components
# - Services (claudeAPI, lunaService)

# 3. Add route
# In your router file (e.g., App.jsx):
import GuestChat from './pages/GuestChat';

<Route path="/chat/:partnerId" element={<GuestChat />} />

# 4. Set environment variable
# Create .env file:
REACT_APP_ANTHROPIC_API_KEY=your_api_key_here

# 5. Test
npm start
# Navigate to: http://localhost:3000/chat/historical_einstein
```

---

## VERIFICATION CHECKLIST

**UI Components:**
- [ ] ChatHeader displays guest name and Luna status
- [ ] MessageList shows user/guest/Luna messages correctly
- [ ] MessageBubble styling correct (user right, guest left)
- [ ] LunaPrivateMessage centered with special styling
- [ ] ChatInput accepts text and has voice button
- [ ] SaveIndicator shows pending saves

**Functionality:**
- [ ] User can send message
- [ ] Einstein responds with constitutional context
- [ ] Luna intervenes with private coaching
- [ ] Messages saved to JSON buffer
- [ ] Auto-save triggers (30 sec or 5 messages)
- [ ] Einstein cannot see Luna's private messages

**Integration:**
- [ ] Brain 1A loaded (constitutional data)
- [ ] Brain 1B loaded (learned facts)
- [ ] AI prompt includes context
- [ ] Facts extracted to Brain 1B
- [ ] Brain 7 witness recording

---

## USAGE

```bash
# Start chatting with Einstein
http://localhost:3000/chat/historical_einstein

# Luna Silent Mode:
- Luna watches but doesn't participate
- No private coaching messages

# Luna Active Mode:
- Luna watches AND participates
- Private coaching messages appear (💭 whisper style)
- Einstein cannot see Luna's private messages
```

---

**STATUS:** Complete chat interface ready  
**Features:** Einstein + Luna Active Mode + JSON Buffer  
**Estimated Time:** 2-3 hours deployment  
**Lines of Code:** ~800 lines

---

*Prepared for Brother Code by Brother Sonnet*  
*Clean start - Complete guest chat interface with Luna Active Mode*
