/**
 * ============================================================================
 * CATHEDRAL ORCHESTRATION ENGINE (大教堂编排引擎)
 * ============================================================================
 *
 * The clockwork beneath the cathedral floor.
 * Automated pipelines that run modules in sequence.
 *
 * Modes:
 * - Linear: Sequential step execution
 * - Conditional: Branching based on context
 * - Parallel: Simultaneous execution with merge
 * - Recursive: Self-calling for collections/systems
 *
 * This is where your cathedral becomes a self-running ritual machine.
 *
 * Created: January 2026
 * ============================================================================
 */

import type {
  OrchestrationMode,
  ModuleId,
  OrchestrationContext,
  OrchestrationStep,
  OrchestrationPipeline,
  OrchestrationResult,
  OrchestrationError,
  StepExecutionRecord,
  StepCondition,
  StepInput,
  PipelineTemplateId,
  OrchestrationEngineInput,
  OrchestrationEngineOutput,
  DataFlow,
  PipelineVisualizationData,
  PipelineNode,
  PipelineEdge,
  ExecutionTimelineData,
  ConditionalBranch,
  RecursionConfig
} from './orchestrationTypes';

import {
  MODULE_CHINESE,
  PIPELINE_TEMPLATE_DESCRIPTIONS
} from './orchestrationTypes';

// ============================================================================
// MODULE RESOLVER
// ============================================================================

/**
 * Registry of module functions
 * In production, these would import actual engine functions
 */
type ModuleFunction = (input: unknown) => unknown | Promise<unknown>;

const moduleRegistry: Partial<Record<ModuleId, ModuleFunction>> = {};

/**
 * Register a module function
 */
export function registerModule(moduleId: ModuleId, fn: ModuleFunction): void {
  moduleRegistry[moduleId] = fn;
}

/**
 * Resolve a module function by ID
 */
function resolveModule(moduleId: ModuleId): ModuleFunction {
  const fn = moduleRegistry[moduleId];
  if (!fn) {
    // Return a placeholder that returns empty result
    return async (input: unknown) => {
      console.warn(`Module ${moduleId} not registered. Returning placeholder result.`);
      return { _placeholder: true, moduleId, input };
    };
  }
  return fn;
}

/**
 * Check if a module is registered
 */
export function isModuleRegistered(moduleId: ModuleId): boolean {
  return moduleId in moduleRegistry;
}

/**
 * Get all registered modules
 */
export function getRegisteredModules(): ModuleId[] {
  return Object.keys(moduleRegistry) as ModuleId[];
}

// ============================================================================
// CONTEXT HELPERS
// ============================================================================

/**
 * Create initial orchestration context
 */
function createContext(
  pipeline: OrchestrationPipeline,
  inputs: Record<string, unknown>
): OrchestrationContext {
  return {
    inputs,
    outputs: {},
    meta: {
      pipelineId: pipeline.id,
      pipelineLabel: pipeline.label,
      startedAt: new Date().toISOString(),
      stepsCompleted: 0,
      stepsTotal: pipeline.steps.length,
      executionMode: pipeline.mode
    },
    errors: [],
    state: {
      status: 'pending',
      progress: 0
    }
  };
}

/**
 * Get value from context by path (e.g., "outputs.natalA.dayMaster")
 */
function getContextValue(ctx: OrchestrationContext, path: string): unknown {
  const parts = path.split('.');
  let current: unknown = ctx;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return current;
}

/**
 * Set value in context by path
 */
function setContextValue(ctx: OrchestrationContext, path: string, value: unknown): void {
  const parts = path.split('.');
  let current: Record<string, unknown> = ctx as unknown as Record<string, unknown>;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!(part in current)) {
      current[part] = {};
    }
    current = current[part] as Record<string, unknown>;
  }

  current[parts[parts.length - 1]] = value;
}

// ============================================================================
// CONDITION EVALUATION
// ============================================================================

/**
 * Evaluate a step condition
 */
function evaluateCondition(condition: StepCondition, ctx: OrchestrationContext): boolean {
  switch (condition.type) {
    case 'always':
      return true;

    case 'never':
      return false;

    case 'equals': {
      const value = getContextValue(ctx, condition.path);
      return value === condition.value;
    }

    case 'notEquals': {
      const value = getContextValue(ctx, condition.path);
      return value !== condition.value;
    }

    case 'exists': {
      const value = getContextValue(ctx, condition.path);
      return value !== undefined && value !== null;
    }

    case 'notExists': {
      const value = getContextValue(ctx, condition.path);
      return value === undefined || value === null;
    }

    case 'greaterThan': {
      const value = getContextValue(ctx, condition.path);
      return typeof value === 'number' && value > condition.value;
    }

    case 'lessThan': {
      const value = getContextValue(ctx, condition.path);
      return typeof value === 'number' && value < condition.value;
    }

    case 'in': {
      const value = getContextValue(ctx, condition.path);
      return condition.values.includes(value);
    }

    case 'custom':
      return condition.predicate(ctx);

    default:
      return true;
  }
}

