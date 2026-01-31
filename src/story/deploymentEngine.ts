/**
 * ============================================================================
 * CATHEDRAL DEPLOYMENT ENGINE (大教堂部署引擎)
 * ============================================================================
 *
 * The foundation stone beneath the cathedral.
 * Runtime management, health, scaling, and deployment rituals.
 *
 * Capabilities:
 * - Health monitoring and circuit breakers
 * - Scaling operations
 * - Deployment ritual execution
 * - Release management
 * - Topology management
 *
 * This is where your cathedral becomes production-ready.
 *
 * Created: January 2026
 * ============================================================================
 */

import type {
  RuntimePlane,
  DeploymentMode,
  DeploymentEnvironment,
  ServiceDefinition,
  DeploymentTopology,
  TopologyLayer,
  GatewayConfig,
  ScalingConfig,
  HealthConfig,
  HealthStatus,
  HealthCheckResult,
  CircuitBreakerState,
  CircuitBreakerConfig,
  DeploymentRitualType,
  DeploymentRitual,
  RitualStep,
  DeploymentExecution,
  StepResult,
  DeploymentError,
  Release,
  ChangelogEntry,
  MonitoringConfig,
  AlertRule,
  DeploymentDashboardData,
  TopologyVisualizationData
} from './deploymentTypes';

import {
  DEPLOYMENT_MODE_CHINESE,
  DEPLOYMENT_ENV_CHINESE,
  HEALTH_STATUS_CHINESE,
  DEPLOYMENT_RITUAL_CHINESE,
  DEPLOYMENT_RITUAL_DESCRIPTIONS
} from './deploymentTypes';

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

/**
 * In-memory deployment state
 * In production, this would be backed by a distributed store
 */
interface DeploymentState {
  topology: DeploymentTopology | null;
  services: Map<string, ServiceState>;
  circuitBreakers: Map<string, CircuitBreakerState>;
  activeExecutions: Map<string, DeploymentExecution>;
  releases: Release[];
  monitoring: MonitoringConfig | null;
}

interface ServiceState {
  definition: ServiceDefinition;
  health: HealthCheckResult;
  replicas: number;
  lastHealthCheck: string;
}

const state: DeploymentState = {
  topology: null,
  services: new Map(),
  circuitBreakers: new Map(),
  activeExecutions: new Map(),
  releases: [],
  monitoring: null
};

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// ============================================================================
// TOPOLOGY MANAGEMENT
// ============================================================================

/**
 * Initialize deployment topology
 */
export function initializeTopology(
  environment: DeploymentEnvironment,
  mode: DeploymentMode
): DeploymentTopology {
  const topology: DeploymentTopology = {
    id: generateId('topology'),
    name: `Cathedral ${environment}`,
    version: '1.0.0',
    environment,
    mode,
    services: createDefaultServices(mode),
    layers: createDefaultLayers(),
    connections: [],
    gateway: createDefaultGateway(environment),
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  };

  state.topology = topology;

  // Initialize services
  for (const service of topology.services) {
    state.services.set(service.id, {
      definition: service,
      health: createInitialHealthCheck(service.id, service.name),
      replicas: service.scaling.horizontal?.minReplicas || 1,
      lastHealthCheck: new Date().toISOString()
    });

    // Initialize circuit breaker
    state.circuitBreakers.set(service.id, {
      serviceId: service.id,
      state: 'closed',
      failureCount: 0,
      successCount: 0
    });
  }

  return topology;
}

