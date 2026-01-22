/**
 * ============================================
 * RITUAL TIMING ENGINE
 * Determines when ancestral rituals should activate
 *
 * Based on:
 * - Luck Pillars (大运)
 * - Annual cycles (流年)
 * - Seasonal phases
 * - Generational threads
 * - Pilgrim position
 * - Rule activations
 *
 * The pilgrim receives a ritual calendar
 * tied to their life's timing.
 * ============================================
 */

import { PilgrimPosition } from './journeyWithGenerations';
import { AncestralRitual, RitualType } from './ancestralRitual';

// ==================== DATA MODEL ====================

export interface RitualTimingWindow {
  id: string;
  theme: string;
  type: RitualType;
  startAge: number;
  endAge: number;
  triggers: RitualTrigger[];
  urgency: 'critical' | 'recommended' | 'optional';
  seasonalBonus?: string;        // Season that amplifies this ritual
  description: string;
  descriptionZh?: string;
}

export interface RitualTrigger {
  source: 'luck_pillar' | 'annual' | 'clash' | 'harm' | 'punishment' | 'useful_god' | 'seasonal' | 'generational';
  ruleId?: string;
  description: string;
  descriptionZh?: string;
}

export interface RitualCalendar {
  pilgrimName?: string;
  currentAge: number;
  windows: RitualTimingWindow[];
  upcomingWindows: RitualTimingWindow[];
  activeWindows: RitualTimingWindow[];
  pastWindows: RitualTimingWindow[];
  nextCriticalWindow?: RitualTimingWindow;
  summary: RitualCalendarSummary;
}

export interface RitualCalendarSummary {
  totalWindows: number;
  criticalCount: number;
  recommendedCount: number;
  optionalCount: number;
  yearsUntilNextCritical?: number;
  dominantThemes: string[];
  calendarNarrative: string;
  calendarNarrativeZh?: string;
}

// ==================== TIMING INPUT TYPES ====================

export interface BaZiTimingInput {
  luckPillars?: LuckPillarInput[];
  annualPillars?: AnnualPillarInput[];
  clashes?: InteractionInput[];
  harms?: InteractionInput[];
  punishments?: InteractionInput[];
  usefulGodPeaks?: UsefulGodPeakInput[];
}

export interface LuckPillarInput {
  pillarId: string;
  startAge: number;
  endAge: number;
  heavenlyStem: string;
  earthlyBranch: string;
  element?: string;
  favorability?: 'favorable' | 'neutral' | 'unfavorable';
}

export interface AnnualPillarInput {
  year: number;
  age: number;
  heavenlyStem: string;
  earthlyBranch: string;
  element?: string;
}

export interface InteractionInput {
  type: 'clash' | 'harm' | 'punishment';
  age: number;
  ruleId: string;
  description?: string;
}

export interface UsefulGodPeakInput {
  age: number;
  ruleId: string;
  strength: number;        // 0-1
  element: string;
}

// ==================== TIMING ENGINE ====================

/**
 * Compute ritual timing windows based on BaZi analysis and pilgrim position
 */
