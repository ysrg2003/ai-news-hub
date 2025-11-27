import fs from "fs/promises";
import path from "path";
import { runFullPipeline, PipelineResult } from "./fourPromptPipeline";

/**
 * Advanced Job Queue Manager
 * Handles content generation jobs with exponential backoff retry logic
 * Respects Gemini API free tier constraints (15 RPM)
 */

export interface JobQueueEntry {
  id: string;
  category: string;
  articleType: "trending" | "evergreen";
  status: "pending" | "processing" | "completed" | "failed";
  retries: number;
  maxRetries: number;
  createdAt: string;
  updatedAt: string;
  error?: string;
  result?: PipelineResult;
}

const DATA_DIR = path.join(process.cwd(), "data");
const JOBS_FILE = path.join(DATA_DIR, "job-queue.json");
const FAILED_JOBS_FILE = path.join(DATA_DIR, "failed-jobs.json");
const COMPLETED_JOBS_FILE = path.join(DATA_DIR, "completed-jobs.json");

const MAX_RETRIES = 3;
const INITIAL_BACKOFF = 5000; // 5 seconds
const MAX_BACKOFF = 300000; // 5 minutes

// ============================================================================
// INITIALIZATION
// ============================================================================

async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error("Failed to create data directory:", error);
  }
}

async function ensureJobsFile(): Promise<void> {
  try {
    await fs.access(JOBS_FILE);
  } catch {
    await fs.writeFile(JOBS_FILE, JSON.stringify([], null, 2));
  }
}

// ============================================================================
// JOB MANAGEMENT
// ============================================================================

export async function createJob(
  category: string,
  articleType: "trending" | "evergreen"
): Promise<JobQueueEntry> {
  await ensureDataDir();
  await ensureJobsFile();

  const job: JobQueueEntry = {
    id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    category,
    articleType,
    status: "pending",
    retries: 0,
    maxRetries: MAX_RETRIES,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const content = await fs.readFile(JOBS_FILE, "utf-8");
    const jobs = JSON.parse(content);
    jobs.push(job);
    await fs.writeFile(JOBS_FILE, JSON.stringify(jobs, null, 2));
    console.log(`[${new Date().toISOString()}] Job created: ${job.id}`);
  } catch (error) {
    console.error("Failed to create job:", error);
    throw error;
  }

  return job;
}

export async function getJob(jobId: string): Promise<JobQueueEntry | null> {
  try {
    const content = await fs.readFile(JOBS_FILE, "utf-8");
    const jobs = JSON.parse(content);
    return jobs.find((j: JobQueueEntry) => j.id === jobId) || null;
  } catch (error) {
    console.error("Failed to get job:", error);
    return null;
  }
}

export async function getPendingJobs(): Promise<JobQueueEntry[]> {
  try {
    const content = await fs.readFile(JOBS_FILE, "utf-8");
    const jobs = JSON.parse(content);
    return jobs.filter((j: JobQueueEntry) => j.status === "pending");
  } catch (error) {
    console.error("Failed to get pending jobs:", error);
    return [];
  }
}

// ============================================================================
// RETRY LOGIC WITH EXPONENTIAL BACKOFF
// ============================================================================

function calculateBackoff(retryCount: number): number {
  const backoff = INITIAL_BACKOFF * Math.pow(2, retryCount);
  return Math.min(backoff, MAX_BACKOFF);
}

async function updateJobStatus(
  jobId: string,
  status: JobQueueEntry["status"],
  result?: PipelineResult,
  error?: string
): Promise<void> {
  try {
    const content = await fs.readFile(JOBS_FILE, "utf-8");
    const jobs = JSON.parse(content);

    const jobIndex = jobs.findIndex((j: JobQueueEntry) => j.id === jobId);
    if (jobIndex === -1) return;

    jobs[jobIndex].status = status;
    jobs[jobIndex].updatedAt = new Date().toISOString();

    if (result) {
      jobs[jobIndex].result = result;
    }

    if (error) {
      jobs[jobIndex].error = error;
    }

    await fs.writeFile(JOBS_FILE, JSON.stringify(jobs, null, 2));
  } catch (error) {
    console.error("Failed to update job status:", error);
  }
}

async function moveJobToFailed(job: JobQueueEntry): Promise<void> {
  try {
    // Remove from main queue
    let content = await fs.readFile(JOBS_FILE, "utf-8");
    let jobs = JSON.parse(content);
    jobs = jobs.filter((j: JobQueueEntry) => j.id !== job.id);
    await fs.writeFile(JOBS_FILE, JSON.stringify(jobs, null, 2));

    // Add to failed jobs
    try {
      content = await fs.readFile(FAILED_JOBS_FILE, "utf-8");
      jobs = JSON.parse(content);
    } catch {
      jobs = [];
    }

    jobs.push(job);
    await fs.writeFile(FAILED_JOBS_FILE, JSON.stringify(jobs, null, 2));

    console.log(`[${new Date().toISOString()}] Job moved to failed: ${job.id}`);
  } catch (error) {
    console.error("Failed to move job to failed:", error);
  }
}

