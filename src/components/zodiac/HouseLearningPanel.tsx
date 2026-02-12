import React, { useState, useRef, useEffect } from 'react';

// ============================================================================
// HOUSE LEARNING PANEL
// Floating, draggable educational modal about Western zodiac houses
// 50% viewport width, tabs for Intro + 12 houses
// ============================================================================

import type { HouseLearningPanelProps, TabValue } from './houseLearning/types';
import { Tab0Content, TabSignsContent, TabZonesContent, TabHouseContent } from './houseLearning/subComponents';

// Main Component
export const HouseLearningPanel: React.FC<HouseLearningPanelProps> = ({
  houseNumber,
  onClose,
  chartData
}) => {
  const [activeTab, setActiveTab] = useState<TabValue>(houseNumber === 0 ? 'intro' : houseNumber);
  const [position, setPosition] = useState({ x: 100, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  // Dragging handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setIsDragging(true);
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
    };
    const handleUp = () => setIsDragging(false);

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging, dragOffset]);

  // ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      className="fixed bg-slate-900 border-2 border-cyan-500 rounded-xl shadow-2xl"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '50vw',
        minWidth: '500px',
        maxWidth: '800px',
        maxHeight: '85vh',
        zIndex: 1000,
      }}
    >
      {/* Header - Draggable */}
      <div
        className="bg-slate-800 p-4 border-b border-cyan-500/50 flex justify-between items-center cursor-grab active:cursor-grabbing rounded-t-xl"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-3">
          <span className="text-slate-500">⋮⋮</span>
          <h2 className="text-xl font-bold text-cyan-400">Western Zodiac House Learning</h2>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-red-400 text-xl transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-slate-800/50 border-b border-slate-700 overflow-x-auto p-2 flex gap-1">
        {/* Foundation Tabs */}
        <button
          onClick={() => setActiveTab('intro')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'intro'
              ? 'bg-cyan-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Intro
        </button>
        <button
          onClick={() => setActiveTab('signs')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'signs'
              ? 'bg-purple-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Signs
        </button>
        <button
          onClick={() => setActiveTab('zones')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'zones'
              ? 'bg-amber-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Zones
        </button>
        <div className="w-px bg-slate-600 mx-1" /> {/* Divider */}
        {/* House Tabs */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
          <button
            key={n}
            onClick={() => setActiveTab(n)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === n
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            H{n}
          </button>
        ))}
      </div>

      {/* Content */}
      <div
        className="overflow-y-auto p-6 text-white"
        style={{ maxHeight: 'calc(85vh - 140px)' }}
      >
        {activeTab === 'intro' && <Tab0Content />}
        {activeTab === 'signs' && <TabSignsContent />}
        {activeTab === 'zones' && <TabZonesContent />}
        {typeof activeTab === 'number' && <TabHouseContent houseNum={activeTab} />}
      </div>

      {/* Footer */}
      <div className="bg-slate-800/50 border-t border-slate-700 p-3 text-center text-sm text-slate-400 rounded-b-xl">
        Drag header to move • Press ESC to close
      </div>
    </div>
  );
};

export default HouseLearningPanel;
