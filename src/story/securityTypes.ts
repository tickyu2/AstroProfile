/**
 * Cathedral Security Layer Types (大教堂安全层类型)
 *
 * The warded gate, the sanctum shield, the invisible lattice of protections
 * that keeps the entire metaphysics cathedral pure, intact, and incorruptible.
 *
 * Six Shields:
 * 1. Module Integrity Shield (模块完整性护盾)
 * 2. Memory Sanctity Shield (记忆神圣护盾)
 * 3. Flow Integrity Shield (流动完整性护盾)
 * 4. Orchestration Guard (编排守卫)
 * 5. Knowledge Graph Shield (知识图谱护盾)
 * 6. Sandbox Boundary Shield (沙盒边界护盾)
 */

// ============================================================================
// 🜁 1. MODULE INTEGRITY SHIELD (模块完整性护盾)
// ============================================================================

/**
 * Module categories that can be validated
 */
export type ValidatableModule =
  | 'chart'
  | 'timing'
  | 'story'
  | 'ritual'
  | 'simulation'
  | 'environmental'
  | 'memory'
  | 'orchestration';

/**
 * Validation severity levels
 */
export type ValidationSeverity =
  | 'error'     // Must fix - blocks execution
  | 'warning'   // Should fix - may cause issues
  | 'info';     // Informational - best practice

/**
 * A validation rule
 */
export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  module: ValidatableModule | '*';
  severity: ValidationSeverity;
  validator: string;           // Function name or expression
  enabled: boolean;
  autoFix?: boolean;
}

/**
 * A validation result
 */
export interface ValidationResult {
  ruleId: string;
  ruleName: string;
  passed: boolean;
  severity: ValidationSeverity;
  message: string;
  path?: string;               // JSON path to invalid field
  actualValue?: unknown;
  expectedValue?: unknown;
  suggestion?: string;
  autoFixApplied?: boolean;
}

/**
 * Input validation configuration
 */
export interface InputValidationConfig {
  enabled: boolean;
  strictMode: boolean;         // Fail on any error
  validateTypes: boolean;
  validateRanges: boolean;
  validateSchemas: boolean;
  validateGraphAlignment: boolean;
  maxErrors: number;
  rules: ValidationRule[];
}

/**
 * Input validation report
 */
export interface InputValidationReport {
  module: ValidatableModule;
  inputHash: string;
  timestamp: Date;
  valid: boolean;
  results: ValidationResult[];
  errorCount: number;
  warningCount: number;
  infoCount: number;
  executionTime: number;
}

/**
 * Output verification configuration
 */
export interface OutputVerificationConfig {
  enabled: boolean;
  verifyStructure: boolean;
  verifyTimingConsistency: boolean;
  verifyStoryValidity: boolean;
  verifyRitualScores: boolean;
  maxDeviationAllowed: number;
}

/**
 * Output verification result
 */
export interface OutputVerificationResult {
  module: ValidatableModule;
  outputHash: string;
  timestamp: Date;
  verified: boolean;
  structureValid: boolean;
  timingConsistent: boolean;
  storyValid: boolean;
  ritualScoresValid: boolean;
  deviations: OutputDeviation[];
  recommendations: string[];
}

/**
 * A deviation found in output
 */
export interface OutputDeviation {
  field: string;
  expected: unknown;
  actual: unknown;
  deviation: number;
  severity: ValidationSeverity;
  description: string;
}

/**
 * Dependency graph for modules
 */
export interface ModuleDependencyGraph {
  nodes: ModuleDependencyNode[];
  edges: ModuleDependencyEdge[];
  cycles: string[][];          // Detected circular dependencies
  orphans: string[];           // Modules with no dependents
  roots: string[];             // Entry point modules
}

/**
 * A node in the dependency graph
 */
export interface ModuleDependencyNode {
  id: string;
  module: ValidatableModule;
  version: string;
  status: 'valid' | 'invalid' | 'missing';
}

