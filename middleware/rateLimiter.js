/**
 * Cognifyz Web Development Internship - Level 3, Task 8
 * Server Rate Limiting & Telemetry Middleware
 * Uses express-rate-limit with standard headers, customizable limits, and status metrics.
 */

const rateLimit = require('express-rate-limit');

// General API Rate Limiter: Max 100 requests per 15-minute window
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true, // Return standard rate limit header info (RateLimit-*)
  legacyHeaders: false, // Disable X-RateLimit-* headers
  handler: (req, res, next, options) => {
    return res.status(429).json({
      success: false,
      error: "Too Many Requests",
      message: "You have exceeded the API request rate limit (100 requests / 15 minutes). Please try again later.",
      retryAfterSeconds: Math.ceil(options.windowMs / 1000)
    });
  }
});

// Strict Rate Limiter for Auth & External API Endpoints: Max 15 requests per 15-minute window
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    return res.status(429).json({
      success: false,
      error: "Rate Limit Exceeded",
      message: "Strict Rate Limit Protection Triggered (Maximum 15 requests / 15 mins for Auth & External APIs). Please wait before retrying.",
      retryAfterSeconds: Math.ceil(options.windowMs / 1000)
    });
  }
});

module.exports = {
  globalLimiter,
  strictLimiter
};
