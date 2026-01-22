/**
 * ============================================
 * RELATIONSHIP CONSTELLATION TEMPLATE
 * Multi-relationship mapping: family, team,
 * polycule, generational arcs
 * ============================================
 */

import { KnowledgeCodex } from '../codexTypes';

/**
 * Individual in the constellation
 */
export interface ConstellationMember {
  id: string;
  name: string;
  role: string; // e.g., "Self", "Partner", "Child", "Parent", "Colleague"
  birthData?: {
    year: number;
    month: number;
    day: number;
    hour?: number;
  };
  dayMaster?: string;
  element?: string;
  codex?: KnowledgeCodex;
  position?: { x: number; y: number }; // For visual mapping
  notes?: string;
}

/**
 * Relationship link between members
 */
export interface ConstellationLink {
  id: string;
  sourceId: string;
  targetId: string;
  relationshipType: string; // e.g., "spouse", "parent-child", "sibling", "colleague"
  compatibility: {
    overall: number; // 0-100
    categories: {
      elemental: number;
      tenGods: number;
      dayMasterHarmony: number;
      timingAlignment: number;
    };
  };
  synastryNotes: string[];
  challenges: string[];
  strengths: string[];
}

/**
 * Synastry heatmap data
 */
export interface SynastryHeatmap {
  members: string[]; // member IDs in order
  matrix: number[][]; // compatibility scores matrix
  highlights: {
    strongest: { source: string; target: string; score: number };
    weakest: { source: string; target: string; score: number };
  };
}

/**
 * Composite chart data
 */
export interface CompositeChart {
  members: string[];
  combinedElements: Record<string, number>; // element percentages
  groupDynamics: string;
  collectiveStrengths: string[];
  collectiveWeaknesses: string[];
  recommendations: string[];
}

/**
 * Lifecycle phase
 */
export interface LifecyclePhase {
  period: string;
  memberPhasings: Record<string, string>; // member ID -> phase description
  groupDynamic: string;
  opportunities: string[];
  challenges: string[];
}

/**
 * Complete constellation data
 */
export interface ConstellationData {
  members: ConstellationMember[];
  links: ConstellationLink[];
  synastryHeatmap: SynastryHeatmap;
  compositeChart: CompositeChart;
  lifecyclePhases: LifecyclePhase[];
  constellationSummary: string;
}

/**
 * Calculate compatibility between two elements
 */
function calculateElementalCompatibility(element1: string, element2: string): number {
  const productiveRelations: Record<string, string> = {
    'Wood': 'Fire',
    'Fire': 'Earth',
    'Earth': 'Metal',
    'Metal': 'Water',
    'Water': 'Wood'
  };

  const controlRelations: Record<string, string> = {
    'Wood': 'Earth',
    'Fire': 'Metal',
    'Earth': 'Water',
    'Metal': 'Wood',
    'Water': 'Fire'
  };

  if (element1 === element2) return 75; // Same element: good but can be competitive
  if (productiveRelations[element1] === element2) return 90; // Producing: excellent
  if (productiveRelations[element2] === element1) return 85; // Being produced: very good
  if (controlRelations[element1] === element2) return 40; // Controlling: challenging
  if (controlRelations[element2] === element1) return 45; // Being controlled: challenging

  return 60; // Neutral
}

/**
 * Generate compatibility between two members
 */
export function calculateMemberCompatibility(
  member1: ConstellationMember,
  member2: ConstellationMember
): ConstellationLink['compatibility'] {
  const elemental = member1.element && member2.element
    ? calculateElementalCompatibility(member1.element, member2.element)
    : 50;

  // Placeholder calculations - would integrate with full BaZi synastry
  const tenGods = Math.floor(Math.random() * 30) + 50;
  const dayMasterHarmony = Math.floor(Math.random() * 30) + 50;
  const timingAlignment = Math.floor(Math.random() * 30) + 50;

  const overall = Math.round((elemental + tenGods + dayMasterHarmony + timingAlignment) / 4);

  return {
    overall,
    categories: {
      elemental,
      tenGods,
      dayMasterHarmony,
      timingAlignment
    }
  };
}

/**
 * Build synastry heatmap from members
 */
