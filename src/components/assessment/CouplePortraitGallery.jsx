/**
 * CouplePortraitGallery.jsx
 * "What's My Type Playground" - Couple Portrait Generation
 *
 * Allows users to generate romantic couple portraits using AI (Baby Nano/Gemini)
 * based on their Physical Layer Assessment responses.
 *
 * Features:
 * - Scene preset selection (8 romantic scenes)
 * - Custom prompt modification
 * - Portrait generation with loading states
 * - Gallery of generated portraits
 * - Save to Firebase Storage
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  generateCouplePortrait,
  buildCouplePortraitPrompt,
  buildPromptWithScene,
  SCENE_PRESETS,
  buildSoulPassport,
  soulPassportToMarkdown,
  buildSceneExport,
  buildFullPromptExport,
  getBaziLightingPreset
} from '../../services/couplePortraitService';
import './CouplePortraitGallery.css';

export function CouplePortraitGallery({ physicalLayer, profileData = {}, onComplete, onBack }) {
  const [selectedScene, setSelectedScene] = useState(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [error, setError] = useState(null);
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [generationProgress, setGenerationProgress] = useState('');
  const [proMode, setProMode] = useState(false); // Pro 4K mode toggle
  const [showExportPanel, setShowExportPanel] = useState(false); // Export panel toggle

  // Build the base prompt when physical layer data is available
  const basePrompt = physicalLayer ? buildCouplePortraitPrompt(physicalLayer) : null;

  // Get BaZi lighting preset based on profile data
  const baziLighting = profileData?.baziChart?.dayMasterElement
    ? getBaziLightingPreset(profileData.baziChart.dayMasterElement)
    : null;

  // Generate preview prompt based on selection
  const getPreviewPrompt = useCallback(() => {
    if (customPrompt) return customPrompt;
    if (selectedScene) return buildPromptWithScene(physicalLayer, selectedScene);
    return basePrompt;
  }, [customPrompt, selectedScene, physicalLayer, basePrompt]);

  // Handle scene selection
  const handleSceneSelect = (sceneKey) => {
    setSelectedScene(sceneKey === selectedScene ? null : sceneKey);
    setError(null);
  };

  // Generate portrait
  const handleGenerate = async () => {
    if (!physicalLayer || (!selectedScene && !customPrompt)) {
      setError('Please select a scene or enter a custom prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);
    const modeLabel = proMode ? 'Nano Banana PRO 4K' : 'Baby Nano';
    setGenerationProgress(`Connecting to ${modeLabel}...`);

    try {
      setGenerationProgress(proMode ? 'Crafting your 4K portrait...' : 'Crafting your romantic portrait...');

      const result = await generateCouplePortrait(
        physicalLayer,
        selectedScene,
        customPrompt || null,
        proMode
      );

      if (result.success && result.imageData) {
        setGenerationProgress('Portrait complete!');

        const newImage = {
          id: Date.now(),
          imageData: result.imageData,
          prompt: result.prompt,
          sceneKey: selectedScene,
          model: result.model,
          proMode: result.proMode || proMode,
          createdAt: new Date().toISOString()
        };

        setGeneratedImages(prev => [newImage, ...prev]);
        setError(null);
      } else {
        setError(result.error || 'Failed to generate portrait');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
      setGenerationProgress('');
    }
  };

  // Download image
  const handleDownload = (image) => {
    const link = document.createElement('a');
    link.href = `data:${image.imageData.mimeType};base64,${image.imageData.data}`;
    link.download = `couple-portrait-${image.sceneKey || 'custom'}-${image.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ============================================
  // UNIFIED EXPORT SYSTEM (8 Export Options)
  // ============================================

  // Helper to download file
  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  // 1. Export My Soul Passport (JSON)
  const handleExportMeJSON = () => {
    if (!physicalLayer?.me) return;
    const passport = buildSoulPassport(physicalLayer.me, profileData);
    downloadFile(
      JSON.stringify(passport, null, 2),
      `my-soul-passport-${Date.now()}.json`,
      'application/json'
    );
  };

  // 2. Export My Soul Passport (Markdown)
  const handleExportMeMD = () => {
    if (!physicalLayer?.me) return;
    const passport = buildSoulPassport(physicalLayer.me, profileData);
    const markdown = soulPassportToMarkdown(passport, 'My Soul Passport');
    downloadFile(
      markdown,
      `my-soul-passport-${Date.now()}.md`,
      'text/markdown'
    );
  };

  // 3. Export Ideal Partner Soul Passport (JSON)
  const handleExportPartnerJSON = () => {
    if (!physicalLayer?.idealType) return;
    const passport = buildSoulPassport(physicalLayer.idealType, {});
    downloadFile(
      JSON.stringify(passport, null, 2),
      `ideal-partner-passport-${Date.now()}.json`,
      'application/json'
    );
  };

  // 4. Export Ideal Partner Soul Passport (Markdown)
  const handleExportPartnerMD = () => {
    if (!physicalLayer?.idealType) return;
    const passport = buildSoulPassport(physicalLayer.idealType, {});
    const markdown = soulPassportToMarkdown(passport, 'Ideal Partner Soul Passport');
    downloadFile(
      markdown,
      `ideal-partner-passport-${Date.now()}.md`,
      'text/markdown'
    );
  };

  // 5. Export Scene/Background (JSON)
  const handleExportSceneJSON = () => {
    const sceneExport = buildSceneExport(selectedScene, physicalLayer?.me?.customDetails, baziLighting);
    downloadFile(
      JSON.stringify(sceneExport, null, 2),
      `portrait-scene-${Date.now()}.json`,
      'application/json'
    );
  };

  // 6. Export Scene/Background (Markdown)
  const handleExportSceneMD = () => {
    const sceneExport = buildSceneExport(selectedScene, physicalLayer?.me?.customDetails, baziLighting);
    let md = `# Portrait Scene Configuration\n\n`;
    md += `**Exported:** ${new Date().toLocaleString()}\n\n`;
    md += `---\n\n`;
    md += `## Scene Details\n\n`;
    md += `- **Scene Key:** ${sceneExport.sceneKey}\n`;
    md += `- **Scene Name:** ${sceneExport.sceneName}\n`;
    md += `- **Scene Icon:** ${sceneExport.sceneIcon}\n`;
    md += `- **Scene Prompt:** ${sceneExport.scenePrompt}\n`;
    md += `- **Scene Style:** ${sceneExport.sceneStyle}\n`;
    if (sceneExport.customDetails) {
      md += `- **Custom Details:** ${sceneExport.customDetails}\n`;
    }
    md += `\n`;
    if (sceneExport.baziLighting) {
      md += `## BaZi-Informed Lighting\n\n`;
      md += `- **Element:** ${sceneExport.baziLighting.element}\n`;
      md += `- **Color Palette:** ${sceneExport.baziLighting.colorPalette.join(', ')}\n`;
      md += `- **Lighting Style:** ${sceneExport.baziLighting.lighting}\n`;
      md += `- **Mood:** ${sceneExport.baziLighting.mood}\n`;
      md += `\n`;
    }
    downloadFile(
      md,
      `portrait-scene-${Date.now()}.md`,
      'text/markdown'
    );
  };

  // 7. Export Full Prompt (JSON) - What gets sent to Baby Nano
  const handleExportFullPromptJSON = () => {
    const fullExport = buildFullPromptExport(physicalLayer, selectedScene, customPrompt, profileData, proMode);
    downloadFile(
      JSON.stringify(fullExport, null, 2),
      `full-portrait-prompt-${Date.now()}.json`,
      'application/json'
    );
  };

  // 8. Export Full Prompt (Markdown) - Human-readable combined export
  const handleExportFullPromptMD = () => {
    const fullExport = buildFullPromptExport(physicalLayer, selectedScene, customPrompt, profileData, proMode);
    let md = `# Full Couple Portrait Prompt\n\n`;
    md += `**Exported:** ${new Date().toLocaleString()}\n`;
    md += `**Mode:** ${fullExport.proMode ? 'PRO 4K' : 'Standard'}\n`;
    md += `**Model:** ${fullExport.model}\n`;
    md += `**Prompt Length:** ${fullExport.promptLength} characters\n\n`;
    md += `---\n\n`;

    md += `## Combined Prompt (Sent to Baby Nano)\n\n`;
    md += `\`\`\`\n${fullExport.prompt}\n\`\`\`\n\n`;

    md += `---\n\n`;
    md += `## Person 1 (Me)\n\n`;
    md += soulPassportToMarkdown(fullExport.person1, 'Person 1 Soul Passport').replace('# Person 1 Soul Passport\n\n', '');

    md += `---\n\n`;
    md += `## Person 2 (Ideal Partner)\n\n`;
    md += soulPassportToMarkdown(fullExport.person2, 'Person 2 Soul Passport').replace('# Person 2 Soul Passport\n\n', '');

    md += `---\n\n`;
    md += `## Scene Configuration\n\n`;
    md += `- **Scene:** ${fullExport.scene.sceneName} ${fullExport.scene.sceneIcon}\n`;
    md += `- **Style:** ${fullExport.scene.sceneStyle}\n`;
    if (fullExport.baziEnhancement.applied) {
      md += `\n### BaZi Enhancement Applied\n\n`;
      md += `- **Element:** ${fullExport.baziEnhancement.element}\n`;
      md += `- **Lighting:** ${fullExport.baziEnhancement.lightingStyle}\n`;
      md += `- **Colors:** ${fullExport.baziEnhancement.colorPalette.join(', ')}\n`;
    }

    downloadFile(
      md,
      `full-portrait-prompt-${Date.now()}.md`,
      'text/markdown'
    );
  };

  // Check if we have valid physical layer data
  const hasValidData = physicalLayer && physicalLayer.me && physicalLayer.idealType;

  if (!hasValidData) {
    return (
      <div className="couple-portrait-gallery">
        <div className="no-data-message">
          <span className="no-data-icon">🎨</span>
          <h3>Complete Physical Layer First</h3>
          <p>Please complete the Physical Layer Assessment to generate couple portraits.</p>
          <button className="btn-primary" onClick={onBack}>
            Go to Physical Layer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="couple-portrait-gallery">
      {/* Header */}
      <div className="gallery-header">
        <h2>Create Your Couple Portrait</h2>
        <p className="subtitle">
          Baby Nano will bring your dream couple to life
        </p>
      </div>

      {/* Scene Selection */}
      <div className="scene-selection">
        <h3>Choose a Scene</h3>
        <p className="section-hint">Select a romantic setting for your portrait</p>

        <div className="scene-grid">
          {Object.entries(SCENE_PRESETS).map(([key, scene]) => (
            <button
              key={key}
              className={`scene-card ${selectedScene === key ? 'selected' : ''}`}
              onClick={() => handleSceneSelect(key)}
              disabled={isGenerating}
            >
              <span className="scene-icon">{scene.icon}</span>
              <span className="scene-name">{scene.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Editor Toggle */}
      <div className="prompt-section">
        <button
          className="toggle-prompt-btn"
          onClick={() => setShowPromptEditor(!showPromptEditor)}
        >
          {showPromptEditor ? '▼ Hide Custom Prompt' : '▶ Customize Prompt'}
        </button>

        {showPromptEditor && (
          <div className="prompt-editor">
            <textarea
              value={customPrompt || getPreviewPrompt() || ''}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Enter your custom prompt for the portrait..."
              rows={6}
              disabled={isGenerating}
            />
            <div className="prompt-actions">
              <button
                className="btn-secondary btn-small"
                onClick={() => setCustomPrompt('')}
                disabled={isGenerating || !customPrompt}
              >
                Reset
              </button>
              <span className="char-count">
                {(customPrompt || getPreviewPrompt() || '').length} characters
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Pro Mode Toggle */}
      <div className="pro-mode-section">
        <label className="pro-mode-toggle">
          <input
            type="checkbox"
            checked={proMode}
            onChange={(e) => setProMode(e.target.checked)}
            disabled={isGenerating}
          />
          <span className="toggle-slider"></span>
          <span className="toggle-label">
            {proMode ? '🚀 PRO 4K Mode' : '⚡ Standard Mode'}
          </span>
        </label>
        <p className="pro-mode-hint">
          {proMode
            ? 'Higher resolution, ultra-detailed (gemini-3-pro-image-preview)'
            : 'Fast generation, good quality (gemini-2.0-flash-exp)'}
        </p>
      </div>

      {/* Generate Button */}
      <div className="generate-section">
        <button
          className="btn-generate"
          onClick={handleGenerate}
          disabled={isGenerating || (!selectedScene && !customPrompt)}
        >
          {isGenerating ? (
            <>
              <span className="spinner"></span>
              {generationProgress}
            </>
          ) : (
            <>
              <span className="generate-icon">✨</span>
              Generate Portrait
            </>
          )}
        </button>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
      </div>

      {/* Export Panel - 8 Export Options */}
      <div className="export-panel">
        <button
          className="toggle-export-btn"
          onClick={() => setShowExportPanel(!showExportPanel)}
        >
          {showExportPanel ? '▼ Hide Export Options' : '▶ Export Soul Passports & Prompts'}
        </button>

        {showExportPanel && (
          <div className="export-grid">
            {/* Row 1: Person Exports */}
            <div className="export-row">
              <div className="export-category">
                <h4>👤 My Soul Passport</h4>
                <div className="export-buttons">
                  <button
                    className="btn-export-small"
                    onClick={handleExportMeJSON}
                    disabled={!physicalLayer?.me}
                  >
                    📄 JSON
                  </button>
                  <button
                    className="btn-export-small"
                    onClick={handleExportMeMD}
                    disabled={!physicalLayer?.me}
                  >
                    📝 Markdown
                  </button>
                </div>
              </div>

              <div className="export-category">
                <h4>💝 Ideal Partner Passport</h4>
                <div className="export-buttons">
                  <button
                    className="btn-export-small"
                    onClick={handleExportPartnerJSON}
                    disabled={!physicalLayer?.idealType}
                  >
                    📄 JSON
                  </button>
                  <button
                    className="btn-export-small"
                    onClick={handleExportPartnerMD}
                    disabled={!physicalLayer?.idealType}
                  >
                    📝 Markdown
                  </button>
                </div>
              </div>
            </div>

            {/* Row 2: Scene & Full Prompt Exports */}
            <div className="export-row">
              <div className="export-category">
                <h4>🎬 Scene / Background</h4>
                <div className="export-buttons">
                  <button
                    className="btn-export-small"
                    onClick={handleExportSceneJSON}
                  >
                    📄 JSON
                  </button>
                  <button
                    className="btn-export-small"
                    onClick={handleExportSceneMD}
                  >
                    📝 Markdown
                  </button>
                </div>
              </div>

              <div className="export-category">
                <h4>🚀 Full Prompt to Baby Nano</h4>
                <div className="export-buttons">
                  <button
                    className="btn-export-small btn-highlight"
                    onClick={handleExportFullPromptJSON}
                    disabled={!physicalLayer?.me || !physicalLayer?.idealType}
                  >
                    📄 JSON
                  </button>
                  <button
                    className="btn-export-small btn-highlight"
                    onClick={handleExportFullPromptMD}
                    disabled={!physicalLayer?.me || !physicalLayer?.idealType}
                  >
                    📝 Markdown
                  </button>
                </div>
              </div>
            </div>

            {/* BaZi Lighting Info */}
            {baziLighting && (
              <div className="bazi-lighting-info">
                <span className="bazi-badge">
                  🔮 BaZi {baziLighting.element} Lighting Applied
                </span>
                <span className="bazi-colors">
                  {baziLighting.colorPalette.slice(0, 3).join(' • ')}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Generated Images Gallery */}
      {generatedImages.length > 0 && (
        <div className="generated-gallery">
          <h3>Your Portraits</h3>

          <div className="images-grid">
            {generatedImages.map((image) => (
              <div key={image.id} className="image-card">
                <div className="image-container">
                  <img
                    src={`data:${image.imageData.mimeType};base64,${image.imageData.data}`}
                    alt="Couple Portrait"
                  />
                  <div className="image-overlay">
                    <button
                      className="btn-icon"
                      onClick={() => handleDownload(image)}
                      title="Download"
                    >
                      💾
                    </button>
                  </div>
                </div>
                <div className="image-meta">
                  <span className="scene-badge">
                    {image.sceneKey ? SCENE_PRESETS[image.sceneKey]?.icon : '🎨'}
                    {image.sceneKey ? SCENE_PRESETS[image.sceneKey]?.name : 'Custom'}
                  </span>
                  <span className="model-badge">{image.model}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="tips-section">
        <h4>Tips for Great Portraits</h4>
        <ul>
          <li>Try different scenes to find your favorite style</li>
          <li>Use custom prompts to add specific details</li>
          <li>Generation takes about 30-60 seconds</li>
          <li>Download and save your favorite portraits</li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="navigation">
        <button className="btn-secondary" onClick={onBack}>
          ← Back to Assessment
        </button>
        <button
          className="btn-primary"
          onClick={onComplete}
          disabled={generatedImages.length === 0}
        >
          Continue to Next Module →
        </button>
      </div>
    </div>
  );
}

export default CouplePortraitGallery;
