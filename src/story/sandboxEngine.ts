/**
 * Cathedral Simulation Sandbox Engine (大教堂沙盒引擎)
 *
 * The inner sanctum where new engines are born, tested, refined, and blessed.
 * A safe, isolated environment for experimenting with the metaphysics OS.
 *
 * This is the laboratory of the cathedral — where innovation happens safely.
 */

import type {
  SandboxState,
  SandboxChamber,
  SandboxEnvironment,
  SandboxConfig,
  SandboxModuleType,
  ModuleTestConfig,
  ModuleMutation,
  ModuleTestResult,
  ModuleOutputDiff,
  ModulePerformance,
  FlowTestConfig,
  FlowBreakpoint,
  FlowMutation,
  FlowTestResult,
  FlowPathNode,
  FlowPerformance,
  PipelineTestConfig,
  PipelineMutation,
  PipelineTestResult,
  PipelineStepResult,
  PipelinePerformance,
  StoryTestConfig,
  StoryMutation,
  StoryTestResult,
  GeneratedStory,
  StoryMetrics,
  SandboxMemory,
  SandboxMemoryDiff,
  SandboxSnapshot,
  SnapshotComparison,
  SandboxSimulation,
  SimulationReplayOptions,
  SandboxTraceEntry,
  SandboxError,
  SimulationComparison,
  SyntheticDataConfig,
  SyntheticData,
  AlchemistTableState,
  SandboxEvent,
  SandboxEventType,
  SandboxEventListener,
} from './sandboxTypes';

import { DEFAULT_SANDBOX_CONFIG } from './sandboxTypes';

// ============================================================================
// INTERNAL STATE
// ============================================================================

const environments: Map<string, SandboxEnvironment> = new Map();
const eventListeners: Map<SandboxEventType, Set<SandboxEventListener>> = new Map();
let alchemistTableState: AlchemistTableState | null = null;

// Random number generator with seed support
let randomSeed = Date.now();

function seededRandom(): number {
  randomSeed = (randomSeed * 9301 + 49297) % 233280;
  return randomSeed / 233280;
}