export function buildSynastryHeatmap(members: ConstellationMember[]): SynastryHeatmap {
  const memberIds = members.map(m => m.id);
  const matrix: number[][] = [];

  let strongest = { source: '', target: '', score: 0 };
  let weakest = { source: '', target: '', score: 100 };

  for (let i = 0; i < members.length; i++) {
    matrix[i] = [];
    for (let j = 0; j < members.length; j++) {
      if (i === j) {
        matrix[i][j] = 100; // Self
      } else {
        const compat = calculateMemberCompatibility(members[i], members[j]);
        matrix[i][j] = compat.overall;

        if (compat.overall > strongest.score) {
          strongest = { source: members[i].id, target: members[j].id, score: compat.overall };
        }
        if (compat.overall < weakest.score) {
          weakest = { source: members[i].id, target: members[j].id, score: compat.overall };
        }
      }
    }
  }

  return {
    members: memberIds,
    matrix,
    highlights: { strongest, weakest }
  };
}

/**
 * Generate composite chart from members
 */
export function generateCompositeChart(members: ConstellationMember[]): CompositeChart {
  const elementCounts: Record<string, number> = {
    'Wood': 0, 'Fire': 0, 'Earth': 0, 'Metal': 0, 'Water': 0
  };

  for (const member of members) {
    if (member.element) {
      elementCounts[member.element] = (elementCounts[member.element] || 0) + 1;
    }
  }

  const total = Object.values(elementCounts).reduce((a, b) => a + b, 0);
  const percentages: Record<string, number> = {};
  for (const [elem, count] of Object.entries(elementCounts)) {
    percentages[elem] = total > 0 ? Math.round((count / total) * 100) : 0;
  }

  // Determine dominant and missing elements
  const dominant = Object.entries(percentages).sort((a, b) => b[1] - a[1])[0];
  const missing = Object.entries(percentages).filter(([_, v]) => v === 0).map(([k]) => k);

  return {
    members: members.map(m => m.id),
    combinedElements: percentages,
    groupDynamics: `This group is ${dominant[0]}-dominant (${dominant[1]}%)${missing.length > 0 ? `, lacking ${missing.join(', ')}` : ''}.`,
    collectiveStrengths: generateCollectiveStrengths(dominant[0]),
    collectiveWeaknesses: generateCollectiveWeaknesses(dominant[0], missing),
    recommendations: generateGroupRecommendations(dominant[0], missing)
  };
}

/**
 * Render Constellation Markdown
 */
