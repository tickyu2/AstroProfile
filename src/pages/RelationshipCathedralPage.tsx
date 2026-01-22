/**
 * RelationshipCathedralPage.tsx
 *
 * The complete Cathedral experience:
 * - Chamber Sidebar navigation (left)
 * - RelationshipVedicDashboard (main content)
 * - Pilgrim Journey selector (floating)
 *
 * This is the main entry point for the full relationship analysis experience.
 */

import React from "react";
import { useParams } from "react-router-dom";
import ChamberSidebar from "../components/navigation/ChamberSidebar";
import RelationshipVedicDashboard from "../components/compatibility/RelationshipVedicDashboard";
import PilgrimJourneySelector from "../components/pilgrim/PilgrimJourneySelector";
import { useRelationship } from "../hooks/useRelationship";
import "./RelationshipCathedralPage.css";

const RelationshipCathedralPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useRelationship(id || "");

  if (loading) {
    return (
      <div className="cathedral-loading">
        <div className="loading-spinner" />
        <p>Opening the Cathedral gates...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="cathedral-error">
        <h2>Unable to Enter</h2>
        <p>{error || "Relationship data not found"}</p>
      </div>
    );
  }

  // Extract data for each component
  const relationshipA = {
    personA: data.personA,
    personB: data.personB,
    polarityScore: data.polarityScore?.score || 0,
    archetype: data.archetype || { name: "Unknown", description: "" },
    evolutionTimeline: data.evolutionTimeline || [],
    forecastTimeline: data.forecastTimeline || [],
    support: data.support || [],
    challenges: data.challenges || [],
    yinYangPolarity: data.yinYangPolarity,
  };

  const vedicProfile = data.vedicProfile || {
    lagna: { sign: "Unknown", nakshatra: "Unknown", pada: 1, lord: "Unknown" },
    moon: { sign: "Unknown", nakshatra: "Unknown", pada: 1, lord: "Unknown" },
    grahas: [],
    dashas: {
      current: { planet: "Unknown", start: "", end: "" },
      mahadashas: [],
    },
  };

  return (
    <div className="cathedral-page">
      {/* Sidebar Navigation */}
      <aside className="cathedral-sidebar">
        <ChamberSidebar />
      </aside>

      {/* Main Content */}
      <main className="cathedral-main">
        <RelationshipVedicDashboard
          relationshipA={relationshipA}
          vedicProfile={vedicProfile}
        />
      </main>

      {/* Pilgrim Journey Selector */}
      <PilgrimJourneySelector />
    </div>
  );
};

export default RelationshipCathedralPage;