/**
 * An edge in the dependency graph
 */
export interface ModuleDependencyEdge {
  from: string;
  to: string;
  type: 'requires' | 'optional' | 'provides';
  satisfied: boolean;
}

/**
 * Module integrity status
 */
export interface ModuleIntegrityStatus {
  module: ValidatableModule;
  timestamp: Date;
  inputValid: boolean;
  outputVerified: boolean;
  dependenciesMet: boolean;
  overallStatus: 'healthy' | 'degraded' | 'compromised';
  lastValidation?: InputValidationReport;
  lastVerification?: OutputVerificationResult;
  issues: ModuleIntegrityIssue[];
}

/**
 * A module integrity issue
 */
export interface ModuleIntegrityIssue {
  id: string;
  type: 'validation' | 'verification' | 'dependency';
  severity: ValidationSeverity;
  message: string;
  detectedAt: Date;
  resolvedAt?: Date;
  autoResolved: boolean;
}

// ============================================================================
// 🜂 2. MEMORY SANCTITY SHIELD (记忆神圣护盾)
// ============================================================================

/**
 * Memory entry types
 */
export type MemoryEntryType =
  | 'story'
  | 'cycle'
  | 'pattern'
  | 'archetype'
  | 'emotion'
  | 'ritual'
  | 'lifecycle'
  | 'generational';

/**
 * Write gate status
 */
export type WriteGateStatus =
  | 'open'       // Writes allowed
  | 'guarded'    // Writes require validation
  | 'sealed';    // No writes allowed

/**
 * Memory write request
 */
export interface MemoryWriteRequest {
  id: string;
  entryType: MemoryEntryType;
  data: unknown;
  source: string;              // Module or process requesting write
  timestamp: Date;
  priority: 'low' | 'normal' | 'high' | 'critical';
  metadata: Record<string, unknown>;
}

/**
 * Memory write validation result
 */
export interface MemoryWriteValidation {
  requestId: string;
  approved: boolean;
  schemaValid: boolean;
  patternIntegrityValid: boolean;
  temporalOrderValid: boolean;
  narrativeCoherenceValid: boolean;
  rejectionReasons: string[];
  warnings: string[];
}

/**
 * Memory sanctity configuration
 */
export interface MemorySanctityConfig {
  writeGateStatus: WriteGateStatus;
  enforceImmutability: boolean;
  isolateExperimental: boolean;
  enableHashing: boolean;
  hashAlgorithm: 'sha256' | 'sha512' | 'xxhash';
  maxWritesPerMinute: number;
  requireApproval: boolean;
  approvalThreshold: number;   // Number of checks that must pass
}

/**
 * Memory entry with integrity data
 */
export interface SecureMemoryEntry {
  id: string;
  entryType: MemoryEntryType;
  data: unknown;
  createdAt: Date;
  modifiedAt: Date;
  version: number;
  hash: string;
  previousHash?: string;       // Chain integrity
  source: string;
  isImmutable: boolean;
  isExperimental: boolean;
  integrityStatus: 'valid' | 'tampered' | 'corrupted';
}

/**
 * Memory audit log entry
 */
export interface MemoryAuditEntry {
  id: string;
  timestamp: Date;
  action: 'create' | 'read' | 'update' | 'delete' | 'verify';
  entryId: string;
  entryType: MemoryEntryType;
  source: string;
  approved: boolean;
  validationResult?: MemoryWriteValidation;
  hashBefore?: string;
  hashAfter?: string;
}

/**
 * Pattern isolation configuration
 */
export interface PatternIsolationConfig {
  enabled: boolean;
  experimentalPrefix: string;
  productionPrefix: string;
  crossContaminationCheck: boolean;
  quarantineDuration: number;  // Ms before experimental can be promoted
}

/**
 * Memory sanctity status
 */
