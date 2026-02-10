import React, { useState, useRef, useEffect } from 'react';

interface HouseLearningPanelProps {
  houseNumber: number;
  onClose: () => void;
}

export const HouseLearningPanel: React.FC<HouseLearningPanelProps> = ({ houseNumber, onClose }) => {
  const [activeTab, setActiveTab] = useState(houseNumber);
  const [position, setPosition] = useState({ x: 100, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      ref={panelRef}
      className="fixed bg-slate-900 border-2 border-cyan-500 rounded-lg shadow-2xl"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '50vw',
        maxHeight: '85vh',
        zIndex: 1000
      }}
    >
      {/* Header - Draggable */}
      <div
        className="bg-slate-800 p-4 border-b border-cyan-500 flex justify-between items-center cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <h2 className="text-xl font-bold text-cyan-400">Western Zodiac House Learning</h2>
        <button onClick={onClose} className="text-white hover:text-red-400">✕</button>
      </div>

      {/* Tabs */}
      <div className="bg-slate-800 border-b border-slate-700 overflow-x-auto p-2 flex gap-1">
        {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(n => (
          <button
            key={n}
            onClick={() => setActiveTab(n)}
            className={`px-4 py-2 rounded ${activeTab === n ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300'}`}
          >
            {n === 0 ? 'Intro' : `H${n}`}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="overflow-y-auto p-6 text-white" style={{maxHeight: 'calc(85vh - 140px)'}}>
        {activeTab === 0 ? <Tab0Content /> : <TabHouseContent houseNum={activeTab} />}
      </div>

      {/* Footer */}
      <div className="bg-slate-800 border-t border-slate-700 p-3 text-center text-sm text-slate-400">
        💡 Drag this panel to see the wheel behind it
      </div>
    </div>
  );
};

const Tab0Content = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-cyan-400">What Are Houses?</h1>
    <p className="text-lg">Houses are WHERE things happen in your life.</p>
    {/* Add full Tab 0 content here */}
  </div>
);

const TabHouseContent = ({ houseNum }: { houseNum: number }) => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-cyan-400">House {houseNum}</h1>
    <p>Content for House {houseNum} will go here</p>
    {/* Add house-specific content */}
  </div>
);
