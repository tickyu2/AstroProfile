import { useEffect, useMemo, useState } from 'react';
import {
  getSunBlendFromDate,
  useYearBreathing,
  useYearWheelRotation,
  YEAR_SPEEDS,
  type YearSpeedKey,
} from '../zodiac/cusp';
import { dayOfYearToDate } from '../utils/dayOfYearToDate';

export function useWheelBreathing() {
  const [breathingEnabled, setBreathingEnabled] = useState(false);
  const [breathingSpeed, setBreathingSpeed] = useState<YearSpeedKey>('normal');

  const yearBreathing = useYearBreathing({
    autoStart: false,
    speedMs: YEAR_SPEEDS[breathingSpeed],
    loop: true,
  });

  useEffect(() => {
    if (breathingEnabled) {
      yearBreathing.play();
    } else {
      yearBreathing.pause();
    }
  }, [breathingEnabled]);

  useEffect(() => {
    yearBreathing.setSpeed(YEAR_SPEEDS[breathingSpeed]);
  }, [breathingSpeed]);

  const breathingDate = useMemo(() => {
    return dayOfYearToDate(2026, yearBreathing.dayOfYear);
  }, [yearBreathing.dayOfYear]);

  const breathingCusp = useMemo(() => {
    if (!breathingEnabled) return null;
    return getSunBlendFromDate(breathingDate);
  }, [breathingEnabled, breathingDate]);

  const wheelRotation = useYearWheelRotation(yearBreathing.dayOfYear, {
    transitionMs: YEAR_SPEEDS[breathingSpeed],
  });

  return {
    breathingEnabled,
    setBreathingEnabled,
    breathingSpeed,
    setBreathingSpeed,
    breathingDate,
    breathingCusp,
    wheelRotation,
    dayOfYear: yearBreathing.dayOfYear,
    progress: yearBreathing.progress,
  };
}
