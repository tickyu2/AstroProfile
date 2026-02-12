/**
 * ============================================
 * PRO REPORT DESIGNER 6.0
 * Real-Time Multi-Author Collaboration
 *
 * Features:
 * - Multiple authors (human + AI)
 * - Real-time cursor tracking
 * - Live edit synchronization
 * - Shared workspaces
 * - Permission management
 * - Conflict resolution
 * - AI as live collaborator
 * ============================================
 */

import {
  type CollaborativeSection,
  type CollaborativeReport,
  addRevision
} from './reportDesigner5';

// ==================== TYPES ====================

export interface Author {
  id: string;
  name: string;
  nameZh: string;
  role: 'owner' | 'editor' | 'commenter' | 'viewer' | 'ai';
  color: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen: number;
}

export interface LiveCursor {
  authorId: string;
  sectionId: string;
  position: number;
  selection?: { start: number; end: number };
  timestamp: number;
}

export interface Workspace {
  id: string;
  name: string;
  nameZh: string;
  report: CollaborativeReport;
  authors: Author[];
  cursors: LiveCursor[];
  permissions: Record<string, Permission>;
  settings: WorkspaceSettings;
  createdAt: Date;
  updatedAt: Date;
}

export type Permission = 'edit' | 'comment' | 'view';

export interface WorkspaceSettings {
  allowAIAssist: boolean;
  autoSave: boolean;
  conflictResolution: 'last-write-wins' | 'merge' | 'prompt';
  notifyOnEdit: boolean;
  lockSectionsOnEdit: boolean;
}

export interface SyncEvent {
  type: SyncEventType;
  authorId: string;
  sectionId?: string;
  payload: unknown;
  timestamp: number;
  workspaceId: string;
}

export type SyncEventType =
  | 'edit'
  | 'cursor'
  | 'selection'
  | 'suggestion'
  | 'revision'
  | 'join'
  | 'leave'
  | 'lock'
  | 'unlock'
  | 'comment'
  | 'presence';

export interface Comment {
  id: string;
  authorId: string;
  sectionId: string;
  content: string;
  contentZh: string;
  position?: { start: number; end: number };
  timestamp: number;
  resolved: boolean;
  replies: Comment[];
}

export interface EditConflict {
  sectionId: string;
  authorA: string;
  authorB: string;
  contentA: string;
  contentB: string;
  timestamp: number;
  resolved: boolean;
}

// ==================== SYNC ENGINE ====================

/**
 * Real-time synchronization engine
 */
export class SyncEngine {
  private listeners: Map<string, ((event: SyncEvent) => void)[]> = new Map();
  private eventHistory: SyncEvent[] = [];
  private maxHistorySize = 1000;