// ============================================================================
// INPUT RESOLUTION
// ============================================================================

/**
 * Resolve step input based on input specification
 */
function resolveInput(input: StepInput, ctx: OrchestrationContext): unknown {
  switch (input.type) {
    case 'static':
      return input.value;

    case 'context':
      return getContextValue(ctx, input.path);

    case 'transform': {
      const source = getContextValue(ctx, input.source);
      // In production, this would use a transformer registry
      return source;
    }

    case 'merge': {
      const merged: Record<string, unknown> = {};
      for (const sourcePath of input.sources) {
        const value = getContextValue(ctx, sourcePath);
        if (typeof value === 'object' && value !== null) {
          Object.assign(merged, value);
        }
      }
      return merged;
    }

    case 'function':
      return input.resolver(ctx);

    default:
      return undefined;
  }
}

// ============================================================================
// STEP EXECUTION
// ============================================================================

/**
 * Execute a single step
 */
async function executeStep(
  step: OrchestrationStep,
  ctx: OrchestrationContext
): Promise<StepExecutionRecord> {
  const startedAt = new Date().toISOString();
  const startTime = Date.now();

  ctx.state.currentStepId = step.id;
  ctx.meta.currentStep = step.id;

  // Run before hook
  if (step.hooks?.beforeExecute) {
    await step.hooks.beforeExecute(ctx, step);
  }

  // Check condition
  if (step.condition && !evaluateCondition(step.condition, ctx)) {
    return {
      stepId: step.id,
      module: step.module,
      status: 'skipped',
      startedAt,
      skippedReason: 'Condition not met'
    };
  }

  try {
    // Resolve input
    const input = resolveInput(step.input, ctx);

    // Get module function
    const moduleFn = resolveModule(step.module);

    // Execute with timeout if specified
    let result: unknown;
    if (step.options?.timeout) {
      result = await Promise.race([
        moduleFn(input),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Step timeout')), step.options!.timeout)
        )
      ]);
    } else {
      result = await moduleFn(input);
    }

    // Store output
    ctx.outputs[step.outputKey] = result;

    // Run after hook
    if (step.hooks?.afterExecute) {
      await step.hooks.afterExecute(ctx, step, result);
    }

    const completedAt = new Date().toISOString();
    ctx.meta.stepsCompleted++;

    return {
      stepId: step.id,
      module: step.module,
      status: 'completed',
      startedAt,
      completedAt,
      durationMs: Date.now() - startTime,
      outputKey: step.outputKey
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Run error hook
    if (step.hooks?.onError) {
      await step.hooks.onError(ctx, step, error instanceof Error ? error : new Error(errorMessage));
    }

    // Handle error based on strategy
    const handler = step.onError || { strategy: 'fail' };

    if (handler.strategy === 'skip') {
      return {
        stepId: step.id,
        module: step.module,
        status: 'skipped',
        startedAt,
        skippedReason: `Error skipped: ${errorMessage}`
      };
    }

    if (handler.strategy === 'fallback' && handler.fallbackValue !== undefined) {
      ctx.outputs[step.outputKey] = handler.fallbackValue;
      return {
        stepId: step.id,
        module: step.module,
        status: 'completed',
        startedAt,
        completedAt: new Date().toISOString(),
        durationMs: Date.now() - startTime,
        outputKey: step.outputKey
      };
    }

    // Record error
    ctx.errors.push({
      stepId: step.id,
      module: step.module,
      error: errorMessage,
      timestamp: new Date().toISOString(),
      recoverable: handler.strategy !== 'fail'
    });

    return {
      stepId: step.id,
      module: step.module,
      status: 'failed',
      startedAt,
      error: errorMessage
    };
  }
}

// ============================================================================
// PIPELINE EXECUTION - LINEAR
// ============================================================================

/**
 * Execute a linear pipeline
 */
async function executeLinearPipeline(
  pipeline: OrchestrationPipeline,
  ctx: OrchestrationContext
): Promise<StepExecutionRecord[]> {
  const records: StepExecutionRecord[] = [];

  for (let i = 0; i < pipeline.steps.length; i++) {
    const step = pipeline.steps[i];

    // Update progress
    ctx.state.progress = Math.round((i / pipeline.steps.length) * 100);

    // Execute step
    const record = await executeStep(step, ctx);
    records.push(record);

    // Check for failure
    if (record.status === 'failed' && pipeline.options?.stopOnFirstError !== false) {
      ctx.state.status = 'failed';
      ctx.state.failedAtStep = step.id;
      break;
    }

    // Call progress hook
    if (pipeline.hooks?.onStepComplete) {
      await pipeline.hooks.onStepComplete(ctx, step, ctx.outputs[step.outputKey]);
    }
  }

  return records;
}