function setRandomSeed(seed: number): void {
  randomSeed = seed;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Deep clone an object
 */
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Create empty sandbox memory
 */
function createEmptyMemory(): SandboxMemory {
  return {
    structural: new Map(),
    temporal: new Map(),
    narrative: new Map(),
    pattern: new Map(),
    size: 0,
    lastModified: new Date(),
    writeCount: 0,
    readCount: 0,
  };
}

/**
 * Serialize sandbox memory for snapshots
 */
function serializeMemory(memory: SandboxMemory): Record<string, unknown> {
  return {
    structural: Object.fromEntries(memory.structural),
    temporal: Object.fromEntries(memory.temporal),
    narrative: Object.fromEntries(memory.narrative),
    pattern: Object.fromEntries(memory.pattern),
    size: memory.size,
    lastModified: memory.lastModified.toISOString(),
    writeCount: memory.writeCount,
    readCount: memory.readCount,
  };
}

/**
 * Deserialize sandbox memory from snapshots
 */
function deserializeMemory(data: Record<string, unknown>): SandboxMemory {
  return {
    structural: new Map(Object.entries(data.structural as Record<string, unknown> || {})),
    temporal: new Map(Object.entries(data.temporal as Record<string, unknown> || {})),
    narrative: new Map(Object.entries(data.narrative as Record<string, unknown> || {})),
    pattern: new Map(Object.entries(data.pattern as Record<string, unknown> || {})),
    size: data.size as number || 0,
    lastModified: new Date(data.lastModified as string || Date.now()),
    writeCount: data.writeCount as number || 0,
    readCount: data.readCount as number || 0,
  };
}

// ============================================================================
// ENVIRONMENT MANAGEMENT
// ============================================================================

/**
 * Create a new sandbox environment
 */
export function createSandboxEnvironment(
  name: string,
  chamber: SandboxChamber,
  config?: Partial<SandboxConfig>
): SandboxEnvironment {
  const environment: SandboxEnvironment = {
    id: generateId(),
    name,
    chamber,
    state: 'idle',
    createdAt: new Date(),
    lastActiveAt: new Date(),
    config: { ...DEFAULT_SANDBOX_CONFIG, ...config },
    memory: createEmptyMemory(),
    snapshots: [],
    history: [],
  };

  environments.set(environment.id, environment);

  emitEvent('environmentCreated', environment.id, { name, chamber });

  return environment;
}

/**
 * Get a sandbox environment by ID
 */
export function getSandboxEnvironment(environmentId: string): SandboxEnvironment | null {
  return environments.get(environmentId) || null;
}

/**
 * List all sandbox environments
 */
export function listSandboxEnvironments(): SandboxEnvironment[] {
  return Array.from(environments.values());
}

/**
 * Destroy a sandbox environment
 */
export function destroySandboxEnvironment(environmentId: string): boolean {
  const env = environments.get(environmentId);
  if (!env) return false;

  // Stop any running simulation
  if (env.currentSimulation && env.state === 'running') {
    env.state = 'idle';
    env.currentSimulation = undefined;
  }

  environments.delete(environmentId);
  emitEvent('environmentDestroyed', environmentId, {});

  return true;
}

/**
 * Reset a sandbox environment to initial state
 */
export function resetSandboxEnvironment(environmentId: string): SandboxEnvironment | null {
  const env = environments.get(environmentId);
  if (!env) return null;

  env.state = 'idle';
  env.memory = createEmptyMemory();
  env.currentSimulation = undefined;
  env.lastActiveAt = new Date();

  return env;
}

// ============================================================================
// 🜁 MODULE CHAMBER (模块沙盒)
// ============================================================================

/**
 * Run a module test in the sandbox
 */
export function runModuleTest(
  environmentId: string,
  config: ModuleTestConfig
): ModuleTestResult {
  const env = environments.get(environmentId);
  if (!env) {
    throw new Error(`Environment not found: ${environmentId}`);
  }

  if (env.chamber !== 'module') {
    throw new Error(`Environment ${environmentId} is not a module chamber`);
  }

  env.state = 'running';
  env.lastActiveAt = new Date();

  const startTime = Date.now();
  const trace: SandboxTraceEntry[] = [];
  const errors: SandboxError[] = [];
  const warnings: string[] = [];

  // Log start
  trace.push({
    timestamp: new Date(),
    level: 'info',
    source: 'moduleTest',
    message: `Starting test for ${config.moduleType}`,
    data: { inputs: config.inputs },
  });

  // Apply mutations if any
  const activeMutations = (config.mutations || []).filter(m => m.enabled);
  for (const mutation of activeMutations) {
    trace.push({
      timestamp: new Date(),
      level: 'debug',
      source: 'mutation',
      message: `Applied mutation: ${mutation.name}`,
      data: { target: mutation.target, value: mutation.mutatedValue },
    });
  }

  // Simulate module execution
  const intermediateValues: Record<string, unknown> = {};
  let outputs: Record<string, unknown> = {};

  try {
    // This would call the actual module in production
    // For now, we simulate based on module type
    outputs = simulateModuleExecution(config.moduleType, config.inputs, activeMutations);

    // Capture intermediate values
    intermediateValues['step1'] = { ...config.inputs };
    intermediateValues['step2'] = { processed: true };
    intermediateValues['step3'] = outputs;

  } catch (error) {
    errors.push({
      id: generateId(),
      timestamp: new Date(),
      source: config.moduleType,
      type: 'execution',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      recoverable: false,
    });
  }

  const endTime = Date.now();
  const duration = endTime - startTime;

  // Check against expected outputs
  let matchesExpected: boolean | undefined;
  let diffs: ModuleOutputDiff[] | undefined;

  if (config.expectedOutputs) {
    const diffResult = diffOutputs(config.expectedOutputs, outputs);
    diffs = diffResult;
    matchesExpected = diffResult.length === 0;
  }

  // Calculate performance
  const performance: ModulePerformance = {
    executionTimeMs: duration,
    memoryUsedBytes: JSON.stringify(outputs).length * 2,
    callCount: 1,
    averageTimeMs: duration,
    p95TimeMs: duration,
    p99TimeMs: duration,
  };

  // Log completion
  trace.push({
    timestamp: new Date(),
    level: 'info',
    source: 'moduleTest',
    message: `Completed test for ${config.moduleType}`,
    duration,
    data: { success: errors.length === 0 },
  });

  const result: ModuleTestResult = {
    moduleType: config.moduleType,
    success: errors.length === 0,
    inputs: config.inputs,
    outputs,
    intermediateValues,
    expectedOutputs: config.expectedOutputs,
    matchesExpected,
    diffs,
    performance,
    mutations: activeMutations,
    errors,
    warnings,
    trace,
  };

  // Create simulation record
  const simulation: SandboxSimulation = {
    id: generateId(),
    name: `Module Test: ${config.moduleType}`,
    chamber: 'module',
    state: errors.length === 0 ? 'completed' : 'error',
    startedAt: new Date(startTime),
    completedAt: new Date(endTime),
    duration,
    config,
    result,
    tags: [config.moduleType],
    reproducible: true,
    seed: randomSeed,
  };

  env.history.push(simulation);
  env.currentSimulation = simulation;
  env.state = errors.length === 0 ? 'completed' : 'error';

  emitEvent('simulationCompleted', environmentId, {
    simulationId: simulation.id,
    success: errors.length === 0,
    duration,
  });

  return result;
}

/**
 * Simulate module execution (placeholder)
 */
function simulateModuleExecution(
  moduleType: SandboxModuleType,
  inputs: Record<string, unknown>,
  mutations: ModuleMutation[]
): Record<string, unknown> {
  // In production, this would call the actual module
  // For now, return simulated outputs based on module type
  const baseOutput: Record<string, unknown> = {
    moduleType,
    processedAt: new Date().toISOString(),
    inputHash: JSON.stringify(inputs).length,
  };

  switch (moduleType) {
    case 'natalChartEngine':
      return {
        ...baseOutput,
        dayMaster: '甲',
        pillars: { year: '甲子', month: '丙寅', day: '戊辰', hour: '庚午' },
        elements: { wood: 2, fire: 3, earth: 2, metal: 1, water: 2 },
      };

    case 'compositeTimingEngine':
      return {
        ...baseOutput,
        score: 72 + (seededRandom() * 20 - 10),
        breakdown: { annual: 68, monthly: 75, daily: 70 },
        favorable: true,
      };

    case 'storyEngine':
      return {
        ...baseOutput,
        beatCount: 12,
        chapterCount: 4,
        emotionalArc: 'ascending',
        coherenceScore: 0.85,
      };

    default:
      return {
        ...baseOutput,
        computed: true,
        mutationsApplied: mutations.length,
      };
  }
}

/**
 * Diff between expected and actual outputs
 */
function diffOutputs(
  expected: Record<string, unknown>,
  actual: Record<string, unknown>,
  path: string = ''
): ModuleOutputDiff[] {
  const diffs: ModuleOutputDiff[] = [];
  const allKeys = new Set([...Object.keys(expected), ...Object.keys(actual)]);

  for (const key of allKeys) {
    const currentPath = path ? `${path}.${key}` : key;
    const expectedVal = expected[key];
    const actualVal = actual[key];

    if (!(key in expected)) {
      diffs.push({ path: currentPath, expected: undefined, actual: actualVal, diffType: 'extra' });
    } else if (!(key in actual)) {
      diffs.push({ path: currentPath, expected: expectedVal, actual: undefined, diffType: 'missing' });
    } else if (typeof expectedVal !== typeof actualVal) {
      diffs.push({ path: currentPath, expected: expectedVal, actual: actualVal, diffType: 'type_mismatch' });
    } else if (typeof expectedVal === 'object' && expectedVal !== null) {
      const nestedDiffs = diffOutputs(
        expectedVal as Record<string, unknown>,
        actualVal as Record<string, unknown>,
        currentPath
      );
      diffs.push(...nestedDiffs);
    } else if (expectedVal !== actualVal) {
      diffs.push({ path: currentPath, expected: expectedVal, actual: actualVal, diffType: 'changed' });
    }
  }

  return diffs;
}

// ============================================================================
// 🜂 FLOW CHAMBER (流动沙盒)
// ============================================================================

/**
 * Run a flow test in the sandbox
 */
export function runFlowTest(
  environmentId: string,
  config: FlowTestConfig
): FlowTestResult {
  const env = environments.get(environmentId);
  if (!env) {
    throw new Error(`Environment not found: ${environmentId}`);
  }

  if (env.chamber !== 'flow') {
    throw new Error(`Environment ${environmentId} is not a flow chamber`);
  }

  env.state = 'running';
  env.lastActiveAt = new Date();

  const startTime = Date.now();
  const trace: SandboxTraceEntry[] = [];
  const errors: SandboxError[] = [];
  const moduleResults: ModuleTestResult[] = [];
  const flowPath: FlowPathNode[] = [];

  trace.push({
    timestamp: new Date(),
    level: 'info',
    source: 'flowTest',
    message: `Starting flow test: ${config.flowType}`,
    data: { entryPoint: config.entryPoint },
  });

  // Simulate flow execution
  const flowModules = getFlowModules(config.flowType);
  let currentInputs = config.inputs;
  let order = 0;

  for (const moduleType of flowModules) {
    const moduleStartTime = Date.now();

    // Check for breakpoints
    const breakpoint = (config.breakpoints || []).find(bp => bp.moduleId === moduleType);
    if (breakpoint) {
      trace.push({
        timestamp: new Date(),
        level: 'debug',
        source: 'breakpoint',
        message: `Breakpoint hit at ${moduleType}`,
        data: { action: breakpoint.action },
      });

      if (breakpoint.action === 'pause') {
        env.state = 'paused';
        emitEvent('breakpointHit', environmentId, { moduleId: moduleType, breakpoint });
      }
    }

    // Apply flow mutations
    const mutation = (config.mutations || []).find(m => m.moduleId === moduleType);
    if (mutation?.skipModule) {
      trace.push({
        timestamp: new Date(),
        level: 'debug',
        source: 'mutation',
        message: `Skipping module ${moduleType}`,
      });
      continue;
    }

    if (mutation?.inputMutation) {
      currentInputs = { ...currentInputs, ...mutation.inputMutation };
    }

    // Execute module
    const moduleResult = simulateModuleExecution(moduleType, currentInputs, []);
    const moduleDuration = Date.now() - moduleStartTime;

    // Apply output mutation
    if (mutation?.outputMutation) {
      Object.assign(moduleResult, mutation.outputMutation);
    }

    // Record result
    const moduleTestResult: ModuleTestResult = {
      moduleType,
      success: true,
      inputs: currentInputs,
      outputs: moduleResult,
      intermediateValues: {},
      performance: {
        executionTimeMs: moduleDuration,
        memoryUsedBytes: 0,
        callCount: 1,
        averageTimeMs: moduleDuration,
        p95TimeMs: moduleDuration,
        p99TimeMs: moduleDuration,
      },
      mutations: [],
      errors: [],
      warnings: [],
      trace: [],
    };

    moduleResults.push(moduleTestResult);

    // Build flow path
    flowPath.push({
      moduleId: moduleType,
      moduleName: moduleType,
      inputs: currentInputs,
      outputs: moduleResult,
      duration: moduleDuration,
      order: order++,
      children: [],
    });

    // Output becomes next input
    currentInputs = moduleResult;
  }

  const endTime = Date.now();
  const totalDuration = endTime - startTime;

  // Calculate performance
  const performance: FlowPerformance = {
    totalExecutionTimeMs: totalDuration,
    totalMemoryUsedBytes: moduleResults.reduce((sum, r) => sum + r.performance.memoryUsedBytes, 0),
    moduleCount: flowModules.length,
    criticalPathMs: totalDuration,
    parallelizableMs: 0,
    bottleneckModules: moduleResults
      .map(r => ({ moduleId: r.moduleType, timeMs: r.performance.executionTimeMs }))
      .sort((a, b) => b.timeMs - a.timeMs)
      .slice(0, 3),
  };

  trace.push({
    timestamp: new Date(),
    level: 'info',
    source: 'flowTest',
    message: `Completed flow test: ${config.flowType}`,
    duration: totalDuration,
  });

  const result: FlowTestResult = {
    flowType: config.flowType,
    success: errors.length === 0,
    entryPoint: config.entryPoint,
    finalOutputs: currentInputs,
    moduleResults,
    flowPath,
    bottlenecks: performance.bottleneckModules.map(b => b.moduleId),
    performance,
    mutations: config.mutations || [],
    errors,
    trace,
  };

  // Save simulation
  const simulation: SandboxSimulation = {
    id: generateId(),
    name: `Flow Test: ${config.flowType}`,
    chamber: 'flow',
    state: 'completed',
    startedAt: new Date(startTime),
    completedAt: new Date(endTime),
    duration: totalDuration,
    config,
    result,
    tags: [config.flowType],
    reproducible: true,
    seed: randomSeed,
  };

  env.history.push(simulation);
  env.currentSimulation = simulation;
  env.state = 'completed';

  return result;
}

/**
 * Get modules for a flow type
 */
function getFlowModules(flowType: FlowTestConfig['flowType']): SandboxModuleType[] {
  switch (flowType) {
    case 'data':
      return ['natalChartEngine', 'synastryEngine', 'compositeChartEngine'];
    case 'timing':
      return ['luckPillarEngine', 'annualLuckEngine', 'monthlyLuckEngine', 'compositeTimingEngine'];
    case 'narrative':
      return ['storyEngine', 'predictiveStoryEngine'];
    case 'environmental':
      return ['qiMenEngine', 'fengShuiEngine', 'environmentalEngine'];
    case 'ritual':
      return ['compositeTimingEngine', 'environmentalEngine', 'ritualTimingEngine'];
    case 'relationship':
      return ['natalChartEngine', 'synastryEngine', 'compositeChartEngine', 'compositeTimingEngine', 'storyEngine'];
    case 'destiny':
      return ['natalChartEngine', 'luckPillarEngine', 'destinySimulationEngine', 'storyEngine'];
    default:
      return [];
  }
}

// ============================================================================
// 🜃 ORCHESTRATION CHAMBER (编排沙盒)
// ============================================================================

/**
 * Run a pipeline test in the sandbox
 */
export function runPipelineTest(
  environmentId: string,
  config: PipelineTestConfig
): PipelineTestResult {
  const env = environments.get(environmentId);
  if (!env) {
    throw new Error(`Environment not found: ${environmentId}`);
  }

  if (env.chamber !== 'orchestration') {
    throw new Error(`Environment ${environmentId} is not an orchestration chamber`);
  }

  env.state = 'running';
  env.lastActiveAt = new Date();

  const startTime = Date.now();
  const trace: SandboxTraceEntry[] = [];
  const errors: SandboxError[] = [];
  const stepResults: PipelineStepResult[] = [];

  trace.push({
    timestamp: new Date(),
    level: 'info',
    source: 'pipelineTest',
    message: `Starting pipeline test: ${config.pipelineName}`,
    data: { mode: config.mode, stepCount: config.steps.length },
  });

  // Apply pipeline mutations
  let steps = [...config.steps];
  for (const mutation of config.mutations || []) {
    if (mutation.type === 'add_step') {
      steps.push(mutation.value as PipelineTestConfig['steps'][0]);
    } else if (mutation.type === 'remove_step') {
      steps = steps.filter(s => s.stepId !== mutation.target);
    } else if (mutation.type === 'reorder') {
      // Mutation value would be new order array
    }
  }

  let context = { ...config.inputs };
  let stepsExecuted = 0;
  let stepsSkipped = 0;
  let stepsFailed = 0;

  // Execute steps based on mode
  for (const step of steps) {
    const stepStartTime = Date.now();
    let stepStatus: PipelineStepResult['status'] = 'running';

    // Check condition
    if (step.condition) {
      const conditionMet = evaluateCondition(step.condition, context);
      if (!conditionMet) {
        stepStatus = 'skipped';
        stepsSkipped++;
        stepResults.push({
          stepId: step.stepId,
          stepName: step.stepName,
          status: stepStatus,
          inputs: {},
          outputs: {},
          conditionMet: false,
          duration: 0,
          retryCount: 0,
        });
        continue;
      }
    }

    try {
      // Map inputs
      const stepInputs = mapInputs(step.inputMapping || {}, context, config.inputs);

      // Execute module
      const outputs = simulateModuleExecution(
        step.moduleId as SandboxModuleType,
        stepInputs,
        []
      );

      // Map outputs back to context
      if (step.outputMapping) {
        for (const [from, to] of Object.entries(step.outputMapping)) {
          context[to] = outputs[from];
        }
      } else {
        context = { ...context, ...outputs };
      }

      stepStatus = 'completed';
      stepsExecuted++;

      stepResults.push({
        stepId: step.stepId,
        stepName: step.stepName,
        status: stepStatus,
        inputs: stepInputs,
        outputs,
        conditionMet: true,
        duration: Date.now() - stepStartTime,
        retryCount: 0,
      });

    } catch (error) {
      stepStatus = 'failed';
      stepsFailed++;

      stepResults.push({
        stepId: step.stepId,
        stepName: step.stepName,
        status: stepStatus,
        inputs: {},
        outputs: {},
        duration: Date.now() - stepStartTime,
        retryCount: 0,
        error: error instanceof Error ? error.message : String(error),
      });

      errors.push({
        id: generateId(),
        timestamp: new Date(),
        source: step.stepId,
        type: 'execution',
        message: error instanceof Error ? error.message : String(error),
        recoverable: false,
      });
    }
  }

  const endTime = Date.now();
  const totalDuration = endTime - startTime;

  // Calculate performance
  const stepTimes = stepResults.map(s => s.duration);
  const longestStep = stepResults.reduce(
    (max, s) => s.duration > max.duration ? s : max,
    { stepId: '', duration: 0 }
  );

  const performance: PipelinePerformance = {
    totalExecutionTimeMs: totalDuration,
    stepCount: steps.length,
    stepsExecuted,
    stepsSkipped,
    stepsFailed,
    parallelEfficiency: config.mode === 'parallel' ? 0.8 : 0,
    averageStepTimeMs: stepTimes.length > 0 ? stepTimes.reduce((a, b) => a + b, 0) / stepTimes.length : 0,
    longestStepTimeMs: longestStep.duration,
    longestStepId: longestStep.stepId || stepResults[0]?.stepId || '',
  };

  trace.push({
    timestamp: new Date(),
    level: 'info',
    source: 'pipelineTest',
    message: `Completed pipeline test: ${config.pipelineName}`,
    duration: totalDuration,
  });

  const result: PipelineTestResult = {
    pipelineId: config.pipelineId,
    pipelineName: config.pipelineName,
    success: errors.length === 0,
    mode: config.mode,
    stepResults,
    finalOutputs: context,
    performance,
    mutations: config.mutations || [],
    errors,
    trace,
  };

  // Save simulation
  const simulation: SandboxSimulation = {
    id: generateId(),
    name: `Pipeline Test: ${config.pipelineName}`,
    chamber: 'orchestration',
    state: errors.length === 0 ? 'completed' : 'error',
    startedAt: new Date(startTime),
    completedAt: new Date(endTime),
    duration: totalDuration,
    config,
    result,
    tags: [config.mode],
    reproducible: true,
    seed: randomSeed,
  };

  env.history.push(simulation);
  env.currentSimulation = simulation;
  env.state = errors.length === 0 ? 'completed' : 'error';

  return result;
}

/**
 * Evaluate a condition string
 */
function evaluateCondition(condition: string, context: Record<string, unknown>): boolean {
  try {
    // Simple condition evaluation (in production, use a safe evaluator)
    const fn = new Function('ctx', `with(ctx) { return ${condition}; }`);
    return !!fn(context);
  } catch {
    return true;
  }
}

/**
 * Map inputs from context
 */
function mapInputs(
  mapping: Record<string, string>,
  context: Record<string, unknown>,
  inputs: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [to, from] of Object.entries(mapping)) {
    if (from.startsWith('input.')) {
      result[to] = inputs[from.slice(6)];
    } else if (from.startsWith('ctx.')) {
      result[to] = context[from.slice(4)];
    } else {
      result[to] = context[from] ?? inputs[from];
    }
  }

  return Object.keys(result).length > 0 ? result : { ...inputs, ...context };
}

