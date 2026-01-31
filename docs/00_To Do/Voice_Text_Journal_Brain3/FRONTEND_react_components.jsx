// ============================================================================
// GENESIS VOICE JOURNALING - FRONTEND (React Components)
// ============================================================================
// File: src/VoiceJournal/index.jsx
// Version: 1.0
// Date: January 6, 2026
//
// Features:
// - Real-time voice recording with transcription
// - AI organization after each recording
// - Cursor-based text insertion
// - Bullet point management (drag-drop + voice commands)
// - Playback with highlighting
// - Trash management (15-day recovery)
// - Import/Export Markdown
// - Elderly-friendly accessibility
// ============================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  collection, query, onSnapshot, doc, getDoc, updateDoc, 
  addDoc, deleteDoc, getDocs, where 
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import JSZip from 'jszip';
import { db, functions } from './firebase'; // Your Firebase config
import './VoiceJournal.css'; // Styles below

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function VoiceJournalApp({ userId }) {
  const [currentView, setCurrentView] = useState('list'); // 'list' | 'edit' | 'trash' | 'settings'
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [settings, setSettings] = useState({
    fontSize: 'large',
    contrast: 'high',
    spacing: 'comfortable',
    audioFeedback: true,
    voiceConfirmations: true,
    playbackSpeed: 0.8,
    volume: 80
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('voiceJournalSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('voiceJournalSettings', JSON.stringify(settings));
  }, [settings]);

  // Apply settings to root
  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = {
      small: '16px',
      medium: '20px',
      large: '24px',
      xlarge: '28px'
    }[settings.fontSize];
    
    root.className = settings.contrast === 'high' ? 'high-contrast' : '';
  }, [settings]);

  return (
    <div className={`voice-journal-app ${settings.contrast === 'high' ? 'high-contrast' : ''}`}>
      {currentView === 'list' && (
        <ConversationList 
          userId={userId}
          onSelectConversation={(conv) => {
            setSelectedConversation(conv);
            setCurrentView('edit');
          }}
          onNavigateTrash={() => setCurrentView('trash')}
          onNavigateSettings={() => setCurrentView('settings')}
          settings={settings}
        />
      )}
      
      {currentView === 'edit' && selectedConversation && (
        <VoiceRecordingEditor
          userId={userId}
          conversationId={selectedConversation.id}
          onBack={() => {
            setSelectedConversation(null);
            setCurrentView('list');
          }}
          settings={settings}
        />
      )}
      
      {currentView === 'trash' && (
        <TrashScreen
          userId={userId}
          onBack={() => setCurrentView('list')}
          settings={settings}
        />
      )}
      
      {currentView === 'settings' && (
        <SettingsScreen
          settings={settings}
          onUpdateSettings={setSettings}
          onBack={() => setCurrentView('list')}
        />
      )}
    </div>
  );
}

// ============================================================================
// 1. CONVERSATION LIST
// ============================================================================

