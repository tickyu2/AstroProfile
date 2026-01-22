/**
 * ============================================
 * PRO REPORT DESIGNER 7.0
 * Enterprise Cloud Libraries & Pipelines
 *
 * Features:
 * - Shared cloud libraries (templates, sections, interpretations)
 * - Team templates with standardization
 * - Organizational report pipelines
 * - Multi-stage workflows
 * - Quality gates
 * - Audit logs
 * ============================================
 */

import type { TonePreset } from './tonePresets';
import type { CollaborativeReport } from './reportDesigner5';

// ==================== CLOUD LIBRARY TYPES ====================

export type CloudItemType =
  | 'template'
  | 'section'
  | 'tone'
  | 'layout'
  | 'case_study'
  | 'interpretation'
  | 'workflow'
  | 'custom_rule';

export interface CloudLibraryItem {
  id: string;
  type: CloudItemType;
  label: string;
  labelZh: string;
  description: string;
  descriptionZh: string;
  content: string;
  contentZh: string;
  version: number;
  authorId: string;
  authorName: string;
  organizationId: string;
  teamId?: string;
  tags: string[];
  tagsZh: string[];
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  isArchived: boolean;
  downloads: number;
  rating: number;
  ratingCount: number;
}

export interface CloudLibrary {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  organizationId: string;
  items: CloudLibraryItem[];
  permissions: Record<string, CloudPermission>;
  settings: CloudLibrarySettings;
  createdAt: Date;
  updatedAt: Date;
}

export type CloudPermission = 'read' | 'write' | 'admin';

export interface CloudLibrarySettings {
  allowPublicItems: boolean;
  requireApproval: boolean;
  enableVersioning: boolean;
  maxItemSize: number;
  allowedTypes: CloudItemType[];
}

// ==================== TEAM TEMPLATE TYPES ====================

export interface TeamTemplate {
  id: string;
  teamId: string;
  organizationId: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  sectionOrder: string[];
  enabledSections: string[];
  disabledSections: string[];
  tonePreset: TonePreset;
  layoutPreset: string;
  customRules: TemplateRule[];
  version: number;
  isDefault: boolean;
  isLocked: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  inheritFrom?: string;
}

export interface TemplateRule {
  id: string;
  type: 'require' | 'forbid' | 'suggest' | 'transform';
  target: 'section' | 'content' | 'tone' | 'length';
  condition: string;
  action: string;
  message: string;
  messageZh: string;
}

// ==================== ORGANIZATIONAL PIPELINE TYPES ====================

export type PipelineRole = 'analyst' | 'reviewer' | 'approver' | 'publisher' | 'ai';

export interface PipelineStage {
  id: string;
  name: string;
  nameZh: string;
  order: number;
  role: PipelineRole;
  requiredSections: string[];
  requiredChecks: string[];
  autoActions: PipelineAutoAction[];
  timeout?: number;
  isOptional: boolean;
}

export interface PipelineAutoAction {
  type: 'generate' | 'tone' | 'layout' | 'validate' | 'notify' | 'archive';
  config: Record<string, any>;
  condition?: string;
}

