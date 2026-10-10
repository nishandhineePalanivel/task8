/**
 * Cognifyz Web Development Internship - Level 3, Task 8
 * Asynchronous Background Task & Job Queue Processing Engine
 * Mimics Redis / Bull Queue architecture with concurrency control, progress reporting, retries, and job lifecycle.
 */

const crypto = require('crypto');

class JobQueue {
  constructor(concurrency = 2) {
    this.concurrency = concurrency;
    this.activeWorkers = 0;
    this.jobs = new Map(); // jobId => Job object
    this.queue = []; // Array of jobIds awaiting processing
    this.stats = {
      totalEnqueued: 0,
      totalCompleted: 0,
      totalFailed: 0
    };
  }

  /**
   * Enqueue a new background task
   */
  enqueue(type, payload = {}, priority = 'normal') {
    const jobId = 'job_' + crypto.randomBytes(8).toString('hex');
    const job = {
      id: jobId,
      type: type,
      payload: payload,
      priority: priority,
      status: 'pending', // pending, processing, completed, failed
      progress: 0,
      result: null,
      error: null,
      retryCount: 0,
      maxRetries: 2,
      createdAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null,
      logs: [`[${new Date().toLocaleTimeString()}] Job enqueued with priority: ${priority}`]
    };

    this.jobs.set(jobId, job);
    this.stats.totalEnqueued++;

    if (priority === 'high') {
      this.queue.unshift(jobId);
    } else {
      this.queue.push(jobId);
    }

    // Trigger worker processing loop
    this.processNext();

    return job;
  }

  /**
   * Process next job in the queue
   */
  async processNext() {
    if (this.activeWorkers >= this.concurrency || this.queue.length === 0) {
      return;
    }

    const jobId = this.queue.shift();
    const job = this.jobs.get(jobId);
    if (!job || job.status !== 'pending') {
      return;
    }

    this.activeWorkers++;
    job.status = 'processing';
    job.startedAt = new Date().toISOString();
    job.logs.push(`[${new Date().toLocaleTimeString()}] Worker started processing task`);

    try {
      const result = await this.executeJobTask(job);
      job.status = 'completed';
      job.progress = 100;
      job.result = result;
      job.completedAt = new Date().toISOString();
      job.logs.push(`[${new Date().toLocaleTimeString()}] Task successfully finished`);
      this.stats.totalCompleted++;
    } catch (err) {
      if (job.retryCount < job.maxRetries) {
        job.retryCount++;
        job.status = 'pending';
        job.progress = 0;
        job.logs.push(`[${new Date().toLocaleTimeString()}] Error: ${err.message}. Retrying (${job.retryCount}/${job.maxRetries})...`);
        this.queue.push(jobId);
      } else {
        job.status = 'failed';
        job.error = err.message;
        job.completedAt = new Date().toISOString();
        job.logs.push(`[${new Date().toLocaleTimeString()}] Task failed permanently: ${err.message}`);
        this.stats.totalFailed++;
      }
    } finally {
      this.activeWorkers--;
      // Continue queue loop
      setImmediate(() => this.processNext());
    }
  }