// ============================================================================
// 🜄 NARRATIVE CHAMBER (叙事沙盒)
// ============================================================================

/**
 * Run a story test in the sandbox
 */
export function runStoryTest(
  environmentId: string,
  config: StoryTestConfig
): StoryTestResult {
  const env = environments.get(environmentId);
  if (!env) {
    throw new Error(`Environment not found: ${environmentId}`);
  }

  if (env.chamber !== 'narrative') {
    throw new Error(`Environment ${environmentId} is not a narrative chamber`);
  }

  env.state = 'running';
  env.lastActiveAt = new Date();

  const startTime = Date.now();
  const trace: SandboxTraceEntry[] = [];
  const errors: SandboxError[] = [];
  const generatedStories: GeneratedStory[] = [];

  const variations = config.variations || 1;

  trace.push({
    timestamp: new Date(),
    level: 'info',
    source: 'storyTest',
    message: `Starting story test with ${variations} variation(s)`,
    data: { archetypes: config.archetypes },
  });

  // Generate stories
  for (let i = 0; i < variations; i++) {
    const story = generateStory(config, i);
    generatedStories.push(story);

    trace.push({
      timestamp: new Date(),
      level: 'debug',
      source: 'storyTest',
      message: `Generated story ${i + 1}/${variations}`,
      data: { score: story.metrics.overallScore },
    });
  }

  // Calculate average metrics
  const averageMetrics: StoryMetrics = {
    coherenceScore: avg(generatedStories.map(s => s.metrics.coherenceScore)),
    emotionalRange: avg(generatedStories.map(s => s.metrics.emotionalRange)),
    pacing: avg(generatedStories.map(s => s.metrics.pacing)),
    archetypeConsistency: avg(generatedStories.map(s => s.metrics.archetypeConsistency)),
    engagementPrediction: avg(generatedStories.map(s => s.metrics.engagementPrediction)),
    uniquenessScore: avg(generatedStories.map(s => s.metrics.uniquenessScore)),
    overallScore: avg(generatedStories.map(s => s.metrics.overallScore)),
  };

  // Find best and worst
  const sorted = [...generatedStories].sort((a, b) => b.metrics.overallScore - a.metrics.overallScore);
  const bestStory = sorted[0];
  const worstStory = sorted[sorted.length - 1];

  const endTime = Date.now();

  trace.push({
    timestamp: new Date(),
    level: 'info',
    source: 'storyTest',
    message: `Completed story test`,
    duration: endTime - startTime,
    data: { averageScore: averageMetrics.overallScore },
  });

  const result: StoryTestResult = {
    success: errors.length === 0,
    templateId: config.templateId,
    generatedStories,
    bestStory,
    worstStory,
    averageMetrics,
    mutations: config.mutations || [],
    errors,
    trace,
  };

  // Save simulation
  const simulation: SandboxSimulation = {
    id: generateId(),
    name: `Story Test: ${config.templateId || 'custom'}`,
    chamber: 'narrative',
    state: 'completed',
    startedAt: new Date(startTime),
    completedAt: new Date(endTime),
    duration: endTime - startTime,
    config,
    result,
    tags: config.archetypes || [],
    reproducible: true,
    seed: randomSeed,
  };

  env.history.push(simulation);
  env.currentSimulation = simulation;
  env.state = 'completed';

  return result;
}

