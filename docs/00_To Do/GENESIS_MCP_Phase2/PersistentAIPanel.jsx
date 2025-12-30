import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, BookOpen, Minimize2, Maximize2 } from 'lucide-react';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PERSISTENT AI SOUL PANEL
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 200-YEAR ARCHITECTURE:
 * - Always visible (not modal-based)
 * - Contextual to current view (BaZi tab = BaZi questions)
 * - Uses MCP server (not direct API calls)
 * - Works with any AI provider (Claude, GPT, Gemini, future)
 * - Modular and extensible
 * 
 * PLACEMENT:
 * - Right sidebar (desktop)
 * - Bottom panel (mobile)
 * - Collapsible but always accessible
 * - Never disappears
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

export default function PersistentAIPanel({ 
  userId, 
  userName,
  currentContext, // 'bazi_tab', 'mbti_tab', 'compatibility_page', etc.
  onMCPCall // Function to call your MCP server
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const messagesEndRef = useRef(null);

  // ═══════════════════════════════════════════════════════════════════════
  // UPDATE CONTEXT WHEN USER NAVIGATES
  // ═══════════════════════════════════════════════════════════════════════

  useEffect(() => {
    // Get contextual insights from MCP server
    loadContextualInsights();
  }, [currentContext]);

  async function loadContextualInsights() {
    try {
      // Call MCP server to get contextual focus
      const result = await onMCPCall('get_contextual_insights', {
        userId,
        context: currentContext,
      });

      // Extract suggested questions from MCP response
      const insights = JSON.parse(result);
      setSuggestedQuestions(insights.focusAreas.suggestedQuestions || []);

      // Add contextual welcome message
      if (messages.length === 0) {
        setMessages([
          {
            role: 'assistant',
            content: getContextualWelcome(currentContext, userName),
            timestamp: new Date(),
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to load contextual insights:', error);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CONTEXTUAL WELCOME MESSAGES
  // ═══════════════════════════════════════════════════════════════════════

  function getContextualWelcome(context, name) {
    const welcomes = {
      overview: `Hi ${name}! I'm Claude, your AI Soul Guide. I can see your complete constitutional profile. Ask me anything!`,
      bazi_tab: `${name}, I'm here to help you understand your BaZi Four Pillars. What would you like to know about your Day Master, elements, or Ten Gods?`,
      mbti_tab: `I can help you explore your MBTI type and how it relates to your other constitutional systems. What interests you about your cognitive functions?`,
      bigfive_tab: `Your Big Five personality profile reveals fascinating patterns. Ask me about any of your trait scores or how they interact!`,
      enneagram_tab: `Let's explore your Enneagram type together. I can explain your core motivations, wings, and growth paths.`,
      western_tab: `I can interpret your Western astrological chart - your Sun, Moon, Rising, and how the planets influence you.`,
      numerology_tab: `Your numerology reveals your life path and soul mission. What numbers are you curious about?`,
      compatibility_page: `I can help you understand constitutional compatibility - what makes souls resonate together across all systems.`,
    };

    return welcomes[context] || welcomes.overview;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SEND MESSAGE TO MCP SERVER
  // ═══════════════════════════════════════════════════════════════════════

  async function handleSend() {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // FIRST: Get user's constitution via MCP
      const constitutionResult = await onMCPCall('get_user_constitution', { userId });
      const constitution = JSON.parse(constitutionResult);

      // THEN: AI analyzes with constitutional context
      // NOTE: This still requires AI, but now through MCP architecture
      // The MCP server provides data, AI provider interprets it
      // This can be Claude, GPT, Gemini, or any future AI
      
      const aiResponse = await getAIInterpretation(
        input,
        constitution,
        currentContext,
        messages.slice(-10)
      );

      const assistantMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Panel error:', error);
      
      const errorMessage = {
        role: 'assistant',
        content: "I'm having trouble accessing your constitutional data. Please try again.",
        timestamp: new Date(),
        isError: true,
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // AI INTERPRETATION (Provider-Agnostic)
  // ═══════════════════════════════════════════════════════════════════════

  async function getAIInterpretation(question, constitution, context, history) {
    // This function calls whichever AI provider you're using
    // Could be Claude, GPT, Gemini, or future models
    // The MCP architecture ensures you're not locked in
    
    // For now, this would call your AI provider's API
    // But the key is: it's separate from the MCP layer
    // MCP provides DATA, AI provides INTERPRETATION
    
    return "AI interpretation goes here (from your chosen provider)";
  }

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════

  if (isCollapsed) {
    return (
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50">
        <button
          onClick={() => setIsCollapsed(false)}
          className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-4 rounded-l-2xl shadow-2xl hover:scale-110 transition-all"
        >
          <Maximize2 className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-0 bottom-0 w-96 bg-gradient-to-br from-purple-900/95 to-blue-900/95 backdrop-blur-lg border-l border-purple-500/30 shadow-2xl z-50 flex flex-col">
      
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* HEADER */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="flex items-center justify-between p-6 border-b border-purple-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">AI Soul Guide</h3>
            <p className="text-xs text-purple-300">
              {getContextLabel(currentContext)}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <Minimize2 className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MESSAGES */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${
              message.role === 'user'
                ? 'bg-gradient-to-br from-pink-500 to-purple-500 ml-8'
                : message.isError
                ? 'bg-red-500/20 border border-red-500/30'
                : 'bg-white/10 backdrop-blur-sm border border-white/20 mr-8'
            } rounded-2xl p-4 text-white`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
            <p className="text-xs opacity-60 mt-2">
              {message.timestamp.toLocaleTimeString()}
            </p>
          </div>
        ))}

        {isLoading && (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 flex items-center gap-3 mr-8">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200" />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SUGGESTED QUESTIONS */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {suggestedQuestions.length > 0 && (
        <div className="px-6 pb-4 border-t border-purple-500/30 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-purple-300" />
            <p className="text-xs text-purple-300 font-medium">
              Suggested for this section:
            </p>
          </div>
          <div className="space-y-2">
            {suggestedQuestions.slice(0, 3).map((question, index) => (
              <button
                key={index}
                onClick={() => setInput(question)}
                className="w-full text-left text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-purple-200 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* INPUT */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="p-6 border-t border-purple-500/30">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask about ${getContextLabel(currentContext)}...`}
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl px-4 py-3 text-white transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function getContextLabel(context) {
  const labels = {
    overview: 'Your Soul Map',
    bazi_tab: 'BaZi Analysis',
    mbti_tab: 'MBTI Insights',
    bigfive_tab: 'Big Five Profile',
    enneagram_tab: 'Enneagram Journey',
    western_tab: 'Western Astrology',
    numerology_tab: 'Numerology',
    compatibility_page: 'Compatibility',
  };

  return labels[context] || 'Constitutional Analysis';
}
