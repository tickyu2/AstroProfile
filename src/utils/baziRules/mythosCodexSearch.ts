/**
 * ============================================
 * MYTHOS CODEX SEARCH ENGINE
 * Search archetypes, themes, shadows, gifts,
 * and lineage evidence
 *
 * Features:
 * - Full-text search across all fields
 * - Field-specific filtering
 * - Relevance scoring
 * - Fuzzy matching
 * - Highlight matched terms
 * ============================================
 */

import { MythosCodexPage, MythosCodex } from './mythosCodex';
import { AncestralArchetype } from './mythosLayer';

// ==================== DATA MODEL ====================

export interface CodexSearchResult {
  page: MythosCodexPage;
  score: number;
  matchedFields: string[];
  highlights: Record<string, string>;
}

export interface SearchQuery {
  text: string;
  fields?: ('name' | 'themes' | 'shadow' | 'gifts' | 'evidence' | 'scripture')[];
  fuzzy?: boolean;
  maxResults?: number;
}

export interface SearchIndex {
  pages: MythosCodexPage[];
  tokens: Map<string, Set<string>>; // token -> page IDs
}

// ==================== SEARCH ENGINE ====================

/**
 * Create a search index for fast querying
 */
export function createSearchIndex(codex: MythosCodex): SearchIndex {
  const tokens = new Map<string, Set<string>>();

  codex.pages.forEach(page => {
    const allText = [
      page.name,
      page.nameZh,
      ...page.themes,
      ...page.shadow,
      ...page.gifts,
      ...page.lineageEvidence,
      page.personaVoice,
      page.scripture.openingVerse,
      page.scripture.mythicStory,
      page.scripture.wisdomTeaching
    ].join(' ').toLowerCase();

    // Tokenize
    const pageTokens = allText.split(/\s+/).filter(t => t.length > 1);

    pageTokens.forEach(token => {
      if (!tokens.has(token)) {
        tokens.set(token, new Set());
      }
      tokens.get(token)!.add(page.archetypeId);
    });
  });

  return { pages: codex.pages, tokens };
}

/**
 * Search the Mythos Codex
 */
export function searchMythosCodex(
  pages: MythosCodexPage[],
  query: string,
  options: Partial<SearchQuery> = {}
): CodexSearchResult[] {
  const {
    fields = ['name', 'themes', 'shadow', 'gifts', 'evidence'],
    fuzzy = false,
    maxResults = 20
  } = options;

  const q = query.toLowerCase().trim();
  if (!q) return [];

  const results: CodexSearchResult[] = [];

  pages.forEach(page => {
    const fieldValues: Record<string, string> = {
      name: `${page.name} ${page.nameZh || ''}`.toLowerCase(),
      themes: page.themes.join(' ').toLowerCase(),
      shadow: page.shadow.join(' ').toLowerCase(),
      gifts: page.gifts.join(' ').toLowerCase(),
      evidence: page.lineageEvidence.join(' ').toLowerCase(),
      scripture: `${page.scripture.openingVerse} ${page.scripture.mythicStory} ${page.scripture.wisdomTeaching}`.toLowerCase()
    };

    const matchedFields: string[] = [];
    const highlights: Record<string, string> = {};
    let score = 0;

    fields.forEach(field => {
      const value = fieldValues[field] || '';
      const match = fuzzy ? fuzzyMatch(value, q) : value.includes(q);

      if (match) {
        matchedFields.push(field);
        score += getFieldWeight(field);

        // Create highlight
        highlights[field] = highlightMatch(
          field === 'name' ? page.name : value,
          q
        );
      }
    });

    // Boost exact matches
    if (page.name.toLowerCase() === q || (page.nameZh && page.nameZh.toLowerCase() === q)) {
      score += 10;
    }

    if (score > 0) {
      results.push({
        page,
        score,
        matchedFields,
        highlights
      });
    }
  });

  // Sort by score (highest first)
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, maxResults);
}

/**
 * Search archetypes directly (without codex pages)
 */
export function searchArchetypes(
  archetypes: AncestralArchetype[],
  query: string
): AncestralArchetype[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return archetypes.filter(arch => {
    const searchText = [
      arch.name,
      arch.nameZh,
      ...arch.themes,
      ...arch.shadow,
      ...arch.gifts
    ].join(' ').toLowerCase();

    return searchText.includes(q);
  });
}

/**
 * Search by specific field
 */
