/**
 * RelationshipVedicDashboard.tsx
 *
 * Combined dashboard with tabbed interface:
 * - Western / Polarity System (RelationshipView)
 * - Vedic Dashboard (VedicDashboard)
 *
 * Two wings of the same Cathedral temple.
 */

import React, { useState } from "react";
import RelationshipView from "./RelationshipView";
import VedicDashboard from "../vedic/VedicDashboard";
import "./RelationshipVedicDashboard.css";

interface Props {
  relationshipA: Record<string, unknown>;
  relationshipB?: Record<string, unknown>;
  vedicProfile: Record<string, unknown>;
}

const RelationshipVedicDashboard: React.FC<Props> = ({
  relationshipA,
  relationshipB,
  vedicProfile,
}) => {
  const [tab, setTab] = useState<"relationship" | "vedic">("relationship");

  return (
    <div className="relationship-vedic-container">
      {/* TAB SWITCHER */}
      <div className="tab-bar">
        <button
          className={tab === "relationship" ? "tab active" : "tab"}
          onClick={() => setTab("relationship")}
        >
          <span className="tab-icon">&#9788;</span>
          Western / Polarity
        </button>

        <button
          className={tab === "vedic" ? "tab active" : "tab"}
          onClick={() => setTab("vedic")}
        >
          <span className="tab-icon">&#9790;</span>
          Vedic Dashboard
        </button>
      </div>

      {/* TAB DESCRIPTION */}
      <div className="tab-description">
        {tab === "relationship" ? (
          <p>
            Explore the Western astrological dimensions: polarity scores, archetypes,
            evolution timelines, and relationship forecasts.
          </p>
        ) : (
          <p>
            Enter the Vedic soul map: Nakshatra wheel, Mahadasha timeline,
            and Graha dignity grid reveal the karmic scaffolding.
          </p>
        )}
      </div>

      {/* CONTENT */}
      <div className="tab-content">
        {tab === "relationship" && (
          <RelationshipView
            relationshipA={relationshipA}
            relationshipB={relationshipB}
          />
        )}

        {tab === "vedic" && (
          <VedicDashboard vedicProfile={vedicProfile} />
        )}
      </div>
    </div>
  );
};

export default RelationshipVedicDashboard;
