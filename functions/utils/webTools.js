/**
 * Web Tools for AI SoulPartner
 * - Tavily Web Search Integration
 * - URL Content Fetching
 *
 * Part of GENESIS Phase 2 - AI SoulPartner System
 * Modularized: December 17, 2024
 */

const TAVILY_API_URL = 'https://api.tavily.com/search';

/**
 * Detect if user is asking for a web search
 * @param {string} message - User message
 * @returns {Object} - { isSearch, query? }
 */
function detectWebSearchRequest(message) {
  if (!message) return { isSearch: false };

  const lowerMsg = message.toLowerCase();

  // Patterns that indicate a web search request
  const searchPatterns = [
    /search (?:the )?(?:web|internet|online) for/i,
    /look up (?:online|on the web)/i,
    /find (?:me )?(?:information|info|news|articles?) (?:about|on)/i,
    /what(?:'s| is) (?:the )?(?:latest|current|recent|new)/i,
    /(?:can you |please )?(?:search|look|find|google)/i,
    /go (?:on|to) (?:the )?(?:web|internet)/i,
    /browse (?:the )?(?:web|internet)/i,
    /web search/i,
    /current (?:news|events|state)/i,
    /what's happening (?:with|in|right now)/i
  ];

  for (const pattern of searchPatterns) {
    if (pattern.test(lowerMsg)) {
      // Extract the search query (everything after the trigger phrase)
      const cleanedMsg = message
        .replace(/search (?:the )?(?:web|internet|online) for/i, '')
        .replace(/look up (?:online|on the web)/i, '')
        .replace(/find (?:me )?(?:information|info|news|articles?) (?:about|on)/i, '')
        .replace(/(?:can you |please )?(?:search|look|find|google)/i, '')
        .replace(/go (?:on|to) (?:the )?(?:web|internet)/i, '')
        .replace(/browse (?:the )?(?:web|internet)/i, '')
        .replace(/what(?:'s| is) (?:the )?(?:latest|current|recent|new)/i, '')
        .trim();

      return {
        isSearch: true,
        query: cleanedMsg || message
      };
    }
  }

  return { isSearch: false };
}

/**
 * Perform Tavily web search
 * @param {string} query - Search query
 * @returns {Object|null} - { answer, results } or null on error
 */
async function performWebSearch(query) {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    console.warn('⚠️ Tavily API key not configured');
    return null;
  }

  try {
    console.log('🔍 Performing Tavily search:', query);

    const response = await fetch(TAVILY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: query,
        search_depth: 'advanced',
        include_answer: true,
        include_raw_content: false,
        max_results: 5
      })
    });

    if (!response.ok) {
      console.error('Tavily API error:', response.status);
      return null;
    }

    const data = await response.json();
    console.log('🔍 Tavily results:', data.results?.length || 0, 'results');

    return {
      answer: data.answer,
      results: data.results?.map(r => ({
        title: r.title,
        url: r.url,
        content: r.content
      })) || []
    };
  } catch (error) {
    console.error('Tavily search error:', error);
    return null;
  }
}

/**
 * Detect URLs in user message
 * @param {string} message - User message
 * @returns {string[]} - Array of URLs found
 */
function detectURLs(message) {
  if (!message) return [];

  // Match http/https URLs
  const urlPattern = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/gi;
  const matches = message.match(urlPattern) || [];

  // Clean up trailing punctuation
  return matches.map(url => url.replace(/[.,;:!?)]+$/, ''));
}

/**
 * Fetch and extract content from a URL
 * @param {string} url - URL to fetch
 * @returns {Object} - { success, url?, title?, text?, excerpt?, error? }
 */
async function fetchURLContent(url) {
  try {
    console.log('🌐 Fetching URL:', url);

    // Fetch with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.error('🌐 URL fetch error:', response.status, url);
      return { success: false, error: `HTTP ${response.status}` };
    }

    const contentType = response.headers.get('content-type') || '';

    // Only process HTML/text content
    if (!contentType.includes('text/html') && !contentType.includes('text/plain')) {
      return {
        success: false,
        error: `Unsupported content type: ${contentType.split(';')[0]}`
      };
    }

    const html = await response.text();

    // Extract readable content
    const content = extractReadableContent(html, url);

    console.log('🌐 Extracted content:', content.title, '-', content.text.length, 'chars');

    return {
      success: true,
      url: url,
      title: content.title,
      text: content.text,
      excerpt: content.text.slice(0, 500) + (content.text.length > 500 ? '...' : '')
    };

  } catch (error) {
    console.error('🌐 URL fetch error:', error.message);
    return {
      success: false,
      error: error.name === 'AbortError' ? 'Request timed out' : error.message
    };
  }
}

/**
 * Extract readable content from HTML (simplified extraction)
 * @param {string} html - Raw HTML
 * @param {string} url - Source URL for fallback title
 * @returns {Object} - { title, text }
 */
function extractReadableContent(html, url) {
  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : new URL(url).hostname;

  // Remove script and style tags
  let text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  // Try to find main content area
  const mainContentPatterns = [
    /<article[^>]*>([\s\S]*?)<\/article>/gi,
    /<main[^>]*>([\s\S]*?)<\/main>/gi,
    /<div[^>]*class="[^"]*(?:content|article|post|entry|main)[^"]*"[^>]*>([\s\S]*?)<\/div>/gi
  ];

  let mainContent = '';
  for (const pattern of mainContentPatterns) {
    const match = text.match(pattern);
    if (match && match[0].length > mainContent.length) {
      mainContent = match[0];
    }
  }

  // Use main content if found, otherwise use body
  if (mainContent) {
    text = mainContent;
  } else {
    const bodyMatch = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      text = bodyMatch[1];
    }
  }

  // Remove remaining HTML tags
  text = text.replace(/<[^>]+>/g, ' ');

  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&[a-z]+;/gi, ' ');

  // Clean up whitespace
  text = text
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();

  // Limit length to avoid token limits
  const maxLength = 8000;
  if (text.length > maxLength) {
    text = text.slice(0, maxLength) + '\n\n[Content truncated...]';
  }

  return { title, text };
}

module.exports = {
  detectWebSearchRequest,
  performWebSearch,
  detectURLs,
  fetchURLContent,
  extractReadableContent
};