export function searchByField(
  pages: MythosCodexPage[],
  field: 'themes' | 'shadow' | 'gifts' | 'evidence',
  query: string
): MythosCodexPage[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return pages.filter(page => {
    let values: string[];
    switch (field) {
      case 'themes': values = page.themes; break;
      case 'shadow': values = page.shadow; break;
      case 'gifts': values = page.gifts; break;
      case 'evidence': values = page.lineageEvidence; break;
      default: return false;
    }
    return values.some(v => v.toLowerCase().includes(q));
  });
}

/**
 * Search by multiple themes (AND logic)
 */
export function searchByThemes(
  pages: MythosCodexPage[],
  themes: string[]
): MythosCodexPage[] {
  if (themes.length === 0) return [];

  const lowerThemes = themes.map(t => t.toLowerCase());

  return pages.filter(page => {
    const pageThemes = page.themes.map(t => t.toLowerCase());
    return lowerThemes.every(qt =>
      pageThemes.some(pt => pt.includes(qt))
    );
  });
}

/**
 * Get related pages (by shared themes)
 */
export function getRelatedPages(
  pages: MythosCodexPage[],
  pageId: string,
  maxResults: number = 5
): MythosCodexPage[] {
  const sourcePage = pages.find(p => p.archetypeId === pageId);
  if (!sourcePage) return [];

  const sourceThemes = new Set(sourcePage.themes.map(t => t.toLowerCase()));

  const scored = pages
    .filter(p => p.archetypeId !== pageId)
    .map(p => {
      const overlap = p.themes.filter(t =>
        sourceThemes.has(t.toLowerCase())
      ).length;
      return { page: p, score: overlap };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, maxResults).map(r => r.page);
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Get weight for field (used in scoring)
 */
function getFieldWeight(field: string): number {
  const weights: Record<string, number> = {
    name: 5,
    themes: 3,
    shadow: 2,
    gifts: 2,
    evidence: 1,
    scripture: 1
  };
  return weights[field] || 1;
}

/**
 * Fuzzy match (simple Levenshtein-based)
 */
function fuzzyMatch(text: string, query: string): boolean {
  // Simple fuzzy: allow 1 character difference per 4 characters of query
  const maxDist = Math.floor(query.length / 4) + 1;

  // Check if any word in text is within distance
  const words = text.split(/\s+/);
  return words.some(word => {
    if (word.includes(query)) return true;
    if (query.includes(word)) return true;
    return levenshteinDistance(word, query) <= maxDist;
  });
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Highlight matching text
 */
function highlightMatch(text: string, query: string): string {
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Escape regex special characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ==================== AUTOCOMPLETE ====================

/**
 * Get autocomplete suggestions
 */
export function getAutocompleteSuggestions(
  pages: MythosCodexPage[],
  prefix: string,
  maxSuggestions: number = 10
): string[] {
  const p = prefix.toLowerCase().trim();
  if (!p) return [];

  const suggestions = new Set<string>();

  pages.forEach(page => {
    // Add archetype names
    if (page.name.toLowerCase().startsWith(p)) {
      suggestions.add(page.name);
    }
    if (page.nameZh && page.nameZh.startsWith(p)) {
      suggestions.add(page.nameZh);
    }

    // Add themes
    page.themes.forEach(theme => {
      if (theme.toLowerCase().startsWith(p)) {
        suggestions.add(theme);
      }
    });

    // Add gifts
    page.gifts.forEach(gift => {
      if (gift.toLowerCase().startsWith(p)) {
        suggestions.add(gift);
      }
    });
  });

  return Array.from(suggestions).slice(0, maxSuggestions);
}

// ==================== FORMATTING ====================

/**
 * Format search results for display
 */
export function formatSearchResults(
  results: CodexSearchResult[],
  lang: 'en' | 'zh' = 'en'
): string {
  if (results.length === 0) {
    return lang === 'zh' ? '未找到结果' : 'No results found';
  }

  const lines: string[] = [];
  lines.push(lang === 'zh' ? `找到 ${results.length} 个结果` : `Found ${results.length} results`);
  lines.push('');

  results.forEach((result, i) => {
    const name = lang === 'zh' ? (result.page.nameZh || result.page.name) : result.page.name;
    lines.push(`${i + 1}. ${name} (score: ${result.score})`);
    lines.push(`   Matched: ${result.matchedFields.join(', ')}`);
    lines.push('');
  });

  return lines.join('\n');
}

// ==================== EXPORTS ====================

export {
  createSearchIndex,
  searchMythosCodex,
  searchArchetypes,
  searchByField,
  searchByThemes,
  getRelatedPages,
  getAutocompleteSuggestions,
  formatSearchResults
};
