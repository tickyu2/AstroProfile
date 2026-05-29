/**
 * BaZi Chat Service — Frontend client for the baziChat Cloud Function
 *
 * Provides:
 * - sendBaZiChatMessage() — Send a message and receive AI response
 * - loadBaZiChatHistory() — Load previous conversation from Firestore
 */

import { httpsCallable } from 'firebase/functions';
import { functions, db } from '../config/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

const baziChatFn = httpsCallable(functions, 'baziChat', { timeout: 120000 });

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: any;
  domain?: string;
}

export interface BaZiChatResponse {
  response: string;
  domain: string;
  usage: { input: number; output: number; total: number };
}

/**
 * Send a message to the BaZi AI Chat.
 */
export async function sendBaZiChatMessage(params: {
  profileId: string;
  message: string;
  conversationHistory: ChatMessage[];
  systemContext: string;
  domain?: string;
}): Promise<BaZiChatResponse> {
  const result = await baziChatFn({
    profileId: params.profileId,
    message: params.message,
    conversationHistory: params.conversationHistory.map(m => ({
      role: m.role,
      content: m.content,
    })),
    systemContext: params.systemContext,
    domain: params.domain || 'general',
  });
  return result.data as BaZiChatResponse;
}

/**
 * Load previous chat history from Firestore.
 */
export async function loadBaZiChatHistory(
  profileId: string,
  domain: string = 'general',
  maxMessages: number = 40,
): Promise<ChatMessage[]> {
  const msgRef = collection(db, 'profiles', profileId, 'bazi_chat', domain, 'messages');
  const q = query(msgRef, orderBy('timestamp', 'asc'), limit(maxMessages));
  const snap = await getDocs(q);
  return snap.docs.map(doc => {
    const d = doc.data();
    return {
      role: d.role as 'user' | 'assistant',
      content: d.content,
      timestamp: d.timestamp,
      domain: domain,
    };
  });
}