export interface MemorySanctityStatus {
  timestamp: Date;
  totalEntries: number;
  validEntries: number;
  tamperedEntries: number;
  corruptedEntries: number;
  experimentalEntries: number;
  lastVerification: Date;
  chainIntact: boolean;
  writeGateStatus: WriteGateStatus;
  recentAudits: MemoryAuditEntry[];
}

// ============================================================================
// 🜃 3. FLOW INTEGRITY SHIELD (流动完整性护盾)
// ============================================================================

/**
 * Flow types in the cathedral
 */
export type FlowType =
  | 'data'
  | 'timing'
  | 'narrative'
  | 'ritual'
  | 'orchestration'
  | 'memory'
  | 'ui';

/**
 * Flow health status
 */
export type FlowHealthStatus =
  | 'healthy'      // Operating normally
  | 'degraded'     // Reduced performance
  | 'broken'       // Not functioning
  | 'quarantined'; // Isolated due to issues

/**
 * A flow definition
 */
export interface SecureFlow {
  id: string;
  type: FlowType;
  source: string;
  target: string;
  transformations: FlowTransformation[];
  validatedAt?: Date;
  healthStatus: FlowHealthStatus;
  lastError?: FlowError;
}

/**
 * A transformation in a flow
 */
export interface FlowTransformation {
  id: string;
  name: string;
  inputType: string;
  outputType: string;
  validated: boolean;
}

/**
 * A flow error
 */
export interface FlowError {
  flowId: string;
  timestamp: Date;
  type: 'broken' | 'missing_output' | 'unexpected_null' | 'timing_mismatch' | 'type_mismatch';
  message: string;
  source: string;
  target: string;
  actualValue?: unknown;
  expectedType?: string;
  recoverable: boolean;
}

/**
 * Flow validation configuration
 */
export interface FlowValidationConfig {
  enabled: boolean;
  validateModules: boolean;
  validateTypes: boolean;
  validateTransformations: boolean;
  realTimeMonitoring: boolean;
  monitoringIntervalMs: number;
  autoQuarantine: boolean;
  quarantineThreshold: number; // Errors before quarantine
}

/**
 * Flow monitoring result
 */
export interface FlowMonitoringResult {
  flowId: string;
  timestamp: Date;
  healthStatus: FlowHealthStatus;
  latency: number;
  throughput: number;
  errorRate: number;
  lastSuccess?: Date;
  lastError?: FlowError;
  anomalies: FlowAnomaly[];
}

/**
 * A flow anomaly
 */
export interface FlowAnomaly {
  id: string;
  flowId: string;
  timestamp: Date;
  type: 'latency_spike' | 'throughput_drop' | 'error_burst' | 'pattern_deviation';
  severity: ValidationSeverity;
  description: string;
  metrics: Record<string, number>;
}

/**
 * Flow quarantine entry
 */
export interface FlowQuarantineEntry {
  flowId: string;
  quarantinedAt: Date;
  reason: string;
  errors: FlowError[];
  recoveryAttempts: number;
  lastRecoveryAttempt?: Date;
  status: 'quarantined' | 'recovering' | 'released';
}

/**
 * Flow integrity status
 */
export interface FlowIntegrityStatus {
  timestamp: Date;
  totalFlows: number;
  healthyFlows: number;
  degradedFlows: number;
  brokenFlows: number;
  quarantinedFlows: number;
  recentErrors: FlowError[];
  quarantine: FlowQuarantineEntry[];
}

// ============================================================================
// 🜄 4. ORCHESTRATION GUARD (编排守卫)
// ============================================================================

/**
 * Pipeline verification status
 */
export type PipelineVerificationStatus =
  | 'verified'
  | 'unverified'
  | 'failed'
  | 'expired';

/**
 * Secure pipeline definition
 */
export interface SecurePipeline {
  id: string;
  name: string;
  version: string;
  steps: SecurePipelineStep[];
  signature: string;           // Cryptographic signature
  signedAt: Date;
  signedBy: string;
  verificationStatus: PipelineVerificationStatus;
  lastVerified?: Date;
}