  /**
   * Broadcast an event to all listeners
   */
  broadcast(event: SyncEvent): void {
    const workspaceListeners = this.listeners.get(event.workspaceId) || [];
    workspaceListeners.forEach(fn => fn(event));

    // Store in history
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }
  }

  /**
   * Subscribe to events for a workspace
   */
  subscribe(workspaceId: string, callback: (event: SyncEvent) => void): () => void {
    if (!this.listeners.has(workspaceId)) {
      this.listeners.set(workspaceId, []);
    }
    this.listeners.get(workspaceId)!.push(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(workspaceId);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  /**
   * Get recent events for a workspace
   */
  getRecentEvents(workspaceId: string, limit: number = 50): SyncEvent[] {
    return this.eventHistory
      .filter(e => e.workspaceId === workspaceId)
      .slice(-limit);
  }

  /**
   * Clear listeners for a workspace
   */
  clearWorkspace(workspaceId: string): void {
    this.listeners.delete(workspaceId);
  }
}

// ==================== WORKSPACE MANAGER ====================

/**
 * Manages shared workspaces
 */
export class WorkspaceManager {
  private workspaces: Map<string, Workspace> = new Map();
  private syncEngine: SyncEngine;

  constructor(syncEngine: SyncEngine) {
    this.syncEngine = syncEngine;
  }

  /**
   * Create a new workspace
   */
  createWorkspace(
    report: CollaborativeReport,
    owner: Author,
    name: string,
    nameZh: string
  ): Workspace {
    const workspace: Workspace = {
      id: `ws_${Date.now()}`,
      name,
      nameZh,
      report,
      authors: [owner],
      cursors: [],
      permissions: { [owner.id]: 'edit' },
      settings: {
        allowAIAssist: true,
        autoSave: true,
        conflictResolution: 'merge',
        notifyOnEdit: true,
        lockSectionsOnEdit: false
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.workspaces.set(workspace.id, workspace);
    return workspace;
  }

  /**
   * Get a workspace by ID
   */
  getWorkspace(id: string): Workspace | undefined {
    return this.workspaces.get(id);
  }

  /**
   * Invite an author to a workspace
   */
  inviteAuthor(
    workspaceId: string,
    author: Author,
    permission: Permission
  ): Workspace | undefined {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) return undefined;

    workspace.authors.push(author);
    workspace.permissions[author.id] = permission;
    workspace.updatedAt = new Date();

    this.syncEngine.broadcast({
      type: 'join',
      authorId: author.id,
      payload: { author, permission },
      timestamp: Date.now(),
      workspaceId
    });

    return workspace;
  }

  /**
   * Remove an author from a workspace
   */
  removeAuthor(workspaceId: string, authorId: string): Workspace | undefined {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) return undefined;

    workspace.authors = workspace.authors.filter(a => a.id !== authorId);
    delete workspace.permissions[authorId];
    workspace.cursors = workspace.cursors.filter(c => c.authorId !== authorId);
    workspace.updatedAt = new Date();

    this.syncEngine.broadcast({
      type: 'leave',
      authorId,
      payload: {},
      timestamp: Date.now(),
      workspaceId
    });

    return workspace;
  }

  /**
   * Update author permission
   */
  updatePermission(
    workspaceId: string,
    authorId: string,
    permission: Permission
  ): Workspace | undefined {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) return undefined;

    workspace.permissions[authorId] = permission;
    workspace.updatedAt = new Date();

    return workspace;
  }

  /**
   * Delete a workspace
   */
  deleteWorkspace(workspaceId: string): boolean {
    this.syncEngine.clearWorkspace(workspaceId);
    return this.workspaces.delete(workspaceId);
  }

  /**
   * Get all workspaces for an author
   */
  getWorkspacesForAuthor(authorId: string): Workspace[] {
    return Array.from(this.workspaces.values())
      .filter(ws => ws.authors.some(a => a.id === authorId));
  }
}

// ==================== CO-EDITING OPERATIONS ====================

/**
 * Apply an edit event to the workspace
 */
export function applyEdit(
  workspace: Workspace,
  event: SyncEvent
): Workspace {
  if (event.type !== 'edit' || !event.sectionId) return workspace;

  const { newContent, newContentZh } = event.payload;
  const author = workspace.authors.find(a => a.id === event.authorId);

  const updatedSections = workspace.report.sections.map(sec => {
    if (sec.id !== event.sectionId) return sec;

    return addRevision(
      sec,
      author?.role === 'ai' ? 'ai' : 'user',
      newContent || sec.content,
      newContentZh || sec.contentZh,
      'Live edit',
      '实时编辑',
      event.authorId,
      author?.name
    );
  });

  return {
    ...workspace,
    report: {
      ...workspace.report,
      sections: updatedSections,
      updatedAt: new Date()
    },
    updatedAt: new Date()
  };
}

/**
 * Update cursor position
 */
export function updateCursor(
  workspace: Workspace,
  event: SyncEvent
): Workspace {
  if (event.type !== 'cursor' || !event.sectionId) return workspace;

  const existingCursorIndex = workspace.cursors.findIndex(
    c => c.authorId === event.authorId
  );

  const newCursor: LiveCursor = {
    authorId: event.authorId,
    sectionId: event.sectionId,
    position: event.payload.position,
    selection: event.payload.selection,
    timestamp: event.timestamp
  };

  let updatedCursors: LiveCursor[];

  if (existingCursorIndex >= 0) {
    updatedCursors = [...workspace.cursors];
    updatedCursors[existingCursorIndex] = newCursor;
  } else {
    updatedCursors = [...workspace.cursors, newCursor];
  }

  return {
    ...workspace,
    cursors: updatedCursors
  };
}

/**
 * Update author presence (online/offline)
 */
export function updatePresence(
  workspace: Workspace,
  authorId: string,
  isOnline: boolean
): Workspace {
  return {
    ...workspace,
    authors: workspace.authors.map(a =>
      a.id === authorId
        ? { ...a, isOnline, lastSeen: Date.now() }
        : a
    )
  };
}

