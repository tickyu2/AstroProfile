/**
 * Cathedral PDF Renderer
 *
 * Playwright-based HTML to PDF converter tuned for the Omniphonic Report.
 *
 * Features:
 * - Shared browser instance for performance
 * - Cathedral-specific fonts, margins, headers/footers
 * - Automatic light theme forcing for print
 * - Graceful shutdown hook
 *
 * Usage:
 *   const pdfBuffer = await renderPdf(html, { format: 'A4' });
 */

// ============================================================================
// TYPES
// ============================================================================

export interface RenderPdfOptions {
  /** Page format */
  format?: 'A4' | 'Letter';

  /** Print background colors and images */
  printBackground?: boolean;

  /** Page margins */
  margin?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };

  /** Enable header */
  displayHeader?: boolean;

  /** Enable footer */
  displayFooter?: boolean;

  /** Custom header HTML template */
  headerTemplate?: string;

  /** Custom footer HTML template */
  footerTemplate?: string;

  /** Page scale (0.1 to 2.0) */
  scale?: number;

  /** Print in landscape orientation */
  landscape?: boolean;

  /** Custom page ranges (e.g., '1-5, 8') */
  pageRanges?: string;

  /** Timeout in milliseconds */
  timeout?: number;
}

export interface PdfRendererConfig {
  /** Default format */
  defaultFormat: 'A4' | 'Letter';

  /** Default margins */
  defaultMargins: {
    top: string;
    bottom: string;
    left: string;
    right: string;
  };

  /** Default header template */
  defaultHeaderTemplate: string;

  /** Default footer template */
  defaultFooterTemplate: string;

  /** Browser launch options */
  browserOptions?: {
    headless?: boolean;
    args?: string[];
  };
}

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

/**
 * Cathedral PDF default configuration
 */
export const CATHEDRAL_PDF_CONFIG: PdfRendererConfig = {
  defaultFormat: 'A4',

  defaultMargins: {
    top: '32px',
    bottom: '48px',
    left: '36px',
    right: '36px'
  },

  defaultHeaderTemplate: `
    <div style="
      font-size: 8px;
      font-family: system-ui, -apple-system, sans-serif;
      color: #9ca3af;
      width: 100%;
      padding: 0 36px;
      display: flex;
      justify-content: space-between;
    ">
      <span>Omniphonic Harmony Report</span>
      <span class="title"></span>
    </div>
  `,

  defaultFooterTemplate: `
    <div style="
      font-size: 8px;
      font-family: system-ui, -apple-system, sans-serif;
      color: #9ca3af;
      width: 100%;
      padding: 0 36px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    ">
      <span>Cathedral of Emotional Harmony</span>
      <span style="display: flex; align-items: center; gap: 4px;">
        <span style="opacity: 0.5;">🌙</span>
        <span class="pageNumber"></span>
      </span>
    </div>
  `,

  browserOptions: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  }
};

// ============================================================================
// BROWSER MANAGEMENT
// ============================================================================

/**
 * Browser instance type (from Playwright)
 * Using 'any' to avoid Playwright type dependency at compile time
 */
type BrowserInstance = {
  isConnected(): boolean;
  newPage(): Promise<PageInstance>;
  close(): Promise<void>;
};

type PageInstance = {
  setContent(html: string, options?: { waitUntil?: string }): Promise<void>;
  evaluate<T>(fn: () => T): Promise<T>;
  pdf(options: Record<string, unknown>): Promise<Buffer>;
  close(): Promise<void>;
};

/**
 * Shared browser instance
 */
let sharedBrowser: BrowserInstance | null = null;

/**
 * Get or create the shared browser instance
 */
