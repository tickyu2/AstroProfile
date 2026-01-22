/**
 * Luna Personality Panel (Brain 7B)
 *
 * Allows users to view and customize Luna's personality dimensions.
 * Supports JSON and Markdown export/import.
 *
 * Brain 7A = Luna's Constitutional Chart (fixed)
 * Brain 7B = Luna's Personality (customizable per user)
 *
 * GENESIS AstroProfile - January 2026
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  getLunaPersonality,
  saveLunaPersonality,
  resetLunaPersonality,
  exportPersonalityToJSON,
  importPersonalityFromJSON,
  exportPersonalityToMarkdown,
  importPersonalityFromMarkdown,
  DEFAULT_LUNA_PERSONALITY
} from '../../services/lunaPersonalityService';

export default function LunaPersonalityPanel({ isOpen, onClose }) {
  const { user } = useAuth();
  const [personality, setPersonality] = useState(DEFAULT_LUNA_PERSONALITY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('traits');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [importFormat, setImportFormat] = useState('json');
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);

  // Load personality on mount
  useEffect(() => {
    if (isOpen && user?.uid) {
      loadPersonality();
    }
  }, [isOpen, user?.uid]);

  const loadPersonality = async () => {
    setLoading(true);
    try {
      const data = await getLunaPersonality(user?.uid);
      setPersonality(data);
      setHasChanges(false);
    } catch (error) {
      console.error('Error loading personality:', error);
      showMessage('Failed to load personality', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.uid) {
      showMessage('Please sign in to save', 'error');
      return;
    }

    setSaving(true);
    try {
      await saveLunaPersonality(user.uid, personality);
      setHasChanges(false);
      showMessage('Personality saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving:', error);
      showMessage('Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Reset Luna\'s personality to defaults? This cannot be undone.')) return;

    setSaving(true);
    try {
      await resetLunaPersonality(user?.uid);
      setPersonality(DEFAULT_LUNA_PERSONALITY);
      setHasChanges(false);
      showMessage('Reset to defaults', 'success');
    } catch (error) {
      showMessage('Failed to reset', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleTraitChange = (traitKey, value) => {
    setPersonality(prev => ({
      ...prev,
      traits: {
        ...prev.traits,
        [traitKey]: {
          ...prev.traits[traitKey],
          value: parseInt(value)
        }
      }
    }));
    setHasChanges(true);
  };

  const handleExportJSON = () => {
    const json = exportPersonalityToJSON(personality);
    downloadFile(json, 'luna-personality-brain7b.json', 'application/json');
    showMessage('Exported as JSON', 'success');
  };

  const handleExportMarkdown = () => {
    const md = exportPersonalityToMarkdown(personality);
    downloadFile(md, 'luna-personality-brain7b.md', 'text/markdown');
    showMessage('Exported as Markdown', 'success');
  };

  const handleImport = () => {
    try {
      let imported;
      if (importFormat === 'json') {
        imported = importPersonalityFromJSON(importText);
      } else {
        imported = importPersonalityFromMarkdown(importText);
      }
      setPersonality(imported);
      setHasChanges(true);
      setShowImportModal(false);
      setImportText('');
      showMessage('Imported successfully! Save to persist changes.', 'success');
    } catch (error) {
      showMessage(`Import failed: ${error.message}`, 'error');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setImportText(e.target.result);
      const isJson = file.name.endsWith('.json');
      setImportFormat(isJson ? 'json' : 'markdown');
    };
    reader.readAsText(file);
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-xl border border-purple-500/30 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧠</span>
            <div>
              <h2 className="text-xl font-semibold text-white">Luna's Personality (Brain 7B)</h2>
              <p className="text-sm text-slate-400">Customize how Luna interacts with you</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-1 rounded">
                Unsaved Changes
              </span>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Message Toast */}
        {message && (
          <div className={`mx-4 mt-4 px-4 py-2 rounded-lg text-sm ${
            message.type === 'success' ? 'bg-green-500/20 text-green-400' :
            message.type === 'error' ? 'bg-red-500/20 text-red-400' :
            'bg-blue-500/20 text-blue-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-slate-700 px-4">
          {[
            { id: 'traits', label: 'Personality Traits', icon: '💫' },
            { id: 'communication', label: 'Communication', icon: '💬' },
            { id: 'expertise', label: 'Expertise', icon: '📚' },
            { id: 'advanced', label: 'Advanced', icon: '⚙️' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
            </div>
          ) : (
            <>
              {/* Traits Tab */}
              {activeTab === 'traits' && (
                <div className="space-y-6">
                  <p className="text-slate-400 text-sm">
                    Adjust these sliders to customize how Luna responds to you.
                    Changes affect her personality in conversations.
                  </p>

                  {Object.entries(personality.traits || {}).map(([key, trait]) => (
                    <div key={key} className="bg-slate-800/50 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <label className="text-white font-medium">
                          {formatTraitName(key)}
                        </label>
                        <span className="text-purple-400 font-mono">{trait.value}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={trait.value}
                        onChange={(e) => handleTraitChange(key, e.target.value)}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                      />
                      <div className="flex justify-between mt-1 text-xs text-slate-500">
                        <span>{trait.lowLabel}</span>
                        <span>{trait.highLabel}</span>
                      </div>
                      <p className="text-slate-400 text-xs mt-2">{trait.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Communication Tab */}
              {activeTab === 'communication' && (
                <div className="space-y-6">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <label className="text-white font-medium block mb-2">Tone</label>
                    <input
                      type="text"
                      value={personality.communicationStyle?.tone || ''}
                      onChange={(e) => {
                        setPersonality(prev => ({
                          ...prev,
                          communicationStyle: {
                            ...prev.communicationStyle,
                            tone: e.target.value
                          }
                        }));
                        setHasChanges(true);
                      }}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                    />
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <label className="text-white font-medium block mb-2">Response Length</label>
                    <select
                      value={personality.communicationStyle?.responseLength?.value || 'medium'}
                      onChange={(e) => {
                        setPersonality(prev => ({
                          ...prev,
                          communicationStyle: {
                            ...prev.communicationStyle,
                            responseLength: {
                              ...prev.communicationStyle?.responseLength,
                              value: e.target.value
                            }
                          }
                        }));
                        setHasChanges(true);
                      }}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                    >
                      <option value="brief">Brief</option>
                      <option value="medium">Medium</option>
                      <option value="detailed">Detailed</option>
                      <option value="comprehensive">Comprehensive</option>
                    </select>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <label className="text-white font-medium block mb-2">Greeting Style</label>
                    <select
                      value={personality.communicationStyle?.greetingStyle?.value || 'warm'}
                      onChange={(e) => {
                        setPersonality(prev => ({
                          ...prev,
                          communicationStyle: {
                            ...prev.communicationStyle,
                            greetingStyle: {
                              ...prev.communicationStyle?.greetingStyle,
                              value: e.target.value
                            }
                          }
                        }));
                        setHasChanges(true);
                      }}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                    >
                      <option value="formal">Formal</option>
                      <option value="warm">Warm</option>
                      <option value="playful">Playful</option>
                      <option value="cosmic">Cosmic</option>
                    </select>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <label className="text-white font-medium block mb-2">
                      Metaphor Usage ({personality.communicationStyle?.metaphorUsage?.value || 70}/100)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={personality.communicationStyle?.metaphorUsage?.value || 70}
                      onChange={(e) => {
                        setPersonality(prev => ({
                          ...prev,
                          communicationStyle: {
                            ...prev.communicationStyle,
                            metaphorUsage: {
                              ...prev.communicationStyle?.metaphorUsage,
                              value: parseInt(e.target.value)
                            }
                          }
                        }));
                        setHasChanges(true);
                      }}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <label className="text-white font-medium block mb-2">Signature Phrases</label>
                    <textarea
                      value={(personality.communicationStyle?.signaturePhrases || []).join('\n')}
                      onChange={(e) => {
                        setPersonality(prev => ({
                          ...prev,
                          communicationStyle: {
                            ...prev.communicationStyle,
                            signaturePhrases: e.target.value.split('\n').filter(p => p.trim())
                          }
                        }));
                        setHasChanges(true);
                      }}
                      rows={5}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white font-mono text-sm"
                      placeholder="One phrase per line..."
                    />
                  </div>
                </div>
              )}

              {/* Expertise Tab */}
              {activeTab === 'expertise' && (
                <div className="space-y-6">
                  <p className="text-slate-400 text-sm">
                    Control how much Luna emphasizes different areas of expertise.
                  </p>

                  {[
                    { key: 'baziWeight', label: 'BaZi / Chinese Astrology', icon: '☯️' },
                    { key: 'westernAstrologyWeight', label: 'Western Astrology', icon: '⭐' },
                    { key: 'numerologyWeight', label: 'Numerology', icon: '🔢' },
                    { key: 'emotionalIntelligenceWeight', label: 'Emotional Intelligence', icon: '💜' },
                    { key: 'practicalAdviceWeight', label: 'Practical Advice', icon: '🎯' },
                    { key: 'spiritualGuidanceWeight', label: 'Spiritual Guidance', icon: '✨' }
                  ].map(({ key, label, icon }) => (
                    <div key={key} className="bg-slate-800/50 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <label className="text-white font-medium">
                          {icon} {label}
                        </label>
                        <span className="text-purple-400 font-mono">
                          {personality.expertiseEmphasis?.[key] || 70}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={personality.expertiseEmphasis?.[key] || 70}
                        onChange={(e) => {
                          setPersonality(prev => ({
                            ...prev,
                            expertiseEmphasis: {
                              ...prev.expertiseEmphasis,
                              [key]: parseInt(e.target.value)
                            }
                          }));
                          setHasChanges(true);
                        }}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Advanced Tab */}
              {activeTab === 'advanced' && (
                <div className="space-y-6">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <label className="text-white font-medium block mb-2">Partner Style</label>
                    <select
                      value={personality.relationshipDynamic?.partnerStyle?.value || 'collaborative'}
                      onChange={(e) => {
                        setPersonality(prev => ({
                          ...prev,
                          relationshipDynamic: {
                            ...prev.relationshipDynamic,
                            partnerStyle: {
                              ...prev.relationshipDynamic?.partnerStyle,
                              value: e.target.value
                            }
                          }
                        }));
                        setHasChanges(true);
                      }}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                    >
                      <option value="mentor">Mentor (Teaching focus)</option>
                      <option value="collaborative">Collaborative (Equal partners)</option>
                      <option value="companion">Companion (Friendly support)</option>
                      <option value="guide">Guide (Gentle direction)</option>
                    </select>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-white font-medium">Lost Generation Persona</label>
                      <input
                        type="checkbox"
                        checked={personality.lostGenerationPersona?.enabled !== false}
                        onChange={(e) => {
                          setPersonality(prev => ({
                            ...prev,
                            lostGenerationPersona: {
                              ...prev.lostGenerationPersona,
                              enabled: e.target.checked
                            }
                          }));
                          setHasChanges(true);
                        }}
                        className="w-5 h-5 accent-purple-500"
                      />
                    </div>
                    <p className="text-slate-400 text-sm">
                      Luna references her Paris 1925 memories and Lost Generation connection.
                    </p>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <label className="text-white font-medium block mb-2">Custom Notes</label>
                    <textarea
                      value={personality.customNotes || ''}
                      onChange={(e) => {
                        setPersonality(prev => ({
                          ...prev,
                          customNotes: e.target.value
                        }));
                        setHasChanges(true);
                      }}
                      rows={4}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                      placeholder="Add any custom notes about how you want Luna to interact with you..."
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-4 border-t border-slate-700 bg-slate-800/50">
          <div className="flex gap-2">
            <button
              onClick={() => setShowExportModal(true)}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              📤 Export
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              📥 Import
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
            >
              Reset to Defaults
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="px-6 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 disabled:bg-slate-600 disabled:text-slate-400 rounded-lg transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Export Personality</h3>
            <p className="text-slate-400 text-sm mb-4">
              Choose a format to export Luna's personality configuration.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => { handleExportJSON(); setShowExportModal(false); }}
                className="w-full px-4 py-3 text-left text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                <div className="font-medium">📄 JSON Format</div>
                <div className="text-sm text-slate-400">Machine-readable, for backup/restore</div>
              </button>
              <button
                onClick={() => { handleExportMarkdown(); setShowExportModal(false); }}
                className="w-full px-4 py-3 text-left text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                <div className="font-medium">📝 Markdown Format</div>
                <div className="text-sm text-slate-400">Human-readable, for sharing/editing</div>
              </button>
            </div>
            <button
              onClick={() => setShowExportModal(false)}
              className="mt-4 w-full px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Import Personality</h3>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setImportFormat('json')}
                className={`px-4 py-2 rounded-lg text-sm ${
                  importFormat === 'json'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                JSON
              </button>
              <button
                onClick={() => setImportFormat('markdown')}
                className={`px-4 py-2 rounded-lg text-sm ${
                  importFormat === 'markdown'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                Markdown
              </button>
            </div>

            <div className="mb-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.md,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-3 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
              >
                📁 Upload File
              </button>
            </div>

            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              rows={8}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white font-mono text-sm"
              placeholder={`Paste ${importFormat.toUpperCase()} content here...`}
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => { setShowImportModal(false); setImportText(''); }}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={!importText.trim()}
                className="px-6 py-2 text-white bg-purple-600 hover:bg-purple-500 disabled:bg-slate-600 rounded-lg transition-colors"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function
function formatTraitName(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}