/**
 * A secure pipeline step
 */
export interface SecurePipelineStep {
  id: string;
  name: string;
  module: ValidatableModule;
  inputSchema: string;
  outputSchema: string;
  dependencies: string[];
  conditions: PipelineCondition[];
  validated: boolean;
  sandboxed: boolean;
}

/**
 * A pipeline condition
 */
export interface PipelineCondition {
  id: string;
  type: 'input' | 'state' | 'timing' | 'memory';
  expression: string;
  required: boolean;
}

/**
 * Pipeline verification result
 */
export interface PipelineVerificationResult {
  pipelineId: string;
  timestamp: Date;
  verified: boolean;
  stepsValidated: boolean;
  dependenciesResolved: boolean;
  conditionsTypeChecked: boolean;
  signatureValid: boolean;
  issues: PipelineIssue[];
}

/**
 * A pipeline issue
 */
export interface PipelineIssue {
  stepId?: string;
  type: 'validation' | 'dependency' | 'condition' | 'signature';
  severity: ValidationSeverity;
  message: string;
  suggestion?: string;
}

/**
 * Execution sandbox configuration
 */
export interface ExecutionSandboxConfig {
  enabled: boolean;
  isolateMemory: boolean;
  isolateFlows: boolean;
  timeoutMs: number;
  maxMemoryBytes: number;
  allowedModules: ValidatableModule[];
  blockedOperations: string[];
}

/**
 * Failure containment configuration
 */
export interface FailureContainmentConfig {
  enabled: boolean;
  haltDownstream: boolean;
  protectUpstreamMemory: boolean;
  triggerRecoveryRitual: boolean;
  maxRetries: number;
  retryDelayMs: number;
  escalationThreshold: number;
}

/**
 * Pipeline failure event
 */
export interface PipelineFailureEvent {
  pipelineId: string;
  stepId: string;
  timestamp: Date;
  error: string;
  errorType: string;
  downstreamHalted: string[];
  memoryProtected: boolean;
  recoveryTriggered: boolean;
  recovered: boolean;
  recoveredAt?: Date;
}

/**
 * Orchestration guard status
 */
export interface OrchestrationGuardStatus {
  timestamp: Date;
  totalPipelines: number;
  verifiedPipelines: number;
  unverifiedPipelines: number;
  failedPipelines: number;
  activeSandboxes: number;
  recentFailures: PipelineFailureEvent[];
  recoveryInProgress: string[];
}

// ============================================================================
// 🜅 5. KNOWLEDGE GRAPH SHIELD (知识图谱护盾)
// ============================================================================

/**
 * Graph node categories
 */
export type GraphNodeCategory =
  | 'module'
  | 'type'
  | 'flow'
  | 'narrative'
  | 'ui'
  | 'ritual'
  | 'timing'
  | 'memory';

/**
 * Graph validation rule
 */
export interface GraphValidationRule {
  id: string;
  name: string;
  description: string;
  category: GraphNodeCategory | '*';
  validator: string;
  severity: ValidationSeverity;
  enabled: boolean;
}

/**
 * Graph validation result
 */
export interface GraphValidationResult {
  timestamp: Date;
  valid: boolean;
  invalidNodes: InvalidGraphNode[];
  invalidEdges: InvalidGraphEdge[];
  orphanedModules: string[];
  brokenFlows: string[];
  totalNodes: number;
  totalEdges: number;
  executionTime: number;
}

/**
 * An invalid graph node
 */
export interface InvalidGraphNode {
  nodeId: string;
  category: GraphNodeCategory;
  ruleId: string;
  severity: ValidationSeverity;
  message: string;
  suggestion?: string;
}

/**
 * An invalid graph edge
 */
export interface InvalidGraphEdge {
  edgeId: string;
  fromNode: string;
  toNode: string;
  ruleId: string;
  severity: ValidationSeverity;
  message: string;
  suggestion?: string;
}