function createDefaultServices(mode: DeploymentMode): ServiceDefinition[] {
  const services: ServiceDefinition[] = [
    // Compute plane services
    {
      id: 'chart-engine',
      name: 'Chart Engine',
      nameChinese: '命盘引擎',
      plane: 'compute',
      modules: ['natalChartEngine', 'synastryEngine', 'compositeChartEngine'],
      dependencies: ['memory-service'],
      scaling: {
        type: 'horizontal',
        horizontal: { minReplicas: 1, maxReplicas: 5, targetCpuUtilization: 70 }
      },
      health: createDefaultHealthConfig(),
      resources: { cpu: { request: '200m', limit: '1000m' }, memory: { request: '256Mi', limit: '1Gi' } }
    },
    {
      id: 'timing-engine',
      name: 'Timing Engine',
      nameChinese: '时序引擎',
      plane: 'compute',
      modules: ['daYunEngine', 'liuNianEngine', 'liuYueEngine', 'compositeTimingEngine', 'microTimingEngine'],
      dependencies: ['chart-engine', 'memory-service'],
      scaling: {
        type: 'horizontal',
        horizontal: { minReplicas: 2, maxReplicas: 10, targetCpuUtilization: 60 }
      },
      health: createDefaultHealthConfig(),
      resources: { cpu: { request: '500m', limit: '2000m' }, memory: { request: '512Mi', limit: '2Gi' } }
    },
    {
      id: 'story-engine',
      name: 'Story Engine',
      nameChinese: '故事引擎',
      plane: 'compute',
      modules: ['storyBeatEngine', 'storyChapterEngine', 'predictiveStoryEngine', 'storyWeavingEngine'],
      dependencies: ['timing-engine', 'memory-service'],
      scaling: {
        type: 'horizontal',
        horizontal: { minReplicas: 1, maxReplicas: 5, targetCpuUtilization: 70 }
      },
      health: createDefaultHealthConfig(),
      resources: { cpu: { request: '300m', limit: '1500m' }, memory: { request: '512Mi', limit: '2Gi' } }
    },
    {
      id: 'ritual-engine',
      name: 'Ritual Engine',
      nameChinese: '仪式引擎',
      plane: 'compute',
      modules: ['ritualTimingEngine', 'fateToActionEngine'],
      dependencies: ['timing-engine', 'story-engine'],
      scaling: {
        type: 'horizontal',
        horizontal: { minReplicas: 1, maxReplicas: 3, targetCpuUtilization: 70 }
      },
      health: createDefaultHealthConfig(),
      resources: { cpu: { request: '200m', limit: '1000m' }, memory: { request: '256Mi', limit: '1Gi' } }
    },
    {
      id: 'simulation-engine',
      name: 'Simulation Engine',
      nameChinese: '模拟引擎',
      plane: 'compute',
      modules: ['simulationEngine'],
      dependencies: ['timing-engine', 'story-engine'],
      scaling: {
        type: 'event-driven',
        eventDriven: { triggers: [{ type: 'queue-length', name: 'simulation-queue', threshold: 10 }] }
      },
      health: createDefaultHealthConfig(),
      resources: { cpu: { request: '500m', limit: '2000m' }, memory: { request: '1Gi', limit: '4Gi' } }
    },
    {
      id: 'orchestration-service',
      name: 'Orchestration Service',
      nameChinese: '编排服务',
      plane: 'compute',
      modules: ['validationEngine', 'transformationEngine', 'aggregationEngine'],
      dependencies: ['chart-engine', 'timing-engine', 'story-engine', 'ritual-engine'],
      scaling: {
        type: 'horizontal',
        horizontal: { minReplicas: 2, maxReplicas: 5, targetCpuUtilization: 60 }
      },
      health: createDefaultHealthConfig(),
      resources: { cpu: { request: '300m', limit: '1000m' }, memory: { request: '256Mi', limit: '1Gi' } }
    },

    // Data plane services
    {
      id: 'memory-service',
      name: 'Memory Service',
      nameChinese: '记忆服务',
      plane: 'data',
      modules: ['memoryWriteEngine', 'memoryReadEngine'],
      dependencies: [],
      scaling: {
        type: 'vertical',
        vertical: { minCpu: '500m', maxCpu: '4000m', minMemory: '1Gi', maxMemory: '16Gi' }
      },
      health: createDefaultHealthConfig(),
      resources: { cpu: { request: '500m', limit: '2000m' }, memory: { request: '1Gi', limit: '8Gi' } }
    },
    {
      id: 'pattern-service',
      name: 'Pattern Service',
      nameChinese: '模式服务',
      plane: 'data',
      modules: ['patternExtractionEngine', 'predictiveRecallEngine'],
      dependencies: ['memory-service'],
      scaling: {
        type: 'vertical',
        vertical: { minCpu: '500m', maxCpu: '4000m', minMemory: '2Gi', maxMemory: '16Gi' }
      },
      health: createDefaultHealthConfig(),
      resources: { cpu: { request: '500m', limit: '2000m' }, memory: { request: '2Gi', limit: '8Gi' } }
    },

    // Presentation plane services
    {
      id: 'api-gateway',
      name: 'API Gateway',
      nameChinese: 'API 网关',
      plane: 'presentation',
      modules: [],
      dependencies: ['orchestration-service'],
      scaling: {
        type: 'horizontal',
        horizontal: { minReplicas: 2, maxReplicas: 10, targetCpuUtilization: 50 }
      },
      health: createDefaultHealthConfig(),
      resources: { cpu: { request: '200m', limit: '1000m' }, memory: { request: '256Mi', limit: '512Mi' } }
    },
    {
      id: 'frontend-service',
      name: 'Frontend Service',
      nameChinese: '前端服务',
      plane: 'presentation',
      modules: [],
      dependencies: ['api-gateway'],
      scaling: {
        type: 'horizontal',
        horizontal: { minReplicas: 2, maxReplicas: 20, targetCpuUtilization: 50 }
      },
      health: createDefaultHealthConfig(),
      resources: { cpu: { request: '100m', limit: '500m' }, memory: { request: '128Mi', limit: '256Mi' } }
    }
  ];

  return services;
}

