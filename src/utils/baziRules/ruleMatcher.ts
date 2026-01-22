/**
 * ============================================
 * RULE MATCHER
 * Generic condition matching for BaZi rule evaluation
 * ============================================
 */

import { ChartContext, RuleCondition, BaseRule, RuleMatch } from './types';

/**
 * Check if a single condition matches the chart context
 */
function matchSingleCondition(
  conditionKey: string,
  conditionValue: any,
  ctx: ChartContext
): boolean {
  // Handle nested object conditions
  if (typeof conditionValue === 'object' && conditionValue !== null) {
    // Range check: { min: X, max: Y }
    if ('min' in conditionValue || 'max' in conditionValue) {
      const contextValue = getNestedValue(ctx, conditionKey);
      if (typeof contextValue !== 'number') return false;

      if ('min' in conditionValue && contextValue < conditionValue.min) return false;
      if ('max' in conditionValue && contextValue > conditionValue.max) return false;
      return true;
    }

    // Range array check: { range: [min, max] }
    if ('range' in conditionValue && Array.isArray(conditionValue.range)) {
      const contextValue = getNestedValue(ctx, conditionKey);
      if (typeof contextValue !== 'number') return false;
      return contextValue >= conditionValue.range[0] && contextValue <= conditionValue.range[1];
    }

    // Nested object - recursively check all properties
    const contextObj = getNestedValue(ctx, conditionKey);
    if (typeof contextObj !== 'object' || contextObj === null) return false;

    return Object.entries(conditionValue).every(([nestedKey, nestedVal]) =>
      matchSingleCondition(nestedKey, nestedVal, contextObj as any)
    );
  }

  // Array condition - check if context contains any/all of the values
  if (Array.isArray(conditionValue)) {
    const contextValue = getNestedValue(ctx, conditionKey);

    // If context is also an array, check for intersection
    if (Array.isArray(contextValue)) {
      return conditionValue.some(cv => contextValue.includes(cv));
    }

    // If context is a single value, check if it's in the condition array
    return conditionValue.includes(contextValue);
  }

  // Boolean conditions
  if (typeof conditionValue === 'boolean') {
    const contextValue = getNestedValue(ctx, conditionKey);
    return contextValue === conditionValue;
  }

  // String equality
  if (typeof conditionValue === 'string') {
    const contextValue = getNestedValue(ctx, conditionKey);

    // Handle "any" as wildcard
    if (conditionValue === 'any') return contextValue !== undefined && contextValue !== null;

    return contextValue === conditionValue;
  }

  // Number equality
  if (typeof conditionValue === 'number') {
    const contextValue = getNestedValue(ctx, conditionKey);
    return contextValue === conditionValue;
  }

  return false;
}

/**
 * Get nested value from object using dot notation
 * e.g., "dayMaster.strength" -> ctx.dayMaster.strength
 */
function getNestedValue(obj: any, path: string): any {
  // Handle direct property access first
  if (path in obj) {
    return obj[path];
  }

  // Handle dot notation
  const parts = path.split('.');
  let current = obj;

  for (const part of parts) {
    if (current === undefined || current === null) return undefined;
    current = current[part];
  }

  return current;
}

/**
 * Match all conditions in a rule against the chart context
 */
export function matchConditions(
  conditions: RuleCondition,
  ctx: ChartContext
): { matched: boolean; matchedConditions: string[] } {
  const matchedConditions: string[] = [];
  let allMatched = true;

  for (const [key, value] of Object.entries(conditions)) {
    // Skip metadata/example fields
    if (key === 'examples' || key === 'description') continue;

    const matched = matchSingleCondition(key, value, ctx);

    if (matched) {
      matchedConditions.push(key);
    } else {
      allMatched = false;
    }
  }

  return { matched: allMatched, matchedConditions };
}

/**
 * Evaluate a set of rules against the chart context
 * Returns all matching rules sorted by priority (higher = more specific)
 */
export function evaluateRules<T extends BaseRule>(
  rules: T[],
  ctx: ChartContext
): RuleMatch<T>[] {
  const matches: RuleMatch<T>[] = [];

  for (const rule of rules) {
    const { matched, matchedConditions } = matchConditions(rule.conditions, ctx);

    matches.push({
      rule,
      matched,
      matchedConditions,
      result: rule.result as T['result']
    });
  }

  // Sort by priority (higher priority = more important/specific)
  return matches
    .filter(m => m.matched)
    .sort((a, b) => a.rule.priority - b.rule.priority);
}

/**
 * Get the highest priority matching rule
 */
export function getBestMatch<T extends BaseRule>(
  rules: T[],
  ctx: ChartContext
): RuleMatch<T> | null {
  const matches = evaluateRules(rules, ctx);
  return matches.length > 0 ? matches[0] : null;
}

/**
 * Check if any rule matches
 */
export function hasAnyMatch<T extends BaseRule>(
  rules: T[],
  ctx: ChartContext
): boolean {
  return rules.some(rule => {
    const { matched } = matchConditions(rule.conditions, ctx);
    return matched;
  });
}

/**
 * Get all rules that match a specific condition key
 */
export function getRulesWithCondition<T extends BaseRule>(
  rules: T[],
  conditionKey: string
): T[] {
  return rules.filter(rule => conditionKey in rule.conditions);
}
