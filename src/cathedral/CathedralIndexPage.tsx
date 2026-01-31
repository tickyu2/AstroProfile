/**
 * ============================================================================
 * CATHEDRAL INDEX PAGE COMPONENT (大教堂索引页)
 * ============================================================================
 *
 * The main navigation interface for the Genesis Soul cathedral. This component
 * renders a complete, navigable library shelf of all metaphysical modules.
 *
 * Features:
 * - Collapsible wing navigation
 * - Search and filter functionality
 * - Module status indicators
 * - Responsive layout
 * - Keyboard navigation
 *
 * Created: January 2026
 * ============================================================================
 */

import * as React from 'react';
import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type {
  CathedralWing,
  CathedralSection,
  CathedralItem,
  WingId,
  ModuleStatus,
  CathedralStats
} from './indexTypes';
import { WING_CONFIGS, STATUS_DISPLAY, TYPE_DISPLAY } from './indexTypes';
import { buildCoupleIndex, computeCathedralStats } from './indexData';

// ============================================================================
// STYLES
// ============================================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#f8fafc'
  },
  sidebar: {
    width: '280px',
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
    padding: '24px 16px',
    overflowY: 'auto',
    position: 'sticky',
    top: 0,
    height: '100vh'
  },
  sidebarTitle: {
    fontSize: '20px',
    fontWeight: 700,
    marginBottom: '8px',
    color: '#f1f5f9'
  },
  sidebarSubtitle: {
    fontSize: '14px',
    color: '#94a3b8',
    marginBottom: '24px'
  },
  wingNav: {
    marginBottom: '8px'
  },
  wingButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    color: '#e2e8f0',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    textAlign: 'left' as const,
    transition: 'background-color 0.15s'
  },
  wingButtonActive: {
    backgroundColor: '#334155'
  },
  wingIcon: {
    fontSize: '16px'
  },
  sectionList: {
    marginLeft: '24px',
    marginTop: '4px'
  },
  sectionLink: {
    display: 'block',
    padding: '6px 12px',
    color: '#94a3b8',
    fontSize: '13px',
    textDecoration: 'none',
    borderRadius: '4px',
    transition: 'color 0.15s'
  },
  main: {
    flex: 1,
    padding: '32px 48px'
  },
  header: {
    marginBottom: '32px'
  },
  title: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748b'
  },
  searchBar: {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px'
  },
  searchInput: {
    flex: 1,
    padding: '12px 16px',
    fontSize: '15px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    outline: 'none'
  },
  filterButton: {
    padding: '12px 20px',
    backgroundColor: '#f1f5f9',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer'
  },
  statsBar: {
    display: 'flex',
    gap: '16px',
    marginBottom: '32px',
    flexWrap: 'wrap' as const
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: '16px 24px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    minWidth: '140px'
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#1e293b'
  },
  statLabel: {
    fontSize: '13px',
    color: '#64748b',
    marginTop: '4px'
  },
  wingSection: {
    marginBottom: '48px'
  },
  wingHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px'
  },
  wingTitle: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#1e293b'
  },
  wingTitleChinese: {
    fontSize: '18px',
    color: '#64748b',
    fontWeight: 400
  },
  wingDescription: {
    fontSize: '14px',
    color: '#64748b',
    marginTop: '4px'
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '24px',
    marginBottom: '16px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#334155',
    marginBottom: '4px'
  },
  sectionTitleChinese: {
    fontSize: '14px',
    color: '#94a3b8',
    marginLeft: '8px',
    fontWeight: 400
  },
  sectionDescription: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '16px'
  },
  itemsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '12px'
  },
  itemCard: {
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    textDecoration: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s'
  },
  itemHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '8px'
  },
  itemTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#1e293b'
  },
  itemTitleChinese: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '2px'
  },
  itemStatus: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 500
  },
  itemDescription: {
    fontSize: '13px',
    color: '#64748b',
    lineHeight: 1.5
  },
  itemMeta: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
    flexWrap: 'wrap' as const
  },
  itemTag: {
    padding: '2px 8px',
    backgroundColor: '#e2e8f0',
    borderRadius: '4px',
    fontSize: '11px',
    color: '#475569'
  }
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface StatusBadgeProps {
  status: ModuleStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = STATUS_DISPLAY[status];
  return (
    <span
      style={{
        ...styles.itemStatus,
        backgroundColor: `${config.color}20`,
        color: config.color
      }}
    >
      {config.icon} {config.label}
    </span>
  );
};