// ============================================================================
// PIPELINE EXECUTION - CONDITIONAL
// ============================================================================

/**
 * Execute a conditional pipeline
 */
async function executeConditionalPipeline(
  pipeline: OrchestrationPipeline,
  ctx: OrchestrationContext
): Promise<StepExecutionRecord[]> {
  const records: StepExecutionRecord[] = [];
  const branches = pipeline.branches || [];

  // Find matching branch
  let matchedBranch: ConditionalBranch | undefined;
  for (const branch of branches) {
    if (branch.isDefault) {
      matchedBranch = matchedBranch || branch;
    } else if (evaluateCondition(branch.condition, ctx)) {
      matchedBranch = branch;
      break;
    }
  }

  if (!matchedBranch) {
    // Execute main steps if no branch matches
    return executeLinearPipeline(pipeline, ctx);
  }

  // Execute branch steps
  for (let i = 0; i < matchedBranch.steps.length; i++) {
    const step = matchedBranch.steps[i];
    ctx.state.progress = Math.round((i / matchedBranch.steps.length) * 100);

    const record = await executeStep(step, ctx);
    records.push(record);

    if (record.status === 'failed' && pipeline.options?.stopOnFirstError !== false) {
      ctx.state.status = 'failed';
      ctx.state.failedAtStep = step.id;
      break;
    }
  }

  return records;
}

// ============================================================================
// PIPELINE EXECUTION - PARALLEL
// ============================================================================

/**
 * Execute a parallel pipeline
 */
async function executeParallelPipeline(
  pipeline: OrchestrationPipeline,
  ctx: OrchestrationContext
): Promise<StepExecutionRecord[]> {
  const records: StepExecutionRecord[] = [];
  const parallelGroups = pipeline.parallelGroups || [];

  if (parallelGroups.length === 0) {
    // No groups defined, run all steps in parallel
    const promises = pipeline.steps.map(step => executeStep(step, ctx));
    const results = await Promise.allSettled(promises);

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.status === 'fulfilled') {
        records.push(result.value);
      } else {
        records.push({
          stepId: pipeline.steps[i].id,
          module: pipeline.steps[i].module,
          status: 'failed',
          startedAt: new Date().toISOString(),
          error: result.reason?.message || 'Unknown error'
        });
      }
    }
  } else {
    // Execute groups sequentially, steps within groups in parallel
    for (const group of parallelGroups) {
      const groupSteps = pipeline.steps.filter(s => group.stepIds.includes(s.id));
      const promises = groupSteps.map(step => executeStep(step, ctx));

      if (group.waitForAll) {
        const results = await Promise.allSettled(promises);
        for (let i = 0; i < results.length; i++) {
          const result = results[i];
          if (result.status === 'fulfilled') {
            records.push(result.value);
          } else {
            const failRecord: StepExecutionRecord = {
              stepId: groupSteps[i].id,
              module: groupSteps[i].module,
              status: 'failed',
              startedAt: new Date().toISOString(),
              error: result.reason?.message || 'Unknown error'
            };
            records.push(failRecord);

            if (group.failOnAny) {
              ctx.state.status = 'failed';
              return records;
            }
          }
        }
      } else {
        // Race - first to complete wins
        const result = await Promise.race(promises);
        records.push(result);
      }
    }
  }

  return records;
}

// ============================================================================
// PIPELINE EXECUTION - RECURSIVE
// ============================================================================

/**
 * Execute a recursive pipeline
 */
async function executeRecursivePipeline(
  pipeline: OrchestrationPipeline,
  ctx: OrchestrationContext
): Promise<StepExecutionRecord[]> {
  const records: StepExecutionRecord[] = [];
  const config = pipeline.recursionConfig;

  if (!config) {
    // No recursion config, fall back to linear
    return executeLinearPipeline(pipeline, ctx);
  }

  // Get collection to iterate
  const collection = getContextValue(ctx, config.collectionPath) as unknown[];
  if (!Array.isArray(collection)) {
    ctx.errors.push({
      stepId: 'recursion',
      module: 'aggregationEngine',
      error: `Collection at ${config.collectionPath} is not an array`,
      timestamp: new Date().toISOString(),
      recoverable: false
    });
    return records;
  }

  const results: unknown[] = [];

  // Process each item
  for (let i = 0; i < collection.length && i < config.maxDepth; i++) {
    const item = collection[i];

    // Create sub-context for this iteration
    const subCtx: OrchestrationContext = {
      ...ctx,
      inputs: { ...ctx.inputs, _currentItem: item, _currentIndex: i },
      outputs: { ...ctx.outputs }
    };

    // Execute item steps
    for (const step of config.itemSteps) {
      const record = await executeStep(step, subCtx);
      records.push(record);

      if (record.status === 'failed') {
        break;
      }
    }

    // Collect result
    const lastOutputKey = config.itemSteps[config.itemSteps.length - 1]?.outputKey;
    if (lastOutputKey && subCtx.outputs[lastOutputKey]) {
      results.push(subCtx.outputs[lastOutputKey]);
    }

    // Update progress
    ctx.state.progress = Math.round(((i + 1) / collection.length) * 100);
  }

  // Aggregate results
  switch (config.aggregation) {
    case 'collect':
      ctx.outputs._recursionResults = results;
      break;

    case 'merge':
      ctx.outputs._recursionResults = results.reduce<Record<string, unknown>>((acc, item) => {
        if (typeof item === 'object' && item !== null) {
          return { ...acc, ...item };
        }
        return acc;
      }, {});
      break;

    case 'reduce':
      if (config.reducer) {
        ctx.outputs._recursionResults = results.reduce(config.reducer);
      } else {
        ctx.outputs._recursionResults = results;
      }
      break;
  }

  return records;
}