/**
 * Lock a section for editing
 */
export function lockSectionForAuthor(
  workspace: Workspace,
  sectionId: string,
  authorId: string
): Workspace {
  const section = workspace.report.sections.find(s => s.id === sectionId);

  if (!section || section.isLocked) return workspace;

  return {
    ...workspace,
    report: {
      ...workspace.report,
      sections: workspace.report.sections.map(sec =>
        sec.id === sectionId
          ? { ...sec, isLocked: true, lockedBy: authorId }
          : sec
      )
    }
  };
}

/**
 * Unlock a section
 */
export function unlockSectionForAuthor(
  workspace: Workspace,
  sectionId: string,
  authorId: string
): Workspace {
  const section = workspace.report.sections.find(s => s.id === sectionId);

  if (!section || !section.isLocked || section.lockedBy !== authorId) {
    return workspace;
  }

  return {
    ...workspace,
    report: {
      ...workspace.report,
      sections: workspace.report.sections.map(sec =>
        sec.id === sectionId
          ? { ...sec, isLocked: false, lockedBy: undefined }
          : sec
      )
    }
  };
}

// ==================== CONFLICT RESOLUTION ====================

/**
 * Detect edit conflicts
 */
export function detectConflicts(
  workspace: Workspace,
  events: SyncEvent[]
): EditConflict[] {
  const conflicts: EditConflict[] = [];
  const sectionEdits: Map<string, SyncEvent[]> = new Map();

  // Group edits by section
  for (const event of events.filter(e => e.type === 'edit')) {
    if (!event.sectionId) continue;
    const existing = sectionEdits.get(event.sectionId) || [];
    sectionEdits.set(event.sectionId, [...existing, event]);
  }

  // Find overlapping edits
  for (const [sectionId, edits] of sectionEdits) {
    if (edits.length < 2) continue;

    // Check for edits within 5 seconds of each other by different authors
    for (let i = 0; i < edits.length; i++) {
      for (let j = i + 1; j < edits.length; j++) {
        const editA = edits[i];
        const editB = edits[j];

        if (editA.authorId === editB.authorId) continue;

        const timeDiff = Math.abs(editA.timestamp - editB.timestamp);
        if (timeDiff < 5000) {
          conflicts.push({
            sectionId,
            authorA: editA.authorId,
            authorB: editB.authorId,
            contentA: editA.payload.newContent,
            contentB: editB.payload.newContent,
            timestamp: Math.max(editA.timestamp, editB.timestamp),
            resolved: false
          });
        }
      }
    }
  }

  return conflicts;
}

/**
 * Resolve conflict using merge strategy
 */
export function mergeConflict(conflict: EditConflict): string {
  // Simple merge: keep both versions separated
  return `${conflict.contentA}\n\n---\n\n${conflict.contentB}`;
}

/**
 * Resolve conflict using last-write-wins
 */
export function lastWriteWins(conflict: EditConflict, events: SyncEvent[]): string {
  const latestEdit = events
    .filter(e => e.type === 'edit' && e.sectionId === conflict.sectionId)
    .sort((a, b) => b.timestamp - a.timestamp)[0];

  return latestEdit?.payload.newContent || conflict.contentA;
}

// ==================== AI LIVE ASSIST ====================

export interface AIAssistSuggestion {
  sectionId: string;
  type: 'clarity' | 'flow' | 'depth' | 'consistency' | 'structure';
  message: string;
  messageZh: string;
  severity: 'info' | 'warning' | 'suggestion';
}

/**
 * AI live assistance - watches for patterns and suggests improvements
 */
