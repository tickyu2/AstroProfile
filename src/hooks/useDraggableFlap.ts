import React, { useCallback, useEffect, useRef, useState } from 'react';

export function useDraggableFlap() {
  const [showTableFlap, setShowTableFlap] = useState(false);
  const [flapPosition, setFlapPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const flapRef = useRef<HTMLDivElement>(null);

  const handleFlapDragStart = useCallback((e: React.MouseEvent) => {
    if (flapRef.current) {
      const rect = flapRef.current.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      setIsDragging(true);
    }
  }, []);

  const handleFlapDrag = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setFlapPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    }
  }, [isDragging]);

  const handleFlapDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleCloseTableFlap = useCallback(() => {
    setShowTableFlap(false);
    setFlapPosition({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleFlapDrag);
      window.addEventListener('mouseup', handleFlapDragEnd);
      return () => {
        window.removeEventListener('mousemove', handleFlapDrag);
        window.removeEventListener('mouseup', handleFlapDragEnd);
      };
    }
  }, [isDragging, handleFlapDrag, handleFlapDragEnd]);

  return {
    showTableFlap,
    setShowTableFlap,
    flapPosition,
    isDragging,
    flapRef,
    handleFlapDragStart,
    handleCloseTableFlap,
  };
}