async function getBrowser(config: PdfRendererConfig = CATHEDRAL_PDF_CONFIG): Promise<BrowserInstance> {
  if (sharedBrowser && sharedBrowser.isConnected()) {
    return sharedBrowser;
  }

  // Dynamic import to handle environments without Playwright
  try {
    const { chromium } = await import('playwright');

    sharedBrowser = await chromium.launch({
      headless: config.browserOptions?.headless ?? true,
      args: config.browserOptions?.args ?? []
    });

    return sharedBrowser;
  } catch (error) {
    throw new Error(
      `Failed to launch browser. Ensure Playwright is installed: npm install playwright\n` +
      `Original error: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Close the shared browser instance
 */
export async function closePdfBrowser(): Promise<void> {
  if (sharedBrowser) {
    await sharedBrowser.close();
    sharedBrowser = null;
  }
}

// ============================================================================
// MAIN RENDER FUNCTION
// ============================================================================

/**
 * Render HTML to PDF
 *
 * @param html - HTML content to render
 * @param options - Rendering options
 * @param config - Renderer configuration
 * @returns PDF as Buffer
 */
export async function renderPdf(
  html: string,
  options: RenderPdfOptions = {},
  config: PdfRendererConfig = CATHEDRAL_PDF_CONFIG
): Promise<Buffer> {
  const browser = await getBrowser(config);
  const page = await browser.newPage();

  try {
    // Set content and wait for network idle
    await page.setContent(html, {
      waitUntil: 'networkidle'
    });

    // Force light theme for print
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');

      // Remove any animations
      const style = document.createElement('style');
      style.textContent = `
        *, *::before, *::after {
          animation: none !important;
          transition: none !important;
        }
      `;
      document.head.appendChild(style);
    });

    // Build PDF options
    const pdfOptions: Record<string, unknown> = {
      format: options.format ?? config.defaultFormat,
      printBackground: options.printBackground ?? true,
      margin: {
        top: options.margin?.top ?? config.defaultMargins.top,
        bottom: options.margin?.bottom ?? config.defaultMargins.bottom,
        left: options.margin?.left ?? config.defaultMargins.left,
        right: options.margin?.right ?? config.defaultMargins.right
      },
      displayHeaderFooter: (options.displayHeader ?? true) || (options.displayFooter ?? true),
      headerTemplate: options.headerTemplate ?? config.defaultHeaderTemplate,
      footerTemplate: options.footerTemplate ?? config.defaultFooterTemplate,
      scale: options.scale ?? 1,
      landscape: options.landscape ?? false
    };

    if (options.pageRanges) {
      pdfOptions.pageRanges = options.pageRanges;
    }

    if (options.timeout) {
      pdfOptions.timeout = options.timeout;
    }

    // Generate PDF
    const pdf = await page.pdf(pdfOptions);

    return pdf;
  } finally {
    await page.close();
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Render Omniphonic Report to PDF with cathedral defaults
 */
export async function renderOmniphonicReportPdf(
  html: string,
  options: Partial<RenderPdfOptions> = {}
): Promise<Buffer> {
  return renderPdf(html, {
    format: 'A4',
    printBackground: true,
    displayHeader: true,
    displayFooter: true,
    ...options
  });
}

/**
 * Render a simple PDF without headers/footers
 */
export async function renderSimplePdf(
  html: string,
  options: Partial<RenderPdfOptions> = {}
): Promise<Buffer> {
  return renderPdf(html, {
    displayHeader: false,
    displayFooter: false,
    ...options
  });
}

// ============================================================================
// FALLBACK RENDERER (for environments without Playwright)
// ============================================================================

/**
 * Check if Playwright is available
 */
export async function isPlaywrightAvailable(): Promise<boolean> {
  try {
    await import('playwright');
    return true;
  } catch {
    return false;
  }
}

/**
 * Fallback: Return HTML for manual PDF generation
 * (useful when Playwright isn't available)
 */
export function preparePdfHtml(html: string): string {
  // Inject print-ready modifications
  const printStyles = `
    <style>
      @media print {
        html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        body { background: white !important; color: black !important; }
        .page { page-break-after: always; }
      }
    </style>
  `;

  // Force light theme
  const themeScript = `
    <script>
      document.documentElement.setAttribute('data-theme', 'light');
    </script>
  `;

  // Inject before </head>
  return html.replace('</head>', `${printStyles}${themeScript}</head>`);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default renderPdf;
