/**
 * Cognifyz Web Development Internship - Level 3, Task 8
 * Request Processing: Security Headers & Response Hardening Middleware
 */

function securityHeadersMiddleware(req, res, next) {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Clickjacking protection
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  // Cross-site scripting filter
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  next();
}

module.exports = securityHeadersMiddleware;