/**
 * Schema enforcement configuration
 */
export interface SchemaEnforcementConfig {
  enabled: boolean;
  strictMode: boolean;
  schemas: Record<GraphNodeCategory, string>;  // JSON Schema per category
  allowUnknownProperties: boolean;
  validateOnCreate: boolean;
  validateOnUpdate: boolean;
}

/**
 * Graph diff analysis
 */
export interface GraphDiffAnalysis {
  timestamp: Date;
  addedNodes: string[];
  removedNodes: string[];
  modifiedNodes: string[];
  addedEdges: string[];
  removedEdges: string[];
  structuralChanges: StructuralChange[];
  dependencyImpact: DependencyImpact[];
  orchestrationCompatible: boolean;
  approved: boolean;
  approvedBy?: string;
  approvedAt?: Date;
}

/**
 * A structural change in the graph
 */
export interface StructuralChange {
  type: 'node_added' | 'node_removed' | 'edge_added' | 'edge_removed' | 'property_changed';
  nodeId?: string;
  edgeId?: string;
  property?: string;
  oldValue?: unknown;
  newValue?: unknown;
  impact: 'none' | 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Dependency impact analysis
 */
export interface DependencyImpact {
  moduleId: string;
  impactType: 'broken' | 'degraded' | 'enhanced' | 'unaffected';
  reason: string;
  affectedFlows: string[];
  affectedPipelines: string[];
}

/**
 * Knowledge graph shield status
 */
export interface KnowledgeGraphShieldStatus {
  timestamp: Date;
  lastValidation: GraphValidationResult;
  pendingDiffs: GraphDiffAnalysis[];
  schemaEnforcementActive: boolean;
  nodeCount: number;
  edgeCount: number;
  invalidNodeCount: number;
  invalidEdgeCount: number;
}

// ============================================================================
// 🜆 6. SANDBOX BOUNDARY SHIELD (沙盒边界护盾)
// ============================================================================

/**
 * Sandbox isolation level
 */
export type SandboxIsolationLevel =
  | 'none'       // No isolation (dangerous)
  | 'soft'       // Logical separation
  | 'hard'       // Complete isolation
  | 'sealed';    // No communication allowed

/**
 * Sandbox boundary configuration
 */
export interface SandboxBoundaryConfig {
  isolationLevel: SandboxIsolationLevel;
  memoryIsolation: boolean;
  flowContainment: boolean;
  graphForking: boolean;
  requireMergeApproval: boolean;
  mergeValidationRules: ValidationRule[];
  quarantinePeriodMs: number;
}

/**
 * Sandbox memory partition
 */
export interface SandboxMemoryPartition {
  sandboxId: string;
  partitionId: string;
  createdAt: Date;
  sizeBytes: number;
  entryCount: number;
  isolated: boolean;
  contaminated: boolean;
  lastAccess: Date;
}

/**
 * Flow containment status
 */
export interface FlowContainmentStatus {
  sandboxId: string;
  containedFlows: string[];
  escapedFlows: string[];
  containmentIntact: boolean;
  lastCheck: Date;
  violations: FlowContainmentViolation[];
}

/**
 * A flow containment violation
 */
export interface FlowContainmentViolation {
  id: string;
  flowId: string;
  timestamp: Date;
  type: 'escape_attempt' | 'cross_contamination' | 'unauthorized_access';
  source: string;
  target: string;
  blocked: boolean;
  severity: ValidationSeverity;
}

/**
 * Forked graph info
 */
export interface ForkedGraph {
  sandboxId: string;
  forkId: string;
  forkedAt: Date;
  baseVersion: string;
  currentVersion: string;
  nodesDiverged: number;
  edgesDiverged: number;
  canMerge: boolean;
  mergeConflicts: MergeConflict[];
}

/**
 * A merge conflict
 */
export interface MergeConflict {
  id: string;
  type: 'node' | 'edge' | 'property';
  path: string;
  sandboxValue: unknown;
  productionValue: unknown;
  resolution?: 'use_sandbox' | 'use_production' | 'manual';
  resolvedBy?: string;
  resolvedAt?: Date;
}

/**
 * Merge request
 */
export interface SandboxMergeRequest {
  id: string;
  sandboxId: string;
  requestedBy: string;
  requestedAt: Date;
  status: 'pending' | 'validating' | 'approved' | 'rejected' | 'merged';
  validationResult?: MergeValidationResult;
  approvedBy?: string;
  approvedAt?: Date;
  mergedAt?: Date;
  changes: SandboxChange[];
}

/**
 * A change to merge from sandbox
 */
export interface SandboxChange {
  type: 'memory' | 'flow' | 'graph' | 'pipeline';
  operation: 'add' | 'update' | 'delete';
  targetId: string;
  before?: unknown;
  after?: unknown;
}

/**
 * Merge validation result
 */
export interface MergeValidationResult {
  requestId: string;
  timestamp: Date;
  valid: boolean;
  testsPass: boolean;
  reviewComplete: boolean;
  blessingGranted: boolean;
  issues: MergeIssue[];
  recommendations: string[];
}

/**
 * A merge issue
 */
export interface MergeIssue {
  changeId: string;
  severity: ValidationSeverity;
  type: 'conflict' | 'validation' | 'dependency' | 'policy';
  message: string;
  suggestion?: string;
}

/**
 * Sandbox boundary status
 */
export interface SandboxBoundaryStatus {
  timestamp: Date;
  activeSandboxes: number;
  isolatedMemoryPartitions: SandboxMemoryPartition[];
  flowContainmentStatus: FlowContainmentStatus[];
  forkedGraphs: ForkedGraph[];
  pendingMerges: SandboxMergeRequest[];
  recentViolations: FlowContainmentViolation[];
}

// ============================================================================
// 🌟 7. SECURITY RITUALS (安全仪式)
// ============================================================================

/**
 * Security ritual types
 */
export type SecurityRitualType =
  | 'integrity'     // 完整性仪式 - Validate all modules, flows, schemas
  | 'purification'  // 净化仪式 - Remove stale, invalid, orphaned
  | 'blessing';     // 祝圣仪式 - Approve new modules, pipelines, templates

/**
 * Security ritual definition
 */
export interface SecurityRitual {
  type: SecurityRitualType;
  name: string;
  nameChinese: string;
  description: string;
  steps: SecurityRitualStep[];
  estimatedDuration: number;
  requiresApproval: boolean;
  canRollback: boolean;
}

/**
 * A step in a security ritual
 */
export interface SecurityRitualStep {
  id: string;
  name: string;
  action: string;
  order: number;
  critical: boolean;
  rollbackable: boolean;
  timeout: number;
}

/**
 * Security ritual execution
 */
export interface SecurityRitualExecution {
  ritualType: SecurityRitualType;
  startedAt: Date;
  completedAt?: Date;
  status: 'running' | 'completed' | 'failed' | 'rolled_back';
  stepsCompleted: string[];
  stepsFailed: string[];
  findings: SecurityFinding[];
  actions: SecurityAction[];
  initiatedBy: string;
  approvedBy?: string;
}

/**
 * A security finding
 */
export interface SecurityFinding {
  id: string;
  timestamp: Date;
  category: 'module' | 'memory' | 'flow' | 'orchestration' | 'graph' | 'sandbox';
  severity: ValidationSeverity;
  title: string;
  description: string;
  affectedComponents: string[];
  remediation?: string;
  resolved: boolean;
  resolvedAt?: Date;
}

/**
 * A security action taken
 */
export interface SecurityAction {
  id: string;
  timestamp: Date;
  type: 'removed' | 'quarantined' | 'repaired' | 'approved' | 'rejected';
  target: string;
  targetType: 'module' | 'memory' | 'flow' | 'pipeline' | 'node' | 'edge';
  reason: string;
  reversible: boolean;
  reversedAt?: Date;
}

/**
 * Predefined security rituals
 */
export const SECURITY_RITUALS: SecurityRitual[] = [
  {
    type: 'integrity',
    name: 'Integrity Ritual',
    nameChinese: '完整性仪式',
    description: 'Validate all modules, flows, and memory schemas',
    steps: [
      { id: 'validate-modules', name: 'Validate All Modules', action: 'validateModules', order: 1, critical: true, rollbackable: false, timeout: 30000 },
      { id: 'validate-flows', name: 'Validate All Flows', action: 'validateFlows', order: 2, critical: true, rollbackable: false, timeout: 30000 },
      { id: 'validate-memory', name: 'Validate Memory Schemas', action: 'validateMemory', order: 3, critical: true, rollbackable: false, timeout: 30000 },
      { id: 'verify-graph', name: 'Verify Knowledge Graph', action: 'verifyGraph', order: 4, critical: true, rollbackable: false, timeout: 30000 },
      { id: 'check-dependencies', name: 'Check Dependencies', action: 'checkDependencies', order: 5, critical: false, rollbackable: false, timeout: 15000 },
    ],
    estimatedDuration: 120000,
    requiresApproval: false,
    canRollback: false,
  },
  {
    type: 'purification',
    name: 'Purification Ritual',
    nameChinese: '净化仪式',
    description: 'Remove stale flows, invalid patterns, orphaned nodes',
    steps: [
      { id: 'identify-stale', name: 'Identify Stale Flows', action: 'identifyStaleFlows', order: 1, critical: false, rollbackable: false, timeout: 15000 },
      { id: 'quarantine-broken', name: 'Quarantine Broken Flows', action: 'quarantineBrokenFlows', order: 2, critical: true, rollbackable: true, timeout: 15000 },
      { id: 'remove-invalid', name: 'Remove Invalid Patterns', action: 'removeInvalidPatterns', order: 3, critical: true, rollbackable: true, timeout: 30000 },
      { id: 'prune-orphans', name: 'Prune Orphaned Nodes', action: 'pruneOrphanedNodes', order: 4, critical: false, rollbackable: true, timeout: 30000 },
      { id: 'compact-memory', name: 'Compact Memory', action: 'compactMemory', order: 5, critical: false, rollbackable: false, timeout: 30000 },
    ],
    estimatedDuration: 120000,
    requiresApproval: true,
    canRollback: true,
  },
  {
    type: 'blessing',
    name: 'Blessing Ritual',
    nameChinese: '祝圣仪式',
    description: 'Approve new modules, pipelines, and story templates',
    steps: [
      { id: 'review-modules', name: 'Review New Modules', action: 'reviewNewModules', order: 1, critical: true, rollbackable: true, timeout: 60000 },
      { id: 'verify-pipelines', name: 'Verify New Pipelines', action: 'verifyNewPipelines', order: 2, critical: true, rollbackable: true, timeout: 60000 },
      { id: 'test-templates', name: 'Test Story Templates', action: 'testStoryTemplates', order: 3, critical: false, rollbackable: true, timeout: 60000 },
      { id: 'sign-approved', name: 'Sign Approved Components', action: 'signApprovedComponents', order: 4, critical: true, rollbackable: true, timeout: 15000 },
      { id: 'promote', name: 'Promote to Production', action: 'promoteToProduction', order: 5, critical: true, rollbackable: true, timeout: 30000 },
    ],
    estimatedDuration: 240000,
    requiresApproval: true,
    canRollback: true,
  },
];

// ============================================================================
// SECURITY ENGINE STATE
// ============================================================================

/**
 * Security threat level
 */
export type ThreatLevel =
  | 'none'       // No threats detected
  | 'low'        // Minor issues
  | 'elevated'   // Notable concerns
  | 'high'       // Active threats
  | 'critical';  // Immediate action required

/**
 * Security event types
 */
export type SecurityEventType =
  | 'validation_failed'
  | 'verification_failed'
  | 'memory_tampered'
  | 'flow_broken'
  | 'pipeline_failed'
  | 'graph_corrupted'
  | 'sandbox_violation'
  | 'ritual_started'
  | 'ritual_completed'
  | 'finding_detected'
  | 'action_taken';

/**
 * A security event
 */
export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  timestamp: Date;
  severity: ValidationSeverity;
  source: string;
  message: string;
  data: Record<string, unknown>;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
}

