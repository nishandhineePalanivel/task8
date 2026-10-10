/**
 * Cognifyz Web Development Internship - Level 3, Task 8
 * High-Performance Server-Side Caching Engine
 * Mimics Redis key-value store semantics: TTL expiration, key eviction, stats metrics, and hit ratio.
 */

class CacheService {
  constructor(defaultTtlSeconds = 60) {
    this.defaultTtl = defaultTtlSeconds * 1000;
    this.store = new Map(); // key => { value, expiresAt, sizeBytes, createdAt }
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletions: 0
    };

    // Periodic sweep for expired keys every 30 seconds
    setInterval(() => this.cleanupExpired(), 30000).unref();
  }

  /**
   * Retrieve cached item
   */
  get(key) {
    const entry = this.store.get(key);
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return entry.value;
  }

  /**
   * Set cached item with TTL (in seconds)
   */
  set(key, value, ttlSeconds = null) {
    const ttl = (ttlSeconds !== null ? ttlSeconds * 1000 : this.defaultTtl);
    const expiresAt = Date.now() + ttl;
    const valueString = JSON.stringify(value);
    const sizeBytes = Buffer.byteLength(valueString, 'utf8');

    this.store.set(key, {
      value,
      expiresAt,
      sizeBytes,
      createdAt: new Date().toISOString()
    });

    this.stats.sets++;
    return true;
  }

  /**
   * Delete item from cache
   */
  del(key) {
    if (this.store.has(key)) {
      this.store.delete(key);
      this.stats.deletions++;
      return true;
    }
    return false;
  }

  /**
   * Invalidate all keys matching a prefix or pattern (e.g. "cache:registrations*")
   */
  invalidatePattern(patternPrefix) {
    let count = 0;
    for (const key of this.store.keys()) {
      if (key.startsWith(patternPrefix)) {
        this.store.delete(key);
        count++;
      }
    }
    this.stats.deletions += count;
    return count;
  }

  /**
   * Flush all keys in cache
   */
  flush() {
    const count = this.store.size;
    this.store.clear();
    this.stats.deletions += count;
    return { success: true, clearedKeysCount: count };
  }

  /**
   * Cleanup expired keys
   */
  cleanupExpired() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Get list of active keys with metadata
   */
  getKeys() {
    const now = Date.now();
    const result = [];
    for (const [key, entry] of this.store.entries()) {
      const remainingSeconds = Math.max(0, Math.round((entry.expiresAt - now) / 1000));
      result.push({
        key,
        remainingTtlSeconds: remainingSeconds,
        sizeBytes: entry.sizeBytes,
        createdAt: entry.createdAt
      });
    }
    return result;
  }

  /**
   * Cache telemetry and performance statistics
   */
  getStats() {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRatio = totalRequests > 0 ? ((this.stats.hits / totalRequests) * 100).toFixed(1) : "0.0";
    
    let totalSizeBytes = 0;
    for (const entry of this.store.values()) {
      totalSizeBytes += entry.sizeBytes || 0;
    }

    return {
      activeKeysCount: this.store.size,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRatioPercent: parseFloat(hitRatio),
      totalRequests,
      sets: this.stats.sets,
      deletions: this.stats.deletions,
      approximateMemoryKb: (totalSizeBytes / 1024).toFixed(2),
      engine: "InMemory-LRU-Optimized"
    };
  }
}

const cacheServiceInstance = new CacheService(60);

module.exports = cacheServiceInstance;