interface ItemCardProps {
  item: CathedralItem;
  wingColor: string;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, wingColor }) => {
  const typeConfig = TYPE_DISPLAY[item.type];

  return (
    <Link
      to={item.route || '#'}
      style={{
        ...styles.itemCard,
        borderLeftColor: wingColor,
        borderLeftWidth: '3px'
      }}
    >
      <div style={styles.itemHeader}>
        <div>
          <div style={styles.itemTitle}>
            {typeConfig.icon} {item.label}
          </div>
          <div style={styles.itemTitleChinese}>{item.labelChinese}</div>
        </div>
        <StatusBadge status={item.status} />
      </div>
      <div style={styles.itemDescription}>{item.description}</div>
      {item.tags && item.tags.length > 0 && (
        <div style={styles.itemMeta}>
          {item.tags.slice(0, 4).map(tag => (
            <span key={tag} style={styles.itemTag}>{tag}</span>
          ))}
        </div>
      )}
    </Link>
  );
};

interface SectionCardProps {
  section: CathedralSection;
  wingColor: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ section, wingColor }) => {
  return (
    <div style={styles.sectionCard}>
      <div>
        <span style={styles.sectionTitle}>{section.label}</span>
        <span style={styles.sectionTitleChinese}>{section.labelChinese}</span>
      </div>
      <div style={styles.sectionDescription}>{section.description}</div>
      <div style={styles.itemsGrid}>
        {section.items.map(item => (
          <ItemCard key={item.id} item={item} wingColor={wingColor} />
        ))}
      </div>
    </div>
  );
};

interface WingSectionProps {
  wing: CathedralWing;
}

const WingSection: React.FC<WingSectionProps> = ({ wing }) => {
  const config = WING_CONFIGS[wing.id];

  return (
    <section id={wing.id} style={styles.wingSection}>
      <div style={styles.wingHeader}>
        <span style={{ fontSize: '28px' }}>{config.icon}</span>
        <div>
          <div style={styles.wingTitle}>
            {wing.label}
            <span style={styles.wingTitleChinese}> ({wing.labelChinese})</span>
          </div>
          <div style={styles.wingDescription}>{wing.description}</div>
        </div>
      </div>
      {wing.sections.map(section => (
        <SectionCard key={section.id} section={section} wingColor={wing.color} />
      ))}
    </section>
  );
};

interface StatsBarProps {
  stats: CathedralStats;
}