function createDefaultLayers(): TopologyLayer[] {
  return [
    { id: 'frontend', name: 'Frontend Layer', nameChinese: '前端层', order: 0, serviceIds: ['frontend-service'] },
    { id: 'gateway', name: 'API Gateway Layer', nameChinese: 'API 网关层', order: 1, serviceIds: ['api-gateway'] },
    { id: 'orchestration', name: 'Orchestration Layer', nameChinese: '编排层', order: 2, serviceIds: ['orchestration-service'] },
    { id: 'engine', name: 'Engine Cluster', nameChinese: '引擎集群', order: 3, serviceIds: ['chart-engine', 'timing-engine', 'story-engine', 'ritual-engine', 'simulation-engine'] },
    { id: 'data', name: 'Memory Layer', nameChinese: '记忆层', order: 4, serviceIds: ['memory-service', 'pattern-service'] }
  ];
}

function createDefaultGateway(environment: DeploymentEnvironment): GatewayConfig {
  const hosts: Record<DeploymentEnvironment, string> = {
    development: 'localhost',
    staging: 'staging.cathedral.dev',
    production: 'api.cathedral.io'
  };

  return {
    host: hosts[environment],
    port: environment === 'development' ? 3000 : 443,
    basePath: '/api/v1',
    rateLimit: {
      requestsPerMinute: environment === 'production' ? 1000 : 10000,
      burstSize: environment === 'production' ? 100 : 1000
    },
    cors: {
      origins: environment === 'development' ? ['*'] : ['https://cathedral.io'],
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    },
    auth: {
      type: environment === 'development' ? 'none' : 'jwt'
    }
  };
}

function createDefaultHealthConfig(): HealthConfig {
  return {
    livenessProbe: {
      type: 'http',
      path: '/health/live',
      port: 8080,
      initialDelaySeconds: 10,
      periodSeconds: 10,
      timeoutSeconds: 5,
      successThreshold: 1,
      failureThreshold: 3
    },
    readinessProbe: {
      type: 'http',
      path: '/health/ready',
      port: 8080,
      initialDelaySeconds: 5,
      periodSeconds: 5,
      timeoutSeconds: 3,
      successThreshold: 1,
      failureThreshold: 3
    },
    circuitBreaker: {
      enabled: true,
      failureThreshold: 5,
      successThreshold: 3,
      timeout: 30,
      halfOpenRequests: 3
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 3,
      initialDelayMs: 100,
      maxDelayMs: 5000,
      backoffMultiplier: 2,
      retryableErrors: ['ETIMEDOUT', 'ECONNRESET', 'ECONNREFUSED']
    }
  };
}

function createInitialHealthCheck(serviceId: string, serviceName: string): HealthCheckResult {
  return {
    serviceId,
    serviceName,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    metrics: {
      latencyMs: 0,
      cpuUsage: 0,
      memoryUsage: 0,
      errorRate: 0,
      throughput: 0
    },
    components: [],
    recentErrors: []
  };
}

/**
 * Get current topology
 */
export function getTopology(): DeploymentTopology | null {
  return state.topology;
}

// ============================================================================
// HEALTH MONITORING
// ============================================================================

/**
 * Perform health check on a service
 */
