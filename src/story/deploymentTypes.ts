/**
 * ============================================================================
 * CATHEDRAL DEPLOYMENT LAYER - TYPE DEFINITIONS (大教堂部署层类型)
 * ============================================================================
 *
 * The foundation stone beneath the entire cathedral.
 * Where the sacred architecture becomes a living, breathing system.
 *
 * Six Pillars:
 * - Runtime Architecture (运行架构)
 * - Deployment Topology (部署拓扑)
 * - Deployment Modes (部署模式)
 * - Scaling Strategy (扩展策略)
 * - Reliability & Health (可靠性与健康)
 * - Deployment Rituals (部署仪式)
 *
 * This is where your cathedral becomes production-ready.
 *
 * Created: January 2026
 * ============================================================================
 */

import type { ModuleId } from './orchestrationTypes';

// ============================================================================
// RUNTIME PLANES
// ============================================================================

export type RuntimePlane = 'compute' | 'data' | 'presentation';

export const RUNTIME_PLANE_CHINESE: Record<RuntimePlane, string> = {
  compute: '计算平面',
  data: '数据平面',
  presentation: '展示平面'
};

export const RUNTIME_PLANE_DESCRIPTIONS: Record<RuntimePlane, {
  en: string;
  zh: string;
  purpose: string;
  components: string[];
}> = {
  compute: {
    en: 'Compute Plane',
    zh: '计算平面',
    purpose: 'Where engines run - chart, timing, story, ritual, simulation',
    components: ['Chart Engines', 'Timing Engines', 'Story Engines', 'Ritual Engines', 'Simulation Engines', 'Orchestration Pipelines']
  },
  data: {
    en: 'Data Plane',
    zh: '数据平面',
    purpose: 'Where memory persists - structural, temporal, narrative, pattern',
    components: ['Structural Memory', 'Temporal Memory', 'Narrative Memory', 'Pattern Memory', 'Knowledge Graph']
  },
  presentation: {
    en: 'Presentation Plane',
    zh: '展示平面',
    purpose: 'Where dashboards render - relationship, story, ritual, simulation',
    components: ['Relationship Dashboard', 'Story Dashboard', 'Ritual Dashboard', 'Simulation Dashboard', 'Memory Vault', 'Knowledge Explorer']
  }
};

// ============================================================================
// DEPLOYMENT MODES
// ============================================================================

export type DeploymentMode = 'monolithic' | 'modular' | 'distributed';

export const DEPLOYMENT_MODE_CHINESE: Record<DeploymentMode, string> = {
  monolithic: '单体模式',
  modular: '模块模式',
  distributed: '分布式模式'
};

export const DEPLOYMENT_MODE_DESCRIPTIONS: Record<DeploymentMode, {
  en: string;
  zh: string;
  useCase: string;
  characteristics: string[];
}> = {
  monolithic: {
    en: 'Monolithic Mode',
    zh: '单体模式',
    useCase: 'Local development - fast iteration',
    characteristics: ['All modules in one process', 'Hot reload', 'Fast startup', 'Easy debugging']
  },
  modular: {
    en: 'Modular Mode',
    zh: '模块模式',
    useCase: 'Staging - integration testing',
    characteristics: ['Engines separated', 'API layer stable', 'Pipelines testable', 'Database isolated']
  },
  distributed: {
    en: 'Distributed Mode',
    zh: '分布式模式',
    useCase: 'Production - full scale',
    characteristics: ['Engines as microservices', 'Persistent memory', 'Load balancing', 'Auto-scaling']
  }
};

// ============================================================================
// DEPLOYMENT ENVIRONMENTS
// ============================================================================

export type DeploymentEnvironment = 'development' | 'staging' | 'production';

export const DEPLOYMENT_ENV_CHINESE: Record<DeploymentEnvironment, string> = {
  development: '开发环境',
  staging: '预发布环境',
  production: '生产环境'
};

