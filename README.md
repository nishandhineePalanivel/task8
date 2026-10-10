# Cognifyz Web Development Internship — Level 3, Task 8
## Title: Advanced Server-Side Where Data Meets Intelligence

### 📌 Overview
Task 8 focuses on production-grade server-side architecture. It incorporates:
1. **Enterprise Request Processing Middleware Pipeline**: High-resolution audit logging (`process.hrtime()`), unique `X-Request-Id` correlation tracking, HTTP security hardening headers, and robust body parsing.
2. **Asynchronous Background Task & Job Queue Engine**: Modeled after Redis/Bull queue architectures to process heavy background workloads (verification, reports, predictive intelligence, and backups) asynchronously with worker concurrency control, retry policies, and live progress reporting.
3. **High-Performance Server-Side Caching**: Multi-tier in-memory cache delivering sub-millisecond responses (`X-Cache: HIT`, `< 1ms`), hit ratio tracking, and automated cache invalidation on write mutations.

---

### 🚀 Key Features Implemented

#### 1. Request Processing Middleware Pipeline
- **Request ID Tracking (`middleware/requestId.js`)**:
  - Automatically generates an `X-Request-Id` UUID for each incoming request and sets it in response headers for distributed request tracing.
- **Structured Audit Logger (`middleware/logger.js`)**:
  - Measures request lifecycle duration using high-precision `process.hrtime()`.
  - Automatically masks sensitive payload properties (`password`, `token`, `secret`).
  - Maintains an in-memory ring buffer of recent requests viewable via `GET /api/logs`.
- **Security Hardening (`middleware/security.js`)**:
  - Enforces `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and XSS filtering.

#### 2. Asynchronous Background Task Queue (`services/jobQueue.js`)
- **Queue & Worker Architecture**:
  - Independent worker processor running up to 2 concurrent tasks without blocking Express event loop threads.
  - Lifecycle state machine: `pending` &rarr; `processing` &rarr; `completed` / `failed`.
  - Automatic exponential backoff retries (up to 2 retries per task).
- **Supported Asynchronous Jobs**:
  1. `APPLICATION_VERIFICATION`: Automated academic credentials validation and GPA eligibility scoring.
  2. `REPORT_GENERATION`: Asynchronous PDF admissions bundle and batch summary report compilation.
  3. `DATA_INTELLIGENCE`: Predictive machine learning model forecasting branch preferences and admission capacity trends.
  4. `DATABASE_BACKUP`: Asynchronous JSON database snapshot creation with SHA-256 data integrity checksum.
- **REST Endpoints**:
  - `POST /api/jobs/enqueue`: Enqueues task with priority (`high`, `normal`).
  - `GET /api/jobs`: Lists all active/recent jobs and worker statistics.
  - `GET /api/jobs/:id`: Detailed status, progress percentage, logs, and result payload.
  - `POST /api/jobs/clear`: Flushes finished tasks.

#### 3. Server-Side Caching & Invalidation (`services/cacheService.js` & `middleware/cache.js`)
- **Route-Level Caching (`cacheRoute(ttlSeconds, prefix)`)**:
  - Intercepts read endpoints (e.g., `GET /api/registrations`, `GET /api/external/weather`).
  - Delivers cached responses in `< 1ms` with header `X-Cache: HIT`.
- **Automated Cache Invalidation (`invalidateCache(prefix)`)**:
  - Automatically purges cache keys on database write operations (`POST`, `PUT`, `DELETE` on `/api/registrations`), guaranteeing immediate data consistency.
- **Cache Management API**:
  - `GET /api/cache/stats`: Total hits, misses, hit ratio %, memory estimate.
  - `GET /api/cache/keys`: List of active keys with remaining TTL countdown.
  - `DELETE /api/cache`: Flushes entire cache.
  - `DELETE /api/cache/:key`: Evicts specific cache key.

#### 4. Preservation of Previous Tasks (Tasks 4, 5, 6, & 7)
- **Task 4**: Dynamic DOM manipulation, complex form validation (Indian mobile regex, password strength meter, requirements checklist, live preview).
- **Task 5**: Full RESTful CRUD operations (`GET`, `POST`, `PUT`, `DELETE`) with responsive management dashboard.
- **Task 6**: Server user authentication with `bcryptjs` password hashing, `jsonwebtoken` (JWT) authorization headers, persistent JSON database storage (`data/db.json`), SPA routing, and custom 404 page.
- **Task 7**: Live external REST API integrations (Open-Meteo Weather API & GitHub Repositories API), OAuth 2.0 Authorization Code Grant Flow simulation, and rate limiting protection.

---

### 📂 File Structure
```
TASK-8/
├── data/
│   └── db.json                 # Persistent database storage
├── middleware/
│   ├── auth.js                 # JWT Authorization middleware
│   ├── cache.js                # Route caching & mutation invalidation
│   ├── logger.js               # Structured audit request logger
│   ├── rateLimiter.js          # Express rate limiting middleware
│   ├── requestId.js            # X-Request-Id correlation tracking
│   └── security.js             # Security hardening headers
├── public/
│   ├── js/
│   │   └── script.js           # Client JS (SPA router, Queue polling, Cache UI)
│   └── style.css               # Modern Bootstrap 5 styles
├── services/
│   ├── cacheService.js         # In-memory caching engine with TTL & telemetry
│   ├── db.js                   # Persistent JSON database engine
│   ├── externalApi.js          # Resilient external REST API client
│   ├── jobQueue.js             # Asynchronous background task queue & workers
│   └── oauthService.js         # OAuth 2.0 Code Grant Service
├── views/
│   ├── index.ejs               # Single Page Application view with Queue & Cache UI
│   └── result.ejs              # Legacy server render view
├── package.json                # Project dependencies
├── README.md                   # Task 8 documentation
└── server.js                   # Express application server
```

---

### 💻 How to Run & Verify

1. **Start the Server**:
   ```bash
   node server.js
   ```

2. **Access the Portal**:
   Open [http://localhost:3000](http://localhost:3000)

3. **Verify Task 8 Features**:
   - **Background Task Queue (`#jobs`)**:
     - Click any action (e.g. *Application Verification*, *PDF Report Generation*).
     - Watch live animated progress bars update in real time from `0%` to `100%`.
     - Click **View** to inspect execution output payloads and lifecycle logs.
   - **Server Cache & Audit Logs (`#server-cache`)**:
     - Observe live Hit Ratio % and active cache keys with TTL countdowns.
     - Inspect recent requests in the Structured Audit Logger with duration in milliseconds (`process.hrtime()`), Request ID (`X-Request-Id`), and `X-Cache` hit status.