export async function checkServiceHealth(serviceId: string): Promise<HealthCheckResult> {
  const serviceState = state.services.get(serviceId);
  if (!serviceState) {
    return {
      serviceId,
      serviceName: 'Unknown',
      status: 'unknown',
      timestamp: new Date().toISOString(),
      metrics: { latencyMs: 0, cpuUsage: 0, memoryUsage: 0, errorRate: 0, throughput: 0 },
      components: [],
      recentErrors: [{ timestamp: new Date().toISOString(), error: 'Service not found', count: 1 }]
    };
  }

  // Simulate health check (in production, this would make actual HTTP calls)
  const latency = Math.random() * 100 + 10; // 10-110ms
  const cpuUsage = Math.random() * 60 + 10; // 10-70%
  const memoryUsage = Math.random() * 50 + 20; // 20-70%
  const errorRate = Math.random() * 2; // 0-2%
  const throughput = Math.random() * 500 + 100; // 100-600 rps

  // Determine status based on metrics
  let status: HealthStatus = 'healthy';
  if (errorRate > 5 || cpuUsage > 90 || memoryUsage > 90) {
    status = 'unhealthy';
  } else if (errorRate > 2 || cpuUsage > 80 || memoryUsage > 80 || latency > 500) {
    status = 'degraded';
  }

  const healthCheck: HealthCheckResult = {
    serviceId,
    serviceName: serviceState.definition.name,
    status,
    timestamp: new Date().toISOString(),
    metrics: {
      latencyMs: Math.round(latency),
      cpuUsage: Math.round(cpuUsage),
      memoryUsage: Math.round(memoryUsage),
      errorRate: Math.round(errorRate * 100) / 100,
      throughput: Math.round(throughput)
    },
    components: [
      { name: 'Database Connection', status: 'healthy' },
      { name: 'Cache', status: 'healthy' },
      { name: 'Dependencies', status }
    ],
    recentErrors: []
  };

  // Update state
  serviceState.health = healthCheck;
  serviceState.lastHealthCheck = healthCheck.timestamp;

  // Update circuit breaker
  updateCircuitBreaker(serviceId, status === 'healthy');

  return healthCheck;
}

/**
 * Check health of all services
 */
export async function checkAllServicesHealth(): Promise<HealthCheckResult[]> {
  const results: HealthCheckResult[] = [];

  for (const [serviceId] of state.services) {
    const result = await checkServiceHealth(serviceId);
    results.push(result);
  }

  return results;
}

/**
 * Get health summary
 */
export function getHealthSummary(): {
  overall: HealthStatus;
  services: { healthy: number; degraded: number; unhealthy: number; unknown: number };
} {
  const counts = { healthy: 0, degraded: 0, unhealthy: 0, unknown: 0 };

  for (const [, serviceState] of state.services) {
    counts[serviceState.health.status]++;
  }

  let overall: HealthStatus = 'healthy';
  if (counts.unhealthy > 0) {
    overall = 'unhealthy';
  } else if (counts.degraded > 0) {
    overall = 'degraded';
  } else if (counts.unknown > 0) {
    overall = 'unknown';
  }

  return { overall, services: counts };
}

// ============================================================================
// CIRCUIT BREAKER
// ============================================================================

/**
 * Update circuit breaker state
 */
function updateCircuitBreaker(serviceId: string, success: boolean): void {
  const cb = state.circuitBreakers.get(serviceId);
  if (!cb) return;

  const config = state.services.get(serviceId)?.definition.health.circuitBreaker;
  if (!config?.enabled) return;

  if (success) {
    cb.successCount++;
    cb.failureCount = 0;
    cb.lastSuccess = new Date().toISOString();

    // Close circuit if in half-open state with enough successes
    if (cb.state === 'half-open' && cb.successCount >= config.successThreshold) {
      cb.state = 'closed';
      cb.successCount = 0;
    }
  } else {
    cb.failureCount++;
    cb.successCount = 0;
    cb.lastFailure = new Date().toISOString();

    // Open circuit if failure threshold reached
    if (cb.state === 'closed' && cb.failureCount >= config.failureThreshold) {
      cb.state = 'open';
      cb.openedAt = new Date().toISOString();
      cb.nextRetryAt = new Date(Date.now() + config.timeout * 1000).toISOString();
    }
  }

  state.circuitBreakers.set(serviceId, cb);
}

/**
 * Check if service is available (circuit breaker closed or half-open)
 */
export function isServiceAvailable(serviceId: string): boolean {
  const cb = state.circuitBreakers.get(serviceId);
  if (!cb) return true;

  if (cb.state === 'open') {
    // Check if timeout has passed
    if (cb.nextRetryAt && new Date(cb.nextRetryAt) <= new Date()) {
      cb.state = 'half-open';
      state.circuitBreakers.set(serviceId, cb);
      return true;
    }
    return false;
  }

  return true;
}