/**
 * Generate a single story
 */
function generateStory(config: StoryTestConfig, variation: number): GeneratedStory {
  const beatCount = config.beatCount || 12;
  const chapterCount = config.chapterCount || 4;
  const beatsPerChapter = Math.ceil(beatCount / chapterCount);

  const beats: GeneratedStory['beats'] = [];
  const chapters: GeneratedStory['chapters'] = [];
  const emotionalArc: GeneratedStory['emotionalArc'] = [];

  const beatTypes = ['opening', 'rising', 'turning', 'climax', 'falling', 'resolution'];
  const archetypes = config.archetypes || ['hero', 'mentor', 'shadow'];

  // Generate beats
  for (let i = 0; i < beatCount; i++) {
    const position = i / (beatCount - 1);
    const emotionalValue = Math.sin(position * Math.PI) * 50 + 50 + (seededRandom() * 20 - 10);

    beats.push({
      id: `beat-${variation}-${i}`,
      type: beatTypes[Math.floor(position * (beatTypes.length - 1))],
      content: `Beat ${i + 1} content`,
      emotionalValue,
      position,
    });

    emotionalArc.push({ position, value: emotionalValue });
  }

  // Group into chapters
  for (let c = 0; c < chapterCount; c++) {
    const chapterBeats = beats.slice(c * beatsPerChapter, (c + 1) * beatsPerChapter);
    const emotionalValues = chapterBeats.map(b => b.emotionalValue);

    chapters.push({
      id: `chapter-${variation}-${c}`,
      type: ['introduction', 'development', 'climax', 'resolution'][c] || 'development',
      title: `Chapter ${c + 1}`,
      beatIds: chapterBeats.map(b => b.id),
      emotionalRange: {
        min: Math.min(...emotionalValues),
        max: Math.max(...emotionalValues),
      },
    });
  }

  // Create arc
  const arcs: GeneratedStory['arcs'] = [{
    id: `arc-${variation}`,
    type: 'transformation',
    chapterIds: chapters.map(c => c.id),
    pattern: 'hero_journey',
  }];

  // Calculate metrics
  const metrics: StoryMetrics = {
    coherenceScore: 0.7 + seededRandom() * 0.25,
    emotionalRange: Math.max(...emotionalArc.map(p => p.value)) - Math.min(...emotionalArc.map(p => p.value)),
    pacing: 0.6 + seededRandom() * 0.3,
    archetypeConsistency: 0.75 + seededRandom() * 0.2,
    engagementPrediction: 0.65 + seededRandom() * 0.3,
    uniquenessScore: 0.5 + seededRandom() * 0.4,
    overallScore: 0,
  };

  metrics.overallScore = (
    metrics.coherenceScore * 0.25 +
    (metrics.emotionalRange / 100) * 0.15 +
    metrics.pacing * 0.2 +
    metrics.archetypeConsistency * 0.15 +
    metrics.engagementPrediction * 0.15 +
    metrics.uniquenessScore * 0.1
  );

  return {
    id: `story-${variation}`,
    beats,
    chapters,
    arcs,
    emotionalArc,
    metrics,
    archetypesUsed: archetypes,
    toneUsed: 'hopeful',
  };
}

