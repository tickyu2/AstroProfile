/**
 * GENESIS Transcript Testing Interface
 * Phase 6: Test emotional intelligence with real conversations
 */

import React, { useState, useRef } from 'react';
import { ConversationParser } from '../../lib/conversationParser';
import { MessageAnalyzer } from '../../lib/messageAnalyzer';
import { MessageAnnotation } from './MessageAnnotation';
import { ArchetypeProgression } from './ArchetypeProgression';
import { PDFExporter } from '../../lib/pdfExporter';
import { getOpusPerspective } from '../../services/aiSoulPartnerService';
import './TranscriptTester.css';

export function TranscriptTester() {
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [voiceEmotionOverride, setVoiceEmotionOverride] = useState('auto');
  const [loadedFileName, setLoadedFileName] = useState(null);
  const [reflection, setReflection] = useState(null);
  const [isGeneratingReflection, setIsGeneratingReflection] = useState(false);
  const fileInputRef = useRef(null);

  const handleAnalyze = async () => {
    if (!transcript.trim()) return;

    setIsAnalyzing(true);

    try {
      // Parse conversation
      const parser = new ConversationParser();
      const messages = parser.parse(transcript);

      // Analyze each message
      const analyzer = new MessageAnalyzer();
      const analyzed = await analyzer.analyzeConversation(
        messages,
        voiceEmotionOverride === 'auto' ? null : voiceEmotionOverride
      );

      setAnalysis(analyzed);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Error analyzing transcript. Please check format.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setTranscript('');
    setAnalysis(null);
    setLoadedFileName(null);
    setReflection(null);
  };

  const handleLoadMD = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        // Check if this is a SoulPartner export format
        const isSoulPartnerExport = content.includes('## 👤 User') || content.includes('## 🐀 Luna');

        let processed = content;

        if (isSoulPartnerExport) {
          // SoulPartner Chat Export Format
          // Split by message blocks (--- separators)
          const blocks = content.split(/^---$/gm);
          const messages = [];

          for (const block of blocks) {
            // Skip header block and empty blocks
            if (block.includes('# AI SoulPartner Conversation') || !block.trim()) continue;

            // Detect speaker
            const isUser = /##\s*👤\s*User/i.test(block);
            const isAI = /##\s*🐀\s*Luna|##\s*🤖|##\s*Luna/i.test(block);

            if (isUser || isAI) {
              // Extract message content (remove headers, timestamps, mode indicators)
              let messageContent = block
                .replace(/^##\s*👤\s*User.*$/gim, '') // Remove user header
                .replace(/^##\s*🐀\s*Luna.*$/gim, '') // Remove Luna header
                .replace(/^\*[\d\/,:\s]+[AP]M\*.*$/gim, '') // Remove timestamps
                .replace(/^##\s+[^#\n]+$/gim, '') // Remove markdown headers within message
                .replace(/^\*\*[^*]+\*\*$/gim, (match) => match) // Keep bold text
                .replace(/^>\s*\*\*Profile:\*\*.*/gim, '') // Remove profile line
                .replace(/^>\s*\*\*Date:\*\*.*/gim, '') // Remove date line
                .replace(/^>\s*\*\*Messages:\*\*.*/gim, '') // Remove messages count line
                .trim();

              // Take first meaningful paragraph as the message (skip headers)
              const lines = messageContent.split('\n').filter(l => l.trim());
              // Find first non-header line
              let mainContent = [];
              for (const line of lines) {
                // Skip lines that are just markdown headers or formatting
                if (/^#+\s/.test(line)) continue;
                if (/^\*\*[^*]+:\*\*$/.test(line)) continue; // Skip bold labels
                mainContent.push(line);
              }

              // Join and clean up
              messageContent = mainContent.join(' ')
                .replace(/\s+/g, ' ')
                .trim();

              // Truncate to reasonable length for analysis (first ~500 chars)
              if (messageContent.length > 500) {
                messageContent = messageContent.substring(0, 500) + '...';
              }

              if (messageContent) {
                const speaker = isUser ? 'User' : 'AI';
                messages.push(`${speaker}: ${messageContent}`);
              }
            }
          }

          processed = messages.join('\n\n');
        } else {
          // Standard MD conversation formats
          // Format: **User:** or **Human:** -> User:
          processed = processed.replace(/\*\*(User|Human|Customer|Person):\*\*/gi, 'User:');
          // Format: **AI:** or **Assistant:** or **Luna:** -> AI:
          processed = processed.replace(/\*\*(AI|Assistant|Bot|Luna|System):\*\*/gi, 'AI:');

          // Format: ### User or ### Human -> User:
          processed = processed.replace(/^###\s*(User|Human|Customer|Person)\s*$/gim, 'User:');
          processed = processed.replace(/^###\s*(AI|Assistant|Bot|Luna|System)\s*$/gim, 'AI:');

          // Format: > User: (blockquote) -> User:
          processed = processed.replace(/^>\s*(User|Human|Customer|Person):/gim, 'User:');
          processed = processed.replace(/^>\s*(AI|Assistant|Bot|Luna|System):/gim, 'AI:');

          // Remove markdown headers that aren't speaker labels
          processed = processed.replace(/^#+\s+(?!User|Human|AI|Assistant|Luna).+$/gim, '');

          // Clean up extra blank lines
          processed = processed.replace(/\n{3,}/g, '\n\n');
        }

        setTranscript(processed.trim());
        setLoadedFileName(file.name);
        setAnalysis(null);
      }
    };
    reader.readAsText(file);

    // Reset input so same file can be loaded again
    e.target.value = '';
  };

  const handleLoadExample = () => {
    const example = `User: I'm thinking about starting a business but I'm really scared
AI: That's exciting! What kind of business are you considering?
User: I feel so broken and lost right now
AI: I hear that you're going through a difficult time.
User: Yeah... I don't know. Maybe I should just forget about it.
AI: What's making you feel scared about starting the business?`;

    setTranscript(example);
  };

  const handleExportPDF = () => {
    if (!analysis) return;
    const exporter = new PDFExporter();
    exporter.export(analysis, analysis.messages, reflection);
  };

  const handleGenerateReflection = async () => {
    if (!transcript.trim()) return;

    setIsGeneratingReflection(true);

    try {
      // Build context for reflection
      const analysisContext = analysis ? `
Analysis Summary:
- Dominant Archetype: ${analysis.dominantArchetype}
- Emotional Journey: ${analysis.emotionalJourney}
- Key Patterns: ${analysis.keyPatterns.join(', ') || 'None'}
- Crisis Indicators: ${analysis.crisisCount > 0 ? `${analysis.crisisCount} detected` : 'None'}
- Total Messages: ${analysis.messages.length}
` : '';

      const reflectionPrompt = `You are analyzing a conversation transcript. Please provide a thoughtful, philosophical reflection on this conversation.

Structure your reflection with these sections:
1. **Overview** - What is this conversation fundamentally about?
2. **Key Themes** - What recurring ideas or concerns emerge?
3. **Emotional Arc** - How does the emotional tone evolve?
4. **Insights** - What deeper truths or patterns are revealed?
5. **Significance** - Why does this conversation matter? What can we learn from it?

Be thoughtful, perceptive, and avoid superficial observations. Look for the deeper meaning beneath the surface.

${analysisContext}

CONVERSATION TRANSCRIPT:
${transcript}

Please provide your reflection:`;

      const result = await getOpusPerspective({
        claudeResponse: '',
        userMessage: reflectionPrompt,
        conversationContext: transcript,
        customQuestion: 'Generate a thoughtful reflection on this conversation'
      });

      if (result.success) {
        setReflection({
          text: result.text,
          generatedAt: new Date().toISOString(),
          speaker: result.speaker || 'GENESIS Reflection'
        });
      } else {
        throw new Error(result.error || 'Failed to generate reflection');
      }
    } catch (error) {
      console.error('Reflection generation error:', error);
      alert('Error generating reflection. Please try again.');
    } finally {
      setIsGeneratingReflection(false);
    }
  };

  return (
    <div className="transcript-tester">
      <div className="tester-header">
        <h1>GENESIS Transcript Analyzer</h1>
        <p className="subtitle">Test the emotional intelligence engine with real conversations</p>
      </div>

      <div className="tester-layout">
        {/* Input Panel */}
        <div className="input-panel">
          <div className="panel-header">
            <h2>Input Transcript</h2>
            <div className="header-actions">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".md,.txt,.markdown"
                style={{ display: 'none' }}
              />
              <button onClick={handleLoadMD} className="btn-secondary btn-file">
                📁 Load MD
              </button>
              <button onClick={handleLoadExample} className="btn-secondary">
                Load Example
              </button>
              <button onClick={handleClear} className="btn-secondary">
                Clear
              </button>
            </div>
          </div>
          {loadedFileName && (
            <div className="loaded-file-indicator">
              📄 Loaded: <strong>{loadedFileName}</strong>
            </div>
          )}

          <textarea
            className="transcript-input"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder={`Paste conversation transcript here...\n\nFormat:\nUser: message text\nAI: response text\nUser: next message\n...`}
            rows={15}
          />

          <div className="input-options">
            <label>
              Voice Emotion Detection:
              <select
                value={voiceEmotionOverride}
                onChange={(e) => setVoiceEmotionOverride(e.target.value)}
              >
                <option value="auto">Auto-detect from text</option>
                <option value="neutral">Force Neutral</option>
                <option value="happy">Force Happy</option>
                <option value="sad">Force Sad</option>
                <option value="angry">Force Angry</option>
                <option value="anxious">Force Anxious</option>
              </select>
            </label>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !transcript.trim()}
            className="btn-primary analyze-btn"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Transcript'}
          </button>

          <div className="format-help">
            <h3>Format Guide:</h3>
            <ul>
              <li><code>User:</code> or <code>Human:</code> for user messages</li>
              <li><code>AI:</code> or <code>Assistant:</code> for AI responses</li>
              <li>Each message on a new line</li>
              <li>Blank lines between messages (optional)</li>
            </ul>
          </div>
        </div>

        {/* Results Panel */}
        <div className="results-panel">
          {analysis ? (
            <>
              <div className="panel-header">
                <h2>Analysis Results</h2>
                <div className="header-actions">
                  <span className="message-count">
                    {analysis.messages.length} messages analyzed
                  </span>
                  <button
                    onClick={handleGenerateReflection}
                    disabled={isGeneratingReflection}
                    className="btn-secondary btn-reflection"
                  >
                    {isGeneratingReflection ? '✨ Generating...' : '🪞 Generate Reflection'}
                  </button>
                  <button onClick={handleExportPDF} className="btn-secondary">
                    Export PDF
                  </button>
                </div>
              </div>

              {/* Archetype Progression */}
              <div className="section">
                <h3>Archetype Progression</h3>
                <ArchetypeProgression messages={analysis.messages} />
              </div>

              {/* Message Annotations */}
              <div className="section">
                <h3>Detailed Analysis</h3>
                <div className="messages-list">
                  {analysis.messages.map((msg, index) => (
                    <MessageAnnotation
                      key={index}
                      message={msg}
                      index={index}
                    />
                  ))}
                </div>
              </div>

              {/* Conversation Summary */}
              <div className="section summary">
                <h3>Conversation Summary</h3>
                <div className="summary-stats">
                  <div className="stat">
                    <span className="label">Dominant Archetype:</span>
                    <span className="value">{analysis.dominantArchetype}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Emotional Journey:</span>
                    <span className="value">{analysis.emotionalJourney}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Key Patterns:</span>
                    <span className="value">
                      {analysis.keyPatterns.join(', ') || 'None detected'}
                    </span>
                  </div>
                  <div className="stat">
                    <span className="label">Crisis Indicators:</span>
                    <span className={`value ${analysis.crisisCount > 0 ? 'warning' : ''}`}>
                      {analysis.crisisCount > 0 ? `${analysis.crisisCount} detected` : 'None'}
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Reflection Section */}
              {reflection ? (
                <div className="section reflection-section">
                  <div className="reflection-header">
                    <h3>🪞 My Reflection on This Conversation</h3>
                    <span className="reflection-meta">
                      Generated by {reflection.speaker} • {new Date(reflection.generatedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="reflection-content">
                    {reflection.text.split('\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                  <div className="reflection-actions">
                    <button
                      onClick={handleGenerateReflection}
                      disabled={isGeneratingReflection}
                      className="btn-secondary"
                    >
                      {isGeneratingReflection ? 'Regenerating...' : '🔄 Regenerate'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="section reflection-prompt">
                  <div className="reflection-empty">
                    <span className="reflection-icon">🪞</span>
                    <p>Click "Generate Reflection" to get an AI-powered thoughtful analysis of this conversation</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>No Analysis Yet</h3>
              <p>Enter a conversation transcript and click "Analyze" to see detailed emotional intelligence analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
