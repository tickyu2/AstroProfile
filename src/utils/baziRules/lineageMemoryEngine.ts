/**
 * ============================================
 * LINEAGE MEMORY ENGINE
 * Persistent memory layer for the ancestral system
 *
 * This engine provides:
 * - Storage for lineage data
 * - Generations, threads, archetypes
 * - Pilgrim position and healing paths
 * - Query and retrieval functions
 * - Export/import capabilities
 *
 * The lineage becomes a living archive.
 * ============================================
 */

import { GenerationalLadder, GenerationalThread, GenerationNode } from './generationalLadder';
import { PilgrimPosition } from './journeyWithGenerations';
import { AncestralArchetype, MythosProfile } from './mythosLayer';
import { HealingPath, HealingPathStep } from './healingPath';
import { AncestralDialogue } from './pilgrimAncestorDialogue';
import { InitiationProgress } from './ancestralInitiation';

// ==================== DATA MODEL ====================

export interface LineageRecord {
  lineageId: string;
  pilgrimId?: string;
  pilgrimName?: string;

  // Core data
  generations: GenerationNode[];
  threads: GenerationalThread[];
  archetypes: AncestralArchetype[];
  mythosProfile?: MythosProfile;
  pilgrimPosition?: PilgrimPosition;

  // Journey data
  healingPath?: HealingPath;
  completedRituals: string[];
  activeDialogues: AncestralDialogue[];

  // Initiation
  initiationProgress?: InitiationProgress;
  isInitiated: boolean;

  // Metadata
  createdAt: number;
  updatedAt: number;
  version: number;
  tags?: string[];
  notes?: string;
}

export interface LineageQuery {
  lineageId?: string;
  pilgrimId?: string;
  isInitiated?: boolean;
  hasArchetype?: string;
  hasThread?: string;
  createdAfter?: number;
  createdBefore?: number;
  tags?: string[];
}

export interface LineageMemoryEngine {
  // CRUD operations
  save(record: LineageRecord): void;
  load(lineageId: string): LineageRecord | null;
  update(lineageId: string, updates: Partial<LineageRecord>): LineageRecord | null;
  delete(lineageId: string): boolean;

  // Query operations
  list(): LineageRecord[];
  query(q: LineageQuery): LineageRecord[];
  count(): number;

  // Specialized getters
  getByPilgrim(pilgrimId: string): LineageRecord | null;
  getInitiatedLineages(): LineageRecord[];
  getLineagesWithArchetype(archetypeId: string): LineageRecord[];
  getLineagesWithThread(threadTheme: string): LineageRecord[];

  // Export/Import
  exportAll(): string;
  importAll(json: string): number;
  exportSingle(lineageId: string): string | null;
  importSingle(json: string): LineageRecord | null;

  // Utilities
  clear(): void;
  has(lineageId: string): boolean;
}

// ==================== IN-MEMORY IMPLEMENTATION ====================

/**
 * Create an in-memory lineage memory engine
 */
export function createLineageMemoryEngine(): LineageMemoryEngine {
  const store = new Map<string, LineageRecord>();

  return {
    // ==================== CRUD ====================

    save(record) {
      const now = Date.now();
      const existing = store.get(record.lineageId);

      const toSave: LineageRecord = {
        ...record,
        createdAt: existing?.createdAt || now,
        updatedAt: now,
        version: (existing?.version || 0) + 1
      };

      store.set(record.lineageId, toSave);
    },

    load(lineageId) {
      return store.get(lineageId) ?? null;
    },

    update(lineageId, updates) {
      const existing = store.get(lineageId);
      if (!existing) return null;

      const updated: LineageRecord = {
        ...existing,
        ...updates,
        lineageId, // Prevent ID change
        createdAt: existing.createdAt, // Preserve creation time
        updatedAt: Date.now(),
        version: existing.version + 1
      };

      store.set(lineageId, updated);
      return updated;
    },

    delete(lineageId) {
      return store.delete(lineageId);
    },

    // ==================== QUERY ====================

    list() {
      return Array.from(store.values());
    },

    query(q) {
      let results = Array.from(store.values());

      if (q.lineageId) {
        results = results.filter(r => r.lineageId === q.lineageId);
      }

      if (q.pilgrimId) {
        results = results.filter(r => r.pilgrimId === q.pilgrimId);
      }

      if (q.isInitiated !== undefined) {
        results = results.filter(r => r.isInitiated === q.isInitiated);
      }

      if (q.hasArchetype) {
        results = results.filter(r =>
          r.archetypes.some(a => a.id === q.hasArchetype)
        );
      }

      if (q.hasThread) {
        results = results.filter(r =>
          r.threads.some(t =>
            t.theme.toLowerCase().includes(q.hasThread!.toLowerCase())
          )
        );
      }

      if (q.createdAfter) {
        results = results.filter(r => r.createdAt >= q.createdAfter!);
      }

      if (q.createdBefore) {
        results = results.filter(r => r.createdAt <= q.createdBefore!);
      }

      if (q.tags && q.tags.length > 0) {
        results = results.filter(r =>
          r.tags && q.tags!.some(tag => r.tags!.includes(tag))
        );
      }

      return results;
    },

    count() {
      return store.size;
    },

    // ==================== SPECIALIZED GETTERS ====================

    getByPilgrim(pilgrimId) {
      for (const record of store.values()) {
        if (record.pilgrimId === pilgrimId) {
          return record;
        }
      }
      return null;
    },

    getInitiatedLineages() {
      return Array.from(store.values()).filter(r => r.isInitiated);
    },

    getLineagesWithArchetype(archetypeId) {
      return Array.from(store.values()).filter(r =>
        r.archetypes.some(a => a.id === archetypeId)
      );
    },

    getLineagesWithThread(threadTheme) {
      const lower = threadTheme.toLowerCase();
      return Array.from(store.values()).filter(r =>
        r.threads.some(t => t.theme.toLowerCase().includes(lower))
      );
    },

    // ==================== EXPORT/IMPORT ====================

    exportAll() {
      const records = Array.from(store.values());
      return JSON.stringify(records, null, 2);
    },

    importAll(json) {
      try {
        const records = JSON.parse(json) as LineageRecord[];
        let count = 0;

        records.forEach(record => {
          if (record.lineageId) {
            store.set(record.lineageId, record);
            count++;
          }
        });

        return count;
      } catch {
        return 0;
      }
    },

    exportSingle(lineageId) {
      const record = store.get(lineageId);
      if (!record) return null;
      return JSON.stringify(record, null, 2);
    },

    importSingle(json) {
      try {
        const record = JSON.parse(json) as LineageRecord;
        if (record.lineageId) {
          store.set(record.lineageId, record);
          return record;
        }
        return null;
      } catch {
        return null;
      }
    },

    // ==================== UTILITIES ====================

    clear() {
      store.clear();
    },

    has(lineageId) {
      return store.has(lineageId);
    }
  };
}