export const DEPLOYMENT_ENV_DESCRIPTIONS: Record<DeploymentEnvironment, {
  en: string;
  zh: string;
  mode: DeploymentMode;
  characteristics: string[];
}> = {
  development: {
    en: 'Development Environment',
    zh: '开发环境',
    mode: 'monolithic',
    characteristics: ['Fast', 'Flexible', 'Experimental', 'Local database']
  },
  staging: {
    en: 'Staging Environment',
    zh: '预发布环境',
    mode: 'modular',
    characteristics: ['Stable', 'Orchestrated', 'Testable', 'Mirrored production data']
  },
  production: {
    en: 'Production Environment',
    zh: '生产环境',
    mode: 'distributed',
    characteristics: ['Sacred', 'Resilient', 'Optimized', 'Full redundancy']
  }
};

// ============================================================================
// SERVICE TOPOLOGY
// ============================================================================

/**
 * A service in the deployment topology
 */
export interface ServiceDefinition {
  id: string;
  name: string;
  nameChinese: string;

  // Runtime plane
  plane: RuntimePlane;

  // Modules this service contains
  modules: ModuleId[];

  // Dependencies
  dependencies: string[];          // Other service IDs

  // Scaling configuration
  scaling: ScalingConfig;

  // Health configuration
  health: HealthConfig;

  // Resource requirements
  resources: ResourceRequirements;
}

/**
 * Complete deployment topology
 */
export interface DeploymentTopology {
  id: string;
  name: string;
  version: string;

  // Environment
  environment: DeploymentEnvironment;
  mode: DeploymentMode;

  // Services
  services: ServiceDefinition[];

  // Layers
  layers: TopologyLayer[];

  // Connections
  connections: TopologyConnection[];

  // Gateway configuration
  gateway: GatewayConfig;

  // Metadata
  metadata: {
    createdAt: string;
    updatedAt: string;
    author?: string;
  };
}

export interface TopologyLayer {
  id: string;
  name: string;
  nameChinese: string;
  order: number;                   // 0 = top (frontend), higher = deeper
  serviceIds: string[];
}

export interface TopologyConnection {
  id: string;
  from: string;                    // Service or layer ID
  to: string;
  protocol: 'http' | 'grpc' | 'websocket' | 'internal';
  description?: string;
}

export interface GatewayConfig {
  host: string;
  port: number;
  basePath: string;
  rateLimit?: {
    requestsPerMinute: number;
    burstSize: number;
  };
  cors?: {
    origins: string[];
    methods: string[];
  };
  auth?: {
    type: 'none' | 'api-key' | 'jwt' | 'oauth';
    config?: Record<string, unknown>;
  };
}

// ============================================================================
// SCALING CONFIGURATION
// ============================================================================

export type ScalingType = 'horizontal' | 'vertical' | 'event-driven';

export const SCALING_TYPE_CHINESE: Record<ScalingType, string> = {
  horizontal: '横向扩展',
  vertical: '纵向扩展',
  'event-driven': '事件驱动扩展'
};

export interface ScalingConfig {
  type: ScalingType;

  // For horizontal scaling
  horizontal?: {
    minReplicas: number;
    maxReplicas: number;
    targetCpuUtilization?: number;
    targetMemoryUtilization?: number;
    scaleUpCooldown?: number;      // Seconds
    scaleDownCooldown?: number;
  };

  // For vertical scaling
  vertical?: {
    minCpu: string;                // e.g., "100m"
    maxCpu: string;
    minMemory: string;             // e.g., "256Mi"
    maxMemory: string;
    autoResize?: boolean;
  };

  // For event-driven scaling
  eventDriven?: {
    triggers: ScalingTrigger[];
    pollingInterval?: number;      // Seconds
    cooldownPeriod?: number;
  };
}

export interface ScalingTrigger {
  type: 'queue-length' | 'schedule' | 'metric' | 'webhook';
  name: string;
  threshold?: number;
  schedule?: string;               // Cron expression
  metricName?: string;
  webhookUrl?: string;
}

