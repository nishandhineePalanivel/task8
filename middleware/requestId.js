/**
 * Cognifyz Web Development Internship - Level 3, Task 8
 * Request ID & Correlation Middleware
 * Assigns a unique X-Request-Id header to track request lifecycle and logs.
 */

const crypto = require('crypto');

function requestIdMiddleware(req, res, next) {
  // Use existing header or generate unique request ID
  const requestId = req.headers['x-request-id'] || 'req_' + crypto.randomBytes(8).toString('hex');
  
  req.id = requestId;
  res.setHeader('X-Request-Id', requestId);
  
  next();
}

module.exports = requestIdMiddleware;