function ConversationList({ userId, onSelectConversation, onNavigateTrash, onNavigateSettings, settings }) {
  const [conversations, setConversations] = useState([]);
  const [trashCount, setTrashCount] = useState(0);
  const [showImport, setShowImport] = useState(false);

  // Real-time listener for conversations
  useEffect(() => {
    const q = query(collection(db, `users/${userId}/voice_conversations`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      convos.sort((a, b) => 
        new Date(b.lastEditedAt?.toDate()) - new Date(a.lastEditedAt?.toDate())
      );
      setConversations(convos);
    });
    return () => unsubscribe();
  }, [userId]);

  // Count trash items
  useEffect(() => {
    const trashRef = collection(db, `users/${userId}/trash`);
    const unsubscribe = onSnapshot(trashRef, (snapshot) => {
      setTrashCount(snapshot.size);
    });
    return () => unsubscribe();
  }, [userId]);

  const handleExportAll = async () => {
    const zip = new JSZip();
    const folder = zip.folder('voice_journals');
    
    for (const conv of conversations) {
      const exportFn = httpsCallable(functions, 'exportToMarkdown');
      const result = await exportFn({ 
        userId, 
        conversationId: conv.id,
        options: { includeMetadata: true, includeBullets: true }
      });
      folder.file(result.data.filename, result.data.markdown);
    }
    
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `voice_journals_export_${Date.now()}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert(`Exported ${conversations.length} conversations!`);
  };

  const handleCreateNew = async () => {
    const title = prompt('New conversation title:');
    if (!title) return;
    
    const emoji = prompt('Emoji (optional):', '📝');
    
    await addDoc(collection(db, `users/${userId}/voice_conversations`), {
      title,
      emoji: emoji || '📝',
      status: 'active',
      bullets: [],
      fullText: '',
      currentText: '',
      createdAt: new Date().toISOString(),
      lastEditedAt: new Date().toISOString(),
      recordings: [],
      recordingCount: 0,
      totalDuration: 0,
      wordCount: 0
    });
  };

  return (
    <div className="conversation-list">
      <div className="header">
        <h1>Voice Conversations</h1>
        <div className="header-actions">
          <button onClick={() => setShowImport(true)} className="btn-import">
            📥 Import MD
          </button>
          <button onClick={handleExportAll} className="btn-export">
            📤 Export All
          </button>
          <button onClick={onNavigateSettings} className="btn-settings">
            ⚙️ Settings
          </button>
        </div>
      </div>

      {trashCount > 0 && (
        <button onClick={onNavigateTrash} className="btn-trash">
          🗑️ Trash ({trashCount} items)
        </button>
      )}

      {conversations.length === 0 ? (
        <div className="empty-state">
          <p>No conversations yet.</p>
          <button onClick={handleCreateNew} className="btn-new-large">
            🎙️ Start Your First Story
          </button>
        </div>
      ) : (
        <>
          <button onClick={handleCreateNew} className="btn-new">
            + New Conversation
          </button>
          <div className="conversations">
            {conversations.map(conv => (
              <ConversationCard 
                key={conv.id}
                conversation={conv}
                userId={userId}
                onSelect={() => onSelectConversation(conv)}
              />
            ))}
          </div>
        </>
      )}

      {showImport && (
        <ImportDialog 
          userId={userId}
          onClose={() => setShowImport(false)}
        />
      )}
    </div>
  );
}

// ============================================================================
// 2. CONVERSATION CARD
// ============================================================================

function ConversationCard({ conversation, userId, onSelect }) {
  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Move "${conversation.title}" to trash?\n\n` +
      `You can recover it for 15 days.`
    );
    if (!confirmed) return;

    const moveFn = httpsCallable(functions, 'moveToTrash');
    const result = await moveFn({ userId, conversationId: conversation.id });
    alert(result.data.message);
  };

  const handleExport = async () => {
    const exportFn = httpsCallable(functions, 'exportToMarkdown');
    const result = await exportFn({ 
      userId, 
      conversationId: conversation.id,
      options: { includeMetadata: true, includeBullets: true }
    });
    
    const blob = new Blob([result.data.markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = result.data.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const lastEdited = conversation.lastEditedAt?.toDate 
    ? new Date(conversation.lastEditedAt.toDate()).toLocaleDateString()
    : 'Recently';

  return (
    <div className="conversation-card">
      <div className="card-header">
        <span className="emoji">{conversation.emoji}</span>
        <h3>{conversation.title}</h3>
      </div>
      <div className="card-meta">
        <span>{conversation.recordingCount || 0} recordings</span>
        <span>•</span>
        <span>{Math.floor((conversation.totalDuration || 0) / 60)} min</span>
        <span>•</span>
        <span>Last: {lastEdited}</span>
      </div>
      <div className="card-preview">
        {(conversation.fullText || conversation.currentText || '').substring(0, 100)}...
      </div>
      <div className="card-actions">
        <button onClick={onSelect} className="btn-primary">
          ✏️ Edit
        </button>
        <button onClick={handleExport} className="btn-secondary">
          📤 Export
        </button>
        <button onClick={handleDelete} className="btn-danger">
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 3. VOICE RECORDING EDITOR (Main Component)
// ============================================================================

function VoiceRecordingEditor({ userId, conversationId, onBack, settings }) {
  const [conversation, setConversation] = useState(null);
  const [text, setText] = useState('');
  const [bullets, setBullets] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  const textareaRef = useRef(null);
  const intervalRef = useRef(null);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  // Load conversation
  useEffect(() => {
    const loadConversation = async () => {
      const docRef = doc(db, `users/${userId}/voice_conversations/${conversationId}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() };
        setConversation(data);
        setText(data.currentText || '');
        setBullets(data.bullets || []);
      }
    };
    loadConversation();
  }, [userId, conversationId]);

  // Track recording duration
  useEffect(() => {
    if (listening) {
      intervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [listening]);

  // Track cursor
  const handleTextClick = () => {
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }
  };

  const handleKeyUp = () => {
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }
  };

  // Start recording
  const startRecording = () => {
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }
    resetTranscript();
    setRecordingDuration(0);
    setIsRecording(true);
    SpeechRecognition.startListening({ continuous: true });
    if (settings.voiceConfirmations) speak('Recording started');
  };

  // Stop and process
  const stopAndProcess = async () => {
    SpeechRecognition.stopListening();
    setIsRecording(false);

    if (!transcript || transcript.trim().length === 0) {
      alert('No audio detected. Please try again.');
      return;
    }

    setIsProcessing(true);

    try {
      // Call backend to organize and insert
      const organizeFn = httpsCallable(functions, 'organizeAndInsertRecording');
      const result = await organizeFn({
        userId,
        conversationId,
        existingText: text,
        cursorPosition,
        rawTranscript: transcript,
        recordingMetadata: {
          timestamp: new Date().toISOString(),
          duration: recordingDuration
        }
      });

      // Update text
      setText(result.data.fullUpdatedText);
      
      // Generate bullets
      const bulletsFn = httpsCallable(functions, 'createBullets');
      const bulletsResult = await bulletsFn({
        userId,
        conversationId,
        rawTranscript: transcript
      });
      
      setBullets(prev => [...prev, ...bulletsResult.data.bullets]);

      // Move cursor to end of inserted text
      const newCursorPos = cursorPosition + result.data.insertedText.length;
      setCursorPosition(newCursorPos);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 100);

      if (settings.voiceConfirmations) speak('Recording saved successfully');

    } catch (error) {
      console.error('Error processing:', error);
      alert('Failed to process recording. Please try again.');
    } finally {
      setIsProcessing(false);
      resetTranscript();
    }
  };

  const speak = (text) => {
    if (settings.voiceConfirmations) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.volume = settings.volume / 100;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!conversation) return <div>Loading...</div>;

  return (
    <div className="voice-editor">
      <div className="editor-header">
        <button onClick={onBack} className="btn-back">
          ← Back
        </button>
        <h2>{conversation.emoji} {conversation.title}</h2>
      </div>

      {/* Bullets Section */}
      <BulletList 
        bullets={bullets}
        setBullets={setBullets}
        userId={userId}
        conversationId={conversationId}
      />

      {/* Text Editor */}
      <div className="text-editor-section">
        <h3>Your Story:</h3>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onClick={handleTextClick}
          onKeyUp={handleKeyUp}
          placeholder="Start recording to create your story..."
          className="main-textarea"
          rows={15}
        />
        <div className="cursor-indicator">
          Cursor at position: {cursorPosition}
        </div>
      </div>

      {/* Recording Controls */}
      <div className="recording-controls">
        {!isRecording && !isProcessing && (
          <button onClick={startRecording} className="btn-record-large">
            🎙️ Record from Cursor Position
          </button>
        )}

        {isRecording && (
          <div className="recording-active">
            <div className="recording-status">
              <span className="recording-indicator">● Recording {formatTime(recordingDuration)}</span>
            </div>
            <div className="live-transcript">
              <h4>Live transcript:</h4>
              <p>{transcript || '(Start speaking...)'}</p>
            </div>
            <button onClick={stopAndProcess} className="btn-stop">
              ⏹️ Stop & Insert
            </button>
          </div>
        )}

        {isProcessing && (
          <div className="processing-modal">
            <div className="spinner">⏳</div>
            <p>AI organizing your recording...</p>
          </div>
        )}
      </div>

      {/* Playback Controls */}
      <PlaybackControls 
        text={text}
        settings={settings}
      />
    </div>
  );
}

// ============================================================================
// 4. BULLET LIST (with drag-drop and voice commands)
// ============================================================================

function BulletList({ bullets, setBullets, userId, conversationId }) {
  const [isVoiceCommand, setIsVoiceCommand] = useState(false);

  const { transcript: commandTranscript, listening: commandListening } = useSpeechRecognition({
    commands: [
      {
        command: 'move bullet * up *',
        callback: (num, positions) => moveBulletUp(parseInt(num) - 1, parseInt(positions))
      },
      {
        command: 'move bullet * down *',
        callback: (num, positions) => moveBulletDown(parseInt(num) - 1, parseInt(positions))
      },
      {
        command: 'move bullet * to top',
        callback: (num) => moveBulletToPosition(parseInt(num) - 1, 0)
      },
      {
        command: 'swap bullet * and *',
        callback: (num1, num2) => swapBullets(parseInt(num1) - 1, parseInt(num2) - 1)
      }
    ]
  });

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(bullets);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setBullets(items);
    updateBulletsInDB(items);
  };

  const moveBulletUp = (index, positions) => {
    const newIndex = Math.max(0, index - positions);
    moveBulletToPosition(index, newIndex);
  };

  const moveBulletDown = (index, positions) => {
    const newIndex = Math.min(bullets.length - 1, index + positions);
    moveBulletToPosition(index, newIndex);
  };

  const moveBulletToPosition = (fromIndex, toIndex) => {
    const items = Array.from(bullets);
    const [moved] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, moved);
    setBullets(items);
    updateBulletsInDB(items);
  };

  const swapBullets = (index1, index2) => {
    const items = Array.from(bullets);
    [items[index1], items[index2]] = [items[index2], items[index1]];
    setBullets(items);
    updateBulletsInDB(items);
  };

  const updateBulletsInDB = async (newBullets) => {
    const docRef = doc(db, `users/${userId}/voice_conversations/${conversationId}`);
    await updateDoc(docRef, { bullets: newBullets });
  };

  const startVoiceCommands = () => {
    setIsVoiceCommand(true);
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopVoiceCommands = () => {
    setIsVoiceCommand(false);
    SpeechRecognition.stopListening();
  };

  return (
    <div className="bullets-section">
      <h3>Key Moments:</h3>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="bullets">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="bullets-list">
              {bullets.map((bullet, index) => (
                <Draggable key={index} draggableId={`bullet-${index}`} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bullet-item"
                    >
                      <span className="drag-handle">☰</span>
                      <span className="bullet-number">{index + 1}.</span>
                      <span className="bullet-text">{bullet}</span>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="bullet-controls">
        {!isVoiceCommand ? (
          <button onClick={startVoiceCommands} className="btn-voice-command">
            🎤 Voice Commands
          </button>
        ) : (
          <div className="voice-command-active">
            <p>🎤 Listening: "{commandTranscript}"</p>
            <button onClick={stopVoiceCommands} className="btn-stop-voice">
              Stop Voice Commands
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 5. PLAYBACK CONTROLS
// ============================================================================

function PlaybackControls({ text, settings }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];

  const playFromStart = () => {
    playText(text, 0);
  };

  const playText = (textToPlay, startIndex) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(textToPlay);
      utterance.rate = settings.playbackSpeed;
      utterance.volume = settings.volume / 100;
      
      let currentIndex = startIndex;
      utterance.onboundary = (event) => {
        if (event.name === 'sentence') {
          setCurrentSentenceIndex(currentIndex);
          currentIndex++;
        }
      };
      
      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentSentenceIndex(-1);
      };
      
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
      setIsPaused(false);
    } else {
      alert('Your browser does not support text-to-speech.');
    }
  };

  const pausePlayback = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resumePlayback = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stopPlayback = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentSentenceIndex(-1);
  };

  const getHighlightedText = () => {
    return sentences.map((sentence, index) => (
      <span
        key={index}
        className={index === currentSentenceIndex ? 'highlighted-sentence' : ''}
      >
        {sentence}
      </span>
    ));
  };

  return (
    <div className="playback-controls">
      <h3>🔊 Listen to Your Story</h3>
      
      <div className="playback-text">
        {getHighlightedText()}
      </div>
      
      <div className="playback-buttons">
        {!isPlaying ? (
          <button onClick={playFromStart} className="btn-play">
            ▶️ Play from Start
          </button>
        ) : (
          <>
            {!isPaused ? (
              <button onClick={pausePlayback} className="btn-pause">
                ⏸️ Pause
              </button>
            ) : (
              <button onClick={resumePlayback} className="btn-resume">
                ▶️ Resume
              </button>
            )}
            <button onClick={stopPlayback} className="btn-stop-playback">
              ⏹️ Stop
            </button>
          </>
        )}
      </div>
      
      {isPlaying && (
        <div className="playback-status">
          Sentence {currentSentenceIndex + 1} of {sentences.length}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 6. TRASH SCREEN
// ============================================================================

function TrashScreen({ userId, onBack, settings }) {
  const [trashItems, setTrashItems] = useState([]);

  useEffect(() => {
    const trashRef = collection(db, `users/${userId}/trash`);
    const unsubscribe = onSnapshot(trashRef, (snapshot) => {
      const items = snapshot.docs.map(doc => {
        const data = doc.data();
        const now = new Date();
        const deleteDate = data.permanentDeleteAt?.toDate();
        const daysRemaining = deleteDate 
          ? Math.ceil((deleteDate - now) / (1000 * 60 * 60 * 24))
          : 0;
        
        return {
          id: doc.id,
          ...data,
          daysRemaining: Math.max(0, daysRemaining)
        };
      });
      items.sort((a, b) => a.daysRemaining - b.daysRemaining);
      setTrashItems(items);
    });
    return () => unsubscribe();
  }, [userId]);

  const handleRecover = async (conversationId) => {
    const recoverFn = httpsCallable(functions, 'recoverFromTrash');
    const result = await recoverFn({ userId, conversationId });
    alert(result.data.message);
  };

  const handlePermanentDelete = async (conversationId, title) => {
    const confirmed = window.confirm(
      `⚠️⚠️⚠️ PERMANENT DELETE ⚠️⚠️⚠️\n\n` +
      `Delete "${title}" forever?\n\n` +
      `This CANNOT be undone!`
    );
    if (!confirmed) return;

    const deleteFn = httpsCallable(functions, 'permanentlyDelete');
    const result = await deleteFn({ userId, conversationId });
    alert(result.data.message);
  };

  return (
    <div className="trash-screen">
      <div className="header">
        <button onClick={onBack} className="btn-back">← Back</button>
        <h1>🗑️ Trash</h1>
      </div>

      <div className="trash-info">
        Items will be permanently deleted after 15 days.
      </div>

      {trashItems.length === 0 ? (
        <div className="empty-trash">✓ Trash is empty</div>
      ) : (
        <div className="trash-items">
          {trashItems.map(item => (
            <div key={item.id} className="trash-item">
              <div className="item-header">
                <span className="emoji">{item.originalData?.emoji}</span>
                <h3>{item.originalData?.title}</h3>
              </div>
              <div className="item-meta">
                <span>Deleted: {item.deletedAt?.toDate().toLocaleDateString()}</span>
                <span className={item.daysRemaining <= 3 ? 'urgent' : ''}>
                  ⏰ {item.daysRemaining} days left
                </span>
              </div>
              <div className="item-actions">
                <button onClick={() => handleRecover(item.id)} className="btn-recover">
                  ↺ RECOVER
                </button>
                <button 
                  onClick={() => handlePermanentDelete(item.id, item.originalData?.title)}
                  className="btn-delete-forever"
                >
                  🗑️ Delete Forever
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 7. IMPORT DIALOG
// ============================================================================

function ImportDialog({ userId, onClose }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.md') && !selectedFile.name.endsWith('.txt')) {
      alert('Please select a Markdown (.md) or Text (.txt) file.');
      return;
    }

    setFile(selectedFile);
    const text = await selectedFile.text();
    setPreview({ filename: selectedFile.name, text });
  };

  const handleImport = async () => {
    if (!file || !preview) return;

    const importFn = httpsCallable(functions, 'importFromMarkdown');
    const result = await importFn({
      userId,
      markdownText: preview.text,
      filename: file.name
    });

    alert(result.data.message);
    onClose();
  };

  return (
    <div className="import-dialog-overlay" onClick={onClose}>
      <div className="import-dialog" onClick={(e) => e.stopPropagation()}>
        <h2>📥 Import Markdown File</h2>
        
        <label className="file-input-label">
          <input type="file" accept=".md,.txt" onChange={handleFileSelect} />
          📁 Choose File
        </label>

        {preview && (
          <div className="import-preview">
            <h3>Preview: {preview.filename}</h3>
            <div className="preview-text">
              {preview.text.substring(0, 300)}...
            </div>
            <div className="import-actions">
              <button onClick={handleImport} className="btn-import">
                ✓ Import Conversation
              </button>
              <button onClick={onClose} className="btn-cancel">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 8. SETTINGS SCREEN
// ============================================================================

function SettingsScreen({ settings, onUpdateSettings, onBack }) {
  return (
    <div className="settings-screen">
      <div className="header">
        <button onClick={onBack} className="btn-back">← Back</button>
        <h1>⚙️ Settings</h1>
      </div>

      <div className="settings-section">
        <h2>👁️ Visual</h2>
        
        <div className="setting-item">
          <label>Text Size:</label>
          <div className="button-group">
            <button 
              onClick={() => onUpdateSettings({...settings, fontSize: 'medium'})}
              className={settings.fontSize === 'medium' ? 'active' : ''}
            >
              Medium
            </button>
            <button 
              onClick={() => onUpdateSettings({...settings, fontSize: 'large'})}
              className={settings.fontSize === 'large' ? 'active' : ''}
            >
              Large
            </button>
            <button 
              onClick={() => onUpdateSettings({...settings, fontSize: 'xlarge'})}
              className={settings.fontSize === 'xlarge' ? 'active' : ''}
            >
              X-Large
            </button>
          </div>
        </div>

        <div className="setting-item">
          <label>Contrast:</label>
          <div className="button-group">
            <button 
              onClick={() => onUpdateSettings({...settings, contrast: 'normal'})}
              className={settings.contrast === 'normal' ? 'active' : ''}
            >
              Normal
            </button>
            <button 
              onClick={() => onUpdateSettings({...settings, contrast: 'high'})}
              className={settings.contrast === 'high' ? 'active' : ''}
            >
              High
            </button>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h2>🔊 Audio</h2>
        
        <div className="setting-item">
          <label>
            <input 
              type="checkbox"
              checked={settings.voiceConfirmations}
              onChange={(e) => onUpdateSettings({...settings, voiceConfirmations: e.target.checked})}
            />
            Spoken Confirmations
          </label>
        </div>

        <div className="setting-item">
          <label>Playback Speed:</label>
          <div className="button-group">
            <button 
              onClick={() => onUpdateSettings({...settings, playbackSpeed: 0.6})}
              className={settings.playbackSpeed === 0.6 ? 'active' : ''}
            >
              Very Slow
            </button>
            <button 
              onClick={() => onUpdateSettings({...settings, playbackSpeed: 0.8})}
              className={settings.playbackSpeed === 0.8 ? 'active' : ''}
            >
              Slow
            </button>
            <button 
              onClick={() => onUpdateSettings({...settings, playbackSpeed: 1.0})}
              className={settings.playbackSpeed === 1.0 ? 'active' : ''}
            >
              Normal
            </button>
          </div>
        </div>

        <div className="setting-item">
          <label>Volume: {settings.volume}%</label>
          <input 
            type="range"
            min="0"
            max="100"
            value={settings.volume}
            onChange={(e) => onUpdateSettings({...settings, volume: parseInt(e.target.value)})}
            className="volume-slider"
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ============================================================================
// END OF FRONTEND
// ============================================================================