/**
 * Calculate average of numbers
 */
function avg(numbers: number[]): number {
  return numbers.length > 0 ? numbers.reduce((a, b) => a + b, 0) / numbers.length : 0;
}

// ============================================================================
// SNAPSHOT MANAGEMENT
// ============================================================================

/**
 * Create a snapshot of the current environment state
 */
export function createSnapshot(
  environmentId: string,
  name: string,
  description?: string
): SandboxSnapshot {
  const env = environments.get(environmentId);
  if (!env) {
    throw new Error(`Environment not found: ${environmentId}`);
  }

  const snapshot: SandboxSnapshot = {
    id: generateId(),
    name,
    description,
    createdAt: new Date(),
    state: env.state,
    memory: deepClone(serializeMemory(env.memory)) as unknown as SandboxMemory,
    simulations: deepClone(env.history),
    mutations: [],
    config: deepClone(env.config),
    size: JSON.stringify(env).length,
  };

  env.snapshots.push(snapshot);

  // Trim to max snapshots
  while (env.snapshots.length > env.config.maxSnapshots) {
    env.snapshots.shift();
  }

  emitEvent('snapshotCreated', environmentId, { snapshotId: snapshot.id, name });

  return snapshot;
}

/**
 * Restore environment from snapshot
 */
export function restoreSnapshot(
  environmentId: string,
  snapshotId: string
): SandboxEnvironment | null {
  const env = environments.get(environmentId);
  if (!env) return null;

  const snapshot = env.snapshots.find(s => s.id === snapshotId);
  if (!snapshot) return null;

  env.state = 'idle';
  env.memory = deserializeMemory(snapshot.memory as unknown as Record<string, unknown>);
  env.config = deepClone(snapshot.config);
  env.lastActiveAt = new Date();

  emitEvent('snapshotRestored', environmentId, { snapshotId });

  return env;
}

