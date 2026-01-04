/**
 * FourBubbleChatInterface - CCLR 4-Bubble Chat
 *
 * Unique chat interface with 4 participants:
 * - Partner A (blue - left side)
 * - Partner B (green - left side)
 * - Angel C (purple - right side)
 * - Angel D (pink - right side)
 *
 * Visual distinction:
 * - Human messages on left (blue/green)
 * - Angel messages on right (purple/pink)
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  sendMessage,
  subscribeToMessages,
  getAngelCouple
} from '../../services/cclr';
import { httpsCallable, getFunctions } from 'firebase/functions';

// Sender type configurations
const SENDER_CONFIGS = {
  partnerA: {
    label: 'Partner A',
    color: 'blue',
    bgClass: 'bg-blue-500/20',
    borderClass: 'border-blue-500',
    textClass: 'text-blue-400',
    icon: '💙',
    side: 'left'
  },
  partnerB: {
    label: 'Partner B',
    color: 'green',
    bgClass: 'bg-green-500/20',
    borderClass: 'border-green-500',
    textClass: 'text-green-400',
    icon: '💚',
    side: 'left'
  },
  angelC: {
    label: 'Angel',
    color: 'purple',
    bgClass: 'bg-purple-500/20',
    borderClass: 'border-purple-500',
    textClass: 'text-purple-400',
    icon: '💜',
    side: 'right'
  },
  angelD: {
    label: 'Angel',
    color: 'pink',
    bgClass: 'bg-pink-500/20',
    borderClass: 'border-pink-500',
    textClass: 'text-pink-400',
    icon: '💖',
    side: 'right'
  }
};

function MessageBubble({ message, session }) {
  const senderType = message.sender?.type || 'partnerA';
  const config = SENDER_CONFIGS[senderType] || SENDER_CONFIGS.partnerA;
  const isAngel = senderType.startsWith('angel');

  // Get angel name if applicable
  let senderName = message.sender?.name || config.label;
  if (isAngel && message.sender?.coupleId) {
    const couple = getAngelCouple(message.sender.coupleId);
    if (couple) {
      const angel = senderType === 'angelC' ? couple.angel1 : couple.angel2;
      senderName = angel?.name || senderName;
    }
  }

  return (
    <div className={`flex ${config.side === 'right' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] ${config.bgClass} border ${config.borderClass} rounded-2xl p-4 ${
          config.side === 'right' ? 'rounded-br-sm' : 'rounded-bl-sm'
        }`}
      >
        {/* Sender header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{config.icon}</span>
          <span className={`text-sm font-medium ${config.textClass}`}>
            {senderName}
          </span>
        </div>

        {/* Message content */}
        <p className="text-white/90 whitespace-pre-wrap">
          {message.content?.text || ''}
        </p>

        {/* Timestamp */}
        <p className="text-slate-500 text-xs mt-2">
          {message.createdAt?.toDate?.()?.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          }) || 'Just now'}
        </p>
      </div>
    </div>
  );
}

export default function FourBubbleChatInterface({
  session,
  activeAngelCouple,
  onInviteAngel
}) {
  const { currentUser, userProfile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [generatingAngel, setGeneratingAngel] = useState(false);
  const messagesEndRef = useRef(null);

  // Determine user's role in session
  const isPartnerA = session?.participants?.partnerA?.userId === currentUser?.uid;
  const isPartnerB = session?.participants?.partnerB?.userId === currentUser?.uid;
  const userRole = isPartnerA ? 'partnerA' : isPartnerB ? 'partnerB' : null;
  const userName = isPartnerA
    ? session?.participants?.partnerA?.name
    : session?.participants?.partnerB?.name;

  // Subscribe to real-time messages
  useEffect(() => {
    if (!session?.sessionId) return;

    const unsubscribe = subscribeToMessages(session.sessionId, (newMessages) => {
      setMessages(newMessages);
    });

    return () => unsubscribe?.();
  }, [session?.sessionId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Get current angel couple
  const angelCouple = activeAngelCouple ? getAngelCouple(activeAngelCouple) : null;

  // Handle sending message
  const handleSend = async () => {
    if (!inputText.trim() || !userRole || sending) return;

    const text = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      // Send user message
      await sendMessage(session.sessionId, {
        senderType: userRole,
        userId: currentUser.uid,
        senderName: userName,
        text
      });

      // If angel couple is active, generate angel response
      if (angelCouple) {
        setGeneratingAngel(true);
        await generateAngelResponse(text);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
      setGeneratingAngel(false);
    }
  };

  // Generate angel response via Cloud Function
  const generateAngelResponse = async (userMessage) => {
    try {
      const functions = getFunctions();
      const generateCCLRResponse = httpsCallable(functions, 'generateCCLRResponse');

      const result = await generateCCLRResponse({
        sessionId: session.sessionId,
        coupleId: activeAngelCouple,
        userMessage,
        partnerRole: userRole,
        conversationContext: messages.slice(-10)
      });

      // Response is automatically added to Firestore by Cloud Function
      if (!result.data?.success) {
        console.error('Angel response error:', result.data?.error);
      }
    } catch (error) {
      console.error('Error generating angel response:', error);
    }
  };

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900">
      {/* Header with angel info */}
      <div className="p-4 bg-slate-800/50 border-b border-slate-700">
        <div className="flex items-center justify-between">
          {angelCouple ? (
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 border-slate-700"
                  style={{ backgroundColor: angelCouple.angel1?.color + '40' }}
                >
                  {angelCouple.angel1?.icon?.[0] || '💜'}
                </div>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 border-slate-700"
                  style={{ backgroundColor: angelCouple.angel2?.color + '40' }}
                >
                  {angelCouple.angel2?.icon?.[0] || '💖'}
                </div>
              </div>
              <div>
                <p className="text-white font-medium text-sm">
                  Guided by {angelCouple.coupleName}
                </p>
                <p className="text-slate-400 text-xs">
                  {angelCouple.angelWisdom?.substring(0, 60)}...
                </p>
              </div>
            </div>
          ) : (
            <p className="text-slate-400">No angel couple selected</p>
          )}

          <button
            onClick={onInviteAngel}
            className="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-lg text-sm hover:bg-purple-500/30 transition-colors"
          >
            + Invite Angels
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">💕</div>
            <h3 className="text-white font-medium mb-2">
              Welcome to Your CCLR Session
            </h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Share your thoughts and feelings. The angels will offer wisdom
              from their own love story to help guide you.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              session={session}
            />
          ))
        )}
        <div ref={messagesEndRef} />

        {/* Generating indicator */}
        {generatingAngel && (
          <div className="flex justify-end mb-4">
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl rounded-br-sm p-4 max-w-[80%]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200" />
                <span className="text-purple-300 text-sm ml-2">
                  {angelCouple?.shortName || 'Angels'} are reflecting...
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-4 bg-slate-800/50 border-t border-slate-700">
        {!userRole ? (
          <div className="text-center text-slate-400 py-4">
            You are viewing this session. Only participants can send messages.
          </div>
        ) : (
          <div className="flex items-end gap-3">
            {/* Sender indicator */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${
              isPartnerA ? 'bg-blue-500/20 border border-blue-500' : 'bg-green-500/20 border border-green-500'
            }`}>
              {isPartnerA ? '💙' : '💚'}
            </div>

            {/* Text input */}
            <div className="flex-1">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Share your thoughts, ${userName}...`}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 resize-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                rows={2}
                disabled={sending}
              />
            </div>

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || sending}
              className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              {sending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
