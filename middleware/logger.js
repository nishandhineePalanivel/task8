/**
 * Cognifyz Web Development Internship - Level 3, Task 8
 * Request Processing: Structured Logger & Audit Middleware
 * Features: High-resolution timing, status logging, sensitive data masking, and in-memory log buffer for live telemetry.
 */

// Ring buffer of recent logs (capped at 100 entries)
const requestLogsBuffer = [];
const MAX_LOGS = 100;

function maskSensitiveData(data) {
  if (!data || typeof data !== 'object') return data;
  const clone = Array.isArray(data) ? [...data] : { ...data };
  const sensitiveKeys = ['password', 'confirmPassword', 'token', 'clientSecret', 'client_secret', 'secret'];

  for (const key of Object.keys(clone)) {
    if (sensitiveKeys.includes(key.toLowerCase())) {
      clone[key] = '******** [MASKED]';
    } else if (typeof clone[key] === 'object') {
      clone[key] = maskSensitiveData(clone[key]);
    }
  }
  return clone;
}

function requestLoggerMiddleware(req, res, next) {
  const startHrTime = process.hrtime();
  const startTime = new Date();

  // On response finish event
  res.on('finish', () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const durationMs = (elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6).toFixed(2);

    const logEntry = {
      id: req.id || 'req_unknown',
      timestamp: startTime.toISOString(),
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode: res.statusCode,
      durationMs: parseFloat(durationMs),
      clientIp: req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown Client',
      cached: res.getHeader('X-Cache') || 'NONE'
    };

    // Keep ring buffer at max 100 items
    requestLogsBuffer.unshift(logEntry);
    if (requestLogsBuffer.length > MAX_LOGS) {
      requestLogsBuffer.pop();
    }

    // Terminal log output
    const statusColor = res.statusCode >= 500 ? '\x1b[31m' : (res.statusCode >= 400 ? '\x1b[33m' : '\x1b[32m');
    console.log(`[${logEntry.timestamp}] ${logEntry.method} ${logEntry.url} ${statusColor}${logEntry.statusCode}\x1b[0m ${logEntry.durationMs}ms - ID: ${logEntry.id}`);
  });

  next();
}

function getRecentLogs(limit = 50) {
  return requestLogsBuffer.slice(0, Math.min(limit, requestLogsBuffer.length));
}

function clearLogs() {
  requestLogsBuffer.length = 0;
  return { success: true, message: "Server request logs cleared." };
}

module.exports = {
  requestLoggerMiddleware,
  getRecentLogs,
  clearLogs
};
