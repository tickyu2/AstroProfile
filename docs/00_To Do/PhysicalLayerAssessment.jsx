import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PhysicalLayerAssessment.css';

/**
 * Physical Layer Assessment - "What's My Type Playground"
 * Two-column construction: ME + IDEAL TYPE
 * Light, fun, visual - perfect warmup before heavy psychology modules
 * 
 * Output enables:
 * - Luna to impersonate ideal type
 * - Baby Nano to create couple portrait with accurate height differences
 * - Constitutional cross-validation
 */
export function PhysicalLayerAssessment({ onComplete }) {
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState({
    me: {},
    idealType: {}
  });

  const sections = [
    {
      id: 'gender',
      title: '👤 Gender',
      question: 'Select your gender and ideal partner gender:',
      type: 'single-select',
      category: 'identity'
    },
    {
      id: 'handedness',
      title: '🤚 Handedness',
      question: 'Dominant hand:',
      type: 'single-select',
      category: 'identity',
      options: [
        { value: 'right-handed', label: 'Right-handed' },
        { value: 'left-handed', label: 'Left-handed' },
        { value: 'ambidextrous', label: 'Ambidextrous' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'height',
      title: '📏 Height',
      question: 'Your height and ideal partner height:',
      type: 'height-input',
      category: 'physical'
    },
    {
      id: 'build',
      title: '💪 Build Type',
      question: 'Body type/build:',
      type: 'multi-select',
      category: 'physical',
      options: [
        { value: 'petite-slim', label: 'Petite/Slim', desc: 'Lean, minimal muscle (ectomorph)' },
        { value: 'athletic-toned', label: 'Athletic/Toned', desc: 'Defined muscle, low body fat' },
        { value: 'muscular-bulky', label: 'Muscular/Bulky', desc: 'Large muscle mass' },
        { value: 'average-soft', label: 'Average/Soft', desc: 'Rounder, higher body fat' },
        { value: 'curvy', label: 'Curvy', desc: 'Feminine hourglass' },
        { value: 'no-preference', label: 'No Preference', desc: 'Open to all builds' }
      ]
    },
    {
      id: 'muscle-definition',
      title: '💪 Muscle Definition',
      question: 'Muscle definition/tone:',
      type: 'single-select',
      category: 'physical',
      options: [
        { value: 'minimal', label: 'Minimal', desc: 'Soft, no definition' },
        { value: 'slight', label: 'Slight definition' },
        { value: 'moderate', label: 'Moderate', desc: 'Visible abs/arms' },
        { value: 'high', label: 'High definition', desc: 'Athletic' },
        { value: 'very-high', label: 'Very high', desc: 'Bodybuilder level' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'proportions',
      title: '⚖️ Proportions',
      question: 'Body proportions:',
      type: 'single-select',
      category: 'physical',
      options: [
        { value: 'long-legs', label: 'Long legs, short torso' },
        { value: 'balanced', label: 'Balanced proportions' },
        { value: 'long-torso', label: 'Long torso, shorter legs' },
        { value: 'v-shape', label: 'Broad shoulders, narrow waist (V-shape)' },
        { value: 'balanced-ratio', label: 'Balanced shoulder-to-hip ratio' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'skin-tone',
      title: '🎨 Skin Tone',
      question: 'Skin tone:',
      type: 'single-select',
      category: 'coloring',
      options: [
        { value: 'very-light', label: 'Very Light', desc: 'Porcelain, ivory' },
        { value: 'light', label: 'Light', desc: 'Fair, pale' },
        { value: 'light-medium', label: 'Light-Medium', desc: 'Beige, peach' },
        { value: 'medium', label: 'Medium', desc: 'Olive, tan' },
        { value: 'medium-dark', label: 'Medium-Dark', desc: 'Caramel, bronze' },
        { value: 'dark', label: 'Dark', desc: 'Deep brown' },
        { value: 'very-dark', label: 'Very Dark', desc: 'Ebony, rich brown' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'skin-characteristics',
      title: '🌈 Skin Characteristics',
      question: 'Skin texture and characteristics:',
      type: 'multi-select',
      category: 'coloring',
      options: [
        { value: 'clear-smooth', label: 'Clear & smooth' },
        { value: 'freckles', label: 'Freckles' },
        { value: 'acne-prone', label: 'Acne-prone' },
        { value: 'scarring', label: 'Scarring (acne/other)' },
        { value: 'birthmarks', label: 'Birthmarks' },
        { value: 'vitiligo', label: 'Vitiligo' },
        { value: 'stretch-marks', label: 'Stretch marks' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'hair-color',
      title: '💇 Hair Color',
      question: 'Natural hair color:',
      type: 'single-select',
      category: 'coloring',
      options: [
        { value: 'black', label: 'Black' },
        { value: 'dark-brown', label: 'Dark Brown' },
        { value: 'light-brown', label: 'Light Brown' },
        { value: 'blonde', label: 'Blonde' },
        { value: 'red', label: 'Red/Auburn' },
        { value: 'gray-white', label: 'Gray/White' },
        { value: 'dyed-creative', label: 'Dyed (creative colors)' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'hair-texture',
      title: '🌊 Hair Texture',
      question: 'Hair texture/type:',
      type: 'single-select',
      category: 'coloring',
      options: [
        { value: 'straight', label: 'Straight', desc: 'Type 1' },
        { value: 'wavy', label: 'Wavy', desc: 'Type 2 (loose waves)' },
        { value: 'curly', label: 'Curly', desc: 'Type 3 (defined curls)' },
        { value: 'coily', label: 'Coily/Kinky', desc: 'Type 4 (tight coils)' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'hair-length',
      title: '✂️ Hair Length',
      question: 'Current/preferred hair length:',
      type: 'single-select',
      category: 'style',
      options: [
        { value: 'buzzed-shaved', label: 'Buzzed/Shaved' },
        { value: 'very-short', label: 'Very Short', desc: 'Pixie, crew cut' },
        { value: 'short', label: 'Short', desc: 'Chin-length or above' },
        { value: 'medium', label: 'Medium', desc: 'Shoulder-length' },
        { value: 'long', label: 'Long', desc: 'Past shoulders' },
        { value: 'very-long', label: 'Very Long', desc: 'Waist-length or longer' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'eye-color',
      title: '👁️ Eye Color',
      question: 'Eye color:',
      type: 'single-select',
      category: 'features',
      options: [
        { value: 'brown-dark', label: 'Dark Brown/Black' },
        { value: 'brown-medium', label: 'Medium Brown' },
        { value: 'brown-light', label: 'Light Brown/Hazel' },
        { value: 'green', label: 'Green' },
        { value: 'blue', label: 'Blue' },
        { value: 'gray', label: 'Gray' },
        { value: 'amber', label: 'Amber/Golden' },
        { value: 'heterochromia', label: 'Two different colors' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'eyebrows',
      title: '✨ Eyebrows',
      question: 'Eyebrow shape and thickness:',
      type: 'single-select',
      category: 'features',
      options: [
        { value: 'thin-arched', label: 'Thin & arched' },
        { value: 'medium-natural', label: 'Medium/natural' },
        { value: 'thick-full', label: 'Thick & full' },
        { value: 'bushy', label: 'Bushy/heavy' },
        { value: 'straight', label: 'Straight (not arched)' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'lip-shape',
      title: '👄 Lip Shape',
      question: 'Lip shape and fullness:',
      type: 'single-select',
      category: 'features',
      options: [
        { value: 'thin', label: 'Thin lips' },
        { value: 'medium', label: 'Medium/average' },
        { value: 'full', label: 'Full/plump' },
        { value: 'very-full', label: 'Very full' },
        { value: 'bow-shaped', label: 'Bow-shaped (Cupid\'s bow)' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'ears',
      title: '👂 Ears',
      question: 'Ear size and shape:',
      type: 'single-select',
      category: 'features',
      options: [
        { value: 'small', label: 'Small ears' },
        { value: 'average', label: 'Average' },
        { value: 'large', label: 'Large/prominent' },
        { value: 'attached-lobes', label: 'Attached earlobes' },
        { value: 'detached-lobes', label: 'Detached earlobes' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'freckles-marks',
      title: '🌟 Freckles & Beauty Marks',
      question: 'Freckles, moles, beauty marks:',
      type: 'multi-select',
      category: 'features',
      options: [
        { value: 'none', label: 'None' },
        { value: 'light-freckles', label: 'Light freckles' },
        { value: 'heavy-freckles', label: 'Heavy freckles (face/body)' },
        { value: 'beauty-mark-face', label: 'Beauty mark (face)' },
        { value: 'multiple-moles', label: 'Multiple moles' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'facial-hair',
      title: '🧔 Facial Hair',
      question: 'Facial hair (if applicable):',
      type: 'single-select',
      category: 'features',
      options: [
        { value: 'clean-shaven', label: 'Clean Shaven' },
        { value: 'stubble', label: 'Stubble (5 o\'clock shadow)' },
        { value: 'short-beard', label: 'Short Beard' },
        { value: 'full-beard', label: 'Full Beard' },
        { value: 'goatee', label: 'Goatee' },
        { value: 'mustache', label: 'Mustache' },
        { value: 'not-applicable', label: 'Not Applicable' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'glasses',
      title: '👓 Glasses',
      question: 'Glasses/contacts:',
      type: 'single-select',
      category: 'features',
      options: [
        { value: 'none', label: 'No glasses needed' },
        { value: 'glasses-full-time', label: 'Glasses (full-time)' },
        { value: 'glasses-sometimes', label: 'Glasses (sometimes/reading)' },
        { value: 'contacts', label: 'Contact lenses' },
        { value: 'both', label: 'Both glasses and contacts' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'dimples',
      title: '😊 Dimples',
      question: 'Dimples when smiling:',
      type: 'single-select',
      category: 'features',
      options: [
        { value: 'yes-both-cheeks', label: 'Yes - both cheeks' },
        { value: 'yes-one-cheek', label: 'Yes - one cheek' },
        { value: 'yes-chin', label: 'Yes - chin dimple' },
        { value: 'no', label: 'No dimples' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'smile-teeth',
      title: '😁 Smile & Teeth',
      question: 'Smile and teeth:',
      type: 'multi-select',
      category: 'features',
      options: [
        { value: 'straight-teeth', label: 'Straight teeth' },
        { value: 'natural-gaps', label: 'Natural gaps/spacing' },
        { value: 'big-smile', label: 'Big, wide smile' },
        { value: 'subtle-smile', label: 'Subtle/reserved smile' },
        { value: 'crooked-charming', label: 'Slightly crooked (charming)' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'nose-type',
      title: '👃 Nose Shape',
      question: 'Nose shape:',
      type: 'single-select',
      category: 'features',
      options: [
        { value: 'small-button', label: 'Small/Button nose' },
        { value: 'straight-refined', label: 'Straight/Refined' },
        { value: 'roman-prominent', label: 'Roman/Prominent bridge' },
        { value: 'wide-rounded', label: 'Wide/Rounded' },
        { value: 'aquiline', label: 'Aquiline (curved)' },
        { value: 'snub', label: 'Snub/Upturned' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'face-shape',
      title: '⬜ Face Shape',
      question: 'Overall face shape:',
      type: 'single-select',
      category: 'features',
      options: [
        { value: 'oval', label: 'Oval' },
        { value: 'round', label: 'Round' },
        { value: 'square', label: 'Square' },
        { value: 'heart', label: 'Heart' },
        { value: 'oblong', label: 'Oblong/Rectangle' },
        { value: 'diamond', label: 'Diamond' },
        { value: 'triangle', label: 'Triangle' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'cheekbones',
      title: '✨ Cheekbones',
      question: 'Cheekbone definition:',
      type: 'single-select',
      category: 'features',
      options: [
        { value: 'high-defined', label: 'High & defined' },
        { value: 'prominent', label: 'Prominent/angular' },
        { value: 'moderate', label: 'Moderate definition' },
        { value: 'soft-rounded', label: 'Soft/rounded' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'jawline',
      title: '🦴 Jawline',
      question: 'Jawline definition:',
      type: 'single-select',
      category: 'features',
      options: [
        { value: 'sharp-defined', label: 'Sharp/defined' },
        { value: 'strong-square', label: 'Strong/square' },
        { value: 'moderate', label: 'Moderate definition' },
        { value: 'soft-rounded', label: 'Soft/rounded' },
        { value: 'delicate', label: 'Delicate' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'body-hair',
      title: '🦵 Body Hair',
      question: 'Body hair preference:',
      type: 'single-select',
      category: 'style',
      options: [
        { value: 'minimal-smooth', label: 'Minimal/smooth (shaved/waxed)' },
        { value: 'trimmed-groomed', label: 'Trimmed/groomed' },
        { value: 'natural-light', label: 'Natural (light)' },
        { value: 'natural-moderate', label: 'Natural (moderate)' },
        { value: 'natural-hairy', label: 'Natural (hairy)' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'leg-hair',
      title: '🦵 Leg Hair',
      question: 'Leg hair (optional detail):',
      type: 'single-select',
      category: 'style',
      options: [
        { value: 'shaved-smooth', label: 'Shaved/smooth' },
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
      question: 'Nail style/maintenance:',
      type: 'single-select',
      category: 'style',
      options: [
        { value: 'short-natural', label: 'Short & natural' },
        { value: 'manicured', label: 'Manicured (polished)' },
        { value: 'long-natural', label: 'Long natural nails' },
        { value: 'acrylics-extensions', label: 'Acrylics/extensions' },
        { value: 'artistic-nails', label: 'Artistic nail art' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'makeup-style',
      title: '💄 Makeup Style',
      question: 'Typical makeup approach:',
      type: 'single-select',
      category: 'style',
      options: [
        { value: 'none-natural', label: 'None/natural look' },
        { value: 'minimal', label: 'Minimal (light touch)' },
        { value: 'everyday', label: 'Everyday makeup' },
        { value: 'glam-dramatic', label: 'Glam/dramatic' },
        { value: 'artistic-creative', label: 'Artistic/creative' },
        { value: 'not-applicable', label: 'Not applicable' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'tattoos',
      title: '🎨 Tattoos',
      question: 'Tattoos:',
      type: 'single-select',
      category: 'style',
      options: [
        { value: 'none', label: 'None' },
        { value: 'small-few', label: 'Small/few (1-3 small tattoos)' },
        { value: 'several', label: 'Several (4-10)' },
        { value: 'many', label: 'Many (10+)' },
        { value: 'sleeve-large', label: 'Sleeve or large pieces' },
        { value: 'heavily-tattooed', label: 'Heavily tattooed' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'piercings',
      title: '💍 Piercings',
      question: 'Piercings:',
      type: 'multi-select',
      category: 'style',
      options: [
        { value: 'none', label: 'None' },
        { value: 'ears-standard', label: 'Ears (standard lobe)' },
        { value: 'ears-multiple', label: 'Ears (multiple/cartilage)' },
        { value: 'nose', label: 'Nose' },
        { value: 'eyebrow', label: 'Eyebrow' },
        { value: 'lip-tongue', label: 'Lip/tongue' },
        { value: 'other-visible', label: 'Other visible piercings' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'nose-piercing-type',
      title: '💎 Nose Piercing Type',
      question: 'If nose piercing, which type:',
      type: 'single-select',
      category: 'style',
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
      id: 'style-fashion',
      title: '👔 Fashion Style',
      question: 'Typical fashion/clothing style:',
      type: 'multi-select',
      category: 'style',
      options: [
        { value: 'casual-relaxed', label: 'Casual/Relaxed', desc: 'Jeans, t-shirts, comfortable' },
        { value: 'sporty-athletic', label: 'Sporty/Athletic', desc: 'Activewear, athleisure' },
        { value: 'business-professional', label: 'Business/Professional', desc: 'Suits, formal' },
        { value: 'trendy-fashionable', label: 'Trendy/Fashionable', desc: 'Following current trends' },
        { value: 'classic-timeless', label: 'Classic/Timeless', desc: 'Traditional, elegant' },
        { value: 'bohemian-artsy', label: 'Bohemian/Artsy', desc: 'Creative, eclectic' },
        { value: 'edgy-alternative', label: 'Edgy/Alternative', desc: 'Dark, punk, goth' },
        { value: 'preppy-clean', label: 'Preppy/Clean', desc: 'Neat, polished' },
        { value: 'streetwear', label: 'Streetwear', desc: 'Urban, hip-hop inspired' },
        { value: 'minimalist', label: 'Minimalist', desc: 'Simple, neutral' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'portrait-attire',
      title: '👗 Portrait Attire',
      question: 'For Baby Nano portrait, preferred outfit:',
      type: 'single-select',
      category: 'style',
      options: [
        { value: 'casual-everyday', label: 'Casual Everyday', desc: 'Jeans & t-shirt/blouse' },
        { value: 'business-formal', label: 'Business Formal', desc: 'Suit, dress shirt, professional' },
        { value: 'sporty-athletic', label: 'Sporty/Athletic', desc: 'Baseball jersey, athletic wear' },
        { value: 'swimwear-beach', label: 'Swimwear/Beach', desc: 'Bikini, swim trunks, beach attire' },
        { value: 'western-cowboy', label: 'Western/Cowboy', desc: 'Boots, hat, western style' },
        { value: 'traditional-chinese', label: 'Traditional Chinese', desc: 'Qipao, Tang suit, hanfu' },
        { value: 'formal-gown', label: 'Formal Gown/Dress', desc: 'Evening wear, wedding dress' },
        { value: 'wedding-attire', label: 'Wedding Attire', desc: 'Bride/groom formal wedding outfit' },
        { value: 'ethnic-traditional', label: 'Ethnic/Traditional', desc: 'Cultural traditional wear' },
        { value: 'costume-themed', label: 'Costume/Themed', desc: 'Specific character or theme' }
      ]
    },
    {
      id: 'accessories',
      title: '💼 Accessories',
      question: 'Key accessories for portrait:',
      type: 'multi-select',
      category: 'style',
      options: [
        { value: 'none', label: 'None' },
        { value: 'watch', label: 'Watch' },
        { value: 'jewelry-minimal', label: 'Jewelry (minimal - rings, necklace)' },
        { value: 'jewelry-statement', label: 'Jewelry (statement pieces)' },
        { value: 'hat-cap', label: 'Hat/Cap' },
        { value: 'sunglasses', label: 'Sunglasses' },
        { value: 'scarf', label: 'Scarf' },
        { value: 'bag-purse', label: 'Bag/Purse' },
        { value: 'belt-statement', label: 'Statement Belt' },
        { value: 'tie-bowtie', label: 'Tie/Bow Tie' },
        { value: 'gloves', label: 'Gloves' },
        { value: 'headband-hairpiece', label: 'Headband/Hair Piece' }
      ]
    },
    {
      id: 'custom-prompt',
      title: '✨ Custom Details',
      question: 'Additional details for Baby Nano (optional):',
      type: 'text-area',
      category: 'custom',
      placeholder: 'Example: "Standing in front of sunset", "Holding a bouquet", "With a golden retriever", "Smiling with dimples showing", "In a romantic pose", etc.\n\nBe specific about:\n- Pose/expression\n- Background/setting\n- Props/items held\n- Mood/atmosphere\n- Specific details to emphasize'
    }
  ];

  const handleAnswer = (column, value) => {
    setResponses(prev => ({
      ...prev,
      [column]: {
        ...prev[column],
        [sections[currentSection].id]: value
      }
    }));
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      // Complete!
      onComplete(responses);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const section = sections[currentSection];
  const progress = ((currentSection + 1) / sections.length) * 100;

  // Check if both columns answered for current section (text-area is optional)
  const bothAnswered = section.type === 'text-area' 
    ? true // Custom prompt is optional, always allow next
    : responses.me[section.id] && responses.idealType[section.id];

  return (
    <div className="physical-layer-assessment">
      
      {/* Header */}
      <div className="assessment-header">
        <h2>🎨 What's My Type Playground</h2>
        <p className="subtitle">Build yourself AND your ideal type - like LEGO! ✨</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="progress-text">
          {currentSection + 1} of {sections.length} • {section.title}
        </div>
      </div>

      {/* Fun Message */}
      <div className="fun-message">
        <p>🎭 Luna will impersonate your ideal type!</p>
        <p>🎨 Baby Nano will create your couple portrait with perfect height differences!</p>
      </div>

      {/* Two-Column Layout */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="two-column-container"
        >
          <div className="question-title">
            <h3>{section.question}</h3>
          </div>

          <div className="columns">
            {/* LEFT COLUMN - ME */}
            <div className="column me-column">
              <div className="column-header">
                <h4>ME</h4>
                <span className="column-icon">🙋</span>
              </div>

              {section.type === 'height-input' ? (
                <HeightInput
                  value={responses.me[section.id]}
                  onChange={(val) => handleAnswer('me', val)}
                />
              ) : section.type === 'text-area' ? (
                <textarea
                  className="custom-prompt-textarea"
                  placeholder={section.placeholder}
                  value={responses.me[section.id] || ''}
                  onChange={(e) => handleAnswer('me', e.target.value)}
                  rows={6}
                />
              ) : section.type === 'single-select' ? (
                <div className="options-list">
                  {section.options?.map((option, idx) => (
                    <button
                      key={idx}
                      className={`option-button ${responses.me[section.id] === option.value ? 'selected' : ''}`}
                      onClick={() => handleAnswer('me', option.value)}
                    >
                      <span className="option-label">{option.label}</span>
                      {option.desc && <span className="option-desc">{option.desc}</span>}
                    </button>
                  ))}
                </div>
              ) : section.type === 'multi-select' ? (
                <div className="options-list">
                  {section.options?.map((option, idx) => {
                    const currentSelections = responses.me[section.id] || [];
                    const isSelected = currentSelections.includes(option.value);
                    
                    return (
                      <button
                        key={idx}
                        className={`option-button multi ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          const newSelections = isSelected
                            ? currentSelections.filter(v => v !== option.value)
                            : [...currentSelections, option.value];
                          handleAnswer('me', newSelections);
                        }}
                      >
                        <span className="checkbox">{isSelected ? '✓' : ''}</span>
                        <span className="option-label">{option.label}</span>
                        {option.desc && <span className="option-desc">{option.desc}</span>}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>

            {/* RIGHT COLUMN - IDEAL TYPE */}
            <div className="column ideal-column">
              <div className="column-header">
                <h4>IDEAL TYPE</h4>
                <span className="column-icon">💝</span>
              </div>

              {section.type === 'height-input' ? (
                <HeightInput
                  value={responses.idealType[section.id]}
                  onChange={(val) => handleAnswer('idealType', val)}
                />
              ) : section.type === 'text-area' ? (
                <textarea
                  className="custom-prompt-textarea"
                  placeholder={section.placeholder}
                  value={responses.idealType[section.id] || ''}
                  onChange={(e) => handleAnswer('idealType', e.target.value)}
                  rows={6}
                />
              ) : section.type === 'single-select' ? (
                <div className="options-list">
                  {section.options?.map((option, idx) => (
                    <button
                      key={idx}
                      className={`option-button ${responses.idealType[section.id] === option.value ? 'selected' : ''}`}
                      onClick={() => handleAnswer('idealType', option.value)}
                    >
                      <span className="option-label">{option.label}</span>
                      {option.desc && <span className="option-desc">{option.desc}</span>}
                    </button>
                  ))}
                </div>
              ) : section.type === 'multi-select' ? (
                <div className="options-list">
                  {section.options?.map((option, idx) => {
                    const currentSelections = responses.idealType[section.id] || [];
                    const isSelected = currentSelections.includes(option.value);
                    
                    return (
                      <button
                        key={idx}
                        className={`option-button multi ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          const newSelections = isSelected
                            ? currentSelections.filter(v => v !== option.value)
                            : [...currentSelections, option.value];
                          handleAnswer('idealType', newSelections);
                        }}
                      >
                        <span className="checkbox">{isSelected ? '✓' : ''}</span>
                        <span className="option-label">{option.label}</span>
                        {option.desc && <span className="option-desc">{option.desc}</span>}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
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

        <div className="nav-info">
          {!bothAnswered && (
            <span className="reminder">Answer both columns to continue</span>
          )}
        </div>

        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={!bothAnswered}
        >
          {currentSection === sections.length - 1 ? 'Complete ✨' : 'Next →'}
        </button>
      </div>

    </div>
  );
}

// Height Input Component
function HeightInput({ value, onChange }) {
  const [feet, setFeet] = useState(value?.feet || 5);
  const [inches, setInches] = useState(value?.inches || 8);

  const handleChange = (newFeet, newInches) => {
    setFeet(newFeet);
    setInches(newInches);
    
    const totalInches = (newFeet * 12) + newInches;
    const cm = Math.round(totalInches * 2.54);
    
    onChange({
      feet: newFeet,
      inches: newInches,
      totalInches,
      cm,
      display: `${newFeet}'${newInches}" (${cm}cm)`
    });
  };

  return (
    <div className="height-input">
      <div className="height-sliders">
        <div className="slider-group">
          <label>Feet: {feet}'</label>
          <input
            type="range"
            min="4"
            max="7"
            value={feet}
            onChange={(e) => handleChange(parseInt(e.target.value), inches)}
            className="slider"
          />
        </div>
        <div className="slider-group">
          <label>Inches: {inches}"</label>
          <input
            type="range"
            min="0"
            max="11"
            value={inches}
            onChange={(e) => handleChange(feet, parseInt(e.target.value))}
            className="slider"
          />
        </div>
      </div>
      <div className="height-display">
        {feet}'{inches}" ({Math.round(((feet * 12) + inches) * 2.54)}cm)
      </div>
    </div>
  );
}
