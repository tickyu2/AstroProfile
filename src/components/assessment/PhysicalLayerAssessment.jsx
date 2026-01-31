import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PhysicalLayerAssessment.css';

/**
 * Physical Layer Assessment
 * "What's My Type Playground" - Two Column LEGO Constructor
 *
 * Revolutionary: Build YOURSELF + IDEAL TYPE simultaneously!
 * 45 physical attributes for complete physical description (high fidelity)
 *
 * Output enables:
 * - Luna impersonation of ideal type
 * - Baby Nano couple portraits with accurate height differences
 * - Constitutional cross-validation
 */
export function PhysicalLayerAssessment({ onComplete, existingResponses = {}, onProgressUpdate, profileId }) {
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState(existingResponses);
  const [selectedMe, setSelectedMe] = useState(null);
  const [selectedIdeal, setSelectedIdeal] = useState(null);

  // Height slider state
  const [heightMe, setHeightMe] = useState({ feet: 5, inches: 6 });
  const [heightIdeal, setHeightIdeal] = useState({ feet: 5, inches: 8 });

  // Custom details text area state
  const [customDetailsMe, setCustomDetailsMe] = useState('');
  const [customDetailsIdeal, setCustomDetailsIdeal] = useState('');

  // CRITICAL: Reset state when PROFILE changes (not on every response update)
  useEffect(() => {
    setResponses(existingResponses);
    setCurrentSection(0);
    setSelectedMe(null);
    setSelectedIdeal(null);
    setHeightMe({ feet: 5, inches: 6 });
    setHeightIdeal({ feet: 5, inches: 8 });
    setCustomDetailsMe('');
    setCustomDetailsIdeal('');
  }, [profileId]); // Only reset when profile ID changes, not on every save

  // 36 Physical Attribute Sections (33 physical + 3 portrait)
  const sections = [
    // IDENTITY (3) - gender, ethnicity, handedness
    {
      id: 'gender',
      title: '👤 Gender',
      question: 'Gender identity:',
      options: [
        { value: 'female', label: 'Female' },
        { value: 'male', label: 'Male' },
        { value: 'non-binary', label: 'Non-binary' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      id: 'ethnicity',
      title: '🌍 Ethnicity',
      question: 'Ethnic background:',
      options: [
        { value: 'east-asian', label: 'East Asian (Korean, Japanese)' },
        { value: 'chinese', label: 'Chinese' },
        { value: 'southeast-asian', label: 'Southeast Asian (Thai, Filipino, Vietnamese, Indonesian)' },
        { value: 'south-asian', label: 'South Asian (Indian, Pakistani, Bangladeshi)' },
        { value: 'middle-eastern', label: 'Middle Eastern (Arab, Persian, Turkish)' },
        { value: 'european', label: 'European / Western European' },
        { value: 'scandinavian', label: 'Scandinavian (Nordic)' },
        { value: 'eastern-european', label: 'Eastern European (Russian, Polish, Ukrainian)' },
        { value: 'latino', label: 'Latino / Hispanic' },
        { value: 'pacific-islander', label: 'Pacific Islander' },
        { value: 'caucasian', label: 'Caucasian / White' },
        { value: 'african', label: 'African' },
        { value: 'mixed', label: 'Mixed / Multiracial' },
        { value: 'other', label: 'Other' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'handedness',
      title: '🤚 Handedness',
      question: 'Dominant hand:',
      options: [
        { value: 'right-handed', label: 'Right-handed' },
        { value: 'left-handed', label: 'Left-handed' },
        { value: 'ambidextrous', label: 'Ambidextrous' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    // PHYSICAL (4)
    {
      id: 'height',
      title: '📏 Height',
      question: 'Height:',
      type: 'height-slider'
    },
    {
      id: 'build',
      title: '🏋️ Build Type',
      question: 'Body build:',
      options: [
        { value: 'petite-slim', label: 'Petite / Slim' },
        { value: 'average', label: 'Average' },
        { value: 'athletic-toned', label: 'Athletic / Toned' },
        { value: 'muscular-bulky', label: 'Muscular / Bulky' },
        { value: 'curvy-full', label: 'Curvy / Full-figured' },
        { value: 'plus-size', label: 'Plus-size' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'muscleDefinition',
      title: '💪 Muscle Definition',
      question: 'Muscle definition/tone:',
      options: [
        { value: 'minimal', label: 'Minimal (soft, no definition)' },
        { value: 'slight', label: 'Slight definition' },
        { value: 'moderate', label: 'Moderate (visible abs/arms)' },
        { value: 'high', label: 'High definition (athletic)' },
        { value: 'very-high', label: 'Very high (bodybuilder)' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'proportions',
      title: '📐 Body Proportions',
      question: 'Body proportions:',
      options: [
        { value: 'long-legs', label: 'Long legs / Short torso' },
        { value: 'balanced', label: 'Balanced proportions' },
        { value: 'long-torso', label: 'Long torso / Short legs' },
        { value: 'v-shape', label: 'V-shape (broad shoulders)' },
        { value: 'hourglass', label: 'Hourglass' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    // COLORING (4)
    {
      id: 'skinTone',
      title: '🎨 Skin Tone',
      question: 'Skin tone:',
      options: [
        { value: 'very-light', label: 'Very light / Pale' },
        { value: 'light', label: 'Light' },
        { value: 'light-medium', label: 'Light-medium' },
        { value: 'medium', label: 'Medium' },
        { value: 'medium-dark', label: 'Medium-dark' },
        { value: 'dark', label: 'Dark' },
        { value: 'very-dark', label: 'Very dark' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'skinCharacteristics',
      title: '🌈 Skin Characteristics',
      question: 'Skin texture and characteristics:',
      type: 'multi-select',
      options: [
        { value: 'clear-smooth', label: 'Clear & smooth' },
        { value: 'freckles', label: 'Freckles' },
        { value: 'acne-prone', label: 'Acne-prone' },
        { value: 'scarring', label: 'Scarring' },
        { value: 'birthmarks', label: 'Birthmarks' },
        { value: 'vitiligo', label: 'Vitiligo' },
        { value: 'stretch-marks', label: 'Stretch marks' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'skinFinish',
      title: '✨ Skin Finish',
      question: 'Skin finish/texture appearance:',
      options: [
        { value: 'matte', label: 'Matte (no shine)' },
        { value: 'natural', label: 'Natural' },
        { value: 'dewy-glowing', label: 'Dewy / Glowing' },
        { value: 'oily-shiny', label: 'Oily / Shiny' },
        { value: 'weathered', label: 'Weathered / Rugged' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'hairColor',
      title: '💇 Hair Color',
      question: 'Hair color:',
      options: [
        { value: 'black', label: 'Black' },
        { value: 'dark-brown', label: 'Dark brown' },
        { value: 'medium-brown', label: 'Medium brown' },
        { value: 'light-brown', label: 'Light brown' },
        { value: 'blonde', label: 'Blonde' },
        { value: 'red-auburn', label: 'Red / Auburn' },
        { value: 'grey-silver', label: 'Grey / Silver' },
        { value: 'dyed-colorful', label: 'Dyed / Colorful' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'hairTexture',
      title: '〰️ Hair Texture',
      question: 'Hair texture:',
      options: [
        { value: 'straight', label: 'Straight' },
        { value: 'wavy', label: 'Wavy' },
        { value: 'curly', label: 'Curly' },
        { value: 'coily', label: 'Coily / Kinky' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    // STYLE (9)
    {
      id: 'hairLength',
      title: '✂️ Hair Length',
      question: 'Hair length:',
      options: [
        { value: 'bald', label: 'Bald / Shaved' },
        { value: 'buzzed', label: 'Buzzed / Very short' },
        { value: 'short', label: 'Short' },
        { value: 'medium', label: 'Medium' },
        { value: 'long', label: 'Long' },
        { value: 'very-long', label: 'Very long' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'hairstyle',
      title: '💈 Hairstyle',
      question: 'Specific hairstyle:',
      options: [
        { value: 'natural-free', label: 'Natural / Free-flowing' },
        { value: 'side-part', label: 'Side Part' },
        { value: 'middle-part', label: 'Middle Part' },
        { value: 'slicked-back', label: 'Slicked Back' },
        { value: 'undercut', label: 'Undercut' },
        { value: 'pompadour', label: 'Pompadour / Quiff' },
        { value: 'fade', label: 'Fade (Skin/Taper)' },
        { value: 'layered', label: 'Layered' },
        { value: 'curtain-bangs', label: 'Curtain Bangs' },
        { value: 'bob', label: 'Bob' },
        { value: 'pixie', label: 'Pixie Cut' },
        { value: 'braids', label: 'Braids' },
        { value: 'locs', label: 'Locs / Dreadlocks' },
        { value: 'ponytail', label: 'Ponytail / Updo' },
        { value: 'man-bun', label: 'Man Bun' },
        { value: 'afro', label: 'Afro' },
        { value: 'buzz-crew', label: 'Buzz Cut / Crew Cut' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'bodyHair',
      title: '🧔 Body Hair',
      question: 'Body hair preference:',
      options: [
        { value: 'minimal-smooth', label: 'Minimal / Smooth' },
        { value: 'trimmed', label: 'Trimmed / Groomed' },
        { value: 'natural-moderate', label: 'Natural (moderate)' },
        { value: 'natural-hairy', label: 'Natural (hairy)' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'legHair',
      title: '🦵 Leg Hair',
      question: 'Leg hair:',
      options: [
        { value: 'shaved-smooth', label: 'Shaved / Smooth' },
        { value: 'trimmed', label: 'Trimmed' },
        { value: 'natural-light', label: 'Natural (light)' },
        { value: 'natural-dark', label: 'Natural (dark)' },
        { value: 'not-applicable', label: 'Not applicable' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'nails',
      title: '💅 Nails',
      question: 'Nail style:',
      options: [
        { value: 'short-natural', label: 'Short & natural' },
        { value: 'manicured', label: 'Manicured (polished)' },
        { value: 'long-natural', label: 'Long natural nails' },
        { value: 'acrylics-extensions', label: 'Acrylics / Extensions' },
        { value: 'artistic-nails', label: 'Artistic nail art' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'makeupStyle',
      title: '💄 Makeup Style',
      question: 'Typical makeup approach:',
      options: [
        { value: 'none-natural', label: 'None / Natural look' },
        { value: 'minimal', label: 'Minimal (light touch)' },
        { value: 'everyday', label: 'Everyday makeup' },
        { value: 'glam-dramatic', label: 'Glam / Dramatic' },
        { value: 'artistic-creative', label: 'Artistic / Creative' },
        { value: 'not-applicable', label: 'Not applicable' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'tattoos',
      title: '🎨 Tattoos',
      question: 'Tattoos:',
      options: [
        { value: 'none', label: 'None' },
        { value: 'small-few', label: 'Small / Few' },
        { value: 'several', label: 'Several visible' },
        { value: 'sleeve-large', label: 'Sleeve / Large pieces' },
        { value: 'heavily-tattooed', label: 'Heavily tattooed' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'piercings',
      title: '💎 Piercings',
      question: 'Piercings:',
      type: 'multi-select',
      options: [
        { value: 'none', label: 'None' },
        { value: 'ears-standard', label: 'Ears (standard)' },
        { value: 'ears-multiple', label: 'Ears (multiple)' },
        { value: 'nose', label: 'Nose' },
        { value: 'eyebrow', label: 'Eyebrow' },
        { value: 'lip', label: 'Lip' },
        { value: 'tongue', label: 'Tongue' },
        { value: 'body', label: 'Body piercings' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'nosePiercingType',
      title: '👃 Nose Piercing Type',
      question: 'If nose piercing, which type:',
      options: [
        { value: 'none', label: 'None' },
        { value: 'nostril-stud', label: 'Nostril stud' },
        { value: 'nostril-hoop', label: 'Nostril hoop' },
        { value: 'septum', label: 'Septum' },
        { value: 'bridge', label: 'Bridge' },
        { value: 'multiple', label: 'Multiple nose piercings' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'styleFashion',
      title: '👗 Fashion Style',
      question: 'Fashion style:',
      type: 'multi-select',
      options: [
        { value: 'casual-relaxed', label: 'Casual / Relaxed' },
        { value: 'sporty-athletic', label: 'Sporty / Athletic' },
        { value: 'business-professional', label: 'Business / Professional' },
        { value: 'streetwear', label: 'Streetwear / Urban' },
        { value: 'bohemian-artsy', label: 'Bohemian / Artsy' },
        { value: 'elegant-classic', label: 'Elegant / Classic' },
        { value: 'edgy-alternative', label: 'Edgy / Alternative' },
        { value: 'minimalist', label: 'Minimalist' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    // FEATURES (13)
    {
      id: 'eyeColor',
      title: '👁️ Eye Color',
      question: 'Eye color:',
      options: [
        { value: 'brown-dark', label: 'Dark brown' },
        { value: 'brown-medium', label: 'Medium brown' },
        { value: 'brown-light', label: 'Light brown / Amber' },
        { value: 'hazel', label: 'Hazel' },
        { value: 'green', label: 'Green' },
        { value: 'blue', label: 'Blue' },
        { value: 'grey', label: 'Grey' },
        { value: 'heterochromia', label: 'Heterochromia (different colors)' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'eyeExpression',
      title: '👀 Eye Expression',
      question: 'How do the eyes communicate/appear:',
      options: [
        { value: 'intense-piercing', label: 'Intense / Piercing' },
        { value: 'soft-warm', label: 'Soft / Warm' },
        { value: 'dreamy-distant', label: 'Dreamy / Distant' },
        { value: 'playful-sparkling', label: 'Playful / Sparkling' },
        { value: 'mysterious-deep', label: 'Mysterious / Deep' },
        { value: 'kind-gentle', label: 'Kind / Gentle' },
        { value: 'confident-direct', label: 'Confident / Direct' },
        { value: 'sleepy-relaxed', label: 'Sleepy / Relaxed' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'eyebrows',
      title: '✨ Eyebrows',
      question: 'Eyebrow shape and thickness:',
      options: [
        { value: 'thin-arched', label: 'Thin & arched' },
        { value: 'medium-natural', label: 'Medium / Natural' },
        { value: 'thick-full', label: 'Thick & full' },
        { value: 'bushy', label: 'Bushy / Heavy' },
        { value: 'straight', label: 'Straight (not arched)' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'lipShape',
      title: '👄 Lip Shape',
      question: 'Lip shape and fullness:',
      options: [
        { value: 'thin', label: 'Thin lips' },
        { value: 'medium', label: 'Medium / Average' },
        { value: 'full', label: 'Full / Plump' },
        { value: 'very-full', label: 'Very full' },
        { value: 'bow-shaped', label: 'Bow-shaped (Cupid\'s bow)' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'ears',
      title: '👂 Ears',
      question: 'Ear size and shape:',
      options: [
        { value: 'small', label: 'Small ears' },
        { value: 'average', label: 'Average' },
        { value: 'large', label: 'Large / Prominent' },
        { value: 'attached-lobes', label: 'Attached earlobes' },
        { value: 'detached-lobes', label: 'Detached earlobes' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'frecklesMarks',
      title: '🌟 Freckles & Beauty Marks',
      question: 'Freckles, moles, beauty marks:',
      type: 'multi-select',
      options: [
        { value: 'none', label: 'None' },
        { value: 'light-freckles', label: 'Light freckles' },
        { value: 'heavy-freckles', label: 'Heavy freckles' },
        { value: 'beauty-mark-face', label: 'Beauty mark (face)' },
        { value: 'multiple-moles', label: 'Multiple moles' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'facialHair',
      title: '🧔 Facial Hair',
      question: 'Facial hair style:',
      options: [
        { value: 'clean-shaven', label: 'Clean shaven' },
        { value: 'stubble', label: 'Stubble / 5 o\'clock shadow' },
        { value: 'goatee', label: 'Goatee' },
        { value: 'mustache', label: 'Mustache' },
        { value: 'short-beard', label: 'Short beard' },
        { value: 'full-beard', label: 'Full beard' },
        { value: 'long-beard', label: 'Long beard' },
        { value: 'not-applicable', label: 'Not applicable' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'glasses',
      title: '👓 Glasses',
      question: 'Glasses / Eyewear:',
      options: [
        { value: 'none', label: 'None' },
        { value: 'full-time', label: 'Full-time glasses' },
        { value: 'reading-only', label: 'Reading glasses only' },
        { value: 'contacts', label: 'Contact lenses' },
        { value: 'sometimes', label: 'Sometimes / Optional' },
        { value: 'sunglasses-often', label: 'Sunglasses often' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'dimples',
      title: '😊 Dimples',
      question: 'Dimples:',
      options: [
        { value: 'none', label: 'None' },
        { value: 'yes-both-cheeks', label: 'Yes - both cheeks' },
        { value: 'yes-one-cheek', label: 'Yes - one cheek' },
        { value: 'yes-chin', label: 'Yes - chin dimple' },
        { value: 'yes-back', label: 'Yes - back dimples' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'smileTeeth',
      title: '😁 Smile & Teeth',
      question: 'Smile and teeth:',
      type: 'multi-select',
      options: [
        { value: 'straight-teeth', label: 'Straight teeth' },
        { value: 'braces-retainer', label: 'Braces / Retainer' },
        { value: 'gap-teeth', label: 'Gap between front teeth' },
        { value: 'big-smile', label: 'Big, wide smile' },
        { value: 'subtle-smile', label: 'Subtle / Reserved smile' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'noseType',
      title: '👃 Nose Shape',
      question: 'Nose shape:',
      options: [
        { value: 'small-button', label: 'Small / Button' },
        { value: 'straight-refined', label: 'Straight / Refined' },
        { value: 'roman-aquiline', label: 'Roman / Aquiline' },
        { value: 'wide-flat', label: 'Wide / Flat' },
        { value: 'upturned', label: 'Upturned' },
        { value: 'prominent', label: 'Prominent / Strong' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'faceShape',
      title: '🎭 Face Shape',
      question: 'Face shape:',
      options: [
        { value: 'oval', label: 'Oval' },
        { value: 'round', label: 'Round' },
        { value: 'square', label: 'Square' },
        { value: 'heart', label: 'Heart-shaped' },
        { value: 'oblong', label: 'Oblong / Rectangular' },
        { value: 'diamond', label: 'Diamond' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'cheekbones',
      title: '✨ Cheekbones',
      question: 'Cheekbone prominence:',
      options: [
        { value: 'high-defined', label: 'High & defined' },
        { value: 'prominent', label: 'Prominent' },
        { value: 'soft-rounded', label: 'Soft / Rounded' },
        { value: 'subtle', label: 'Subtle' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'jawline',
      title: '🗿 Jawline',
      question: 'Jawline:',
      options: [
        { value: 'sharp-defined', label: 'Sharp & defined' },
        { value: 'strong', label: 'Strong' },
        { value: 'soft-rounded', label: 'Soft / Rounded' },
        { value: 'delicate', label: 'Delicate' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    // BEHAVIORAL/EXPRESSIVE - For Avatar Accuracy
    {
      id: 'expressionVibe',
      title: '✨ Expression / Vibe',
      question: 'Overall presence and energy:',
      options: [
        { value: 'confident-bold', label: 'Confident / Bold' },
        { value: 'mysterious-reserved', label: 'Mysterious / Reserved' },
        { value: 'warm-approachable', label: 'Warm / Approachable' },
        { value: 'playful-mischievous', label: 'Playful / Mischievous' },
        { value: 'serious-intense', label: 'Serious / Intense' },
        { value: 'relaxed-easygoing', label: 'Relaxed / Easygoing' },
        { value: 'elegant-refined', label: 'Elegant / Refined' },
        { value: 'energetic-outgoing', label: 'Energetic / Outgoing' },
        { value: 'intellectual-thoughtful', label: 'Intellectual / Thoughtful' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'posture',
      title: '🧍 Posture',
      question: 'Body posture and stance:',
      options: [
        { value: 'confident-upright', label: 'Confident / Upright' },
        { value: 'relaxed-casual', label: 'Relaxed / Casual' },
        { value: 'athletic-dynamic', label: 'Athletic / Dynamic' },
        { value: 'graceful-elegant', label: 'Graceful / Elegant' },
        { value: 'powerful-commanding', label: 'Powerful / Commanding' },
        { value: 'shy-reserved', label: 'Shy / Reserved' },
        { value: 'lean-in-engaged', label: 'Leaning in / Engaged' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'smileType',
      title: '😊 Smile Type',
      question: 'Type of smile in portraits:',
      options: [
        { value: 'subtle-closed', label: 'Subtle / Closed lips' },
        { value: 'warm-slight', label: 'Warm slight smile' },
        { value: 'big-teeth', label: 'Big smile showing teeth' },
        { value: 'grin-wide', label: 'Wide grin' },
        { value: 'smirk', label: 'Smirk / Asymmetric' },
        { value: 'neutral-serious', label: 'Neutral / Serious' },
        { value: 'laugh', label: 'Laughing' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'vibeTags',
      title: '🏷️ Vibe Tags',
      question: 'Select personality/vibe descriptors:',
      type: 'multi-select',
      options: [
        { value: 'contemplative', label: 'Contemplative' },
        { value: 'adventurous', label: 'Adventurous' },
        { value: 'intellectual', label: 'Intellectual' },
        { value: 'charismatic', label: 'Charismatic' },
        { value: 'mysterious', label: 'Mysterious' },
        { value: 'nurturing', label: 'Nurturing' },
        { value: 'rebellious', label: 'Rebellious' },
        { value: 'romantic', label: 'Romantic' },
        { value: 'sophisticated', label: 'Sophisticated' },
        { value: 'playful', label: 'Playful' },
        { value: 'artistic', label: 'Artistic' },
        { value: 'driven', label: 'Driven' },
        { value: 'serene', label: 'Serene' },
        { value: 'vintage', label: 'Vintage-Soul' },
        { value: 'modern', label: 'Modern/Forward-thinking' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'socialBattery',
      title: '🔋 Social Battery',
      question: 'Energy level in social situations:',
      options: [
        { value: '20', label: '20% - Deep introvert, prefers solitude' },
        { value: '40', label: '40% - Introvert, small gatherings' },
        { value: '60', label: '60% - Ambivert, balanced' },
        { value: '80', label: '80% - Extrovert, loves socializing' },
        { value: '100', label: '100% - Life of the party' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'riskTolerance',
      title: '🎲 Risk Tolerance',
      question: 'Approach to risk and adventure:',
      options: [
        { value: 'very-conservative', label: 'Very Conservative - Safety first' },
        { value: 'conservative', label: 'Conservative - Careful planner' },
        { value: 'moderate', label: 'Moderate - Calculated risks' },
        { value: 'moderate-aggressive', label: 'Moderate-Aggressive - Opportunistic' },
        { value: 'aggressive', label: 'Aggressive - Bold risk-taker' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    // BABY NANO PORTRAIT (3)
    {
      id: 'portraitAttire',
      title: '👔 Portrait Attire',
      question: 'What should you wear in your Baby Nano couple portrait?',
      options: [
        { value: 'casual', label: 'Casual (everyday wear)' },
        { value: 'business', label: 'Business / Professional' },
        { value: 'sporty', label: 'Sporty / Athletic' },
        { value: 'swimwear', label: 'Swimwear / Beach' },
        { value: 'western', label: 'Western (jeans, boots, cowboy style)' },
        { value: 'traditional-chinese', label: 'Traditional Chinese' },
        { value: 'formal-gown', label: 'Formal Gown / Evening wear' },
        { value: 'wedding', label: 'Wedding attire' },
        { value: 'ethnic', label: 'Ethnic / Cultural attire' },
        { value: 'costume', label: 'Costume / Fantasy' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'accessories',
      title: '💍 Accessories',
      question: 'What accessories should appear in your portrait?',
      type: 'multi-select',
      options: [
        { value: 'watch', label: 'Watch' },
        { value: 'jewelry-necklace', label: 'Necklace / Pendant' },
        { value: 'jewelry-bracelet', label: 'Bracelet' },
        { value: 'jewelry-rings', label: 'Rings' },
        { value: 'jewelry-earrings', label: 'Earrings' },
        { value: 'hat', label: 'Hat / Cap' },
        { value: 'sunglasses', label: 'Sunglasses' },
        { value: 'scarf', label: 'Scarf' },
        { value: 'bag', label: 'Bag / Purse' },
        { value: 'belt', label: 'Belt' },
        { value: 'tie', label: 'Tie / Bow tie' },
        { value: 'gloves', label: 'Gloves' },
        { value: 'headband', label: 'Headband' },
        { value: 'none', label: 'None / Minimal' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'customDetails',
      title: '✨ Custom Details',
      question: 'Any special details for Baby Nano to include? (optional)',
      type: 'custom-text',
      placeholder: 'Example: "Walking on Huntington Beach at sunset" or "In a rose garden with morning dew"'
    }
  ];

  const currentSectionData = sections[currentSection];

  // Convert feet/inches to cm
  const feetInchesToCm = (feet, inches) => {
    return Math.round((feet * 30.48) + (inches * 2.54));
  };

  // Load existing responses when navigating
  useEffect(() => {
    const sectionId = currentSectionData.id;
    const existingMe = responses.me?.[sectionId];
    const existingIdeal = responses.idealType?.[sectionId];

    if (sectionId === 'height') {
      if (existingMe) {
        setHeightMe({ feet: existingMe.feet, inches: existingMe.inches });
      }
      if (existingIdeal) {
        setHeightIdeal({ feet: existingIdeal.feet, inches: existingIdeal.inches });
      }
      setSelectedMe(existingMe ? 'set' : null);
      setSelectedIdeal(existingIdeal ? 'set' : null);
    } else if (currentSectionData.type === 'custom-text') {
      // Custom text area - load existing text
      setCustomDetailsMe(existingMe || '');
      setCustomDetailsIdeal(existingIdeal || '');
      setSelectedMe('set'); // Always "answered" since optional
      setSelectedIdeal('set');
    } else if (currentSectionData.type === 'multi-select') {
      setSelectedMe(existingMe || []);
      setSelectedIdeal(existingIdeal || []);
    } else {
      setSelectedMe(existingMe || null);
      setSelectedIdeal(existingIdeal || null);
    }
  }, [currentSection]);

  // Handle single selection
  const handleSelectMe = (value) => {
    if (currentSectionData.type === 'multi-select') {
      setSelectedMe(prev => {
        const arr = Array.isArray(prev) ? prev : [];
        if (value === 'no-preference') return ['no-preference'];
        const filtered = arr.filter(v => v !== 'no-preference');
        return filtered.includes(value)
          ? filtered.filter(v => v !== value)
          : [...filtered, value];
      });
    } else {
      setSelectedMe(value);
    }
  };

  const handleSelectIdeal = (value) => {
    if (currentSectionData.type === 'multi-select') {
      setSelectedIdeal(prev => {
        const arr = Array.isArray(prev) ? prev : [];
        if (value === 'no-preference') return ['no-preference'];
        const filtered = arr.filter(v => v !== 'no-preference');
        return filtered.includes(value)
          ? filtered.filter(v => v !== value)
          : [...filtered, value];
      });
    } else {
      setSelectedIdeal(value);
    }
  };

  // Check if both columns are answered
  const bothAnswered = () => {
    if (currentSectionData.type === 'height-slider') {
      return true; // Height always has a value
    }
    if (currentSectionData.type === 'custom-text') {
      return true; // Custom text is optional
    }
    if (currentSectionData.type === 'multi-select') {
      return (Array.isArray(selectedMe) && selectedMe.length > 0) &&
             (Array.isArray(selectedIdeal) && selectedIdeal.length > 0);
    }
    return selectedMe !== null && selectedIdeal !== null;
  };

  // Handle Next
  const handleNext = () => {
    if (!bothAnswered()) return;

    const sectionId = currentSectionData.id;
    let meValue = selectedMe;
    let idealValue = selectedIdeal;

    // Special handling for height
    if (sectionId === 'height') {
      meValue = {
        feet: heightMe.feet,
        inches: heightMe.inches,
        cm: feetInchesToCm(heightMe.feet, heightMe.inches),
        display: `${heightMe.feet}'${heightMe.inches}" (${feetInchesToCm(heightMe.feet, heightMe.inches)}cm)`
      };
      idealValue = {
        feet: heightIdeal.feet,
        inches: heightIdeal.inches,
        cm: feetInchesToCm(heightIdeal.feet, heightIdeal.inches),
        display: `${heightIdeal.feet}'${heightIdeal.inches}" (${feetInchesToCm(heightIdeal.feet, heightIdeal.inches)}cm)`
      };
    }

    // Special handling for custom text
    if (currentSectionData.type === 'custom-text') {
      meValue = customDetailsMe.trim() || null;
      idealValue = customDetailsIdeal.trim() || null;
    }

    // Save responses
    const newResponses = {
      ...responses,
      me: { ...responses.me, [sectionId]: meValue },
      idealType: { ...responses.idealType, [sectionId]: idealValue }
    };
    setResponses(newResponses);

    // Notify parent for auto-save to Firebase
    if (onProgressUpdate) {
      onProgressUpdate({ physicalLayer: newResponses });
    }

    // Move to next or complete
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setSelectedMe(null);
      setSelectedIdeal(null);
    } else {
      // Complete - build final response object
      const finalResponses = {
        me: { ...responses.me, [sectionId]: meValue },
        idealType: { ...responses.idealType, [sectionId]: idealValue },
        completedAt: new Date().toISOString()
      };
      onComplete({ physicalLayer: finalResponses });
    }
  };

  // Save current section's data (for jumping between sections)
  const saveCurrentSection = (notifyParent = false) => {
    const sectionId = currentSectionData.id;
    let meValue = selectedMe;
    let idealValue = selectedIdeal;

    // Special handling for height
    if (sectionId === 'height') {
      meValue = {
        feet: heightMe.feet,
        inches: heightMe.inches,
        cm: feetInchesToCm(heightMe.feet, heightMe.inches),
        display: `${heightMe.feet}'${heightMe.inches}" (${feetInchesToCm(heightMe.feet, heightMe.inches)}cm)`
      };
      idealValue = {
        feet: heightIdeal.feet,
        inches: heightIdeal.inches,
        cm: feetInchesToCm(heightIdeal.feet, heightIdeal.inches),
        display: `${heightIdeal.feet}'${heightIdeal.inches}" (${feetInchesToCm(heightIdeal.feet, heightIdeal.inches)}cm)`
      };
    }

    // Special handling for custom text
    if (currentSectionData.type === 'custom-text') {
      meValue = customDetailsMe.trim() || null;
      idealValue = customDetailsIdeal.trim() || null;
    }

    // Only save if we have data
    if (meValue !== null || idealValue !== null || currentSectionData.type === 'height-slider' || currentSectionData.type === 'custom-text') {
      const newResponses = {
        ...responses,
        me: { ...responses.me, [sectionId]: meValue },
        idealType: { ...responses.idealType, [sectionId]: idealValue }
      };
      setResponses(newResponses);

      // Notify parent component for auto-save to Firebase
      if (notifyParent && onProgressUpdate) {
        onProgressUpdate({ physicalLayer: newResponses });
      }

      return newResponses;
    }
    return responses;
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      saveCurrentSection(true); // Save before navigating + notify parent for auto-save
      setCurrentSection(currentSection - 1);
    }
  };

  // Jump to specific section (from progress slider)
  const handleJumpToSection = (sectionIndex) => {
    if (sectionIndex === currentSection) return;
    saveCurrentSection(true); // Save current before jumping + notify parent for auto-save
    setCurrentSection(sectionIndex);
  };

  // Check if a section has been answered
  const isSectionAnswered = (sectionIndex) => {
    const section = sections[sectionIndex];
    const meAnswer = responses.me?.[section.id];
    const idealAnswer = responses.idealType?.[section.id];
    return meAnswer !== undefined || idealAnswer !== undefined;
  };

  const progress = ((currentSection + 1) / sections.length) * 100;
  const isLastSection = currentSection === sections.length - 1;

  // Render height slider
  const renderHeightSlider = (height, setHeight, column) => (
    <div className="height-slider-container">
      <div className="height-display">
        {height.feet}'{height.inches}" ({feetInchesToCm(height.feet, height.inches)}cm)
      </div>
      <div className="height-sliders">
        <div className="slider-group">
          <label>Feet</label>
          <input
            type="range"
            min="4"
            max="7"
            value={height.feet}
            onChange={(e) => setHeight(prev => ({ ...prev, feet: parseInt(e.target.value) }))}
            className="height-range"
          />
          <span>{height.feet}'</span>
        </div>
        <div className="slider-group">
          <label>Inches</label>
          <input
            type="range"
            min="0"
            max="11"
            value={height.inches}
            onChange={(e) => setHeight(prev => ({ ...prev, inches: parseInt(e.target.value) }))}
            className="height-range"
          />
          <span>{height.inches}"</span>
        </div>
      </div>
    </div>
  );

  // Render custom text area
  const renderCustomText = (value, setValue, column) => (
    <div className="custom-text-container">
      <textarea
        className="custom-text-area"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={currentSectionData.placeholder}
        rows={4}
      />
      <div className="custom-text-hint">
        {column === 'me'
          ? '💡 Describe yourself in more detail for the portrait'
          : '💡 Describe your ideal partner in the scene'
        }
      </div>
      <div className="example-prompts">
        <span className="example-label">Example scenes:</span>
        <button
          type="button"
          className="example-btn"
          onClick={() => setValue('Walking on Huntington Beach at sunset, barefoot in the sand')}
        >
          🏖️ Beach
        </button>
        <button
          type="button"
          className="example-btn"
          onClick={() => setValue('In a rose garden with morning dew, elegant and romantic')}
        >
          🌹 Garden
        </button>
        <button
          type="button"
          className="example-btn"
          onClick={() => setValue('Coffee shop date, cozy and intimate atmosphere')}
        >
          ☕ Café
        </button>
        <button
          type="button"
          className="example-btn"
          onClick={() => setValue('Mountain hiking adventure, casual and adventurous')}
        >
          ⛰️ Adventure
        </button>
      </div>
    </div>
  );

  // Render options
  const renderOptions = (selected, handleSelect, column) => {
    const isMulti = currentSectionData.type === 'multi-select';
    const selectedArr = Array.isArray(selected) ? selected : [];

    return (
      <div className="options-grid">
        {currentSectionData.options.map((option, index) => {
          const isSelected = isMulti
            ? selectedArr.includes(option.value)
            : selected === option.value;

          return (
            <motion.button
              key={option.value}
              className={`option-button ${isSelected ? 'selected' : ''}`}
              onClick={() => handleSelect(option.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isMulti && <span className="checkbox">{isSelected ? '☑' : '☐'}</span>}
              <span className="option-text">{option.label}</span>
            </motion.button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="physical-layer-assessment">
      {/* Header */}
      <div className="assessment-header">
        <h2>🎨 What's My Type Playground</h2>
        <p className="subtitle">Build yourself + your ideal type - like LEGO!</p>

        {/* Clickable Progress Slider */}
        <div className="progress-slider-container">
          <input
            type="range"
            min="0"
            max={sections.length - 1}
            value={currentSection}
            onChange={(e) => handleJumpToSection(parseInt(e.target.value))}
            className="progress-slider"
          />
          <div className="progress-labels">
            <span>1</span>
            <span className="progress-current">{currentSection + 1} / {sections.length}</span>
            <span>{sections.length}</span>
          </div>
        </div>

        {/* Quick Jump Dots */}
        <div className="progress-dots">
          {sections.map((section, index) => (
            <button
              key={section.id}
              className={`progress-dot ${index === currentSection ? 'active' : ''} ${isSectionAnswered(index) ? 'answered' : ''}`}
              onClick={() => handleJumpToSection(index)}
              title={`${index + 1}. ${section.title}`}
            >
              {isSectionAnswered(index) && index !== currentSection ? '✓' : index + 1}
            </button>
          ))}
        </div>

        {/* Current Section Label */}
        <p className="progress-text">
          <span className="section-label">{currentSectionData.title}</span>
          {currentSection >= 32 && <span className="portrait-badge">🎨 Portrait Section</span>}
        </p>
      </div>

      {/* Two Column Layout */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="two-column-container"
        >
          {/* Section Title */}
          <div className="section-title">
            <h3>{currentSectionData.title}</h3>
            <p>{currentSectionData.question}</p>
          </div>

          <div className="columns-wrapper">
            {/* ME Column */}
            <div className="column me-column">
              <div className="column-header">
                <span className="column-icon">🙋</span>
                <span className="column-title">ME</span>
              </div>
              <div className="column-content">
                {currentSectionData.type === 'height-slider'
                  ? renderHeightSlider(heightMe, setHeightMe, 'me')
                  : currentSectionData.type === 'custom-text'
                  ? renderCustomText(customDetailsMe, setCustomDetailsMe, 'me')
                  : renderOptions(selectedMe, handleSelectMe, 'me')
                }
              </div>
              {selectedMe && currentSectionData.type !== 'custom-text' && (
                <div className="selection-indicator">✓ Selected</div>
              )}
            </div>

            {/* IDEAL TYPE Column */}
            <div className="column ideal-column">
              <div className="column-header">
                <span className="column-icon">💝</span>
                <span className="column-title">IDEAL TYPE</span>
              </div>
              <div className="column-content">
                {currentSectionData.type === 'height-slider'
                  ? renderHeightSlider(heightIdeal, setHeightIdeal, 'ideal')
                  : currentSectionData.type === 'custom-text'
                  ? renderCustomText(customDetailsIdeal, setCustomDetailsIdeal, 'ideal')
                  : renderOptions(selectedIdeal, handleSelectIdeal, 'ideal')
                }
              </div>
              {selectedIdeal && currentSectionData.type !== 'custom-text' && (
                <div className="selection-indicator">✓ Selected</div>
              )}
            </div>
          </div>

          {/* Hint message */}
          <div className="hint-message">
            {!bothAnswered() && (
              <span className="hint-warning">⚠️ Answer both columns to continue</span>
            )}
            {currentSection === 0 && (
              <span className="hint-info">🎭 Luna will impersonate your ideal type!</span>
            )}
            {currentSectionData.id === 'height' && (
              <span className="hint-info">🎨 Baby Nano will create your couple portrait with accurate height differences!</span>
            )}
            {currentSectionData.id === 'portraitAttire' && (
              <span className="hint-info">👔 Choose what you'll wear in your Baby Nano couple portrait!</span>
            )}
            {currentSectionData.id === 'accessories' && (
              <span className="hint-info">💍 Add finishing touches to your portrait look!</span>
            )}
            {currentSectionData.id === 'customDetails' && (
              <span className="hint-info">✨ This is optional - add any special scene details or leave blank!</span>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="navigation">
        <button
          className="btn-secondary"
          onClick={handlePrevious}
          disabled={currentSection === 0}
        >
          ← Previous
        </button>
        <span className="section-counter">
          {currentSection + 1} / {sections.length}
        </span>
        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={!bothAnswered()}
        >
          {isLastSection ? 'Complete' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
