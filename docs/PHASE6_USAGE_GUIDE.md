# Phase 6: Complete Testing & Response Generation - Usage Guide

## Quick Start

### 1. Dependencies Already Installed
```bash
npm install jspdf jspdf-autotable
```

### 2. Access the Testing Interface
Navigate to: `http://localhost:5173/transcript-tester`

---

## Features

### Transcript Testing Interface
- Paste any conversation transcript
- Automatic speaker detection
- Real-time analysis
- Visual archetype progression

### Response Generation (Phase 2)
- Template-based responses (fallback)
- LLM integration ready
- Voice modulation parameters
- Strategy-aware generation

### Learning System (Phase 3)
- Feedback collection
- Accuracy tracking
- Adaptation suggestions
- Export/import learning data

### PDF Export
- Professional reports
- Detailed analysis
- Pattern frequency
- Recommendations

---

## How to Use

### 1. Test a Transcript

1. Navigate to `/transcript-tester`
2. Paste conversation in the format:
   ```
   User: I'm feeling really overwhelmed today
   AI: I hear you. What's happening?
   User: Everything is just too much
   ```
3. Click "Analyze Transcript"
4. View results in the right panel

### 2. Understand the Results

**Archetype Progression:** Visual timeline showing emotional states
- 🌱 Seed - Exploring/uncertain
- 🪞 Mirror - Reflecting
- 💝 Mender - Healing/vulnerable
- 📚 Librarian - Remembering
- 🎼 Conductor - Organizing
- 🤝 Companion - Connecting
- 🛡️ Guardian - Protecting
- 🔥 Flamebearer - Passionate
- 🧭 Guide - Integrating wisdom

**Message Details:** Click to expand each message for:
- Detected signals
- Voice emotion estimate
- Patterns detected
- Recommendations

**Summary:** Overall conversation insights

### 3. Export Analysis

Click "Export PDF" to generate a professional report including:
- Conversation summary
- Message-by-message analysis
- Pattern frequency
- Key recommendations

---

## API Usage

### Analyze Messages Programmatically

```javascript
import { MessageAnalyzer } from './lib/messageAnalyzer';

const analyzer = new MessageAnalyzer();
const result = analyzer.analyzeMessage({
  speaker: 'user',
  text: 'I feel helpless',
  timestamp: Date.now()
}, [], null);

console.log(result.archetype); // { type: 'Mender', confidence: 0.75 }
console.log(result.signals); // { vulnerabilityLevel: 0.6, ... }
console.log(result.congruence); // { level: 'MODERATE', patterns: [...] }
```

### Generate Responses

```javascript
import { ResponseGenerator } from './lib/responseGenerator';

const generator = new ResponseGenerator();
const response = await generator.generateResponse(analysis);

console.log(response.text);
// "I hear the pain in what you're sharing. That sounds really difficult."
```

### With LLM Integration

```javascript
// Configure with your LLM endpoint
const generator = new ResponseGenerator('https://your-llm-api.com/chat');

// Generates using LLM with GENESIS-enhanced system prompt
const response = await generator.generateResponse(analysis, conversationHistory);
```

### Voice Modulation for TTS

```javascript
const voiceParams = generator.getVoiceModulation(analysis);
// { rate: 0.9, pitch: 0.95, volume: 0.95, style: 'warm' }

// Use with your TTS system
await synthesizeSpeech(response.text, voiceParams);
```

### Learning System

```javascript
import { LearningSystem } from './lib/learningSystem';

const learning = new LearningSystem();

// Record feedback after user interaction
learning.recordFeedback(analysis, response, {
  rating: 5,
  accurate: true,
  helpful: true,
  comments: "Response was empathetic"
});

// Get insights
const insights = learning.getInsights();
console.log(insights.archetypeAccuracy);
// { Mender: { accuracy: "87.5%", total: 24 } }

// Export/import learning data
const data = learning.exportData();
learning.importData(data);
```

---

## File Structure

```
src/
├── components/
│   └── testing/
│       ├── TranscriptTester.jsx    # Main testing interface
│       ├── TranscriptTester.css    # Styling
│       ├── MessageAnnotation.jsx   # Message detail view
│       ├── MessageAnnotation.css   # Message styling
│       ├── ArchetypeProgression.jsx# Archetype timeline
│       ├── ArchetypeProgression.css# Timeline styling
│       └── index.js                # Exports
├── lib/
│   ├── conversationParser.js       # Parse transcripts
│   ├── messageAnalyzer.js          # GENESIS analysis
│   ├── responseGenerator.js        # Response generation
│   ├── learningSystem.js           # Feedback & learning
│   └── pdfExporter.js              # PDF export
├── pages/
│   └── TranscriptTesterPage.jsx    # Page wrapper
└── App.jsx                         # Route added
```

---

## Troubleshooting

### PDF Export Fails
If jsPDF is not available, the system will fallback to JSON export.
```bash
npm install jspdf jspdf-autotable
```

### Transcript Not Parsing
Check format - each message needs a speaker prefix:
```
User: message text    ✓
Human: message text   ✓
AI: response text     ✓
Assistant: response   ✓

message text          ✗ (no prefix)
```

### Analysis Returns "Seed" for Everything
- Check if text contains recognizable emotional keywords
- Try forcing voice emotion override for testing
- Review signal extraction in messageAnalyzer.js

---

## Integration with Luna

### Full Pipeline Example

```javascript
import { MessageAnalyzer } from './lib/messageAnalyzer';
import { ResponseGenerator } from './lib/responseGenerator';
import { LearningSystem } from './lib/learningSystem';

// Initialize
const analyzer = new MessageAnalyzer();
const generator = new ResponseGenerator(LUNA_LLM_ENDPOINT);
const learning = new LearningSystem();

// 1. User sends message
const userMessage = { speaker: 'user', text: 'I feel helpless' };

// 2. Analyze with GENESIS
const analysis = analyzer.analyzeMessage(userMessage, conversationHistory, voiceEmotion);

// 3. Generate response
const response = await generator.generateResponse(analysis, conversationHistory);

// 4. Get voice modulation for TTS
const voiceParams = generator.getVoiceModulation(analysis);

// 5. Synthesize speech
await synthesizeSpeech(response.text, voiceParams);

// 6. After user feedback
learning.recordFeedback(analysis, response, {
  rating: userRating,
  accurate: true,
  helpful: wasHelpful
});
```

---

## Phase 6 Complete Summary

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║              PHASE 6: TESTING & RESPONSE COMPLETE            ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

Components Delivered:

1. ✅ Transcript Testing Interface
   ├─ TranscriptTester.jsx
   ├─ MessageAnnotation.jsx
   ├─ ArchetypeProgression.jsx
   └─ Full CSS styling

2. ✅ Conversation Parser
   └─ Automatic speaker detection

3. ✅ Message Analyzer
   └─ Full GENESIS integration

4. ✅ Response Generator (Phase 2)
   ├─ Template-based fallback
   ├─ LLM integration ready
   ├─ Voice modulation
   └─ Strategy-aware responses

5. ✅ Learning System (Phase 3)
   ├─ Feedback collection
   ├─ Accuracy tracking
   ├─ Adaptation suggestions
   └─ Export/import data

6. ✅ PDF Exporter
   ├─ Professional reports
   ├─ Pattern analysis
   └─ Recommendations

Status: 🟢 PRODUCTION READY
```

---

**Access the Transcript Tester at: `/transcript-tester`**
