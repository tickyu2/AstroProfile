/**
 * FloatingMdWindow — Draggable floating markdown viewer.
 * Shared component extracted from WheelEducationPanel.
 *
 * Uses chunked rendering: only the first N blocks are rendered initially,
 * with more blocks loaded progressively as the user scrolls.  This prevents
 * browser freeze when viewing very large (200 KB+) cathedral documents.
 */

import './FloatingMdWindow.css';
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';

// ---------------------------------------------------------------------------
// Inline markdown renderer: **bold**, *italic*, [link](url), HTML anchors
// ---------------------------------------------------------------------------
export const renderInlineMarkdown = (str: string, keyPrefix: string = 'md'): React.ReactNode[] => {
  const tokens = str.split(/(\*\*.*?\*\*|\*[^*]+\*|\[.*?\]\(.*?\)|<[^>]+>)/g);

  return tokens.flatMap((tok, idx) => {
    if (!tok) return [];
    if (tok.startsWith('**') && tok.endsWith('**')) {
      return <strong key={`${keyPrefix}-${idx}`}>{tok.slice(2, -2)}</strong>;
    }
    if (tok.startsWith('*') && tok.endsWith('*') && tok.length > 2) {
      return <em key={`${keyPrefix}-${idx}`}>{tok.slice(1, -1)}</em>;
    }
    const linkMatch = tok.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return <a key={`${keyPrefix}-${idx}`} href={linkMatch[2]} className="md-link">{linkMatch[1]}</a>;
    }
    const anchorMatch = tok.match(/^<a\s+(?:name|id)=["']([^"']+)["']\s*\/?\s*>$/i);
    if (anchorMatch) {
      return <a key={`${keyPrefix}-${idx}`} id={anchorMatch[1]} />;
    }
    if (/^<\/?[a-z][^>]*\/?>$/i.test(tok)) {
      if (/^<br\s*\/?>$/i.test(tok)) return <br key={`${keyPrefix}-${idx}`} />;
      return [];
    }
    return tok;
  });
};

