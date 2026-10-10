/**
 * Cognifyz Web Development Internship - Level 3, Task 8
 * Server Application: Advanced Server-Side Where Data Meets Intelligence
 * Express.js + Middleware Pipeline (Request ID, Logger, Security) + Background Job Queue + Server-Side Caching + JWT Auth + External APIs + OAuth 2.0
 */

const express = require("express");
const path = require("path");

// Middleware Imports
const requestIdMiddleware = require("./middleware/requestId");
const { requestLoggerMiddleware, getRecentLogs, clearLogs } = require("./middleware/logger");
const securityHeadersMiddleware = require("./middleware/security");
const { globalLimiter, strictLimiter } = require("./middleware/rateLimiter");
const { cacheRoute, invalidateCache } = require("./middleware/cache");
const { generateToken, authenticateToken } = require("./middleware/auth");

// Service Imports
const DatabaseService = require("./services/db");
const cacheService = require("./services/cacheService");
const jobQueue = require("./services/jobQueue");
const externalApi = require("./services/externalApi");
const oauthService = require("./services/oauthService");

const app = express();

// View Engine (EJS) setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ==========================================================================
   1. ENTERPRISE MIDDLEWARE PIPELINE (Task 8 Step 1)
   ========================================================================== */

// 1. Request ID & Correlation Tracking
app.use(requestIdMiddleware);

// 2. HTTP Security & Hardening Headers
app.use(securityHeadersMiddleware);

// 3. High-Resolution Request Processing & Audit Logger
app.use(requestLoggerMiddleware);

// 4. Request Body Parsing with size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 5. Static Asset Serving
app.use(express.static(path.join(__dirname, "public")));

// Initialize Database Storage on Server Startup
DatabaseService.init().then(() => {
  console.log("Task 8 Persistent Database Initialized.");
});

/* ==========================================================================
   2. RATE LIMITING MIDDLEWARE
   ========================================================================== */

// Apply global rate limiting to all API endpoints (/api/*)
app.use("/api/", globalLimiter);

// Strict rate limiting for Auth, External APIs, and Job Enqueueing
app.use("/api/auth/", strictLimiter);
app.use("/api/external/", strictLimiter);

/* ==========================================================================
   3. TASK 8: BACKGROUND TASKS & JOB PROCESSING API (/api/jobs/*)
   ========================================================================== */

/**
 * POST /api/jobs/enqueue - Enqueue a new asynchronous background task
 */