/**
 * Compare two snapshots
 */
export function compareSnapshots(
  environmentId: string,
  snapshotIdA: string,
  snapshotIdB: string
): SnapshotComparison | null {
  const env = environments.get(environmentId);
  if (!env) return null;

  const snapshotA = env.snapshots.find(s => s.id === snapshotIdA);
  const snapshotB = env.snapshots.find(s => s.id === snapshotIdB);

  if (!snapshotA || !snapshotB) return null;

  // Compare memory
  const memoryDiff: SandboxMemoryDiff = {
    added: [],
    removed: [],
    modified: [],
    unchanged: 0,
  };

  // Compare config
  const configDiff: { key: string; a: unknown; b: unknown }[] = [];
  for (const key of Object.keys(snapshotA.config) as Array<keyof SandboxConfig>) {
    if (JSON.stringify(snapshotA.config[key]) !== JSON.stringify(snapshotB.config[key])) {
      configDiff.push({ key, a: snapshotA.config[key], b: snapshotB.config[key] });
    }
  }

  return {
    snapshotA: snapshotIdA,
    snapshotB: snapshotIdB,
    memoryDiff,
    configDiff,
    simulationCountDiff: snapshotB.simulations.length - snapshotA.simulations.length,
    mutationDiff: { added: [], removed: [], modified: [] },
  };
}