async function moveJobToCompleted(job: JobQueueEntry): Promise<void> {
  try {
    // Remove from main queue
    let content = await fs.readFile(JOBS_FILE, "utf-8");
    let jobs = JSON.parse(content);
    jobs = jobs.filter((j: JobQueueEntry) => j.id !== job.id);
    await fs.writeFile(JOBS_FILE, JSON.stringify(jobs, null, 2));

    // Add to completed jobs
    try {
      content = await fs.readFile(COMPLETED_JOBS_FILE, "utf-8");
      jobs = JSON.parse(content);
    } catch {
      jobs = [];
    }

    jobs.push(job);
    await fs.writeFile(COMPLETED_JOBS_FILE, JSON.stringify(jobs, null, 2));

    console.log(`[${new Date().toISOString()}] Job moved to completed: ${job.id}`);
  } catch (error) {
    console.error("Failed to move job to completed:", error);
  }
}

// ============================================================================
// JOB PROCESSING
// ============================================================================

export async function processJob(job: JobQueueEntry): Promise<void> {
  console.log(`[${new Date().toISOString()}] Processing job: ${job.id}`);

  try {
    // Update status to processing
    await updateJobStatus(job.id, "processing");

    // Run the 4-prompt pipeline
    const result = await runFullPipeline(job.category, job.articleType);

    if (result.success) {
      // Job completed successfully
      job.status = "completed";
      job.result = result;
      await updateJobStatus(job.id, "completed", result);
      await moveJobToCompleted(job);
      console.log(`[${new Date().toISOString()}] Job completed successfully: ${job.id}`);
    } else {
      // Job failed, check if we should retry
      if (job.retries < job.maxRetries) {
        job.retries += 1;
        job.status = "pending";
        job.error = result.error;

        const backoff = calculateBackoff(job.retries);
        console.log(
          `[${new Date().toISOString()}] Job failed, scheduling retry ${job.retries}/${job.maxRetries} after ${backoff}ms`
        );

        // Schedule retry
        setTimeout(() => {
          processJob(job).catch((error) => {
            console.error(`Failed to retry job ${job.id}:`, error);
          });
        }, backoff);

        await updateJobStatus(job.id, "pending", undefined, result.error);
      } else {
        // Max retries exceeded
        job.status = "failed";
        job.error = `Max retries exceeded. Last error: ${result.error}`;
        await updateJobStatus(job.id, "failed", result, job.error);
        await moveJobToFailed(job);
        console.error(`[${new Date().toISOString()}] Job failed after ${job.maxRetries} retries: ${job.id}`);
      }
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Unexpected error processing job ${job.id}:`, error);

    if (job.retries < job.maxRetries) {
      job.retries += 1;
      const backoff = calculateBackoff(job.retries);
      console.log(
        `[${new Date().toISOString()}] Scheduling retry ${job.retries}/${job.maxRetries} after ${backoff}ms`
      );

      setTimeout(() => {
        processJob(job).catch((err) => {
          console.error(`Failed to retry job ${job.id}:`, err);
        });
      }, backoff);

      await updateJobStatus(job.id, "pending", undefined, error instanceof Error ? error.message : "Unknown error");
    } else {
      job.status = "failed";
      job.error = error instanceof Error ? error.message : "Unknown error";
      await updateJobStatus(job.id, "failed", undefined, job.error);
      await moveJobToFailed(job);
    }
  }
}

// ============================================================================
// BATCH PROCESSING
// ============================================================================

export async function processPendingJobs(maxConcurrent: number = 1): Promise<void> {
  console.log(`[${new Date().toISOString()}] Processing pending jobs (max concurrent: ${maxConcurrent})`);

  const pendingJobs = await getPendingJobs();
  console.log(`[${new Date().toISOString()}] Found ${pendingJobs.length} pending jobs`);

  // Process jobs with concurrency limit
  for (let i = 0; i < pendingJobs.length; i += maxConcurrent) {
    const batch = pendingJobs.slice(i, i + maxConcurrent);
    await Promise.all(batch.map((job) => processJob(job)));

    // Add delay between batches to respect rate limits
    if (i + maxConcurrent < pendingJobs.length) {
      console.log(`[${new Date().toISOString()}] Waiting before next batch...`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  console.log(`[${new Date().toISOString()}] Batch processing completed`);
}

// ============================================================================
// STATISTICS
// ============================================================================

export async function getQueueStats(): Promise<{
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  totalJobs: number;
}> {
  try {
    let jobs: JobQueueEntry[] = [];

    try {
      const content = await fs.readFile(JOBS_FILE, "utf-8");
      jobs = JSON.parse(content);
    } catch {
      jobs = [];
    }

    const pending = jobs.filter((j) => j.status === "pending").length;
    const processing = jobs.filter((j) => j.status === "processing").length;
    const completed = jobs.filter((j) => j.status === "completed").length;
    const failed = jobs.filter((j) => j.status === "failed").length;

    return {
      pending,
      processing,
      completed,
      failed,
      totalJobs: jobs.length,
    };
  } catch (error) {
    console.error("Failed to get queue stats:", error);
    return { pending: 0, processing: 0, completed: 0, failed: 0, totalJobs: 0 };
  }
}