app.post("/api/jobs/enqueue", (req, res) => {
  try {
    const { type, payload, priority } = req.body;

    const validTypes = [
      'APPLICATION_VERIFICATION',
      'REPORT_GENERATION',
      'DATA_INTELLIGENCE',
      'DATABASE_BACKUP'
    ];

    if (!type || !validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid job type. Supported types: ${validTypes.join(', ')}`
      });
    }

    const job = jobQueue.enqueue(type, payload || {}, priority || 'normal');

    return res.status(202).json({
      success: true,
      message: `Background job '${type}' accepted and enqueued for asynchronous worker processing.`,
      job: job
    });
  } catch (err) {
    console.error("POST /api/jobs/enqueue error:", err);
    return res.status(500).json({ success: false, message: "Server error enqueueing background job." });
  }
});

/**
 * GET /api/jobs - List all jobs and worker queue telemetry
 */
app.get("/api/jobs", (req, res) => {
  const jobs = jobQueue.getAllJobs();
  const stats = jobQueue.getStats();

  return res.status(200).json({
    success: true,
    stats: stats,
    jobs: jobs
  });
});

/**
 * GET /api/jobs/:id - Check status and progress of a specific job
 */
app.get("/api/jobs/:id", (req, res) => {
  const job = jobQueue.getJobById(req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, message: `Job not found with ID: ${req.params.id}` });
  }
  return res.status(200).json({ success: true, job: job });
});

/**
 * DELETE /api/jobs/:id - Cancel a pending job
 */
app.delete("/api/jobs/:id", (req, res) => {
  const cancelled = jobQueue.cancelJob(req.params.id);
  if (!cancelled) {
    return res.status(400).json({ success: false, message: "Job could not be cancelled (either not found or already running/completed)." });
  }
  return res.status(200).json({ success: true, message: `Job ${req.params.id} cancelled successfully.` });
});

/**
 * POST /api/jobs/clear - Clear completed and failed jobs
 */
app.post("/api/jobs/clear", (req, res) => {
  const result = jobQueue.clearCompletedJobs();
  return res.status(200).json(result);
});

/* ==========================================================================
   4. TASK 8: SERVER-SIDE CACHING API & TELEMETRY (/api/cache/*)
   ========================================================================== */

/**
 * GET /api/cache/stats - Retrieve real-time server caching statistics
 */
app.get("/api/cache/stats", (req, res) => {
  const stats = cacheService.getStats();
  return res.status(200).json({ success: true, stats: stats });
});

/**
 * GET /api/cache/keys - List all active cached keys with remaining TTL
 */
app.get("/api/cache/keys", (req, res) => {
  const keys = cacheService.getKeys();
  return res.status(200).json({ success: true, keys: keys });
});

/**
 * DELETE /api/cache - Flush entire server cache
 */
app.delete("/api/cache", (req, res) => {
  const result = cacheService.flush();
  return res.status(200).json(result);
});

/**
 * DELETE /api/cache/:key - Purge specific cache key
 */
app.delete("/api/cache/:key", (req, res) => {
  const deleted = cacheService.del(req.params.key);
  if (!deleted) {
    return res.status(404).json({ success: false, message: `Cache key '${req.params.key}' not found.` });
  }
  return res.status(200).json({ success: true, message: `Cache key '${req.params.key}' evicted.` });
});

/* ==========================================================================
   5. TASK 8: REQUEST PROCESSING AUDIT LOGS (/api/logs)
   ========================================================================== */

/**
 * GET /api/logs - Retrieve recent server request audit logs
 */
app.get("/api/logs", (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 40;
  const logs = getRecentLogs(limit);
  return res.status(200).json({
    success: true,
    count: logs.length,
    logs: logs
  });
});

/**
 * DELETE /api/logs - Clear server request logs
 */
app.delete("/api/logs", (req, res) => {
  const result = clearLogs();
  return res.status(200).json(result);
});

/* ==========================================================================
   6. USER AUTHENTICATION API ENDPOINTS (/api/auth)
   ========================================================================== */

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: "Full name must be at least 2 characters long." });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address." });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long." });
    }

    const existingUser = await DatabaseService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: "An account with this email address already exists." });
    }

    const newUser = await DatabaseService.createUser({ name, email, password, role: 'user' });
    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: "Account registered successfully!",
      token: token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error("POST /api/auth/register error:", err);
    return res.status(500).json({ success: false, message: "Server error during account registration." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide both email and password." });
    }

    const user = await DatabaseService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email address or password." });
    }

    const isMatch = await DatabaseService.verifyPassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email address or password." });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("POST /api/auth/login error:", err);
    return res.status(500).json({ success: false, message: "Server error during user login." });
  }
});

app.get("/api/auth/me", authenticateToken, async (req, res) => {
  const user = await DatabaseService.findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }
  return res.status(200).json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

/* ==========================================================================
   7. CACHED & PROTECTED REGISTRATION CRUD API (/api/registrations)
   ========================================================================== */

function validateRegistrationPayload(data) {
  const errors = [];
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push("Full name must be at least 2 characters long.");
  } else if (/^\d+$/.test(data.name.trim())) {
    errors.push("Name cannot contain numbers only.");
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.push("Please provide a valid email address.");
  }

  const phoneRegex = /^[6-9]\d{9}$/;
  if (!data.phone || !phoneRegex.test(data.phone.trim())) {
    errors.push("Phone number must be a valid 10-digit mobile number starting with 6, 7, 8, or 9.");
  }

  const ageNum = parseInt(data.age, 10);
  if (isNaN(ageNum) || ageNum < 16 || ageNum > 100) {
    errors.push("Age must be a valid number between 16 and 100.");
  }

  if (!data.course || typeof data.course !== 'string' || data.course.trim() === '') {
    errors.push("Please select an engineering course.");
  }

  return errors;
}

// GET /api/registrations - Cached route (TTL 60s)
app.get("/api/registrations", cacheRoute(60, "registrations"), async (req, res) => {
  try {
    const registrations = await DatabaseService.getAllRegistrations();
    return res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (err) {
    console.error("GET /api/registrations error:", err);
    return res.status(500).json({ success: false, message: "Internal server error fetching registrations." });
  }
});

// GET /api/registrations/:id - Single record
app.get("/api/registrations/:id", cacheRoute(60, "registration_single"), async (req, res) => {
  try {
    const record = await DatabaseService.getRegistrationById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: `Registration not found with ID: ${req.params.id}` });
    }
    return res.status(200).json({ success: true, data: record });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error fetching registration." });
  }
});

// POST /api/registrations - Mutating action, auto-invalidates registrations cache
app.post("/api/registrations", authenticateToken, invalidateCache("registrations"), async (req, res) => {
  try {
    const errors = validateRegistrationPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors: errors });
    }

    const createdRecord = await DatabaseService.createRegistration(req.body, req.user.id);
    return res.status(201).json({
      success: true,
      message: "Registration created successfully",
      data: createdRecord
    });
  } catch (err) {
    console.error("POST /api/registrations error:", err);
    return res.status(500).json({ success: false, message: "Server error creating registration." });
  }
});

// PUT /api/registrations/:id - Mutating action, auto-invalidates registrations cache
app.put("/api/registrations/:id", authenticateToken, invalidateCache("registrations"), async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await DatabaseService.getRegistrationById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: `Registration not found with ID: ${id}` });
    }

    const errors = validateRegistrationPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors: errors });
    }

    const updatedRecord = await DatabaseService.updateRegistration(id, req.body);
    return res.status(200).json({
      success: true,
      message: "Registration updated successfully",
      data: updatedRecord
    });
  } catch (err) {
    console.error(`PUT /api/registrations/${req.params.id} error:`, err);
    return res.status(500).json({ success: false, message: "Server error updating registration." });
  }
});

// DELETE /api/registrations/:id - Mutating action, auto-invalidates registrations cache
app.delete("/api/registrations/:id", authenticateToken, invalidateCache("registrations"), async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DatabaseService.deleteRegistration(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: `Registration not found with ID: ${id}` });
    }

    return res.status(200).json({
      success: true,
      message: "Registration deleted successfully",
      id: id
    });
  } catch (err) {
    console.error(`DELETE /api/registrations/${req.params.id} error:`, err);
    return res.status(500).json({ success: false, message: "Server error deleting registration." });
  }
});

/* ==========================================================================
   8. EXTERNAL REST APIS & OAUTH 2.0 SIMULATION (/api/external/* & /api/oauth/*)
   ========================================================================== */

app.get("/api/external/weather", cacheRoute(120, "weather"), async (req, res) => {
  try {
    const city = req.query.city || 'Chennai';
    const weatherData = await externalApi.getWeather(city);
    return res.status(200).json(weatherData);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch external weather data.", error: err.message });
  }
});

app.get("/api/external/repos", cacheRoute(180, "repos"), async (req, res) => {
  try {
    const topic = req.query.topic || 'web-development';
    const reposData = await externalApi.getAcademicRepos(topic);
    return res.status(200).json(reposData);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch external GitHub repository data.", error: err.message });
  }
});

app.post("/api/external/cache/clear", (req, res) => {
  const result = externalApi.clearCache();
  return res.status(200).json(result);
});

app.get("/api/oauth/authorize", (req, res) => {
  try {
    const { client_id, redirect_uri, scope, state } = req.query;
    const result = oauthService.generateAuthorizationCode({
      clientId: client_id || 'cognifyz_app_2026',
      redirectUri: redirect_uri || 'http://localhost:3000/#oauth-demo',
      scope: scope || 'read:profile read:courses',
      state: state || 'state_nonce_123'
    });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.status || 400).json({ success: false, message: err.message });
  }
});

app.post("/api/oauth/token", (req, res) => {
  try {
    const { grant_type, client_id, client_secret, code, redirect_uri, refresh_token } = req.body;
    const result = oauthService.exchangeToken({
      grantType: grant_type,
      clientId: client_id,
      clientSecret: client_secret,
      code: code,
      redirectUri: redirect_uri,
      refreshToken: refresh_token
    });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.status || 400).json({ success: false, message: err.message });
  }
});

app.get("/api/oauth/resource", (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const result = oauthService.getProtectedResource(authHeader);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.status || 401).json({ success: false, message: err.message });
  }
});

app.get("/api/rate-limit-status", (req, res) => {
  return res.status(200).json({
    success: true,
    serverTime: new Date().toISOString(),
    rateLimitingActive: true,
    policy: {
      globalLimit: "100 requests per 15 minutes",
      strictLimit: "15 requests per 15 minutes",
      windowMs: 15 * 60 * 1000
    },
    clientIp: req.ip || req.socket.remoteAddress
  });
});

/* ==========================================================================
   9. CENTRALIZED ERROR HANDLING
   ========================================================================== */

app.all("/api/*", (req, res) => {
  return res.status(404).json({
    success: false,
    error: "API Endpoint Not Found",
    message: `The API endpoint '${req.method} ${req.originalUrl}' does not exist on this server.`
  });
});

app.use((err, req, res, next) => {
  console.error("Unhandled Error Caught:", err);
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ success: false, message: "Invalid JSON body payload received in request." });
  }
  return res.status(500).json({
    success: false,
    error: "Internal Server Error",
    message: err.message || "An unexpected error occurred on the server."
  });
});

/* ==========================================================================
   10. PAGE ROUTES & SERVING VIEWS
   ========================================================================== */

app.get("/", (req, res) => {
  res.render("index", { error: null, successMessage: null, contactSuccess: null, formData: {} });
});

app.post("/submit", async (req, res) => {
  const { name, email, phone, age, course } = req.body;
  if (!name || !email || !age || !course || name.trim() === "" || email.trim() === "") {
    return res.status(400).render("index", {
      error: "All registration fields are required.",
      successMessage: null,
      contactSuccess: null,
      formData: { name, email, phone, age, course }
    });
  }

  const record = await DatabaseService.createRegistration({ name, email, phone: phone || '9876543210', age, course }, "anonymous");
  res.render("result", { name: record.name, email: record.email, age: record.age.toString(), course: record.course });
});

app.post("/contact", (req, res) => {
  const { contactName, contactEmail, subject } = req.body;
  res.render("index", {
    error: null,
    successMessage: null,
    contactSuccess: `Thank you, ${contactName || 'Student'}! Your inquiry regarding "${subject || 'General Admission'}" has been received.`,
    formData: {}
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Task 8 Advanced Server (Middleware + Jobs + Cache) running on http://localhost:${PORT}`);
});