export interface OrgPipeline {
  id: string;
  organizationId: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  stages: PipelineStage[];
  automation: PipelineAutomation;
  qualityGates: QualityGate[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PipelineAutomation {
  autoGenerate: boolean;
  autoTone: boolean;
  autoLayout: boolean;
  autoChecks: boolean;
  defaultTone: TonePreset;
  defaultTemplate: string;
  notifyOnStageChange: boolean;
  notifyOnCompletion: boolean;
}

export interface QualityGate {
  id: string;
  name: string;
  nameZh: string;
  stageId: string;
  checks: QualityCheck[];
  passThreshold: number;
  isBlocking: boolean;
}

export interface QualityCheck {
  id: string;
  type: 'completeness' | 'length' | 'sections' | 'tone' | 'custom';
  config: Record<string, any>;
  weight: number;
}

// ==================== PIPELINE EXECUTION TYPES ====================

export interface PipelineExecution {
  id: string;
  pipelineId: string;
  reportId: string;
  currentStageId: string;
  status: 'pending' | 'in_progress' | 'paused' | 'completed' | 'failed' | 'rejected';
  stageHistory: StageExecution[];
  startedAt: Date;
  completedAt?: Date;
  metadata: Record<string, any>;
}

export interface StageExecution {
  stageId: string;
  stageName: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped' | 'rejected';
  assigneeId?: string;
  startedAt?: Date;
  completedAt?: Date;
  qualityScore?: number;
  notes?: string;
  notesZh?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  executionId: string;
  stageId?: string;
  action: string;
  actorId: string;
  actorName: string;
  details: Record<string, any>;
}

// ==================== CLOUD LIBRARY MANAGER ====================

export class CloudLibraryManager {
  private libraries: Map<string, CloudLibrary> = new Map();

  /**
   * Create a new cloud library
   */
  createLibrary(
    organizationId: string,
    name: string,
    nameZh: string
  ): CloudLibrary {
    const library: CloudLibrary = {
      id: `lib_${Date.now()}`,
      name,
      nameZh,
      description: '',
      descriptionZh: '',
      organizationId,
      items: [],
      permissions: {},
      settings: {
        allowPublicItems: false,
        requireApproval: true,
        enableVersioning: true,
        maxItemSize: 1024 * 1024, // 1MB
        allowedTypes: ['template', 'section', 'tone', 'layout', 'case_study', 'interpretation']
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.libraries.set(library.id, library);
    return library;
  }

  /**
   * Add item to library
   */
  addItem(
    libraryId: string,
    item: Omit<CloudLibraryItem, 'id' | 'createdAt' | 'updatedAt' | 'downloads' | 'rating' | 'ratingCount'>
  ): CloudLibraryItem | undefined {
    const library = this.libraries.get(libraryId);
    if (!library) return undefined;

    const newItem: CloudLibraryItem = {
      ...item,
      id: `item_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      downloads: 0,
      rating: 0,
      ratingCount: 0
    };

    library.items.push(newItem);
    library.updatedAt = new Date();

    return newItem;
  }

  /**
   * Update item in library
   */
  updateItem(
    libraryId: string,
    itemId: string,
    updates: Partial<CloudLibraryItem>
  ): CloudLibraryItem | undefined {
    const library = this.libraries.get(libraryId);
    if (!library) return undefined;

    const itemIndex = library.items.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return undefined;

    const item = library.items[itemIndex];
    const updatedItem: CloudLibraryItem = {
      ...item,
      ...updates,
      version: item.version + 1,
      updatedAt: new Date()
    };

    library.items[itemIndex] = updatedItem;
    library.updatedAt = new Date();

    return updatedItem;
  }

  /**
   * Search items in library
   */
  searchItems(
    libraryId: string,
    query: string,
    filters?: {
      type?: CloudItemType;
      tags?: string[];
      authorId?: string;
    }
  ): CloudLibraryItem[] {
    const library = this.libraries.get(libraryId);
    if (!library) return [];

    const queryLower = query.toLowerCase();

    return library.items.filter(item => {
      // Text search
      const matchesQuery = !query ||
        item.label.toLowerCase().includes(queryLower) ||
        item.labelZh.includes(query) ||
        item.description.toLowerCase().includes(queryLower) ||
        item.tags.some(t => t.toLowerCase().includes(queryLower));

      // Type filter
      const matchesType = !filters?.type || item.type === filters.type;

      // Tags filter
      const matchesTags = !filters?.tags?.length ||
        filters.tags.some(t => item.tags.includes(t));

      // Author filter
      const matchesAuthor = !filters?.authorId || item.authorId === filters.authorId;

      return matchesQuery && matchesType && matchesTags && matchesAuthor && !item.isArchived;
    });
  }

  /**
   * Get library by ID
   */
  getLibrary(id: string): CloudLibrary | undefined {
    return this.libraries.get(id);
  }

  /**
   * Get items by type
   */
  getItemsByType(libraryId: string, type: CloudItemType): CloudLibraryItem[] {
    const library = this.libraries.get(libraryId);
    if (!library) return [];
    return library.items.filter(i => i.type === type && !i.isArchived);
  }
}

// ==================== TEAM TEMPLATE MANAGER ====================

export class TeamTemplateManager {
  private templates: Map<string, TeamTemplate> = new Map();

  /**
   * Create a new team template
   */
  createTemplate(
    teamId: string,
    organizationId: string,
    name: string,
    nameZh: string,
    createdBy: string
  ): TeamTemplate {
    const template: TeamTemplate = {
      id: `tmpl_${Date.now()}`,
      teamId,
      organizationId,
      name,
      nameZh,
      description: '',
      descriptionZh: '',
      sectionOrder: ['core', 'structure', 'ten_gods', 'useful_god', 'shen_sha', 'luck_pillars', 'annual', 'guidance'],
      enabledSections: ['core', 'structure', 'ten_gods', 'useful_god', 'guidance'],
      disabledSections: [],
      tonePreset: 'professional',
      layoutPreset: 'standard',
      customRules: [],
      version: 1,
      isDefault: false,
      isLocked: false,
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.templates.set(template.id, template);
    return template;
  }

  /**
   * Fork a template
   */
  forkTemplate(
    sourceId: string,
    teamId: string,
    name: string,
    nameZh: string,
    createdBy: string
  ): TeamTemplate | undefined {
    const source = this.templates.get(sourceId);
    if (!source) return undefined;

    const forked: TeamTemplate = {
      ...source,
      id: `tmpl_${Date.now()}`,
      teamId,
      name,
      nameZh,
      version: 1,
      isDefault: false,
      isLocked: false,
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
      inheritFrom: sourceId
    };

    this.templates.set(forked.id, forked);
    return forked;
  }

  /**
   * Apply template to report
   */
  applyTemplate(
    template: TeamTemplate,
    report: CollaborativeReport
  ): CollaborativeReport {
    const updatedSections = report.sections.map(sec => ({
      ...sec,
      // Enable/disable based on template
      isEnabled: template.enabledSections.includes(sec.id)
    }));

    // Sort by template order
    updatedSections.sort((a, b) => {
      const orderA = template.sectionOrder.indexOf(a.id);
      const orderB = template.sectionOrder.indexOf(b.id);
      return orderA - orderB;
    });

    return {
      ...report,
      sections: updatedSections,
      currentTone: template.tonePreset,
      updatedAt: new Date()
    };
  }

  /**
   * Validate report against template
   */
  validateAgainstTemplate(
    template: TeamTemplate,
    report: CollaborativeReport
  ): { valid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required sections
    for (const sectionId of template.enabledSections) {
      const section = report.sections.find(s => s.id === sectionId);
      if (!section) {
        errors.push(`Required section missing: ${sectionId}`);
      }
    }

    // Check custom rules
    for (const rule of template.customRules) {
      if (rule.type === 'require') {
        // Implementation would check rule condition
        if (!checkRuleCondition(rule, report)) {
          errors.push(rule.message);
        }
      } else if (rule.type === 'suggest') {
        if (!checkRuleCondition(rule, report)) {
          warnings.push(rule.message);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Get templates for team
   */
  getTeamTemplates(teamId: string): TeamTemplate[] {
    return Array.from(this.templates.values())
      .filter(t => t.teamId === teamId);
  }

  /**
   * Get template by ID
   */
  getTemplate(id: string): TeamTemplate | undefined {
    return this.templates.get(id);
  }
}

function checkRuleCondition(rule: TemplateRule, report: CollaborativeReport): boolean {
  // Simplified rule checking
  return true;
}

// ==================== PIPELINE MANAGER ====================

export class PipelineManager {
  private pipelines: Map<string, OrgPipeline> = new Map();
  private executions: Map<string, PipelineExecution> = new Map();
  private auditLog: AuditLogEntry[] = [];

  /**
   * Create a new pipeline
   */
  createPipeline(
    organizationId: string,
    name: string,
    nameZh: string
  ): OrgPipeline {
    const pipeline: OrgPipeline = {
      id: `pipe_${Date.now()}`,
      organizationId,
      name,
      nameZh,
      description: '',
      descriptionZh: '',
      stages: [
        {
          id: 'draft',
          name: 'Draft',
          nameZh: '草稿',
          order: 1,
          role: 'analyst',
          requiredSections: ['core'],
          requiredChecks: [],
          autoActions: [
            { type: 'generate', config: { mode: 'comprehensive' } }
          ],
          isOptional: false
        },
        {
          id: 'review',
          name: 'Review',
          nameZh: '审核',
          order: 2,
          role: 'reviewer',
          requiredSections: ['core', 'structure', 'guidance'],
          requiredChecks: ['completeness', 'quality'],
          autoActions: [
            { type: 'validate', config: { strict: true } }
          ],
          isOptional: false
        },
        {
          id: 'approval',
          name: 'Approval',
          nameZh: '批准',
          order: 3,
          role: 'approver',
          requiredSections: [],
          requiredChecks: ['final_review'],
          autoActions: [],
          isOptional: false
        },
        {
          id: 'publish',
          name: 'Publish',
          nameZh: '发布',
          order: 4,
          role: 'publisher',
          requiredSections: [],
          requiredChecks: [],
          autoActions: [
            { type: 'archive', config: {} },
            { type: 'notify', config: { recipients: ['client'] } }
          ],
          isOptional: false
        }
      ],
      automation: {
        autoGenerate: true,
        autoTone: true,
        autoLayout: true,
        autoChecks: true,
        defaultTone: 'professional',
        defaultTemplate: '',
        notifyOnStageChange: true,
        notifyOnCompletion: true
      },
      qualityGates: [
        {
          id: 'gate_review',
          name: 'Review Quality Gate',
          nameZh: '审核质量门',
          stageId: 'review',
          checks: [
            { id: 'check_complete', type: 'completeness', config: { minSections: 5 }, weight: 1 },
            { id: 'check_length', type: 'length', config: { minWords: 500 }, weight: 0.5 }
          ],
          passThreshold: 0.8,
          isBlocking: true
        }
      ],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.pipelines.set(pipeline.id, pipeline);
    return pipeline;
  }

  /**
   * Start pipeline execution
   */
  startExecution(pipelineId: string, reportId: string): PipelineExecution | undefined {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline || !pipeline.isActive) return undefined;

    const firstStage = pipeline.stages.sort((a, b) => a.order - b.order)[0];

    const execution: PipelineExecution = {
      id: `exec_${Date.now()}`,
      pipelineId,
      reportId,
      currentStageId: firstStage.id,
      status: 'in_progress',
      stageHistory: [{
        stageId: firstStage.id,
        stageName: firstStage.name,
        status: 'in_progress',
        startedAt: new Date()
      }],
      startedAt: new Date(),
      metadata: {}
    };

    this.executions.set(execution.id, execution);

    this.addAuditEntry(execution.id, firstStage.id, 'execution_started', 'system', 'System', {});

    return execution;
  }

  /**
   * Advance to next stage
   */
  advanceStage(
    executionId: string,
    actorId: string,
    actorName: string,
    notes?: string
  ): PipelineExecution | undefined {
    const execution = this.executions.get(executionId);
    if (!execution || execution.status !== 'in_progress') return undefined;

    const pipeline = this.pipelines.get(execution.pipelineId);
    if (!pipeline) return undefined;

    // Find current and next stages
    const currentStage = pipeline.stages.find(s => s.id === execution.currentStageId);
    const nextStage = pipeline.stages
      .filter(s => s.order > (currentStage?.order || 0))
      .sort((a, b) => a.order - b.order)[0];

    // Complete current stage
    const currentHistory = execution.stageHistory.find(h => h.stageId === execution.currentStageId);
    if (currentHistory) {
      currentHistory.status = 'completed';
      currentHistory.completedAt = new Date();
      currentHistory.notes = notes;
    }

    if (nextStage) {
      // Move to next stage
      execution.currentStageId = nextStage.id;
      execution.stageHistory.push({
        stageId: nextStage.id,
        stageName: nextStage.name,
        status: 'in_progress',
        startedAt: new Date()
      });

      this.addAuditEntry(executionId, nextStage.id, 'stage_advanced', actorId, actorName, { notes });
    } else {
      // Pipeline complete
      execution.status = 'completed';
      execution.completedAt = new Date();

      this.addAuditEntry(executionId, undefined, 'execution_completed', actorId, actorName, { notes });
    }

    return execution;
  }

  /**
   * Reject at current stage
   */
  rejectStage(
    executionId: string,
    actorId: string,
    actorName: string,
    reason: string
  ): PipelineExecution | undefined {
    const execution = this.executions.get(executionId);
    if (!execution || execution.status !== 'in_progress') return undefined;

    execution.status = 'rejected';

    const currentHistory = execution.stageHistory.find(h => h.stageId === execution.currentStageId);
    if (currentHistory) {
      currentHistory.status = 'rejected';
      currentHistory.completedAt = new Date();
      currentHistory.notes = reason;
    }

    this.addAuditEntry(executionId, execution.currentStageId, 'stage_rejected', actorId, actorName, { reason });

    return execution;
  }

  /**
   * Run quality gate
   */
  runQualityGate(
    executionId: string,
    gateId: string,
    report: CollaborativeReport
  ): { passed: boolean; score: number; results: Array<{ checkId: string; passed: boolean; score: number }> } {
    const execution = this.executions.get(executionId);
    if (!execution) return { passed: false, score: 0, results: [] };

    const pipeline = this.pipelines.get(execution.pipelineId);
    const gate = pipeline?.qualityGates.find(g => g.id === gateId);
    if (!gate) return { passed: false, score: 0, results: [] };

    const results: Array<{ checkId: string; passed: boolean; score: number }> = [];
    let totalWeight = 0;
    let weightedScore = 0;

    for (const check of gate.checks) {
      const checkResult = runQualityCheck(check, report);
      results.push({
        checkId: check.id,
        passed: checkResult.passed,
        score: checkResult.score
      });

      totalWeight += check.weight;
      weightedScore += checkResult.score * check.weight;
    }

    const finalScore = totalWeight > 0 ? weightedScore / totalWeight : 0;
    const passed = finalScore >= gate.passThreshold;

    return { passed, score: finalScore, results };
  }

  /**
   * Add audit log entry
   */
  private addAuditEntry(
    executionId: string,
    stageId: string | undefined,
    action: string,
    actorId: string,
    actorName: string,
    details: Record<string, any>
  ): void {
    this.auditLog.push({
      id: `audit_${Date.now()}`,
      timestamp: new Date(),
      executionId,
      stageId,
      action,
      actorId,
      actorName,
      details
    });
  }

  /**
   * Get audit log for execution
   */
  getAuditLog(executionId: string): AuditLogEntry[] {
    return this.auditLog.filter(e => e.executionId === executionId);
  }

  /**
   * Get pipeline by ID
   */
  getPipeline(id: string): OrgPipeline | undefined {
    return this.pipelines.get(id);
  }

  /**
   * Get execution by ID
   */
  getExecution(id: string): PipelineExecution | undefined {
    return this.executions.get(id);
  }

  /**
   * Get organization pipelines
   */
  getOrgPipelines(organizationId: string): OrgPipeline[] {
    return Array.from(this.pipelines.values())
      .filter(p => p.organizationId === organizationId);
  }
}

function runQualityCheck(
  check: QualityCheck,
  report: CollaborativeReport
): { passed: boolean; score: number } {
  switch (check.type) {
    case 'completeness': {
      const minSections = check.config.minSections || 3;
      const actualSections = report.sections.length;
      const score = Math.min(actualSections / minSections, 1);
      return { passed: score >= 1, score };
    }

    case 'length': {
      const minWords = check.config.minWords || 100;
      const totalWords = report.sections.reduce((sum, s) =>
        sum + s.content.split(/\s+/).length, 0);
      const score = Math.min(totalWords / minWords, 1);
      return { passed: score >= 1, score };
    }

    case 'sections': {
      const requiredSections = check.config.required || [];
      const actualIds = report.sections.map(s => s.id);
      const hasAll = requiredSections.every((id: string) => actualIds.includes(id));
      const score = hasAll ? 1 : requiredSections.filter((id: string) => actualIds.includes(id)).length / requiredSections.length;
      return { passed: hasAll, score };
    }

    default:
      return { passed: true, score: 1 };
  }
}

// ==================== EXPORTS ====================

export {
  CloudLibraryManager,
  TeamTemplateManager,
  PipelineManager
};