// ---------------------------------------------------------------------------
// Block-level markdown renderer: headers, lists, tables, blockquotes, hr
// Returns a flat array of React elements (one per block) so consumers can
// slice/chunk the output for progressive rendering.
// ---------------------------------------------------------------------------
export const renderMarkdownBlocks = (text: string): React.ReactNode[] => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') { i++; continue; }

    // Fenced code blocks (``` or ~~~)
    if (/^(`{3,}|~{3,})/.test(line.trim())) {
      const fence = line.trim().match(/^(`{3,}|~{3,})/)?.[1] || '```';
      const lang = line.trim().slice(fence.length).trim();
      i++;
      const codeLines: string[] = [];
      while (i < lines.length && !lines[i].trim().startsWith(fence)) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // skip closing fence
      elements.push(
        <pre key={`code-${i}`} className="md-codeblock" style={{
          background: 'rgba(0,0,0,0.3)', borderRadius: '6px', padding: '12px 16px',
          overflow: 'auto', fontSize: '12px', lineHeight: '1.5',
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          border: '1px solid rgba(148,163,184,0.15)', margin: '8px 0',
          color: '#e2e8f0', whiteSpace: 'pre',
        }}>
          {lang && <div style={{ color: '#64748b', fontSize: '10px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{lang}</div>}
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      continue;
    }

    const anchorLineMatch = line.trim().match(/^<a\s+(?:name|id)=["']([^"']+)["']\s*(?:\/\s*)?>(?:\s*<\/a>)?$/i);
    if (anchorLineMatch) {
      elements.push(<a key={`anchor-${i}`} id={anchorLineMatch[1]} />);
      i++; continue;
    }

    if (/^\s*<\/?[a-z][^>]*\/?\s*>\s*$/i.test(line.trim()) && !line.trim().startsWith('<a')) {
      if (/^<br\s*\/?>$/i.test(line.trim())) {
        elements.push(<br key={`br-${i}`} />);
      }
      i++; continue;
    }

    if (/^(\s*[-*_]){3,}\s*$/.test(line)) {
      elements.push(<hr key={`hr-${i}`} className="md-hr" />);
      i++; continue;
    }

    const headerMatch = line.match(/^(#{1,6})\s+(.*)/);
    if (headerMatch) {
      const level = headerMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6;
      const Tag = `h${level}` as keyof JSX.IntrinsicElements;
      const slug = headerMatch[2].toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').replace(/^-+|-+$/g, '');
      elements.push(<Tag key={`h-${i}`} id={slug} className={`md-h${level}`}>{renderInlineMarkdown(headerMatch[2], `h${i}`)}</Tag>);
      i++; continue;
    }

    if (line.startsWith('>')) {
      const bqLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('>')) {
        bqLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      elements.push(
        <blockquote key={`bq-${i}`} className="md-blockquote">
          {bqLines.map((bl, j) => (
            <React.Fragment key={j}>{renderInlineMarkdown(bl, `bq${i}-${j}`)}{j < bqLines.length - 1 && <br />}</React.Fragment>
          ))}
        </blockquote>,
      );
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ''));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="md-ul">
          {items.map((item, j) => <li key={j}>{renderInlineMarkdown(item, `ul${i}-${j}`)}</li>)}
        </ul>,
      );
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="md-ol">
          {items.map((item, j) => <li key={j}>{renderInlineMarkdown(item, `ol${i}-${j}`)}</li>)}
        </ol>,
      );
      continue;
    }

    if (line.includes('|') && (line.trim().startsWith('|') || (i + 1 < lines.length && /^[-| :]+$/.test(lines[i + 1].trim())))) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].includes('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      const startsWithPipe = tableLines[0].trim().startsWith('|');
      const parseRow = startsWithPipe
        ? (r: string) => r.split('|').filter((_: string, ci: number, arr: string[]) => ci > 0 && ci < arr.length - 1).map((c: string) => c.trim())
        : (r: string) => r.split('|').map((c: string) => c.trim());
      const headerCells = parseRow(tableLines[0]);
      // Parse alignment from separator row (row index 1)
      const sepCells = tableLines.length > 1 ? parseRow(tableLines[1]) : [];
      const aligns: Array<'left' | 'center' | 'right' | undefined> = sepCells.map(cell => {
        const t = cell.trim();
        if (t.startsWith(':') && t.endsWith(':')) return 'center';
        if (t.endsWith(':')) return 'right';
        if (t.startsWith(':')) return 'left';
        return undefined;
      });
      const bodyRows = tableLines.slice(2).map(parseRow);
      elements.push(
        <div key={`tbl-${i}`} className="md-table-wrap">
          <table className="md-table">
            <thead><tr>{headerCells.map((c: string, ci: number) => <th key={ci} style={aligns[ci] ? { textAlign: aligns[ci] } : undefined}>{renderInlineMarkdown(c, `th${i}-${ci}`)}</th>)}</tr></thead>
            <tbody>
              {bodyRows.map((row: string[], ri: number) => (
                <tr key={ri}>{row.map((c: string, ci: number) => <td key={ci} style={aligns[ci] ? { textAlign: aligns[ci] } : undefined}>{renderInlineMarkdown(c, `td${i}-${ri}-${ci}`)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    const paraLines: string[] = [];
    while (i < lines.length && lines[i].trim() !== '' && !/^(#{1,6}\s|>\s*|[-*_]{3,}|\s*[-*]\s+|\s*\d+\.\s+|\|)/.test(lines[i])) {
      paraLines.push(lines[i]);
      i++;
    }
    elements.push(
      <p key={`p-${i}`} className="edu-paragraph">
        {paraLines.map((pl, j) => (
          <React.Fragment key={j}>
            {renderInlineMarkdown(pl, `p${i}-${j}`)}
            {j < paraLines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>,
    );
  }

  return elements;
};

/** Legacy wrapper — renders all blocks in a single fragment (kept for callers
 *  outside FloatingMdWindow that don't need chunking). */
export const renderMarkdownText = (text: string): React.ReactNode => (
  <>{renderMarkdownBlocks(text)}</>
);

// ---------------------------------------------------------------------------
// FloatingMdWindow component — progressive / chunked rendering
// ---------------------------------------------------------------------------
const INITIAL_BLOCKS = 60;
const BLOCK_INCREMENT = 60;

const FloatingMdWindow: React.FC<{
  content: string;
  title: string;
  onClose: () => void;
  width?: number;
  onImport?: () => void;
}> = ({ content, title, onClose, width, onImport }) => {
  // Parse all blocks once (cheap — just creates JS objects, not DOM)
  const allBlocks = useMemo(() => renderMarkdownBlocks(content), [content]);

  const [pos, setPos] = useState({ x: 900, y: 170 });
  const [visibleCount, setVisibleCount] = useState(
    () => Math.min(INITIAL_BLOCKS, allBlocks.length),
  );
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Reset visible count when content changes
  useEffect(() => {
    setVisibleCount(Math.min(INITIAL_BLOCKS, allBlocks.length));
  }, [allBlocks.length]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPos({ x: dragRef.current.origX + dx, y: dragRef.current.origY + dy });
    };
    const onUp = () => { dragRef.current = null; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const handleDragStart = (e: React.MouseEvent) => {
    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: pos.x, origY: pos.y };
  };

  // Load more blocks when user scrolls near the bottom
  const handleScroll = useCallback((e: React.UIEvent) => {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 400) {
      setVisibleCount(prev => Math.min(prev + BLOCK_INCREMENT, allBlocks.length));
    }
  }, [allBlocks.length]);

  const handleBodyClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
      e.preventDefault();
      const id = target.getAttribute('href')!.slice(1);
      // If the target anchor hasn't been rendered yet, load all blocks first
      let el = bodyRef.current?.querySelector(`[id="${id}"]`);
      if (!el && visibleCount < allBlocks.length) {
        setVisibleCount(allBlocks.length);
        // Give React a frame to render, then scroll
        requestAnimationFrame(() => {
          el = bodyRef.current?.querySelector(`[id="${id}"]`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        return;
      }
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [visibleCount, allBlocks.length]);

  return ReactDOM.createPortal(
    <div className="floating-md-window" style={{ left: pos.x, top: pos.y, ...(width ? { width } : {}) }}>
      <div className="floating-md-titlebar" onMouseDown={handleDragStart}>
        <span className="floating-md-title">{title}</span>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {onImport && (
            <button type="button" onClick={onImport} style={{
              background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)',
              color: '#4ade80', borderRadius: '4px', padding: '2px 8px', fontSize: '11px',
              cursor: 'pointer', fontFamily: 'monospace', lineHeight: '1.4',
            }} title="Import MD file">↓ Import</button>
          )}
          <button type="button" className="floating-md-close" onClick={onClose}>&times;</button>
        </div>
      </div>
      <div className="floating-md-body" ref={bodyRef} onClick={handleBodyClick} onScroll={handleScroll}>
        {allBlocks.slice(0, visibleCount)}
        {visibleCount < allBlocks.length && (
          <div style={{ padding: '12px', textAlign: 'center', color: '#64748b', fontSize: '11px' }}>
            Scroll for more ({allBlocks.length - visibleCount} sections remaining)
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default FloatingMdWindow;