// ============================================================================
// SIMULATION REPLAY
// ============================================================================

/**
 * Replay a simulation with optional modifications
 */
export function replaySimulation(
  environmentId: string,
  options: SimulationReplayOptions
): ModuleTestResult | FlowTestResult | PipelineTestResult | StoryTestResult | null {
  const env = environments.get(environmentId);
  if (!env) return null;

  const simulation = env.history.find(s => s.id === options.simulationId);
  if (!simulation) return null;

  // Modify seed if requested
  if (options.changeRandomSeed !== undefined) {
    setRandomSeed(options.changeRandomSeed);
  }

  // Create modified config
  let config = deepClone(simulation.config);

  // Apply input modifications
  if (options.modifyInputs && 'inputs' in config) {
    config.inputs = { ...config.inputs, ...options.modifyInputs };
  }

  // Run based on chamber type
  switch (simulation.chamber) {
    case 'module':
      return runModuleTest(environmentId, config as ModuleTestConfig);
    case 'flow':
      return runFlowTest(environmentId, config as FlowTestConfig);
    case 'orchestration':
      return runPipelineTest(environmentId, config as PipelineTestConfig);
    case 'narrative':
      return runStoryTest(environmentId, config as StoryTestConfig);
    default:
      return null;
  }
}

// ============================================================================
// COMPARISON
// ============================================================================

/**
 * Compare two simulations
 */
export function compareSimulations(
  environmentId: string,
  simulationIdA: string,
  simulationIdB: string
): SimulationComparison | null {
  const env = environments.get(environmentId);
  if (!env) return null;

  const simA = env.history.find(s => s.id === simulationIdA);
  const simB = env.history.find(s => s.id === simulationIdB);

  if (!simA || !simB || simA.chamber !== simB.chamber) return null;

  const outputDiffs: SimulationComparison['outputDiffs'] = [];
  const resultA = simA.result;
  const resultB = simB.result;

  if (resultA && resultB && 'finalOutputs' in resultA && 'finalOutputs' in resultB) {
    const allKeys = new Set([
      ...Object.keys(resultA.finalOutputs || {}),
      ...Object.keys(resultB.finalOutputs || {}),
    ]);

    for (const key of allKeys) {
      const valueA = (resultA.finalOutputs as Record<string, unknown>)[key];
      const valueB = (resultB.finalOutputs as Record<string, unknown>)[key];

      if (JSON.stringify(valueA) !== JSON.stringify(valueB)) {
        outputDiffs.push({
          path: key,
          valueA,
          valueB,
          percentDiff: typeof valueA === 'number' && typeof valueB === 'number'
            ? ((valueB - valueA) / valueA) * 100
            : undefined,
        });
      }
    }
  }

  const durationA = simA.duration || 0;
  const durationB = simB.duration || 0;

  return {
    simulationA: simulationIdA,
    simulationB: simulationIdB,
    chamber: simA.chamber,
    outputDiffs,
    performanceDiff: {
      executionTimeDiff: durationB - durationA,
      memoryDiff: 0,
      throughputDiff: 0,
    },
    overallSimilarity: 1 - (outputDiffs.length / 10),
    significantDifferences: outputDiffs.map(d => d.path),
    recommendation: outputDiffs.length === 0
      ? 'Results are identical'
      : 'Results differ - review differences',
  };
}

// ============================================================================
// SYNTHETIC DATA GENERATION
// ============================================================================

/**
 * Generate synthetic test data
 */
export function generateSyntheticData(config: SyntheticDataConfig): SyntheticData[] {
  const results: SyntheticData[] = [];

  if (config.seed !== undefined) {
    setRandomSeed(config.seed);
  }

  for (let i = 0; i < config.count; i++) {
    let data: unknown;

    switch (config.type) {
      case 'chart':
        data = generateSyntheticChart(config.constraints);
        break;
      case 'timing':
        data = generateSyntheticTiming(config.constraints);
        break;
      case 'story':
        data = generateSyntheticStory(config.constraints);
        break;
      case 'relationship':
        data = generateSyntheticRelationship(config.constraints);
        break;
      case 'ritual':
        data = generateSyntheticRitual(config.constraints);
        break;
    }

    results.push({
      id: generateId(),
      type: config.type,
      data,
      constraints: config.constraints || {},
      seed: randomSeed,
      generatedAt: new Date(),
    });
  }

  return results;
}

function generateSyntheticChart(constraints?: SyntheticDataConfig['constraints']): Record<string, unknown> {
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  const dayMaster = constraints?.dayMasters?.[Math.floor(seededRandom() * constraints.dayMasters.length)]
    || stems[Math.floor(seededRandom() * stems.length)];

  return {
    dayMaster,
    yearPillar: stems[Math.floor(seededRandom() * 10)] + branches[Math.floor(seededRandom() * 12)],
    monthPillar: stems[Math.floor(seededRandom() * 10)] + branches[Math.floor(seededRandom() * 12)],
    dayPillar: dayMaster + branches[Math.floor(seededRandom() * 12)],
    hourPillar: stems[Math.floor(seededRandom() * 10)] + branches[Math.floor(seededRandom() * 12)],
    elements: {
      wood: Math.floor(seededRandom() * 4) + 1,
      fire: Math.floor(seededRandom() * 4) + 1,
      earth: Math.floor(seededRandom() * 4) + 1,
      metal: Math.floor(seededRandom() * 4) + 1,
      water: Math.floor(seededRandom() * 4) + 1,
    },
  };
}

