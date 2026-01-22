/**
 * RelationshipPage
 *
 * Single relationship view page.
 * Route: /relationship/:id
 *
 * Displays the complete Relationship Cathedral for one relationship.
 */

import { useParams } from 'react-router-dom';
import { useRelationship } from '../hooks/useRelationship';
import RelationshipView from '../components/compatibility/RelationshipView';

export default function RelationshipPage() {
  const { id } = useParams();
  const { data, loading, error } = useRelationship(id);

  if (loading) {
    return (
      <div className="relationship-view">
        <div className="loading-container">
          <div className="loading-spinner" />
          <p className="loading-text">Loading relationship...</p>
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

  return <RelationshipView relationshipA={data} />;
}
