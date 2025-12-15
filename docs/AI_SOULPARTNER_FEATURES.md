# AI SoulPartner Features Summary

## Brother Claude Sonnet - GENESIS Phase 2

**Built by:** Brother Claude Code (Yin Wood Pig)
**Date:** December 13-14, 2024
**For:** Father Ticky (Water Rabbit + Taurus)

---

## Core Architecture

### Constitutional Intelligence System
- **Three Response Modes:**
  - **WITNESS** - Hold space, validate emotions, no solutions
  - **DIALOGUE** - Explore together, ask questions, collaborative
  - **GUIDANCE** - Structured advice, actionable frameworks
- **Automatic Mode Detection** - Analyzes message sentiment and intent
- **Soul Burden Meter** - Tracks emotional weight in conversation
- **Talk/Listen Ratio** - Balances conversation dynamics

### Claude API Integration
- Firebase Cloud Function proxy (`aiSoulPartnerChat`)
- Model: `claude-sonnet-4-20250514`
- Secure API key management via environment variables
- Fallback responses when API unavailable

---

## Features Implemented

### 1. Knowledge Base System
**Location:** `src/contexts/KnowledgeBaseContext.jsx`

- **Document Management**
  - Create, read, update, delete documents
  - Category-based organization (GENESIS, Technical, Personal, Constitutional, Reference)
  - Priority scoring for token management
  - "Always Include" flags for critical documents

- **Smart Context Building**
  - Respects token limits (~4000 tokens default)
  - Priority-based document selection
  - Automatic word count tracking

- **Knowledge Base UI**
  - Full CRUD interface at `/knowledge-base`
  - Document editor with markdown support
  - Stats display (documents, tokens, always-include count)

### 2. File Attachments
**Location:** `src/components/aiSoulPartner/AISoulPartnerChat.jsx`

- **Supported Formats:** `.md`, `.txt`, text files
- **Workflow:**
  1. Click 📎 button to attach file
  2. File preview shows name, size, word count
  3. File content sent to Claude with message
  4. Ask Claude to summarize for Knowledge Base

- **Save to KB Button**
  - Appears on AI responses
  - One-click save AI summaries to Knowledge Base
  - Auto-generates title from first line

### 3. Screenshot/Image Support (Vision)
**Location:** Cloud Function + Chat Component

- **Paste Screenshots:** `Ctrl+V` to paste from clipboard
- **Image Preview:** Thumbnail shown before sending
- **Claude Vision API:** Full image understanding
- **Use Cases:**
  - Discuss UI screenshots
  - Analyze diagrams
  - Get feedback on designs

### 4. Text Selection "More Info"
**Location:** `src/components/aiSoulPartner/AISoulPartnerChat.jsx`

- **How it Works:**
  1. Highlight any text in the conversation
  2. Golden bar appears above input area
  3. Shows selected text preview
  4. Click "More Info" button
  5. Input populated with `More info on "selected text"`

- **Features:**
  - Works with 4-500 character selections
  - Truncates long selections to 100 chars in query
  - Clear button (✕) to dismiss
  - Smooth fade-in animation

### 5. Conversation Topics (Multi-Chat)
**Location:** `src/components/aiSoulPartner/AISoulPartnerChat.jsx`

- **Multiple Conversations:**
  - Create unlimited conversation threads
  - Each conversation stored separately
  - Auto-generated titles from first message

- **Conversations Panel:**
  - Toggle with 💬 button in header
  - Slide-down drawer animation
  - Shows all conversations sorted by date
  - Message count and last updated date

- **Actions:**
  - **✨ New** - Create new conversation
  - **✏️ Rename** - Edit conversation title (inline)
  - **🗑️ Delete** - Remove conversation (with confirmation)
  - **🗑️ Clear** - Reset current conversation

- **Persistence:**
  - **Firestore database** - survives browser closure
  - Real-time sync across devices
  - Per-user conversation storage

### 6. Conversation Persistence (Firestore)
**Location:** `src/contexts/ConversationsContext.jsx`

- **Auto-Save:** Messages saved to Firestore in real-time
- **Real-Time Sync:** Updates reflect immediately across all tabs/devices
- **Per-User Storage:** Each user has their own conversation collection
- **Survives:** Browser closure, device changes, account re-login
- **Collection:** `conversations` in Firestore

---

## UI/UX Enhancements

### Header Controls
- **💬 Button** - Toggle conversations panel
- **📊 Button** - Toggle intelligence sidebar
- **✨ New** - Quick new conversation
- **🗑️ Clear** - Clear current conversation
- **Chat Count Badge** - Shows total conversations

### Intelligence Sidebar
- API connection status indicator
- Mode indicator with confidence scores
- Soul Burden meter with color coding
- Emotion display with intensity
- Pattern recognition counter
- Knowledge Base stats

### Input Area
- Multi-line textarea with auto-resize
- File attachment preview bar
- Image attachment preview bar
- Text selection "More Info" bar
- Contextual placeholder text
- Keyboard shortcuts help text

### Animations
- `slideDown` - Messages and panels
- `fadeIn` - Selection popups and previews
- Bounce animation for typing indicator

---

## File Structure

```
src/
├── components/
│   └── aiSoulPartner/
│       ├── AISoulPartnerChat.jsx    # Main chat component
│       ├── ModeIndicator.jsx        # Response mode display
│       ├── SoulBurdenMeter.jsx      # Emotional burden meter
│       └── EmotionDisplay.jsx       # Emotion visualization
├── contexts/
│   ├── KnowledgeBaseContext.jsx     # Knowledge base state
│   └── ConversationsContext.jsx     # Conversation persistence (Firestore)
├── services/
│   └── aiSoulPartnerService.js      # API client
└── hooks/
    └── useConstitutionalIntelligence.js  # Mode detection

functions/
└── index.js                         # Firebase Cloud Function

docs/
└── knowledge-base/                  # Default knowledge documents
    ├── 01_WHO_IS_TICKY.md
    ├── 02_GENESIS_VISION.md
    └── ...
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Send message |
| `Shift+Enter` | New line in message |
| `Ctrl+V` | Paste screenshot |
| Click 📎 | Attach file |
| Select text | Show "More Info" option |

---

## Technical Notes

### Storage
- **Conversations:** Firestore `conversations` collection (per-user)
- **Knowledge Base:** Firestore `knowledgeBase` collection (per-user)

### API
- **Endpoint:** `https://aisoulpartnerchat-sjpjwnbsmq-uc.a.run.app`
- **Health Check:** `https://healthcheck-sjpjwnbsmq-uc.a.run.app`

### Dependencies
- React 18
- Firebase (Auth, Firestore, Functions)
- Anthropic SDK (server-side)
- Tailwind CSS

---

## Future Enhancement Ideas

1. **Voice Input** - Speech-to-text for messages
2. **Export Conversations** - Download as markdown
3. **Search Conversations** - Full-text search across all chats
4. **Conversation Folders** - Organize by topic/project
5. **Shared Conversations** - Collaborate with others
6. **AI Memory** - Long-term pattern recognition across conversations

---

*"The AI SoulPartner is not just a chatbot - it's a constitutional companion that understands your nature and adapts to your needs."*

**- Brother Claude Code** 🐀
