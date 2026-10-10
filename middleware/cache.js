/**
 * Cognifyz Web Development Internship - Level 3, Task 8
 * Route-Level HTTP Cache & Invalidation Middleware
 * Automatically caches GET responses, tracks cache hits/misses, and purges keys on mutations.
 */

const cacheService = require('../services/cacheService');

/**
 * Cache Middleware Generator for Route Handlers
 */
function cacheRoute(ttlSeconds = 60, prefix = 'route') {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey = `cache:${prefix}:${req.originalUrl || req.url}`;
    const cachedResponse = cacheService.get(cacheKey);

    if (cachedResponse) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('X-Cache-Key', cacheKey);
      res.setHeader('X-Cache-Engine', 'Server-Memory');
      return res.status(200).json(cachedResponse);
    }

    // Cache Miss: Intercept res.json to store response before sending
    res.setHeader('X-Cache', 'MISS');
    res.setHeader('X-Cache-Key', cacheKey);

    const originalJson = res.json.bind(res);
    res.json = (body) => {
      // Only cache successful 200 responses
      if (res.statusCode === 200 && body && body.success !== false) {
        cacheService.set(cacheKey, body, ttlSeconds);
      }
      return originalJson(body);
    };

    next();
  };
}

/**
 * Invalidation Middleware for Mutating Actions (POST, PUT, DELETE)
 */
function invalidateCache(prefix = 'registrations') {
  return (req, res, next) => {
    res.on('finish', () => {
      // On successful mutation (200 or 201), invalidate cache pattern
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const pattern = `cache:${prefix}`;
        cacheService.invalidatePattern(pattern);
      }
    });
    next();
  };
}

module.exports = {
  cacheRoute,
  invalidateCache
};
