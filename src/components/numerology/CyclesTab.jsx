/**
 * CYCLES TAB - ENHANCED
 *
 * Life timing with Cathedral-grade precision:
 * - Birthday-to-birthday Personal Year (not calendar year!)
 * - Visual timeline showing Begin/End dates
 * - Progress bar and time remaining
 * - Clickable 9-year progression (Khan Academy style)
 * - Transparent calculation panels
 * - Life Stages (Pinnacles and Challenges)
 *
 * "Your 9-year cycle is based on YOUR birthday, not the calendar year.
 *  Because YOU are constitutional, not arbitrary."
 */

import React, { useState, useMemo } from 'react';
import { personalYearGuidance, lifePathInterpretations } from '../../data/numerologyInterpretations';
import {
  calculateCurrentPersonalYear,
  calculate9YearCycle,
  formatCycleDate,
  formatCycleDateShort,
  getCyclePosition
} from '../../utils/numerologyCalculations';
import { PersonalYearCalculationPanel } from '../shared/CalculationPanel';
import { getPersonalYearActions, getMonthlyCheckin } from '../../data/actionableSuggestions';

function CyclesTab({ numerologyData, profile, currentTiming, lifeStages }) {
  const [expandedYear, setExpandedYear] = useState(null);
  const [showCalculation, setShowCalculation] = useState(false);
  const [activeActionCategory, setActiveActionCategory] = useState('career');

  if (!numerologyData || !profile?.birthDate) return null;

  const { lifePath } = numerologyData;

  // Parse birth date
  const birthDate = useMemo(() => {
    if (profile.birthDate instanceof Date) return profile.birthDate;
    return new Date(profile.birthDate);
  }, [profile.birthDate]);

  const birthMonth = birthDate.getMonth() + 1;
  const birthDay = birthDate.getDate();

  // Get ACCURATE birthday-to-birthday Personal Year info
  const currentPYInfo = useMemo(() => {
    return calculateCurrentPersonalYear(birthMonth, birthDay);
  }, [birthMonth, birthDay]);

  // Get full 9-year cycle centered on current year
  const nineYearCycle = useMemo(() => {
    return calculate9YearCycle(birthMonth, birthDay, currentPYInfo.yearToUse);
  }, [birthMonth, birthDay, currentPYInfo.yearToUse]);

  // Get interpretations
  const yearInfo = personalYearGuidance[currentPYInfo.personalYear] || {};
  const nextYearInfo = personalYearGuidance[currentPYInfo.nextPersonalYear] || {};
  const cyclePosition = getCyclePosition(currentPYInfo.personalYear);

  // Get actionable suggestions for current year
  const currentYearActions = getPersonalYearActions(currentPYInfo.personalYear);
  const monthlyCheckins = getMonthlyCheckin(currentPYInfo.personalYear);

  // Get month name helper
  const getMonthName = (month) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month - 1] || '';
  };

  return (
    <div className="space-y-8">
      {/* Birthday-to-Birthday Notice */}
      <div className="bg-amber-900/30 border border-amber-500/40 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl">⚠️</div>
          <div>
            <h3 className="text-lg font-bold text-amber-400 mb-2">
              Your Personal Year Runs Birthday-to-Birthday
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Your 9-year cycle is based on <strong>YOUR birthday</strong>, not the calendar year.
              Each Personal Year runs from <strong>{getMonthName(birthMonth)} {birthDay}</strong> to
              the day before your next birthday.
            </p>
            <p className="text-amber-300/80 text-sm mt-2">
              <strong>Why?</strong> Because YOU are constitutional, not arbitrary.
              Your cycle is unique to YOU.
            </p>
          </div>
        </div>
      </div>

      {/* Current Personal Year Card */}
      <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-2xl p-6 border border-indigo-500/30">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Your Current Personal Year</h2>

        {/* Year Display */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 bg-indigo-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-indigo-500/30">
            <span className="text-5xl font-bold text-white">{currentPYInfo.personalYear}</span>
          </div>
          <div className="text-xl font-semibold text-white">{yearInfo.theme}</div>
          <div className="text-indigo-300">{yearInfo.energy}</div>
        </div>

        {/* Cycle Timing */}
        <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">Began</div>
              <div className="text-white font-medium">{formatCycleDateShort(currentPYInfo.startDate)}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">Ends</div>
              <div className="text-white font-medium">{formatCycleDateShort(currentPYInfo.endDate)}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">Time Left</div>
              <div className="text-amber-400 font-medium">{currentPYInfo.monthsRemaining} months</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">Days Left</div>
              <div className="text-amber-400 font-medium">{currentPYInfo.daysRemaining}</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>Year Progress</span>
            <span>{currentPYInfo.progressPercent}% complete</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${currentPYInfo.progressPercent}%` }}
            />
          </div>
          <div className="text-center text-xs text-slate-500 mt-2">
            {currentPYInfo.daysPassed} of {currentPYInfo.daysPassed + currentPYInfo.daysRemaining} days
          </div>
        </div>

        {/* Year Guidance */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-4">
            <h4 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
              <span>✓</span> What To Focus On
            </h4>
            <ul className="space-y-2">
              {yearInfo.whatToDo?.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4">
            <h4 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
              <span>✗</span> What To Avoid
            </h4>
            <ul className="space-y-2">
              {yearInfo.whatToAvoid?.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Life Area Guidance */}
        <div className="grid md:grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-700/50 rounded-xl p-4">
            <h5 className="text-amber-400 font-medium mb-2 text-sm flex items-center gap-2">
              <span>💼</span> Career
            </h5>
            <p className="text-slate-300 text-sm">{yearInfo.career}</p>
          </div>
          <div className="bg-slate-700/50 rounded-xl p-4">
            <h5 className="text-pink-400 font-medium mb-2 text-sm flex items-center gap-2">
              <span>💕</span> Relationships
            </h5>
            <p className="text-slate-300 text-sm">{yearInfo.relationships}</p>
          </div>
          <div className="bg-slate-700/50 rounded-xl p-4">
            <h5 className="text-green-400 font-medium mb-2 text-sm flex items-center gap-2">
              <span>💪</span> Health
            </h5>
            <p className="text-slate-300 text-sm">{yearInfo.health}</p>
          </div>
        </div>

        {/* Show Calculation Button */}
        <button
          onClick={() => setShowCalculation(!showCalculation)}
          className="w-full py-2 text-indigo-400 hover:text-indigo-300 text-sm transition-colors flex items-center justify-center gap-2"
        >
          <span>📐</span>
          <span>{showCalculation ? 'Hide' : 'Show'} Calculation</span>
          <span className={`transition-transform ${showCalculation ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {/* Calculation Panel */}
        {showCalculation && (
          <div className="mt-4">
            <PersonalYearCalculationPanel
              birthMonth={birthMonth}
              birthDay={birthDay}
              yearToUse={currentPYInfo.yearToUse}
              personalYear={currentPYInfo.personalYear}
              birthdayPassed={currentPYInfo.birthdayPassed}
            />
          </div>
        )}
      </div>

      {/* ACTION PLAN SECTION - "Knowing but not doing means nothing" */}
      {currentYearActions && (
        <div className="bg-slate-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <span>🎯</span>
            <span>Your Action Plan for Year {currentPYInfo.personalYear}</span>
          </h3>
          <p className="text-slate-400 text-sm mb-6">
            <em>"Knowing but not doing means nothing."</em> — Here are specific, measurable actions
            aligned with your {yearInfo.theme} year.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { key: 'career', label: 'Career', icon: '💼', color: 'amber' },
              { key: 'relationships', label: 'Relationships', icon: '💕', color: 'pink' },
              { key: 'health', label: 'Health', icon: '💪', color: 'green' },
              { key: 'personalGrowth', label: 'Personal Growth', icon: '🌱', color: 'purple' }
            ].map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveActionCategory(cat.key)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                  activeActionCategory === cat.key
                    ? `bg-${cat.color}-600 text-white ring-2 ring-${cat.color}-400`
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
                style={activeActionCategory === cat.key ? {
                  backgroundColor: cat.color === 'amber' ? '#d97706' :
                                   cat.color === 'pink' ? '#db2777' :
                                   cat.color === 'green' ? '#16a34a' : '#9333ea'
                } : {}}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Active Category Actions */}
          {currentYearActions[activeActionCategory] && (
            <div className="bg-slate-700/50 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                  activeActionCategory === 'career' ? 'bg-amber-600' :
                  activeActionCategory === 'relationships' ? 'bg-pink-600' :
                  activeActionCategory === 'health' ? 'bg-green-600' : 'bg-purple-600'
                }`}>
                  {activeActionCategory === 'career' ? '💼' :
                   activeActionCategory === 'relationships' ? '💕' :
                   activeActionCategory === 'health' ? '💪' : '🌱'}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">
                    {activeActionCategory === 'career' ? 'Career' :
                     activeActionCategory === 'relationships' ? 'Relationships' :
                     activeActionCategory === 'health' ? 'Health' : 'Personal Growth'}
                  </h4>
                  <p className="text-sm text-slate-400">
                    Focus: {currentYearActions[activeActionCategory].focus}
                  </p>
                </div>
              </div>

              {/* Action Items with Checkboxes */}
              <div className="space-y-3">
                {currentYearActions[activeActionCategory].actions.map((action, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className={`w-6 h-6 rounded border-2 flex-shrink-0 flex items-center justify-center cursor-pointer transition-all ${
                      activeActionCategory === 'career' ? 'border-amber-500 group-hover:bg-amber-500/20' :
                      activeActionCategory === 'relationships' ? 'border-pink-500 group-hover:bg-pink-500/20' :
                      activeActionCategory === 'health' ? 'border-green-500 group-hover:bg-green-500/20' :
                      'border-purple-500 group-hover:bg-purple-500/20'
                    }`}>
                      <span className="text-xs text-slate-500">{index + 1}</span>
                    </div>
                    <span className="text-slate-200">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What to Avoid */}
          {currentYearActions.avoid && (
            <div className="mt-6 bg-red-900/20 border border-red-500/30 rounded-xl p-5">
              <h4 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
                <span>⚠️</span>
                <span>What to Avoid in Year {currentPYInfo.personalYear}</span>
              </h4>
              <ul className="space-y-2">
                {currentYearActions.avoid.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-red-400 mt-0.5">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Monthly Check-In Questions */}
          {monthlyCheckins && monthlyCheckins.length > 0 && (
            <div className="mt-6 bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-5">
              <h4 className="text-indigo-400 font-semibold mb-3 flex items-center gap-2">
                <span>📝</span>
                <span>Monthly Check-In Questions</span>
              </h4>
              <p className="text-slate-400 text-sm mb-4">
                Ask yourself these questions at the end of each month to stay aligned with Year {currentPYInfo.personalYear}'s energy:
              </p>
              <div className="space-y-3">
                {monthlyCheckins.map((question, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg"
                  >
                    <span className="text-indigo-400 font-medium">{index + 1}.</span>
                    <span className="text-slate-200 italic">{question}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Next Personal Year Preview */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🔮</span>
          <span>Coming on {getMonthName(birthMonth)} {birthDay}, {currentPYInfo.yearToUse + 1}</span>
        </h3>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-purple-600/50 border-2 border-purple-400 rounded-xl flex items-center justify-center">
            <span className="text-3xl font-bold text-white">{currentPYInfo.nextPersonalYear}</span>
          </div>
          <div>
            <div className="text-lg font-semibold text-white">Personal Year {currentPYInfo.nextPersonalYear}</div>
            <div className="text-purple-300">{nextYearInfo.theme}</div>
          </div>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed">
          After {yearInfo.theme?.toLowerCase()} in Year {currentPYInfo.personalYear},
          Year {currentPYInfo.nextPersonalYear} brings <strong className="text-purple-300">{nextYearInfo.theme?.toLowerCase()}</strong>.
          {' '}{nextYearInfo.energy}. Get ready!
        </p>
      </div>

      {/* 9-Year Cycle Visualization */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <span>🔄</span>
          <span>Your 9-Year Journey</span>
        </h3>
        <p className="text-slate-400 text-sm mb-6">
          Each year runs from {getMonthName(birthMonth)} {birthDay} to the day before your next birthday.
          Click any year to explore.
        </p>

        {/* Cycle Position Indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 bg-slate-700/50 rounded-full px-4 py-2">
            <span className="text-indigo-400">{cyclePosition.position}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 text-sm">{cyclePosition.description}</span>
          </div>
        </div>

        {/* Phase Labels */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center text-xs">
          <div className={`py-2 rounded-lg ${currentPYInfo.personalYear <= 3 ? 'bg-green-900/40 text-green-400 ring-1 ring-green-500/30' : 'bg-slate-700/30 text-slate-500'}`}>
            Years 1-3: Planting & Growth
          </div>
          <div className={`py-2 rounded-lg ${currentPYInfo.personalYear >= 4 && currentPYInfo.personalYear <= 6 ? 'bg-amber-900/40 text-amber-400 ring-1 ring-amber-500/30' : 'bg-slate-700/30 text-slate-500'}`}>
            Years 4-6: Building & Blooming
          </div>
          <div className={`py-2 rounded-lg ${currentPYInfo.personalYear >= 7 ? 'bg-purple-900/40 text-purple-400 ring-1 ring-purple-500/30' : 'bg-slate-700/30 text-slate-500'}`}>
            Years 7-9: Reflection & Harvest
          </div>
        </div>

        {/* 9-Year Timeline - Clickable */}
        <div className="space-y-2">
          {nineYearCycle.map((yearData, index) => {
            const isExpanded = expandedYear === index;
            const guidance = personalYearGuidance[yearData.personalYear] || {};

            return (
              <div
                key={index}
                className={`
                  rounded-xl border transition-all cursor-pointer
                  ${yearData.isCurrent
                    ? 'bg-indigo-900/40 border-indigo-500/50 ring-2 ring-indigo-400/30'
                    : yearData.isPast
                    ? 'bg-slate-700/30 border-slate-600/30 opacity-75'
                    : 'bg-slate-700/50 border-slate-600/30'
                  }
                  ${isExpanded ? 'ring-2 ring-indigo-400' : ''}
                `}
                onClick={() => setExpandedYear(isExpanded ? null : index)}
              >
                {/* Year Header */}
                <div className="p-4 flex items-center gap-4">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold
                    ${yearData.isCurrent
                      ? 'bg-indigo-500 text-white'
                      : yearData.isPast
                      ? 'bg-slate-600 text-slate-400'
                      : 'bg-slate-600 text-slate-300'
                    }
                  `}>
                    {yearData.personalYear}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${yearData.isCurrent ? 'text-white' : 'text-slate-300'}`}>
                        {guidance.theme}
                      </span>
                      {yearData.isCurrent && (
                        <span className="px-2 py-0.5 bg-indigo-500 text-white text-xs rounded-full">
                          YOU ARE HERE
                        </span>
                      )}
                      {yearData.isPast && (
                        <span className="text-xs text-slate-500">Past</span>
                      )}
                      {yearData.isFuture && (
                        <span className="text-xs text-slate-500">Future</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {formatCycleDateShort(yearData.startDate)} → {formatCycleDateShort(yearData.endDate)}
                    </div>
                  </div>

                  <span className={`text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </div>

                {/* Expanded Details */}
                {isExpanded && (() => {
                  const yearActions = getPersonalYearActions(yearData.personalYear);
                  return (
                    <div className="px-4 pb-4 border-t border-slate-600/30 pt-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-slate-400 text-sm mb-2">Energy:</h5>
                          <p className="text-slate-300 text-sm">{guidance.energy}</p>
                        </div>

                        <div>
                          <h5 className="text-slate-400 text-sm mb-2">Best For:</h5>
                          <p className="text-slate-300 text-sm">{guidance.bestFor}</p>
                        </div>

                        {yearData.isPast && (
                          <div className="md:col-span-2 bg-slate-600/30 rounded-lg p-3">
                            <h5 className="text-amber-400 text-sm mb-2">Reflection Questions:</h5>
                            <ul className="space-y-1 text-sm text-slate-300">
                              <li>• What did I learn in this year of {guidance.theme?.toLowerCase()}?</li>
                              <li>• What foundations did I build?</li>
                              <li>• How did the {yearData.personalYear} energy shape me?</li>
                            </ul>
                          </div>
                        )}

                        {yearData.isFuture && (
                          <div className="md:col-span-2 bg-purple-900/30 rounded-lg p-3">
                            <h5 className="text-purple-400 text-sm mb-2">How to Prepare for Year {yearData.personalYear}:</h5>
                            <ul className="space-y-1 text-sm text-slate-300">
                              <li>• Set intentions aligned with "{guidance.theme}"</li>
                              <li>• Focus: {yearActions?.career?.focus || guidance.energy}</li>
                              <li>• Preview: {yearActions?.career?.actions?.[0] || 'Prepare for this energy'}</li>
                            </ul>
                          </div>
                        )}

                        <div>
                          <h5 className="text-amber-400 text-sm mb-2 flex items-center gap-1">
                            <span>💼</span> Career Focus:
                          </h5>
                          <p className="text-slate-300 text-sm mb-2">{yearActions?.career?.focus || guidance.career}</p>
                          {yearActions?.career?.actions && (
                            <ul className="space-y-1 text-xs text-slate-400">
                              {yearActions.career.actions.slice(0, 2).map((action, i) => (
                                <li key={i} className="flex items-start gap-1">
                                  <span className="text-amber-500">→</span> {action}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <div>
                          <h5 className="text-pink-400 text-sm mb-2 flex items-center gap-1">
                            <span>💕</span> Relationships Focus:
                          </h5>
                          <p className="text-slate-300 text-sm mb-2">{yearActions?.relationships?.focus || guidance.relationships}</p>
                          {yearActions?.relationships?.actions && (
                            <ul className="space-y-1 text-xs text-slate-400">
                              {yearActions.relationships.actions.slice(0, 2).map((action, i) => (
                                <li key={i} className="flex items-start gap-1">
                                  <span className="text-pink-500">→</span> {action}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>

                      {/* Key Actions Preview */}
                      {yearActions?.avoid && (
                        <div className="mt-4 p-3 bg-red-900/20 border border-red-500/20 rounded-lg">
                          <h5 className="text-red-400 text-xs mb-2">Avoid in Year {yearData.personalYear}:</h5>
                          <p className="text-slate-400 text-xs">
                            {yearActions.avoid.slice(0, 2).join(' • ')}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      </div>

      {/* Life Stages - Pinnacles & Challenges */}
      {lifeStages && (
        <div className="bg-slate-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>🏔️</span>
            <span>Life Stages (Pinnacles & Challenges)</span>
          </h3>

          <p className="text-slate-400 text-sm mb-6">
            Your life is divided into four major periods, each with a Pinnacle (opportunity/theme) and
            a Challenge (lesson to master). You are currently in your{' '}
            <span className="text-indigo-300 font-medium">{getOrdinal(lifeStages.currentPinnacle)} Pinnacle</span>,
            at age {lifeStages.currentAge}.
          </p>

          {/* Timeline Visualization */}
          <div className="relative mb-8">
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-slate-700 -translate-y-1/2"></div>
            <div className="flex justify-between relative">
              {lifeStages.stages.map((stage, index) => (
                <div
                  key={stage.stage}
                  className={`flex flex-col items-center ${stage.isCurrent ? 'z-10' : 'z-0'}`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                      stage.isCurrent
                        ? 'bg-indigo-500 text-white ring-4 ring-indigo-300/50 scale-110'
                        : index < lifeStages.currentPinnacle - 1
                        ? 'bg-slate-600 text-slate-400'
                        : 'bg-slate-700 text-slate-500'
                    }`}
                  >
                    {stage.pinnacle}
                  </div>
                  <div className="text-xs text-slate-500 mt-2 text-center">
                    {stage.ages}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stage Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {lifeStages.stages.map(stage => (
              <div
                key={stage.stage}
                className={`rounded-xl p-4 border-2 transition-all ${
                  stage.isCurrent
                    ? 'bg-indigo-900/30 border-indigo-500/50'
                    : 'bg-slate-700/30 border-slate-600/30'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className={`font-semibold ${stage.isCurrent ? 'text-indigo-300' : 'text-slate-400'}`}>
                      {stage.name}
                    </h4>
                    <p className="text-xs text-slate-500">Ages {stage.ages}</p>
                  </div>
                  {stage.isCurrent && (
                    <span className="text-xs bg-indigo-600/50 text-indigo-200 px-2 py-1 rounded-full">
                      Current
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  {/* Pinnacle */}
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      stage.isCurrent ? 'bg-green-600/50 text-green-300' : 'bg-slate-600/50 text-slate-400'
                    }`}>
                      {stage.pinnacle}
                    </div>
                    <div>
                      <div className={`text-sm font-medium ${stage.isCurrent ? 'text-green-400' : 'text-slate-400'}`}>
                        Pinnacle: {stage.theme}
                      </div>
                      <p className="text-xs text-slate-500">Opportunity & Theme</p>
                    </div>
                  </div>

                  {/* Challenge */}
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      stage.isCurrent ? 'bg-amber-600/50 text-amber-300' : 'bg-slate-600/50 text-slate-400'
                    }`}>
                      {stage.challenge}
                    </div>
                    <div>
                      <div className={`text-sm font-medium ${stage.isCurrent ? 'text-amber-400' : 'text-slate-400'}`}>
                        Challenge: {stage.challengeTheme}
                      </div>
                      <p className="text-xs text-slate-500">Lesson to Master</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Stage Deep Dive */}
      {lifeStages && (
        <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-2xl p-6 border border-indigo-500/20">
          <h3 className="text-xl font-bold text-white mb-4">Your Current Life Stage</h3>

          {lifeStages.stages.filter(s => s.isCurrent).map(stage => {
            const pinnacleInfo = lifePathInterpretations[stage.pinnacle] || {};

            return (
              <div key={stage.stage}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-green-400 font-semibold mb-2">
                      Pinnacle {stage.pinnacle}: {pinnacleInfo.title || stage.theme}
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      During this period, you are learning the lessons of the {stage.pinnacle}.
                      {pinnacleInfo.coreEssence && ` ${pinnacleInfo.coreEssence.split('.')[0]}.`}
                      This is a time for {stage.theme?.toLowerCase()}.
                    </p>
                    {pinnacleInfo.strengths && (
                      <div className="mt-3">
                        <div className="text-xs text-green-400 mb-1">Opportunities:</div>
                        <div className="flex flex-wrap gap-1">
                          {pinnacleInfo.strengths.slice(0, 3).map((s, i) => (
                            <span key={i} className="text-xs bg-green-900/30 text-green-300 px-2 py-1 rounded">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-amber-400 font-semibold mb-2">
                      Challenge {stage.challenge}: {stage.challengeTheme}
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Your growth challenge during this period is {stage.challengeTheme?.toLowerCase()}.
                      This lesson asks you to develop mastery in areas where you may feel resistance.
                      Embracing this challenge leads to profound growth.
                    </p>
                    <div className="mt-3">
                      <div className="text-xs text-amber-400 mb-1">Growth Focus:</div>
                      <span className="text-xs bg-amber-900/30 text-amber-300 px-2 py-1 rounded">
                        {stage.challengeTheme}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-slate-800/50 rounded-xl">
                  <p className="text-slate-300 text-sm">
                    <strong className="text-white">Integration:</strong> Your Pinnacle {stage.pinnacle}{' '}
                    combined with Challenge {stage.challenge} creates a unique growth opportunity.
                    Embrace the energy of {stage.theme?.toLowerCase()} while consciously working on{' '}
                    {stage.challengeTheme?.toLowerCase()}.
                    {stage.endAge && ` This stage continues until approximately age ${stage.endAge}.`}
                    {!stage.endAge && ` This is your final life stage, carrying you through your wisdom years.`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Get ordinal suffix for a number
 */
function getOrdinal(n) {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

export default CyclesTab;