/**
 * Get circuit breaker states
 */
export function getCircuitBreakerStates(): CircuitBreakerState[] {
  return Array.from(state.circuitBreakers.values());
}

/**
 * Manually reset a circuit breaker
 */
export function resetCircuitBreaker(serviceId: string): boolean {
  const cb = state.circuitBreakers.get(serviceId);
  if (!cb) return false;

  cb.state = 'closed';
  cb.failureCount = 0;
  cb.successCount = 0;
  cb.openedAt = undefined;
  cb.nextRetryAt = undefined;

  state.circuitBreakers.set(serviceId, cb);
  return true;
}

// ============================================================================
// SCALING OPERATIONS
// ============================================================================

/**
 * Scale a service horizontally
 */
export function scaleService(serviceId: string, replicas: number): boolean {
  const serviceState = state.services.get(serviceId);
  if (!serviceState) return false;

  const scaling = serviceState.definition.scaling;
  if (scaling.type !== 'horizontal' || !scaling.horizontal) return false;

  const { minReplicas, maxReplicas } = scaling.horizontal;
  const targetReplicas = Math.max(minReplicas, Math.min(maxReplicas, replicas));

  serviceState.replicas = targetReplicas;
  state.services.set(serviceId, serviceState);

  console.log(`Scaled ${serviceId} to ${targetReplicas} replicas`);
  return true;
}

/**
 * Auto-scale based on metrics
 */
export function autoScale(): { serviceId: string; from: number; to: number }[] {
  const scalingActions: { serviceId: string; from: number; to: number }[] = [];

  for (const [serviceId, serviceState] of state.services) {
    const scaling = serviceState.definition.scaling;
    if (scaling.type !== 'horizontal' || !scaling.horizontal) continue;

    const { minReplicas, maxReplicas, targetCpuUtilization } = scaling.horizontal;
    const currentCpu = serviceState.health.metrics.cpuUsage;
    const currentReplicas = serviceState.replicas;

    let targetReplicas = currentReplicas;

    if (targetCpuUtilization && currentCpu > targetCpuUtilization + 10) {
      // Scale up
      targetReplicas = Math.min(maxReplicas, currentReplicas + 1);
    } else if (targetCpuUtilization && currentCpu < targetCpuUtilization - 20) {
      // Scale down
      targetReplicas = Math.max(minReplicas, currentReplicas - 1);
    }

    if (targetReplicas !== currentReplicas) {
      serviceState.replicas = targetReplicas;
      state.services.set(serviceId, serviceState);
      scalingActions.push({ serviceId, from: currentReplicas, to: targetReplicas });
    }
  }

  return scalingActions;
}

/**
 * Get scaling status for all services
 */
export function getScalingStatus(): Array<{
  serviceId: string;
  currentReplicas: number;
  minReplicas: number;
  maxReplicas: number;
  scalingType: string;
}> {
  const status: Array<{
    serviceId: string;
    currentReplicas: number;
    minReplicas: number;
    maxReplicas: number;
    scalingType: string;
  }> = [];

  for (const [serviceId, serviceState] of state.services) {
    const scaling = serviceState.definition.scaling;
    status.push({
      serviceId,
      currentReplicas: serviceState.replicas,
      minReplicas: scaling.horizontal?.minReplicas || 1,
      maxReplicas: scaling.horizontal?.maxReplicas || 1,
      scalingType: scaling.type
    });
  }

  return status;
}

// ============================================================================
// DEPLOYMENT RITUALS
// ============================================================================

/**
 * Create a deployment ritual
 */
