/**
 * RelationshipComparePage
 *
 * Side-by-side relationship comparison page.
 * Route: /relationship/:id/compare/:otherId
 *
 * Displays two relationships with diff analysis panels.
 */

import { useParams } from 'react-router-dom';
import { useRelationshipDiff } from '../hooks/useRelationshipDiff';
import RelationshipView from '../components/compatibility/RelationshipView';

export default function RelationshipComparePage() {
  const { id, otherId } = useParams();
  const { dataA, dataB, loading, error } = useRelationshipDiff(id, otherId);

  if (loading) {
    return (
      <div className="relationship-view">
        <div className="loading-container">
          <div className="loading-spinner" />
          <p className="loading-text">Loading comparison...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relationship-view">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <RelationshipView
      relationshipA={dataA}
      relationshipB={dataB}
      labelA="Relationship A"
      labelB="Relationship B"
    />
  );
}
