/**
 * usePulseResonance — click interaction → pulse surge
 *
 * When user clicks a pillar, returns a resonance value (0→1→0)
 * that decays over 600ms. Used to amplify the Destiny Pulse momentarily.
 */

import { useEffect, useState } from 'react';

export function usePulseResonance(selectedPillar: string | null): number {
  const [resonance, setResonance] = useState(0);

  useEffect(() => {
    if (!selectedPillar) {
      setResonance(0);
      return;
    }

    setResonance(1);
    const timeout = setTimeout(() => setResonance(0), 600);

    return () => clearTimeout(timeout);
  }, [selectedPillar]);

  return resonance;
}