/**
 * Security event listener
 */
export type SecurityEventListener = (event: SecurityEvent) => void;

/**
 * Complete security engine state
 */
export interface SecurityEngineState {
  // Configuration
  moduleIntegrityConfig: InputValidationConfig;
  memorySanctityConfig: MemorySanctityConfig;
  flowValidationConfig: FlowValidationConfig;
  executionSandboxConfig: ExecutionSandboxConfig;
  failureContainmentConfig: FailureContainmentConfig;
  schemaEnforcementConfig: SchemaEnforcementConfig;
  sandboxBoundaryConfig: SandboxBoundaryConfig;

  // Status
  isActive: boolean;
  threatLevel: ThreatLevel;
  lastScan: Date;
  lastRitual: Date;

  // Shield statuses
  moduleIntegrityStatus: ModuleIntegrityStatus[];
  memorySanctityStatus: MemorySanctityStatus;
  flowIntegrityStatus: FlowIntegrityStatus;
  orchestrationGuardStatus: OrchestrationGuardStatus;
  knowledgeGraphShieldStatus: KnowledgeGraphShieldStatus;
  sandboxBoundaryStatus: SandboxBoundaryStatus;

  // Activity
  recentEvents: SecurityEvent[];
  recentFindings: SecurityFinding[];
  activeRitual?: SecurityRitualExecution;
  ritualHistory: SecurityRitualExecution[];
}

