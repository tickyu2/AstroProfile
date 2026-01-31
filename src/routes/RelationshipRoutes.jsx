/**
 * RelationshipRoutes
 *
 * React Router configuration for relationship pages.
 *
 * Routes:
 * - /relationship/:id - Single relationship view
 * - /relationship/:id/compare/:otherId - Side-by-side comparison
 */

import { Routes, Route } from 'react-router-dom';
import RelationshipPage from '../pages/RelationshipPage';
import RelationshipComparePage from '../pages/RelationshipComparePage';

export default function RelationshipRoutes() {
  return (
    <Routes>
      <Route path="/relationship/:id" element={<RelationshipPage />} />
      <Route path="/relationship/:id/compare/:otherId" element={<RelationshipComparePage />} />
    </Routes>
  );
}
