import { getDb } from "./db";
import { eq } from "drizzle-orm";
import { jobQueue, InsertJobQueueItem } from "../drizzle/schema";

export type JobStatus = "pending" | "processing" | "completed" | "failed";

export interface JobPayload {
  type: "generate_article" | "generate_image" | "archive_articles";
  data: Record<string, any>;
}

// Helper to generate unique job ID
function generateJobId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Process a single job from the queue
 */
export async function processJob(jobId: string): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return false;
  }

  try {
    // Get the job
    const jobs = await db.select().from(jobQueue).where(eq(jobQueue.jobId, jobId)).limit(1);
    if (jobs.length === 0) {
      console.error(`Job ${jobId} not found`);
      return false;
    }

    const job = jobs[0];

    // Update job status to processing
    await db
      .update(jobQueue)
      .set({ status: "processing", lastAttempted: new Date(), updatedAt: new Date() })
      .where(eq(jobQueue.jobId, jobId));

    // Get category ID and article type
    const categoryId = job.categoryId;
    const articleType = job.articleType;

    // Process article generation
    const intermediateData = job.intermediateData ? JSON.parse(job.intermediateData) : {};
    let success = false;
    
    try {
      success = await processGenerateArticle({
        categoryId,
        articleType,
        ...intermediateData,
      });
    } catch (error) {
      console.error(`Error processing article generation job:`, error);
      success = false;
    }

    if (success) {
      // Mark job as completed
      await db
        .update(jobQueue)
        .set({ status: "completed", updatedAt: new Date() })
        .where(eq(jobQueue.jobId, jobId));
      return true;
    } else {
      // Increment retry count
      const newAttempts = (job.attempts || 0) + 1;
      const maxRetries = 3;

      if (newAttempts >= maxRetries) {
        // Mark as failed if max retries exceeded
        await db
          .update(jobQueue)
          .set({
            status: "failed",
            attempts: newAttempts,
            updatedAt: new Date(),
          })
          .where(eq(jobQueue.jobId, jobId));
        console.error(`Job ${jobId} failed after ${maxRetries} retries`);
      } else {
        // Reschedule job
        await db
          .update(jobQueue)
          .set({
            status: "pending",
            attempts: newAttempts,
            updatedAt: new Date(),
          })
          .where(eq(jobQueue.jobId, jobId));
        console.log(`Job ${jobId} rescheduled (attempt ${newAttempts})`);
      }
      return false;
    }
  } catch (error) {
    console.error(`Error processing job ${jobId}:`, error);

    // Update job status to failed
    try {
      const db = await getDb();
      if (db) {
        await db
          .update(jobQueue)
          .set({
            status: "failed",
            updatedAt: new Date(),
          })
          .where(eq(jobQueue.jobId, jobId));
      }
    } catch (updateError) {
      console.error("Failed to update job status:", updateError);
    }

    return false;
  }
}

/**
 * Process article generation job
 */
async function processGenerateArticle(data: Record<string, any>): Promise<boolean> {
  try {
    // TODO: Implement article generation logic
    console.log("Processing article generation:", data);
    return true;
  } catch (error) {
    console.error("Error generating article:", error);
    return false;
  }
}

/**
 * Process image generation job
 */
async function processGenerateImage(data: Record<string, any>): Promise<boolean> {
  try {
    // TODO: Implement image generation logic
    console.log("Processing image generation:", data);
    return true;
  } catch (error) {
    console.error("Error generating image:", error);
    return false;
  }
}

/**
 * Process article archiving job
 */
async function processArchiveArticles(data: Record<string, any>): Promise<boolean> {
  try {
    // TODO: Implement article archiving logic
    console.log("Processing article archiving:", data);
    return true;
  } catch (error) {
    console.error("Error archiving articles:", error);
    return false;
  }
}

/**
 * Process all pending jobs
 */
export async function processPendingJobs(): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return;
  }

  try {
    // Get all pending jobs
    const pendingJobs = await db
      .select()
      .from(jobQueue)
      .where(eq(jobQueue.status, "pending"));

    console.log(`Found ${pendingJobs.length} jobs to process`);

    for (const job of pendingJobs) {
      // Add rate limiting (1-2 seconds between jobs)
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));
      await processJob(job.jobId);
    }
  } catch (error) {
    console.error("Error processing pending jobs:", error);
  }
}

/**
 * Schedule a new job
 */
export async function scheduleJob(
  categoryId: number,
  articleType: "trending" | "evergreen",
  data?: Record<string, any>
): Promise<string | null> {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return null;
  }

  try {
    const jobId = generateJobId();
    const intermediateData = data ? JSON.stringify(data) : null;

    const jobData: InsertJobQueueItem = {
      jobId,
      categoryId,
      articleType,
      status: "pending",
      attempts: 0,
      intermediateData,
    };

    await db.insert(jobQueue).values(jobData);
    return jobId;
  } catch (error) {
    console.error("Error scheduling job:", error);
    return null;
  }
}