export function computeRitualTiming(
  position: PilgrimPosition,
  baziTiming: BaZiTimingInput,
  currentAge: number
): RitualCalendar {
  const windows: RitualTimingWindow[] = [];
  let windowId = 0;

  // 1. Release rituals → activate during clashes, harms, punishments
  if (baziTiming.clashes) {
    baziTiming.clashes.forEach(clash => {
      position.brokenPatterns.forEach(theme => {
        windows.push({
          id: `release-${windowId++}`,
          theme,
          type: 'release',
          startAge: clash.age,
          endAge: clash.age + 1,
          triggers: [{
            source: 'clash',
            ruleId: clash.ruleId,
            description: `Clash activates release opportunity for ${theme}`,
            descriptionZh: `冲突激活了释放「${theme}」的机会`
          }],
          urgency: 'critical',
          description: `The clash at age ${clash.age} creates a powerful opening to release the ancestral pattern of ${theme}.`,
          descriptionZh: `${clash.age}岁的冲突创造了一个强大的开口，用于释放「${theme}」的祖传模式。`
        });
      });
    });
  }

  if (baziTiming.harms) {
    baziTiming.harms.forEach(harm => {
      position.brokenPatterns.forEach(theme => {
        windows.push({
          id: `release-${windowId++}`,
          theme,
          type: 'release',
          startAge: harm.age,
          endAge: harm.age + 1,
          triggers: [{
            source: 'harm',
            ruleId: harm.ruleId,
            description: `Harm interaction creates release opportunity for ${theme}`,
            descriptionZh: `害的互动创造了释放「${theme}」的机会`
          }],
          urgency: 'recommended',
          description: `The harm at age ${harm.age} offers a window to release ${theme}.`,
          descriptionZh: `${harm.age}岁的害提供了释放「${theme}」的窗口。`
        });
      });
    });
  }

  if (baziTiming.punishments) {
    baziTiming.punishments.forEach(punishment => {
      position.brokenPatterns.forEach(theme => {
        windows.push({
          id: `release-${windowId++}`,
          theme,
          type: 'release',
          startAge: punishment.age,
          endAge: punishment.age + 2,
          triggers: [{
            source: 'punishment',
            ruleId: punishment.ruleId,
            description: `Punishment activates deep release for ${theme}`,
            descriptionZh: `刑激活了「${theme}」的深层释放`
          }],
          urgency: 'critical',
          seasonalBonus: 'autumn',
          description: `The punishment at age ${punishment.age} demands ancestral reckoning with ${theme}.`,
          descriptionZh: `${punishment.age}岁的刑要求与「${theme}」进行祖系清算。`
        });
      });
    });
  }

  // 2. Integration rituals → activate during Useful God peaks
  if (baziTiming.usefulGodPeaks) {
    baziTiming.usefulGodPeaks.forEach(peak => {
      position.inheritedThemes.forEach(theme => {
        const urgency = peak.strength >= 0.7 ? 'recommended' : 'optional';
        windows.push({
          id: `integration-${windowId++}`,
          theme,
          type: 'integration',
          startAge: peak.age,
          endAge: peak.age + 2,
          triggers: [{
            source: 'useful_god',
            ruleId: peak.ruleId,
            description: `Useful God peak amplifies integration of ${theme}`,
            descriptionZh: `用神高峰期放大了「${theme}」的整合`
          }],
          urgency,
          seasonalBonus: getSeasonForElement(peak.element),
          description: `The Useful God peak at age ${peak.age} creates ideal conditions to integrate the inherited gift of ${theme}.`,
          descriptionZh: `${peak.age}岁的用神高峰为整合继承的「${theme}」创造了理想条件。`
        });
      });
    });
  }

  // 3. Blessing rituals → activate during luck pillar transitions with new patterns
  if (baziTiming.luckPillars) {
    baziTiming.luckPillars.forEach(lp => {
      position.newPatterns.forEach(theme => {
        windows.push({
          id: `blessing-${windowId++}`,
          theme,
          type: 'blessing',
          startAge: lp.startAge,
          endAge: lp.startAge + 3,
          triggers: [{
            source: 'luck_pillar',
            ruleId: lp.pillarId,
            description: `New luck pillar supports blessing of ${theme}`,
            descriptionZh: `新大运支持祝福「${theme}」`
          }],
          urgency: lp.favorability === 'favorable' ? 'recommended' : 'optional',
          seasonalBonus: 'spring',
          description: `The luck pillar beginning at age ${lp.startAge} opens a window to plant seeds of ${theme} for future generations.`,
          descriptionZh: `从${lp.startAge}岁开始的大运为未来世代播下「${theme}」的种子打开了窗口。`
        });
      });
    });
  }

  // 4. Add seasonal ritual windows
  addSeasonalWindows(windows, position, currentAge, windowId);

  // Sort by age
  windows.sort((a, b) => a.startAge - b.startAge);

  // Categorize windows
  const activeWindows = windows.filter(w => currentAge >= w.startAge && currentAge <= w.endAge);
  const upcomingWindows = windows.filter(w => w.startAge > currentAge);
  const pastWindows = windows.filter(w => w.endAge < currentAge);

  // Find next critical window
  const nextCriticalWindow = upcomingWindows.find(w => w.urgency === 'critical');

  // Generate summary
  const summary = generateCalendarSummary(windows, currentAge, nextCriticalWindow);

  return {
    pilgrimName: undefined,
    currentAge,
    windows,
    activeWindows,
    upcomingWindows,
    pastWindows,
    nextCriticalWindow,
    summary
  };
}

/**
 * Add seasonal ritual windows
 */
function addSeasonalWindows(
  windows: RitualTimingWindow[],
  position: PilgrimPosition,
  currentAge: number,
  startId: number
): void {
  let windowId = startId;

  // Every 5 years, add an acknowledgment ritual window
  for (let age = Math.ceil(currentAge / 5) * 5; age <= currentAge + 30; age += 5) {
    if (position.inheritedThemes.length > 0) {
      windows.push({
        id: `acknowledgment-${windowId++}`,
        theme: position.inheritedThemes[0],
        type: 'acknowledgment',
        startAge: age,
        endAge: age + 1,
        triggers: [{
          source: 'seasonal',
          description: 'Five-year ancestral acknowledgment cycle',
          descriptionZh: '五年祖系感恩周期'
        }],
        urgency: 'optional',
        seasonalBonus: 'autumn',
        description: `At age ${age}, pause to honor the ancestors who carried ${position.inheritedThemes[0]} to you.`,
        descriptionZh: `在${age}岁时，停下来尊崇那些将「${position.inheritedThemes[0]}」带给你的祖先。`
      });
    }
  }
}

/**
 * Generate calendar summary
 */
