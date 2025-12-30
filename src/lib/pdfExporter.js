/**
 * PDF Export for Conversation Analysis
 * Exports detailed GENESIS analysis to PDF
 *
 * Note: Requires jspdf and jspdf-autotable packages
 * Install with: npm install jspdf jspdf-autotable
 */

export class PDFExporter {
  constructor() {
    this.doc = null;
  }

  /**
   * Export conversation analysis to PDF
   */
  async export(analysis, conversationData, reflection = null) {
    try {
      // Dynamic import of jsPDF
      const jsPDFModule = await import('jspdf');
      const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF;

      // Import autotable plugin
      await import('jspdf-autotable');

      this.doc = new jsPDF();
      let yPos = 20;

      // Title
      this.doc.setFontSize(20);
      this.doc.setTextColor(59, 130, 246);
      this.doc.text('GENESIS Conversation Analysis Report', 20, yPos);
      yPos += 10;

      // Timestamp
      this.doc.setFontSize(10);
      this.doc.setTextColor(100, 100, 100);
      this.doc.text(`Generated: ${new Date().toLocaleString()}`, 20, yPos);
      yPos += 15;

      // Summary Section
      yPos = this.addSummarySection(analysis, yPos);

      // Message Details
      yPos = this.addMessageDetails(conversationData, yPos);

      // Pattern Analysis
      yPos = this.addPatternAnalysis(conversationData, yPos);

      // Recommendations
      yPos = this.addRecommendations(conversationData, yPos);

      // AI Reflection (if available)
      if (reflection) {
        yPos = this.addReflectionSection(reflection, yPos);
      }

      // Save
      this.doc.save(`genesis-analysis-${Date.now()}.pdf`);
    } catch (error) {
      console.error('PDF export error:', error);
      // Fallback: export as JSON
      this.exportAsJSON(analysis, conversationData, reflection);
    }
  }

  addSummarySection(analysis, yPos) {
    if (yPos > 250) {
      this.doc.addPage();
      yPos = 20;
    }

    this.doc.setFontSize(14);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text('Conversation Summary', 20, yPos);
    yPos += 10;

    const summaryData = [
      ['Total Messages', analysis.messages.length.toString()],
      ['Dominant Archetype', analysis.dominantArchetype],
      ['Emotional Journey', analysis.emotionalJourney],
      ['Crisis Indicators', analysis.crisisCount > 0 ? `${analysis.crisisCount} detected` : 'None'],
      ['Key Patterns', analysis.keyPatterns.join(', ') || 'None']
    ];

    this.doc.autoTable({
      startY: yPos,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 20 }
    });

