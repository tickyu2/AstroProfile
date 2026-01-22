// ============================================================================
// GENESIS BIOGRAPHY JOURNAL - TEXT-BASED JOURNALING
// ============================================================================
// File: src/pages/BiographyJournalPage.jsx
// Version: 3.5
// Date: January 7, 2026
//
// Features:
// - Text-based journaling with STT/TTS support
// - Profile-linked stories (stories tied to profiles)
// - AI-powered organization and bullet extraction
// - Drag-drop bullet reordering
// - Markdown import/export
// - Trash with 15-day recovery
// - Elderly-friendly accessibility
// - SEARCH: Full-text search across stories, titles, content, bullets, tags
// - AUTO-TAGGING: AI + client-side tag extraction (people, places, emotions, themes)
// - TAG FILTERING: Filter stories by category (people, places, emotions, themes)
// - CLICKABLE TAGS (Story Cards): Click tag on card to filter stories list (v3.1)
// - IN-DOCUMENT FIND: Click tag in editor to find all occurrences in story (v3.2)
//   - Shows match count and navigation (prev/next)
//   - Displays matches with context, click to jump
//   - Secondary "Search ALL stories" button available
// - TEXT SELECTION TO TAG: Highlight text → tooltip popup → add as tag (v3.3)
//   - Select any word/phrase in textarea
//   - Tooltip appears with category options
//   - One-click to add as tag for expanded search
// - BRAIN TICKLERS v2: Hierarchical guided question prompts (v3.5)
//   - 10 categories with 30+ subcategories
//   - 100+ questions across all topics
//   - Hierarchical accordion: Category → Subcategory → Questions
//   - Click question → creates new story with question as first line
//   - Random inspiration feature
//   - Firestore-backed for admin management
//   - Admin interface in Systems page
// ============================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProfiles } from '../contexts/ProfileContext';
import {
  collection, query, onSnapshot, doc, getDoc, updateDoc,
  addDoc, deleteDoc, serverTimestamp, orderBy, where
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../config/firebase';
import { brainTicklerService, DEFAULT_BRAIN_TICKLERS } from '../services/brainTicklerService';
import './BiographyJournalPage.css';

// Brain Tickler questions are now loaded from brainTicklerService
// See: src/services/brainTicklerService.js for the full hierarchical question library

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function BiographyJournalPage() {
  const { currentUser } = useAuth();
  const { profiles } = useProfiles();
  const [currentView, setCurrentView] = useState('list'); // 'list' | 'edit' | 'trash' | 'settings'
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [initialSearchQuery, setInitialSearchQuery] = useState(''); // For tag-click search
  const [settings, setSettings] = useState({
    fontSize: 'large',
    contrast: 'normal',
    autoSave: true,
    showWordCount: true
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('biographyJournalSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('biographyJournalSettings', JSON.stringify(settings));
  }, [settings]);

  // Auto-select first profile if none selected
  useEffect(() => {
    if (!selectedProfileId && profiles && profiles.length > 0) {
      setSelectedProfileId(profiles[0].id);
    }
  }, [profiles, selectedProfileId]);

  if (!currentUser) {
    return (
      <div className="bio-journal-app">
        <div className="empty-state">
          <h2>Please sign in to access your Biography Journal</h2>
        </div>
      </div>
    );
  }

  // Get selected profile for display
  const selectedProfile = profiles?.find(p => p.id === selectedProfileId);

  return (
    <div className={`bio-journal-app ${settings.contrast === 'high' ? 'high-contrast' : ''} font-${settings.fontSize}`}>
      {/* Profile Selector - Always visible */}
      {profiles && profiles.length > 0 && (
        <div className="profile-selector-bar">
          <label htmlFor="profile-select">Writing for:</label>
          <select
            id="profile-select"
            value={selectedProfileId || ''}
            onChange={(e) => setSelectedProfileId(e.target.value)}
            className="profile-select"
          >
            {profiles.map(profile => (
              <option key={profile.id} value={profile.id}>
                {profile.firstName} {profile.lastName}
              </option>
            ))}
          </select>
          {selectedProfile && (
            <span className="profile-info">
              ({selectedProfile.birthDate ? new Date(selectedProfile.birthDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No DOB'})
            </span>
          )}
        </div>
      )}

      {currentView === 'list' && (
        <StoryList
          userId={currentUser.uid}
          profileId={selectedProfileId}
          profileName={selectedProfile ? `${selectedProfile.firstName} ${selectedProfile.lastName}` : ''}
          onSelectStory={(story) => {
            setSelectedStory(story);
            setCurrentView('edit');
          }}
          onNavigateTrash={() => setCurrentView('trash')}
          onNavigateSettings={() => setCurrentView('settings')}
          settings={settings}
          initialSearchQuery={initialSearchQuery}
          onClearInitialSearch={() => setInitialSearchQuery('')}
        />
      )}

      {currentView === 'edit' && selectedStory && (
        <StoryEditor
          userId={currentUser.uid}
          profileId={selectedProfileId}
          storyId={selectedStory.id}
          onBack={() => {
            setSelectedStory(null);
            setCurrentView('list');
          }}
          onSearchTag={(tagText) => {
            // Set the search query and navigate to list view
            setInitialSearchQuery(tagText);
            setSelectedStory(null);
            setCurrentView('list');
          }}
          settings={settings}
        />
      )}

      {currentView === 'trash' && (
        <TrashScreen
          userId={currentUser.uid}
          profileId={selectedProfileId}
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
// 1. STORY LIST
// ============================================================================

function StoryList({ userId, profileId, profileName, onSelectStory, onNavigateTrash, onNavigateSettings, settings, initialSearchQuery, onClearInitialSearch }) {
  const [stories, setStories] = useState([]);
  const [trashCount, setTrashCount] = useState(0);
  const [showImport, setShowImport] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newEmoji, setNewEmoji] = useState('');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('all'); // 'all', 'people', 'places', 'emotions', 'themes'
  const [showSearchFilters, setShowSearchFilters] = useState(false);

  // Brain Ticklers state (hierarchical)
  const [showBrainTicklers, setShowBrainTicklers] = useState(true);
  const [brainTicklerCategories, setBrainTicklerCategories] = useState(DEFAULT_BRAIN_TICKLERS);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState(null);
  const [randomInspiration, setRandomInspiration] = useState([]);
  const [showRandomInspiration, setShowRandomInspiration] = useState(false);
  const [ticklerStats, setTicklerStats] = useState({ categories: 0, subcategories: 0, questions: 0 });

  // Load brain tickler categories on mount
  useEffect(() => {
    const loadBrainTicklers = async () => {
      try {
        const categories = await brainTicklerService.getAllCategories();
        setBrainTicklerCategories(categories);
        const stats = await brainTicklerService.getStats();
        setTicklerStats(stats);
      } catch (error) {
        console.error('Error loading brain ticklers:', error);
        // Keep defaults on error
      }
    };
    loadBrainTicklers();
  }, []);

  // Get random inspiration questions
  const handleGetInspiration = async () => {
    try {
      const randomQuestions = await brainTicklerService.getRandomQuestions(5);
      setRandomInspiration(randomQuestions);
      setShowRandomInspiration(true);
    } catch (error) {
      console.error('Error getting inspiration:', error);
    }
  };

  // Handle initial search query from tag click (in editor)
  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
      setShowSearchFilters(true); // Show filters so user can refine
      onClearInitialSearch?.(); // Clear so it doesn't re-trigger
    }
  }, [initialSearchQuery, onClearInitialSearch]);

  // Real-time listener for stories (filtered by profileId if available)
  useEffect(() => {
    if (!userId) return;

    const storiesRef = collection(db, `users/${userId}/biography_stories`);
    // Get all stories for this user, filter by profile on client side for flexibility
    const q = query(storiesRef, orderBy('lastEditedAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const storiesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filter by profileId if selected (show stories for selected profile)
      // Also show stories without profileId (legacy stories)
      const profileFilteredStories = profileId
        ? storiesData.filter(s => s.profileId === profileId || !s.profileId)
        : storiesData;

      setStories(profileFilteredStories);
    }, (error) => {
      console.error('Error loading stories:', error);
    });

    return () => unsubscribe();
  }, [userId, profileId]);

  // Count trash items
  useEffect(() => {
    if (!userId) return;

    const trashRef = collection(db, `users/${userId}/biography_trash`);
    const unsubscribe = onSnapshot(trashRef, (snapshot) => {
      setTrashCount(snapshot.size);
    }, (error) => {
      console.error('Error loading trash count:', error);
    });

    return () => unsubscribe();
  }, [userId]);

  // Search/filter stories
  const filteredStories = React.useMemo(() => {
    if (!searchQuery.trim()) return stories;

    const query = searchQuery.toLowerCase().trim();

    return stories.filter(story => {
      // Always search title
      if (story.title?.toLowerCase().includes(query)) return true;

      // Search content
      if (story.content?.toLowerCase().includes(query)) return true;

      // Search bullets
      if (story.bullets?.some(b => b.toLowerCase().includes(query))) return true;

      // Search tags by category
      const tags = story.tags || {};

      if (searchCategory === 'all' || searchCategory === 'people') {
        if (tags.people?.some(p => p.toLowerCase().includes(query))) return true;
      }
      if (searchCategory === 'all' || searchCategory === 'places') {
        if (tags.places?.some(p => p.toLowerCase().includes(query))) return true;
      }
      if (searchCategory === 'all' || searchCategory === 'emotions') {
        if (tags.emotions?.some(e => e.toLowerCase().includes(query))) return true;
      }
      if (searchCategory === 'all' || searchCategory === 'themes') {
        if (tags.themes?.some(t => t.toLowerCase().includes(query))) return true;
      }

      return false;
    });
  }, [stories, searchQuery, searchCategory]);

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchCategory('all');
    setShowSearchFilters(false);
  };

  const handleExportAll = async () => {
    if (stories.length === 0) {
      alert('No stories to export.');
      return;
    }

    let allMarkdown = '# My Biography Stories\n\n';
    allMarkdown += `Exported: ${new Date().toLocaleDateString()}\n\n---\n\n`;

    for (const story of stories) {
      allMarkdown += `# ${story.emoji || ''} ${story.title}\n\n`;
      if (story.bullets && story.bullets.length > 0) {
        allMarkdown += `## Key Moments\n\n`;
        story.bullets.forEach(b => allMarkdown += `- ${b}\n`);
        allMarkdown += '\n';
      }
      allMarkdown += `## Story\n\n${story.content || ''}\n\n---\n\n`;
    }

    const blob = new Blob([allMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `biography_stories_${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`Exported ${stories.length} stories!`);
  };

  const handleCreateNew = async () => {
    if (!newTitle.trim()) {
      alert('Please enter a title for your story.');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, `users/${userId}/biography_stories`), {
        title: newTitle.trim(),
        emoji: newEmoji || '📖',
        content: '',
        bullets: [],
        wordCount: 0,
        profileId: profileId || null,
        profileName: profileName || null,
        createdAt: serverTimestamp(),
        lastEditedAt: serverTimestamp()
      });

      setIsCreating(false);
      setNewTitle('');
      setNewEmoji('');

      // Auto-open the new story
      onSelectStory({ id: docRef.id, title: newTitle.trim() });
    } catch (error) {
      console.error('Error creating story:', error);
      alert('Failed to create story. Please try again.');
    }
  };

  // Create story from Brain Tickler question (hierarchical version)
  const handleBrainTicklerClick = async (questionText, categoryTitle, subcategoryTitle, categoryIcon) => {
    try {
      // Create a title from the question (truncate if too long)
      const title = questionText.length > 50
        ? questionText.substring(0, 47) + '...'
        : questionText;

      // Create the story with the question as the first line
      const docRef = await addDoc(collection(db, `users/${userId}/biography_stories`), {
        title: title,
        emoji: categoryIcon || '💭',
        content: `${questionText}\n\n`, // Question as first line with space to write
        bullets: [],
        wordCount: questionText.split(/\s+/).filter(Boolean).length,
        profileId: profileId || null,
        profileName: profileName || null,
        promptCategory: categoryTitle,
        promptSubcategory: subcategoryTitle,
        createdAt: serverTimestamp(),
        lastEditedAt: serverTimestamp()
      });

      // Auto-open the new story
      onSelectStory({ id: docRef.id, title: title });
    } catch (error) {
      console.error('Error creating story from Brain Tickler:', error);
      alert('Failed to create story. Please try again.');
    }
  };

  // Toggle category expansion
  const toggleCategory = (categoryId) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
      setExpandedSubcategory(null);
    } else {
      setExpandedCategory(categoryId);
      setExpandedSubcategory(null);
    }
  };

  // Toggle subcategory expansion
  const toggleSubcategory = (subcategoryId) => {
    setExpandedSubcategory(expandedSubcategory === subcategoryId ? null : subcategoryId);
  };

  const handleImportMarkdown = async (markdownText, filename) => {
    try {
      // Parse markdown
      const lines = markdownText.split('\n');
      let title = filename.replace(/\.md$|\.txt$/i, '');
      let emoji = '📄';
      let bullets = [];
      let content = '';
      let inBulletSection = false;
      let inStorySection = false;

      for (const line of lines) {
        const trimmed = line.trim();

        // Extract title
        if (trimmed.startsWith('# ') && !title) {
          const titleLine = trimmed.substring(2).trim();
          const emojiMatch = titleLine.match(/[\u{1F300}-\u{1F9FF}]/u);
          if (emojiMatch) {
            emoji = emojiMatch[0];
            title = titleLine.replace(emoji, '').trim();
          } else {
            title = titleLine;
          }
          continue;
        }

        // Detect sections
        if (trimmed.includes('## Key Moments') || trimmed.includes('## Bullet')) {
          inBulletSection = true;
          inStorySection = false;
          continue;
        }

        if (trimmed.includes('## Story') || trimmed.includes('## Full')) {
          inBulletSection = false;
          inStorySection = true;
          continue;
        }

        // Extract bullets
        if (inBulletSection && (trimmed.startsWith('- ') || trimmed.startsWith('* '))) {
          bullets.push(trimmed.substring(2).trim());
          continue;
        }

        // Extract story content
        if (inStorySection && trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('---')) {
          content += line + '\n';
        }
      }

      // If no story section found, use all non-bullet text as content
      if (!content.trim()) {
        content = markdownText;
      }

      await addDoc(collection(db, `users/${userId}/biography_stories`), {
        title: title || 'Imported Story',
        emoji: emoji,
        content: content.trim(),
        bullets: bullets,
        wordCount: content.trim().split(/\s+/).filter(Boolean).length,
        createdAt: serverTimestamp(),
        lastEditedAt: serverTimestamp(),
        importedFrom: filename
      });

      setShowImport(false);
      alert(`"${title}" imported successfully!`);
    } catch (error) {
      console.error('Import error:', error);
      alert('Failed to import file. Please try again.');
    }
  };

  return (
    <div className="story-list">
      <div className="header">
        <h1>{profileName ? `${profileName}'s` : 'My'} Biography Stories</h1>
        <div className="header-actions">
          <button onClick={() => setShowImport(true)} className="btn-secondary">
            Import MD
          </button>
          <button onClick={handleExportAll} className="btn-secondary">
            Export All
          </button>
          <button onClick={onNavigateSettings} className="btn-secondary">
            Settings
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search stories, people, places, emotions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button onClick={clearSearch} className="btn-clear-search" title="Clear search">
              ×
            </button>
          )}
          <button
            onClick={() => setShowSearchFilters(!showSearchFilters)}
            className={`btn-filter-toggle ${showSearchFilters ? 'active' : ''}`}
            title="Filter options"
          >
            ⚙️ Filters
          </button>
        </div>

        {showSearchFilters && (
          <div className="search-filters">
            <span className="filter-label">Search in:</span>
            <div className="filter-buttons">
              {[
                { key: 'all', label: 'All', icon: '📚' },
                { key: 'people', label: 'People', icon: '👤' },
                { key: 'places', label: 'Places', icon: '📍' },
                { key: 'emotions', label: 'Emotions', icon: '💭' },
                { key: 'themes', label: 'Life Themes', icon: '🏷️' }
              ].map(filter => (
                <button
                  key={filter.key}
                  onClick={() => setSearchCategory(filter.key)}
                  className={`btn-filter ${searchCategory === filter.key ? 'active' : ''}`}
                >
                  {filter.icon} {filter.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {searchQuery && (
          <div className="search-results-info">
            Found {filteredStories.length} {filteredStories.length === 1 ? 'story' : 'stories'}
            {searchCategory !== 'all' && ` in ${searchCategory}`}
            {filteredStories.length === 0 && ' - Try different keywords or filters'}
          </div>
        )}
      </div>

      {trashCount > 0 && (
        <button onClick={onNavigateTrash} className="btn-trash">
          Trash ({trashCount} items)
        </button>
      )}

      {isCreating ? (
        <div className="create-form">
          <h3>Create New Story</h3>
          <div className="form-row">
            <input
              type="text"
              placeholder="Story title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="title-input"
              autoFocus
            />
            <input
              type="text"
              placeholder="Emoji"
              value={newEmoji}
              onChange={(e) => setNewEmoji(e.target.value)}
              className="emoji-input"
              maxLength={2}
            />
          </div>
          <div className="form-actions">
            <button onClick={handleCreateNew} className="btn-primary">
              Create Story
            </button>
            <button onClick={() => { setIsCreating(false); setNewTitle(''); setNewEmoji(''); }} className="btn-cancel">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsCreating(true)} className="btn-new">
          + New Story
        </button>
      )}

      {/* Brain Ticklers Section - Hierarchical Accordion */}
      <div className="brain-ticklers-section">
        <div
          className="brain-ticklers-header"
          onClick={() => setShowBrainTicklers(!showBrainTicklers)}
        >
          <span className="brain-ticklers-icon">🧠</span>
          <h2>Brain Ticklers</h2>
          <span className="brain-ticklers-subtitle">
            {ticklerStats.questions}+ questions to inspire your story
          </span>
          <span className={`toggle-arrow ${showBrainTicklers ? 'open' : ''}`}>
            {showBrainTicklers ? '▼' : '▶'}
          </span>
        </div>

        {showBrainTicklers && (
          <div className="brain-ticklers-content">
            {/* Quick Actions Bar */}
            <div className="ticklers-actions-bar">
              <button
                className="btn-inspiration"
                onClick={handleGetInspiration}
              >
                🎲 Get Random Inspiration
              </button>
              <span className="tickler-stats">
                {ticklerStats.categories} categories • {ticklerStats.subcategories} topics • {ticklerStats.questions} questions
              </span>
            </div>

            {/* Random Inspiration Modal */}
            {showRandomInspiration && randomInspiration.length > 0 && (
              <div className="inspiration-modal">
                <div className="inspiration-header">
                  <h3>🎲 Random Inspiration</h3>
                  <button onClick={() => setShowRandomInspiration(false)} className="btn-close-inspiration">×</button>
                </div>
                <div className="inspiration-questions">
                  {randomInspiration.map((q, idx) => (
                    <button
                      key={idx}
                      className="inspiration-question-card"
                      onClick={() => {
                        handleBrainTicklerClick(q.text, q.categoryTitle, q.subcategoryTitle, q.categoryIcon);
                        setShowRandomInspiration(false);
                      }}
                      style={{ '--hover-color': q.categoryColor }}
                    >
                      <span className="inspiration-category-badge" style={{ backgroundColor: q.categoryColor }}>
                        {q.categoryIcon} {q.subcategoryTitle}
                      </span>
                      <span className="inspiration-question-text">{q.text}</span>
                      <span className="question-action">Start Writing →</span>
                    </button>
                  ))}
                </div>
                <button className="btn-more-inspiration" onClick={handleGetInspiration}>
                  🔄 Get More Ideas
                </button>
              </div>
            )}

            {/* Hierarchical Category Accordion */}
            <div className="tickler-accordion">
              {Object.entries(brainTicklerCategories)
                .sort(([, a], [, b]) => (a.order || 0) - (b.order || 0))
                .map(([categoryId, category]) => (
                <div key={categoryId} className="accordion-category">
                  {/* Category Header */}
                  <div
                    className={`accordion-category-header ${expandedCategory === categoryId ? 'expanded' : ''}`}
                    onClick={() => toggleCategory(categoryId)}
                    style={{ '--category-color': category.color }}
                  >
                    <span className="category-icon">{category.icon}</span>
                    <span className="category-title">{category.title}</span>
                    <span className="category-count">
                      {Object.keys(category.subcategories || {}).length} topics
                    </span>
                    <span className="accordion-arrow">{expandedCategory === categoryId ? '▼' : '▶'}</span>
                  </div>

                  {/* Subcategories */}
                  {expandedCategory === categoryId && (
                    <div className="accordion-subcategories">
                      {Object.entries(category.subcategories || {})
                        .sort(([, a], [, b]) => (a.order || 0) - (b.order || 0))
                        .map(([subcatId, subcategory]) => (
                        <div key={subcatId} className="accordion-subcategory">
                          {/* Subcategory Header */}
                          <div
                            className={`accordion-subcategory-header ${expandedSubcategory === subcatId ? 'expanded' : ''}`}
                            onClick={() => toggleSubcategory(subcatId)}
                          >
                            <span className="subcategory-title">{subcategory.title}</span>
                            <span className="subcategory-count">
                              {(subcategory.questions || []).length} questions
                            </span>
                            <span className="accordion-arrow">{expandedSubcategory === subcatId ? '▼' : '▶'}</span>
                          </div>

                          {/* Questions */}
                          {expandedSubcategory === subcatId && (
                            <div className="accordion-questions">
                              {(subcategory.questions || [])
                                .sort((a, b) => (a.order || 0) - (b.order || 0))
                                .map((question, qIdx) => (
                                <button
                                  key={question.id || qIdx}
                                  className="question-card"
                                  onClick={() => handleBrainTicklerClick(
                                    question.text,
                                    category.title,
                                    subcategory.title,
                                    category.icon
                                  )}
                                  style={{ '--hover-color': category.color }}
                                >
                                  <span className="question-text">{question.text}</span>
                                  <span className="question-action">Start Writing →</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {stories.length === 0 && !isCreating ? (
        <div className="empty-state">
          <p>No stories yet. Start writing your biography!</p>
          <button onClick={() => setIsCreating(true)} className="btn-primary btn-large">
            Write Your First Story
          </button>
        </div>
      ) : filteredStories.length === 0 && searchQuery ? (
        <div className="empty-state">
          <p>No stories match "{searchQuery}"</p>
          <button onClick={clearSearch} className="btn-secondary">
            Clear Search
          </button>
        </div>
      ) : (
        <div className="stories-grid">
          {filteredStories.map(story => (
            <StoryCard
              key={story.id}
              story={story}
              userId={userId}
              onSelect={() => onSelectStory(story)}
              searchQuery={searchQuery}
              onTagClick={(tagText) => setSearchQuery(tagText)}
            />
          ))}
        </div>
      )}

      {showImport && (
        <ImportDialog
          onImport={handleImportMarkdown}
          onClose={() => setShowImport(false)}
        />
      )}
    </div>
  );
}

// ============================================================================
// 2. STORY CARD
// ============================================================================

function StoryCard({ story, userId, onSelect, searchQuery, onTagClick }) {
  // Highlight matching text helper
  const highlightMatch = (text, query) => {
    if (!query || !text) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ?
        <mark key={i} className="search-highlight">{part}</mark> : part
    );
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Move "${story.title}" to trash?\n\nYou can recover it for 15 days.`
    );
    if (!confirmed) return;

    try {
      // Get the story data
      const storyRef = doc(db, `users/${userId}/biography_stories/${story.id}`);
      const storySnap = await getDoc(storyRef);

      if (storySnap.exists()) {
        const storyData = storySnap.data();

        // Calculate deletion date (15 days from now)
        const permanentDeleteAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

        // Move to trash
        await addDoc(collection(db, `users/${userId}/biography_trash`), {
          originalId: story.id,
          originalData: storyData,
          deletedAt: serverTimestamp(),
          permanentDeleteAt: permanentDeleteAt
        });

        // Delete from stories
        await deleteDoc(storyRef);

        alert(`"${story.title}" moved to trash.`);
      }
    } catch (error) {
      console.error('Error moving to trash:', error);
      alert('Failed to delete story. Please try again.');
    }
  };

  const handleExport = () => {
    let markdown = `# ${story.emoji || ''} ${story.title}\n\n`;
    markdown += `Created: ${story.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}\n`;
    markdown += `Words: ${story.wordCount || 0}\n\n---\n\n`;

    if (story.bullets && story.bullets.length > 0) {
      markdown += `## Key Moments\n\n`;
      story.bullets.forEach(b => markdown += `- ${b}\n`);
      markdown += '\n---\n\n';
    }

    markdown += `## Story\n\n${story.content || ''}\n\n`;
    markdown += `---\n\n*Exported from GENESIS Biography Journal*\n`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${story.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const lastEdited = story.lastEditedAt?.toDate?.()?.toLocaleDateString() || 'Recently';
  const preview = (story.content || '').substring(0, 120);
  const tags = story.tags || {};
  const hasTags = tags.people?.length || tags.places?.length || tags.emotions?.length || tags.themes?.length;

  return (
    <div className="story-card">
      <div className="card-header">
        <span className="emoji">{story.emoji || '📖'}</span>
        <h3>{highlightMatch(story.title, searchQuery)}</h3>
      </div>
      <div className="card-meta">
        <span>{story.wordCount || 0} words</span>
        <span>Last: {lastEdited}</span>
      </div>
      <div className="card-preview">
        {highlightMatch(preview, searchQuery)}{preview.length >= 120 ? '...' : ''}
      </div>

      {/* Tags Display */}
      {hasTags && (
        <div className="card-tags">
          {tags.people?.slice(0, 3).map((tag, i) => (
            <span
              key={`p-${i}`}
              className="tag tag-people tag-clickable"
              title={`Click to search for "${tag}"`}
              onClick={(e) => { e.stopPropagation(); onTagClick?.(tag); }}
            >
              👤 {tag}
            </span>
          ))}
          {tags.places?.slice(0, 3).map((tag, i) => (
            <span
              key={`pl-${i}`}
              className="tag tag-places tag-clickable"
              title={`Click to search for "${tag}"`}
              onClick={(e) => { e.stopPropagation(); onTagClick?.(tag); }}
            >
              📍 {tag}
            </span>
          ))}
          {tags.emotions?.slice(0, 2).map((tag, i) => (
            <span
              key={`e-${i}`}
              className="tag tag-emotions tag-clickable"
              title={`Click to search for "${tag}"`}
              onClick={(e) => { e.stopPropagation(); onTagClick?.(tag); }}
            >
              💭 {tag}
            </span>
          ))}
          {tags.themes?.slice(0, 2).map((tag, i) => (
            <span
              key={`t-${i}`}
              className="tag tag-themes tag-clickable"
              title={`Click to search for "${tag}"`}
              onClick={(e) => { e.stopPropagation(); onTagClick?.(tag); }}
            >
              🏷️ {tag}
            </span>
          ))}
        </div>
      )}

      <div className="card-actions">
        <button onClick={onSelect} className="btn-primary">
          Edit
        </button>
        <button onClick={handleExport} className="btn-secondary">
          Export
        </button>
        <button onClick={handleDelete} className="btn-danger">
          Delete
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 3. STORY EDITOR (Main Writing Component)
// ============================================================================

function StoryEditor({ userId, storyId, onBack, onSearchTag, settings }) {
  const [story, setStory] = useState(null);
  const [content, setContent] = useState('');
  const [bullets, setBullets] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingBullets, setIsGeneratingBullets] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [newBullet, setNewBullet] = useState('');

  // Tags state
  const [tags, setTags] = useState({ people: [], places: [], emotions: [], themes: [] });
  const [isExtractingTags, setIsExtractingTags] = useState(false);
  const [showTagEditor, setShowTagEditor] = useState(false);
  const [newTagText, setNewTagText] = useState('');
  const [newTagCategory, setNewTagCategory] = useState('people');

  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [sttSupported, setSttSupported] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');

  // In-document find/highlight state
  const [highlightTerm, setHighlightTerm] = useState('');
  const [highlightMatches, setHighlightMatches] = useState([]);
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);

  // Text selection to tag state
  const [selectionTooltip, setSelectionTooltip] = useState({
    visible: false,
    text: '',
    x: 0,
    y: 0
  });

  const textareaRef = useRef(null);
  const tooltipRef = useRef(null);
  const saveTimeoutRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const selectedVoiceRef = useRef(null);
  const previewRef = useRef(null);

  // Platform detection
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  // Check browser support on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSttSupported(!!SpeechRecognition);
    if (!SpeechRecognition) {
      console.log('Speech Recognition not supported in this browser');
    }
  }, []);

  // Find best voice on mount
  useEffect(() => {
    const findBestVoice = () => {
      const voices = synthRef.current.getVoices();
      if (voices.length === 0) return;

      const voicePreferences = [
        'Samantha (Enhanced)', 'Samantha', 'Karen (Enhanced)', 'Karen',
        'Google US English', 'Microsoft Zira', 'female', 'Female'
      ];

      let bestVoice = null;
      for (const pref of voicePreferences) {
        bestVoice = voices.find(v => v.name.includes(pref));
        if (bestVoice) break;
      }

      if (!bestVoice) {
        bestVoice = voices.find(v => v.lang.startsWith('en'));
      }

      if (bestVoice) {
        selectedVoiceRef.current = bestVoice;
      }
    };

    findBestVoice();
    if (synthRef.current.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = findBestVoice;
    }
    const timer = setTimeout(findBestVoice, 500);
    return () => clearTimeout(timer);
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        // Insert at cursor position
        setContent(prev => {
          const before = prev.substring(0, cursorPosition);
          const after = prev.substring(cursorPosition);
          const newText = before + finalTranscript + after;
          // Update cursor position
          setCursorPosition(cursorPosition + finalTranscript.length);
          return newText;
        });
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [cursorPosition]);

  // Track cursor position in textarea
  const handleTextareaClick = useCallback(() => {
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }
  }, []);

  const handleTextareaKeyUp = useCallback(() => {
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }
  }, []);

  // Start/stop listening (STT)
  const toggleListening = useCallback(async () => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceStatus('Speech recognition is not supported in this browser. Try Chrome or Edge.');
      setTimeout(() => setVoiceStatus(''), 5000);
      return;
    }

    if (!recognitionRef.current) {
      setVoiceStatus('Speech recognition is not available. Please refresh the page.');
      setTimeout(() => setVoiceStatus(''), 5000);
      return;
    }

    // Save cursor position before starting
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setVoiceStatus('Stopped listening.');
      setTimeout(() => setVoiceStatus(''), 2000);
    } else {
      try {
        // Request microphone permission first
        setVoiceStatus('Requesting microphone access...');
        await navigator.mediaDevices.getUserMedia({ audio: true });

        recognitionRef.current.start();
        setIsListening(true);
        setVoiceStatus('Listening... Speak now!');
      } catch (e) {
        console.error('Failed to start recognition:', e);
        if (e.name === 'NotAllowedError') {
          setVoiceStatus('Microphone access denied. Please allow microphone in browser settings.');
        } else if (e.name === 'NotFoundError') {
          setVoiceStatus('No microphone found. Please connect a microphone.');
        } else {
          setVoiceStatus(`Error: ${e.message || 'Could not start speech recognition.'}`);
        }
        setTimeout(() => setVoiceStatus(''), 5000);
      }
    }
  }, [isListening]);

  // TTS: Speak from a specific position
  const speakFromPosition = useCallback((text, startIndex) => {
    if (!ttsEnabled || !text) return;

    const textToSpeak = text.substring(startIndex).trim();
    if (!textToSpeak) return;

    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    if (selectedVoiceRef.current) {
      utterance.voice = selectedVoiceRef.current;
    }
    utterance.rate = isIOS ? 0.9 : 0.95;
    utterance.pitch = 1.05;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  }, [ttsEnabled, isIOS]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    synthRef.current.cancel();
    setIsSpeaking(false);
  }, []);

  // Read from cursor position in textarea
  const readFromCursor = useCallback(() => {
    if (!content) {
      setVoiceStatus('No text to read.');
      setTimeout(() => setVoiceStatus(''), 2000);
      return;
    }

    // Get cursor position from textarea
    const startPos = textareaRef.current ? textareaRef.current.selectionStart : 0;
    const textToRead = content.substring(startPos).trim();

    if (!textToRead) {
      setVoiceStatus('No text after cursor position.');
      setTimeout(() => setVoiceStatus(''), 2000);
      return;
    }

    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(textToRead);
    if (selectedVoiceRef.current) {
      utterance.voice = selectedVoiceRef.current;
    }
    utterance.rate = isIOS ? 0.9 : 0.95;
    utterance.pitch = 1.05;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setVoiceStatus('Reading from cursor...');
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setVoiceStatus('Finished reading.');
      setTimeout(() => setVoiceStatus(''), 2000);
    };
    utterance.onerror = (e) => {
      setIsSpeaking(false);
      setVoiceStatus(`TTS Error: ${e.error || 'Unknown error'}`);
      setTimeout(() => setVoiceStatus(''), 5000);
    };

    synthRef.current.speak(utterance);
  }, [content, isIOS]);

  // Test TTS - speak a sample sentence
  const testTTS = useCallback(() => {
    synthRef.current.cancel();

    const testText = "Hello! Text to speech is working. Click Read from Cursor to read your story.";
    const utterance = new SpeechSynthesisUtterance(testText);

    if (selectedVoiceRef.current) {
      utterance.voice = selectedVoiceRef.current;
    }
    utterance.rate = isIOS ? 0.9 : 0.95;
    utterance.pitch = 1.05;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setVoiceStatus('Playing test audio...');
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setVoiceStatus('TTS test complete!');
      setTimeout(() => setVoiceStatus(''), 3000);
    };
    utterance.onerror = (e) => {
      setIsSpeaking(false);
      setVoiceStatus(`TTS Error: ${e.error || 'Unknown error'}`);
      setTimeout(() => setVoiceStatus(''), 5000);
    };

    synthRef.current.speak(utterance);
  }, [isIOS]);

  // Handle click on preview text (TTS - click word to read from there)
  const handlePreviewClick = useCallback((e) => {
    if (!ttsEnabled || !content) return;

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const textNode = range.startContainer;

      if (textNode.nodeType === Node.TEXT_NODE) {
        const clickOffset = range.startOffset;
        const textContent = textNode.textContent;

        // Find start of current word
        let wordStart = clickOffset;
        while (wordStart > 0 && textContent[wordStart - 1] !== ' ' && textContent[wordStart - 1] !== '\n') {
          wordStart--;
        }

        // Find where this text appears in content
        const nodeText = textNode.textContent;
        const nodeStartInContent = content.indexOf(nodeText);
        const absolutePosition = nodeStartInContent >= 0 ? nodeStartInContent + wordStart : 0;

        speakFromPosition(content, absolutePosition);
      }
    }
  }, [ttsEnabled, content, speakFromPosition]);

  // Load story
  useEffect(() => {
    const loadStory = async () => {
      const docRef = doc(db, `users/${userId}/biography_stories/${storyId}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() };
        setStory(data);
        setContent(data.content || '');
        setBullets(data.bullets || []);
        setTags(data.tags || { people: [], places: [], emotions: [], themes: [] });
      }
    };
    loadStory();
  }, [userId, storyId]);

  // Auto-save
  useEffect(() => {
    if (!story || !settings.autoSave) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      handleSave();
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, bullets]);

  const handleSave = async () => {
    if (!story) return;

    setIsSaving(true);
    try {
      const storyRef = doc(db, `users/${userId}/biography_stories/${storyId}`);
      const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

      await updateDoc(storyRef, {
        content: content,
        bullets: bullets,
        tags: tags,
        wordCount: wordCount,
        lastEditedAt: serverTimestamp()
      });

      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateBullets = async () => {
    if (!content.trim()) {
      alert('Please write some content first.');
      return;
    }

    setIsGeneratingBullets(true);
    try {
      const createBulletsFn = httpsCallable(functions, 'extractBiographyBullets');
      const result = await createBulletsFn({
        content: content,
        existingBullets: bullets
      });

      if (result.data.bullets && result.data.bullets.length > 0) {
        setBullets(prev => [...prev, ...result.data.bullets]);
      }
    } catch (error) {
      console.error('Error generating bullets:', error);
      alert('Failed to generate key moments. Please try again.');
    } finally {
      setIsGeneratingBullets(false);
    }
  };

  const handleAddBullet = () => {
    if (!newBullet.trim()) return;
    setBullets(prev => [...prev, newBullet.trim()]);
    setNewBullet('');
  };

  const handleRemoveBullet = (index) => {
    setBullets(prev => prev.filter((_, i) => i !== index));
  };

  const handleMoveBullet = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= bullets.length) return;

    const newBullets = [...bullets];
    [newBullets[index], newBullets[newIndex]] = [newBullets[newIndex], newBullets[index]];
    setBullets(newBullets);
  };

  // ============================================================================
  // AUTO-TAGGING SYSTEM
  // ============================================================================

  // Client-side tag extraction (fallback when AI not available)
  const extractTagsClientSide = (text) => {
    const newTags = { people: [], places: [], emotions: [], themes: [] };

    // Common emotion keywords
    const emotionKeywords = {
      happy: ['happy', 'joy', 'joyful', 'excited', 'thrilled', 'delighted', 'elated', 'blessed'],
      sad: ['sad', 'grief', 'loss', 'mourning', 'heartbroken', 'devastated', 'melancholy'],
      love: ['love', 'loved', 'loving', 'adore', 'cherish', 'affection', 'romance'],
      fear: ['scared', 'afraid', 'terrified', 'anxious', 'worried', 'nervous', 'fear'],
      anger: ['angry', 'furious', 'frustrated', 'upset', 'annoyed', 'rage'],
      proud: ['proud', 'accomplished', 'achieved', 'success', 'triumph'],
      grateful: ['grateful', 'thankful', 'appreciate', 'blessed'],
      nostalgic: ['remember', 'memories', 'nostalgia', 'nostalgic', 'reminisce']
    };

    // Life theme keywords
    const themeKeywords = {
      childhood: ['child', 'childhood', 'kid', 'young', 'grew up', 'school', 'elementary', 'kindergarten'],
      family: ['family', 'mother', 'father', 'mom', 'dad', 'parent', 'sibling', 'brother', 'sister', 'grandma', 'grandpa', 'grandmother', 'grandfather', 'aunt', 'uncle'],
      career: ['job', 'work', 'career', 'office', 'business', 'company', 'profession', 'employed'],
      education: ['school', 'college', 'university', 'degree', 'graduate', 'study', 'teacher', 'student'],
      travel: ['travel', 'trip', 'vacation', 'visit', 'journey', 'adventure', 'explore'],
      health: ['health', 'hospital', 'doctor', 'illness', 'sick', 'recovery', 'surgery'],
      marriage: ['wedding', 'marriage', 'married', 'spouse', 'wife', 'husband', 'engagement'],
      milestones: ['birthday', 'anniversary', 'graduation', 'retirement', 'promotion', 'achievement']
    };

    const lowerText = text.toLowerCase();

    // Extract emotions
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      if (keywords.some(kw => lowerText.includes(kw))) {
        if (!newTags.emotions.includes(emotion)) {
          newTags.emotions.push(emotion);
        }
      }
    }

    // Extract themes
    for (const [theme, keywords] of Object.entries(themeKeywords)) {
      if (keywords.some(kw => lowerText.includes(kw))) {
        if (!newTags.themes.includes(theme)) {
          newTags.themes.push(theme);
        }
      }
    }

    // Extract potential names (capitalized words that might be names)
    // Simple heuristic: Words starting with capital letter not at sentence start
    const namePatterns = text.match(/(?<=[a-z]\s)[A-Z][a-z]+(?:\s[A-Z][a-z]+)?/g) || [];
    const commonWords = ['The', 'This', 'That', 'When', 'Where', 'What', 'How', 'Why', 'Which', 'There', 'Then', 'Now', 'But', 'And', 'Or', 'So', 'If', 'My', 'Our', 'Their', 'His', 'Her', 'We', 'They', 'He', 'She', 'It', 'One', 'First', 'Last', 'Next', 'After', 'Before', 'During'];
    const potentialNames = [...new Set(namePatterns)].filter(name => !commonWords.includes(name.split(' ')[0]));
    newTags.people = potentialNames.slice(0, 10);

    // Extract potential places (common place indicators)
    const placePatterns = text.match(/(?:in|at|to|from|near|visited|lived in)\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)/gi) || [];
    const places = placePatterns.map(p => p.replace(/^(in|at|to|from|near|visited|lived in)\s+/i, '').trim());
    newTags.places = [...new Set(places)].slice(0, 10);

    return newTags;
  };

  // Handle AI tag extraction (with fallback)
  const handleExtractTags = async () => {
    if (!content.trim()) {
      alert('Please write some content first.');
      return;
    }

    setIsExtractingTags(true);
    try {
      // Try AI extraction first via cloud function
      const extractTagsFn = httpsCallable(functions, 'extractBiographyTags');
      const result = await extractTagsFn({
        content: content,
        existingTags: tags
      });

      if (result.data.tags) {
        // Merge with existing tags (avoid duplicates)
        setTags(prev => ({
          people: [...new Set([...prev.people, ...(result.data.tags.people || [])])],
          places: [...new Set([...prev.places, ...(result.data.tags.places || [])])],
          emotions: [...new Set([...prev.emotions, ...(result.data.tags.emotions || [])])],
          themes: [...new Set([...prev.themes, ...(result.data.tags.themes || [])])]
        }));
      }
    } catch (error) {
      console.log('AI extraction not available, using client-side extraction:', error);
      // Fallback to client-side extraction
      const extractedTags = extractTagsClientSide(content);
      setTags(prev => ({
        people: [...new Set([...prev.people, ...extractedTags.people])],
        places: [...new Set([...prev.places, ...extractedTags.places])],
        emotions: [...new Set([...prev.emotions, ...extractedTags.emotions])],
        themes: [...new Set([...prev.themes, ...extractedTags.themes])]
      }));
    } finally {
      setIsExtractingTags(false);
    }
  };

  // Add a tag manually
  const handleAddTag = () => {
    if (!newTagText.trim()) return;
    setTags(prev => ({
      ...prev,
      [newTagCategory]: [...new Set([...prev[newTagCategory], newTagText.trim()])]
    }));
    setNewTagText('');
  };

  // Remove a tag
  const handleRemoveTag = (category, tagToRemove) => {
    setTags(prev => ({
      ...prev,
      [category]: prev[category].filter(t => t !== tagToRemove)
    }));
  };

  // Clear all tags
  const handleClearAllTags = () => {
    if (window.confirm('Clear all tags? This cannot be undone.')) {
      setTags({ people: [], places: [], emotions: [], themes: [] });
    }
  };

  // ============================================================================
  // IN-DOCUMENT FIND/HIGHLIGHT SYSTEM
  // ============================================================================

  // Find all occurrences of a term in the content
  const findAllMatches = useCallback((term) => {
    if (!term || !content) return [];

    const matches = [];
    const lowerContent = content.toLowerCase();
    const lowerTerm = term.toLowerCase();
    let startIndex = 0;

    while (true) {
      const index = lowerContent.indexOf(lowerTerm, startIndex);
      if (index === -1) break;

      // Get context around the match (50 chars before and after)
      const contextStart = Math.max(0, index - 50);
      const contextEnd = Math.min(content.length, index + term.length + 50);
      const context = content.substring(contextStart, contextEnd);

      matches.push({
        index,
        endIndex: index + term.length,
        context,
        contextOffset: index - contextStart // Where the match starts within context
      });

      startIndex = index + 1;
    }

    return matches;
  }, [content]);

  // Helper: Scroll textarea so match is centered
  const scrollToMatchCentered = useCallback((matchIndex, matchEndIndex) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const textBeforeMatch = textarea.value.substring(0, matchIndex);
    const lines = textBeforeMatch.split('\n');
    const lineNumber = lines.length;

    // Get textarea dimensions
    const lineHeight = 28; // Approximate line height
    const textareaHeight = textarea.clientHeight;
    const halfHeight = textareaHeight / 2;

    // Calculate scroll position to center the match
    const matchLinePosition = (lineNumber - 1) * lineHeight;
    const centeredScrollTop = matchLinePosition - halfHeight + (lineHeight / 2);

    // Scroll to centered position (clamp to valid range)
    textarea.scrollTop = Math.max(0, centeredScrollTop);

    // Set selection and focus
    textarea.focus();
    textarea.setSelectionRange(matchIndex, matchEndIndex);
  }, []);

  // Handle tag click - find in document
  const handleFindInDocument = useCallback((term) => {
    const matches = findAllMatches(term);
    setHighlightTerm(term);
    setHighlightMatches(matches);
    setCurrentHighlightIndex(0);

    // Scroll to first match in textarea (centered)
    if (matches.length > 0) {
      scrollToMatchCentered(matches[0].index, matches[0].endIndex);
    }
  }, [findAllMatches, scrollToMatchCentered]);

  // Navigate to next match
  const goToNextMatch = useCallback(() => {
    if (highlightMatches.length === 0) return;

    const nextIndex = (currentHighlightIndex + 1) % highlightMatches.length;
    setCurrentHighlightIndex(nextIndex);

    const match = highlightMatches[nextIndex];
    scrollToMatchCentered(match.index, match.endIndex);
  }, [highlightMatches, currentHighlightIndex, scrollToMatchCentered]);

  // Navigate to previous match
  const goToPrevMatch = useCallback(() => {
    if (highlightMatches.length === 0) return;

    const prevIndex = currentHighlightIndex === 0
      ? highlightMatches.length - 1
      : currentHighlightIndex - 1;
    setCurrentHighlightIndex(prevIndex);

    const match = highlightMatches[prevIndex];
    scrollToMatchCentered(match.index, match.endIndex);
  }, [highlightMatches, currentHighlightIndex, scrollToMatchCentered]);

  // Jump to specific match
  const goToMatch = useCallback((matchIndex) => {
    if (matchIndex < 0 || matchIndex >= highlightMatches.length) return;

    setCurrentHighlightIndex(matchIndex);
    const match = highlightMatches[matchIndex];
    scrollToMatchCentered(match.index, match.endIndex);
  }, [highlightMatches, scrollToMatchCentered]);

  // Clear highlight/find
  const clearHighlight = useCallback(() => {
    setHighlightTerm('');
    setHighlightMatches([]);
    setCurrentHighlightIndex(0);
  }, []);

  // ============================================================================
  // TEXT SELECTION TO TAG SYSTEM
  // ============================================================================

  // Handle text selection in textarea
  const handleTextSelection = useCallback((e) => {
    if (!textareaRef.current) return;

    const selectedText = window.getSelection()?.toString()?.trim() ||
      textareaRef.current.value.substring(
        textareaRef.current.selectionStart,
        textareaRef.current.selectionEnd
      ).trim();

    // Only show tooltip if text is selected and not too long
    if (selectedText && selectedText.length > 0 && selectedText.length <= 50) {
      // Get textarea position
      const rect = textareaRef.current.getBoundingClientRect();

      // Calculate approximate position (center of selection area)
      const selectionStart = textareaRef.current.selectionStart;
      const textBeforeSelection = textareaRef.current.value.substring(0, selectionStart);
      const lines = textBeforeSelection.split('\n');
      const lineNumber = lines.length;
      const charInLine = lines[lines.length - 1].length;

      // Approximate position calculation
      const lineHeight = 28; // Approximate line height
      const charWidth = 10; // Approximate character width
      const tooltipHeight = 160; // Approximate tooltip height

      // Position tooltip ABOVE the selection
      const x = Math.min(
        rect.left + (charInLine * charWidth) + 20,
        rect.right - 220 // Don't overflow right edge
      );

      // Calculate Y position: selection line position minus tooltip height
      const selectionYInTextarea = (lineNumber - 1) * lineHeight;
      const scrollTop = textareaRef.current.scrollTop;
      const selectionScreenY = rect.top + selectionYInTextarea - scrollTop;

      // Position above selection, but keep within viewport
      let y = selectionScreenY - tooltipHeight - 10;

      // If would go above viewport, position below selection instead
      if (y < 10) {
        y = selectionScreenY + lineHeight + 10;
      }

      setSelectionTooltip({
        visible: true,
        text: selectedText,
        x: Math.max(rect.left + 10, x),
        y: Math.max(10, y)
      });
    } else {
      // Hide tooltip if no valid selection
      setSelectionTooltip(prev => ({ ...prev, visible: false }));
    }

    // Also update cursor position for STT
    setCursorPosition(textareaRef.current.selectionStart);
  }, []);

  // Hide the selection tooltip
  const hideSelectionTooltip = useCallback(() => {
    setSelectionTooltip(prev => ({ ...prev, visible: false }));
  }, []);

  // Add selected text as tag
  const addSelectionAsTag = useCallback((category) => {
    if (!selectionTooltip.text) return;

    setTags(prev => ({
      ...prev,
      [category]: [...new Set([...prev[category], selectionTooltip.text])]
    }));

    // Hide tooltip after adding
    setSelectionTooltip(prev => ({ ...prev, visible: false }));

    // Optionally trigger find for the new tag
    handleFindInDocument(selectionTooltip.text);
  }, [selectionTooltip.text, handleFindInDocument]);

  // Click outside to close tooltip
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target) &&
          textareaRef.current && !textareaRef.current.contains(e.target)) {
        hideSelectionTooltip();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [hideSelectionTooltip]);

  // Count total tags
  const totalTags = tags.people.length + tags.places.length + tags.emotions.length + tags.themes.length;

  if (!story) {
    return (
      <div className="bio-journal-app">
        <div className="loading">Loading story...</div>
      </div>
    );
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="story-editor">
      <div className="editor-header">
        <button onClick={onBack} className="btn-back">
          Back
        </button>
        <h2>{story.emoji} {story.title}</h2>
        <div className="save-status">
          {isSaving ? 'Saving...' : lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : ''}
        </div>
      </div>

      {/* Bullets Section */}
      <div className="bullets-section">
        <div className="bullets-header">
          <h3>Key Moments</h3>
          <button
            onClick={handleGenerateBullets}
            className="btn-ai"
            disabled={isGeneratingBullets}
          >
            {isGeneratingBullets ? 'Generating...' : 'AI Extract Key Moments'}
          </button>
        </div>

        {bullets.length > 0 && (
          <div className="bullets-list">
            {bullets.map((bullet, index) => (
              <div key={index} className="bullet-item">
                <span className="bullet-number">{index + 1}.</span>
                <span className="bullet-text">{bullet}</span>
                <div className="bullet-actions">
                  <button onClick={() => handleMoveBullet(index, 'up')} disabled={index === 0}>
                    Up
                  </button>
                  <button onClick={() => handleMoveBullet(index, 'down')} disabled={index === bullets.length - 1}>
                    Down
                  </button>
                  <button onClick={() => handleRemoveBullet(index)} className="btn-remove">
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="add-bullet">
          <input
            type="text"
            placeholder="Add a key moment manually..."
            value={newBullet}
            onChange={(e) => setNewBullet(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddBullet()}
          />
          <button onClick={handleAddBullet} className="btn-add">
            Add
          </button>
        </div>
      </div>

      {/* Tags Section */}
      <div className="tags-section">
        <div className="tags-header">
          <h3>Story Tags ({totalTags})</h3>
          <div className="tags-actions">
            <button
              onClick={handleExtractTags}
              className="btn-ai"
              disabled={isExtractingTags}
            >
              {isExtractingTags ? 'Extracting...' : 'AI Extract Tags'}
            </button>
            <button
              onClick={() => setShowTagEditor(!showTagEditor)}
              className="btn-secondary"
            >
              {showTagEditor ? 'Hide Editor' : 'Add Tags'}
            </button>
            {totalTags > 0 && (
              <button onClick={handleClearAllTags} className="btn-danger btn-small">
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Tags Display Grid - Click to find in document */}
        <div className="tags-display">
          <div className="tags-hint">Click a tag to find all occurrences in your story</div>
          {tags.people.length > 0 && (
            <div className="tag-group">
              <span className="tag-group-label">👤 People:</span>
              <div className="tag-chips">
                {tags.people.map((tag, i) => (
                  <span
                    key={i}
                    className="tag-chip tag-people tag-clickable"
                    onClick={() => handleFindInDocument(tag)}
                    title={`Click to find "${tag}" in this story`}
                  >
                    {tag}
                    <button onClick={(e) => { e.stopPropagation(); handleRemoveTag('people', tag); }} className="tag-remove">×</button>
                  </span>
                ))}
              </div>
            </div>
          )}
          {tags.places.length > 0 && (
            <div className="tag-group">
              <span className="tag-group-label">📍 Places:</span>
              <div className="tag-chips">
                {tags.places.map((tag, i) => (
                  <span
                    key={i}
                    className="tag-chip tag-places tag-clickable"
                    onClick={() => handleFindInDocument(tag)}
                    title={`Click to find "${tag}" in this story`}
                  >
                    {tag}
                    <button onClick={(e) => { e.stopPropagation(); handleRemoveTag('places', tag); }} className="tag-remove">×</button>
                  </span>
                ))}
              </div>
            </div>
          )}
          {tags.emotions.length > 0 && (
            <div className="tag-group">
              <span className="tag-group-label">💭 Emotions:</span>
              <div className="tag-chips">
                {tags.emotions.map((tag, i) => (
                  <span
                    key={i}
                    className="tag-chip tag-emotions tag-clickable"
                    onClick={() => handleFindInDocument(tag)}
                    title={`Click to find "${tag}" in this story`}
                  >
                    {tag}
                    <button onClick={(e) => { e.stopPropagation(); handleRemoveTag('emotions', tag); }} className="tag-remove">×</button>
                  </span>
                ))}
              </div>
            </div>
          )}
          {tags.themes.length > 0 && (
            <div className="tag-group">
              <span className="tag-group-label">🏷️ Life Themes:</span>
              <div className="tag-chips">
                {tags.themes.map((tag, i) => (
                  <span
                    key={i}
                    className="tag-chip tag-themes tag-clickable"
                    onClick={() => handleFindInDocument(tag)}
                    title={`Click to find "${tag}" in this story`}
                  >
                    {tag}
                    <button onClick={(e) => { e.stopPropagation(); handleRemoveTag('themes', tag); }} className="tag-remove">×</button>
                  </span>
                ))}
              </div>
            </div>
          )}
          {totalTags === 0 && (
            <div className="no-tags">
              No tags yet. Click "AI Extract Tags" to auto-detect, or add manually.
            </div>
          )}
        </div>

        {/* Manual Tag Editor */}
        {showTagEditor && (
          <div className="tag-editor">
            <select
              value={newTagCategory}
              onChange={(e) => setNewTagCategory(e.target.value)}
              className="tag-category-select"
            >
              <option value="people">👤 Person</option>
              <option value="places">📍 Place</option>
              <option value="emotions">💭 Emotion</option>
              <option value="themes">🏷️ Life Theme</option>
            </select>
            <input
              type="text"
              placeholder={`Add a ${newTagCategory.slice(0, -1)}...`}
              value={newTagText}
              onChange={(e) => setNewTagText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              className="tag-input"
            />
            <button onClick={handleAddTag} className="btn-add">
              Add Tag
            </button>
          </div>
        )}
      </div>

      {/* Find in Document Panel - Shows when searching */}
      {highlightTerm && (
        <div className="find-panel">
          <div className="find-header">
            <span className="find-icon">🔍</span>
            <span className="find-term">"{highlightTerm}"</span>
            <span className="find-count">
              {highlightMatches.length === 0
                ? 'No matches found'
                : `${currentHighlightIndex + 1} of ${highlightMatches.length} matches`}
            </span>
            <div className="find-nav">
              <button
                onClick={goToPrevMatch}
                disabled={highlightMatches.length === 0}
                className="btn-find-nav"
                title="Previous match"
              >
                ◀ Prev
              </button>
              <button
                onClick={goToNextMatch}
                disabled={highlightMatches.length === 0}
                className="btn-find-nav"
                title="Next match"
              >
                Next ▶
              </button>
            </div>
            <button onClick={clearHighlight} className="btn-find-close" title="Close find">
              ✕
            </button>
          </div>

          {/* Match List with Context */}
          {highlightMatches.length > 0 && (
            <div className="find-matches">
              <div className="find-matches-label">Click to jump to occurrence:</div>
              <div className="find-matches-list">
                {highlightMatches.map((match, idx) => {
                  // Highlight the term within the context
                  const beforeMatch = match.context.substring(0, match.contextOffset);
                  const matchText = match.context.substring(match.contextOffset, match.contextOffset + highlightTerm.length);
                  const afterMatch = match.context.substring(match.contextOffset + highlightTerm.length);

                  return (
                    <div
                      key={idx}
                      className={`find-match-item ${idx === currentHighlightIndex ? 'active' : ''}`}
                      onClick={() => goToMatch(idx)}
                    >
                      <span className="match-number">#{idx + 1}</span>
                      <span className="match-context">
                        ...{beforeMatch}<mark className="find-highlight">{matchText}</mark>{afterMatch}...
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Secondary action: Search all stories */}
          <div className="find-actions">
            <button
              onClick={() => { clearHighlight(); onSearchTag?.(highlightTerm); }}
              className="btn-search-all"
            >
              🔎 Search "{highlightTerm}" in ALL stories
            </button>
          </div>
        </div>
      )}

      {/* Text Editor */}
      <div className="text-editor-section">
        <div className="editor-toolbar">
          <h3>Your Story</h3>
          <div className="toolbar-right">
            {settings.showWordCount && (
              <span className="word-count">{wordCount} words</span>
            )}
            <span className="cursor-pos">Cursor: {cursorPosition}</span>
          </div>
        </div>

        {/* Voice Controls */}
        <div className="voice-controls">
          <button
            onClick={toggleListening}
            className={`btn-voice ${isListening ? 'btn-voice-active' : ''} ${!sttSupported ? 'btn-disabled' : ''}`}
            title={sttSupported ? "Click to speak, text inserts at cursor" : "Speech recognition not supported in this browser"}
          >
            {isListening ? '🎙️ Stop Listening' : '🎤 Speak to Type'}
          </button>
          <button
            onClick={readFromCursor}
            className="btn-read-cursor"
            title="Read aloud from cursor position"
            disabled={isSpeaking || !content}
          >
            📖 Read from Cursor
          </button>
          <button
            onClick={testTTS}
            className="btn-test-tts"
            title="Test text-to-speech"
            disabled={isSpeaking}
          >
            🔈 Test
          </button>
          {isSpeaking && (
            <button onClick={stopSpeaking} className="btn-stop-speech">
              ⏹️ Stop
            </button>
          )}
        </div>

        {/* Voice Status Message */}
        {voiceStatus && (
          <div className="voice-status">
            {voiceStatus}
          </div>
        )}

        {/* Browser Support Warning */}
        {!sttSupported && (
          <div className="browser-warning">
            ⚠️ Speech-to-Text is not supported in this browser. For voice input, please use Chrome, Edge, or Safari.
          </div>
        )}

        {isListening && (
          <div className="listening-indicator">
            🎙️ Listening... Speak now. Text will insert at cursor position.
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onClick={handleTextareaClick}
          onKeyUp={handleTextareaKeyUp}
          onSelect={handleTextareaClick}
          onMouseUp={handleTextSelection}
          placeholder="Start writing your story here...

Tell us about a special memory, a life lesson, or an important moment in your life.

Features:
• 🎤 Speak to Type - dictate your story
• 📖 Read from Cursor - hear it read aloud
• ✨ Highlight any word → add as tag for easy searching

Take your time - your words will be preserved for generations to come."
          className="main-textarea"
          rows={15}
        />

        {/* Selection to Tag Tooltip */}
        {selectionTooltip.visible && (
          <div
            ref={tooltipRef}
            className="selection-tooltip"
            style={{
              position: 'fixed',
              left: `${selectionTooltip.x}px`,
              top: `${selectionTooltip.y}px`,
              zIndex: 1000
            }}
          >
            <div className="selection-tooltip-header">
              <span className="selection-text">"{selectionTooltip.text}"</span>
              <button
                className="tooltip-close"
                onClick={hideSelectionTooltip}
                title="Close"
              >
                ×
              </button>
            </div>
            <div className="selection-tooltip-label">Add as tag:</div>
            <div className="selection-tooltip-buttons">
              <button
                onClick={() => addSelectionAsTag('people')}
                className="tooltip-btn tooltip-btn-people"
                title="Add as person"
              >
                👤 Person
              </button>
              <button
                onClick={() => addSelectionAsTag('places')}
                className="tooltip-btn tooltip-btn-places"
                title="Add as place"
              >
                📍 Place
              </button>
              <button
                onClick={() => addSelectionAsTag('emotions')}
                className="tooltip-btn tooltip-btn-emotions"
                title="Add as emotion"
              >
                💭 Emotion
              </button>
              <button
                onClick={() => addSelectionAsTag('themes')}
                className="tooltip-btn tooltip-btn-themes"
                title="Add as life theme"
              >
                🏷️ Theme
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="editor-footer">
        <button onClick={handleSave} className="btn-primary btn-save" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Story'}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 4. TRASH SCREEN
// ============================================================================

function TrashScreen({ userId, onBack, settings }) {
  const [trashItems, setTrashItems] = useState([]);

  useEffect(() => {
    const trashRef = collection(db, `users/${userId}/biography_trash`);
    const unsubscribe = onSnapshot(trashRef, (snapshot) => {
      const items = snapshot.docs.map(doc => {
        const data = doc.data();
        const now = new Date();
        const deleteDate = data.permanentDeleteAt instanceof Date
          ? data.permanentDeleteAt
          : data.permanentDeleteAt?.toDate?.() || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
        const daysRemaining = Math.ceil((deleteDate - now) / (1000 * 60 * 60 * 24));

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

  const handleRecover = async (trashItem) => {
    try {
      // Restore to stories
      await addDoc(collection(db, `users/${userId}/biography_stories`), {
        ...trashItem.originalData,
        lastEditedAt: serverTimestamp()
      });

      // Remove from trash
      await deleteDoc(doc(db, `users/${userId}/biography_trash/${trashItem.id}`));

      alert(`"${trashItem.originalData.title}" has been recovered!`);
    } catch (error) {
      console.error('Error recovering:', error);
      alert('Failed to recover story. Please try again.');
    }
  };

  const handlePermanentDelete = async (trashItem) => {
    const confirmed = window.confirm(
      `PERMANENT DELETE\n\nDelete "${trashItem.originalData.title}" forever?\n\nThis CANNOT be undone!`
    );
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, `users/${userId}/biography_trash/${trashItem.id}`));
      alert('Story permanently deleted.');
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete. Please try again.');
    }
  };

  return (
    <div className="trash-screen">
      <div className="header">
        <button onClick={onBack} className="btn-back">Back</button>
        <h1>Trash</h1>
      </div>

      <div className="trash-info">
        Items will be permanently deleted after 15 days.
      </div>

      {trashItems.length === 0 ? (
        <div className="empty-trash">Trash is empty</div>
      ) : (
        <div className="trash-items">
          {trashItems.map(item => (
            <div key={item.id} className="trash-item">
              <div className="item-header">
                <span className="emoji">{item.originalData?.emoji || '📖'}</span>
                <h3>{item.originalData?.title || 'Untitled'}</h3>
              </div>
              <div className="item-meta">
                <span>Deleted: {item.deletedAt?.toDate?.()?.toLocaleDateString() || 'Recently'}</span>
                <span className={item.daysRemaining <= 3 ? 'urgent' : ''}>
                  {item.daysRemaining} days left
                </span>
              </div>
              <div className="item-actions">
                <button onClick={() => handleRecover(item)} className="btn-primary">
                  Recover
                </button>
                <button
                  onClick={() => handlePermanentDelete(item)}
                  className="btn-danger"
                >
                  Delete Forever
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
// 5. IMPORT DIALOG
// ============================================================================

function ImportDialog({ onImport, onClose }) {
  const [preview, setPreview] = useState(null);
  const [filename, setFilename] = useState('');

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.md') && !selectedFile.name.endsWith('.txt')) {
      alert('Please select a Markdown (.md) or Text (.txt) file.');
      return;
    }

    setFilename(selectedFile.name);
    const text = await selectedFile.text();
    setPreview(text);
  };

  const handleImport = () => {
    if (!preview) return;
    onImport(preview, filename);
  };

  return (
    <div className="import-dialog-overlay" onClick={onClose}>
      <div className="import-dialog" onClick={(e) => e.stopPropagation()}>
        <h2>Import Markdown File</h2>

        <label className="file-input-label">
          <input type="file" accept=".md,.txt" onChange={handleFileSelect} />
          Choose File
        </label>

        {preview && (
          <div className="import-preview">
            <h3>Preview: {filename}</h3>
            <div className="preview-text">
              {preview.substring(0, 500)}{preview.length > 500 ? '...' : ''}
            </div>
            <div className="import-actions">
              <button onClick={handleImport} className="btn-primary">
                Import Story
              </button>
              <button onClick={onClose} className="btn-cancel">
                Cancel
              </button>
            </div>
          </div>
        )}

        {!preview && (
          <button onClick={onClose} className="btn-cancel" style={{ marginTop: '20px' }}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 6. SETTINGS SCREEN
// ============================================================================

function SettingsScreen({ settings, onUpdateSettings, onBack }) {
  return (
    <div className="settings-screen">
      <div className="header">
        <button onClick={onBack} className="btn-back">Back</button>
        <h1>Settings</h1>
      </div>

      <div className="settings-section">
        <h2>Display</h2>

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
        <h2>Writing</h2>

        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(e) => onUpdateSettings({...settings, autoSave: e.target.checked})}
            />
            Auto-save while typing
          </label>
        </div>

        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.showWordCount}
              onChange={(e) => onUpdateSettings({...settings, showWordCount: e.target.checked})}
            />
            Show word count
          </label>
        </div>
      </div>
    </div>
  );
}