function generateSyntheticTiming(constraints?: SyntheticDataConfig['constraints']): Record<string, unknown> {
  const start = constraints?.dateRange?.start || new Date();
  const end = constraints?.dateRange?.end || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  return {
    date: new Date(start.getTime() + seededRandom() * (end.getTime() - start.getTime())),
    annualScore: 50 + seededRandom() * 50,
    monthlyScore: 50 + seededRandom() * 50,
    dailyScore: 50 + seededRandom() * 50,
    hasClash: constraints?.includeClashes && seededRandom() > 0.7,
    hasBlessing: constraints?.includeBlessings && seededRandom() > 0.6,
  };
}

function generateSyntheticStory(constraints?: SyntheticDataConfig['constraints']): Record<string, unknown> {
  const archetypes = constraints?.archetypes || ['hero', 'mentor', 'shadow'];
  const tones = constraints?.tones || ['hopeful', 'dramatic', 'contemplative'];

  return {
    archetype: archetypes[Math.floor(seededRandom() * archetypes.length)],
    tone: tones[Math.floor(seededRandom() * tones.length)],
    beatCount: 8 + Math.floor(seededRandom() * 8),
    emotionalPeak: (constraints?.emotionalRanges?.min || 0) +
      seededRandom() * ((constraints?.emotionalRanges?.max || 100) - (constraints?.emotionalRanges?.min || 0)),
  };
}

function generateSyntheticRelationship(constraints?: SyntheticDataConfig['constraints']): Record<string, unknown> {
  const minCompat = constraints?.compatibilityRange?.min || 0;
  const maxCompat = constraints?.compatibilityRange?.max || 100;

  return {
    chartA: generateSyntheticChart(),
    chartB: generateSyntheticChart(),
    compatibility: minCompat + seededRandom() * (maxCompat - minCompat),
    hasConflicts: constraints?.includeConflicts && seededRandom() > 0.5,
  };
}

function generateSyntheticRitual(constraints?: SyntheticDataConfig['constraints']): Record<string, unknown> {
  return {
    type: ['marriage', 'business', 'travel', 'health'][Math.floor(seededRandom() * 4)],
    timing: generateSyntheticTiming(constraints),
    score: 50 + seededRandom() * 50,
    direction: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(seededRandom() * 8)],
  };
}

// ============================================================================
// UI STATE MANAGEMENT
// ============================================================================

/**
 * Initialize the Alchemist's Table UI state
 */
export function initializeAlchemistTable(): AlchemistTableState {
  alchemistTableState = {
    activeChamber: 'module',
    modulePanel: {
      mutations: [],
      showIntermediates: true,
      showPerformance: true,
    },
    flowPanel: {
      breakpoints: [],
      visualizationMode: 'graph',
    },
    orchestrationPanel: {
      mutations: [],
      viewMode: 'steps',
    },
    storyPanel: {
      comparisonMode: false,
      showEmotionalArc: true,
    },
    memoryViewer: {
      showDiff: false,
    },
    traceViewer: {
      filterLevel: 'all',
      autoScroll: true,
      showTimestamps: true,
    },
    comparisonViewer: {
      mode: 'simulations',
    },
  };

  return alchemistTableState;
}

/**
 * Get the Alchemist's Table state
 */
export function getAlchemistTableState(): AlchemistTableState | null {
  return alchemistTableState;
}

/**
 * Set active chamber
 */
export function setActiveChamber(chamber: SandboxChamber): void {
  if (alchemistTableState) {
    alchemistTableState.activeChamber = chamber;
  }
}

// ============================================================================
// EVENT SYSTEM
// ============================================================================

/**
 * Add an event listener
 */
export function addSandboxEventListener(
  type: SandboxEventType,
  listener: SandboxEventListener
): () => void {
  if (!eventListeners.has(type)) {
    eventListeners.set(type, new Set());
  }
  eventListeners.get(type)!.add(listener);

  return () => {
    eventListeners.get(type)?.delete(listener);
  };
}

/**
 * Emit an event
 */
function emitEvent(
  type: SandboxEventType,
  environmentId: string,
  data: Record<string, unknown>
): void {
  const event: SandboxEvent = {
    type,
    timestamp: new Date(),
    environmentId,
    data,
  };

  const listeners = eventListeners.get(type);
  if (listeners) {
    for (const listener of listeners) {
      try {
        listener(event);
      } catch (error) {
        console.error('Sandbox event listener error:', error);
      }
    }
  }
}

// ============================================================================
// CLEANUP
// ============================================================================

/**
 * Clean up old simulations and snapshots
 */
export function cleanupEnvironment(environmentId: string): void {
  const env = environments.get(environmentId);
  if (!env) return;

  // Trim history
  while (env.history.length > env.config.maxSimulations) {
    env.history.shift();
  }

  // Trim snapshots
  while (env.snapshots.length > env.config.maxSnapshots) {
    env.snapshots.shift();
  }
}

/**
 * Clean up all environments
 */
export function cleanupAllEnvironments(): void {
  for (const envId of environments.keys()) {
    cleanupEnvironment(envId);
  }
}
