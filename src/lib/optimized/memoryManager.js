/**
 * Memory Manager with LRU Caching and Periodic Cleanup
 */

/**
 * LRU Cache Implementation
 */
export class LRUCache {
  constructor(maxSize) {
    this.maxSize = maxSize;
    this.cache = new Map();
    this.accessTimes = new Map();
    this.hitCount = 0;
    this.missCount = 0;
  }

  get(key) {
    if (this.cache.has(key)) {
      this.accessTimes.set(key, Date.now());
      this.hitCount++;
      return this.cache.get(key);
    }
    this.missCount++;
    return null;
  }

  set(key, value) {
    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictOldest();
    }

    this.cache.set(key, value);
    this.accessTimes.set(key, Date.now());
  }

  has(key) {
    return this.cache.has(key);
  }

  delete(key) {
    this.cache.delete(key);
    this.accessTimes.delete(key);
  }

  evictOldest() {
    let oldestKey = null;
    let oldestTime = Infinity;

    for (const [key, time] of this.accessTimes) {
      if (time < oldestTime) {
        oldestTime = time;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.accessTimes.delete(oldestKey);
    }
  }

  /**
   * Prune old entries (> 1 hour old)
   */
  prune(maxAge = 3600000) {
    const now = Date.now();
    const toDelete = [];

    for (const [key, time] of this.accessTimes) {
      if (now - time > maxAge) {
        toDelete.push(key);
      }
    }

    for (const key of toDelete) {
      this.cache.delete(key);
      this.accessTimes.delete(key);
    }

    return toDelete.length;
  }

  clear() {
    this.cache.clear();
    this.accessTimes.clear();
    this.hitCount = 0;
    this.missCount = 0;
  }

  get size() {
    return this.cache.size;
  }

  getHitRate() {
    const total = this.hitCount + this.missCount;
    if (total === 0) return '0%';
    return ((this.hitCount / total) * 100).toFixed(2) + '%';
  }

  getStats() {
    return {
      size: this.size,
      maxSize: this.maxSize,
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate: this.getHitRate()
    };
  }
}

export class MemoryManager {
  constructor(config = {}) {
    this.maxCacheSize = config.maxCacheSize || 1000;
    this.maxHistorySize = config.maxHistorySize || 100;
    this.cleanupInterval = config.cleanupInterval || 300000; // 5 minutes
    this.caches = new Map();
    this.enabled = config.enabled !== false;

    if (this.enabled) {
      this.startCleanup();
    }
  }

  /**
   * Create a new named cache
   */
  createCache(name, maxSize = this.maxCacheSize) {
    if (this.caches.has(name)) {
      return this.caches.get(name);
    }

    const cache = new LRUCache(maxSize);
    this.caches.set(name, cache);
    return cache;
  }

  /**
   * Get existing cache by name
   */
  getCache(name) {
    return this.caches.get(name);
  }

  /**
   * Start periodic cleanup
   */
  startCleanup() {
    this.cleanupTimer = setInterval(() => {
      this.performCleanup();
    }, this.cleanupInterval);
  }

  /**
   * Perform cleanup on all caches
   */
  performCleanup() {
    const stats = {
      before: this.getTotalCacheSize(),
      cachesProcessed: 0,
      itemsEvicted: 0
    };

    for (const [name, cache] of this.caches) {
      const sizeBefore = cache.size;
      cache.prune();
      const itemsEvicted = sizeBefore - cache.size;

      stats.cachesProcessed++;
      stats.itemsEvicted += itemsEvicted;
    }

    stats.after = this.getTotalCacheSize();

    console.log('[MemoryManager] Cleanup complete:', stats);

    return stats;
  }

  /**
   * Clear all caches
   */
  clearAll() {
    for (const cache of this.caches.values()) {
      cache.clear();
    }
  }

  /**
   * Stop cleanup timer
   */
  stop() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  /**
   * Get total size of all caches
   */
  getTotalCacheSize() {
    let total = 0;
    for (const cache of this.caches.values()) {
      total += cache.size;
    }
    return total;
  }

  /**
   * Get memory usage statistics
   */
  getMemoryUsage() {
    const stats = {
      totalCaches: this.caches.size,
      totalItems: this.getTotalCacheSize(),
      cacheDetails: {}
    };

    for (const [name, cache] of this.caches) {
      stats.cacheDetails[name] = {
        size: cache.size,
        maxSize: cache.maxSize,
        hitRate: cache.getHitRate()
      };
    }

    // Add process memory if available (Node.js)
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const usage = process.memoryUsage();
      stats.processMemory = {
        heapUsed: (usage.heapUsed / 1024 / 1024).toFixed(2) + ' MB',
        heapTotal: (usage.heapTotal / 1024 / 1024).toFixed(2) + ' MB',
        external: (usage.external / 1024 / 1024).toFixed(2) + ' MB'
      };
    }

    return stats;
  }
}

// Singleton instance
export const memoryManager = new MemoryManager();