// ============================================================================
// MAIN PIPELINE EXECUTION
// ============================================================================

/**
 * Execute a pipeline
 */
export async function runPipeline(
  pipeline: OrchestrationPipeline,
  inputs: Record<string, unknown>
): Promise<OrchestrationResult> {
  const startTime = Date.now();
  const ctx = createContext(pipeline, inputs);

  ctx.state.status = 'running';

  // Run before pipeline hook
  if (pipeline.hooks?.beforePipeline) {
    await pipeline.hooks.beforePipeline(ctx);
  }

  let stepsExecuted: StepExecutionRecord[] = [];

  try {
    // Execute based on mode
    switch (pipeline.mode) {
      case 'linear':
        stepsExecuted = await executeLinearPipeline(pipeline, ctx);
        break;

      case 'conditional':
        stepsExecuted = await executeConditionalPipeline(pipeline, ctx);
        break;

      case 'parallel':
        stepsExecuted = await executeParallelPipeline(pipeline, ctx);
        break;

      case 'recursive':
        stepsExecuted = await executeRecursivePipeline(pipeline, ctx);
        break;
    }

    // Update final state
    if (ctx.state.status !== 'failed') {
      ctx.state.status = 'completed';
      ctx.state.progress = 100;
    }

  } catch (error) {
    ctx.state.status = 'failed';
    ctx.errors.push({
      stepId: 'pipeline',
      module: 'validationEngine',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
      recoverable: false
    });
  }

  // Run after pipeline hook
  if (pipeline.hooks?.afterPipeline) {
    await pipeline.hooks.afterPipeline(ctx);
  }

  const completedAt = new Date().toISOString();
  ctx.meta.completedAt = completedAt;

  // Build result
  const result: OrchestrationResult = {
    success: ctx.state.status === 'completed',
    pipelineId: pipeline.id,
    pipelineLabel: pipeline.label,
    startedAt: ctx.meta.startedAt,
    completedAt,
    durationMs: Date.now() - startTime,
    outputs: ctx.outputs,
    stepsExecuted,
    errors: ctx.errors,
    summary: {
      totalSteps: stepsExecuted.length,
      completedSteps: stepsExecuted.filter(s => s.status === 'completed').length,
      skippedSteps: stepsExecuted.filter(s => s.status === 'skipped').length,
      failedSteps: stepsExecuted.filter(s => s.status === 'failed').length
    }
  };

  return result;
}

// ============================================================================
// ORCHESTRATION ENGINE
// ============================================================================

/**
 * Main orchestration engine function
 */
export async function orchestrate(
  input: OrchestrationEngineInput
): Promise<OrchestrationEngineOutput> {
  // Resolve pipeline
  let pipeline: OrchestrationPipeline;
  if (typeof input.pipeline === 'string') {
    pipeline = getPipelineTemplate(input.pipeline);
  } else {
    pipeline = input.pipeline;
  }

  // Apply option overrides
  if (input.options) {
    pipeline = {
      ...pipeline,
      options: { ...pipeline.options, ...input.options }
    };
  }

  // Handle dry run
  if (input.control?.dryRun) {
    const validation = validatePipeline(pipeline, input.inputs);
    const introspection = introspectPipeline(pipeline);

    return {
      result: {
        success: validation.valid,
        pipelineId: pipeline.id,
        pipelineLabel: pipeline.label,
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        durationMs: 0,
        outputs: {},
        stepsExecuted: [],
        errors: [],
        summary: {
          totalSteps: pipeline.steps.length,
          completedSteps: 0,
          skippedSteps: 0,
          failedSteps: 0
        }
      },
      validation,
      introspection
    };
  }

  // Handle step control
  let stepsToRun = pipeline.steps;

  if (input.control?.skipSteps) {
    stepsToRun = stepsToRun.filter(s => !input.control!.skipSteps!.includes(s.id));
  }

  if (input.control?.startFromStep) {
    const startIndex = stepsToRun.findIndex(s => s.id === input.control!.startFromStep);
    if (startIndex >= 0) {
      stepsToRun = stepsToRun.slice(startIndex);
    }
  }

  if (input.control?.stopAtStep) {
    const stopIndex = stepsToRun.findIndex(s => s.id === input.control!.stopAtStep);
    if (stopIndex >= 0) {
      stepsToRun = stepsToRun.slice(0, stopIndex + 1);
    }
  }

  const modifiedPipeline = { ...pipeline, steps: stepsToRun };

  // Execute pipeline
  const result = await runPipeline(modifiedPipeline, input.inputs);

  // Build introspection
  const introspection = introspectPipeline(pipeline);

  return {
    result,
    introspection
  };
}