export function renderConstellationMarkdown(data: ConstellationData): string {
  const lines: string[] = [];

  lines.push('# ✨ Relationship Constellation');
  lines.push('### Mapping the People Who Shape Your Fate');
  lines.push('');
  lines.push('---');
  lines.push('');

  // Summary
  lines.push('## Constellation Overview');
  lines.push(data.constellationSummary);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Members
  lines.push('## Members');
  lines.push('');
  for (const member of data.members) {
    lines.push(`### ${member.name}`);
    lines.push(`**Role:** ${member.role}`);
    if (member.dayMaster) lines.push(`**Day Master:** ${member.dayMaster}`);
    if (member.element) lines.push(`**Element:** ${member.element}`);
    if (member.notes) lines.push(`*${member.notes}*`);
    lines.push('');
  }
  lines.push('---');
  lines.push('');

  // Synastry Heatmap
  lines.push('## Synastry Heatmap');
  lines.push('');
  lines.push(`**Strongest Bond:** ${data.synastryHeatmap.highlights.strongest.source} ↔ ${data.synastryHeatmap.highlights.strongest.target} (${data.synastryHeatmap.highlights.strongest.score}%)`);
  lines.push(`**Most Challenging:** ${data.synastryHeatmap.highlights.weakest.source} ↔ ${data.synastryHeatmap.highlights.weakest.target} (${data.synastryHeatmap.highlights.weakest.score}%)`);
  lines.push('');

  // Matrix display
  const members = data.synastryHeatmap.members;
  lines.push('| | ' + members.join(' | ') + ' |');
  lines.push('|' + '---|'.repeat(members.length + 1));
  for (let i = 0; i < members.length; i++) {
    const row = data.synastryHeatmap.matrix[i].map(v => `${v}%`);
    lines.push(`| ${members[i]} | ${row.join(' | ')} |`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  // Composite Chart
  lines.push('## Composite Chart');
  lines.push('');
  lines.push('### Element Distribution');
  for (const [elem, pct] of Object.entries(data.compositeChart.combinedElements)) {
    const bar = '█'.repeat(Math.floor(pct / 10)) + '░'.repeat(10 - Math.floor(pct / 10));
    lines.push(`- ${elem}: ${bar} ${pct}%`);
  }
  lines.push('');
  lines.push(`**Group Dynamics:** ${data.compositeChart.groupDynamics}`);
  lines.push('');
  lines.push('### Collective Strengths');
  for (const strength of data.compositeChart.collectiveStrengths) {
    lines.push(`- ${strength}`);
  }
  lines.push('');
  lines.push('### Collective Weaknesses');
  for (const weakness of data.compositeChart.collectiveWeaknesses) {
    lines.push(`- ${weakness}`);
  }
  lines.push('');
  lines.push('### Recommendations');
  for (const rec of data.compositeChart.recommendations) {
    lines.push(`- ${rec}`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  // Lifecycle Phases
  lines.push('## Lifecycle Phases');
  lines.push('');
  for (const phase of data.lifecyclePhases) {
    lines.push(`### ${phase.period}`);
    lines.push(`*${phase.groupDynamic}*`);
    lines.push('');
    if (phase.opportunities.length > 0) {
      lines.push('**Opportunities:**');
      for (const opp of phase.opportunities) {
        lines.push(`- ${opp}`);
      }
    }
    if (phase.challenges.length > 0) {
      lines.push('**Challenges:**');
      for (const ch of phase.challenges) {
        lines.push(`- ${ch}`);
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Render Constellation HTML
 */
export function renderConstellationHtml(data: ConstellationData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Relationship Constellation</title>
  <style>
    body { font-family: Georgia, serif; background: #0a0a1a; color: #eee; margin: 0; padding: 20px; }
    .constellation { max-width: 1400px; margin: 0 auto; }
    h1 { text-align: center; color: #c9a227; font-size: 36px; }
    .subtitle { text-align: center; color: #999; margin-bottom: 30px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .panel { background: #16213e; border-radius: 8px; padding: 20px; }
    .panel h2 { color: #c9a227; margin-top: 0; }
    .canvas-container { background: #0f0f2a; border-radius: 8px; padding: 20px; text-align: center; }
    canvas { max-width: 100%; }
    .member-card { background: #0f3460; padding: 15px; border-radius: 8px; margin-bottom: 10px; }
    .member-name { font-size: 18px; color: #c9a227; }
    .member-role { color: #999; font-size: 14px; }
    .heatmap-cell { display: inline-block; width: 40px; height: 40px; line-height: 40px; text-align: center; margin: 2px; border-radius: 4px; font-size: 12px; }
    .element-bar { height: 20px; border-radius: 4px; margin: 5px 0; }
    .phase-card { border-left: 3px solid #c9a227; padding-left: 15px; margin-bottom: 15px; }
  </style>
</head>
<body>
  <div class="constellation">
    <h1>✨ Relationship Constellation</h1>
    <p class="subtitle">Mapping the People Who Shape Your Fate</p>

    <div class="canvas-container">
      <canvas id="constellation-canvas" width="600" height="400"></canvas>
      <p style="color: #666; font-size: 12px;">Visual constellation map</p>
    </div>

    <div class="grid" style="margin-top: 20px;">
      <div class="panel">
        <h2>Members</h2>
        ${data.members.map(m => `
          <div class="member-card">
            <div class="member-name">${m.name}</div>
            <div class="member-role">${m.role}</div>
            ${m.element ? `<div style="margin-top: 5px;">Element: <span style="color: ${getElementColor(m.element)}">${m.element}</span></div>` : ''}
          </div>
        `).join('')}
      </div>

      <div class="panel">
        <h2>Synastry Highlights</h2>
        <div style="margin-bottom: 15px;">
          <strong style="color: #2ecc71;">Strongest Bond:</strong><br>
          ${data.synastryHeatmap.highlights.strongest.source} ↔ ${data.synastryHeatmap.highlights.strongest.target}
          <span style="float: right; color: #2ecc71;">${data.synastryHeatmap.highlights.strongest.score}%</span>
        </div>
        <div>
          <strong style="color: #e74c3c;">Most Challenging:</strong><br>
          ${data.synastryHeatmap.highlights.weakest.source} ↔ ${data.synastryHeatmap.highlights.weakest.target}
          <span style="float: right; color: #e74c3c;">${data.synastryHeatmap.highlights.weakest.score}%</span>
        </div>
      </div>

      <div class="panel">
        <h2>Composite Elements</h2>
        ${Object.entries(data.compositeChart.combinedElements).map(([elem, pct]) => `
          <div style="margin-bottom: 10px;">
            <span style="color: ${getElementColor(elem)}">${elem}</span>
            <span style="float: right;">${pct}%</span>
            <div class="element-bar" style="background: linear-gradient(90deg, ${getElementColor(elem)} ${pct}%, #0a0a1a ${pct}%)"></div>
          </div>
        `).join('')}
        <p style="color: #999; font-size: 14px; margin-top: 15px;">${data.compositeChart.groupDynamics}</p>
      </div>

      <div class="panel">
        <h2>Lifecycle Phases</h2>
        ${data.lifecyclePhases.map(phase => `
          <div class="phase-card">
            <strong>${phase.period}</strong>
            <p style="color: #999; font-size: 14px;">${phase.groupDynamic}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </div>

  <script>
    // Constellation visualization
    const canvas = document.getElementById('constellation-canvas');
    const ctx = canvas.getContext('2d');
    const members = ${JSON.stringify(data.members)};
    const links = ${JSON.stringify(data.links)};

    // Draw constellation
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150;

    // Position members in a circle
    members.forEach((m, i) => {
      const angle = (i / members.length) * Math.PI * 2 - Math.PI / 2;
      m.position = {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      };
    });

    // Draw links
    ctx.strokeStyle = '#c9a22744';
    ctx.lineWidth = 1;
    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        ctx.beginPath();
        ctx.moveTo(members[i].position.x, members[i].position.y);
        ctx.lineTo(members[j].position.x, members[j].position.y);
        ctx.stroke();
      }
    }

    // Draw members
    members.forEach(m => {
      ctx.beginPath();
      ctx.arc(m.position.x, m.position.y, 25, 0, Math.PI * 2);
      ctx.fillStyle = '#c9a227';
      ctx.fill();

      ctx.fillStyle = '#1a1a2e';
      ctx.font = '12px Georgia';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(m.name.charAt(0), m.position.x, m.position.y);

      ctx.fillStyle = '#eee';
      ctx.font = '11px Georgia';
      ctx.fillText(m.name, m.position.x, m.position.y + 38);
    });
  </script>
</body>
</html>`;
}

// ==================== HELPER FUNCTIONS ====================

function getElementColor(element: string): string {
  const colors: Record<string, string> = {
    'Wood': '#27ae60',
    'Fire': '#e74c3c',
    'Earth': '#f39c12',
    'Metal': '#bdc3c7',
    'Water': '#3498db'
  };
  return colors[element] || '#c9a227';
}

function generateCollectiveStrengths(dominantElement: string): string[] {
  const strengths: Record<string, string[]> = {
    'Wood': ['Growth mindset', 'Initiative and drive', 'Adaptability'],
    'Fire': ['Passion and enthusiasm', 'Visibility and influence', 'Creative energy'],
    'Earth': ['Stability and reliability', 'Practicality', 'Nurturing nature'],
    'Metal': ['Precision and quality', 'Structure and discipline', 'Clarity of purpose'],
    'Water': ['Wisdom and depth', 'Flexibility', 'Emotional intelligence']
  };
  return strengths[dominantElement] || ['Diverse perspectives'];
}

function generateCollectiveWeaknesses(dominantElement: string, missing: string[]): string[] {
  const weaknesses: string[] = [];

  if (dominantElement === 'Wood') weaknesses.push('May lack follow-through');
  if (dominantElement === 'Fire') weaknesses.push('May burn out or scatter energy');
  if (dominantElement === 'Earth') weaknesses.push('May resist necessary change');
  if (dominantElement === 'Metal') weaknesses.push('May be overly rigid');
  if (dominantElement === 'Water') weaknesses.push('May lack decisive action');

  for (const elem of missing) {
    weaknesses.push(`Missing ${elem} energy — ${getMissingElementNote(elem)}`);
  }

  return weaknesses;
}

function getMissingElementNote(element: string): string {
  const notes: Record<string, string> = {
    'Wood': 'needs more initiative and growth',
    'Fire': 'needs more passion and visibility',
    'Earth': 'needs more grounding and stability',
    'Metal': 'needs more structure and precision',
    'Water': 'needs more wisdom and flexibility'
  };
  return notes[element] || 'needs balance';
}

function generateGroupRecommendations(dominantElement: string, missing: string[]): string[] {
  const recs: string[] = [];

  recs.push(`Leverage your ${dominantElement} strengths together`);

  for (const elem of missing.slice(0, 2)) {
    recs.push(`Bring in ${elem} energy through activities or new members`);
  }

  recs.push('Schedule regular alignment check-ins');
  recs.push('Use timing windows that favor the group\'s dominant element');

  return recs;
}

export {
  calculateElementalCompatibility,
  calculateMemberCompatibility,
  buildSynastryHeatmap,
  generateCompositeChart
};