const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  return (
    <div style={styles.statsBar}>
      <div style={styles.statCard}>
        <div style={styles.statValue}>{stats.totalItems}</div>
        <div style={styles.statLabel}>Total Modules</div>
      </div>
      <div style={styles.statCard}>
        <div style={{ ...styles.statValue, color: '#22c55e' }}>
          {stats.byStatus.complete}
        </div>
        <div style={styles.statLabel}>Complete</div>
      </div>
      <div style={styles.statCard}>
        <div style={{ ...styles.statValue, color: '#3b82f6' }}>
          {stats.byStatus.implemented}
        </div>
        <div style={styles.statLabel}>Implemented</div>
      </div>
      <div style={styles.statCard}>
        <div style={{ ...styles.statValue, color: '#8b5cf6' }}>
          {stats.byStatus.planned}
        </div>
        <div style={styles.statLabel}>Planned</div>
      </div>
      <div style={styles.statCard}>
        <div style={{ ...styles.statValue, color: '#6366f1' }}>
          {stats.overallCompletion}%
        </div>
        <div style={styles.statLabel}>Completion</div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface CathedralIndexPageProps {
  subjectId: string;
  subjectLabel: string;
  partnerAName?: string;
  partnerABirthDate?: string;
  partnerBName?: string;
  partnerBBirthDate?: string;
}

export const CathedralIndexPage: React.FC<CathedralIndexPageProps> = ({
  subjectId,
  subjectLabel,
  partnerAName = 'Partner A',
  partnerABirthDate = '1900-01-01',
  partnerBName = 'Partner B',
  partnerBBirthDate = '1900-01-01'
}) => {
  const [expandedWings, setExpandedWings] = useState<WingId[]>(['coreIdentity']);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeWing, setActiveWing] = useState<WingId | null>(null);

  // Build the index
  const index = useMemo(
    () => buildCoupleIndex(subjectId, partnerAName, partnerABirthDate, partnerBName, partnerBBirthDate),
    [subjectId, partnerAName, partnerABirthDate, partnerBName, partnerBBirthDate]
  );

  // Compute stats
  const stats = useMemo(() => computeCathedralStats(index.wings), [index.wings]);

  // Filter items by search
  const filteredWings = useMemo(() => {
    if (!searchQuery.trim()) return index.wings;

    const query = searchQuery.toLowerCase();

    return index.wings.map(wing => ({
      ...wing,
      sections: wing.sections.map(section => ({
        ...section,
        items: section.items.filter(item => {
          const searchable = [
            item.label,
            item.labelChinese,
            item.description,
            ...(item.tags || [])
          ].join(' ').toLowerCase();
          return searchable.includes(query);
        })
      })).filter(section => section.items.length > 0)
    })).filter(wing => wing.sections.length > 0);
  }, [index.wings, searchQuery]);

  // Toggle wing expansion
  const toggleWing = useCallback((wingId: WingId) => {
    setExpandedWings(prev =>
      prev.includes(wingId)
        ? prev.filter(id => id !== wingId)
        : [...prev, wingId]
    );
  }, []);

  // Scroll to wing
  const scrollToWing = useCallback((wingId: WingId) => {
    setActiveWing(wingId);
    const element = document.getElementById(wingId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div style={styles.container}>
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarTitle}>Cathedral Index</div>
        <div style={styles.sidebarSubtitle}>{subjectLabel}</div>

        <nav>
          {index.wings.map(wing => {
            const config = WING_CONFIGS[wing.id];
            const isExpanded = expandedWings.includes(wing.id);

            return (
              <div key={wing.id} style={styles.wingNav}>
                <button
                  style={{
                    ...styles.wingButton,
                    ...(activeWing === wing.id ? styles.wingButtonActive : {})
                  }}
                  onClick={() => {
                    toggleWing(wing.id);
                    scrollToWing(wing.id);
                  }}
                >
                  <span style={styles.wingIcon}>{config.icon}</span>
                  <span style={{ flex: 1 }}>{wing.label}</span>
                  <span>{isExpanded ? '▼' : '▶'}</span>
                </button>

                {isExpanded && (
                  <div style={styles.sectionList}>
                    {wing.sections.map(section => (
                      <a
                        key={section.id}
                        href={`#${wing.id}-${section.id}`}
                        style={styles.sectionLink}
                      >
                        {section.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <header style={styles.header}>
          <h1 style={styles.title}>
            Genesis Soul Cathedral
          </h1>
          <p style={styles.subtitle}>
            Complete metaphysics library for {subjectLabel}
          </p>
        </header>

        {/* Search Bar */}
        <div style={styles.searchBar}>
          <input
            type="text"
            placeholder="Search modules, engines, charts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          <button style={styles.filterButton}>
            Filters
          </button>
        </div>

        {/* Stats Bar */}
        <StatsBar stats={stats} />

        {/* Wing Sections */}
        {filteredWings.map(wing => (
          <WingSection key={wing.id} wing={wing} />
        ))}

        {/* Empty State */}
        {filteredWings.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
            <p style={{ fontSize: '18px' }}>No modules found matching "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              style={{
                marginTop: '16px',
                padding: '8px 16px',
                backgroundColor: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Clear Search
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default CathedralIndexPage;
