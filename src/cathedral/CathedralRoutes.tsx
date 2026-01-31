/**
 * ============================================================================
 * CATHEDRAL ROUTES & NAVIGATION (大教堂路由系统)
 * ============================================================================
 *
 * The multi-page navigation system for the Genesis Soul Cathedral.
 * This module provides:
 *
 * 1. Route definitions for all cathedral pages
 * 2. Navigation context and hooks
 * 3. Breadcrumb generation
 * 4. Page wrapper components
 *
 * Route Structure:
 * /cathedral/:subjectId                     - Main index
 * /cathedral/:subjectId/:wingId             - Wing overview
 * /cathedral/:subjectId/:wingId/:sectionId  - Section overview
 * /cathedral/:subjectId/:wingId/:sectionId/:itemId - Item detail
 *
 * Created: January 2026
 * ============================================================================
 */

import * as React from 'react';
import { createContext, useContext, useMemo } from 'react';
import { Routes, Route, useParams, useNavigate, Link } from 'react-router-dom';
import type {
  CathedralIndex,
  CathedralWing,
  CathedralSection,
  CathedralItem,
  WingId,
  Breadcrumb
} from './indexTypes';
import { WING_CONFIGS } from './indexTypes';
import { buildCoupleIndex } from './indexData';
import { CathedralIndexPage } from './CathedralIndexPage';

// ============================================================================
// CONTEXT
// ============================================================================

interface CathedralContextValue {
  index: CathedralIndex | null;
  currentWing: CathedralWing | null;
  currentSection: CathedralSection | null;
  currentItem: CathedralItem | null;
  breadcrumbs: Breadcrumb[];
  navigateToWing: (wingId: WingId) => void;
  navigateToSection: (wingId: WingId, sectionId: string) => void;
  navigateToItem: (wingId: WingId, sectionId: string, itemId: string) => void;
}

const CathedralContext = createContext<CathedralContextValue>({
  index: null,
  currentWing: null,
  currentSection: null,
  currentItem: null,
  breadcrumbs: [],
  navigateToWing: () => {},
  navigateToSection: () => {},
  navigateToItem: () => {}
});

/**
 * Hook to access cathedral navigation context
 */
export function useCathedral(): CathedralContextValue {
  return useContext(CathedralContext);
}

// ============================================================================
// PROVIDER
// ============================================================================

interface CathedralProviderProps {
  subjectId: string;
  subjectLabel: string;
  partnerAName?: string;
  partnerABirthDate?: string;
  partnerBName?: string;
  partnerBBirthDate?: string;
  children: React.ReactNode;
}

export const CathedralProvider: React.FC<CathedralProviderProps> = ({
  subjectId,
  subjectLabel,
  partnerAName = 'Partner A',
  partnerABirthDate = '1900-01-01',
  partnerBName = 'Partner B',
  partnerBBirthDate = '1900-01-01',
  children
}) => {
  const navigate = useNavigate();
  const params = useParams<{
    wingId?: string;
    sectionId?: string;
    itemId?: string;
  }>();

  // Build index
  const index = useMemo(
    () => buildCoupleIndex(subjectId, partnerAName, partnerABirthDate, partnerBName, partnerBBirthDate),
    [subjectId, partnerAName, partnerABirthDate, partnerBName, partnerBBirthDate]
  );

  // Current wing
  const currentWing = useMemo(() => {
    if (!params.wingId) return null;
    return index.wings.find(w => w.id === params.wingId) || null;
  }, [index.wings, params.wingId]);

  // Current section
  const currentSection = useMemo(() => {
    if (!currentWing || !params.sectionId) return null;
    return currentWing.sections.find(s => s.id === params.sectionId) || null;
  }, [currentWing, params.sectionId]);

  // Current item
  const currentItem = useMemo(() => {
    if (!currentSection || !params.itemId) return null;
    return currentSection.items.find(i => i.id === params.itemId) || null;
  }, [currentSection, params.itemId]);

  // Breadcrumbs
  const breadcrumbs = useMemo(() => {
    const crumbs: Breadcrumb[] = [
      { label: 'Cathedral', labelChinese: '大教堂', route: `/cathedral/${subjectId}` }
    ];

    if (currentWing) {
      crumbs.push({
        label: currentWing.label,
        labelChinese: currentWing.labelChinese,
        route: `/cathedral/${subjectId}/${currentWing.id}`
      });
    }

    if (currentSection) {
      crumbs.push({
        label: currentSection.label,
        labelChinese: currentSection.labelChinese,
        route: `/cathedral/${subjectId}/${currentWing?.id}/${currentSection.id}`
      });
    }

    if (currentItem) {
      crumbs.push({
        label: currentItem.label,
        labelChinese: currentItem.labelChinese,
        route: `/cathedral/${subjectId}/${currentWing?.id}/${currentSection?.id}/${currentItem.id}`
      });
    }

    return crumbs;
  }, [subjectId, currentWing, currentSection, currentItem]);

  // Navigation helpers
  const navigateToWing = (wingId: WingId) => {
    navigate(`/cathedral/${subjectId}/${wingId}`);
  };

  const navigateToSection = (wingId: WingId, sectionId: string) => {
    navigate(`/cathedral/${subjectId}/${wingId}/${sectionId}`);
  };

  const navigateToItem = (wingId: WingId, sectionId: string, itemId: string) => {
    navigate(`/cathedral/${subjectId}/${wingId}/${sectionId}/${itemId}`);
  };

  const value: CathedralContextValue = {
    index,
    currentWing,
    currentSection,
    currentItem,
    breadcrumbs,
    navigateToWing,
    navigateToSection,
    navigateToItem
  };

  return (
    <CathedralContext.Provider value={value}>
      {children}
    </CathedralContext.Provider>
  );
};