export function aiLiveAssist(
  workspace: Workspace,
  event: SyncEvent
): AIAssistSuggestion[] {
  const suggestions: AIAssistSuggestion[] = [];

  if (event.type !== 'edit' || !event.sectionId) {
    return suggestions;
  }

  const content = event.payload.newContent || '';
  const section = workspace.report.sections.find(s => s.id === event.sectionId);

  if (!section) return suggestions;

  // Check content length
  if (content.length > 500 && section.suggestions.length === 0) {
    suggestions.push({
      sectionId: event.sectionId,
      type: 'clarity',
      message: 'Consider summarizing this section for better readability.',
      messageZh: '考虑总结这部分以提高可读性。',
      severity: 'suggestion'
    });
  }

  // Check for logical flow issues
  if (content.includes('however') && content.includes('therefore')) {
    suggestions.push({
      sectionId: event.sectionId,
      type: 'flow',
      message: 'Logical flow may benefit from smoothing transitions.',
      messageZh: '逻辑流程可能需要平滑过渡。',
      severity: 'info'
    });
  }

  // Check for repetition
  const words = content.toLowerCase().split(/\s+/);
  const wordCounts = new Map<string, number>();
  for (const word of words) {
    if (word.length > 5) {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    }
  }

  for (const [word, count] of wordCounts) {
    if (count > 5) {
      suggestions.push({
        sectionId: event.sectionId,
        type: 'consistency',
        message: `Word "${word}" appears ${count} times. Consider using synonyms.`,
        messageZh: `词语"${word}"出现了${count}次。考虑使用同义词。`,
        severity: 'suggestion'
      });
      break;
    }
  }

  // Check for missing structure
  if (content.length > 300 && !content.includes('\n\n')) {
    suggestions.push({
      sectionId: event.sectionId,
      type: 'structure',
      message: 'Consider adding paragraph breaks for better structure.',
      messageZh: '考虑添加段落分隔以改善结构。',
      severity: 'info'
    });
  }

  return suggestions;
}

// ==================== COMMENTS ====================

/**
 * Add a comment to a section
 */
export function addComment(
  workspace: Workspace,
  sectionId: string,
  authorId: string,
  content: string,
  contentZh: string,
  position?: { start: number; end: number }
): { workspace: Workspace; comment: Comment } {
  const comment: Comment = {
    id: `comment_${Date.now()}`,
    authorId,
    sectionId,
    content,
    contentZh,
    position,
    timestamp: Date.now(),
    resolved: false,
    replies: []
  };

  // Store comment in section (assuming sections have a comments array)
  const updatedSections = workspace.report.sections.map(sec => {
    if (sec.id !== sectionId) return sec;
    return {
      ...sec,
      // Add comments array if not exists
      comments: [...((sec as any).comments || []), comment]
    };
  });

  return {
    workspace: {
      ...workspace,
      report: {
        ...workspace.report,
        sections: updatedSections as CollaborativeSection[]
      }
    },
    comment
  };
}

/**
 * Resolve a comment
 */
export function resolveComment(
  workspace: Workspace,
  sectionId: string,
  commentId: string
): Workspace {
  return {
    ...workspace,
    report: {
      ...workspace.report,
      sections: workspace.report.sections.map(sec => {
        if (sec.id !== sectionId) return sec;
        const comments = ((sec as any).comments || []).map((c: Comment) =>
          c.id === commentId ? { ...c, resolved: true } : c
        );
        return { ...sec, comments } as CollaborativeSection;
      })
    }
  };
}

// ==================== PRESENCE UTILITIES ====================

/**
 * Get online authors for a workspace
 */
export function getOnlineAuthors(workspace: Workspace): Author[] {
  return workspace.authors.filter(a => a.isOnline);
}

/**
 * Get cursors for a specific section
 */
export function getSectionCursors(workspace: Workspace, sectionId: string): Array<{
  author: Author;
  cursor: LiveCursor;
}> {
  return workspace.cursors
    .filter(c => c.sectionId === sectionId)
    .map(cursor => {
      const author = workspace.authors.find(a => a.id === cursor.authorId);
      return author ? { author, cursor } : null;
    })
    .filter(Boolean) as Array<{ author: Author; cursor: LiveCursor }>;
}

/**
 * Check if author can edit
 */
export function canEdit(workspace: Workspace, authorId: string): boolean {
  const permission = workspace.permissions[authorId];
  return permission === 'edit';
}

/**
 * Check if author can comment
 */
export function canComment(workspace: Workspace, authorId: string): boolean {
  const permission = workspace.permissions[authorId];
  return permission === 'edit' || permission === 'comment';
}

// ==================== EXPORTS ====================

export {
  SyncEngine,
  WorkspaceManager,
  applyEdit,
  updateCursor,
  updatePresence,
  lockSectionForAuthor,
  unlockSectionForAuthor,
  detectConflicts,
  mergeConflict,
  lastWriteWins,
  aiLiveAssist,
  addComment,
  resolveComment,
  getOnlineAuthors,
  getSectionCursors,
  canEdit,
  canComment
};
