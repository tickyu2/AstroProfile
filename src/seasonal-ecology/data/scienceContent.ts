/**
 * GENESIS - Science Note Content
 * Educational content for the Seasonal Ecological Psychology Engine
 */

import { ScienceNotesCollection } from '../types/seasonalEcology';

export const scienceNotes: ScienceNotesCollection = {
  seasons: {
    title: "Seasonal Affective Imprinting",
    content: `Birth season influences early development through light exposure, temperature,
and maternal hormones. Research shows correlations between birth season and:
- Serotonin rhythms and mood regulation
- Circadian entrainment patterns
- Dopamine development trajectories
- Immune system calibration`,
    references: [
      "Disanto et al. (2012) - Month of birth and risk of multiple sclerosis",
      "Foster & Roenneberg (2008) - Human responses to the geophysical daily, annual cycles",
      "Chotai et al. (2003) - Variations in personality among birth seasons"
    ]
  },

  modalities: {
    title: "Circadian Chronotype",
    content: `Chronotype describes your internal timing preference - when you naturally
feel most alert and energetic. The three modalities map to:
- **Cardinal (Morning)**: Front-loads energy, initiates early
- **Fixed (Intermediate)**: Steady rhythm throughout the day
- **Mutable (Evening)**: Flexible timing, often peaks later`,
    references: [
      "Roenneberg et al. (2007) - Epidemiology of the human circadian clock",
      "Adan et al. (2012) - Circadian typology: A comprehensive review"
    ]
  },

  elements: {
    title: "Temperament Theory",
    content: `The four elements correspond to classical temperament types and
modern neurochemical profiles:
- **Fire**: High dopamine sensitivity, drive-oriented
- **Earth**: Serotonin stability, grounding
- **Air**: Cognitive flexibility, analytical processing
- **Water**: Limbic sensitivity, emotional attunement`,
    references: [
      "Kagan (1994) - Galen's Prophecy: Temperament in Human Nature",
      "Cloninger (1987) - A systematic method for clinical description of personality variants"
    ]
  },

  signs: {
    title: "Constitutional Address",
    content: `Each zodiac sign represents a unique intersection of:
- **Season**: Environmental imprint (light, temperature)
- **Element**: Temperamental style (processing mode)
- **Modality**: Momentum pattern (timing preference)

This creates 12 distinct constitutional profiles - not predictions,
but descriptions of how you tend to meet the world.`,
    references: []
  },

  ecological: {
    title: "Ecological Psychology",
    content: `Ecological psychology studies how environmental conditions shape
perception, behavior, and cognition. Key principles:
- Humans are environmentally embedded, not separate from context
- Development occurs through organism-environment interaction
- Affordances in the environment shape behavioral possibilities

This framework grounds astrology in environmental science rather than mysticism.`,
    references: [
      "Gibson (1979) - The Ecological Approach to Visual Perception",
      "Bronfenbrenner (1979) - The Ecology of Human Development"
    ]
  }
};

/**
 * Get science note by tab/section
 */
export function getScienceNote(section: keyof ScienceNotesCollection) {
  return scienceNotes[section];
}

/**
 * Get all science notes as array
 */
export function getAllScienceNotes() {
  return Object.values(scienceNotes);
}