// ============================================================================
// CHINESE LABELS
// ============================================================================

export const SHIELD_CHINESE: Record<string, string> = {
  moduleIntegrity: '模块完整性护盾',
  memorySanctity: '记忆神圣护盾',
  flowIntegrity: '流动完整性护盾',
  orchestrationGuard: '编排守卫',
  knowledgeGraphShield: '知识图谱护盾',
  sandboxBoundary: '沙盒边界护盾',
};

export const SHIELD_DESCRIPTIONS: Record<string, string> = {
  moduleIntegrity: 'Input validation, output verification, dependency enforcement',
  memorySanctity: 'Write gates, immutable history, pattern isolation, cryptographic hashing',
  flowIntegrity: 'Flow validation, monitoring, quarantine',
  orchestrationGuard: 'Pipeline verification, execution sandboxing, failure containment',
  knowledgeGraphShield: 'Graph validation, schema enforcement, diff protection',
  sandboxBoundary: 'Hard isolation, flow containment, graph forking, safe merging',
};

export const RITUAL_CHINESE: Record<SecurityRitualType, string> = {
  integrity: '完整性仪式',
  purification: '净化仪式',
  blessing: '祝圣仪式',
};

export const RITUAL_DESCRIPTIONS: Record<SecurityRitualType, string> = {
  integrity: 'Validate all modules, flows, and memory schemas',
  purification: 'Remove stale flows, invalid patterns, orphaned nodes',
  blessing: 'Approve new modules, pipelines, and story templates',
};

export const THREAT_LEVEL_CHINESE: Record<ThreatLevel, string> = {
  none: '无威胁',
  low: '低风险',
  elevated: '中等风险',
  high: '高风险',
  critical: '紧急',
};

export const WRITE_GATE_CHINESE: Record<WriteGateStatus, string> = {
  open: '开放',
  guarded: '守护',
  sealed: '封印',
};
