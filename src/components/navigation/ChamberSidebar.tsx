/**
 * ChamberSidebar.tsx
 *
 * Left-side navigation that jumps to each "chamber" in the Cathedral view.
 * Provides smooth scroll navigation to different sections.
 */

import React, { useState, useEffect } from "react";
import "./ChamberSidebar.css";

interface Chamber {
  id: string;
  label: string;
  icon?: string;
}

const chambers: Chamber[] = [
  { id: "polarity-score", label: "Polarity Score", icon: "◉" },
  { id: "archetype", label: "Polarity Archetype", icon: "✦" },
  { id: "evolution", label: "Evolution Timeline", icon: "↗" },
  { id: "forecast", label: "Forecast Timeline", icon: "☆" },
  { id: "yin-yang", label: "Yin/Yang Heatmap", icon: "☯" },
  { id: "diff", label: "Archetype Diffs", icon: "⟷" },
  { id: "vedic-nakshatra", label: "Nakshatra Wheel", icon: "☾" },
  { id: "vedic-dasha", label: "Dasha Timeline", icon: "⌛" },
  { id: "vedic-grahas", label: "Graha Grid", icon: "⚙" },
  { id: "support", label: "Support", icon: "+" },
  { id: "challenges", label: "Challenges", icon: "!" },
];

interface ChamberSidebarProps {
  visibleChambers?: string[];
}

const ChamberSidebar: React.FC<ChamberSidebarProps> = ({ visibleChambers }) => {
  const [activeId, setActiveId] = useState<string>("");

  // Filter chambers if visibleChambers is provided
  const displayChambers = visibleChambers
    ? chambers.filter(c => visibleChambers.includes(c.id))
    : chambers;

  // Scroll to chamber
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  // Track scroll position to highlight active chamber
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;

      for (const chamber of displayChambers) {
        const el = document.getElementById(chamber.id);
        if (el) {
          const { offsetTop, offsetHeight } = el;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveId(chamber.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [displayChambers]);

  return (
    <nav className="chamber-sidebar">
      <div className="sidebar-header">
        <h3>Chambers</h3>
        <p className="sidebar-subtitle">Navigate the Cathedral</p>
      </div>

      <ul className="chamber-list">
        {displayChambers.map((chamber) => (
          <li key={chamber.id}>
            <button
              className={activeId === chamber.id ? "active" : ""}
              onClick={() => scrollTo(chamber.id)}
            >
              <span className="chamber-icon">{chamber.icon}</span>
              <span className="chamber-label">{chamber.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <button
          className="scroll-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑ Back to Top
        </button>
      </div>
    </nav>
  );
};

export default ChamberSidebar;
