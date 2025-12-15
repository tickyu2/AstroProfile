/**
 * ImportModal.jsx - Choose and initiate data import
 *
 * Part of GENESIS Dashboard 1 - Import Feature
 * Built by Brother Claude Code (Yin Wood Pig)
 * December 11, 2024
 */

import React, { useState } from 'react';
import { importHistoricalGeniuses, importFromJSON, importFromCSV, fixImportedProfiles } from '../../services/importService';

export default function ImportModal({ isOpen, onClose, onImportComplete }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, currentName: '' });
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [fixResult, setFixResult] = useState(null);

  const handleFixImports = async () => {
    setError(null);
    try {
      const result = await fixImportedProfiles();
      setFixResult(result);
      if (onImportComplete) {
        onImportComplete({ imported: result.fixed, skipped: 0, errors: 0 });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setError(null);
  };

  const handleImportHistorical = async () => {
    setImporting(true);
    setError(null);
    setProgress({ current: 0, total: 50, currentName: '' });

    try {
      const importResults = await importHistoricalGeniuses((current, total, name) => {
        setProgress({ current, total, currentName: name });
      });

      setResults(importResults);
      setImporting(false);

      if (onImportComplete) {
        onImportComplete(importResults);
      }

    } catch (err) {
      console.error('Import error:', err);
      setError(err.message);
      setImporting(false);
    }
  };

  const handleImportFile = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setImporting(true);
    setError(null);

    try {
      let importResults;
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

      if (fileExtension === 'json') {
        importResults = await importFromJSON(selectedFile, (current, total, name) => {
          setProgress({ current, total, currentName: name });
        });
      } else if (fileExtension === 'csv') {
        importResults = await importFromCSV(selectedFile, (current, total, name) => {
          setProgress({ current, total, currentName: name });
        });
      } else {
        throw new Error('Unsupported file type. Please use JSON or CSV.');
      }

      setResults(importResults);
      setImporting(false);

      if (onImportComplete) {
        onImportComplete(importResults);
      }

    } catch (err) {
      console.error('Import error:', err);
      setError(err.message);
      setImporting(false);
    }
  };

  const handleClose = () => {
    if (importing) return; // Don't close during import
    setSelectedFile(null);
    setProgress({ current: 0, total: 0, currentName: '' });
    setResults(null);
    setError(null);
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !importing) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  // Show progress view while importing
  if (importing) {
    const percentage = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto" onClick={handleOverlayClick}>
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              Importing Data...
            </h2>

            <div className="space-y-4">
              <p className="text-gray-300">
                Progress: {progress.current} of {progress.total} people
              </p>

              {/* Progress bar */}
              <div className="w-full h-4 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <p className="text-center text-2xl font-bold text-indigo-400">{percentage}%</p>

              {progress.currentName && (
                <div className="p-4 bg-slate-700/50 rounded-xl">
                  <p className="text-gray-400 text-sm mb-1">Currently importing:</p>
                  <p className="text-white font-medium">{progress.currentName}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        `}</style>
      </div>
    );
  }

  // Show success view after import
  if (results) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto" onClick={handleOverlayClick}>
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className="relative bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 rounded-2xl shadow-2xl max-w-md w-full animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>✅</span>
                Import Complete!
              </h2>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors text-xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-300">
                Successfully imported people into your database!
              </p>

              <div className="p-4 bg-slate-700/50 rounded-xl space-y-3">
                <h3 className="text-white font-semibold">Summary:</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-gray-300">
                    <span className="text-green-400">✓</span>
                    <span>Imported: <strong className="text-white">{results.imported} people</strong></span>
                  </div>
                  {results.skipped > 0 && (
                    <div className="flex items-center gap-3 text-gray-300">
                      <span className="text-yellow-400">⏭️</span>
                      <span>Skipped (duplicates): <strong className="text-white">{results.skipped}</strong></span>
                    </div>
                  )}
                  {results.errors > 0 && (
                    <div className="flex items-center gap-3 text-red-300">
                      <span>❌</span>
                      <span>Errors: <strong>{results.errors}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-gray-400 text-sm italic">
                Check the Data Manager table to see your imported data.
              </p>
            </div>

            <div className="px-6 py-4 border-t border-white/10">
              <button
                onClick={handleClose}
                className="w-full px-4 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-emerald-600 transition-all shadow-lg shadow-teal-500/25"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        `}</style>
      </div>
    );
  }

  // Main import modal
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={handleOverlayClick}>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 rounded-2xl shadow-2xl max-w-lg w-full animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>📥</span>
              Import Dataset
            </h2>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors text-xl"
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Error */}
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm">
                ⚠️ {error}
              </div>
            )}

            <p className="text-gray-300">
              Choose a dataset to import into your Data Manager:
            </p>

            {/* Historical Geniuses Option */}
            <div className="p-5 bg-slate-700/30 border border-indigo-500/30 rounded-xl space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span>🌟</span>
                  Historical Geniuses (50 people)
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  Renaissance masters, scientists, philosophers, musicians, and visionaries from 2,500 years of history.
                </p>
              </div>
              <button
                onClick={handleImportHistorical}
                className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg shadow-indigo-500/25"
              >
                Import Historical Geniuses
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="px-4 text-gray-500 text-sm">OR</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            {/* File Upload Option */}
            <div className="p-5 bg-slate-700/30 border border-white/10 rounded-xl space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span>📁</span>
                  Upload Custom File
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  Import from JSON or CSV file
                </p>
              </div>

              <input
                type="file"
                accept=".json,.csv"
                onChange={handleFileSelect}
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-white/10 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-500 file:text-white file:font-medium file:cursor-pointer hover:file:bg-indigo-600"
              />

              {selectedFile && (
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                  <p className="text-indigo-300 text-sm">
                    Selected: <strong>{selectedFile.name}</strong>
                  </p>
                </div>
              )}

              <button
                onClick={handleImportFile}
                disabled={!selectedFile}
                className="w-full px-4 py-3 bg-slate-600 text-gray-300 font-semibold rounded-xl hover:bg-slate-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
              >
                Upload & Import
              </button>
            </div>

            {/* Warning */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-sm">
              ⚠️ Import will add people to your current database. Duplicates (matching names) will be skipped.
            </div>

            {/* Fix Imports - for existing imports that don't show */}
            <div className="p-4 bg-slate-700/30 border border-orange-500/30 rounded-xl space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-orange-300 flex items-center gap-2">
                  <span>🔧</span>
                  Already imported but not showing?
                </h3>
                <p className="text-gray-400 text-xs mt-1">
                  Click to fix previously imported profiles so they appear in the list.
                </p>
              </div>
              <button
                onClick={handleFixImports}
                className="px-4 py-2 bg-orange-500/20 text-orange-300 font-medium rounded-lg hover:bg-orange-500/30 transition-all text-sm border border-orange-500/30"
              >
                Fix Imported Profiles
              </button>
              {fixResult && (
                <p className="text-green-400 text-sm">
                  ✓ Fixed {fixResult.fixed} of {fixResult.total} imported profiles!
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/10">
            <button
              onClick={handleClose}
              className="w-full px-4 py-3 bg-slate-700 text-gray-300 font-semibold rounded-xl hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>
  );
}