    return this.doc.lastAutoTable.finalY + 15;
  }

  addMessageDetails(conversationData, yPos) {
    if (yPos > 250) {
      this.doc.addPage();
      yPos = 20;
    }

    this.doc.setFontSize(14);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text('Message Analysis', 20, yPos);
    yPos += 10;

    const userMessages = conversationData.filter(m => m.speaker === 'user' && m.analyzed);

    const messageData = userMessages.map((msg, i) => [
      `#${i + 1}`,
      msg.archetype.type,
      `${(msg.archetype.confidence * 100).toFixed(0)}%`,
      msg.congruence.level,
      msg.congruence.advancedPatterns?.map(p => p.pattern).join(', ') || '-'
    ]);

    this.doc.autoTable({
      startY: yPos,
      head: [['#', 'Archetype', 'Confidence', 'Congruence', 'Patterns']],
      body: messageData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 20, right: 20 },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 'auto' }
      }
    });

    return this.doc.lastAutoTable.finalY + 15;
  }

  addPatternAnalysis(conversationData, yPos) {
    if (yPos > 250) {
      this.doc.addPage();
      yPos = 20;
    }

    this.doc.setFontSize(14);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text('Pattern Frequency Analysis', 20, yPos);
    yPos += 10;

    // Count all patterns
    const patternCounts = {};
    conversationData.forEach(msg => {
      if (msg.congruence?.patterns) {
        msg.congruence.patterns.forEach(p => {
          patternCounts[p] = (patternCounts[p] || 0) + 1;
        });
      }
      if (msg.congruence?.advancedPatterns) {
        msg.congruence.advancedPatterns.forEach(ap => {
          patternCounts[ap.pattern] = (patternCounts[ap.pattern] || 0) + 1;
        });
      }
    });

    const patternData = Object.entries(patternCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([pattern, count]) => [pattern, count.toString()]);

    if (patternData.length > 0) {
      this.doc.autoTable({
        startY: yPos,
        head: [['Pattern', 'Count']],
        body: patternData,
        theme: 'grid',
        headStyles: { fillColor: [139, 92, 246] },
        margin: { left: 20 }
      });
      yPos = this.doc.lastAutoTable.finalY + 15;
    } else {
      this.doc.setFontSize(10);
      this.doc.setTextColor(100, 100, 100);
      this.doc.text('No patterns detected', 20, yPos);
      yPos += 15;
    }

    return yPos;
  }

  addRecommendations(conversationData, yPos) {
    if (yPos > 250) {
      this.doc.addPage();
      yPos = 20;
    }

    this.doc.setFontSize(14);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text('Key Recommendations', 20, yPos);
    yPos += 10;

    const recommendations = [];

    // Check for crisis
    const crisisMessages = conversationData.filter(m =>
      m.congruence?.requiresSpecialHandling
    );
    if (crisisMessages.length > 0) {
      recommendations.push('! Crisis indicators detected - provide gentle, grounding support');
    }

    // Check for masking patterns
    const maskingPatterns = conversationData.filter(m =>
      m.congruence?.patterns?.includes('MASKING') ||
      m.congruence?.advancedPatterns?.some(p => p.pattern === 'VULNERABILITY_MASKING')
    );
    if (maskingPatterns.length > 0) {
      recommendations.push('* User may be hiding true emotions - create safety for authentic expression');
    }

    // Check emotional journey
    const archetypes = conversationData
      .filter(m => m.archetype)
      .map(m => m.archetype.type);
    if (archetypes.length > 1) {
      const first = archetypes[0];
      const last = archetypes[archetypes.length - 1];
      recommendations.push(`* Emotional journey: ${first} -> ${last} - acknowledge this progression`);
    }

    // Add general recommendation
    recommendations.push('* Continue monitoring for pattern changes and adjust support accordingly');

    this.doc.setFontSize(10);
    this.doc.setTextColor(0, 0, 0);
    recommendations.forEach((rec) => {
      const lines = this.doc.splitTextToSize(rec, 170);
      this.doc.text(lines, 20, yPos);
      yPos += lines.length * 7;
    });

    return yPos;
  }

  addReflectionSection(reflection, yPos) {
    // Always start reflection on a new page for readability
    this.doc.addPage();
    yPos = 20;

    // Section header with decorative styling
    this.doc.setFontSize(16);
    this.doc.setTextColor(139, 92, 246); // Purple
    this.doc.text('🪞 My Reflection on This Conversation', 20, yPos);
    yPos += 8;

    // Meta info
    this.doc.setFontSize(9);
    this.doc.setTextColor(120, 120, 120);
    const metaText = `Generated by ${reflection.speaker || 'GENESIS'} • ${new Date(reflection.generatedAt).toLocaleString()}`;
    this.doc.text(metaText, 20, yPos);
    yPos += 12;

    // Horizontal line
    this.doc.setDrawColor(139, 92, 246);
    this.doc.setLineWidth(0.5);
    this.doc.line(20, yPos, 190, yPos);
    yPos += 10;

    // Reflection content
    this.doc.setFontSize(10);
    this.doc.setTextColor(40, 40, 40);

    // Split reflection into paragraphs and handle page breaks
    const paragraphs = reflection.text.split('\n').filter(p => p.trim());

    for (const paragraph of paragraphs) {
      // Check for headers (markdown style)
      const isHeader = paragraph.startsWith('**') || paragraph.startsWith('#');

      if (isHeader) {
        yPos += 5;
        this.doc.setFontSize(11);
        this.doc.setTextColor(59, 130, 246);
        // Clean up markdown formatting
        const cleanHeader = paragraph.replace(/\*\*/g, '').replace(/^#+\s*/, '');
        const headerLines = this.doc.splitTextToSize(cleanHeader, 170);

        if (yPos + headerLines.length * 7 > 280) {
          this.doc.addPage();
          yPos = 20;
        }

        this.doc.text(headerLines, 20, yPos);
        yPos += headerLines.length * 6 + 4;
        this.doc.setFontSize(10);
        this.doc.setTextColor(40, 40, 40);
      } else {
        // Regular paragraph
        const lines = this.doc.splitTextToSize(paragraph, 170);

        if (yPos + lines.length * 6 > 280) {
          this.doc.addPage();
          yPos = 20;
        }

        this.doc.text(lines, 20, yPos);
        yPos += lines.length * 5 + 6;
      }
    }

    return yPos;
  }

  /**
   * Fallback: Export as JSON download
   */
  exportAsJSON(analysis, conversationData, reflection = null) {
    const data = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalMessages: analysis.messages.length,
        dominantArchetype: analysis.dominantArchetype,
        emotionalJourney: analysis.emotionalJourney,
        crisisIndicators: analysis.crisisCount,
        keyPatterns: analysis.keyPatterns
      },
      messages: conversationData.map(m => ({
        speaker: m.speaker,
        text: m.text,
        archetype: m.archetype?.type,
        confidence: m.archetype?.confidence,
        congruence: m.congruence?.level,
        patterns: m.congruence?.advancedPatterns?.map(p => p.pattern) || []
      })),
      reflection: reflection ? {
        text: reflection.text,
        speaker: reflection.speaker,
        generatedAt: reflection.generatedAt
      } : null
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `genesis-analysis-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('Exported as JSON (jsPDF not available)');
  }
}