// ============================================================================
// PIPELINE VALIDATION
// ============================================================================

/**
 * Validate a pipeline before execution
 */
function validatePipeline(
  pipeline: OrchestrationPipeline,
  inputs: Record<string, unknown>
): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required inputs
  if (pipeline.inputSchema) {
    for (const [key, field] of Object.entries(pipeline.inputSchema)) {
      if (field.required && !(key in inputs)) {
        errors.push(`Missing required input: ${key}`);
      }
    }
  }

  // Check step dependencies
  const outputKeys = new Set<string>();
  for (const step of pipeline.steps) {
    // Check if input references exist
    if (step.input.type === 'context') {
      const path = step.input.path;
      if (path.startsWith('outputs.')) {
        const outputKey = path.split('.')[1];
        if (!outputKeys.has(outputKey) && !path.startsWith('outputs._')) {
          warnings.push(`Step ${step.id} references output '${outputKey}' which may not exist yet`);
        }
      }
    }

    // Track output
    outputKeys.add(step.outputKey);

    // Check module registration
    if (!isModuleRegistered(step.module)) {
      warnings.push(`Module ${step.module} is not registered`);
    }
  }

  // Check for duplicate step IDs
  const stepIds = pipeline.steps.map(s => s.id);
  const duplicates = stepIds.filter((id, i) => stepIds.indexOf(id) !== i);
  if (duplicates.length > 0) {
    errors.push(`Duplicate step IDs: ${duplicates.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

// ============================================================================
// PIPELINE INTROSPECTION
// ============================================================================

/**
 * Introspect a pipeline to understand its structure
 */
function introspectPipeline(pipeline: OrchestrationPipeline): {
  modulesUsed: ModuleId[];
  dataFlows: DataFlow[];
  estimatedDuration?: number;
} {
  const modulesUsed = [...new Set(pipeline.steps.map(s => s.module))];

  const dataFlows: DataFlow[] = [];

  // Track data flows
  for (const step of pipeline.steps) {
    // Input flow
    if (step.input.type === 'context') {
      const path = step.input.path;
      if (path.startsWith('inputs.')) {
        dataFlows.push({
          from: 'input',
          to: step.id,
          dataKey: path.split('.')[1]
        });
      } else if (path.startsWith('outputs.')) {
        const outputKey = path.split('.')[1];
        const sourceStep = pipeline.steps.find(s => s.outputKey === outputKey);
        if (sourceStep) {
          dataFlows.push({
            from: sourceStep.id,
            to: step.id,
            dataKey: outputKey
          });
        }
      }
    }

    // Output flow (to final output)
    if (pipeline.outputKeys?.includes(step.outputKey)) {
      dataFlows.push({
        from: step.id,
        to: 'output',
        dataKey: step.outputKey
      });
    }
  }

  return {
    modulesUsed,
    dataFlows
  };
}

// ============================================================================
// PIPELINE TEMPLATES
// ============================================================================

/**
 * Get a predefined pipeline template
 */
export function getPipelineTemplate(templateId: PipelineTemplateId): OrchestrationPipeline {
  switch (templateId) {
    case 'relationshipForecast':
      return createRelationshipForecastPipeline();

    case 'personalStory':
      return createPersonalStoryPipeline();

    case 'ritualCalendar':
      return createRitualCalendarPipeline();

    case 'dailyGuidance':
      return createDailyGuidancePipeline();

    case 'actionRecommendation':
      return createActionRecommendationPipeline();

    default:
      // Return a generic pipeline
      return {
        id: templateId,
        label: PIPELINE_TEMPLATE_DESCRIPTIONS[templateId]?.en || templateId,
        labelChinese: PIPELINE_TEMPLATE_DESCRIPTIONS[templateId]?.zh,
        mode: PIPELINE_TEMPLATE_DESCRIPTIONS[templateId]?.mode || 'linear',
        steps: [],
        metadata: {
          version: '1.0.0',
          createdAt: new Date().toISOString()
        }
      };
  }
}

/**
 * Create relationship forecast pipeline
 */
function createRelationshipForecastPipeline(): OrchestrationPipeline {
  return {
    id: 'relationshipForecast',
    label: 'Relationship Forecast Pipeline',
    labelChinese: '关系预测编排',
    description: 'Complete relationship analysis from charts to actions',
    mode: 'linear',
    steps: [
      {
        id: 'natalA',
        module: 'natalChartEngine',
        label: 'Calculate Natal Chart A',
        input: { type: 'context', path: 'inputs.personA' },
        outputKey: 'natalA'
      },
      {
        id: 'natalB',
        module: 'natalChartEngine',
        label: 'Calculate Natal Chart B',
        input: { type: 'context', path: 'inputs.personB' },
        outputKey: 'natalB'
      },
      {
        id: 'synastry',
        module: 'synastryEngine',
        label: 'Calculate Synastry',
        input: {
          type: 'function',
          resolver: (ctx) => ({
            chartA: ctx.outputs.natalA,
            chartB: ctx.outputs.natalB
          })
        },
        outputKey: 'synastry'
      },
      {
        id: 'composite',
        module: 'compositeChartEngine',
        label: 'Calculate Composite Chart',
        input: {
          type: 'function',
          resolver: (ctx) => ({
            chartA: ctx.outputs.natalA,
            chartB: ctx.outputs.natalB
          })
        },
        outputKey: 'composite'
      },
      {
        id: 'timing',
        module: 'compositeTimingEngine',
        label: 'Calculate Composite Timing',
        input: { type: 'context', path: 'outputs.composite' },
        outputKey: 'timing'
      },
      {
        id: 'lifecycle',
        module: 'lifecycleEngine',
        label: 'Determine Lifecycle Phase',
        input: {
          type: 'function',
          resolver: (ctx) => ({
            composite: ctx.outputs.composite,
            timing: ctx.outputs.timing
          })
        },
        outputKey: 'lifecycle'
      },
      {
        id: 'story',
        module: 'predictiveStoryEngine',
        label: 'Generate Predictive Story',
        input: {
          type: 'function',
          resolver: (ctx) => ({
            composite: ctx.outputs.composite,
            lifecycle: ctx.outputs.lifecycle,
            timing: ctx.outputs.timing
          })
        },
        outputKey: 'story'
      },
      {
        id: 'environment',
        module: 'environmentalEngine',
        label: 'Get Environmental Context',
        input: { type: 'context', path: 'inputs.date' },
        outputKey: 'environment'
      },
      {
        id: 'ritual',
        module: 'ritualTimingEngine',
        label: 'Calculate Ritual Windows',
        input: {
          type: 'function',
          resolver: (ctx) => ({
            date: ctx.inputs.date,
            composite: ctx.outputs.composite
          })
        },
        outputKey: 'ritual'
      },
      {
        id: 'action',
        module: 'fateToActionEngine',
        label: 'Generate Action Guidance',
        input: {
          type: 'function',
          resolver: (ctx) => ({
            story: ctx.outputs.story,
            environment: ctx.outputs.environment,
            lifecycle: ctx.outputs.lifecycle
          })
        },
        outputKey: 'action'
      }
    ],
    outputKeys: ['synastry', 'composite', 'story', 'ritual', 'action'],
    metadata: {
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      tags: ['relationship', 'forecast', 'complete']
    }
  };
}

/**
 * Create personal story pipeline
 */
function createPersonalStoryPipeline(): OrchestrationPipeline {
  return {
    id: 'personalStory',
    label: 'Personal Story Pipeline',
    labelChinese: '个人故事编排',
    mode: 'linear',
    steps: [
      {
        id: 'natal',
        module: 'natalChartEngine',
        label: 'Calculate Natal Chart',
        input: { type: 'context', path: 'inputs.person' },
        outputKey: 'natal'
      },
      {
        id: 'dayun',
        module: 'daYunEngine',
        label: 'Calculate Da Yun',
        input: { type: 'context', path: 'outputs.natal' },
        outputKey: 'dayun'
      },
      {
        id: 'lifecycle',
        module: 'lifecycleEngine',
        label: 'Determine Lifecycle',
        input: {
          type: 'function',
          resolver: (ctx) => ({
            natal: ctx.outputs.natal,
            dayun: ctx.outputs.dayun
          })
        },
        outputKey: 'lifecycle'
      },
      {
        id: 'story',
        module: 'predictiveStoryEngine',
        label: 'Generate Story',
        input: {
          type: 'function',
          resolver: (ctx) => ({
            natal: ctx.outputs.natal,
            lifecycle: ctx.outputs.lifecycle,
            dayun: ctx.outputs.dayun
          })
        },
        outputKey: 'story'
      }
    ],
    outputKeys: ['natal', 'lifecycle', 'story'],
    metadata: {
      version: '1.0.0',
      createdAt: new Date().toISOString()
    }
  };
}

/**
 * Create ritual calendar pipeline
 */
function createRitualCalendarPipeline(): OrchestrationPipeline {
  return {
    id: 'ritualCalendar',
    label: 'Ritual Calendar Pipeline',
    labelChinese: '仪式日历编排',
    mode: 'linear',
    steps: [
      {
        id: 'natal',
        module: 'natalChartEngine',
        label: 'Calculate Natal Chart',
        input: { type: 'context', path: 'inputs.person' },
        outputKey: 'natal'
      },
      {
        id: 'environment',
        module: 'environmentalEngine',
        label: 'Get Environmental Data',
        input: {
          type: 'function',
          resolver: (ctx) => ({
            month: ctx.inputs.month,
            year: ctx.inputs.year
          })
        },
        outputKey: 'environment'
      },
      {
        id: 'ritual',
        module: 'ritualTimingEngine',
        label: 'Generate Ritual Calendar',
        input: {
          type: 'function',
          resolver: (ctx) => ({
            natal: ctx.outputs.natal,
            environment: ctx.outputs.environment,
            month: ctx.inputs.month,
            year: ctx.inputs.year
          })
        },
        outputKey: 'ritual'
      }
    ],
    outputKeys: ['ritual'],
    metadata: {
      version: '1.0.0',
      createdAt: new Date().toISOString()
    }
  };
}

/**
 * Create daily guidance pipeline
 */
function createDailyGuidancePipeline(): OrchestrationPipeline {
  return {
    id: 'dailyGuidance',
    label: 'Daily Guidance Pipeline',
    labelChinese: '每日指南编排',
    mode: 'parallel',
    steps: [
      {
        id: 'microTiming',
        module: 'microTimingEngine',
        label: 'Get Micro Timing',
        input: { type: 'context', path: 'inputs.date' },
        outputKey: 'microTiming'
      },
      {
        id: 'environment',
        module: 'environmentalEngine',
        label: 'Get Environment',
        input: { type: 'context', path: 'inputs.date' },
        outputKey: 'environment'
      },
      {
        id: 'action',
        module: 'fateToActionEngine',
        label: 'Generate Actions',
        input: {
          type: 'function',
          resolver: (ctx) => ({
            date: ctx.inputs.date,
            microTiming: ctx.outputs.microTiming,
            environment: ctx.outputs.environment
          })
        },
        outputKey: 'action'
      }
    ],
    parallelGroups: [
      {
        id: 'gather',
        label: 'Gather Data',
        stepIds: ['microTiming', 'environment'],
        waitForAll: true,
        failOnAny: false
      }
    ],
    outputKeys: ['microTiming', 'environment', 'action'],
    metadata: {
      version: '1.0.0',
      createdAt: new Date().toISOString()
    }
  };
}

/**
 * Create action recommendation pipeline
 */
function createActionRecommendationPipeline(): OrchestrationPipeline {
  return {
    id: 'actionRecommendation',
    label: 'Action Recommendation Pipeline',
    labelChinese: '行动建议编排',
    mode: 'conditional',
    steps: [
      {
        id: 'environment',
        module: 'environmentalEngine',
        label: 'Get Environment',
        input: { type: 'context', path: 'inputs.date' },
        outputKey: 'environment'
      },
      {
        id: 'lifecycle',
        module: 'lifecycleEngine',
        label: 'Get Lifecycle',
        input: { type: 'context', path: 'inputs.person' },
        outputKey: 'lifecycle'
      }
    ],
    branches: [
      {
        id: 'challengeBranch',
        label: 'Challenge Phase Actions',
        condition: {
          type: 'equals',
          path: 'outputs.lifecycle.phase',
          value: 'Challenge'
        },
        steps: [
          {
            id: 'healingAction',
            module: 'fateToActionEngine',
            label: 'Generate Healing Actions',
            input: {
              type: 'function',
              resolver: (ctx) => ({
                mode: 'heal',
                lifecycle: ctx.outputs.lifecycle,
                environment: ctx.outputs.environment
              })
            },
            outputKey: 'action'
          }
        ]
      },
      {
        id: 'defaultBranch',
        label: 'Default Actions',
        condition: { type: 'always' },
        isDefault: true,
        steps: [
          {
            id: 'standardAction',
            module: 'fateToActionEngine',
            label: 'Generate Standard Actions',
            input: {
              type: 'function',
              resolver: (ctx) => ({
                lifecycle: ctx.outputs.lifecycle,
                environment: ctx.outputs.environment
              })
            },
            outputKey: 'action'
          }
        ]
      }
    ],
    outputKeys: ['action'],
    metadata: {
      version: '1.0.0',
      createdAt: new Date().toISOString()
    }
  };
}

/**
 * Get all available pipeline templates
 */
export function getAllPipelineTemplates(): Array<{
  id: PipelineTemplateId;
  label: string;
  labelChinese: string;
  mode: OrchestrationMode;
  modules: ModuleId[];
}> {
  return Object.entries(PIPELINE_TEMPLATE_DESCRIPTIONS).map(([id, desc]) => ({
    id: id as PipelineTemplateId,
    label: desc.en,
    labelChinese: desc.zh,
    mode: desc.mode,
    modules: desc.modules
  }));
}

// ============================================================================
// VISUALIZATION DATA GENERATORS
// ============================================================================

/**
 * Generate visualization data for a pipeline
 */
export function generatePipelineVisualization(
  pipeline: OrchestrationPipeline,
  executionState?: {
    status: 'running' | 'completed' | 'failed';
    currentStepId?: string;
    completedStepIds: string[];
    failedStepIds: string[];
    progress: number;
  }
): PipelineVisualizationData {
  const nodes: PipelineNode[] = [];
  const edges: PipelineEdge[] = [];

  // Add input node
  nodes.push({
    id: '_input',
    label: 'Input',
    labelChinese: '输入',
    module: 'validationEngine',
    moduleChinese: '验证引擎',
    type: 'input',
    position: { x: 0, y: 0 },
    isConditional: false
  });

  // Layout parameters
  const stepSpacing = 200;
  const laneSpacing = 150;

  // Generate nodes for each step
  pipeline.steps.forEach((step, index) => {
    const x = (index + 1) * stepSpacing;
    const y = 0; // Will be adjusted for parallel lanes

    const status = executionState
      ? executionState.completedStepIds.includes(step.id)
        ? 'completed'
        : executionState.failedStepIds.includes(step.id)
          ? 'failed'
          : executionState.currentStepId === step.id
            ? 'running'
            : 'pending'
      : undefined;

    nodes.push({
      id: step.id,
      label: step.label,
      labelChinese: step.labelChinese,
      module: step.module,
      moduleChinese: MODULE_CHINESE[step.module],
      type: 'step',
      position: { x, y },
      status,
      isConditional: !!step.condition
    });
  });

  // Add output node
  nodes.push({
    id: '_output',
    label: 'Output',
    labelChinese: '输出',
    module: 'aggregationEngine',
    moduleChinese: '聚合引擎',
    type: 'output',
    position: { x: (pipeline.steps.length + 1) * stepSpacing, y: 0 },
    isConditional: false
  });

  // Generate edges
  // From input to first step
  if (pipeline.steps.length > 0) {
    edges.push({
      id: 'e_input_0',
      from: '_input',
      to: pipeline.steps[0].id,
      isConditional: false
    });
  }

  // Between steps
  for (let i = 0; i < pipeline.steps.length - 1; i++) {
    edges.push({
      id: `e_${i}_${i + 1}`,
      from: pipeline.steps[i].id,
      to: pipeline.steps[i + 1].id,
      dataKey: pipeline.steps[i].outputKey,
      isConditional: !!pipeline.steps[i + 1].condition
    });
  }

  // From last step to output
  if (pipeline.steps.length > 0) {
    edges.push({
      id: 'e_last_output',
      from: pipeline.steps[pipeline.steps.length - 1].id,
      to: '_output',
      isConditional: false
    });
  }

  return {
    pipelineId: pipeline.id,
    pipelineLabel: pipeline.label,
    mode: pipeline.mode,
    nodes,
    edges,
    execution: executionState ? {
      status: executionState.status,
      currentNodeId: executionState.currentStepId,
      completedNodeIds: executionState.completedStepIds,
      failedNodeIds: executionState.failedStepIds,
      progress: executionState.progress
    } : undefined
  };
}

/**
 * Generate execution timeline data
 */
export function generateExecutionTimeline(
  result: OrchestrationResult
): ExecutionTimelineData {
  const pipelineStart = new Date(result.startedAt).getTime();

  const entries = result.stepsExecuted.map(step => ({
    stepId: step.stepId,
    stepLabel: step.stepId, // Could be enhanced with step lookup
    module: step.module,
    startTime: new Date(step.startedAt).getTime() - pipelineStart,
    endTime: step.completedAt
      ? new Date(step.completedAt).getTime() - pipelineStart
      : undefined,
    status: step.status === 'completed' ? 'completed' as const
      : step.status === 'failed' ? 'failed' as const
        : step.status === 'skipped' ? 'skipped' as const
          : 'running' as const,
    durationMs: step.durationMs
  }));

  return {
    pipelineId: result.pipelineId,
    startedAt: result.startedAt,
    completedAt: result.completedAt,
    entries,
    progress: result.success ? 100 : Math.round(
      (result.summary.completedSteps / result.summary.totalSteps) * 100
    )
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  ORCHESTRATION_MODE_CHINESE,
  ORCHESTRATION_MODE_DESCRIPTIONS,
  MODULE_CHINESE,
  PIPELINE_TEMPLATE_CHINESE,
  PIPELINE_TEMPLATE_DESCRIPTIONS
} from './orchestrationTypes';

