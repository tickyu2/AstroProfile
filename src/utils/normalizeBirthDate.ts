/**
 * Normalize Birth Date Utility
 *
 * Profiles may contain either Date objects or ISO strings.
 * This utility normalizes to a consistent Date | null.
 *
 * GENESIS AstroProfile - January 2026
 */

export function normalizeBirthDate(
  value: Date | string | null | undefined
): Date | null {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}
