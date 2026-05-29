/**
 * RitualScriptOverlay — floating narration text in Temple Mode
 *
 * Displays the current ritual narration with a fade-in/out cycle.
 * Text changes reactively as the temple state evolves.
 */

import React, { useState, useEffect, useRef } from 'react';

interface Props {
  text: string;
}

export const RitualScriptOverlay: React.FC<Props> = ({ text }) => {
  const [visible, setVisible] = useState(true);
  const prevTextRef = useRef(text);

  // Trigger re-fade when text changes
  useEffect(() => {
    if (text !== prevTextRef.current) {
      setVisible(false);
      const timer = setTimeout(() => {
        prevTextRef.current = text;
        setVisible(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [text]);

  return (
    <div
      className="ritual-script"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {text}
    </div>
  );
};