export function createDeploymentRitual(type: DeploymentRitualType): DeploymentRitual {
  const ritualSteps = DEPLOYMENT_RITUAL_DESCRIPTIONS[type].steps;

  const steps: RitualStep[] = ritualSteps.map((stepName, index) => ({
    id: `step_${index}`,
    name: stepName,
    nameChinese: stepName, // Would be translated in production
    order: index,
    action: { type: 'custom', handler: `handle_${stepName.toLowerCase().replace(/\s+/g, '_')}` },
    timeoutSeconds: 300,
    onFailure: index < 2 ? 'abort' : 'rollback'
  }));

  return {
    id: generateId('ritual'),
    type,
    name: DEPLOYMENT_RITUAL_DESCRIPTIONS[type].en,
    nameChinese: DEPLOYMENT_RITUAL_CHINESE[type],
    steps,
    preConditions: [
      { name: 'All services healthy', check: { type: 'health', serviceId: '*', expectedStatus: 'healthy' }, required: true }
    ],
    postConditions: [
      { name: 'All services healthy', check: { type: 'health', serviceId: '*', expectedStatus: 'healthy' }, required: true }
    ],
    notifications: {
      onStart: [{ type: 'slack', target: '#deployments' }],
      onSuccess: [{ type: 'slack', target: '#deployments' }],
      onFailure: [{ type: 'slack', target: '#incidents' }, { type: 'email', target: 'oncall@cathedral.io' }],
      onRollback: [{ type: 'slack', target: '#incidents' }]
    },
    requiresApproval: type === 'release'
  };
}

/**
 * Execute a deployment ritual
 */
export async function executeDeploymentRitual(
  ritual: DeploymentRitual,
  initiatedBy: string
): Promise<DeploymentExecution> {
  const execution: DeploymentExecution = {
    id: generateId('exec'),
    ritualId: ritual.id,
    ritualType: ritual.type,
    status: 'pending',
    startedAt: new Date().toISOString(),
    stepsCompleted: 0,
    stepsTotal: ritual.steps.length,
    progress: 0,
    stepResults: [],
    errors: [],
    initiatedBy
  };

  state.activeExecutions.set(execution.id, execution);

  // Check pre-conditions
  execution.status = 'running';

  for (const step of ritual.steps) {
    execution.currentStep = step.id;
    execution.progress = Math.round((execution.stepsCompleted / execution.stepsTotal) * 100);

    const stepResult: StepResult = {
      stepId: step.id,
      stepName: step.name,
      status: 'running',
      startedAt: new Date().toISOString()
    };

    try {
      // Simulate step execution
      await new Promise(resolve => setTimeout(resolve, 100));

      stepResult.status = 'completed';
      stepResult.completedAt = new Date().toISOString();
      stepResult.durationMs = 100;
      execution.stepsCompleted++;

    } catch (error) {
      stepResult.status = 'failed';
      stepResult.error = error instanceof Error ? error.message : String(error);

      const deploymentError: DeploymentError = {
        timestamp: new Date().toISOString(),
        stepId: step.id,
        error: stepResult.error,
        recoverable: step.onFailure !== 'abort'
      };
      execution.errors.push(deploymentError);

      if (step.onFailure === 'abort') {
        execution.status = 'failed';
        execution.stepResults.push(stepResult);
        break;
      } else if (step.onFailure === 'rollback') {
        execution.status = 'rolled-back';
        // Execute rollback steps here
        break;
      }
    }

    execution.stepResults.push(stepResult);
  }

  if (execution.status === 'running') {
    execution.status = 'completed';
    execution.progress = 100;
  }

  execution.completedAt = new Date().toISOString();
  state.activeExecutions.set(execution.id, execution);

  return execution;
}

/**
 * Get active deployment executions
 */
export function getActiveExecutions(): DeploymentExecution[] {
  return Array.from(state.activeExecutions.values()).filter(
    e => e.status === 'running' || e.status === 'pending' || e.status === 'paused'
  );
}

/**
 * Get execution history
 */
export function getExecutionHistory(limit: number = 10): DeploymentExecution[] {
  return Array.from(state.activeExecutions.values())
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
    .slice(0, limit);
}

// ============================================================================
// RELEASE MANAGEMENT
// ============================================================================

/**
 * Create a new release
 */
export function createRelease(
  version: string,
  changelog: ChangelogEntry[],
  author: string
): Release {
  const release: Release = {
    id: generateId('release'),
    version,
    versionLabel: `v${version}`,
    changelog,
    artifacts: [],
    dependencies: [],
    minApiVersion: '1.0.0',
    status: 'draft',
    createdAt: new Date().toISOString(),
    author
  };

  state.releases.push(release);
  return release;
}

/**
 * Promote a release to next stage
 */
export function promoteRelease(releaseId: string): Release | null {
  const release = state.releases.find(r => r.id === releaseId);
  if (!release) return null;

  const promotionPath: Record<Release['status'], Release['status']> = {
    draft: 'staging',
    staging: 'canary',
    canary: 'production',
    production: 'production',
    deprecated: 'deprecated'
  };

  release.status = promotionPath[release.status];
  if (release.status === 'production' && !release.releasedAt) {
    release.releasedAt = new Date().toISOString();
  }

  return release;
}