// ============================================================================
// BREADCRUMB COMPONENT
// ============================================================================

const styles = {
  breadcrumbs: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '16px 0',
    fontSize: '14px',
    color: '#64748b'
  } as React.CSSProperties,
  breadcrumbLink: {
    color: '#6366f1',
    textDecoration: 'none'
  } as React.CSSProperties,
  breadcrumbSeparator: {
    color: '#cbd5e1'
  } as React.CSSProperties,
  breadcrumbCurrent: {
    color: '#1e293b',
    fontWeight: 500
  } as React.CSSProperties
};

export const CathedralBreadcrumbs: React.FC = () => {
  const { breadcrumbs } = useCathedral();

  return (
    <nav style={styles.breadcrumbs}>
      {breadcrumbs.map((crumb, i) => (
        <React.Fragment key={crumb.route}>
          {i > 0 && <span style={styles.breadcrumbSeparator}>›</span>}
          {i === breadcrumbs.length - 1 ? (
            <span style={styles.breadcrumbCurrent}>
              {crumb.label}
            </span>
          ) : (
            <Link to={crumb.route} style={styles.breadcrumbLink}>
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// ============================================================================
// PAGE WRAPPER
// ============================================================================

interface CathedralPageWrapperProps {
  children: React.ReactNode;
}

export const CathedralPageWrapper: React.FC<CathedralPageWrapperProps> = ({ children }) => {
  return (
    <div style={{ padding: '0 24px' }}>
      <CathedralBreadcrumbs />
      {children}
    </div>
  );
};

// ============================================================================
// PAGE COMPONENTS
// ============================================================================

/**
 * Wing overview page
 */
export const WingOverviewPage: React.FC = () => {
  const { currentWing, index } = useCathedral();

  if (!currentWing) {
    return <div>Wing not found</div>;
  }

  const config = WING_CONFIGS[currentWing.id];
  const itemCount = currentWing.sections.reduce((sum, s) => sum + s.items.length, 0);

  return (
    <CathedralPageWrapper>
      <div style={{ padding: '24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <span style={{ fontSize: '48px' }}>{config.icon}</span>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, margin: 0 }}>
              {currentWing.label}
            </h1>
            <p style={{ fontSize: '18px', color: '#64748b', margin: '4px 0 0' }}>
              {currentWing.labelChinese}
            </p>
          </div>
        </div>

        <p style={{ fontSize: '16px', color: '#475569', maxWidth: '800px', lineHeight: 1.6 }}>
          {currentWing.description}
        </p>

        <div style={{ marginTop: '16px', color: '#64748b' }}>
          {currentWing.sections.length} sections • {itemCount} modules
        </div>

        <div style={{ marginTop: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>Sections</h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {currentWing.sections.map(section => (
              <Link
                key={section.id}
                to={`/cathedral/${index?.subject.id}/${currentWing.id}/${section.id}`}
                style={{
                  display: 'block',
                  padding: '24px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  borderLeftWidth: '4px',
                  borderLeftColor: config.color
                }}
              >
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                  {section.label}
                </h3>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0' }}>
                  {section.labelChinese}
                </p>
                <p style={{ fontSize: '14px', color: '#475569', margin: '12px 0 0' }}>
                  {section.description}
                </p>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: '12px 0 0' }}>
                  {section.items.length} modules
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </CathedralPageWrapper>
  );
};

/**
 * Section overview page
 */
export const SectionOverviewPage: React.FC = () => {
  const { currentWing, currentSection, index } = useCathedral();

  if (!currentWing || !currentSection) {
    return <div>Section not found</div>;
  }

  const config = WING_CONFIGS[currentWing.id];

  return (
    <CathedralPageWrapper>
      <div style={{ padding: '24px 0' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0 }}>
            {currentSection.label}
          </h1>
          <p style={{ fontSize: '16px', color: '#64748b', margin: '4px 0 0' }}>
            {currentSection.labelChinese}
          </p>
        </div>

        <p style={{ fontSize: '15px', color: '#475569', maxWidth: '800px', lineHeight: 1.6 }}>
          {currentSection.description}
        </p>

        <div style={{ marginTop: '48px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>Modules</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {currentSection.items.map(item => (
              <Link
                key={item.id}
                to={`/cathedral/${index?.subject.id}/${currentWing.id}/${currentSection.id}/${item.id}`}
                style={{
                  display: 'block',
                  padding: '20px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  borderLeftWidth: '3px',
                  borderLeftColor: config.color
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                      {item.label}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0' }}>
                      {item.labelChinese}
                    </p>
                  </div>
                  <span style={{
                    padding: '2px 8px',
                    backgroundColor: item.status === 'complete' ? '#dcfce7' : '#f1f5f9',
                    color: item.status === 'complete' ? '#166534' : '#475569',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 500
                  }}>
                    {item.status}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#475569', margin: '12px 0 0', lineHeight: 1.5 }}>
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </CathedralPageWrapper>
  );
};

/**
 * Item detail page
 */
export const ItemDetailPage: React.FC = () => {
  const { currentWing, currentSection, currentItem } = useCathedral();

  if (!currentWing || !currentSection || !currentItem) {
    return <div>Item not found</div>;
  }

  const config = WING_CONFIGS[currentWing.id];

  return (
    <CathedralPageWrapper>
      <div style={{ padding: '24px 0', maxWidth: '800px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '24px' }}>{config.icon}</span>
            <span style={{
              padding: '2px 10px',
              backgroundColor: currentItem.status === 'complete' ? '#dcfce7' : '#f1f5f9',
              color: currentItem.status === 'complete' ? '#166534' : '#475569',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 500
            }}>
              {currentItem.status}
            </span>
            <span style={{
              padding: '2px 10px',
              backgroundColor: '#f1f5f9',
              color: '#475569',
              borderRadius: '12px',
              fontSize: '12px'
            }}>
              {currentItem.type}
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0 }}>
            {currentItem.label}
          </h1>
          <p style={{ fontSize: '18px', color: '#64748b', margin: '4px 0 0' }}>
            {currentItem.labelChinese}
          </p>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
            Description
          </h2>
          <p style={{ fontSize: '15px', color: '#1e293b', lineHeight: 1.7 }}>
            {currentItem.description}
          </p>
        </div>

        {currentItem.sourceFile && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
              Source File
            </h2>
            <code style={{
              display: 'inline-block',
              padding: '8px 12px',
              backgroundColor: '#f1f5f9',
              borderRadius: '6px',
              fontSize: '14px',
              color: '#1e293b'
            }}>
              {currentItem.sourceFile}
            </code>
          </div>
        )}

        {currentItem.exports && currentItem.exports.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
              Exports
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {currentItem.exports.map(exp => (
                <code key={exp} style={{
                  padding: '4px 10px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '4px',
                  fontSize: '13px',
                  color: '#6366f1'
                }}>
                  {exp}
                </code>
              ))}
            </div>
          </div>
        )}

        {currentItem.tags && currentItem.tags.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
              Tags
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {currentItem.tags.map(tag => (
                <span key={tag} style={{
                  padding: '4px 10px',
                  backgroundColor: '#e2e8f0',
                  borderRadius: '4px',
                  fontSize: '13px',
                  color: '#475569'
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{
          marginTop: '48px',
          padding: '24px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', margin: 0 }}>
            Part of
          </h3>
          <p style={{ fontSize: '15px', color: '#1e293b', margin: '8px 0 0' }}>
            {currentWing.label} → {currentSection.label}
          </p>
        </div>
      </div>
    </CathedralPageWrapper>
  );
};

// ============================================================================
// ROUTES COMPONENT
// ============================================================================

interface CathedralRoutesProps {
  subjectId: string;
  subjectLabel: string;
  partnerAName?: string;
  partnerABirthDate?: string;
  partnerBName?: string;
  partnerBBirthDate?: string;
}

export const CathedralRoutes: React.FC<CathedralRoutesProps> = (props) => {
  return (
    <CathedralProvider {...props}>
      <Routes>
        <Route
          index
          element={
            <CathedralIndexPage
              subjectId={props.subjectId}
              subjectLabel={props.subjectLabel}
              partnerAName={props.partnerAName}
              partnerABirthDate={props.partnerABirthDate}
              partnerBName={props.partnerBName}
              partnerBBirthDate={props.partnerBBirthDate}
            />
          }
        />
        <Route path=":wingId" element={<WingOverviewPage />} />
        <Route path=":wingId/:sectionId" element={<SectionOverviewPage />} />
        <Route path=":wingId/:sectionId/:itemId" element={<ItemDetailPage />} />
      </Routes>
    </CathedralProvider>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default CathedralRoutes;