export interface ResourceRequirements {
  cpu: {
    request: string;
    limit: string;
  };
  memory: {
    request: string;
    limit: string;
  };
  storage?: {
    type: 'ephemeral' | 'persistent';
    size: string;
    storageClass?: string;
  };
  gpu?: {
    type: string;
    count: number;
  };
}

// ============================================================================
// HEALTH & RELIABILITY
// ============================================================================

export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy' | 'unknown';

export const HEALTH_STATUS_CHINESE: Record<HealthStatus, string> = {
  healthy: '健康',
  degraded: '降级',
  unhealthy: '不健康',
  unknown: '未知'
};

export interface HealthConfig {
  // Liveness probe
  livenessProbe: ProbeConfig;

  // Readiness probe
  readinessProbe: ProbeConfig;

  // Startup probe (optional)
  startupProbe?: ProbeConfig;

  // Circuit breaker
  circuitBreaker: CircuitBreakerConfig;

  // Retry policy
  retryPolicy: RetryPolicy;
}

export interface ProbeConfig {
  type: 'http' | 'tcp' | 'exec';
  path?: string;                   // For HTTP
  port?: number;
  command?: string[];              // For exec
  initialDelaySeconds: number;
  periodSeconds: number;
  timeoutSeconds: number;
  successThreshold: number;
  failureThreshold: number;
}

export interface CircuitBreakerConfig {
  enabled: boolean;
  failureThreshold: number;        // Number of failures before opening
  successThreshold: number;        // Number of successes to close
  timeout: number;                 // Seconds before half-open
  halfOpenRequests: number;        // Requests to allow in half-open state
}

export interface RetryPolicy {
  enabled: boolean;
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  retryableErrors: string[];
}

/**
 * Health check result
 */
export interface HealthCheckResult {
  serviceId: string;
  serviceName: string;
  status: HealthStatus;
  timestamp: string;

  // Metrics
  metrics: {
    latencyMs: number;
    cpuUsage: number;             // 0-100
    memoryUsage: number;          // 0-100
    errorRate: number;            // 0-100
    throughput: number;           // Requests per second
  };

  // Component health
  components: Array<{
    name: string;
    status: HealthStatus;
    message?: string;
  }>;

  // Recent errors
  recentErrors: Array<{
    timestamp: string;
    error: string;
    count: number;
  }>;
}

/**
 * Circuit breaker state
 */
export interface CircuitBreakerState {
  serviceId: string;
  state: 'closed' | 'open' | 'half-open';
  failureCount: number;
  successCount: number;
  lastFailure?: string;
  lastSuccess?: string;
  openedAt?: string;
  nextRetryAt?: string;
}

// ============================================================================
// DEPLOYMENT RITUALS
// ============================================================================

export type DeploymentRitualType = 'release' | 'migration' | 'purification' | 'rollback';

export const DEPLOYMENT_RITUAL_CHINESE: Record<DeploymentRitualType, string> = {
  release: '发布仪式',
  migration: '迁移仪式',
  purification: '净化仪式',
  rollback: '回滚仪式'
};

export const DEPLOYMENT_RITUAL_DESCRIPTIONS: Record<DeploymentRitualType, {
  en: string;
  zh: string;
  steps: string[];
}> = {
  release: {
    en: 'Release Ritual',
    zh: '发布仪式',
    steps: ['Version bump', 'Knowledge graph update', 'API validation', 'Pipeline test', 'Canary release', 'Full rollout']
  },
  migration: {
    en: 'Migration Ritual',
    zh: '迁移仪式',
    steps: ['Schema evolution', 'Pattern recalibration', 'Story retraining', 'Data validation', 'Cutover']
  },
  purification: {
    en: 'Purification Ritual',
    zh: '净化仪式',
    steps: ['Cache invalidation', 'Pattern pruning', 'Archive compression', 'Index optimization', 'Health verification']
  },
  rollback: {
    en: 'Rollback Ritual',
    zh: '回滚仪式',
    steps: ['Stop traffic', 'Restore previous version', 'Validate health', 'Resume traffic', 'Post-mortem']
  }
};