/**
 * Deprecate a release
 */
export function deprecateRelease(releaseId: string): boolean {
  const release = state.releases.find(r => r.id === releaseId);
  if (!release) return false;

  release.status = 'deprecated';
  release.deprecatedAt = new Date().toISOString();
  return true;
}

/**
 * Get releases
 */
export function getReleases(status?: Release['status']): Release[] {
  if (status) {
    return state.releases.filter(r => r.status === status);
  }
  return state.releases;
}

/**
 * Get current production release
 */
export function getCurrentRelease(): Release | null {
  return state.releases.find(r => r.status === 'production') || null;
}

// ============================================================================
// VISUALIZATION DATA GENERATORS
// ============================================================================

/**
 * Generate deployment dashboard data
 */
export async function generateDeploymentDashboardData(): Promise<DeploymentDashboardData> {
  const healthChecks = await checkAllServicesHealth();
  const summary = getHealthSummary();

  return {
    environment: state.topology?.environment || 'development',
    mode: state.topology?.mode || 'monolithic',
    servicesHealth: healthChecks,
    activeDeployments: getActiveExecutions(),
    recentReleases: getReleases().slice(0, 5),
    circuitBreakers: getCircuitBreakerStates(),
    metricsSummary: {
      totalRequests: Math.round(Math.random() * 10000 + 1000),
      errorRate: Math.round(Math.random() * 2 * 100) / 100,
      avgLatency: Math.round(Math.random() * 100 + 20),
      p99Latency: Math.round(Math.random() * 300 + 100)
    },
    activeAlerts: summary.overall !== 'healthy' ? [{
      id: generateId('alert'),
      rule: 'service_health',
      severity: summary.overall === 'unhealthy' ? 'critical' : 'warning',
      firedAt: new Date().toISOString(),
      message: `System health is ${summary.overall}`
    }] : []
  };
}

/**
 * Generate topology visualization data
 */
export function generateTopologyVisualization(): TopologyVisualizationData {
  const nodes: TopologyVisualizationData['nodes'] = [];
  const edges: TopologyVisualizationData['edges'] = [];
  const layers: TopologyVisualizationData['layers'] = [];

  if (!state.topology) {
    return { nodes, edges, layers };
  }

  // Create layer positions
  const layerHeight = 120;
  state.topology.layers.forEach((layer, index) => {
    layers.push({
      id: layer.id,
      label: layer.name,
      y: index * layerHeight,
      height: layerHeight - 20
    });
  });

  // Create nodes
  state.topology.services.forEach((service, index) => {
    const layer = state.topology!.layers.find(l => l.serviceIds.includes(service.id));
    const layerIndex = layer ? state.topology!.layers.indexOf(layer) : 0;
    const serviceState = state.services.get(service.id);

    nodes.push({
      id: service.id,
      label: service.name,
      type: 'service',
      plane: service.plane,
      status: serviceState?.health.status || 'unknown',
      position: {
        x: (index % 3) * 200 + 100,
        y: layerIndex * layerHeight + 40
      },
      metrics: serviceState ? {
        cpu: serviceState.health.metrics.cpuUsage,
        memory: serviceState.health.metrics.memoryUsage,
        requests: serviceState.health.metrics.throughput
      } : undefined
    });
  });

  // Create edges based on dependencies
  state.topology.services.forEach(service => {
    service.dependencies.forEach(depId => {
      edges.push({
        id: `${service.id}_${depId}`,
        from: service.id,
        to: depId,
        protocol: 'grpc',
        traffic: Math.random() * 100,
        latency: Math.random() * 50 + 5
      });
    });
  });

  return { nodes, edges, layers };
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  RUNTIME_PLANE_CHINESE,
  RUNTIME_PLANE_DESCRIPTIONS,
  DEPLOYMENT_MODE_CHINESE,
  DEPLOYMENT_MODE_DESCRIPTIONS,
  DEPLOYMENT_ENV_CHINESE,
  DEPLOYMENT_ENV_DESCRIPTIONS,
  SCALING_TYPE_CHINESE,
  HEALTH_STATUS_CHINESE,
  DEPLOYMENT_RITUAL_CHINESE,
  DEPLOYMENT_RITUAL_DESCRIPTIONS
} from './deploymentTypes';