function generateCalendarSummary(
  windows: RitualTimingWindow[],
  currentAge: number,
  nextCritical?: RitualTimingWindow
): RitualCalendarSummary {
  const criticalCount = windows.filter(w => w.urgency === 'critical').length;
  const recommendedCount = windows.filter(w => w.urgency === 'recommended').length;
  const optionalCount = windows.filter(w => w.urgency === 'optional').length;

  // Get dominant themes
  const themeCounts = new Map<string, number>();
  windows.forEach(w => {
    themeCounts.set(w.theme, (themeCounts.get(w.theme) || 0) + 1);
  });
  const dominantThemes = Array.from(themeCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(e => e[0]);

  // Years until next critical
  const yearsUntilNextCritical = nextCritical
    ? nextCritical.startAge - currentAge
    : undefined;

  // Narrative
  let calendarNarrative: string;
  let calendarNarrativeZh: string;

  if (criticalCount > 0 && yearsUntilNextCritical !== undefined) {
    calendarNarrative = `Your ritual calendar holds ${windows.length} windows, with ${criticalCount} critical moments ahead. The next critical window arrives in ${yearsUntilNextCritical} years, centered on ${nextCritical?.theme || 'ancestral healing'}.`;
    calendarNarrativeZh = `你的仪式日历包含${windows.length}个窗口，其中有${criticalCount}个关键时刻在前方。下一个关键窗口将在${yearsUntilNextCritical}年后到来，聚焦于「${nextCritical?.theme || '祖系疗愈'}」。`;
  } else {
    calendarNarrative = `Your ritual calendar flows gently with ${windows.length} windows for integration and blessing. The dominant themes are: ${dominantThemes.join(', ')}.`;
    calendarNarrativeZh = `你的仪式日历平缓流淌，包含${windows.length}个用于整合与祝福的窗口。主要主题是：${dominantThemes.join('、')}。`;
  }

  return {
    totalWindows: windows.length,
    criticalCount,
    recommendedCount,
    optionalCount,
    yearsUntilNextCritical,
    dominantThemes,
    calendarNarrative,
    calendarNarrativeZh
  };
}

// ==================== HELPER FUNCTIONS ====================

function getSeasonForElement(element?: string): string | undefined {
  if (!element) return undefined;
  const elementLower = element.toLowerCase();
  if (elementLower === 'wood' || elementLower === '木') return 'spring';
  if (elementLower === 'fire' || elementLower === '火') return 'summer';
  if (elementLower === 'earth' || elementLower === '土') return 'late-summer';
  if (elementLower === 'metal' || elementLower === '金') return 'autumn';
  if (elementLower === 'water' || elementLower === '水') return 'winter';
  return undefined;
}

/**
 * Get active windows for current age
 */
export function getActiveWindows(calendar: RitualCalendar): RitualTimingWindow[] {
  return calendar.activeWindows;
}

/**
 * Get windows by urgency
 */
export function getWindowsByUrgency(
  calendar: RitualCalendar,
  urgency: 'critical' | 'recommended' | 'optional'
): RitualTimingWindow[] {
  return calendar.windows.filter(w => w.urgency === urgency);
}

/**
 * Get windows by type
 */
export function getWindowsByType(
  calendar: RitualCalendar,
  type: RitualType
): RitualTimingWindow[] {
  return calendar.windows.filter(w => w.type === type);
}

/**
 * Get windows in age range
 */
export function getWindowsInRange(
  calendar: RitualCalendar,
  startAge: number,
  endAge: number
): RitualTimingWindow[] {
  return calendar.windows.filter(w =>
    (w.startAge >= startAge && w.startAge <= endAge) ||
    (w.endAge >= startAge && w.endAge <= endAge)
  );
}

/**
 * Check if any critical ritual is active now
 */
export function hasCriticalRitualNow(calendar: RitualCalendar): boolean {
  return calendar.activeWindows.some(w => w.urgency === 'critical');
}

/**
 * Get ritual recommendation for current moment
 */
export function getCurrentRitualRecommendation(calendar: RitualCalendar): string {
  if (calendar.activeWindows.length === 0) {
    return 'No ritual windows are currently active. Rest in the space between transformations.';
  }

  const critical = calendar.activeWindows.filter(w => w.urgency === 'critical');
  if (critical.length > 0) {
    return `Critical ritual moment: ${critical.map(w => w.theme).join(', ')}. These patterns call for immediate ancestral work.`;
  }

  const recommended = calendar.activeWindows.filter(w => w.urgency === 'recommended');
  if (recommended.length > 0) {
    return `Recommended rituals: ${recommended.map(w => w.theme).join(', ')}. The timing supports this ancestral work.`;
  }

  return `Optional rituals available: ${calendar.activeWindows.map(w => w.theme).join(', ')}. The door is open if you choose to walk through.`;
}

// ==================== EXPORTS ====================

export {
  computeRitualTiming,
  getActiveWindows,
  getWindowsByUrgency,
  getWindowsByType,
  getWindowsInRange,
  hasCriticalRitualNow,
  getCurrentRitualRecommendation
};