// ==================== RECORD BUILDER ====================

/**
 * Create a new lineage record
 */
export function createLineageRecord(
  lineageId: string,
  pilgrimId?: string,
  pilgrimName?: string
): LineageRecord {
  return {
    lineageId,
    pilgrimId,
    pilgrimName,
    generations: [],
    threads: [],
    archetypes: [],
    completedRituals: [],
    activeDialogues: [],
    isInitiated: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: 1
  };
}

/**
 * Build lineage record from ladder and related data
 */
export function buildLineageRecordFromLadder(
  ladder: GenerationalLadder,
  pilgrimPosition?: PilgrimPosition,
  mythosProfile?: MythosProfile,
  healingPath?: HealingPath
): LineageRecord {
  return {
    lineageId: ladder.lineageId,
    generations: ladder.generations,
    threads: ladder.threads,
    archetypes: mythosProfile?.archetypes || [],
    mythosProfile,
    pilgrimPosition,
    healingPath,
    completedRituals: [],
    activeDialogues: [],
    isInitiated: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: 1
  };
}

// ==================== RECORD UPDATERS ====================

/**
 * Mark a ritual as completed
 */
export function markRitualCompleted(
  record: LineageRecord,
  ritualId: string
): LineageRecord {
  return {
    ...record,
    completedRituals: [...record.completedRituals, ritualId],
    updatedAt: Date.now(),
    version: record.version + 1
  };
}

/**
 * Mark lineage as initiated
 */
export function markAsInitiated(
  record: LineageRecord,
  progress: InitiationProgress
): LineageRecord {
  return {
    ...record,
    isInitiated: true,
    initiationProgress: progress,
    updatedAt: Date.now(),
    version: record.version + 1
  };
}

/**
 * Add dialogue to record
 */
export function addDialogue(
  record: LineageRecord,
  dialogue: AncestralDialogue
): LineageRecord {
  return {
    ...record,
    activeDialogues: [...record.activeDialogues, dialogue],
    updatedAt: Date.now(),
    version: record.version + 1
  };
}

/**
 * Update healing path progress
 */
export function updateHealingPath(
  record: LineageRecord,
  healingPath: HealingPath
): LineageRecord {
  return {
    ...record,
    healingPath,
    updatedAt: Date.now(),
    version: record.version + 1
  };
}

// ==================== QUERY HELPERS ====================

/**
 * Get all unique archetypes across all lineages
 */
export function getAllUniqueArchetypes(engine: LineageMemoryEngine): AncestralArchetype[] {
  const archetypeMap = new Map<string, AncestralArchetype>();

  engine.list().forEach(record => {
    record.archetypes.forEach(arch => {
      if (!archetypeMap.has(arch.id)) {
        archetypeMap.set(arch.id, arch);
      }
    });
  });

  return Array.from(archetypeMap.values());
}

/**
 * Get all unique threads across all lineages
 */
export function getAllUniqueThreads(engine: LineageMemoryEngine): GenerationalThread[] {
  const threadMap = new Map<string, GenerationalThread>();

  engine.list().forEach(record => {
    record.threads.forEach(thread => {
      const key = thread.theme.toLowerCase();
      if (!threadMap.has(key)) {
        threadMap.set(key, thread);
      }
    });
  });

  return Array.from(threadMap.values());
}

/**
 * Get lineage statistics
 */
export function getLineageStats(engine: LineageMemoryEngine): {
  total: number;
  initiated: number;
  withHealingPath: number;
  averageGenerations: number;
  averageArchetypes: number;
} {
  const records = engine.list();
  const total = records.length;

  if (total === 0) {
    return {
      total: 0,
      initiated: 0,
      withHealingPath: 0,
      averageGenerations: 0,
      averageArchetypes: 0
    };
  }

  const initiated = records.filter(r => r.isInitiated).length;
  const withHealingPath = records.filter(r => r.healingPath).length;

  const totalGenerations = records.reduce((sum, r) => sum + r.generations.length, 0);
  const totalArchetypes = records.reduce((sum, r) => sum + r.archetypes.length, 0);

  return {
    total,
    initiated,
    withHealingPath,
    averageGenerations: Math.round(totalGenerations / total * 10) / 10,
    averageArchetypes: Math.round(totalArchetypes / total * 10) / 10
  };
}

// ==================== EXPORTS ====================

export {
  createLineageMemoryEngine,
  createLineageRecord,
  buildLineageRecordFromLadder,
  markRitualCompleted,
  markAsInitiated,
  addDialogue,
  updateHealingPath,
  getAllUniqueArchetypes,
  getAllUniqueThreads,
  getLineageStats
};
