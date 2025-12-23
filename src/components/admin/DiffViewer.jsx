/**
 * DiffViewer.jsx - Side-by-side diff viewer for JSON snapshots
 *
 * Compares before and after states, highlighting changes.
 * Part of GENESIS Memory Consolidation System.
 *
 * December 23, 2025
 */

import React, { useMemo } from 'react';

/**
 * Get all keys from an object (shallow)
 */
function getKeys(obj) {
  if (!obj || typeof obj !== 'object') return [];
  return Object.keys(obj);
}

/**
 * Pretty print a value as JSON
 */
function prettify(value) {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

/**
 * Deep comparison of two values
 */
function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object' || a === null || b === null) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  return keysA.every(key => deepEqual(a[key], b[key]));
}

/**
 * Compute diff summary for a key
 */
function getDiffType(before, after) {
  const hasA = before !== undefined;
  const hasB = after !== undefined;

  if (!hasA && hasB) return 'added';
  if (hasA && !hasB) return 'removed';
  if (deepEqual(before, after)) return 'unchanged';
  return 'changed';
}

export default function DiffViewer({ left = {}, right = {} }) {
  const diffs = useMemo(() => {
    const allKeys = new Set([...getKeys(left), ...getKeys(right)]);
    const rows = [];

    for (const key of allKeys) {
      const before = left[key];
      const after = right[key];
      const diffType = getDiffType(before, after);

      rows.push({
        key,
        before,
        after,
        diffType
      });
    }

    // Sort: changed first, then added, then removed, then unchanged
    const order = { changed: 0, added: 1, removed: 2, unchanged: 3 };
    rows.sort((a, b) => order[a.diffType] - order[b.diffType]);

    return rows;
  }, [left, right]);

  const stats = useMemo(() => {
    return {
      changed: diffs.filter(d => d.diffType === 'changed').length,
      added: diffs.filter(d => d.diffType === 'added').length,
      removed: diffs.filter(d => d.diffType === 'removed').length,
      unchanged: diffs.filter(d => d.diffType === 'unchanged').length
    };
  }, [diffs]);

  return (
    <div className="diff-root">
      {/* Stats Bar */}
      <div className="diff-stats">
        <span className="stat-item changed">
          <span className="stat-dot"></span>
          {stats.changed} changed
        </span>
        <span className="stat-item added">
          <span className="stat-dot"></span>
          {stats.added} added
        </span>
        <span className="stat-item removed">
          <span className="stat-dot"></span>
          {stats.removed} removed
        </span>
        <span className="stat-item unchanged">
          <span className="stat-dot"></span>
          {stats.unchanged} unchanged
        </span>
      </div>

      {/* Diff Grid */}
      <div className="diff-grid">
        {/* Left Column - Before */}
        <div className="diff-col">
          <div className="diff-col-header">Before</div>
          {diffs.map(d => (
            <div
              key={d.key}
              className={`diff-row ${d.diffType}`}
            >
              <div className="diff-key">
                <span className="diff-indicator"></span>
                {d.key}
              </div>
              <pre className="diff-value">
                {d.diffType === 'added' ? (
                  <span className="placeholder">—</span>
                ) : (
                  prettify(d.before)
                )}
              </pre>
            </div>
          ))}
        </div>

        {/* Right Column - After */}
        <div className="diff-col">
          <div className="diff-col-header">After</div>
          {diffs.map(d => (
            <div
              key={d.key}
              className={`diff-row ${d.diffType}`}
            >
              <div className="diff-key">
                <span className="diff-indicator"></span>
                {d.key}
              </div>
              <pre className="diff-value">
                {d.diffType === 'removed' ? (
                  <span className="placeholder">—</span>
                ) : (
                  prettify(d.after)
                )}
              </pre>
            </div>
          ))}
        </div>
      </div>

      {/* No Changes Message */}
      {diffs.length === 0 && (
        <div className="diff-empty">
          No differences found
        </div>
      )}
    </div>
  );
}

/**
 * Inline diff for simple value comparison
 */
export function InlineDiff({ before, after }) {
  const diffType = getDiffType(before, after);

  return (
    <div className={`inline-diff ${diffType}`}>
      {diffType === 'added' && (
        <span className="inline-after">+ {prettify(after)}</span>
      )}
      {diffType === 'removed' && (
        <span className="inline-before">- {prettify(before)}</span>
      )}
      {diffType === 'changed' && (
        <>
          <span className="inline-before">- {prettify(before)}</span>
          <span className="inline-after">+ {prettify(after)}</span>
        </>
      )}
      {diffType === 'unchanged' && (
        <span className="inline-same">{prettify(before)}</span>
      )}
    </div>
  );
}