  /**
   * Simulate realistic asynchronous processing with staged progress updates
   */
  async executeJobTask(job) {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    switch (job.type) {
      case 'APPLICATION_VERIFICATION': {
        job.progress = 25;
        job.logs.push(`[${new Date().toLocaleTimeString()}] Validating academic credentials & eligibility criteria`);
        await sleep(900);

        job.progress = 60;
        job.logs.push(`[${new Date().toLocaleTimeString()}] Performing automated document verification & GPA scoring`);
        await sleep(1000);

        job.progress = 85;
        job.logs.push(`[${new Date().toLocaleTimeString()}] Calculating admission qualification index`);
        await sleep(800);

        return {
          verified: true,
          verificationScore: "94.5 / 100",
          studentName: job.payload.name || "Student Applicant",
          qualificationStatus: "Eligible - Priority Admission Granted",
          processedBy: "Autonomous Verification Worker #1"
        };
      }

      case 'REPORT_GENERATION': {
        job.progress = 20;
        job.logs.push(`[${new Date().toLocaleTimeString()}] Gathering student registration dataset`);
        await sleep(800);

        job.progress = 55;
        job.logs.push(`[${new Date().toLocaleTimeString()}] Compiling statistical breakdown and chart metrics`);
        await sleep(1100);

        job.progress = 90;
        job.logs.push(`[${new Date().toLocaleTimeString()}] Generating PDF document binary stream`);
        await sleep(900);

        return {
          reportTitle: "2026 Academic Admissions Intelligence Summary",
          reportId: "REP-" + Math.floor(100000 + Math.random() * 900000),
          fileFormat: "PDF",
          fileSize: "2.4 MB",
          generatedRecordsCount: job.payload.recordCount || 24,
          downloadUrl: "#dashboard"
        };
      }

      case 'DATA_INTELLIGENCE': {
        job.progress = 30;
        job.logs.push(`[${new Date().toLocaleTimeString()}] Ingesting student admission logs and registration metrics`);
        await sleep(1000);

        job.progress = 70;
        job.logs.push(`[${new Date().toLocaleTimeString()}] Training branch preference prediction algorithm`);
        await sleep(1200);

        return {
          analyticsModel: "Predictive Academic Admissions v8.0",
          topEnrolledBranch: "B.E. Computer Science and Engineering",
          conversionRate: "78.4%",
          recommendedCapacityIncrease: "Electronics & Communication (+15%)",
          dataPointsAnalyzed: 1540
        };
      }

      case 'DATABASE_BACKUP': {
        job.progress = 40;
        job.logs.push(`[${new Date().toLocaleTimeString()}] Locking read state & exporting database snapshot`);
        await sleep(900);

        job.progress = 80;
        job.logs.push(`[${new Date().toLocaleTimeString()}] Verifying SHA-256 data integrity checksum`);
        await sleep(1000);

        return {
          snapshotId: "SNAP-" + Date.now(),
          targetFile: "data/db.json",
          backupChecksum: "sha256:7f9a8b1c2d3e4f5a6b7c8d9e0f",
          status: "Integrity Verified - Snapshot Preserved",
          backupSize: "128 KB"
        };
      }

      default: {
        job.progress = 50;
        await sleep(1000);
        return { message: "Generic task executed successfully", payload: job.payload };
      }
    }
  }

  /**
   * Get list of all jobs
   */
  getAllJobs() {
    return Array.from(this.jobs.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  /**
   * Get specific job by ID
   */
  getJobById(id) {
    return this.jobs.get(id) || null;
  }

  /**
   * Cancel or remove job
   */
  cancelJob(id) {
    const job = this.jobs.get(id);
    if (!job) return false;

    if (job.status === 'pending') {
      const idx = this.queue.indexOf(id);
      if (idx !== -1) this.queue.splice(idx, 1);
      job.status = 'failed';
      job.error = 'Cancelled by user';
      job.completedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  /**
   * Clear completed and failed jobs
   */
  clearCompletedJobs() {
    for (const [id, job] of this.jobs.entries()) {
      if (job.status === 'completed' || job.status === 'failed') {
        this.jobs.delete(id);
      }
    }
    return { success: true, message: "Completed and failed jobs cleared from queue." };
  }

  /**
   * Telemetry stats
   */
  getStats() {
    const all = Array.from(this.jobs.values());
    return {
      activeWorkers: this.activeWorkers,
      concurrencyLimit: this.concurrency,
      queueLength: this.queue.length,
      counts: {
        total: all.length,
        pending: all.filter(j => j.status === 'pending').length,
        processing: all.filter(j => j.status === 'processing').length,
        completed: all.filter(j => j.status === 'completed').length,
        failed: all.filter(j => j.status === 'failed').length
      },
      lifetimeStats: this.stats
    };
  }
}

// Singleton Queue Instance
const jobQueueInstance = new JobQueue(2);

module.exports = jobQueueInstance;