/**
 * A deployment ritual definition
 */
export interface DeploymentRitual {
  id: string;
  type: DeploymentRitualType;
  name: string;
  nameChinese: string;

  // Steps
  steps: RitualStep[];

  // Pre-conditions
  preConditions: RitualCondition[];

  // Post-conditions
  postConditions: RitualCondition[];

  // Rollback steps (if ritual fails)
  rollbackSteps?: RitualStep[];

  // Notifications
  notifications: NotificationConfig;

  // Approval
  requiresApproval: boolean;
  approvers?: string[];
}

export interface RitualStep {
  id: string;
  name: string;
  nameChinese: string;
  order: number;

  // Action
  action: RitualAction;

  // Timeout
  timeoutSeconds: number;

  // On failure
  onFailure: 'abort' | 'continue' | 'rollback';

  // Validation
  validation?: RitualValidation;
}

export type RitualAction =
  | { type: 'command'; command: string; args?: string[] }
  | { type: 'api-call'; endpoint: string; method: string; body?: unknown }
  | { type: 'script'; path: string; interpreter?: string }
  | { type: 'wait'; durationSeconds: number }
  | { type: 'approval'; message: string }
  | { type: 'custom'; handler: string };

export interface RitualCondition {
  name: string;
  check: ConditionCheck;
  required: boolean;
}

export type ConditionCheck =
  | { type: 'health'; serviceId: string; expectedStatus: HealthStatus }
  | { type: 'metric'; metricName: string; operator: '<' | '>' | '=' | '<=' | '>='; value: number }
  | { type: 'version'; serviceId: string; operator: '<' | '>' | '=' | '!=' | '>=' | '<='; version: string }
  | { type: 'custom'; handler: string };

export interface RitualValidation {
  type: 'health-check' | 'smoke-test' | 'metric-check' | 'custom';
  config: Record<string, unknown>;
}

export interface NotificationConfig {
  onStart: NotificationChannel[];
  onSuccess: NotificationChannel[];
  onFailure: NotificationChannel[];
  onRollback: NotificationChannel[];
}

export interface NotificationChannel {
  type: 'email' | 'slack' | 'webhook' | 'sms';
  target: string;
  template?: string;
}

// ============================================================================
// DEPLOYMENT EXECUTION
// ============================================================================

/**
 * Deployment execution state
 */
export interface DeploymentExecution {
  id: string;
  ritualId: string;
  ritualType: DeploymentRitualType;

  // State
  status: 'pending' | 'running' | 'paused' | 'completed' | 'failed' | 'rolled-back';
  currentStep?: string;

  // Timing
  startedAt: string;
  completedAt?: string;

  // Progress
  stepsCompleted: number;
  stepsTotal: number;
  progress: number;                // 0-100

  // Results
  stepResults: StepResult[];

  // Errors
  errors: DeploymentError[];

  // Actor
  initiatedBy: string;
  approvedBy?: string;
}

export interface StepResult {
  stepId: string;
  stepName: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  output?: unknown;
  error?: string;
}

export interface DeploymentError {
  timestamp: string;
  stepId?: string;
  error: string;
  recoverable: boolean;
  details?: Record<string, unknown>;
}

// ============================================================================
// RELEASE MANAGEMENT
// ============================================================================

/**
 * A release definition
 */
export interface Release {
  id: string;
  version: string;
  versionLabel: string;

  // Changelog
  changelog: ChangelogEntry[];

  // Artifacts
  artifacts: ReleaseArtifact[];

  // Dependencies
  dependencies: ReleaseDependency[];

