/**
 * dayOfYearToDate Utility
 *
 * Converts day-of-year (1-365/366) to a proper Date object.
 * Essential for driving the φ-curve from year breathing.
 *
 * GENESIS AstroProfile - January 2026
 */

// =============================================================================
// CORE FUNCTION
// =============================================================================

/**
 * Convert day of year to Date object
 *
 * @param year - The year (e.g., 2026)
 * @param dayOfYear - Day of year (1-365 or 1-366 for leap year)
 * @returns Date object in UTC
 *
 * Example:
 *   dayOfYearToDate(2026, 113) → April 23, 2026
 *   dayOfYearToDate(2026, 1) → January 1, 2026
 *   dayOfYearToDate(2026, 365) → December 31, 2026
 */
export function dayOfYearToDate(year: number, dayOfYear: number): Date {
  const date = new Date(Date.UTC(year, 0, 1));
  date.setUTCDate(dayOfYear);
  return date;
}

// =============================================================================
// REVERSE FUNCTION
// =============================================================================

/**
 * Get day of year from a Date object
 *
 * @param date - The date to convert
 * @returns Day of year (1-365 or 1-366)
 *
 * Example:
 *   dateToDayOfYear(new Date('2026-04-23')) → 113
 */
export function dateToDayOfYear(date: Date): number {
  const startOfYear = new Date(Date.UTC(date.getFullYear(), 0, 1));
  const diff = date.getTime() - startOfYear.getTime();
  return Math.floor(diff / (24 * 60 * 60 * 1000)) + 1;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Check if a year is a leap year
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Get the number of days in a year
 */
export function getDaysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

/**
 * Get month and day from day of year
 */
export function dayOfYearToMonthDay(
  year: number,
  dayOfYear: number
): { month: number; day: number; monthName: string } {
  const date = dayOfYearToDate(year, dayOfYear);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return {
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    monthName: monthNames[date.getUTCMonth()],
  };
}

/**
 * Format day of year as a readable string
 */
export function formatDayOfYear(
  year: number,
  dayOfYear: number,
  format: 'short' | 'long' | 'numeric' = 'long'
): string {
  const date = dayOfYearToDate(year, dayOfYear);

  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    case 'long':
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    case 'numeric':
      return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
    default:
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  }
}

/**
 * Get the zodiac season for a day of year
 */
export function getSeasonForDay(dayOfYear: number): 'Spring' | 'Summer' | 'Autumn' | 'Winter' {
  // Approximate season boundaries (Northern Hemisphere)
  if (dayOfYear >= 80 && dayOfYear < 172) return 'Spring';   // ~Mar 21 - Jun 20
  if (dayOfYear >= 172 && dayOfYear < 266) return 'Summer';  // ~Jun 21 - Sep 22
  if (dayOfYear >= 266 && dayOfYear < 356) return 'Autumn';  // ~Sep 23 - Dec 21
  return 'Winter';  // ~Dec 22 - Mar 20
}

/**
 * Get progress through the current season (0-1)
 */
export function getSeasonProgress(dayOfYear: number): number {
  const seasonBoundaries = [80, 172, 266, 356];
  let start = 356 - 365; // Winter starts at day 356, wraps around
  let end = 80;

  for (let i = 0; i < seasonBoundaries.length; i++) {
    const nextBoundary = seasonBoundaries[i];
    if (dayOfYear < nextBoundary) {
      start = i === 0 ? 356 - 365 : seasonBoundaries[i - 1];
      end = nextBoundary;
      break;
    }
    if (i === seasonBoundaries.length - 1) {
      start = seasonBoundaries[i];
      end = 365 + 80; // Winter wraps to next year
    }
  }

  // Handle winter wrap-around
  let adjustedDay = dayOfYear;
  if (dayOfYear < 80) adjustedDay += 365;
  if (start < 0) start += 365;

  return (adjustedDay - start) / (end - start);
}

/**
 * Get adjacent days (for cusp window context)
 */
export function getAdjacentDays(
  year: number,
  dayOfYear: number,
  windowSize = 6
): Date[] {
  const days: Date[] = [];
  const daysInYear = getDaysInYear(year);

  for (let i = -windowSize; i <= windowSize; i++) {
    let day = dayOfYear + i;

    // Wrap around year boundaries
    if (day < 1) day += daysInYear;
    if (day > daysInYear) day -= daysInYear;

    days.push(dayOfYearToDate(year, day));
  }

  return days;
}