  // Compatibility
  minApiVersion: string;
  maxApiVersion?: string;

  // Status
  status: 'draft' | 'staging' | 'canary' | 'production' | 'deprecated';

  // Metadata
  createdAt: string;
  releasedAt?: string;
  deprecatedAt?: string;
  author: string;
  notes?: string;
}

export interface ChangelogEntry {
  type: 'feature' | 'fix' | 'breaking' | 'deprecation' | 'performance' | 'security';
  description: string;
  descriptionChinese?: string;
  moduleId?: ModuleId;
  issueId?: string;
}

export interface ReleaseArtifact {
  name: string;
  type: 'container' | 'bundle' | 'config' | 'migration';
  path: string;
  checksum?: string;
  size?: number;
}

export interface ReleaseDependency {
  serviceId: string;
  minVersion: string;
  maxVersion?: string;
  required: boolean;
}

// ============================================================================
// MONITORING & OBSERVABILITY
// ============================================================================

/**
 * Monitoring configuration
 */
export interface MonitoringConfig {
  // Metrics
  metrics: MetricsConfig;

  // Logging
  logging: LoggingConfig;

  // Tracing
  tracing: TracingConfig;

  // Alerting
  alerting: AlertingConfig;
}

export interface MetricsConfig {
  enabled: boolean;
  endpoint: string;
  scrapeInterval: number;          // Seconds
  labels: Record<string, string>;
  customMetrics: CustomMetric[];
}

export interface CustomMetric {
  name: string;
  type: 'counter' | 'gauge' | 'histogram' | 'summary';
  description: string;
  labels: string[];
}

export interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  format: 'json' | 'text';
  destination: 'stdout' | 'file' | 'remote';
  remoteSink?: string;
  sampling?: {
    enabled: boolean;
    rate: number;
  };
}

export interface TracingConfig {
  enabled: boolean;
  samplingRate: number;            // 0-1
  endpoint: string;
  serviceName: string;
  propagation: 'w3c' | 'b3' | 'jaeger';
}

export interface AlertingConfig {
  enabled: boolean;
  rules: AlertRule[];
  defaultRecipients: NotificationChannel[];
}

export interface AlertRule {
  name: string;
  condition: string;               // PromQL or similar
  duration: string;                // e.g., "5m"
  severity: 'info' | 'warning' | 'critical';
  annotations: Record<string, string>;
  recipients?: NotificationChannel[];
}

// ============================================================================
// DEPLOYMENT DASHBOARD DATA
// ============================================================================

/**
 * Data for deployment dashboard
 */
export interface DeploymentDashboardData {
  // Current state
  environment: DeploymentEnvironment;
  mode: DeploymentMode;

  // Services health
  servicesHealth: HealthCheckResult[];

  // Active deployments
  activeDeployments: DeploymentExecution[];

  // Recent releases
  recentReleases: Release[];

  // Circuit breakers
  circuitBreakers: CircuitBreakerState[];

  // Metrics summary
  metricsSummary: {
    totalRequests: number;
    errorRate: number;
    avgLatency: number;
    p99Latency: number;
  };

  // Alerts
  activeAlerts: Array<{
    id: string;
    rule: string;
    severity: 'info' | 'warning' | 'critical';
    firedAt: string;
    message: string;
  }>;
}

/**
 * Topology visualization data
 */
export interface TopologyVisualizationData {
  nodes: Array<{
    id: string;
    label: string;
    type: 'service' | 'database' | 'gateway' | 'external';
    plane: RuntimePlane;
    status: HealthStatus;
    position: { x: number; y: number };
    metrics?: {
      cpu: number;
      memory: number;
      requests: number;
    };
  }>;

  edges: Array<{
    id: string;
    from: string;
    to: string;
    protocol: string;
    traffic?: number;
    latency?: number;
    errorRate?: number;
  }>;

  layers: Array<{
    id: string;
    label: string;
    y: number;
    height: number;
  }>;
}

